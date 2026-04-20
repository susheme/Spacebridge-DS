// ═══════════════════════════════════════════════════════════════════════════
//  TOGGLES
//  CSS в css/components/toggles.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.toggles = `.sb-toggle-wrap {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-horiz-m);
  cursor: pointer;
}
.sb-toggle {
  position: relative;
  width: 56px;
  height: 20px;
}
.sb-toggle-track {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-6);
  background: var(--text-secondary);
  box-shadow: 1px 1px 2px 0 var(--shadow-overlay) inset, -1px -1px 2px 0 var(--shadow-lg) inset;
  transition: background 0.2s ease;
}
.sb-toggle input:checked + .sb-toggle-track {
  background: var(--success);
}
.sb-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 16px;
  border-radius: var(--radius-4);
  background: var(--surface-1);
  transition: transform 0.2s ease;
}
.sb-toggle input:checked ~ .sb-toggle-thumb {
  transform: translateX(28px);
}
.sb-toggle-wrap.is-disabled .sb-toggle { opacity: 0.25; }
.sb-toggle-wrap.is-disabled .sb-toggle-track { background: var(--text-secondary) !important; box-shadow: none !important; }
.sb-toggle-wrap.is-disabled .sb-toggle-thumb { background: var(--border); box-shadow: none; }
.sb-toggle-label-text {
  font-size: var(--body-font-size-m);
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
  color: var(--text-primary);
}`;

// --- TOGGLES ---
(() => {
function tglClass(s) {
  let cls = 'sb-toggle-wrap';
  if (s.disabled) cls += ' is-disabled';
  if (s.hasLabel && s.labelPos === 'left') cls += ' sb-toggle-label-left';
  return cls;
}
sbRegister({
  name: 'toggles',
  title: 'Toggles',
  description: 'Компонент Toggle из Figma. Размер L: 56×20px. Состояния: Off, On, Disabled. Поддержка Label слева/справа.',
  playground: {
    title: 'Regular',
    state: { on: false, disabled: false, hasLabel: true, labelPos: 'right' },
    controls(pg) {
      return `<div class="pg-grid">
        ${pg.toggle('disabled', 'Disable')}
        ${pg.toggle('hasLabel', 'Label')}
        <div class="sb-radio" data-pg-radio-left onclick="SB_PG.set('toggles','labelPos','left')"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div><span class="sb-radio-label">Label-Left</span></div>
        <div class="sb-radio selected" data-pg-radio-right onclick="SB_PG.set('toggles','labelPos','right')"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div><span class="sb-radio-label">Label-Right</span></div>
      </div>`;
    },
    render(s) {
      const wrapCls = tglClass(s);
      const checkedAttr = boolAttr('checked', s.on);
      const disabledAttr = boolAttr('disabled', s.disabled);
      const labelHtml = s.hasLabel ? `<span class="sb-toggle-label-text">Label</span>` : '';
      // onchange обновляет state без re-render — чтобы CSS transition сработал
      // (при innerHTML-замене DOM создаётся заново и анимация пропадает)
      return `<label class="${wrapCls}">
        <span class="sb-toggle">
          <input type="checkbox"${checkedAttr}${disabledAttr} onchange="SB_PG._states.toggles.on=this.checked;if(SB_PG._codeOpen.toggles)SB_PG._fillCode('toggles')">
          <span class="sb-toggle-track"></span>
          <span class="sb-toggle-thumb"></span>
        </span>
        ${labelHtml}
      </label>`;
    },
    syncControls(s, container) {
      // Sync hasLabel checkbox (needs special handling since it starts checked)
      const hasLabelCb = container.querySelector('[data-pg-key="hasLabel"]');
      if (hasLabelCb) hasLabelCb.checked = s.hasLabel;
      // Show/hide radio items based on hasLabel
      const radioLeft = container.querySelector('[data-pg-radio-left]');
      const radioRight = container.querySelector('[data-pg-radio-right]');
      if (radioLeft) radioLeft.style.display = s.hasLabel ? '' : 'none';
      if (radioRight) radioRight.style.display = s.hasLabel ? '' : 'none';
      // Sync radio selection
      const rbLeft = container.querySelector('[data-pg-radio-left]');
      const rbRight = container.querySelector('[data-pg-radio-right]');
      if (rbLeft) rbLeft.classList.toggle('selected', s.labelPos === 'left');
      if (rbRight) rbRight.classList.toggle('selected', s.labelPos === 'right');
    },
    genCode(s) {
      const wrapCls = tglClass(s);
      const checkedAttr = mlBoolAttr('checked', s.on);
      const disabledAttr = mlBoolAttr('disabled', s.disabled);
      const labelHTML = s.hasLabel ? `\n  <span class="sb-toggle-label-text">Label</span>` : '';
      const html = `<label class="${wrapCls}">\n  <span class="sb-toggle">\n    <input type="checkbox"${checkedAttr}${disabledAttr}>\n    <span class="sb-toggle-track"></span>\n    <span class="sb-toggle-thumb"></span>\n  </span>${labelHTML}\n</label>`;
      return { html, css: COMP_CSS.toggles };
    },
  },
});
})();
