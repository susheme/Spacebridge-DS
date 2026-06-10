// ═══════════════════════════════════════════════════════════════════════════
//  BUTTONS
//  CSS в css/components/buttons.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.buttons = `.sb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--gap-horiz-s);
  height: var(--btn-primary-min-height);
  padding: 0 var(--pad-horiz-16);
  border-radius: var(--radius-8);
  border: var(--border-width-1-5) solid transparent;
  font-size: var(--button-font-size);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: box-shadow 0.15s, background 0.15s;
}
.sb-btn-primary {
  background: var(--primary);
  color: var(--background);
}
.sb-btn-secondary {
  background: var(--surface-1);
  color: var(--primary);
}
.sb-btn-text {
  background: transparent;
  color: var(--primary);
}
.sb-btn-with-label {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-vert-s);
  padding: var(--pad-vert-0) var(--pad-horiz-0);
}
.sb-btn-with-label-text {
  color: var(--text-tertiary);
  white-space: nowrap;
}`;

// --- BUTTONS ---
(() => {
function btnClass(s) {
  let cls = 'sb-btn';
  if (s.type === 'primary')   cls += s.critical ? ' sb-btn-critical' : ' sb-btn-primary';
  if (s.type === 'secondary') cls += s.critical ? ' sb-btn-secondary sb-btn-critical' : ' sb-btn-secondary';
  if (s.type === 'text')      cls += s.critical ? ' sb-btn-text sb-btn-critical' : ' sb-btn-text';
  if (s.iconOnly)             cls += s.twoIcons ? ' sb-btn-icon-2' : ' sb-btn-icon';
  if (s.iconOnly && s.small)  cls += ' sb-btn-sm';
  if (s.loading)              cls += ' sb-btn-loading';
  return cls;
}
sbRegister({
  name: 'buttons',
  title: 'Buttons',
  description: 'Компонент Basic из Figma. Типы: Primary, Secondary, Text. Состояния: Hover, Disable, Loading, Critical. Иконки: Icon-L, Icon-R, Icon-Only. Размеры: L (40px) / S (32px).',
  playground: {
    title: 'Regular',
    state: { type: 'primary', iconL: false, iconR: false, disabled: false, loading: false, critical: false, iconOnly: false, twoIcons: false, small: false, labelLeft: false, labelRight: false },
    controls(pg) {
      // Variant — одиночный select с label'ом (без обёртки в pg-group: один
      // контрол в группе — избыточная декорация). Modifiers / State — pg-group'ы
      // с 3 toggle'ами каждый.
      return `${pg.select('type', [
          { value: 'primary',   label: 'Primary'   },
          { value: 'secondary', label: 'Secondary' },
          { value: 'text',      label: 'Text'      },
        ], { label: 'Variant' })}
        <div class="pg-group">
          <div class="pg-group-title sb-field-label">Modifiers</div>
          <div class="pg-group-body">
            <div class="pg-toggles">
              ${pg.toggle('iconL',    'Icon-L')}
              ${pg.toggle('iconR',    'Icon-R')}
              ${pg.toggle('iconOnly', 'Icon-Only')}
            </div>
          </div>
        </div>
        <div class="pg-group">
          <div class="pg-group-title sb-field-label">State</div>
          <div class="pg-group-body">
            <div class="pg-toggles">
              ${pg.toggle('disabled', 'Disable')}
              ${pg.toggle('loading',  'Loading')}
              ${pg.toggle('critical', 'Critical')}
            </div>
          </div>
        </div>`;
    },
    onControlChange(key, val, s) {
      if (key === 'iconOnly') {
        if (s.iconOnly) { s.iconL = false; s.iconR = false; }
        else { s.twoIcons = false; s.small = false; }
      }
      if ((key === 'iconL' || key === 'iconR') && val) {
        s.iconOnly = false;
      }
    },
    syncControls(s, container) {
      container.querySelectorAll('[data-pg-ctrl]').forEach(el => {
        const key = el.getAttribute('data-pg-ctrl');
        if (key === 'iconL' || key === 'iconR') {
          el.classList.toggle('is-disabled', !!s.iconOnly);
        }
      });
    },
    render(s) {
      const cls = btnClass(s);
      const attrs = boolAttr('disabled', s.disabled);
      const iL = sbIcon('radar-line', 'L');
      const iR = sbIcon('arrow-drop-down-line', 'L');
      const iOnly = sbIcon('add-line', 'L');
      const iOnly2 = sbIcon('arrow-drop-down-line', 'L');
      let inner = '';
      if (s.iconOnly) {
        inner = s.twoIcons ? (iOnly + iOnly2) : iOnly;
      } else {
        if (s.iconL) inner += iL + ' ';
        inner += 'Button';
        if (s.iconR) inner += ' ' + iR;
      }
      const btnHtml = `<button class="${cls}"${attrs}>${inner}</button>`;
      // Label composition: только для icon-only кнопок. Label-левый и -правый
      // независимы — обе галки = label с обеих сторон.
      if (s.iconOnly && (s.labelLeft || s.labelRight)) {
        const lbl = '<span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Label</span>';
        const parts = [
          s.labelLeft ? lbl : '',
          btnHtml,
          s.labelRight ? lbl : '',
        ].filter(Boolean).join('');
        return `<span class="sb-btn-with-label">${parts}</span>`;
      }
      return btnHtml;
    },
    extraPreview(s) {
      if (!s.iconOnly) return '';
      // 4 чекбокса в сетке 2×2 (2 столбца). Inline-style чтобы не плодить
      // буттон-специфичный класс в playground.css.
      return `<div class="pg-extras-row" style="display:grid;grid-template-columns:auto auto;gap:var(--gap-vert-s) var(--gap-horiz-lg);justify-content:center">
        <div class="pg-cb-group">
          <input type="checkbox" class="sb-checkbox" id="pg-buttons-cb-2icons"${boolAttr('checked', s.twoIcons)} onchange="SB_PG.set('buttons','twoIcons',this.checked)">
          <label class="pg-cb-label sb-body-m" for="pg-buttons-cb-2icons">2 Icons</label>
        </div>
        <div class="pg-cb-group">
          <input type="checkbox" class="sb-checkbox" id="pg-buttons-cb-small"${boolAttr('checked', s.small)} onchange="SB_PG.set('buttons','small',this.checked)">
          <label class="pg-cb-label sb-body-m" for="pg-buttons-cb-small">Small</label>
        </div>
        <div class="pg-cb-group">
          <input type="checkbox" class="sb-checkbox" id="pg-buttons-cb-labelL"${boolAttr('checked', s.labelLeft)} onchange="SB_PG.set('buttons','labelLeft',this.checked)">
          <label class="pg-cb-label sb-body-m" for="pg-buttons-cb-labelL">Label Left</label>
        </div>
        <div class="pg-cb-group">
          <input type="checkbox" class="sb-checkbox" id="pg-buttons-cb-labelR"${boolAttr('checked', s.labelRight)} onchange="SB_PG.set('buttons','labelRight',this.checked)">
          <label class="pg-cb-label sb-body-m" for="pg-buttons-cb-labelR">Label Right</label>
        </div>
      </div>`;
    },
    genCode(s) {
      const IL = sbIconRaw('add-line');
      const IR = sbIconRaw('arrow-drop-down-line');
      const cls = btnClass(s);
      const attrs = boolAttr('disabled', s.disabled);
      let inner = '';
      if (s.iconOnly) {
        if (s.twoIcons) inner = `\n  ${IL}\n  ${IR}\n`;
        else inner = `\n  ${IL}\n`;
      } else {
        if (s.iconL) inner += `\n  ${IL}`;
        inner += '\n  Button';
        if (s.iconR) inner += `\n  ${IR}`;
        inner += '\n';
      }
      let html = `<button class="${cls}"${attrs}>${inner}</button>`;
      if (s.iconOnly && (s.labelLeft || s.labelRight)) {
        const lbl = '\n  <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Label</span>';
        const parts = [
          s.labelLeft ? lbl : '',
          '\n  ' + html.replace(/\n/g, '\n  '),
          s.labelRight ? lbl : '',
        ].filter(Boolean).join('');
        html = `<span class="sb-btn-with-label">${parts}\n</span>`;
      }
      return { html, css: COMP_CSS.buttons };
    },
  },
});
})();
