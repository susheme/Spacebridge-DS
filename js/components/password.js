// ═══════════════════════════════════════════════════════════════════════════
//  PASSWORD
//  CSS в css/components/password.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.password = `.sb-pw { display: flex; align-items: center; justify-content: space-between; height: var(--text-field-height-l); min-width: var(--text-field-min-width); max-width: var(--text-field-max-width); border-radius: var(--radius-2); border: var(--border-width-1-5) solid var(--border); background: var(--surface-1); overflow: hidden; padding-left: var(--pad-horiz-8); transition: border-color 0.15s, background 0.15s; }
.sb-pw-left { flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; gap: var(--gap-horiz-s); }
.sb-pw-lock { flex-shrink: 0; display: flex; align-items: center; color: var(--text-tertiary); }
.sb-pw-input { flex: 1; min-width: 0; height: 100%; border: none; outline: none; background: transparent; font-size: var(--title-font-size-m); font-weight: var(--font-weight-regular); line-height: var(--body-line-height); font-family: inherit; color: var(--text-tertiary); }
.sb-pw-input::placeholder { color: var(--text-secondary); }
.sb-pw-right { flex-shrink: 0; height: 100%; padding: 0 var(--pad-horiz-8); display: flex; align-items: center; background: var(--background); border-left: var(--border-width-1-5) solid var(--border); border-radius: 0 2px 2px 0; }
.sb-pw-toggle { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding: 0; color: var(--text-tertiary); }
.sb-pw:focus-within { background: var(--background); border-color: var(--primary); }
.sb-pw:focus-within .sb-pw-right { border-left-color: var(--primary); }
.sb-pw.critical { background: var(--background); border-color: var(--error); }
.sb-pw.critical .sb-pw-right { border-left-color: var(--error); }
.sb-pw.critical .sb-pw-lock, .sb-pw.critical .sb-pw-toggle { color: var(--error); }
.sb-pw.disabled { pointer-events: none; }
.sb-pw.disabled .sb-pw-input { color: var(--border); }
.sb-pw.disabled .sb-pw-lock, .sb-pw.disabled .sb-pw-toggle { color: var(--border); }
.sb-pw.disabled .sb-pw-right { background: var(--surface-1); }
.sb-pw.read-only { border-color: transparent; pointer-events: none; }
.sb-pw.read-only .sb-pw-right { border-left-color: transparent; }`;

// --- PASSWORD ---
(() => {
  const LOCK_ICON  = sbIcon('lock-2-line', 'S');
  const EYE_CLOSE  = sbIconRaw('eye-close-line');
  const EYE_OPEN   = sbIconRaw('eye-line');

  window.sbPwToggle = function(btn) {
    const pw    = btn.closest('.sb-pw');
    const input = pw.querySelector('.sb-pw-input');
    const shown = input.type === 'text';
    input.type  = shown ? 'password' : 'text';
    btn.innerHTML = shown ? EYE_CLOSE : EYE_OPEN;
  };

  function mkPw(opts = {}) {
    const { value = 'mypassword123', placeholder, selected, critical, disabled, readOnly, fieldMode } = opts;
    let cls = 'sb-pw';
    if (selected) cls += ' selected';
    if (critical) cls += ' critical';
    if (disabled) cls += ' disabled';
    if (readOnly) cls += ' read-only';
    const widthCls = fieldMode ? 'sec-w100' : 'sec-narrow';
    const inputVal   = placeholder ? '' : value;
    const inputPH    = placeholder ? 'Password' : '';
    return `<div class="${cls} ${widthCls}">
      <div class="sb-pw-left">
        <span class="sb-pw-lock">${LOCK_ICON}</span>
        <input class="sb-pw-input" type="password" value="${inputVal}" placeholder="${inputPH}">
      </div>
      <div class="sb-pw-right">
        <button class="sb-pw-toggle" onclick="sbPwToggle(this)" title="Show/hide password">${EYE_CLOSE}</button>
      </div>
    </div>`;
  }

  function mkPwField(tfOpts = {}, fOpts = {}) {
    const { label, subscription, description, twoRow } = fOpts;
    const inputEl = mkPw({ ...tfOpts, fieldMode: true });
    if (!label && !subscription) return mkPw(tfOpts);
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
    name: 'password',
    title: 'Password Input',
    description: 'Поле ввода пароля. Иконка замка слева, кнопка показа/скрытия пароля справа. Состояния: Default, Placeholder, Selected, Critical, Disabled, Read Only.',
    playground: {
      title: 'Password Playground',
      wide: true,
      state: { placeholder: false, selected: false, critical: false, disabled: false, readOnly: false, showLabel: false, showSub: false, twoRow: false, showDesc: false },
      controls(pg) {
        return `<div class="pg-grid-3">
          ${pg.toggle('placeholder', 'Placeholder')}
          ${pg.toggle('selected',   'Selected')}
          ${pg.toggle('critical',   'Critical')}
          ${pg.toggle('disabled',   'Disable')}
          ${pg.toggle('readOnly',   'Read Only')}
          ${pg.toggle('showLabel',  'Label')}
          ${pg.toggle('showSub',    'Subscription')}
          ${pg.toggle('twoRow',     '2 Rows',      { requires: 'showLabel' })}
          ${pg.toggle('showDesc',   'Description', { requires: 'showLabel' })}
        </div>`;
      },
      render(s) {
        const fOpts = {
          label:        s.showLabel ? 'Label' : null,
          subscription: s.showSub   ? 'Subscription text' : null,
          description:  s.showDesc && s.twoRow ? 'Description text' : null,
          twoRow:       s.twoRow && s.showLabel,
        };
        return mkPwField(s, fOpts);
      },
      genCode(s) {
        const fOpts = {
          label:        s.showLabel ? 'Label' : null,
          subscription: s.showSub   ? 'Subscription text' : null,
          description:  s.showDesc && s.twoRow ? 'Description text' : null,
          twoRow:       s.twoRow && s.showLabel,
        };
        const css = (s.showLabel || s.showSub)
          ? COMP_CSS.password + '\n' + COMP_CSS["input-field-wrap"]
          : COMP_CSS.password;
        return { html: mkPwField(s, fOpts), css };
      },
    },
    sections: [
      {
        title: 'States',
        desc: 'Default, Placeholder, Selected (готов к вводу), Critical, Disabled, Read Only. Кнопка глаза переключает видимость пароля.',
        preview: `<div class="sec-col narrow gap-md">
          ${mkPw({})}
          ${mkPw({ placeholder: true })}
          ${mkPw({ selected: true, value: 'Password-123' })}
          ${mkPw({ critical: true })}
          ${mkPw({ disabled: true })}
          ${mkPw({ readOnly: true })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-pw">\n  <div class="sb-pw-left">\n    <span class="sb-pw-lock"><!-- lock icon --></span>\n    <input class="sb-pw-input" type="password" value="mypassword123">\n  </div>\n  <div class="sb-pw-right">\n    <button class="sb-pw-toggle" onclick="sbPwToggle(this)"><!-- eye-close icon --></button>\n  </div>\n</div>`,
        css: COMP_CSS.password,
      },
      {
        title: 'With Label & Subscription',
        desc: 'Password внутри sb-field — Label сверху, Subscription снизу.',
        preview: `<div class="sec-col narrow gap-lg">
          ${mkPwField({},                              { label: 'Password' })}
          ${mkPwField({},                              { label: 'Password', subscription: 'Subscription text' })}
          ${mkPwField({ critical: true },              { label: 'Password', subscription: 'Wrong password' })}
          ${mkPwField({ disabled: true },              { label: 'Password', subscription: 'Subscription text' })}
        </div>`,
        html: `<div class="sb-field">\n  <span class="sb-field-label">Password</span>\n  <div class="sb-pw">...</div>\n  <span class="sb-field-sub">Subscription text</span>\n</div>`,
        css: COMP_CSS.password + '\n' + COMP_CSS["input-field-wrap"],
      },
      {
        title: '2-row Layout',
        desc: 'Label слева, Password справа. Используй .sb-field-group для выравнивания.',
        preview: `<div class="sb-field-group sec-xl">
          ${mkPwField({}, { label: 'Password', twoRow: true })}
          ${mkPwField({}, { label: 'Password', subscription: 'Subscription text', twoRow: true })}
          ${mkPwField({}, { label: 'Password', description: 'Description text', subscription: 'Subscription text', twoRow: true })}
          ${mkPwField({}, { label: 'Password', description: 'Description text', twoRow: true })}
        </div>`,
        html: `<div class="sb-field-group">\n  <div class="sb-field two-row">\n    <div class="sb-field-left"><span class="sb-field-label">Password</span></div>\n    <div class="sb-field-right">\n      <div class="sb-pw">...</div>\n    </div>\n  </div>\n</div>`,
        css: COMP_CSS.password + '\n' + COMP_CSS["input-field-wrap"],
      },
    ],
  });
})();
