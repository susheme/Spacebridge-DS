// ═══════════════════════════════════════════════════════════════════════════
//  SEARCH_BAR
//  CSS в css/components/search-bar.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["search-bar"] = `.sb-search { display: flex; align-items: center; height: var(--text-field-height-l); min-width: var(--text-field-min-width); max-width: var(--text-field-max-width); border-radius: var(--radius-100); border: var(--border-width-1-5) solid var(--background); background: var(--surface-1); position: relative; overflow: hidden; transition: border-color 0.15s, background 0.15s; }
.sb-search-input { flex: 1; height: 100%; border: none; outline: none; background: transparent; padding: 0 var(--pad-horiz-8) 0 16px; font-size: var(--title-font-size-l); font-weight: var(--font-weight-regular); font-family: inherit; color: var(--text-primary); }
.sb-search-input::placeholder { color: var(--border); }
.sb-search-btn { flex-shrink: 0; height: 100%; width: var(--btn-rounded-min-width); display: flex; align-items: center; justify-content: center; background: var(--surface-1); border: none; border-left: var(--border-width-1-5) solid var(--background); cursor: pointer; color: var(--text-tertiary); transition: color 0.15s, background 0.15s; }
.sb-search:focus-within { background: var(--background); border-color: var(--primary); }
.sb-search:focus-within .sb-search-btn { background: var(--background); border-left-color: var(--primary); color: var(--primary); }
.sb-search:focus-within .sb-search-input { background: var(--background); }
.sb-search.line-view { background: transparent; border: none; border-radius: 0; border-bottom: var(--border-width-1-5) solid var(--border); }
.sb-search.line-view .sb-search-btn { background: transparent; border-left: none; }
.sb-search.line-view:focus-within { background: transparent; border-bottom-color: var(--primary); }
.sb-search.disabled { opacity: 0.5; pointer-events: none; }
.sb-search.critical { border-color: var(--error); }`;

// --- SEARCH BAR ---
(() => {
  const SEARCH_ICON = SB_GLYPHS.search;

  function mkSearch(opts = {}) {
    const { selected, lineView, disabled, critical, iconLeft, placeholder = 'Search' } = opts;
    let cls = 'sb-search';
    if (selected)  cls += ' selected';
    if (lineView)  cls += ' line-view';
    if (disabled)  cls += ' disabled';
    if (critical)  cls += ' critical';
    if (iconLeft)  cls += ' icon-left';
    const iconLeftEl = iconLeft
      ? `<span class="sb-search-icon-left">${SEARCH_ICON}</span>` : '';
    return `<div class="${cls}" style="width:100%;max-width:360px">
  ${iconLeftEl}<input class="sb-search-input" type="text" placeholder="${placeholder}">
  <button class="sb-search-btn">${SEARCH_ICON}</button>
</div>`;
  }

  sbRegister({
    name: 'search-bar',
    title: 'Search Bar',
    description: 'Поле поиска. Высота 32px, border-radius 100px. Варианты: Filled (с фоном) и LineView (только нижняя линия). Состояния: Default, Selected, Disabled, Critical.',
    playground: {
      title: 'Search Bar Playground',
      state: { selected: false, lineView: false, disabled: false, critical: false, iconLeft: false },
      controls(pg) {
        return `<div class="pg-grid">
          ${pg.toggle('selected',  'Selected')}
          ${pg.toggle('lineView',  'Line View')}
          ${pg.toggle('disabled',  'Disable')}
          ${pg.toggle('critical',  'Critical')}
          ${pg.toggle('iconLeft',  'Icon Left')}
        </div>`;
      },
      render(s) { return mkSearch(s); },
      genCode(s) { return { html: mkSearch(s), css: COMP_CSS["search-bar"] }; },
    },
    sections: [
      {
        title: 'Filled — States',
        desc: 'Стандартный вид с заливкой. Default — серый фон, Selected/Focus — белый фон с синим бордером.',
        preview: `<div class="sec-col medium">
          ${mkSearch({})}
          ${mkSearch({ selected: true })}
          ${mkSearch({ disabled: true })}
          ${mkSearch({ critical: true })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-search">\n  <input class="sb-search-input" type="text" placeholder="Search">\n  <button class="sb-search-btn"><!-- search icon --></button>\n</div>\n\n<!-- Selected -->\n<div class="sb-search selected">...</div>\n\n<!-- Disabled -->\n<div class="sb-search disabled">...</div>\n\n<!-- Critical -->\n<div class="sb-search critical">...</div>`,
        css: COMP_CSS["search-bar"],
      },
      {
        title: 'Line View — States',
        desc: 'Минималистичный вид — только нижняя линия, без фона. Используется в таблицах и компактных интерфейсах.',
        preview: `<div class="sec-col medium">
          ${mkSearch({ lineView: true })}
          ${mkSearch({ lineView: true, selected: true })}
          ${mkSearch({ lineView: true, disabled: true })}
        </div>`,
        html: `<!-- Line View Default -->\n<div class="sb-search line-view">\n  <input class="sb-search-input" type="text" placeholder="Search">\n  <button class="sb-search-btn"><!-- search icon --></button>\n</div>\n\n<!-- Line View Selected -->\n<div class="sb-search line-view selected">...</div>`,
        css: COMP_CSS["search-bar"],
      },
      {
        title: 'Icon Left',
        desc: 'Иконка поиска слева от текста — альтернативное расположение.',
        preview: `<div class="sec-col medium">
          ${mkSearch({ iconLeft: true })}
          ${mkSearch({ iconLeft: true, selected: true })}
          ${mkSearch({ iconLeft: true, lineView: true })}
        </div>`,
        html: `<div class="sb-search icon-left">\n  <span class="sb-search-icon-left"><!-- icon --></span>\n  <input class="sb-search-input" type="text" placeholder="Search">\n  <button class="sb-search-btn"><!-- icon --></button>\n</div>`,
        css: COMP_CSS["search-bar"],
      },
    ],
  });
})();
