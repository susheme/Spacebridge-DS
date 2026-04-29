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
  { name: 'chevron',       file: 'chevron.js',        deps: [] },                    // used by selectors
  { name: 'separators',    file: 'separators.js',     deps: [] },
  { name: 'avatar',        file: 'avatar.js',         deps: [] },
  { name: 'toggles',       file: 'toggles.js',        deps: [] },
  { name: 'checkbox',      file: 'checkbox.js',       deps: [] },
  { name: 'radio',         file: 'radio.js',          deps: [] },
  { name: 'counters',      file: 'counters.js',       deps: [] },
  { name: 'search-bar',    file: 'search-bar.js',     deps: [] },
  { name: 'input',         file: 'input.js',          deps: [] },                    // defines inputField + inputFieldWrap
  { name: 'textarea',      file: 'textarea.js',       deps: ['input'] },             // uses inputFieldWrap
  { name: 'password',      file: 'password.js',       deps: ['input'] },             // uses inputFieldWrap
  { name: 'selectors',     file: 'selectors.js',      deps: ['chevron', 'input'] },  // uses chevron + inputFieldWrap
  { name: 'tags',          file: 'tags.js',           deps: [] },
  { name: 'status',        file: 'status.js',         deps: [] },                    // includes ANT + downloadAntennaZip
  { name: 'badge',         file: 'badge.js',          deps: [] },                    // includes SB_BADGE_SPECS + downloadSymbolBadgeZip
  { name: 'notifications', file: 'notifications.js',  deps: [] },
  { name: 'table',         file: 'table.js',          deps: [] },
  { name: 'list',          file: 'list.js',           deps: [] },
  { name: 'context-menu',  file: 'context-menu.js',   deps: [] },
  { name: 'tab-bar',       file: 'tab-bar.js',        deps: [] },
  { name: 'getting-started', file: 'getting-started.js', deps: [] },                 // docs page, не playground
];

// Как добавить новый компонент:
//   1. Скопируй _template.js → components/<name>.js
//   2. Создай css/components/<name>.css
//   3. Добавь <link>/<script> в index.html
//   4. Добавь запись в NAV (js/core.js)
//   5. Добавь сюда строку для документации порядка
