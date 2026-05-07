// ═══════════════════════════════════════════════════════════════════════════
//  SELECTORS
//  CSS в css/components/selectors.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.selector = `.sb-sel { display: flex; align-items: center; height: var(--text-field-height-l); min-width: var(--text-field-min-width); max-width: var(--text-field-max-width); border-radius: var(--radius-2); border: var(--border-width-1-5) solid var(--border); background: var(--surface-1); overflow: hidden; transition: border-color 0.15s, background 0.15s; }
.sb-sel-row .sb-sel { flex: 1; }
.sb-sel-val { flex: 1; padding: 0 var(--pad-horiz-8); min-width: 0; font-size: var(--title-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); color: var(--text-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sb-sel-right { flex-shrink: 0; height: 100%; padding: var(--pad-vert-4) var(--pad-horiz-8); display: flex; align-items: center; justify-content: center; background: var(--background); border-left: var(--border-width-1-5) solid var(--border); border-radius: 0 2px 2px 0; transition: border-color 0.15s, background 0.15s; }
.sb-sel-row { display: flex; align-items: center; gap: var(--gap-horiz-s); width: 100%; }
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
.sb-sel.open .sb-chevron { transform: rotate(180deg); }`;

// --- SELECTORS ---
(() => {
  const CHEVRON_DOWN = sbIcon('arrow-down-s-line', 'L');
  const GEMINI_ICON  = sbIcon('gemini-fill', 'L');
  const ADD_ICON     = sbIcon('add-line', 'L');

  function mkSel(opts = {}) {
    const { value = 'Selected value', placeholder, selected, critical, disabled, open, fieldMode } = opts;
    let cls = 'sb-sel';
    if (selected)    cls += ' selected';
    if (critical)    cls += ' critical';
    if (disabled)    cls += ' disabled';
    if (placeholder) cls += ' placeholder';
    if (open)        cls += ' open';
    const widthCls = fieldMode ? 'sec-w100' : 'sec-narrow';
    const displayVal = placeholder ? 'Select an option...' : value;
    return `<div class="${cls} ${widthCls}">
      <span class="sb-sel-val">${displayVal}</span>
      <div class="sb-sel-right">
        <div class="sb-chevron">${CHEVRON_DOWN}</div>
      </div>
    </div>`;
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

  sbRegister({
    name: 'selectors',
    title: 'Selectors / Dropdowns',
    description: 'Поле выбора значения. Шеврон из компонента Chevron Button. Варианты: с иконкой слева, с кнопкой добавления, в обёртке sb-field. Состояния: Default, Placeholder, Selected, Critical, Disabled.',
    playground: {
      title: 'Selector Playground',
      wide: true,
      state: {
        placeholder: false, selected: false, critical: false, disabled: false, open: false,
        showIcon: false, showAddBtn: false,
        showLabel: false, showSub: false, twoRow: false, showDesc: false,
      },
      controls(pg) {
        return `<div class="pg-toggles-3">
          ${pg.toggle('placeholder', 'Placeholder')}
          ${pg.toggle('selected',   'Selected')}
          ${pg.toggle('critical',   'Critical')}
          ${pg.toggle('disabled',   'Disable')}
          ${pg.toggle('open',       'Open')}
          ${pg.toggle('showIcon',   'Icon Left')}
          ${pg.toggle('showAddBtn', 'Add Button')}
          ${pg.toggle('showSub',    'Subscription')}
          ${pg.toggle('showLabel',  'Label')}
          ${pg.toggle('twoRow',     '2 Rows',      { requires: 'showLabel' })}
          ${pg.toggle('showDesc',   'Description', { requires: 'showLabel' })}
        </div>`;
      },
      render(s) {
        const selOpts = { placeholder: s.placeholder, selected: s.selected, critical: s.critical, disabled: s.disabled, open: s.open };
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
        const selOpts = { placeholder: s.placeholder, selected: s.selected, critical: s.critical, disabled: s.disabled, open: s.open };
        const rowOpts = { showIcon: s.showIcon, showAddBtn: s.showAddBtn };
        const fOpts   = {
          label:        s.showLabel ? 'Label' : null,
          subscription: s.showSub   ? 'Subscription text' : null,
          description:  s.showDesc && s.twoRow ? 'Description text' : null,
          twoRow:       s.twoRow && s.showLabel,
        };
        const needsField = !!(s.showLabel || s.showSub);
        const needsRow   = s.showIcon || s.showAddBtn;
        const css = needsField
          ? COMP_CSS.chevron + '\n' + COMP_CSS.selector + '\n' + COMP_CSS["input-field-wrap"]
          : COMP_CSS.chevron + '\n' + COMP_CSS.selector;
        return { html: mkSelField(selOpts, fOpts, rowOpts), css };
      },
    },
    sections: [
      {
        title: 'States',
        desc: 'Default, Placeholder, Selected (активный), Critical, Disabled.',
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
        title: 'Row Variant',
        desc: 'Иконка слева (AI-ассистент и т.п.), кнопка добавления справа. Используй .sb-sel-row как обёртку.',
        preview: `<div style="width:400px;display:flex;flex-direction:column;gap: var(--gap-horiz-m)">
          ${mkSelRow({}, { showIcon: true })}
          ${mkSelRow({}, { showAddBtn: true })}
          ${mkSelRow({}, { showIcon: true, showAddBtn: true })}
          ${mkSelRow({ disabled: true }, { showIcon: true, showAddBtn: true })}
        </div>`,
        html: `<!-- Icon + Selector + Add button -->\n<div class="sb-sel-row">\n  <span class="sb-sel-icon-left"><!-- icon --></span>\n  <div class="sb-sel">\n    <span class="sb-sel-val">Selected value</span>\n    <div class="sb-sel-right">\n      <div class="sb-chevron"><!-- arrow-down-s-line --></div>\n    </div>\n  </div>\n  <button class="sb-sel-btn-add"><!-- add-line --></button>\n</div>`,
        css: COMP_CSS.chevron + '\n' + COMP_CSS.selector,
      },
      {
        title: 'With Label & Subscription',
        desc: 'Selector внутри sb-field — Label сверху, Subscription снизу. При Critical — Subscription красится error.',
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
        title: '2-row Layout',
        desc: 'Label слева, Selector справа. Используй .sb-field-group для выравнивания нескольких полей.',
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
