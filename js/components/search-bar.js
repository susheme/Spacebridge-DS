// ═══════════════════════════════════════════════════════════════════════════
//  SEARCH_BAR
//  CSS в css/components/search-bar.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["search-bar"] = `.sb-search { display: flex; align-items: center; height: var(--text-field-height-l); min-width: var(--text-field-min-width); max-width: var(--text-field-max-width); border-radius: var(--radius-100); border: var(--border-width-1-5) solid var(--border); background: var(--surface-1); position: relative; overflow: hidden; transition: border-color 0.15s, background 0.15s; }
.sb-search-input { flex: 1; min-width: 0; height: 100%; border: none; outline: none; background: transparent; padding: 0 var(--pad-horiz-8) 0 16px; font-size: var(--title-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); font-family: inherit; color: var(--text-primary); }
.sb-search-input::placeholder { color: var(--text-secondary); }
.sb-search-btn { flex-shrink: 0; height: 100%; width: var(--btn-rounded-min-width); display: flex; align-items: center; justify-content: center; background: var(--surface-1); border: none; border-left: var(--border-width-1-5) solid var(--border); cursor: pointer; color: var(--text-tertiary); transition: color 0.15s, background 0.15s; }
.sb-search:focus-within { background: var(--background); border-color: var(--primary); }
.sb-search:focus-within .sb-search-btn { background: var(--background); border-left-color: var(--primary); color: var(--primary); }
.sb-search:focus-within .sb-search-input { background: var(--background); }
.sb-search.line-view { background: transparent; border: none; border-radius: 0; border-bottom: var(--border-width-1-5) solid var(--border); }
.sb-search.line-view .sb-search-btn { background: transparent; border-left: none; }
.sb-search.line-view:focus-within { background: transparent; border-bottom-color: var(--primary); }
.sb-search.disabled { pointer-events: none; cursor: not-allowed; }
.sb-search.disabled .sb-search-input, .sb-search.disabled .sb-search-input::placeholder { color: var(--border); }
.sb-search.disabled .sb-search-btn { background: var(--surface-1); color: var(--border); }
.sb-search.disabled .sb-search-icon-left { color: var(--border); }
.sb-search.critical { border-color: var(--error); }
.sb-search.icon-left .sb-search-input { padding-left: var(--pad-horiz-40); }
.sb-search-icon-left { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); display: flex; align-items: center; pointer-events: none; }
.sb-search-right-slot { flex-shrink: 0; display: flex; align-items: center; padding: 0 var(--pad-vert-8) 0 var(--pad-vert-8); color: var(--text-secondary); }`;

// --- SEARCH BAR ---
(() => {
  const SEARCH_ICON = SB_GLYPHS.search;

  function mkSearch(opts = {}) {
    const {
      selected, lineView, disabled, critical, iconLeft,
      placeholder = 'Search',
      rightSlot,        // произвольный HTML справа (KBS-подсказка, clear-кнопка и т.п.)
      inputId,          // опциональный id для <input> (NAV-search и подобные кейсы)
    } = opts;

    let cls = 'sb-search';
    if (selected)  cls += ' selected';
    if (lineView)  cls += ' line-view';
    if (disabled)  cls += ' disabled';
    if (critical)  cls += ' critical';
    if (iconLeft)  cls += ' icon-left';

    const iconLeftEl = iconLeft
      ? `<span class="sb-search-icon-left">${SEARCH_ICON}</span>` : '';
    const idAttr = inputId ? ` id="${inputId}"` : '';

    // В icon-left варианте .sb-search-btn НЕ рендерим (иконка уже слева).
    // Справа — либо rightSlot (KBS / clear / etc), либо ничего.
    // Без icon-left — старая разметка с .sb-search-btn.
    let rightEl = '';
    if (iconLeft) {
      rightEl = rightSlot
        ? `<span class="sb-search-right-slot">${rightSlot}</span>`
        : '';
    } else {
      rightEl = `<button class="sb-search-btn" type="button" tabindex="-1">${SEARCH_ICON}</button>`;
    }

    return `<div class="${cls}">
  ${iconLeftEl}<input class="sb-search-input"${idAttr} type="text" placeholder="${placeholder}">
  ${rightEl}
</div>`;
  }

  // Expose helper для NAV-search и dev-консоли.
  window.sbMkSearch = mkSearch;

  sbRegister({
    name: 'search-bar',
    title: 'Search Bar',
    description: 'Поле поиска. Высота 32px, border-radius 100px. Варианты: Filled (с фоном) и LineView (только нижняя линия). Состояния: Default, Selected, Disabled, Critical. Опции: Icon Left (лупа в overlay слева вместо правой кнопки) + опциональный right-slot для KBS-подсказок («⌘+K») или clear-кнопок.',
    playground: {
      title: 'Search Bar Playground',
      state: { selected: false, lineView: false, disabled: false, critical: false, iconLeft: false },
      controls(pg) {
        return `<div class="pg-toggles">
          ${pg.toggle('selected',  'Selected')}
          ${pg.toggle('lineView',  'Line View')}
          ${pg.toggle('disabled',  'Disable')}
          ${pg.toggle('critical',  'Critical')}
          ${pg.toggle('iconLeft',  'Icon Left')}
        </div>`;
      },
      render(s) { return `<div style="width:100%;max-width:360px">${mkSearch(s)}</div>`; },
      genCode(s) { return { html: mkSearch(s), css: COMP_CSS["search-bar"] }; },
    },
    sections: [
      {
        title: 'Filled — States',
        desc: 'Стандартный вид с заливкой. Default — серый фон, Selected/Focus — белый фон с синим бордером. Иконка лупы — в правой кнопке-action.',
        preview: `<div class="sec-col medium">
          ${mkSearch({})}
          ${mkSearch({ selected: true })}
          ${mkSearch({ disabled: true })}
          ${mkSearch({ critical: true })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-search">\n  <input class="sb-search-input" type="text" placeholder="Search">\n  <button class="sb-search-btn" type="button"><!-- search icon --></button>\n</div>\n\n<!-- Selected -->\n<div class="sb-search selected">...</div>\n\n<!-- Disabled -->\n<div class="sb-search disabled">...</div>\n\n<!-- Critical -->\n<div class="sb-search critical">...</div>`,
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
        html: `<!-- Line View Default -->\n<div class="sb-search line-view">\n  <input class="sb-search-input" type="text" placeholder="Search">\n  <button class="sb-search-btn" type="button"><!-- search icon --></button>\n</div>\n\n<!-- Line View Selected -->\n<div class="sb-search line-view selected">...</div>`,
        css: COMP_CSS["search-bar"],
      },
      {
        title: 'Icon Left',
        desc: 'Лупа — в overlay слева, никогда не съедает ширину input\'а. В этом варианте правая action-кнопка (.sb-search-btn) НЕ рендерится: справа либо ничего, либо right-slot (KBS-подсказка / clear-кнопка). Канонический паттерн поиска (Spotlight, GitHub, Linear).',
        preview: `<div class="sec-col medium">
          ${mkSearch({ iconLeft: true })}
          ${mkSearch({ iconLeft: true, selected: true })}
          ${mkSearch({ iconLeft: true, lineView: true })}
        </div>`,
        html: `<!-- Icon Left, без правого слота -->\n<div class="sb-search icon-left">\n  <span class="sb-search-icon-left"><!-- search icon --></span>\n  <input class="sb-search-input" type="text" placeholder="Search">\n</div>`,
        css: COMP_CSS["search-bar"],
      },
      {
        title: 'Icon Left + KBS hint',
        desc: 'Иконка слева + KBS-подсказка справа в right-slot. Используется как глобальный поиск с хоткеем (например, в NAV дизайн-системы — ⌘+K). Right-slot в фокусе можно скрывать через CSS на родителе.',
        preview: `<div class="sec-col medium">
          ${mkSearch({ iconLeft: true, rightSlot: sbMkKbdGroup(['⌘','K']) })}
          ${mkSearch({ iconLeft: true, rightSlot: sbMkKbd('/') })}
          ${mkSearch({ iconLeft: true, lineView: true, rightSlot: sbMkKbdGroup(['⌘','K']) })}
        </div>`,
        html: `<div class="sb-search icon-left">\n  <span class="sb-search-icon-left"><!-- search icon --></span>\n  <input class="sb-search-input" type="text" placeholder="Search">\n  <span class="sb-search-right-slot">\n    <span class="sb-kbd-group">\n      <kbd class="sb-kbd">⌘</kbd>\n      <span class="sb-kbd-sep">+</span>\n      <kbd class="sb-kbd">K</kbd>\n    </span>\n  </span>\n</div>`,
        css: COMP_CSS["search-bar"],
      },
    ],
  });
})();
