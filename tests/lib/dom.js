// ═══════════════════════════════════════════════════════════════════════════
//  DOM-ЗАГЛУШКА
//  Ровно столько браузера, сколько нужно файлам DS, чтобы загрузиться и
//  зарегистрироваться. Layout не эмулируется — все размеры нулевые, и это
//  осознанно: тесты на jsc проверяют разметку, а не геометрию.
// ═══════════════════════════════════════════════════════════════════════════

function installDom() {
  function el() {
    return {
      style: {}, dataset: {}, innerHTML: '', textContent: '', value: '', children: [],
      classList: { add: function () {}, remove: function () {}, toggle: function () {}, contains: function () { return false } },
      appendChild: function () {}, removeChild: function () {}, insertBefore: function () {}, remove: function () {},
      setAttribute: function () {}, getAttribute: function () { return null }, removeAttribute: function () {},
      addEventListener: function () {}, removeEventListener: function () {},
      querySelector: function () { return null }, querySelectorAll: function () { return [] },
      closest: function () { return null }, contains: function () { return false },
      focus: function () {}, click: function () {}, getClientRects: function () { return [] },
      getBoundingClientRect: function () { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 } },
    };
  }
  // documentElement с реальным хранилищем атрибутов — data-lang читают и
  // пишут, проверки на него опираются.
  function docEl() {
    var attrs = {}, base = el();
    base.setAttribute = function (k, v) { attrs[k] = String(v) };
    base.getAttribute = function (k) { return (k in attrs) ? attrs[k] : null };
    base.removeAttribute = function (k) { delete attrs[k] };
    return base;
  }
  globalThis.window = globalThis;
  globalThis.console = { log: function () {}, warn: function () {}, error: function () {}, info: function () {} };
  // Слушателей DOMContentLoaded копим: часть проводки DS (например обёртка
  // sbNavBarLangPick в docs-i18n.js) навешивается именно там, и без запуска
  // события её просто не существует. fireReady() дёргает их вручную.
  var ready = [];
  globalThis.__fireReady = function () { ready.slice().forEach(function (fn) { try { fn() } catch (e) {} }) };
  function addListener(type, fn) { if (type === 'DOMContentLoaded' && typeof fn === 'function') ready.push(fn) }
  globalThis.document = {
    createElement: el, createTextNode: el, createDocumentFragment: el,
    body: el(), head: el(), documentElement: docEl(), readyState: 'complete',
    querySelector: function () { return el() }, querySelectorAll: function () { return [] },
    getElementById: function () { return el() },
    addEventListener: addListener, removeEventListener: function () {},
  };
  globalThis.navigator = { userAgent: 'jsc', language: 'en' };
  globalThis.location = { hash: '', href: '', search: '' };
  // Настоящее key-value: без него не проверить, что выбор языка переживает
  // перезагрузку страницы.
  var store = {};
  globalThis.localStorage = {
    getItem: function (k) { return (k in store) ? store[k] : null },
    setItem: function (k, v) { store[k] = String(v) },
    removeItem: function (k) { delete store[k] },
    clear: function () { store = {} },
  };
  globalThis.matchMedia = function () { return { matches: false, addEventListener: function () {}, addListener: function () {} } };
  globalThis.requestAnimationFrame = function () { return 0 };
  globalThis.cancelAnimationFrame = function () {};
  globalThis.setTimeout = function () { return 0 };
  globalThis.setInterval = function () { return 0 };
  globalThis.clearTimeout = function () {};
  globalThis.clearInterval = function () {};
  globalThis.getComputedStyle = function () { return { display: 'block', getPropertyValue: function () { return '' } } };
  globalThis.addEventListener = addListener;
  globalThis.ResizeObserver = function () { this.observe = function () {}; this.disconnect = function () {} };
  globalThis.IntersectionObserver = globalThis.ResizeObserver;
  globalThis.MutationObserver = globalThis.ResizeObserver;
  globalThis.JSZip = function () {};
}
