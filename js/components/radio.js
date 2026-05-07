// ═══════════════════════════════════════════════════════════════════════════
//  RADIO
//  CSS в css/components/radio.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.radio = `.sb-radio { display: inline-flex; align-items: center; gap: var(--gap-horiz-s); cursor: pointer; user-select: none; vertical-align: middle; }
.sb-radio-circle { width: 20px; height: 20px; flex-shrink: 0; border-radius: 50%; border: var(--border-width-1-5) solid var(--text-secondary); background: var(--background); display: flex; align-items: center; justify-content: center; box-sizing: border-box; transition: border-color 0.15s, background 0.15s; }
.sb-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: transparent; transition: background 0.15s; }
.sb-radio.selected .sb-radio-circle { background: var(--primary); border-color: var(--primary); }
.sb-radio.selected .sb-radio-dot { background: var(--background); }
.sb-radio.disabled { cursor: not-allowed; pointer-events: none; }
.sb-radio.disabled .sb-radio-circle { border-color: transparent; background: var(--surface-1); }
.sb-radio.disabled.selected .sb-radio-circle { background: var(--surface-1); border-color: transparent; }
.sb-radio.disabled.selected .sb-radio-dot { background: var(--border); }
.sb-radio-label { font-size: var(--body-font-size-m); font-weight: var(--font-weight-bold); line-height: 1.4; color: var(--text-primary); white-space: nowrap; }
.sb-radio.disabled .sb-radio-label { color: var(--border); }
.sb-radio.label-left { flex-direction: row-reverse; }`;

// --- RADIO ---
(() => {
  function mkRb(opts = {}) {
    const { selected, hover, disabled, label, labelLeft } = opts;
    let cls = 'sb-radio';
    if (hover)     cls += ' hover';
    if (selected)  cls += ' selected';
    if (disabled)  cls += ' disabled';
    if (labelLeft) cls += ' label-left';
    const dot = selected && disabled
      ? `<div class="sb-radio-dot" style="background:var(--border)"></div>`
      : `<div class="sb-radio-dot"></div>`;
    const lbl = label ? `<span class="sb-radio-label">${label}</span>` : '';
    return `<div class="${cls}"><div class="sb-radio-circle">${dot}</div>${lbl}</div>`;
  }

  sbRegister({
    name: 'radio',
    title: 'Radio',
    description: 'Элемент формы для выбора одной опции из группы. Размер 20×20px, border-radius 50%. Состояния: Default, Hover, Selected, Disabled. Поддержка Label и Label Left.',
    playground: {
      title: 'Radio Playground',
      state: { selected: false, hover: false, disabled: false, hasLabel: false, labelLeft: false },
      controls(pg) {
        return `<div class="pg-toggles">
          ${pg.toggle('selected',  'Selected')}
          ${pg.toggle('hover',     'Hover')}
          ${pg.toggle('disabled',  'Disable')}
          ${pg.toggle('hasLabel',  'Title')}
          <div class="sb-radio selected" data-rb-right onclick="SB_PG.set('radio','labelLeft',false)"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div><span class="sb-radio-label">Right</span></div>
          <div class="sb-radio" data-rb-left onclick="SB_PG.set('radio','labelLeft',true)"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div><span class="sb-radio-label">Left</span></div>
        </div>`;
      },
      syncControls(s, container) {
        const rbRight = container.querySelector('[data-rb-right]');
        const rbLeft  = container.querySelector('[data-rb-left]');
        if (rbRight) rbRight.style.display = s.hasLabel ? '' : 'none';
        if (rbLeft)  rbLeft.style.display  = s.hasLabel ? '' : 'none';
        if (rbRight) rbRight.classList.toggle('selected', !s.labelLeft);
        if (rbLeft)  rbLeft.classList.toggle('selected', s.labelLeft);
      },
      render(s) {
        let cls = 'sb-radio';
        if (s.hover)     cls += ' hover';
        if (s.selected)  cls += ' selected';
        if (s.disabled)  cls += ' disabled';
        if (s.labelLeft) cls += ' label-left';
        const dot = (s.selected && s.disabled)
          ? `<div class="sb-radio-dot" style="background:var(--border)"></div>`
          : `<div class="sb-radio-dot"></div>`;
        const lbl = s.hasLabel ? `<span class="sb-radio-label">Title</span>` : '';
        const click = !s.disabled
          ? ` onclick="SB_PG.set('radio','selected',!SB_PG.state('radio').selected)"` : '';
        return `<div class="${cls}" style="cursor:pointer"${click}><div class="sb-radio-circle">${dot}</div>${lbl}</div>`;
      },
      genCode(s) {
        let cls = 'sb-radio';
        if (s.selected)  cls += ' selected';
        if (s.disabled)  cls += ' disabled';
        if (s.labelLeft) cls += ' label-left';
        const lbl = s.hasLabel ? `\n  <span class="sb-radio-label">Title</span>` : '';
        const html = `<div class="${cls}">\n  <div class="sb-radio-circle"><div class="sb-radio-dot"></div></div>${lbl}\n</div>`;
        return { html, css: COMP_CSS.radio };
      },
    },
    sections: [
      {
        title: 'States — No Label',
        preview: `<div class="sec-row gap-lg">
          ${mkRb({})}
          ${mkRb({ hover: true })}
          ${mkRb({ selected: true })}
          ${mkRb({ disabled: true })}
          ${mkRb({ selected: true, disabled: true })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-radio"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div></div>\n\n<!-- Selected -->\n<div class="sb-radio selected"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div></div>\n\n<!-- Disabled -->\n<div class="sb-radio disabled"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div></div>\n\n<!-- Disabled + Selected -->\n<div class="sb-radio disabled selected"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div></div>`,
        css: COMP_CSS.radio,
      },
      {
        title: 'States — With Label',
        preview: `<div class="sec-row spread">
          ${mkRb({ label: 'Title' })}
          ${mkRb({ hover: true, label: 'Title' })}
          ${mkRb({ selected: true, label: 'Title' })}
          ${mkRb({ disabled: true, label: 'Title' })}
          ${mkRb({ selected: true, disabled: true, label: 'Title' })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-radio">\n  <div class="sb-radio-circle"><div class="sb-radio-dot"></div></div>\n  <span class="sb-radio-label">Title</span>\n</div>\n\n<!-- Selected -->\n<div class="sb-radio selected">\n  <div class="sb-radio-circle"><div class="sb-radio-dot"></div></div>\n  <span class="sb-radio-label">Title</span>\n</div>`,
        css: COMP_CSS.radio,
      },
      {
        title: 'Label Left',
        preview: `<div class="sec-row spread">
          ${mkRb({ label: 'Title', labelLeft: true })}
          ${mkRb({ hover: true, label: 'Title', labelLeft: true })}
          ${mkRb({ selected: true, label: 'Title', labelLeft: true })}
          ${mkRb({ disabled: true, label: 'Title', labelLeft: true })}
          ${mkRb({ selected: true, disabled: true, label: 'Title', labelLeft: true })}
        </div>`,
        html: `<!-- Label Left -->\n<div class="sb-radio label-left">\n  <div class="sb-radio-circle"><div class="sb-radio-dot"></div></div>\n  <span class="sb-radio-label">Title</span>\n</div>`,
        css: COMP_CSS.radio,
      },
    ],
  });
})();
