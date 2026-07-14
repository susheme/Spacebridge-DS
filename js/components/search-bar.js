// ═══════════════════════════════════════════════════════════════════════════
//  SEARCH_BAR
//  CSS в css/components/search-bar.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["search-bar"] = `.sb-search { display: flex; align-items: center; height: var(--text-field-height-l); min-width: var(--text-field-min-width); max-width: var(--text-field-max-width); border-radius: var(--radius-100); border: var(--border-width-1-5) solid var(--border-soft); background: var(--surface-1); position: relative; overflow: hidden; transition: border-color 0.15s, background 0.15s; }
.sb-search-input { flex: 1; min-width: 0; height: 100%; border: none; outline: none; background: transparent; padding: 0 var(--pad-horiz-8) 0 16px; font-size: var(--title-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); font-family: inherit; color: var(--text-primary); }
.sb-search-input::placeholder { color: var(--text-secondary); }
.sb-search-btn { flex-shrink: 0; height: 100%; width: var(--btn-rounded-min-width); display: flex; align-items: center; justify-content: center; background: var(--surface-1); border: none; border-left: var(--border-width-1-5) solid var(--border-soft); cursor: pointer; color: var(--text-tertiary); transition: color 0.15s, background 0.15s; }
.sb-search:focus-within { background: var(--background); border-color: var(--primary); }
.sb-search:focus-within .sb-search-btn { background: var(--background); border-left-color: var(--primary); color: var(--primary); }
.sb-search:focus-within .sb-search-input { background: var(--background); }
.sb-search.line-view { background: transparent; border: none; border-radius: 0; border-bottom: var(--border-width-1-5) solid var(--border-soft); }
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

  // KBS-подсказка для right-slot: shortcut===true → ⌘K; массив → кастомные
  // клавиши (один key → одиночный kbd, иначе группа). Зависит от kbd-компонента.
  function shortcutSlot(shortcut) {
    if (!shortcut || typeof sbMkKbdGroup !== 'function') return '';
    const keys = Array.isArray(shortcut) ? shortcut : ['⌘', 'K'];
    return keys.length === 1 ? sbMkKbd(keys[0]) : sbMkKbdGroup(keys);
  }

  function mkSearch(opts = {}) {
    const {
      selected, lineView, disabled, critical, iconLeft,
      placeholder = 'Search',
      rightSlot,        // произвольный HTML справа (clear-кнопка и т.п.)
      shortcut,         // KBS-подсказка: true → ⌘K, либо массив клавиш (['⌘','K']).
                        // Удобная обёртка над rightSlot; явный rightSlot важнее.
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
    // Эффективный right-slot: явный rightSlot, иначе KBS из shortcut. Живёт
    // только в icon-left режиме (без него справа — search-кнопка).
    const slot = rightSlot != null ? rightSlot : shortcutSlot(shortcut);
    let rightEl = '';
    if (iconLeft) {
      rightEl = slot ? `<span class="sb-search-right-slot">${slot}</span>` : '';
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
    description: sbT(
      'A search field. Two variants: Filled and Line View. States: Default, Selected, Disabled, Critical. Options: Icon Left (the magnifier moves to a left overlay) and a right slot for a KBS hint or a clear button. Example: the global search in the Navigation Bar with a ⌘+K hint.',
      'Поле поиска. Два варианта: Filled и Line View. Состояния: Default, Selected, Disabled, Critical. Опции: Icon Left (лупа переезжает в overlay слева) и right-slot для KBS-подсказки или clear-кнопки. Пример: глобальный поиск в Navigation Bar с подсказкой ⌘+K.'
    ) + sbDocNote('Tech Info', sbT(
      'Height 32px · border-radius 100px.',
      'Высота 32px · border-radius 100px.'
    )),
    playground: {
      title: 'Search Bar Playground',
      minPreview: 360,  // Search Bar wrapper max-width:360 — нужна полная ширина чтобы не сжимался
      state: { selected: false, lineView: false, disabled: false, critical: false, iconLeft: false, shortcut: false },
      controls(pg) {
        // 2 группы (State / Style) укладываются в pg-controls grid
        // через `.pg-card.wide .pg-controls:has(> .pg-group)` правило.
        return `${sbPgGroup('State', `
              <div class="pg-toggles">
                ${pg.toggle('selected',  'Selected')}
                ${pg.toggle('disabled',  'Disable')}
                ${pg.toggle('critical',  'Critical')}
              </div>
          `)}
          ${sbPgGroup('Style', `
              <div class="pg-toggles">
                ${pg.toggle('lineView',  'Line View')}
                ${pg.toggle('iconLeft',  'Icon Left')}
                ${pg.toggle('shortcut',  'Shortcut', { requires: 'iconLeft' })}
              </div>
          `)}`;
      },
      render(s) { return `<div style="width:100%;max-width:360px">${mkSearch(s)}</div>`; },
      genCode(s) { return { html: mkSearch(s), css: COMP_CSS["search-bar"] }; },
    },
    sections: [
      {
        title: sbT('Filled — States', 'Filled — состояния'),
        desc: sbT(
          'The standard filled look. Default — a gray background; Selected/Focus — the field switches to --background with a blue border. The magnifier lives in the right action button.',
          'Стандартный вид с заливкой. Default — серый фон; Selected/Focus — поле переходит на --background с синим бордером. Лупа — в правой action-кнопке.'
        ),
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
        title: sbT('Line View — States', 'Line View — состояния'),
        desc: sbT(
          'The minimal look — a bottom line only, no background. Used in tables and compact interfaces.',
          'Минималистичный вид — только нижняя линия, без фона. Используется в таблицах и компактных интерфейсах.'
        ),
        preview: `<div class="sec-col medium">
          ${mkSearch({ lineView: true })}
          ${mkSearch({ lineView: true, selected: true })}
          ${mkSearch({ lineView: true, disabled: true })}
        </div>`,
        html: `<!-- Line View Default -->\n<div class="sb-search line-view">\n  <input class="sb-search-input" type="text" placeholder="Search">\n  <button class="sb-search-btn" type="button"><!-- search icon --></button>\n</div>\n\n<!-- Line View Selected -->\n<div class="sb-search line-view selected">...</div>`,
        css: COMP_CSS["search-bar"],
      },
      {
        title: sbT('Icon Left', 'Иконка слева'),
        desc: sbT(
          'The magnifier sits in a left overlay and never eats the input width. The right action button (.sb-search-btn) is not rendered in this variant: the right side holds either nothing or the right slot — a KBS hint or a clear button. The canonical search pattern (Spotlight, GitHub, Linear).',
          'Лупа — в overlay слева и не съедает ширину инпута. Правая action-кнопка (.sb-search-btn) в этом варианте не рендерится: справа либо ничего, либо right-slot — KBS-подсказка или clear-кнопка. Канонический паттерн поиска (Spotlight, GitHub, Linear).'
        ),
        preview: `<div class="sec-col medium">
          ${mkSearch({ iconLeft: true })}
          ${mkSearch({ iconLeft: true, selected: true })}
          ${mkSearch({ iconLeft: true, lineView: true })}
        </div>`,
        html: `<!-- Icon Left, без правого слота -->\n<div class="sb-search icon-left">\n  <span class="sb-search-icon-left"><!-- search icon --></span>\n  <input class="sb-search-input" type="text" placeholder="Search">\n</div>`,
        css: COMP_CSS["search-bar"],
      },
      {
        title: sbT('Icon Left + KBS hint', 'Иконка слева + KBS-подсказка'),
        desc: sbT(
          'The icon on the left plus a KBS hint in the right slot. Used as a global search with a hotkey — like the ⌘+K search in this design system’s nav. The right slot can be hidden on focus via CSS on the parent.',
          'Иконка слева и KBS-подсказка в right-slot. Используется как глобальный поиск с хоткеем — как поиск ⌘+K в навигации этой дизайн-системы. Right-slot в фокусе можно скрыть через CSS на родителе.'
        ),
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
