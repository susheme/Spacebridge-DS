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
  { name: 'chevron',       file: 'chevron.js',        deps: [] },                    // sbMkChevron — селекторы, хедеры, тосты, баннеры, таблица, side-nav; ЯДРО зовёт из pg.select
  { name: 'grid-system',   file: 'grid-system.js',    deps: [] },                    // Flex / Flex Item / Grid / Page. Третьим в списке: демо banners/snackbar зовут sbMkFlex при регистрации
  { name: 'buttons',       file: 'buttons.js',        deps: [] },                    // sbMkButton — ЕДИНСТВЕННЫЙ способ отрисовать кнопку в DS; вторым после chevron, потому что badge/snackbar зовут его при регистрации. deps на checkbox нет: sbMkCheckbox в extraPreview, вызывается лениво
  { name: 'badge',         file: 'badge.js',          deps: ['chevron', 'buttons'] },           // в ТРОЙКЕ первых: SB_BADGE_SPECS нужен banners при регистрации; doc-note через фолбэк (зовёт sbMkChevron)
  { name: 'banners',       file: 'banners.js',        deps: ['chevron', 'badge', 'buttons'] },  // замыкает ТРОЙКУ первых: sbDocNote → sbMkBanner при регистрации ВСЕХ ниже; сам зовёт sbMkChevron + fill-иконки из SB_BADGE_SPECS
  { name: 'snackbar',      file: 'snackbar.js',       deps: ['badge', 'banners', 'buttons'] },  // success-fill из SB_BADGE_SPECS; sbDocNote в секции → после banners
  { name: 'action-bar',    file: 'action-bar.js',     deps: ['buttons'] },           // 1–2 кнопки внизу карточки/модалки; .sb-btn + sbIcon
  { name: 'popover',       file: 'popover.js',        deps: ['buttons'] },                    // примитив якорного позиционирования (flip/shift/portal); РАНО в списке — его зовут table/section-header/хедеры/nav-bar/tool-bar; демо за геттером sections, поэтому своих deps на загрузке нет
  { name: 'separators',    file: 'separators.js',     deps: ['toggles'] },
  { name: 'avatar',        file: 'avatar.js',         deps: [] },                    // sbMkAvatar — nav-bar, table
  { name: 'toggles',       file: 'toggles.js',        deps: [] },                    // sbMkToggle; ЯДРО зовёт из pg.toggle; ВЫШЕ separators (тот зовёт в preview при регистрации)
  { name: 'checkbox',      file: 'checkbox.js',       deps: [] },
  { name: 'radio',         file: 'radio.js',          deps: [] },                    // sbMkRadio; ЯДРО зовёт его из pg.radio (core.js) при рендере плейграунда
  { name: 'counters',      file: 'counters.js',       deps: [] },                    // sbMkCounter — side-nav, nav-bar, file-uploader
  { name: 'kbd',           file: 'kbd.js',            deps: [] },                    // keyboard shortcut hint, used by search-bar
  { name: 'search-bar',    file: 'search-bar.js',     deps: ['kbd'] },               // uses sbMkKbd / sbMkKbdGroup in sections
  { name: 'input',         file: 'input.js',          deps: [] },                    // defines inputField + inputFieldWrap
  { name: 'textarea',      file: 'textarea.js',       deps: ['input'] },             // uses inputFieldWrap
  { name: 'password',      file: 'password.js',       deps: ['input'] },             // uses inputFieldWrap
  { name: 'header-xs',     file: 'header-xs.js',      deps: ['buttons', 'badge'] },  // самый компактный хедер; close = sbMkButton, символы SB_SVG. ВЫШЕ file-uploader и toast — оба зовут sbMkHeaderXS
  { name: 'file-uploader', file: 'file-uploader.js',  deps: ['badge', 'header-xs', 'counters', 'toggles', 'buttons'] },// дропзона + Upload Cell + композит; SB_SVG из badge.js, sbMkHeaderXS из header-xs.js
  { name: 'tags',          file: 'tags.js',           deps: [] },
  { name: 'status',        file: 'status.js',         deps: ['buttons'] },                    // includes ANT + downloadAntennaZip
  { name: 'tooltips',      file: 'tooltips.js',       deps: ['status'] },            // hover/click подсказка; demo-триггер юзает .sb-status-dot
  { name: 'chips',         file: 'chips.js',          deps: [] },                    // кнопка-пилюля; реюзается Clear-чипсой стека тостов
  { name: 'toast',         file: 'toast.js',          deps: ['header-xs', 'badge', 'buttons', 'action-bar', 'list', 'chips', 'chevron'] }, // хедер = sbMkHeaderXS, глифы SB_SVG, close = sb-btn, футер = sbMkActionBar, details = sbMkInfoCell, чипса = sbMkChip
  { name: 'info-footer',   file: 'info-footer.js',    deps: ['status', 'separators'] }, // системная инфа по слотам; .sb-status-dot + .sb-sep
  { name: 'list',          file: 'list.js',           deps: ['toggles', 'buttons', 'status'] },      // два семейства ячеек: Standard List + Property List. Секция Property List зовёт sbMkStatusDot ПРИ РЕГИСТРАЦИИ → строго после status.js. sbMkSegmentMenu (вкладки плейграунда) в deps НЕ значится: вызов ленивый, а поднять segment-menu.js выше нельзя — он сам при регистрации зовёт sbMkSectionHeader
  { name: 'context-menu',  file: 'context-menu.js',   deps: [] },
  { name: 'table',         file: 'table.js',          deps: ['checkbox', 'chevron', 'avatar', 'toggles', 'context-menu', 'buttons'] }, // чекбоксы выбора рядов = sbMkCheckbox (managed); kebab ряда = sbMkContextCard/Cell при регистрации → ПОСЛЕ context-menu
  { name: 'section-header', file: 'section-header.js', deps: ['buttons', 'popover', 'context-menu'] }, // заголовок секции со слотами; действия = sbMkButton, overflow = sbMkPopover
  { name: 'selectors',     file: 'selectors.js',      deps: ['chevron', 'input', 'popover', 'context-menu'] }, // живая выпадашка: sbMkPopover + sbMkContextCard/Cell в preview на регистрации → ПОСЛЕ context-menu
  { name: 'segment-menu',  file: 'segment-menu.js',   deps: [] },
  { name: 'tabs',          file: 'tabs.js',           deps: ['status'] },            // building block для Tab Bar (Status Mini indicator)
  { name: 'tab-bar',       file: 'tab-bar.js',        deps: ['tabs'] },              // container, юзает sbMkTab из tabs.js
  { name: 'toc',           file: 'toc.js',            deps: [] },                    // sticky in-page nav, used by core.js renderComponentPage
  { name: 'breadcrumbs',   file: 'breadcrumbs.js',    deps: [] },                    // path-nav, типографика синхронна с toc
  { name: 'pagination',    file: 'pagination.js',     deps: ['buttons', 'input'] },  // на базе sb-btn-secondary + sb-tf
  { name: 'table-footer',  file: 'table-footer.js',   deps: ['pagination'] },        // demo юзает sbMkPagination → ПОСЛЕ pagination
  { name: 'header-s',      file: 'header-s.js',       deps: ['buttons', 'popover', 'context-menu', 'tool-bar'] }, // компактный хедер; действия сворачиваются в More
  { name: 'header-m',      file: 'header-m.js',       deps: ['buttons', 'popover', 'context-menu', 'tool-bar'] },
  { name: 'header-l',      file: 'header-l.js',       deps: ['buttons', 'popover', 'context-menu', 'tool-bar'] }, // самый крупный; demo-слот юзает sbMkToolBar
  { name: 'nav-bar',       file: 'nav-bar.js',        deps: ['buttons', 'avatar', 'search-bar', 'kbd', 'context-menu', 'overlay', 'counters'] }, // top bar; search-overlay = sbMkOverlay (примитив)
  { name: 'tool-bar',      file: 'tool-bar.js',       deps: ['buttons', 'popover', 'context-menu', 'search-bar', 'tab-bar'] }, // 3 слота; действия = sbMkButton, overflow = sbMkPopover
  { name: 'led-panel',     file: 'led-panel.js',      deps: ['status'] },            // Status Indicators Panel, NAME + Status dot. ДОЛЖЕН быть до sub-nav.js (он юзает sbMkLedPanel в demo)
  { name: 'sub-nav',       file: 'sub-nav.js',        deps: ['segment-menu', 'led-panel'] }, // sub-bar под Nav Bar; demo юзает sbMkSegmentMenu + sbMkLedPanel
  { name: 'overlay',       file: 'overlay.js',        deps: ['file-uploader', 'buttons'] },     // примитив модальности; live-демо юзает sbMkUploader (framed в модалке)
  { name: 'side-navigation', file: 'side-navigation.js', deps: ['buttons', 'chevron', 'counters', 'context-menu', 'section-header'] }, // дерево навигации; edit/delete = sbMkButton
  { name: 'dialogues',     file: 'dialogues.js',      deps: ['badge', 'action-bar', 'overlay', 'checkbox', 'buttons'] }, // Alert: SB_SVG символ + sbMkActionBar футер; consent = sbMkCheckbox; modal-демо = sbMkOverlay
  { name: 'getting-started', file: 'getting-started.js', deps: ['buttons'] },                 // docs page, не playground
];

// Как добавить новый компонент:
//   1. Скопируй _template.js → components/<name>.js
//   2. Создай css/components/<name>.css
//   3. Добавь <link>/<script> в index.html
//   4. Добавь запись в NAV (js/core.js)
//   5. Добавь сюда строку для документации порядка
