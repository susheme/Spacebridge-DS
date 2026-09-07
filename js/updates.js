// ═══════════════════════════════════════════════════════════════════════════
//  UPDATES FEED — данные и состояние прочитанности
//  Документационный слой (не DS-компонент): лента обновлений для колокольчика
//  в Nav Bar (попап «есть новое», side-панель со списком, модалка записи).
//  Источник правды для истории — CHANGELOG.md; здесь — курируемые короткие
//  записи для пользователя DS, по одной на релиз, новые сверху. Связка с
//  changelog — поле version.
//
//  Грузится ПОСЛЕ docs-i18n.js (соседний слой), рендереров не содержит —
//  только данные и localStorage-хелперы. Тексты хранятся парами { en, ru },
//  в разметку их ведёт рендерер через sbT(t.en, t.ru).
//
//  Ключи localStorage:
//    sb-updates-seen — id верхней записи на момент последнего открытия
//                      панели. Расходится с текущим верхним id → есть
//                      непросмотренное: бейдж на колокольчике + попап.
//    sb-updates-read — JSON-массив id прочитанных записей. Управляет
//                      точками непрочитанного внутри панели.
// ═══════════════════════════════════════════════════════════════════════════

// Поля записи:
//   id        — стабильный ключ, 'v' + version. Не переиспользовать.
//   version   — релиз в CHANGELOG.md.
//   date      — дата релиза (из changelog; для старых релизов — дата
//               коммита компонента в git).
//   components — id страниц в NAV (location.hash) для точечных переходов:
//               кликабельные теги в карточке и модалке. Пустой массив —
//               запись без переходов.
//   title     — заголовок записи, { en, ru }.
//   text      — одно-два предложения сути, { en, ru }.
window.SB_UPDATES = [
  {
    id: 'v1.14.0', version: '1.14.0', date: '2026-08-04', components: ['grid-system', 'buttons'],
    title: { en: 'Grid System and responsive tokens', ru: 'Grid System и адаптивные токены' },
    text: {
      en: 'Layout primitives Flex, Flex Item, Grid and Page. Tokens follow the three Figma modes mobile-first. Buttons render through the sbMkButton factory.',
      ru: 'Примитивы раскладки Flex, Flex Item, Grid и Page. Токены следуют трём режимам Figma mobile-first. Кнопки собираются фабрикой sbMkButton.',
    },
  },
  {
    id: 'v1.13.1', version: '1.13.1', date: '2026-06-26', components: ['info-footer'],
    title: { en: 'Info Footer: slot typography', ru: 'Info Footer: типографика слотов' },
    text: {
      en: 'Slot text uses Badge typography and the --text-muted token.',
      ru: 'Slot-текст использует типографику Badge и токен --text-muted.',
    },
  },
  {
    id: 'v1.13.0', version: '1.13.0', date: '2026-06-26', components: ['info-footer'],
    title: { en: 'Info Footer', ru: 'Info Footer' },
    text: {
      en: 'System info by slots: text and status indicator. Long and Compact layouts, popup anchor.',
      ru: 'Системная информация по слотам: текст и статус-индикатор. Лейауты Long и Compact, popup-якорь.',
    },
  },
  {
    id: 'v1.12.0', version: '1.12.0', date: '2026-06-25', components: ['action-bar'],
    title: { en: 'Action Bar', ru: 'Action Bar' },
    text: {
      en: 'One or two buttons at the bottom of a card, modal or alert. Divider and floating variants, four alignments.',
      ru: 'Одна-две кнопки внизу карточки, модалки или алерта. Варианты divider и floating, четыре выравнивания.',
    },
  },
  {
    id: 'v1.11.0', version: '1.11.0', date: '2026-06-16', components: ['side-navigation'],
    title: { en: 'Side Navigation', ru: 'Side Navigation' },
    text: {
      en: 'Side Menu and Side Bar variants, cell roles and slots, embedded mode.',
      ru: 'Варианты Side Menu и Side Bar, роли и слоты ячеек, embedded-режим.',
    },
  },
  {
    id: 'v1.10.0', version: '1.10.0', date: '2026-06-10', components: ['tool-bar'],
    title: { en: 'Tool Bar', ru: 'Tool Bar' },
    text: {
      en: 'Top tool bar with smart-collapse via container query.',
      ru: 'Верхний тулбар со smart-collapse через container query.',
    },
  },
  {
    id: 'v1.9.0', version: '1.9.0', date: '2026-05-26', components: ['pagination', 'table-footer'],
    title: { en: 'Pagination and Table Footer', ru: 'Pagination и Table Footer' },
    text: {
      en: 'Page navigation for tables and lists, plus the table footer strip.',
      ru: 'Постраничная навигация для таблиц и списков, плюс футер таблицы.',
    },
  },
  {
    id: 'v1.8.0', version: '1.8.0', date: '2026-05-25', components: ['breadcrumbs'],
    title: { en: 'Breadcrumbs', ru: 'Breadcrumbs' },
    text: {
      en: 'Breadcrumbs component and page breadcrumbs across the DS.',
      ru: 'Компонент Breadcrumbs и крошки на страницах DS.',
    },
  },
  {
    id: 'v1.7.0', version: '1.7.0', date: '2026-05-21', components: ['tab-bar', 'segment-menu', 'sub-nav', 'led-panel'],
    title: { en: 'Tabs, Segment Menu, Sub Nav, LED Panel', ru: 'Tabs, Segment Menu, Sub Nav, LED Panel' },
    text: {
      en: 'Four navigation and indication components in one release.',
      ru: 'Четыре компонента навигации и индикации в одном релизе.',
    },
  },
  {
    id: 'v1.6.0', version: '1.6.0', date: '2026-05-14', components: ['nav-bar'],
    title: { en: 'Nav Bar', ru: 'Nav Bar' },
    text: {
      en: 'Top navigation bar with smart-collapse.',
      ru: 'Верхняя навигационная панель со smart-collapse.',
    },
  },
  {
    id: 'v1.5.0', version: '1.5.0', date: '2026-05-11', components: ['toc'],
    title: { en: 'Sticky Table of Contents', ru: 'Sticky Table of Contents' },
    text: {
      en: 'Sticky table of contents on component pages.',
      ru: 'Залипающее оглавление на страницах компонентов.',
    },
  },
  {
    id: 'v1.4.0', version: '1.4.0', date: '2026-05-07', components: ['kbd'],
    title: { en: 'Keyboard Shortcut (KBD)', ru: 'Keyboard Shortcut (KBD)' },
    text: {
      en: 'Keyboard shortcut hint. Used by Search Bar.',
      ru: 'Подсказка клавиатурного сокращения. Используется в Search Bar.',
    },
  },
  {
    id: 'v1.3.0', version: '1.3.0', date: '2026-05-04', components: ['header-m', 'header-l', 'header-s'],
    title: { en: 'Header M, Header L, Header S', ru: 'Header M, Header L, Header S' },
    text: {
      en: 'Three page headers with slots for actions and sub-navigation.',
      ru: 'Три страничных хедера со слотами под действия и суб-навигацию.',
    },
  },
  {
    id: 'v1.2.0', version: '1.2.0', date: '2026-04-29', components: ['section-header', 'header-xs', 'tab-bar'],
    title: { en: 'Header Section, Header XS, Tab Bar', ru: 'Header Section, Header XS, Tab Bar' },
    text: {
      en: 'Section header, compact header and tab bar.',
      ru: 'Заголовок секции, компактный хедер и таб-бар.',
    },
  },
  {
    id: 'v1.1.0', version: '1.1.0', date: '2026-04-27', components: ['list', 'context-menu'],
    title: { en: 'List and Context Menu', ru: 'List и Context Menu' },
    text: {
      en: 'List cells and the context menu.',
      ru: 'Ячейки списка и контекстное меню.',
    },
  },
  {
    id: 'v1.0.0', version: '1.0.0', date: '2026-04-15', components: ['buttons', 'input', 'badge', 'avatar', 'status', 'table', 'selectors', 'toggles', 'checkbox', 'radio', 'separators', 'chevron', 'counters', 'tags', 'search-bar', 'password', 'textarea', 'banners'],
    title: { en: 'First release', ru: 'Первый релиз' },
    text: {
      en: '18 base components, from Buttons to Notifications.',
      ru: '18 базовых компонентов, от Buttons до Notifications.',
    },
  },
];

// ── Состояние прочитанности ────────────────────────────────────────────────

// Верхняя запись ленты — последний анонс.
function sbUpdatesLatestId() {
  return SB_UPDATES.length ? SB_UPDATES[0].id : null;
}

// Есть непросмотренное: верхний id ленты не совпадает с сохранённым.
// Управляет бейджем на колокольчике и показом попапа «есть новое».
function sbUpdatesHasUnseen() {
  const latest = sbUpdatesLatestId();
  return latest !== null && localStorage.getItem('sb-updates-seen') !== latest;
}

// Панель открыта — лента просмотрена: бейдж гаснет, попап не показывается
// до следующего релиза. Точки непрочитанного внутри панели не трогает.
function sbUpdatesMarkSeen() {
  const latest = sbUpdatesLatestId();
  if (latest !== null) localStorage.setItem('sb-updates-seen', latest);
}

function sbUpdatesReadIds() {
  try { return JSON.parse(localStorage.getItem('sb-updates-read')) || []; }
  catch (e) { return []; }
}

function sbUpdatesIsRead(id) {
  return sbUpdatesReadIds().includes(id);
}

// Запись прочитана: открыта её модалка или совершён переход к компоненту.
function sbUpdatesMarkRead(id) {
  const ids = sbUpdatesReadIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem('sb-updates-read', JSON.stringify(ids));
  }
}

function sbUpdatesUnreadCount() {
  const read = sbUpdatesReadIds();
  return SB_UPDATES.filter((u) => !read.includes(u.id)).length;
}
