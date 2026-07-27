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
  description: sbT(
    'The Toggle component from Figma. States: Off, On, Disabled. The label goes on the left or the right. Example: enabling a feature in settings — the effect is instant, unlike a checkbox in a form.',
    'Компонент Toggle из Figma. Состояния: Off, On, Disabled. Label — слева или справа. Пример: включение фичи в настройках — срабатывает сразу, в отличие от чекбокса в форме.'
  ) + sbDocNote('Tech Info', sbT(
    'Size L: 56×20px.',
    'Размер L: 56×20px.'
  )),
  playground: {
    title: 'Regular',
    state: { on: false, disabled: false, hasLabel: true, labelPos: 'right' },
    controls(pg) {
      return `${sbPgGroup('State', `
          <div class="pg-toggles">
            ${pg.toggle('disabled', 'Disable')}
            ${pg.toggle('hasLabel', 'Label')}
          </div>
          `)}
      ${sbPgGroup('Label', `
          <div class="pg-toggles">
            ${pg.radio('labelPos', [
              { value: 'left',  label: 'Left' },
              { value: 'right', label: 'Right' },
            ])}
          </div>
          `, { attrs: 'data-tgl-label-group' })}`;
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
      // Прячем всю группу Label — иначе оставалась пустая рамка с тайтлом.
      const lblGroup = container.querySelector('[data-tgl-label-group]');
      if (lblGroup) lblGroup.style.display = s.hasLabel ? '' : 'none';
      // Подсветку радио labelPos держит SB_PG (pg.radio) — вручную не трогаем.
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
