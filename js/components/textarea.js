// ═══════════════════════════════════════════════════════════════════════════
//  TEXTAREA
//  CSS в css/components/textarea.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.textarea = `.sb-ta { position: relative; display: flex; width: 100%; max-width: var(--textarea-max-width); min-height: var(--textarea-min-height); max-height: var(--textarea-max-height); border-radius: var(--radius-2); border: var(--border-width-1-5) solid var(--border); background: var(--surface-1); transition: border-color 0.15s, background 0.15s; }
.sb-ta-input { flex: 1; padding: var(--pad-vert-4) var(--pad-horiz-8) var(--pad-vert-24); border: none; outline: none; background: transparent; font-size: var(--body-font-size-l); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); font-family: inherit; color: var(--text-tertiary); resize: vertical; overflow: auto; min-height: 93px; }
.sb-ta-input::placeholder { color: var(--text-secondary); }
.sb-ta:focus-within { background: var(--background); border-color: var(--primary); }
.sb-ta.critical { background: var(--background); border-color: var(--error); }
.sb-ta.disabled { pointer-events: none; }
.sb-ta.disabled .sb-ta-input { color: var(--border); }`;

// --- TEXTAREA ---
(() => {
  function mkTa(opts = {}) {
    const { value = '', placeholder, selected, critical, disabled, fieldMode } = opts;
    let cls = 'sb-ta';
    if (selected) cls += ' selected';
    if (critical) cls += ' critical';
    if (disabled) cls += ' disabled';
    const widthCls = fieldMode ? 'sec-w100' : 'sec-narrow';
    const inputVal = placeholder ? '' : value;
    const inputPH  = placeholder ? 'Placeholder' : '';
    return `<div class="${cls} ${widthCls}"><textarea class="sb-ta-input" placeholder="${inputPH}">${inputVal}</textarea></div>`;
  }

  function mkTaField(tfOpts = {}, fOpts = {}) {
    const { label, subscription, description, twoRow } = fOpts;
    const inputEl = mkTa({ ...tfOpts, fieldMode: true });
    if (!label && !subscription) return mkTa(tfOpts);
    const subEl = subscription
      ? `<span class="sb-field-sub${tfOpts.critical ? ' sb-field-sub--error' : ''}">${subscription}</span>`
      : '';
    if (twoRow) {
      return `<div class="sb-field two-row">
        <div class="sb-field-left">
          ${label       ? `<span class="sb-field-label">${label}</span>` : ''}
          ${description ? `<span class="sb-field-desc">${description}</span>` : ''}
        </div>
        <div class="sb-field-right">${inputEl}${subEl}</div>
      </div>`;
    }
    return `<div class="sb-field">
      ${label ? `<span class="sb-field-label">${label}</span>` : ''}
      ${inputEl}${subEl}
    </div>`;
  }

  sbRegister({
    name: 'textarea',
    title: 'Textarea',
    description: 'Многострочное текстовое поле. Высота от 96px, border-radius 2px. Состояния: Default, Placeholder, Selected, Critical, Disabled. Поддержка Label и Subscription через sb-field.',
    playground: {
      title: 'Textarea Playground',
      wide: true,
      state: { placeholder: false, selected: false, critical: false, disabled: false, showLabel: false, showSub: false, twoRow: false, showDesc: false },
      controls(pg) {
        // 2 группы (State / Anatomy) — Textarea без отдельных Style-вариаций.
        return `<div class="pg-group">
            <div class="pg-group-title sb-field-label">State</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('placeholder', 'Placeholder')}
                ${pg.toggle('selected',   'Selected')}
                ${pg.toggle('critical',   'Critical')}
                ${pg.toggle('disabled',   'Disable')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Anatomy</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('showLabel',  'Label')}
                ${pg.toggle('showSub',    'Subscription')}
                ${pg.toggle('twoRow',     '2 Rows',      { requires: 'showLabel' })}
                ${pg.toggle('showDesc',   'Description', { requires: 'showLabel' })}
              </div>
            </div>
          </div>`;
      },
      render(s) {
        const fOpts = {
          label:        s.showLabel ? 'Label' : null,
          subscription: s.showSub   ? 'Subscription text' : null,
          description:  s.showDesc && s.twoRow ? 'Description text' : null,
          twoRow:       s.twoRow && s.showLabel,
        };
        return mkTaField(s, fOpts);
      },
      genCode(s) {
        const fOpts = {
          label:        s.showLabel ? 'Label' : null,
          subscription: s.showSub   ? 'Subscription text' : null,
          description:  s.showDesc && s.twoRow ? 'Description text' : null,
          twoRow:       s.twoRow && s.showLabel,
        };
        const css = (s.showLabel || s.showSub)
          ? COMP_CSS.textarea + '\n' + COMP_CSS["input-field-wrap"]
          : COMP_CSS.textarea;
        return { html: mkTaField(s, fOpts), css };
      },
    },
    sections: [
      {
        title: 'States',
        desc: 'Default, Placeholder, Selected (готов к вводу), Critical, Disabled.',
        preview: `<div class="sec-col narrow gap-md">
          ${mkTa({ value: 'Text area filled with the only one sentence, but you can add more.' })}
          ${mkTa({ placeholder: true })}
          ${mkTa({ selected: true, value: 'Ready for typing' })}
          ${mkTa({ critical: true, value: 'Something goes wrong' })}
          ${mkTa({ disabled: true, value: 'Disable Text Area' })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-ta">\n  <textarea class="sb-ta-input">Text here</textarea>\n</div>\n\n<!-- Selected -->\n<div class="sb-ta selected">\n  <textarea class="sb-ta-input">Ready for typing</textarea>\n</div>\n\n<!-- Critical -->\n<div class="sb-ta critical">\n  <textarea class="sb-ta-input">Something goes wrong</textarea>\n</div>\n\n<!-- Disabled -->\n<div class="sb-ta disabled">\n  <textarea class="sb-ta-input" disabled>Disable Text Area</textarea>\n</div>`,
        css: COMP_CSS.textarea,
      },
      {
        title: 'With Label & Subscription',
        desc: 'Textarea внутри sb-field — Label сверху, Subscription снизу. Subscription красится в error при Critical.',
        preview: `<div class="sec-col narrow gap-lg">
          ${mkTaField({ value: 'Default text' },                   { label: 'Label' })}
          ${mkTaField({ value: 'Default text' },                   { label: 'Label', subscription: 'Subscription text' })}
          ${mkTaField({ critical: true, value: 'Error state' },    { label: 'Label', subscription: 'Subscription text' })}
          ${mkTaField({ disabled: true, value: 'Disabled state' }, { label: 'Label', subscription: 'Subscription text' })}
        </div>`,
        html: `<div class="sb-field">\n  <span class="sb-field-label">Label</span>\n  <div class="sb-ta">\n    <textarea class="sb-ta-input">Text here</textarea>\n  </div>\n  <span class="sb-field-sub">Subscription text</span>\n</div>`,
        css: COMP_CSS.textarea + '\n' + COMP_CSS["input-field-wrap"],
      },
      {
        title: '2-row Layout',
        desc: 'Label слева, Textarea справа. Используй .sb-field-group для выравнивания нескольких полей.',
        preview: `<div class="sb-field-group sec-xl">
          ${mkTaField({ value: 'Default text' },                { label: 'Label', twoRow: true })}
          ${mkTaField({ value: 'Default text' },                { label: 'Label', subscription: 'Subscription text', twoRow: true })}
          ${mkTaField({ value: 'Default text' },                { label: 'Label', description: 'Description text', subscription: 'Subscription text', twoRow: true })}
        </div>`,
        html: `<div class="sb-field-group">\n  <div class="sb-field two-row">\n    <div class="sb-field-left">\n      <span class="sb-field-label">Label</span>\n    </div>\n    <div class="sb-field-right">\n      <div class="sb-ta"><textarea class="sb-ta-input">Text here</textarea></div>\n      <span class="sb-field-sub">Subscription text</span>\n    </div>\n  </div>\n</div>`,
        css: COMP_CSS.textarea + '\n' + COMP_CSS["input-field-wrap"],
      },
    ],
  });
})();
