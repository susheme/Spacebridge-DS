// ═══════════════════════════════════════════════════════════════════════════
//  COMPONENTS INDEX
//
//  Это НЕ автозагрузчик — реальная загрузка идёт через <script> теги в index.html.
//  Этот файл служит документацией: список компонентов в правильном порядке.
//
//  Порядок важен только для компонентов, чьи COMP_CSS-ключи используют
//  другие компоненты. См. колонку "deps".
// ═══════════════════════════════════════════════════════════════════════════

window.SB_COMPONENTS = [
  // name                 file                       deps             notes
  { name: 'buttons',       file: 'buttons.js',        deps: [] },
  { name: 'action-bar',    file: 'action-bar.js',     deps: ['buttons'] },           // 1–2 кнопки внизу карточки/модалки; .sb-btn + sbIcon
  { name: 'chevron',       file: 'chevron.js',        deps: [] },                    // used by selectors
  { name: 'separators',    file: 'separators.js',     deps: [] },
  { name: 'avatar',        file: 'avatar.js',         deps: [] },
  { name: 'toggles',       file: 'toggles.js',        deps: [] },
  { name: 'checkbox',      file: 'checkbox.js',       deps: [] },
  { name: 'radio',         file: 'radio.js',          deps: [] },
  { name: 'counters',      file: 'counters.js',       deps: [] },
  { name: 'kbd',           file: 'kbd.js',            deps: [] },                    // keyboard shortcut hint, used by search-bar
  { name: 'search-bar',    file: 'search-bar.js',     deps: ['kbd'] },               // uses sbMkKbd / sbMkKbdGroup in sections
  { name: 'input',         file: 'input.js',          deps: [] },                    // defines inputField + inputFieldWrap
  { name: 'textarea',      file: 'textarea.js',       deps: ['input'] },             // uses inputFieldWrap
  { name: 'password',      file: 'password.js',       deps: ['input'] },             // uses inputFieldWrap
  { name: 'selectors',     file: 'selectors.js',      deps: ['chevron', 'input'] },  // uses chevron + inputFieldWrap
  { name: 'tags',          file: 'tags.js',           deps: [] },
  { name: 'status',        file: 'status.js',         deps: [] },                    // includes ANT + downloadAntennaZip
  { name: 'info-footer',   file: 'info-footer.js',    deps: ['status', 'separators'] }, // системная инфа по слотам; .sb-status-dot + .sb-sep
  { name: 'badge',         file: 'badge.js',          deps: [] },                    // includes SB_BADGE_SPECS + downloadSymbolBadgeZip
  { name: 'notifications', file: 'notifications.js',  deps: [] },
  { name: 'table',         file: 'table.js',          deps: [] },
  { name: 'list',          file: 'list.js',           deps: [] },
  { name: 'context-menu',  file: 'context-menu.js',   deps: [] },
  { name: 'segment-menu',  file: 'segment-menu.js',   deps: [] },
  { name: 'tabs',          file: 'tabs.js',           deps: ['status'] },            // building block для Tab Bar (Status Mini indicator)
  { name: 'tab-bar',       file: 'tab-bar.js',        deps: ['tabs'] },              // container, юзает sbMkTab из tabs.js
  { name: 'toc',           file: 'toc.js',            deps: [] },                    // sticky in-page nav, used by core.js renderComponentPage
  { name: 'breadcrumbs',   file: 'breadcrumbs.js',    deps: [] },                    // path-nav, типографика синхронна с toc
  { name: 'pagination',    file: 'pagination.js',     deps: ['buttons', 'input'] },  // на базе sb-btn-secondary + sb-tf
  { name: 'table-footer',  file: 'table-footer.js',   deps: ['pagination'] },        // demo юзает sbMkPagination → ПОСЛЕ pagination
  { name: 'nav-bar',       file: 'nav-bar.js',        deps: ['buttons', 'avatar', 'search-bar', 'kbd', 'context-menu'] }, // top bar (avatar opens overflow-menu)
  { name: 'led-panel',     file: 'led-panel.js',      deps: ['status'] },            // Status Indicators Panel, NAME + Status dot. ДОЛЖЕН быть до sub-nav.js (он юзает sbMkLedPanel в demo)
  { name: 'sub-nav',       file: 'sub-nav.js',        deps: ['segment-menu', 'led-panel'] }, // sub-bar под Nav Bar; demo юзает sbMkSegmentMenu + sbMkLedPanel
  { name: 'getting-started', file: 'getting-started.js', deps: [] },                 // docs page, не playground
];

// Как добавить новый компонент:
//   1. Скопируй _template.js → components/<name>.js
//   2. Создай css/components/<name>.css
//   3. Добавь <link>/<script> в index.html
//   4. Добавь запись в NAV (js/core.js)
//   5. Добавь сюда строку для документации порядка
