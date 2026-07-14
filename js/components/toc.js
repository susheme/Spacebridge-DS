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
    description: sbT(
      'Side navigation across the sections of a page. The list mirrors the section anchors; the active item is highlighted as its section enters the viewport. The ToC sticks near the top while scrolling and hides itself on pages with no scroll. In this design system it is built into every page with three or more sections.',
      'Боковая навигация по разделам страницы. Список повторяет якоря секций; активный пункт подсвечивается, когда его секция попадает во viewport. ToC прилипает у верхнего края при скролле и сам скрывается на страницах без скролла. В этой дизайн-системе встроен во все страницы с тремя и более секциями.'
    ),
    sections: [
      {
        title: sbT('Anatomy', 'Анатомия'),
        desc: sbT(
          'A nav list with a left border; the active item is emphasized and marked with a primary-colored stripe over the border.',
          'Список-nav с левой границей; активный пункт выделен и помечен полоской primary-цвета поверх границы.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Container:</b>'
          + '<ul><li><code>&lt;nav class="sb-toc"&gt;</code>;</li><li>Border-left: 1.5px --border.</li></ul>'
          + '<b>Items:</b>'
          + '<ul><li><code>.sb-toc-item</code>;</li><li>Active: gets <code>.is-active</code> — bold, --text-tertiary, plus a 1.5px --primary stripe over the parent border-left.</li></ul>',
          '<b>Контейнер:</b>'
          + '<ul><li><code>&lt;nav class="sb-toc"&gt;</code>;</li><li>Border-left: 1.5px --border.</li></ul>'
          + '<b>Пункты:</b>'
          + '<ul><li><code>.sb-toc-item</code>;</li><li>Активный: получает <code>.is-active</code> — bold, --text-tertiary и полоска 1.5px --primary поверх родительского border-left.</li></ul>'
        )),
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
        title: sbT('Active state tracking', 'Трекинг активного состояния'),
        desc: sbT(
          'While the page scrolls, the active item follows the section closest to the top of the viewport.',
          'При скролле активный пункт следует за секцией, ближайшей к верху viewport.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Behavior:</b>'
          + '<ul><li>An <code>IntersectionObserver</code> watches the sections with <code>rootMargin: -32px 0px -70% 0px</code>;</li><li>A section becomes active as soon as its start crosses the top 30% of the area.</li></ul>',
          '<b>Поведение:</b>'
          + '<ul><li><code>IntersectionObserver</code> следит за секциями с <code>rootMargin: -32px 0px -70% 0px</code>;</li><li>Секция становится активной, как только её начало пересекает верхние 30% области.</li></ul>'
        )),
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
        title: sbT('Sticky behavior + Push-off', 'Sticky-поведение + Push-off'),
        desc: sbT(
          'The ToC sticks 32px from the top of the scroll container and travels with the page until the page itself ends — then the container pushes it off.',
          'ToC прилипает в 32px от верха скролл-контейнера и едет со страницей, пока сама страница не закончится — дальше контейнер уводит его за собой.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Behavior:</b>'
          + '<ul><li>The aside wrapper <code>.page-toc</code> has <code>position: sticky; top: 32px</code>;</li><li>It stacks at the top of the scroll container (.content) until the bottom edge of <code>.page-shell</code> reaches the top of the viewport — then sticky yields and the ToC leaves with its container.</li></ul>',
          '<b>Поведение:</b>'
          + '<ul><li>Aside-обёртка <code>.page-toc</code> имеет <code>position: sticky; top: 32px</code>;</li><li>Стэкуется в верхней части скролл-контейнера (.content), пока нижний край <code>.page-shell</code> не достигнет верха viewport — тогда sticky теряет силу и ToC уходит вместе с контейнером.</li></ul>'
        )),
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
        title: sbT('Auto-visibility', 'Авто-видимость'),
        desc: sbT(
          'On short pages with no scroll the ToC hides itself.',
          'На коротких страницах без скролла ToC скрывается сам.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Behavior:</b>'
          + '<ul><li>A <code>ResizeObserver</code> on <code>.content</code> and <code>.page</code> recalculates on window resize, on code panel expansion and on page change;</li><li>Trigger: <code>scrollHeight &gt; clientHeight</code>.</li></ul>',
          '<b>Поведение:</b>'
          + '<ul><li><code>ResizeObserver</code> на <code>.content</code> и <code>.page</code> пересчитывает при ресайзе окна, раскрытии code-панелей и смене страницы;</li><li>Триггер: <code>scrollHeight &gt; clientHeight</code>.</li></ul>'
        )),
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
