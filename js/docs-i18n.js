// ═══════════════════════════════════════════════════════════════════════════
//  DOCS I18N + DOC NOTES
//  Документационный слой (не DS-компонент): двуязычные тексты EN/RU и
//  инфо-плашки для описаний компонентов. CSS — в css/docs.css (ZONE 5).
//  Грузится ПОСЛЕ docs-helpers.js и ДО components/* — sbT/sbDocNote
//  вызываются в конфигах sbRegister на этапе загрузки.
// ═══════════════════════════════════════════════════════════════════════════

// Иконка info solid (Remix information-fill) — та же, что infoFilled в
// Symbol Badges. Регистрируем в ICON_PATHS отсюда, чтобы не трогать core.js;
// при случае — перенести в core.js к остальным иконкам.
ICON_PATHS['information-fill'] = 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z';

// Язык читаем из localStorage до первого рендера контента (init.js ниже по
// load order). Переключение — чисто CSS-ное (html[data-lang] прячет спаны
// другого языка), без re-render.
document.documentElement.setAttribute('data-lang', localStorage.getItem('sb-lang') || 'en');

// sbT(en, ru) — двуязычный фрагмент. Возвращает пару спанов; видимость
// решает CSS по html[data-lang]. Только <span> внутри — desc/description
// вставляются в <p>, блочные теги разорвали бы разметку.
function sbT(en, ru) {
  return `<span class="i18n-en">${en}</span><span class="i18n-ru">${ru}</span>`;
}

// sbDocNote(title, body) — инфо-плашка в описаниях: Tech Info (параметры,
// анатомия) или Important (критичное для разработчиков/дизайнеров).
// Dogfood: НАСТОЯЩИЙ Banner — собирается фабрикой sbMkBanner (banners.js,
// грузится первой парой с chevron, ДО остальных компонентов). 'Important' →
// warning, всё остальное ('Tech Info') → info. Правый слот не передаём → по
// контракту mkBanner плашка становится .collapsible: кламп 5 строк, Chevron
// Button при реальном переполнении, плавное раскрытие (sbBannerToggle).
// body может быть sbT(...) — тогда плашка одна, текст переключается.
// ВАЖНО: возвращает <div> — обёртка описания в core.js должна быть <div>, не <p>.
function sbDocNote(title, body) {
  const type = /important/i.test(title) ? 'warning' : 'info';
  const lead = sbIcon('information-fill', 'L');
  if (typeof sbMkBanner === 'function') {
    return sbMkBanner({ type, lead, title, text: body });
  }
  // ── BOOTSTRAP-ФОЛБЭК: ЕДИНСТВЕННЫЙ потребитель — chevron.js ────────────
  // Он регистрируется раньше banners.js (тот сам зовёт sbMkChevron при
  // регистрации — цикл), поэтому для него sbMkBanner ещё не существует.
  // [SYNC:doc-note-fallback] — зеркало разметки mkBanner (banners.js,
  // ветка collapsible). Меняешь mkBanner — меняй и здесь.
  return `<div class="sb-banner ${type} collapsible">`
    + `<div class="sb-banner-content">`
    +   `<div class="sb-banner-titlerow">`
    +     `<span class="sb-banner-lead">${lead}</span>`
    +     `<span class="sb-banner-title sb-title-m">${title}</span>`
    +   `</div>`
    +   `<div class="sb-banner-text sb-body-m">${body}</div>`
    + `</div>`
    + sbMkChevron({ cls: 'sb-banner-chevron', attrs: 'role="button" aria-label="Expand" onclick="sbBannerToggle(this)"' })
    + `</div>`;
}

function sbSetDocLang(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('sb-lang', lang);
}

// Прицепляемся к lang switcher'у в DS chrome (dogfood sbMkLangSwitcher из
// nav-bar.js). Оборачиваем sbNavBarLangPick после полной загрузки: реагируем
// только на switcher в топбаре (#dsNavRight) — пики в демо/playground
// Nav Bar'а язык документации не трогают. Контент пока EN/RU; FR/ES из
// списка switcher'а фолбэчатся на EN.
window.addEventListener('DOMContentLoaded', function () {
  const orig = window.sbNavBarLangPick;
  if (typeof orig !== 'function') return;
  window.sbNavBarLangPick = function (cell, code) {
    // Ячейка живёт в панели, которую Popover уносит порталом в <body>, поэтому
    // closest('#dsNavRight') от неё уходит в пустоту и топбар не опознаётся.
    // Идём к якорю по обратной ссылке примитива — ровно так же, как это делает
    // сам sbNavBarLangPick в nav-bar.js. Считаем ДО orig(): тот закрывает
    // popover, и после него ссылка может уже не понадобиться никому.
    const pop = cell && cell.closest ? cell.closest('.sb-popover') : null;
    const anchor = (pop && pop._sbAnchor) || cell;
    const inDocsChrome = !!(anchor && anchor.closest && anchor.closest('#dsNavRight'));
    orig(cell, code);
    if (inDocsChrome) sbSetDocLang(code === 'RU' ? 'ru' : 'en');
  };
});
