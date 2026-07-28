// ═══════════════════════════════════════════════════════════════════════════
//  DIALOGUES
//  CSS в css/components/dialogues.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//
//  Окно-разговор: определяется контентом (символ / headline / message /
//  экшены). Модальность — НЕ здесь: modal-режим = монтирование в примитив
//  Overlay (sbMkOverlay + sbOverlayOpen). Пока вариант Alert по Figma-спеке;
//  Confirm / Form — следующие заходы.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.dialogues = `.sb-dialogue { display: flex; flex-direction: column; align-items: center; gap: var(--gap-vert-m); width: 320px; min-width: 296px; max-width: 320px; padding: var(--pad-vert-16) var(--pad-horiz-16) var(--pad-vert-0) var(--pad-horiz-16); box-sizing: border-box; border-radius: var(--radius-16); background: var(--background); box-shadow: 0 10px 20px 0 var(--shadow-overlay); }
.sb-dialogue-center { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--gap-vert-s); align-self: stretch; }
.sb-dialogue-symbol  { display: inline-flex; }
.sb-dialogue-title   { color: var(--text-tertiary);  text-align: center; }
.sb-dialogue-message { color: var(--text-secondary); text-align: center; }
.sb-dialogue .sb-action-bar { padding-left: var(--pad-horiz-0); padding-right: var(--pad-horiz-0); }
.sb-dialogue-check { align-self: flex-start; margin-top: calc(-1 * var(--gap-vert-m)); margin-bottom: var(--pad-vert-16); }
.sb-dialogue-check .sb-checkbox-label { white-space: normal; text-transform: none; }
.sb-dialogue.no-symbol { padding-top: var(--pad-vert-24); }`;

// --- DIALOGUES ---
(() => {
  /**
   * sbMkDialogue(opts) — окно диалога (Alert).
   *   symbol  — верхний символ: ключ SB_SVG ('warnLine', 'critLine', 'infoLine',
   *             'checkCircle'…), либо готовый html (img/иконка), либо false
   *   title   — headline (H7, --text-tertiary, по центру)
   *   message — описание (Body L, --text-secondary, по центру)
   *   buttons — экшены Action Bar'а: [{ label, variant, onClick, critical… }];
   *             рендерятся align center — одна кнопка = full-width, две = поровну.
   *             ПРАВИЛО: critical-кнопка без явного variant — Secondary
   *             (красный деструктив не должен быть главным CTA по умолчанию)
   *   check   — consent-чекбокс: { label, checked } | false;
   *             всегда ПОД Action Bar'ом, вплотную к нему (размещение над
   *             баром выпилено — визуально не прижилось)
   *
   * Modal-режим — композиция с примитивом Overlay:
   *   sbMkOverlay({ content: sbMkDialogue({...}) }) + sbOverlayOpen(...)
   */
  function mkDialogue(opts = {}) {
    const {
      symbol = 'warnLine',
      title = 'Changes are not saved',
      message = 'All changes will be lost if you go back.',
      check = false,
      buttons = [
        { label: 'Button', variant: 'primary' },
        { label: 'Button', variant: 'secondary' },
      ],
    } = opts;
    const sym = !symbol ? ''
      : `<span class="sb-dialogue-symbol">${(typeof SB_SVG === 'object' && SB_SVG[symbol]) ? SB_SVG[symbol] : symbol}</span>`;
    // Critical по умолчанию Secondary — явный variant в пропсе побеждает.
    const btns = buttons.map(b => (b.critical && !b.variant) ? { ...b, variant: 'secondary' } : b);
    // Нативный DS-чекбокс (не копия разметки): вместе с ним приезжают
    // Tab/Space, aria-checked и событие sb-checkbox:change.
    const checkHtml = check ? sbMkCheckbox({
      label: check.label || 'Don’t ask again',
      checked: !!check.checked,
      cls: 'sb-dialogue-check',
    }) : '';
    return `<div class="sb-dialogue${symbol ? '' : ' no-symbol'}" role="alertdialog" aria-label="${title}">
      <div class="sb-dialogue-center">
        ${sym}
        <div class="sb-dialogue-title sb-h8">${title}</div>
        ${message ? `<div class="sb-dialogue-message sb-body-l">${message}</div>` : ''}
      </div>
      ${sbMkActionBar({ buttons: btns, align: 'center' })}
      ${checkHtml}
    </div>`;
  }
  window.sbMkDialogue = mkDialogue;

  // sbDialogueToggleCheck снесён: тогл, клавиатура и aria приехали вместе
  // с нативным Checkbox (делегирование в checkbox.js).
  // Прочитать согласие: sbCheckboxChecked(dlg.querySelector('.sb-dialogue-check'))
  // либо слушать событие 'sb-checkbox:change' — оно всплывает до диалога.

  // Playground state → опции mkDialogue. Вынесено, чтобы render и genCode
  // собирали ОДНО И ТО ЖЕ: превью и скопированный код не расходятся.
  function pgOpts(s) {
    const buttons = s.critical
      ? [{ label: 'Delete', critical: true }, { label: 'Cancel', variant: 'secondary' }]
      : [{ label: 'Button', variant: 'primary' }, { label: 'Button', variant: 'secondary' }];
    return {
      symbol: s.symbol === 'none' ? false : s.symbol,
      title: s.critical ? 'Delete this file?' : 'Changes are not saved',
      message: s.message
        ? (s.critical ? 'This file will be removed permanently.' : 'All changes will be lost if you go back.')
        : '',
      buttons: s.second ? buttons : buttons.slice(0, 1),
      check: s.consent ? { label: 'Don’t ask again' } : false,
    };
  }

  // ── Register ────────────────────────────────────────────────────────
  sbRegister({
    name: 'dialogues',
    title: 'Dialogues',
    description: sbT(
      'A conversation window asks a question or requests input, waiting for a response. A dialogue consists of various elements: a picture, title, message, and clickable buttons. It can float independently rather than covering the entire screen. Dialogues feature symbols at the top and buttons at the bottom. They come in two types: full-screen and floating. Additional dialogue types include alerts and forms.',
      'Окно-разговор задаёт вопрос или просит ввод и ждёт ответа. Диалог состоит из разных элементов: картинки, заголовка, сообщения и кликабельных кнопок. Он может плавать сам по себе, а не закрывать весь экран. У диалогов символы сверху и кнопки снизу. Бывают двух типов: полноэкранные и плавающие. Дополнительные типы диалогов — алерты и формы.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry (Alert):</b>'
      + '<ul><li>Width: 320px (min 296 / max 320);</li><li>Radius: 16; Shadow-L; --background fill;</li><li>Padding: 16/16/0/16 — the bottom belongs to the Action Bar; card gap 16, center slot gap 8;</li><li>No top symbol — the top padding grows to 24.</li></ul>'
      + '<b>Typography:</b>'
      + '<ul><li>Headline — H8, --text-tertiary, centered;</li><li>Message — Body L, --text-secondary, centered.</li></ul>'
      + '<b>Slots:</b>'
      + '<ul><li>Top (optional) — a Symbol Badge, icon or image;</li><li>Footer — the Action Bar component, align center: one button goes full-width, two split evenly; its side padding is zeroed — the card provides the 16px inset;</li><li>Consent check (optional) — a Checkbox with a label at the left edge, always below the Action Bar and flush to it (0px);</li><li>A critical (red) button defaults to Secondary — a destructive action must not be the main CTA; an explicit variant overrides.</li></ul>',
      '<b>Геометрия (Alert):</b>'
      + '<ul><li>Ширина: 320px (min 296 / max 320);</li><li>Radius: 16; Shadow-L; заливка --background;</li><li>Padding: 16/16/0/16 — низ отдан Action Bar\'у; gap карточки 16, центрального слота 8;</li><li>Без Very Top символа — верхний padding вырастает до 24.</li></ul>'
      + '<b>Типографика:</b>'
      + '<ul><li>Headline — H8, --text-tertiary, по центру;</li><li>Message — Body L, --text-secondary, по центру.</li></ul>'
      + '<b>Слоты:</b>'
      + '<ul><li>Верхний (опциональный) — Symbol Badge, иконка или картинка;</li><li>Футер — компонент Action Bar, align center: одна кнопка — во всю ширину, две — поровну; его боковой padding обнулён — отступ 16 даёт карточка;</li><li>Consent check (опциональный) — Checkbox с лейблом у левого края, всегда под Action Bar и вплотную к нему (0px);</li><li>Критическая (красная) кнопка по умолчанию Secondary — деструктив не должен быть главным CTA; явный variant побеждает.</li></ul>'
    )),
    playground: {
      title: 'Dialogues Playground',
      // Лейблы тоглов — одним словом: ячейка .pg-toggles узкая, режет длинные.
      state: { symbol: 'warnLine', message: true, second: true, critical: false, consent: false },
      controls(pg) {
        return sbPgGroup('Symbol', `
          ${pg.select('symbol', [
            { value: 'warnLine',    label: 'Warning' },
            { value: 'critLine',    label: 'Critical' },
            { value: 'infoLine',    label: 'Info' },
            { value: 'checkCircle', label: 'Success' },
            { value: 'none',        label: 'None' },
          ])}
        `) + sbPgGroup('Content', `
          <div class="pg-toggles">${pg.toggle('message', 'Message')}${pg.toggle('consent', 'Consent')}</div>
        `) + sbPgGroup('Actions', `
          <div class="pg-toggles">${pg.toggle('second', 'Second')}${pg.toggle('critical', 'Critical')}</div>
        `);
      },
      render(s) {
        return mkDialogue(pgOpts(s));
      },
      genCode(s) {
        const o = pgOpts(s);
        const call = `sbMkDialogue({\n`
          + `  symbol: ${o.symbol ? `'${o.symbol}'` : 'false'},\n`
          + `  title: '${o.title}',\n`
          + (o.message ? `  message: '${o.message}',\n` : `  message: '',\n`)
          + `  buttons: [${o.buttons.map(b =>
              '{ ' + Object.entries(b).map(([k, v]) =>
                `${k}: ${typeof v === 'string' ? `'${v}'` : v}`).join(', ') + ' }'
            ).join(', ')}],\n`
          + (o.check ? `  check: { label: '${o.check.label}' },\n` : '')
          + `})`;
        const html = `<!-- Собирается хелпером: -->\n${call}\n\n`
          + `<!-- Разметка: -->\n`
          + `<div class="sb-dialogue${o.symbol ? '' : ' no-symbol'}" role="alertdialog">\n`
          + `  <div class="sb-dialogue-center">\n`
          + (o.symbol ? `    <span class="sb-dialogue-symbol"><!-- ${o.symbol} 24px --></span>\n` : '')
          + `    <div class="sb-dialogue-title sb-h8">${o.title}</div>\n`
          + (o.message ? `    <div class="sb-dialogue-message sb-body-l">${o.message}</div>\n` : '')
          + `  </div>\n`
          + `  <nav class="sb-action-bar align-center" aria-label="Actions"> ... </nav>\n`
          + (o.check ? `  <div class="sb-checkbox sb-dialogue-check">\n    <div class="sb-checkbox-box"></div>\n    <span class="sb-checkbox-label">${o.check.label}</span>\n  </div>\n` : '')
          + `</div>`;
        return { html, css: COMP_CSS.dialogues };
      },
    },
    sections: [
      {
        title: sbT('Alert — anatomy and variants', 'Alert — анатомия и варианты'),
        desc: sbT(
          'The specced Alert: a warning symbol, a headline, a message and two actions. Next to it — a critical flavour (critLine symbol plus a critical primary) and a symbol-less one with a single full-width button.',
          'Alert по спеке: warning-символ, headline, message и два экшена. Рядом — критический вариант (символ critLine и critical primary) и вариант без символа с одной full-width кнопкой.'
        ),
        preview: `<div class="sec-row wrap gap-lg" style="align-items:flex-start;padding:var(--pad-vert-24);background:var(--surface-1);border-radius:var(--radius-12)">
          ${mkDialogue({})}
          ${mkDialogue({
            symbol: 'critLine',
            title: 'Delete the file?',
            message: 'This action cannot be undone.',
            buttons: [
              { label: 'Delete', critical: true }, // без variant → Secondary (правило)
              { label: 'Cancel', variant: 'secondary' },
            ],
          })}
          ${mkDialogue({
            symbol: false,
            title: 'Session expired',
            message: 'Please log in again to continue.',
            buttons: [{ label: 'Log In', variant: 'primary' }],
          })}
        </div>`,
        html: `<div class="sb-dialogue" role="alertdialog" aria-label="Changes are not saved">
  <div class="sb-dialogue-center">
    <span class="sb-dialogue-symbol"><!-- Symbol Badge: warnLine 24×24 --></span>
    <div class="sb-dialogue-title sb-h8">Changes are not saved</div>
    <div class="sb-dialogue-message sb-body-l">All changes will be lost if you go back.</div>
  </div>
  <nav class="sb-action-bar align-center" aria-label="Actions">
    <button class="sb-btn sb-btn-primary">Button</button>
    <button class="sb-btn sb-btn-secondary">Button</button>
  </nav>
</div>

<!-- JS: sbMkDialogue({ symbol, title, message, buttons }) → html -->`,
        css: COMP_CSS.dialogues,
      },
      {
        title: sbT('Consent check', 'Consent check'),
        desc: sbT(
          'An optional Checkbox with a label for confirmations and agreements («don’t ask again», terms consent). It always sits below the Action Bar, flush to it (0px), at the left edge — the buttons stay the last thing before the card ends. This is the DS Checkbox itself, not a copy of its markup, so it comes with Tab and Space out of the box — important here, because a modal alert traps focus and has Esc switched off. Read the answer with sbCheckboxChecked(el), or listen for the sb-checkbox:change event — it bubbles up to the dialogue. Click it or tab to it.',
          'Опциональный Checkbox с лейблом для подтверждений и согласий («не спрашивать снова», принятие условий). Всегда под Action Bar, вплотную к нему (0px), у левого края — кнопки остаются последним, что видно перед краем карточки. Это сам DS-Checkbox, а не копия его разметки, поэтому Tab и Space работают из коробки — здесь это важно: модальный алерт держит фокус внутри и Esc у него выключен. Ответ читается через sbCheckboxChecked(el) или по событию sb-checkbox:change — оно всплывает до диалога. Кликни или дойди табом.'
        ),
        preview: `<div class="sec-row wrap gap-lg" style="align-items:flex-start;padding:var(--pad-vert-24);background:var(--surface-1);border-radius:var(--radius-12)">
          ${mkDialogue({
            check: { label: 'Don’t ask again' },
          })}
          ${mkDialogue({
            symbol: 'infoLine',
            title: 'Accept the terms',
            message: 'Please review the terms of service before continuing.',
            buttons: [{ label: 'Continue', variant: 'primary' }],
            check: { label: 'I agree to the terms of service' },
          })}
        </div>`,
        html: `<!-- Чекбокс всегда под Action Bar -->
sbMkDialogue({ ..., check: { label: 'Don’t ask again' } })

<!-- Внутри собирается нативным чекбоксом: -->
sbMkCheckbox({ label: 'Don’t ask again', cls: 'sb-dialogue-check' })

<!-- Разметка: DS Checkbox у левого края, ПОСЛЕ .sb-action-bar -->
<div class="sb-checkbox sb-dialogue-check"
     data-sb-checkbox role="checkbox" aria-checked="false" tabindex="0">
  <div class="sb-checkbox-box"></div>
  <span class="sb-checkbox-label">Don’t ask again</span>
</div>

<!-- Прочитать согласие -->
const agreed = sbCheckboxChecked(dlg.querySelector('.sb-dialogue-check'));
// либо реактивно:
dlg.addEventListener('sb-checkbox:change', e => console.log(e.detail.checked));`,
        css: COMP_CSS.dialogues,
      },
      {
        title: sbT('Modal — on the Overlay primitive', 'Modal — на примитиве Overlay'),
        desc: sbT(
          'Modality is composition, not a prop of the window: the Dialogue mounts into the Overlay and gets the scrim, focus trap and the portal to body for free. For alerts both escape hatches are off (closeOnBackdrop / closeOnEsc: false) — an alert demands a decision, so it closes only via its buttons.',
          'Модальность — композиция, а не свойство окна: Dialogue монтируется в Overlay и бесплатно получает скрим, focus trap и portal в body. Для алертов оба «запасных выхода» выключены (closeOnBackdrop / closeOnEsc: false) — алерт требует решения, закрывается только кнопками.'
        ),
        preview: `<button class="sb-btn sb-btn-primary" type="button" onclick="sbOverlayOpen('#sb-dialogue-modal-demo')">Open Alert</button>
          ${sbMkOverlay({
            id: 'sb-dialogue-modal-demo',
            closeOnBackdrop: false,
            closeOnEsc: false,
            content: mkDialogue({
              buttons: [
                { label: 'Stay', variant: 'primary', onClick: "sbOverlayClose(this.closest('.sb-overlay'))" },
                { label: 'Leave', variant: 'secondary', onClick: "sbOverlayClose(this.closest('.sb-overlay'))" },
              ],
            }),
          })}`,
        html: `<!-- Модальный Alert = Dialogue внутри Overlay.
     Алерт требует решения: запасные выходы выключены, закрытие только кнопками. -->
sbMkOverlay({
  id: 'my-alert',
  closeOnBackdrop: false,
  closeOnEsc: false,
  content: sbMkDialogue({
    title: 'Changes are not saved',
    message: 'All changes will be lost if you go back.',
    buttons: [
      { label: 'Stay',  variant: 'primary',   onClick: "sbOverlayClose(this.closest('.sb-overlay'))" },
      { label: 'Leave', variant: 'secondary', onClick: "sbOverlayClose(this.closest('.sb-overlay'))" },
    ],
  }),
})

// открытие: скрим + scroll lock + focus trap из примитива
sbOverlayOpen('#my-alert');`,
        css: COMP_CSS.dialogues,
      },
    ],
  });
})();
