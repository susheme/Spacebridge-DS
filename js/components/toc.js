// ═══════════════════════════════════════════════════════════════════════════
//  TOC — Sticky Table of Contents (Sticky In-Page Navigation)
//  CSS в css/components/toc.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.toc = `.sb-toc { display: flex; flex-direction: column; list-style: none; margin: 0; padding: 0 0 0 var(--pad-horiz-16); border-left: var(--border-width-1-5) solid var(--border); }
.sb-toc-item { display: block; position: relative; padding: var(--pad-vert-4) 0; color: var(--text-secondary); font-size: var(--body-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); text-decoration: none; cursor: pointer; transition: color 0.15s; }
.sb-toc-item:hover { color: var(--text-tertiary); }
.sb-toc-item.is-active { color: var(--text-tertiary); font-weight: var(--font-weight-bold); }
.sb-toc-item.is-active::before { content: ''; position: absolute; left: calc(-1 * var(--pad-horiz-16) - var(--border-width-1-5)); top: 0; bottom: 0; width: var(--border-width-1-5); background: var(--primary); }`;

// --- TOC ---
(() => {
  function mkToc(items) {
    if (!items || items.length === 0) return '';
    const links = items.map(it => `
    <a class="sb-toc-item" href="#${it.id}" data-toc-target="${it.id}">${it.label}</a>`).join('');
    return `<nav class="sb-toc">${links}
</nav>`;
  }

  // Helper для core.js — публикуем глобально.
  window.sbMkToc = mkToc;

  // Демо-данные для секций — без реальной active-логики (она работает
  // только когда TOC встроен в .page-shell с .comp-section-якорями).
  const DEMO_ITEMS = [
    { id: 'demo-anatomy',  label: 'Anatomy' },
    { id: 'demo-active',   label: 'Active state' },
    { id: 'demo-sticky',   label: 'Sticky behavior' },
    { id: 'demo-hover',    label: 'Hover state' },
  ];
  const DEMO_ITEMS_ACTIVE = DEMO_ITEMS.map((it, i) =>
    i === 1 ? { ...it } : it
  );
  // Хелпер для предпросмотра с подкрашенным активным пунктом.
  function mkDemoToc(activeIdx = 1) {
    const links = DEMO_ITEMS.map((it, i) =>
      `<a class="sb-toc-item${i === activeIdx ? ' is-active' : ''}" href="javascript:void(0)" onclick="event.preventDefault()">${it.label}</a>`
    ).join('\n  ');
    return `<nav class="sb-toc" style="min-width:200px">\n  ${links}\n</nav>`;
  }

  sbRegister({
    name: 'toc',
    title: 'Sticky Table of Contents',
    description: 'Боковая навигация по разделам страницы. Список пунктов соответствует <code>.comp-section</code>-якорям. Активный пункт подсвечивается при попадании секции в viewport (IntersectionObserver). Sticky: прилипает на 32px от верха, физический push-off на нижнем крае parent-контейнера. Авто-показ только при наличии скролла на странице (ResizeObserver). В Spacebridge DS встроен в `.page-shell` для всех страниц с 3+ секциями.',
    sections: [
      {
        title: 'Anatomy',
        desc: 'Состоит из <code>&lt;nav class="sb-toc"&gt;</code> с border-left = 1.5px --border, и пунктов <code>.sb-toc-item</code>. Активный получает <code>.is-active</code> — bold + --text-tertiary + 1.5px --primary полоска поверх родительского border-left.',
        preview: `<div style="padding:24px">${mkDemoToc(1)}</div>`,
        html: `<nav class="sb-toc">
  <a class="sb-toc-item" href="#anatomy">Anatomy</a>
  <a class="sb-toc-item is-active" href="#active">Active state</a>
  <a class="sb-toc-item" href="#sticky">Sticky behavior</a>
  <a class="sb-toc-item" href="#hover">Hover state</a>
</nav>`,
        css: COMP_CSS.toc,
      },
      {
        title: 'Active state tracking',
        desc: 'Поведение в реальной странице: при скролле <code>IntersectionObserver</code> следит за секциями. Активной становится та, чей <code>.comp-section</code> ближе всех к верху viewport\'а. Используется <code>rootMargin: \'-32px 0px -70% 0px\'</code> — секция считается активной, как только её начало пересекает верхние 30% области.',
        preview: `<div style="padding:24px;display:flex;gap:16px;align-items:flex-start">
          ${mkDemoToc(0)}
          ${mkDemoToc(2)}
        </div>`,
        html: `// в init.js renderPage() после content.innerHTML:
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      tocLinks.forEach(a => a.classList.toggle(
        'is-active', a.dataset.tocTarget === id
      ));
    }
  });
}, { root: content, rootMargin: '-32px 0px -70% 0px', threshold: 0 });
sections.forEach(s => io.observe(s));`,
        css: COMP_CSS.toc,
      },
      {
        title: 'Sticky behavior + Push-off',
        desc: 'Aside-обёртка <code>.page-toc</code> имеет <code>position: sticky; top: 32px</code>. Стэкуется в верхней части scroll-контейнера (.content) пока parent-страница не закончится. Когда нижний край <code>.page-shell</code> достигает верха viewport\'а — sticky теряет силу и TOC уходит вместе с контейнером.',
        preview: `<div style="padding:24px;color:var(--text-secondary)">
          <span class="sb-body-m">См. реальное поведение: открой любую страницу с 3+ секциями (Header L, Input, Buttons) и поскролль.</span>
        </div>`,
        html: `<aside class="page-toc">
  <nav class="sb-toc">...</nav>
</aside>

<style>
.page-toc {
  position: sticky;
  top: 32px;
  align-self: flex-start;
}
@media (max-width: 1024px) { .page-toc { display: none; } }
</style>`,
        css: COMP_CSS.toc,
      },
      {
        title: 'Auto-visibility',
        desc: 'TOC скрывается, если на странице нет скролла (короткий контент). Это ловит <code>ResizeObserver</code> на <code>.content</code> и <code>.page</code> — пересчёт при ресайзе окна, при раскрытии code-панелей, при смене страницы. Триггер: <code>scrollHeight &gt; clientHeight</code>.',
        preview: `<div style="padding:24px;color:var(--text-secondary)">
          <span class="sb-body-m">На &lt; 1024px viewport — TOC прячется через <code>display: none</code> (узкий экран).</span>
        </div>`,
        html: `const updateVis = () => {
  const hasScroll = content.scrollHeight > content.clientHeight + 1;
  toc.style.display = hasScroll ? '' : 'none';
};
const ro = new ResizeObserver(updateVis);
ro.observe(content);
ro.observe(page);
updateVis();`,
        css: COMP_CSS.toc,
      },
    ],
  });
})();
