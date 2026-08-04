// ═══════════════════════════════════════════════════════════════════════════
//  SELECTORS
//  CSS в css/components/selectors.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.selector = `.sb-sel { display: flex; align-items: center; height: var(--text-field-height-l); min-width: var(--text-field-min-width); max-width: var(--text-field-max-width); border-radius: var(--radius-2); border: var(--border-width-1-5) solid var(--border); background: var(--surface-1); overflow: hidden; transition: border-color 0.15s, background 0.15s; }
.sb-sel-row .sb-sel { flex: 1; }
.sb-sel-val { flex: 1; padding: 0 var(--pad-horiz-8); min-width: 0; font-size: var(--title-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); color: var(--text-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sb-sel-right { flex-shrink: 0; height: 100%; padding: var(--pad-vert-4) var(--pad-horiz-8); display: flex; align-items: center; justify-content: center; background: var(--background); border-left: var(--border-width-1-5) solid var(--border); border-radius: 0 2px 2px 0; transition: border-color 0.15s, background 0.15s; }
.sb-sel-row { display: flex; align-items: center; gap: var(--gap-horiz-s); width: 100%; max-width: var(--text-field-max-width); }
.sb-sel-icon-left { flex-shrink: 0; display: flex; align-items: center; color: var(--primary); }
.sb-sel-btn-add { flex-shrink: 0; width: var(--btn-rounded-max-width-s); height: var(--btn-rounded-max-height-s); padding: var(--pad-horiz-2); border-radius: var(--radius-4); background: var(--surface-1); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--primary); }
.sb-sel.selected { background: var(--background); border-color: var(--primary); }
.sb-sel.selected .sb-sel-right { border-left-color: var(--primary); background: var(--background); }
.sb-sel.critical { background: var(--background); border-color: var(--error); }
.sb-sel.critical .sb-sel-right { border-left-color: var(--error); background: var(--background); }
.sb-sel.disabled { pointer-events: none; }
.sb-sel.disabled .sb-sel-val { color: var(--border); }
.sb-sel.disabled .sb-sel-right { background: var(--surface-1); }
.sb-sel.disabled .sb-chevron { color: var(--border); }
.sb-sel.placeholder .sb-sel-val { color: var(--text-secondary); }
.sb-sel.disabled ~ .sb-sel-btn-add { pointer-events: none; color: var(--border); }
.sb-sel.open { border-color: var(--primary); }
.sb-sel.open .sb-sel-right { border-left-color: var(--primary); }
.sb-sel.open .sb-chevron { transform: rotate(180deg); }
.sb-popover-wrap.sb-sel-pop { display: flex; min-width: var(--text-field-min-width); max-width: var(--text-field-max-width); }
.sb-sel-pop > .sb-sel { flex: 1 1 auto; }
.sb-sel-row > .sb-sel-pop { flex: 1 1 auto; }
.sb-sel-pop.is-open .sb-sel { border-color: var(--primary); }
.sb-sel-pop.is-open .sb-sel-right { border-left-color: var(--primary); }
.sb-sel-pop.is-open .sb-chevron { transform: rotate(180deg); }`;

// --- SELECTORS ---
(() => {
  const GEMINI_ICON  = sbIcon('gemini-fill', 'L');
  const ADD_ICON     = sbIcon('add-line', 'L');

  // Демо-набор опций для доков: частотные диапазоны терминала.
  const DEMO_OPTIONS = ['C-band', 'Ku-band', 'Ka-band', 'X-band', 'L-band'];

  let selUid = 0;

  // options — массив строк. Передан → селектор живой: поле становится
  // триггером Popover'а, панель = карточка Context Menu с ячейками.
  // Не передан → статичная разметка (состояния в доках, как было).
  // disabled живым не делаем: у поля pointer-events: none, но клик поймала бы
  // обёртка попапа — панель открывалась бы у выключенного селектора.
  function mkSel(opts = {}) {
    const { value = 'Selected value', placeholder, selected, critical, disabled, open, fieldMode, options } = opts;
    let cls = 'sb-sel';
    if (selected)    cls += ' selected';
    if (critical)    cls += ' critical';
    if (disabled)    cls += ' disabled';
    if (placeholder) cls += ' placeholder';
    if (open)        cls += ' open';
    const widthCls = fieldMode ? 'sec-w100' : 'sec-narrow';
    const displayVal = placeholder ? 'Select an option...' : value;
    const live = Array.isArray(options) && options.length > 0 && !disabled;
    const field = `<div class="${cls}${live ? '' : ' ' + widthCls}">
      <span class="sb-sel-val">${displayVal}</span>
      <div class="sb-sel-right">
        ${sbMkChevron()}
      </div>
    </div>`;
    if (!live) return field;
    // Панель уезжает порталом в <body>, поэтому от ячейки вверх по DOM до поля
    // не дойти. Связываем обёртку и панель одним uid: id панели несёт номер,
    // обёртка — тот же номер в data-атрибуте (см. sbSelPick).
    const uid = ++selUid;
    const cells = options.map(label => sbMkContextCell({
      label,
      state: !placeholder && label === value ? 'selected' : undefined,
    }));
    return sbMkPopover({
      wrapCls: `sb-sel-pop ${widthCls}`,
      wrapAttrs: `data-sel="${uid}"`,
      trigger: field,
      content: sbMkContextCard(cells),
      placement: 'bottom-start',
      matchWidth: true,   // панель шириной с поле
      cls: 'sb-sel-panel',
      id: `sb-sel-pop-${uid}`,
    });
  }

  // Клик по ячейке: галочку внутри карточки переставляет сам Context Menu
  // (sbSelectContextCell в разметке ячейки), закрытие панели — Popover
  // (closeOnSelect). Нам остаётся записать выбранное значение в поле.
  // Слушатель делегированный и один на страницу: панели рендерятся заново на
  // каждой перерисовке SPA, вешать хендлеры поштучно нечем.
  if (!window.__sbSelPickBound) {
    window.__sbSelPickBound = true;
    document.addEventListener('click', e => {
      const cell = e.target.closest && e.target.closest('.sb-sel-panel .sb-ctx-cell');
      if (!cell || cell.classList.contains('is-disabled')) return;
      const panel = cell.closest('.sb-popover');
      const uid = panel && panel.id.replace('sb-sel-pop-', '');
      const wrap = uid && document.querySelector(`.sb-sel-pop[data-sel="${uid}"]`);
      if (!wrap) return;
      const val = wrap.querySelector('.sb-sel-val');
      const label = cell.querySelector('.sb-ctx-cell-label');
      if (!val || !label) return;
      val.textContent = label.textContent.trim();
      // Первый выбор снимает placeholder-вид и включает selected-состояние.
      const sel = wrap.querySelector('.sb-sel');
      if (sel) { sel.classList.remove('placeholder'); sel.classList.add('selected'); }
    });
  }

  function mkSelRow(opts = {}, rowOpts = {}) {
    const { showIcon, showAddBtn } = rowOpts;
    const selEl  = mkSel({ ...opts, fieldMode: true });
    const iconEl = showIcon   ? `<span class="sb-sel-icon-left">${GEMINI_ICON}</span>` : '';
    const addEl  = showAddBtn ? `<button class="sb-sel-btn-add">${ADD_ICON}</button>` : '';
    return `<div class="sb-sel-row">${iconEl}${selEl}${addEl}</div>`;
  }

  function mkSelField(selOpts = {}, fOpts = {}, rowOpts = {}) {
    const { label, subscription, description, twoRow } = fOpts;
    const hasRow  = rowOpts.showIcon || rowOpts.showAddBtn;
    // rowWidth не нужен внутри поля — ширину контролирует sb-field
    const innerRowOpts = label ? { ...rowOpts, rowWidth: undefined } : rowOpts;
    const innerEl = hasRow
      ? mkSelRow(selOpts, innerRowOpts)
      : mkSel({ ...selOpts, fieldMode: true });
    if (!label && !subscription) {
      return hasRow
        ? `<div class="sec-wide">${innerEl}</div>`
        : mkSel(selOpts);
    }
    const subEl = subscription
      ? `<span class="sb-field-sub${selOpts.critical ? ' sb-field-sub--error' : ''}">${subscription}</span>`
      : '';
    if (twoRow) {
      return `<div class="sb-field two-row">
        <div class="sb-field-left">
          ${label       ? `<span class="sb-field-label">${label}</span>` : ''}
          ${description ? `<span class="sb-field-desc">${description}</span>` : ''}
        </div>
        <div class="sb-field-right">${innerEl}${subEl}</div>
      </div>`;
    }
    return `<div class="sb-field">
      ${label ? `<span class="sb-field-label">${label}</span>` : ''}
      ${innerEl}${subEl}
    </div>`;
  }

  // Экспорт фабрик: доки ссылаются на них как на публичный API, и потребители
  // обязаны собирать селектор ими, а не руками по классам.
  window.sbMkSel      = mkSel;
  window.sbMkSelRow   = mkSelRow;
  window.sbMkSelField = mkSelField;

  sbRegister({
    name: 'selectors',
    title: 'Selectors / Dropdowns',
    description: sbT(
      'A value picker. With an options list it opens a working dropdown built on Popover and a Context Menu card; without one it stays a static field for documenting states. The chevron comes from the Chevron Button component. Variants: with a left icon, with an add button, inside an sb-field wrapper. States: Default, Placeholder, Selected, Critical, Disabled. Example: a frequency band selector in a terminal form.',
      'Поле выбора значения. Со списком опций открывает рабочую выпадашку на Popover и карточке Context Menu; без него остаётся статичным полем для показа состояний. Шеврон — из компонента Chevron Button. Варианты: с иконкой слева, с кнопкой добавления, в обёртке sb-field. Состояния: Default, Placeholder, Selected, Critical, Disabled. Пример: выбор частотного диапазона в форме терминала.'
    ),
    playground: {
      title: 'Selector Playground',
      wide: true,
      state: {
        placeholder: false, selected: false, critical: false, disabled: false, open: false,
        showIcon: false, showAddBtn: false,
        showLabel: false, showSub: false, twoRow: false, showDesc: false,
      },
      controls(pg) {
        // 3 группы (State / Style / Anatomy) укладываются в pg-controls grid.
        return `${sbPgGroup('State', `
              <div class="pg-toggles">
                ${pg.toggle('placeholder', 'Placeholder')}
                ${pg.toggle('selected',   'Selected')}
                ${pg.toggle('critical',   'Critical')}
                ${pg.toggle('disabled',   'Disable')}
                ${pg.toggle('open',       'Open')}
              </div>
          `)}
          ${sbPgGroup('Style', `
              <div class="pg-toggles">
                ${pg.toggle('showIcon',   'Icon Left')}
                ${pg.toggle('showAddBtn', 'Add Button')}
              </div>
          `)}
          ${sbPgGroup('Anatomy', `
              <div class="pg-toggles">
                ${pg.toggle('showLabel',  'Label')}
                ${pg.toggle('showSub',    'Subscription')}
                ${pg.toggle('twoRow',     '2 Rows',      { requires: 'showLabel' })}
                ${pg.toggle('showDesc',   'Description', { requires: 'showLabel' })}
              </div>
          `)}`;
      },
      render(s) {
        // Плейграунд живой: опции передаём всегда. Тумблер Open остаётся
        // статичным состоянием из спеки — красит поле, панель им не двигаем.
        const selOpts = { placeholder: s.placeholder, selected: s.selected, critical: s.critical, disabled: s.disabled, open: s.open, options: DEMO_OPTIONS };
        const rowOpts = { showIcon: s.showIcon, showAddBtn: s.showAddBtn };
        const fOpts   = {
          label:        s.showLabel ? 'Label' : null,
          subscription: s.showSub   ? 'Subscription text' : null,
          description:  s.showDesc && s.twoRow ? 'Description text' : null,
          twoRow:       s.twoRow && s.showLabel,
        };
        return `<div style="width:100%;max-width:360px">${mkSelField(selOpts, fOpts, rowOpts)}</div>`;
      },
      genCode(s) {
        const selOpts = { placeholder: s.placeholder, selected: s.selected, critical: s.critical, disabled: s.disabled, open: s.open, options: DEMO_OPTIONS };
        const rowOpts = { showIcon: s.showIcon, showAddBtn: s.showAddBtn };
        const fOpts   = {
          label:        s.showLabel ? 'Label' : null,
          subscription: s.showSub   ? 'Subscription text' : null,
          description:  s.showDesc && s.twoRow ? 'Description text' : null,
          twoRow:       s.twoRow && s.showLabel,
        };
        const needsField = !!(s.showLabel || s.showSub);
        // Живая выпадашка тянет за собой CSS Popover'а и Context Menu —
        // копипаст из code panel должен работать как есть.
        const live = !s.disabled;
        const css = [
          COMP_CSS.chevron,
          COMP_CSS.selector,
          needsField ? COMP_CSS["input-field-wrap"] : '',
          live ? COMP_CSS.popover : '',
          live ? COMP_CSS.contextMenu : '',
        ].filter(Boolean).join('\n');
        return { html: mkSelField(selOpts, fOpts, rowOpts), css };
      },
    },
    sections: [
      {
        title: sbT('Live Dropdown', 'Живая выпадашка'),
        desc: sbT(
          'Pass an options list and the field becomes a working dropdown. The panel is a Popover — it flips when there is no room below, shifts along the edge instead of being clipped, and portals to the body so no scrolling or transformed ancestor can cut it off. Its minimum width matches the field. The panel itself is a Context Menu card with cells: the check mark moves to the picked option, the value lands in the field, the panel closes. Escape and a click outside close it too. A disabled selector stays inert — no panel at all. Example: a frequency band picker in a terminal form.',
          'Передайте список опций — поле становится рабочей выпадашкой. Панель — это Popover: переворачивается, когда снизу нет места, сдвигается вдоль края вместо обрезки и уезжает порталом в body, поэтому её не срежет ни скролл, ни трансформированный предок. Минимальная ширина панели равна ширине поля. Сама панель — карточка Context Menu с ячейками: галочка переезжает на выбранную опцию, значение попадает в поле, панель закрывается. Escape и клик вне тоже закрывают. Выключенный селектор остаётся мёртвым — панели нет вовсе. Пример: выбор частотного диапазона в форме терминала.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>API:</b>'
          + '<ul><li><code>sbMkSel({ options, value, placeholder })</code> — <code>options</code> is an array of strings;</li><li><code>value</code> marks the pre-selected cell, <code>placeholder</code> leaves the field empty;</li><li>the same options pass through <code>sbMkSelRow</code> and <code>sbMkSelField</code>.</li></ul>'
          + '<b>Composition:</b>'
          + '<ul><li>Panel — <code>sbMkPopover({ placement: \'bottom-start\', matchWidth: true })</code>;</li><li>card and cells — <code>sbMkContextCard</code> / <code>sbMkContextCell</code>;</li><li>selection inside the card is owned by Context Menu, closing by Popover.</li></ul>'
          + '<b>Open state:</b>'
          + '<ul><li>While the panel is open the wrapper carries <code>.is-open</code> — the field keeps the primary border and the flipped chevron.</li></ul>',
          '<b>API:</b>'
          + '<ul><li><code>sbMkSel({ options, value, placeholder })</code> — <code>options</code> это массив строк;</li><li><code>value</code> помечает заранее выбранную ячейку, <code>placeholder</code> оставляет поле пустым;</li><li>те же опции проходят через <code>sbMkSelRow</code> и <code>sbMkSelField</code>.</li></ul>'
          + '<b>Состав:</b>'
          + '<ul><li>Панель — <code>sbMkPopover({ placement: \'bottom-start\', matchWidth: true })</code>;</li><li>карточка и ячейки — <code>sbMkContextCard</code> / <code>sbMkContextCell</code>;</li><li>выделением внутри карточки владеет Context Menu, закрытием — Popover.</li></ul>'
          + '<b>Открытое состояние:</b>'
          + '<ul><li>Пока панель открыта, обёртка носит <code>.is-open</code> — поле держит рамку primary и развёрнутый шеврон.</li></ul>'
        )),
        col: true, interactive: true,
        preview: `<div class="sec-col narrow gap-md">
          ${mkSel({ options: DEMO_OPTIONS, value: 'Ku-band' })}
          ${mkSel({ options: DEMO_OPTIONS, placeholder: true })}
          ${mkSelField({ options: DEMO_OPTIONS, value: 'Ka-band' }, { label: 'Frequency Band', subscription: 'Pick the uplink band' })}
        </div>`,
        html: `<!-- sbMkSel({ options: ['C-band', 'Ku-band', 'Ka-band'], value: 'Ku-band' }) -->
<span class="sb-popover-wrap sb-sel-pop sec-narrow" data-sel="1" onclick="sbPopoverToggle(this, event)">
  <div class="sb-sel">
    <span class="sb-sel-val">Ku-band</span>
    <div class="sb-sel-right"><div class="sb-chevron"><!-- arrow-down-s-line --></div></div>
  </div>
  <div class="sb-popover sb-sel-panel" id="sb-sel-pop-1" role="dialog" tabindex="-1"
       data-placement="bottom-start" data-side="bottom" data-match-width="true">
    <div class="sb-ctx-card">
      <!-- sbMkContextCell({ label: 'C-band' }) … -->
    </div>
  </div>
</span>`,
        css: COMP_CSS.chevron + '\n' + COMP_CSS.selector + '\n' + COMP_CSS.popover + '\n' + COMP_CSS.contextMenu,
      },
      {
        title: sbT('States', 'Состояния'),
        desc: sbT(
          'Default, Placeholder, Selected (active), Critical, Disabled.',
          'Default, Placeholder, Selected (активный), Critical, Disabled.'
        ),
        preview: `<div class="sec-col narrow gap-md">
          ${mkSel({})}
          ${mkSel({ placeholder: true })}
          ${mkSel({ selected: true })}
          ${mkSel({ open: true })}
          ${mkSel({ critical: true })}
          ${mkSel({ disabled: true })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-sel">\n  <span class="sb-sel-val">Selected value</span>\n  <div class="sb-sel-right">\n    <div class="sb-chevron"><!-- arrow-down-s-line --></div>\n  </div>\n</div>\n\n<!-- Open -->\n<div class="sb-sel open">\n  <span class="sb-sel-val">Selected value</span>\n  <div class="sb-sel-right">\n    <div class="sb-chevron"><!-- arrow-down-s-line --></div>\n  </div>\n</div>\n\n<!-- Placeholder -->\n<div class="sb-sel placeholder">\n  <span class="sb-sel-val">Select an option...</span>\n  <div class="sb-sel-right">\n    <div class="sb-chevron"><!-- arrow-down-s-line --></div>\n  </div>\n</div>`,
        css: COMP_CSS.chevron + '\n' + COMP_CSS.selector,
      },
      {
        title: sbT('Row Variant', 'Row-вариант'),
        desc: sbT(
          'A left icon (an AI assistant and the like) and an add button on the right. The .sb-sel-row wrapper lays it out.',
          'Иконка слева (AI-ассистент и подобное), кнопка добавления справа. Раскладку даёт обёртка .sb-sel-row.'
        ),
        preview: `${sbMkFlex({ dir: 'col', gap: 'm', width: '400px', content: `${mkSelRow({}, { showIcon: true })}
          ${mkSelRow({}, { showAddBtn: true })}
          ${mkSelRow({}, { showIcon: true, showAddBtn: true })}
          ${mkSelRow({ disabled: true }, { showIcon: true, showAddBtn: true })}` })}`,
        html: `<!-- Icon + Selector + Add button -->\n<div class="sb-sel-row">\n  <span class="sb-sel-icon-left"><!-- icon --></span>\n  <div class="sb-sel">\n    <span class="sb-sel-val">Selected value</span>\n    <div class="sb-sel-right">\n      <div class="sb-chevron"><!-- arrow-down-s-line --></div>\n    </div>\n  </div>\n  <button class="sb-sel-btn-add"><!-- add-line --></button>\n</div>`,
        css: COMP_CSS.chevron + '\n' + COMP_CSS.selector,
      },
      {
        title: sbT('With Label & Subscription', 'С Label и Subscription'),
        desc: sbT(
          'The selector inside sb-field — the label above, the subscription below. In the Critical state the subscription turns error-colored.',
          'Selector внутри sb-field — Label сверху, Subscription снизу. При Critical подпись красится в error.'
        ),
        preview: `<div class="sec-col narrow gap-lg">
          ${mkSelField({},               { label: 'Label' })}
          ${mkSelField({},               { label: 'Label', subscription: 'Subscription text' })}
          ${mkSelField({ critical: true }, { label: 'Label', subscription: 'Wrong selection' })}
          ${mkSelField({ disabled: true }, { label: 'Label', subscription: 'Subscription text' })}
        </div>`,
        html: `<div class="sb-field">\n  <span class="sb-field-label">Label</span>\n  <div class="sb-sel">\n    <span class="sb-sel-val">Selected value</span>\n    <div class="sb-sel-right">\n      <div class="sb-chevron"><!-- arrow-down-s-line --></div>\n    </div>\n  </div>\n  <span class="sb-field-sub">Subscription text</span>\n</div>`,
        css: COMP_CSS.chevron + '\n' + COMP_CSS.selector + '\n' + COMP_CSS["input-field-wrap"],
      },
      {
        title: sbT('2-row Layout', 'Двухрядный layout'),
        desc: sbT(
          'The label on the left, the selector on the right. The .sb-field-group wrapper aligns several fields.',
          'Label слева, Selector справа. Обёртка .sb-field-group выравнивает несколько полей.'
        ),
        preview: `<div class="sb-field-group sec-xl">
          ${mkSelField({}, { label: 'Label', twoRow: true })}
          ${mkSelField({}, { label: 'Label', subscription: 'Subscription text', twoRow: true })}
          ${mkSelField({}, { label: 'Label', description: 'Description text', subscription: 'Subscription text', twoRow: true })}
          ${mkSelField({}, { label: 'Label', description: 'Description text', twoRow: true })}
        </div>`,
        html: `<div class="sb-field-group">\n  <div class="sb-field two-row">\n    <div class="sb-field-left"><span class="sb-field-label">Label</span></div>\n    <div class="sb-field-right">\n      <div class="sb-sel">\n        <span class="sb-sel-val">Selected value</span>\n        <div class="sb-sel-right"><button class="sb-chevron"><!-- arrow-down-s-line --></button></div>\n      </div>\n    </div>\n  </div>\n</div>`,
        css: COMP_CSS.chevron + '\n' + COMP_CSS.selector + '\n' + COMP_CSS["input-field-wrap"],
      },
    ],
  });
})();
