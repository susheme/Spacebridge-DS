// ═══════════════════════════════════════════════════════════════════════════
//  BREADCRUMBS
//  CSS в css/components/breadcrumbs.css — SYNC-маркеры обязательны.
//  Типографика — копия Sticky ToC: body-m / regular / secondary→tertiary,
//  current — bold + tertiary. Separator — chevron-right (arrow-right-s-line).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.breadcrumbs = `.sb-breadcrumbs {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--gap-horiz-xs);
  list-style: none;
  margin: 0;
  padding: 0;
}
.sb-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: var(--body-font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  text-decoration: none;
  transition: color 0.15s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
a.sb-breadcrumb-item { cursor: pointer; }
a.sb-breadcrumb-item:hover { color: var(--text-tertiary); }
.sb-breadcrumb-item.is-current {
  color: var(--text-tertiary);
  font-weight: var(--font-weight-bold);
  cursor: default;
  pointer-events: none;
}
.sb-breadcrumb-sep {
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
  flex-shrink: 0;
}
.sb-breadcrumb-item .sb-icon-wrap {
  flex-shrink: 0;
  margin-right: var(--gap-horiz-xs);
}
.sb-breadcrumb-ellipsis {
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: var(--body-font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  cursor: default;
}`;

// --- BREADCRUMBS ---
(() => {
  // mkBreadcrumbs({ items, collapseAfter })
  //   items         : [{ label, href?, icon?, current? }]
  //                   Если ни у одного нет current:true — current = последний.
  //   collapseAfter : (опц.) число — макс. видимых первых+последних item'ов
  //                   перед сворачиванием середины в «…».
  //                   Например 4: показать [0] … [n-2] [n-1].
  function mkBreadcrumbs(opts) {
    const items = (opts && opts.items) || [];
    if (!items.length) return '';

    // Определяем current: явный флаг ИЛИ последний item.
    const explicitCurrentIdx = items.findIndex(it => it.current);
    const currentIdx = explicitCurrentIdx >= 0 ? explicitCurrentIdx : items.length - 1;

    // Collapse-логика: оставляем первый item, ellipsis, и хвост.
    const collapseAfter = opts && opts.collapseAfter;
    let visible = items.map((it, i) => ({ it, i }));
    let needEllipsisAt = -1; // позиция, ПОСЛЕ которой вставить «…»
    if (collapseAfter && items.length > collapseAfter) {
      // Оставляем первый + последние (collapseAfter - 1).
      const tailCount = collapseAfter - 1;
      visible = [
        { it: items[0], i: 0 },
        ...items.slice(-tailCount).map((it, k) => ({ it, i: items.length - tailCount + k })),
      ];
      needEllipsisAt = 0; // после первого item'а
    }

    function renderItem({ it, i }) {
      const isCurrent = i === currentIdx;
      const cls = 'sb-breadcrumb-item' + (isCurrent ? ' is-current' : '');
      const iconHtml = it.icon ? sbIcon(it.icon, 'S') : '';
      const labelHtml = esc(it.label || '');
      if (isCurrent) {
        return `<span class="${cls}" aria-current="page">${iconHtml}${labelHtml}</span>`;
      }
      // Item без href → статичный <span> (например, категория без landing page).
      // С href → линк <a>.
      if (!it.href) {
        return `<span class="${cls}">${iconHtml}${labelHtml}</span>`;
      }
      return `<a class="${cls}" href="${it.href}">${iconHtml}${labelHtml}</a>`;
    }

    const sep = `<span class="sb-breadcrumb-sep" aria-hidden="true">${sbIconRaw('arrow-right-s-line', 16)}</span>`;
    const ellipsis = `<span class="sb-breadcrumb-ellipsis" aria-hidden="true">…</span>`;

    const parts = [];
    visible.forEach((v, k) => {
      parts.push(renderItem(v));
      const isLast = k === visible.length - 1;
      if (!isLast) {
        parts.push(sep);
        if (k === needEllipsisAt) {
          parts.push(ellipsis);
          parts.push(sep);
        }
      }
    });

    return `<nav class="sb-breadcrumbs" aria-label="Breadcrumb">\n  ${parts.join('\n  ')}\n</nav>`;
  }

  // Публикуем глобально на случай, если другие компоненты захотят использовать.
  window.sbMkBreadcrumbs = mkBreadcrumbs;

  // ── Site-wide page breadcrumbs ──────────────────────────────────────────
  // Используется в core.js для рендера крошек в шапке каждой страницы
  // компонента. Структура: Design System › <Category> › <Component>.
  // Корень (getting-started) и компоненты без категории — без крошек.
  function buildPageBreadcrumbs(id) {
    if (!id) return '';
    // NAV и SB_REGISTRY — top-level const в core.js (доступны по имени
    // в shared global scope classic-скриптов, но НЕ на window).
    if (typeof NAV === 'undefined' || !Array.isArray(NAV)) return '';
    let category = null;
    let label = id;
    let found = false;
    for (const sec of NAV) {
      const item = (sec.items || []).find(it => it.id === id);
      if (item) { category = sec.category; label = item.label; found = true; break; }
    }
    if (!found) return ''; // id неизвестен — крошки не рисуем
    // Предпочитаем зарегистрированный title (из sbRegister) над NAV-лейблом.
    const reg = (typeof SB_REGISTRY !== 'undefined') ? SB_REGISTRY[id] : null;
    const title = (reg && reg.title) || label;
    const isRoot = id === 'getting-started';
    // На самой GS-странице root-линк = петля → делаем его статичным <span>.
    // На остальных — кликабельный путь домой.
    const items = [
      isRoot
        ? { label: 'Design System', icon: 'gemini-fill' }
        : { label: 'Design System', href: '#getting-started', icon: 'gemini-fill' },
    ];
    if (category) items.push({ label: category }); // статичный <span>
    items.push({ label: title });                  // current
    return mkBreadcrumbs({ items });
  }
  window.sbBuildPageBreadcrumbs = buildPageBreadcrumbs;

  // ── Demo-наборы ─────────────────────────────────────────────────────────
  const ITEMS_3 = [
    { label: 'Spacebridge', href: 'javascript:void(0)' },
    { label: 'Settings',    href: 'javascript:void(0)' },
    { label: 'Profile' },
  ];
  const ITEMS_2 = [
    { label: 'Home',     href: 'javascript:void(0)' },
    { label: 'Dashboard' },
  ];
  const ITEMS_WITH_ICON = [
    { label: 'Account',     href: 'javascript:void(0)', icon: 'user-line' },
    { label: 'Devices',     href: 'javascript:void(0)' },
    { label: 'Antenna A-12' },
  ];
  const ITEMS_LONG = [
    { label: 'Spacebridge',   href: 'javascript:void(0)' },
    { label: 'Organisation',  href: 'javascript:void(0)' },
    { label: 'Fleet',         href: 'javascript:void(0)' },
    { label: 'Group Alpha',   href: 'javascript:void(0)' },
    { label: 'Device 0042',   href: 'javascript:void(0)' },
    { label: 'Telemetry' },
  ];

  sbRegister({
    name: 'breadcrumbs',
    title: 'Breadcrumbs',
    description: 'Path-навигация: цепочка ссылок к корню от текущей страницы. Последний элемент — current page (bold + --text-tertiary, не интерактивный). Типографика body-m / regular зеркальна со Sticky ToC. Разделитель — chevron-right 16px.',
    sections: [
      {
        title: 'Anatomy',
        desc: 'Контейнер <code>&lt;nav class="sb-breadcrumbs"&gt;</code> с <code>aria-label="Breadcrumb"</code>. Каждый item — <code>&lt;a class="sb-breadcrumb-item"&gt;</code> кроме последнего: <code>&lt;span class="sb-breadcrumb-item is-current" aria-current="page"&gt;</code>. Между item\'ами — <code>&lt;span class="sb-breadcrumb-sep" aria-hidden="true"&gt;</code> с иконкой chevron-right.',
        preview: `<div style="padding:24px">${mkBreadcrumbs({ items: ITEMS_3 })}</div>`,
        html: `<nav class="sb-breadcrumbs" aria-label="Breadcrumb">
  <a class="sb-breadcrumb-item" href="#">Spacebridge</a>
  <span class="sb-breadcrumb-sep" aria-hidden="true"><!-- chevron-right 16 --></span>
  <a class="sb-breadcrumb-item" href="#">Settings</a>
  <span class="sb-breadcrumb-sep" aria-hidden="true"><!-- chevron-right 16 --></span>
  <span class="sb-breadcrumb-item is-current" aria-current="page">Profile</span>
</nav>`,
        css: COMP_CSS.breadcrumbs,
      },
      {
        title: 'Two levels',
        desc: 'Минимальная цепочка из двух элементов — родитель + текущая страница.',
        preview: `<div style="padding:24px">${mkBreadcrumbs({ items: ITEMS_2 })}</div>`,
        html: `<nav class="sb-breadcrumbs" aria-label="Breadcrumb">
  <a class="sb-breadcrumb-item" href="#">Home</a>
  <span class="sb-breadcrumb-sep" aria-hidden="true"><!-- chevron-right 16 --></span>
  <span class="sb-breadcrumb-item is-current" aria-current="page">Dashboard</span>
</nav>`,
        css: COMP_CSS.breadcrumbs,
      },
      {
        title: 'With leading icon',
        desc: 'Item может содержать иконку перед лейблом (например, home для корневого узла). Иконка наследует <code>color</code> от item\'а — меняется на hover/current.',
        preview: `<div style="padding:24px">${mkBreadcrumbs({ items: ITEMS_WITH_ICON })}</div>`,
        html: `<nav class="sb-breadcrumbs" aria-label="Breadcrumb">
  <a class="sb-breadcrumb-item" href="#">
    <span class="sb-icon-wrap"><!-- user-line 16 --></span>Account
  </a>
  <span class="sb-breadcrumb-sep" aria-hidden="true"><!-- chevron-right 16 --></span>
  <a class="sb-breadcrumb-item" href="#">Devices</a>
  <span class="sb-breadcrumb-sep" aria-hidden="true"><!-- chevron-right 16 --></span>
  <span class="sb-breadcrumb-item is-current" aria-current="page">Antenna A-12</span>
</nav>`,
        css: COMP_CSS.breadcrumbs,
      },
      {
        title: 'Long path — full',
        desc: 'Полная цепочка без сворачивания. Если строка длиннее контейнера — wrap на следующую строку (<code>flex-wrap: wrap</code> на <code>.sb-breadcrumbs</code>).',
        preview: `<div style="padding:24px">${mkBreadcrumbs({ items: ITEMS_LONG })}</div>`,
        html: `<!-- mkBreadcrumbs({ items: [...6 levels...] }) -->`,
        css: COMP_CSS.breadcrumbs,
      },
      {
        title: 'Long path — collapsed',
        desc: 'Когда цепочка глубокая, средние узлы сворачиваются в <code>…</code>. Передай <code>collapseAfter: N</code> — показ первого + последних (N−1) item\'ов. Удобно для глубоких иерархий (fleet/group/device/section).',
        preview: `<div style="padding:24px">${mkBreadcrumbs({ items: ITEMS_LONG, collapseAfter: 4 })}</div>`,
        html: `<!-- mkBreadcrumbs({ items: [...6 levels...], collapseAfter: 4 }) -->
<nav class="sb-breadcrumbs" aria-label="Breadcrumb">
  <a class="sb-breadcrumb-item" href="#">Spacebridge</a>
  <span class="sb-breadcrumb-sep" aria-hidden="true">›</span>
  <span class="sb-breadcrumb-ellipsis" aria-hidden="true">…</span>
  <span class="sb-breadcrumb-sep" aria-hidden="true">›</span>
  <a class="sb-breadcrumb-item" href="#">Group Alpha</a>
  <span class="sb-breadcrumb-sep" aria-hidden="true">›</span>
  <a class="sb-breadcrumb-item" href="#">Device 0042</a>
  <span class="sb-breadcrumb-sep" aria-hidden="true">›</span>
  <span class="sb-breadcrumb-item is-current" aria-current="page">Telemetry</span>
</nav>`,
        css: COMP_CSS.breadcrumbs,
      },
    ],
  });
})();
