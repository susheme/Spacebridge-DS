// ═══════════════════════════════════════════════════════════════════════════
//  CHECKBOX
//  CSS в css/components/checkbox.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.checkbox = `.sb-checkbox {
  display: inline-flex; align-items: center; gap: var(--gap-horiz-s);
  cursor: pointer; user-select: none;
}
.sb-checkbox-box {
  width: 20px; height: 20px; flex-shrink: 0;
  border-radius: var(--radius-4); border: var(--border-width-1-5) solid var(--text-secondary);
  background: var(--background);
  display: flex; align-items: center; justify-content: center;
  box-sizing: border-box; transition: border-color 0.15s, background 0.15s;
}
.sb-checkbox:hover:not(.disabled):not(.checked):not(.indeterminate) .sb-checkbox-box,
.sb-checkbox.hover:not(.checked):not(.indeterminate) .sb-checkbox-box { border-color: var(--primary); background: var(--surface-1); }
.sb-checkbox.checked .sb-checkbox-box,
.sb-checkbox.indeterminate .sb-checkbox-box { background: var(--primary); border-color: var(--primary); }
.sb-checkbox.disabled { cursor: not-allowed; pointer-events: none; }
.sb-checkbox.disabled .sb-checkbox-box { border-color: transparent; background: var(--surface-1); }
.sb-checkbox.disabled.checked .sb-checkbox-box { background: var(--surface-1); border-color: transparent; }
.sb-checkbox-label { font-size: var(--body-font-size-m); font-weight: var(--font-weight-bold); line-height: 1.4; color: var(--text-primary); white-space: nowrap; }
.sb-checkbox.disabled .sb-checkbox-label { color: var(--text-secondary); }`;

// --- CHECKBOX ---
(() => {
  const { check: CHECK, checkDisabled: CHECK_DIS, minus: MINUS } = SB_GLYPHS;

  function mkCb(opts = {}) {
    const { checked, indeterminate, disabled, hover, label } = opts;
    let cls = 'sb-checkbox';
    if (hover)         cls += ' hover';
    if (checked)       cls += ' checked';
    if (indeterminate) cls += ' indeterminate';
    if (disabled)      cls += ' disabled';
    const icon = indeterminate ? MINUS : (checked && disabled) ? CHECK_DIS : checked ? CHECK : '';
    const lbl  = label ? `<span class="sb-checkbox-label">${label}</span>` : '';
    return `<div class="${cls}"><div class="sb-checkbox-box">${icon}</div>${lbl}</div>`;
  }

  sbRegister({
    name: 'checkbox',
    title: 'Checkbox',
    description: 'Элемент формы для выбора опций. Размер 20×20px, border-radius 4px. Состояния: Default, Hover, Checked, Disabled, Indeterminate (Unselect All). Поддержка Label.',
    playground: {
      title: 'Checkbox Playground',
      state: { checked: false, disabled: false, hasLabel: false, type: 'check' },
      controls(pg) {
        return `<div class="pg-toggles">
          ${pg.toggle('checked', 'Checked')}
          ${pg.toggle('disabled', 'Disabled')}
          ${pg.toggle('hasLabel', 'Label')}
        </div>
        <div class="pg-toggles">
          <div class="sb-radio selected" data-pg-radio-left onclick="SB_PG.set('checkbox','type','check')"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div><span class="sb-radio-label">Check</span></div>
          <div class="sb-radio" data-pg-radio-right onclick="SB_PG.set('checkbox','type','unselect')"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div><span class="sb-radio-label">Unselect All</span></div>
        </div>`;
      },
      syncControls(s, container) {
        const rbCheck = container.querySelector('[data-pg-radio-left]');
        const rbUnselect = container.querySelector('[data-pg-radio-right]');
        if (rbCheck) rbCheck.classList.toggle('selected', s.type === 'check');
        if (rbUnselect) rbUnselect.classList.toggle('selected', s.type === 'unselect');
      },
      render(s) {
        const indeterminate = s.type === 'unselect';
        const icon = indeterminate ? MINUS : (s.checked && s.disabled) ? CHECK_DIS : s.checked ? CHECK : '';
        let cls = 'sb-checkbox';
        if (s.checked)      cls += ' checked';
        if (indeterminate)  cls += ' indeterminate';
        if (s.disabled)     cls += ' disabled';
        const click = (!s.disabled && !indeterminate)
          ? ` onclick="SB_PG.set('checkbox','checked',!SB_PG.state('checkbox').checked)"` : '';
        const lbl = s.hasLabel ? `<span class="sb-checkbox-label">Title</span>` : '';
        return `<div class="${cls}" style="cursor:pointer"${click}><div class="sb-checkbox-box">${icon}</div>${lbl}</div>`;
      },
      genCode(s) {
        const isUnselect = s.type === 'unselect';
        const icon = isUnselect ? MINUS : (s.checked && s.disabled) ? CHECK_DIS : s.checked ? CHECK : '';
        let cls = 'sb-checkbox';
        if (s.checked)    cls += ' checked';
        if (isUnselect)   cls += ' indeterminate';
        if (s.disabled)   cls += ' disabled';
        const lbl = s.hasLabel ? `\n  <span class="sb-checkbox-label">Title</span>` : '';
        const html = `<div class="${cls}">\n  <div class="sb-checkbox-box">${icon}</div>${lbl}\n</div>`;
        return { html, css: COMP_CSS.checkbox };
      },
    },
    sections: [
      {
        title: 'States — No Label',
        preview: `<div class="sec-row gap-lg">
          ${mkCb({})}
          ${mkCb({ hover: true })}
          ${mkCb({ checked: true })}
          ${mkCb({ checked: true, disabled: true })}
          ${mkCb({ indeterminate: true })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-checkbox"><div class="sb-checkbox-box"></div></div>\n\n<!-- Checked -->\n<div class="sb-checkbox checked"><div class="sb-checkbox-box">${CHECK}</div></div>\n\n<!-- Disabled + Checked -->\n<div class="sb-checkbox disabled checked"><div class="sb-checkbox-box">${CHECK_DIS}</div></div>\n\n<!-- Indeterminate -->\n<div class="sb-checkbox indeterminate"><div class="sb-checkbox-box">${MINUS}</div></div>`,
        css: COMP_CSS.checkbox,
      },
      {
        title: 'States — With Label',
        preview: `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap: var(--gap-horiz-m) 8px;width:100%">
          ${mkCb({ label: 'Title' })}
          ${mkCb({ hover: true, label: 'Title' })}
          ${mkCb({ checked: true, label: 'Title' })}
          ${mkCb({ disabled: true, label: 'Title' })}
          ${mkCb({ indeterminate: true, label: 'Unselect All' })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-checkbox">\n  <div class="sb-checkbox-box"></div>\n  <span class="sb-checkbox-label">Title</span>\n</div>\n\n<!-- Checked -->\n<div class="sb-checkbox checked">\n  <div class="sb-checkbox-box">${CHECK}</div>\n  <span class="sb-checkbox-label">Title</span>\n</div>\n\n<!-- Unselect All -->\n<div class="sb-checkbox indeterminate">\n  <div class="sb-checkbox-box">${MINUS}</div>\n  <span class="sb-checkbox-label">Unselect All</span>\n</div>`,
        css: COMP_CSS.checkbox,
      },
    ],
  });
})();
