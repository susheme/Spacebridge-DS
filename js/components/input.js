// ═══════════════════════════════════════════════════════════════════════════
//  INPUT
//  CSS в css/components/input.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["input-field"] = `.sb-tf { display: flex; align-items: center; justify-content: space-between; height: var(--text-field-height-l); min-width: var(--text-field-min-width); max-width: var(--text-field-max-width); border-radius: var(--radius-2); border: var(--border-width-1-5) solid var(--border); background: var(--surface-1); overflow: hidden; padding-left: var(--pad-horiz-8); transition: border-color 0.15s, background 0.15s; }
.sb-tf-input { flex: 1; min-width: 0; height: 100%; border: none; outline: none; background: transparent; font-size: var(--title-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); font-family: inherit; color: var(--text-tertiary); }
.sb-tf-input::placeholder { color: var(--text-secondary); }
.sb-tf-right { flex-shrink: 0; height: 100%; padding: 0 var(--pad-horiz-8); display: flex; align-items: center; gap: var(--gap-horiz-s); background: var(--background); border-left: var(--border-width-1-5) solid var(--border); border-radius: 0 2px 2px 0; }
.sb-tf-title { font-size: var(--title-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); color: var(--text-secondary); white-space: nowrap; }
.sb-tf:focus-within { background: var(--background); border-color: var(--primary); }
.sb-tf:focus-within .sb-tf-right { border-left-color: var(--primary); }
.sb-tf.critical { background: var(--background); border-color: var(--error); }
.sb-tf.critical .sb-tf-right { border-left-color: var(--error); }
.sb-tf.critical .sb-tf-title { color: var(--error); }
.sb-tf.disabled { pointer-events: none; }
.sb-tf.disabled .sb-tf-input, .sb-tf.disabled .sb-tf-title { color: var(--border); }
.sb-tf.disabled .sb-tf-right { background: var(--surface-1); }
.sb-tf.read-only { border-color: transparent; pointer-events: none; }
.sb-tf.read-only .sb-tf-right { border-left-color: transparent; }
.sb-tf.line-view { background: transparent; border: none; border-radius: 0; border-bottom: var(--border-width-1-5) solid var(--border); padding-left: 0; }
.sb-tf.line-view .sb-tf-right { background: transparent; }
.sb-tf.line-view:focus-within { background: transparent; border-bottom-color: var(--primary); }
.sb-tf.line-view.read-only .sb-tf-right { border-left-color: transparent; }`;

window.COMP_CSS["input-field-wrap"] = `.sb-field { display: flex; flex-direction: column; width: 100%; }
.sb-field-label { font-size: var(--body-font-size-l); font-weight: var(--font-weight-semibold); line-height: var(--headline-line-height-22); color: var(--text-tertiary); margin-bottom: 4px; }
.sb-field-sub { font-size: var(--body-font-size-s); font-weight: var(--font-weight-regular); line-height: var(--link-line-height); color: var(--text-secondary); margin-top: 8px; }
.sb-field-sub--error { color: var(--error); }
.sb-field-desc { font-size: var(--body-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); color: var(--text-secondary); margin-top: 4px; }
.sb-field.two-row { flex-direction: row; align-items: flex-start; gap: var(--gap-horiz-m); }
.sb-field.two-row .sb-field-left { display: flex; flex-direction: column; flex-shrink: 0; width: var(--field-label-w, auto); padding-top: var(--pad-vert-4); }
.sb-field.two-row .sb-field-left .sb-field-label { margin-bottom: 0; }
.sb-field.two-row .sb-field-right { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.sb-field-group { display: flex; flex-direction: column; gap: var(--gap-horiz-m); --field-label-w: 140px; }`;

// --- INPUT ---
(() => {
  const CLEAR_ICON = SB_GLYPHS.clear;

  function mkTf(opts = {}) {
    const { value = 'Input', placeholder, selected, critical, disabled, readOnly, lineView, showTitle = true, title = 'Title', fieldMode } = opts;
    let cls = 'sb-tf';
    if (selected)  cls += ' selected';
    if (critical)  cls += ' critical';
    if (disabled)  cls += ' disabled';
    if (readOnly)  cls += ' read-only';
    if (lineView)  cls += ' line-view';
    const inputVal    = placeholder ? '' : value;
    const inputPH     = placeholder ? 'Placeholder' : '';
    const widthCls  = fieldMode ? 'sec-w100' : 'sec-narrow';
    const onInput     = `oninput="var b=this.closest('.sb-tf').querySelector('.sb-tf-clear');if(b)b.style.display=this.value.length?'flex':'none'"`;
    const clearBtn    = `<button class="sb-tf-clear" style="background:none;border:none;cursor:pointer;color:var(--text-secondary);display:none;padding:0;align-items:center" onclick="var i=this.closest('.sb-tf').querySelector('input');i.value='';i.dispatchEvent(new Event('input'));i.focus()">${CLEAR_ICON}</button>`;
    const rightEl     = showTitle
      ? `<div class="sb-tf-right">${clearBtn}<span class="sb-tf-title">${title}</span></div>` : '';
    return `<div class="${cls} ${widthCls}"><input class="sb-tf-input" type="text" value="${inputVal}" placeholder="${inputPH}" ${onInput}>${rightEl}</div>`;
  }

  function mkField(tfOpts = {}, fOpts = {}) {
    const { label, subscription, description, twoRow } = fOpts;
    const inputEl = mkTf({ ...tfOpts, fieldMode: true });
    if (!label && !subscription) return mkTf(tfOpts);
    const subEl = subscription
      ? `<span class="sb-field-sub${tfOpts.critical ? ' sb-field-sub--error' : ''}">${subscription}</span>`
      : '';
    if (twoRow) {
      return `<div class="sb-field two-row">
        <div class="sb-field-left">
          ${label       ? `<span class="sb-field-label">${label}</span>` : ''}
          ${description ? `<span class="sb-field-desc">${description}</span>` : ''}
        </div>
        <div class="sb-field-right">
          ${inputEl}
          ${subEl}
        </div>
      </div>`;
    }
    return `<div class="sb-field">
      ${label ? `<span class="sb-field-label">${label}</span>` : ''}
      ${inputEl}
      ${subEl}
    </div>`;
  }

  sbRegister({
    name: 'input',
    title: 'Input',
    description: 'Текстовое поле. Высота 32px, border-radius 2px. Варианты: Filled и Line View. Состояния: Default, Placeholder, Selected, Critical, Disabled, Read Only. Поддержка Label, Subscription и 2-row лейаута.',
    playground: {
      title: 'Input Playground',
      wide: true,
      state: { placeholder: false, selected: false, critical: false, disabled: false, readOnly: false, lineView: false, showTitle: true, showLabel: false, showSub: false, twoRow: false, showDesc: false },
      controls(pg) {
        // 3 группы (State / Style / Anatomy) укладываются в pg-controls grid
        // через `.pg-card.wide .pg-controls:has(> .pg-group)` правило.
        return `<div class="pg-group">
            <div class="pg-group-title sb-field-label">State</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('placeholder', 'Placeholder')}
                ${pg.toggle('selected',   'Selected')}
                ${pg.toggle('critical',   'Critical')}
                ${pg.toggle('disabled',   'Disable')}
                ${pg.toggle('readOnly',   'Read Only')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Style</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('lineView',   'Line View')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Anatomy</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('showTitle',  'Title')}
                ${pg.toggle('showLabel',  'Label')}
                ${pg.toggle('showSub',    'Subscription')}
                ${pg.toggle('twoRow',     '2 Rows',       { requires: 'showLabel' })}
                ${pg.toggle('showDesc',   'Description',  { requires: 'showLabel' })}
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
        return `<div style="width:100%;max-width:360px">${mkField(s, fOpts)}</div>`;
      },
      genCode(s) {
        const fOpts = {
          label:        s.showLabel ? 'Label' : null,
          subscription: s.showSub   ? 'Subscription text' : null,
          description:  s.showDesc && s.twoRow ? 'Description text' : null,
          twoRow:       s.twoRow && s.showLabel,
        };
        const css = (s.showLabel || s.showSub)
          ? COMP_CSS["input-field"] + '\n' + COMP_CSS["input-field-wrap"]
          : COMP_CSS["input-field"];
        return { html: mkField(s, fOpts), css };
      },
    },
    sections: [
      {
        title: 'With Title',
        desc: 'Все состояния с правым контентом (Title). Default, Placeholder, Selected (с кнопкой очистки), Critical, Disabled, Read Only.',
        preview: `<div class="sec-col narrow gap-md">
          ${mkTf({ value: 'Default' })}
          ${mkTf({ placeholder: true })}
          ${mkTf({ selected: true, value: 'Selected' })}
          ${mkTf({ critical: true, value: 'Error' })}
          ${mkTf({ disabled: true, value: 'Disabled' })}
          ${mkTf({ readOnly: true, value: 'Read only' })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-tf">\n  <input class="sb-tf-input" type="text" value="Input">\n  <div class="sb-tf-right"><span class="sb-tf-title">Title</span></div>\n</div>\n\n<!-- Placeholder -->\n<div class="sb-tf">\n  <input class="sb-tf-input" type="text" placeholder="Placeholder">\n  <div class="sb-tf-right"><span class="sb-tf-title">Title</span></div>\n</div>\n\n<!-- Selected -->\n<div class="sb-tf selected">...</div>\n\n<!-- Critical -->\n<div class="sb-tf critical">...</div>\n\n<!-- Disabled -->\n<div class="sb-tf disabled">...</div>`,
        css: COMP_CSS["input-field"],
      },
      {
        title: 'No Title',
        desc: 'Те же состояния без правого контента.',
        preview: `<div class="sec-col narrow gap-md">
          ${mkTf({ value: 'Default', showTitle: false })}
          ${mkTf({ placeholder: true, showTitle: false })}
          ${mkTf({ selected: true, value: 'Selected', showTitle: false })}
          ${mkTf({ critical: true, value: 'Error', showTitle: false })}
          ${mkTf({ disabled: true, value: 'Disabled', showTitle: false })}
          ${mkTf({ readOnly: true, value: 'Read only', showTitle: false })}
        </div>`,
        html: `<div class="sb-tf">\n  <input class="sb-tf-input" type="text" value="Input">\n</div>`,
        css: COMP_CSS["input-field"],
      },
      {
        title: 'Line View',
        desc: 'Минималистичный вид — только нижняя линия. Используется в таблицах и компактных формах.',
        preview: `<div class="sec-col narrow gap-md">
          ${mkTf({ lineView: true, value: 'Default' })}
          ${mkTf({ lineView: true, placeholder: true })}
          ${mkTf({ lineView: true, selected: true, value: 'Selected' })}
          ${mkTf({ lineView: true, critical: true, value: 'Error' })}
          ${mkTf({ lineView: true, disabled: true, value: 'Disabled' })}
          ${mkTf({ lineView: true, readOnly: true, value: 'Read only' })}
        </div>`,
        html: `<div class="sb-tf line-view">\n  <input class="sb-tf-input" type="text" value="Input">\n  <div class="sb-tf-right"><span class="sb-tf-title">Title</span></div>\n</div>`,
        css: COMP_CSS["input-field"],
      },
      {
        title: 'With Label & Subscription',
        desc: 'Label располагается над полем, Subscription — под ним. Оба элемента опциональны и комбинируются независимо.',
        preview: `<div class="sec-col narrow gap-lg">
          ${mkField({ value: 'Default' }, { label: 'Label' })}
          ${mkField({ value: 'Default' }, { subscription: 'Subscription text' })}
          ${mkField({ value: 'Default' }, { label: 'Label', subscription: 'Subscription text' })}
          ${mkField({ critical: true, value: 'Error' }, { label: 'Label', subscription: 'Subscription text' })}
        </div>`,
        html: `<div class="sb-field">\n  <span class="sb-field-label">Label</span>\n  <div class="sb-tf">...</div>\n  <span class="sb-field-sub">Subscription text</span>\n</div>`,
        css: COMP_CSS["input-field"] + '\n' + COMP_CSS["input-field-wrap"],
      },
      {
        title: '2-row Layout',
        desc: 'Label слева, Input справа. Ширина колонки Label задаётся через --field-label-w на родителе. .sb-field-group выравнивает лейблы автоматически.',
        preview: `<div class="sb-field-group sec-xl">
          ${mkField({ value: 'Default' },                                         { label: 'Label', twoRow: true })}
          ${mkField({ value: 'Default' },                                         { label: 'Label', subscription: 'Subscription text', twoRow: true })}
          ${mkField({ value: 'Default' },                                         { label: 'Label', description: 'Description text', subscription: 'Subscription text', twoRow: true })}
          ${mkField({ value: 'Default' },                                         { label: 'Label', description: 'Description text', twoRow: true })}
        </div>`,
        html: `<!-- Используй .sb-field-group для выравнивания лейблов -->\n<div class="sb-field-group">\n  <div class="sb-field two-row">\n    <div class="sb-field-left">\n      <span class="sb-field-label">Label</span>\n      <span class="sb-field-desc">Description text</span>\n    </div>\n    <div class="sb-field-right">\n      <div class="sb-tf">...</div>\n      <span class="sb-field-sub">Subscription text</span>\n    </div>\n  </div>\n</div>`,
        css: COMP_CSS["input-field"] + '\n' + COMP_CSS["input-field-wrap"],
      },
    ],
  });
})();
