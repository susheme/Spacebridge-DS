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
// анатомия — позже переедет в pop-up/модалку, когда компонент появится)
// или Important (критичное для разработчиков/дизайнеров).
// Интерим-стиль по скриншоту дизайнера; финальная спека будет позже.
// body может быть sbT(...) — тогда плашка одна, текст переключается.
function sbDocNote(title, body) {
  return `<span class="sb-doc-note">`
    + `<span class="sb-doc-note-head">${sbIcon('information-fill', 'L')}<span class="sb-title-s">${title}</span></span>`
    + `<span class="sb-doc-note-text sb-body-m">${body}</span>`
    + `</span>`;
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
    orig(cell, code);
    if (cell && cell.closest && cell.closest('#dsNavRight')) {
      sbSetDocLang(code === 'RU' ? 'ru' : 'en');
    }
  };
});
