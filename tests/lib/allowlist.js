// ═══════════════════════════════════════════════════════════════════════════
//  РАЗРЕШЁННЫЕ ИСКЛЮЧЕНИЯ
//
//  Каждая запись — осознанное исключение из правила, с причиной. Пустой
//  allowlist был бы честнее, но правила DS писались под UI-код, а в репозитории
//  есть места, где буква правила не применима (собственная векторная графика
//  компонента, фолбэк-значение в JS, плейсхолдер в документации).
//
//  ПРАВИЛО ПОПОЛНЕНИЯ: добавляешь строку — пишешь причину. Исключение без
//  причины = замаскированное нарушение.
// ═══════════════════════════════════════════════════════════════════════════

// Файлы, которым разрешено содержать собственный <svg> в разметке.
// Это НЕ иконки из ICON_PATHS (те обязаны идти через sbIcon), а графика,
// принадлежащая самому компоненту.
var INLINE_SVG_OK = {
  'js/components/badge.js':    'SB_SVG — Symbol Badges, собственный набор глифов компонента (источник, а не потребитель иконок)',
  'js/components/status.js':   'антенны сигнала и статус-глифы — своя графика, в ICON_PATHS её нет',
  'js/components/snackbar.js': 'кольцо-таймер: <circle> с анимацией stroke-dashoffset, иконкой не выражается',
  'js/components/tooltips.js': 'хвостик подсказки 44×14 — не иконка 24×24, свой viewBox',
  'js/components/nav-bar.js':  'плейсхолдеры <svg>FULL_LOGO</svg> в code-sample документации',
};

// Хардкод цвета в JS. Разрешён только как фолбэк вычисления, не как стиль UI.
var HARDCODED_COLOR_OK = [
  { file: 'js/components/badge.js',  needle: "|| '#000'", why: 'фолбэк getPropertyValue при неизвестном токене — в разметку не попадает' },
  { file: 'js/components/status.js', needle: "return '#000'", why: 'фолбэк вычисления цвета для экспорта SVG' },
];

// Инлайновая типографика в style="…". Каждый случай — кандидат на вынос в
// sb-* класс; список существует, чтобы долг был виден, а не растворился.
var INLINE_TYPO_KNOWN = [
  { file: 'js/components/nav-bar.js', needle: 'font-size:18px;color:var(--primary)',
    why: 'DEMO_LOGO/DEMO_LOGO_COMPACT в превью — размер лого продукта, класса под него в типографике нет' },
];

// Компоненты, которым нельзя пользоваться Grid System: они грузятся раньше
// него и обязаны обходиться своими силами.
var INLINE_LAYOUT_OK = {
  'js/components/chevron.js': 'грузится ПЕРВЫМ: bootstrap-фолбэк sbDocNote зовёт sbMkChevron, поэтому chevron не может зависеть ни от одной фабрики, включая sbMkFlex',
};
function inlineLayoutAllowed(file) { return Object.prototype.hasOwnProperty.call(INLINE_LAYOUT_OK, file) }

// Правила, живущие только в COMP_CSS: это сниппеты «для вас», а не стили
// самой DS. В css/components их нет намеренно.
var DOC_ONLY_RULES = {
  '.sb-symbol-badge': 'секция Symbol Badges отдаёт класс-контейнер 24×24 для потребителя; сама DS вставляет готовые SVG и класс не применяет',
};

// CSS-переменные, которых нет в tokens.css: их выставляет JS в рантайме.
var RUNTIME_CSS_VARS = {
  '--sb-hdr-fade':       'syncStickyHeaders (core.js) — прозрачность залипшего Section Header',
  '--sb-sticky-surface': 'зарезервировано под opt-in sticky Section Header (см. BACKLOG)',
};

function svgAllowed(file)   { return Object.prototype.hasOwnProperty.call(INLINE_SVG_OK, file) }
function colorAllowed(file, line) {
  for (var i = 0; i < HARDCODED_COLOR_OK.length; i++) {
    var e = HARDCODED_COLOR_OK[i];
    if (e.file === file && line.indexOf(e.needle) !== -1) return true;
  }
  return false;
}
function typoKnown(file, line) {
  for (var i = 0; i < INLINE_TYPO_KNOWN.length; i++) {
    var e = INLINE_TYPO_KNOWN[i];
    if (e.file === file && line.indexOf(e.needle) !== -1) return true;
  }
  return false;
}
function runtimeVar(name) { return Object.prototype.hasOwnProperty.call(RUNTIME_CSS_VARS, name) }
function docOnlyRule(sel) { return Object.prototype.hasOwnProperty.call(DOC_ONLY_RULES, sel) }
