// ═══════════════════════════════════════════════════════════════════════════
//  DIALOGUES
//  CSS в css/components/dialogues.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//
//  Окно-разговор: определяется контентом (символ / headline / message /
//  экшены). Два типа с одной разметкой, но разным поведением:
//    alert   — информирует, выбора нет: одна кнопка OK, «ничего не возвращает»
//    confirm — просит решение: OK + Cancel, «возвращает» true/false (Esc = false)
//  Модальность — НЕ здесь: modal-режим = монтирование в примитив Overlay.
//  Готовые обёртки: sbShowAlert / sbShowConfirm (промисы). Form — следующий заход.
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
   * sbMkDialogue(opts) — окно диалога.
   *   type    — 'alert' (default) | 'confirm'. Разметка общая, различие в
   *             семантике: alert информирует (одна кнопка OK, role="alertdialog"),
   *             confirm просит решение (OK + Cancel, role="dialog"). Политика
   *             закрытия и «возвращаемое значение» — у модальных обёрток
   *             sbShowAlert / sbShowConfirm ниже.
   *   symbol  — верхний символ: ключ SB_SVG ('warnLine', 'critLine', 'infoLine',
   *             'checkCircle'…), либо готовый html (img/иконка), либо false
   *   title   — headline (H7, --text-tertiary, по центру)
   *   message — описание (Body L, --text-secondary, по центру)
   *   buttons — экшены Action Bar'а: [{ label, variant, onClick, critical… }];
   *             рендерятся align center — одна кнопка = full-width, две = поровну.
   *             Дефолт по типу: alert — [OK], confirm — [OK, Cancel].
   *             ПРАВИЛО: critical-кнопка без явного variant — Secondary
   *             (красный деструктив не должен быть главным CTA по умолчанию)
   *   check   — consent-чекбокс: { label, checked } | false;
   *             всегда ПОД Action Bar'ом, вплотную к нему (размещение над
   *             баром выпилено — визуально не прижилось)
   *
   * Modal-режим — композиция с примитивом Overlay:
   *   sbMkOverlay({ content: sbMkDialogue({...}) }) + sbOverlayOpen(...)
   * или готовые обёртки: sbShowAlert(opts) / sbShowConfirm(opts).
   */
  function mkDialogue(opts = {}) {
    const type = opts.type === 'confirm' ? 'confirm' : 'alert';
    const {
      symbol = 'warnLine',
      title = type === 'confirm' ? 'Changes are not saved' : 'Operation completed',
      message = type === 'confirm'
        ? 'All changes will be lost if you go back.'
        : 'The file has been uploaded.',
      check = false,
      buttons = type === 'confirm'
        ? [
            { label: 'OK', variant: 'primary' },
            { label: 'Cancel', variant: 'secondary' },
          ]
        : [{ label: 'OK', variant: 'primary' }],
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
    return `<div class="sb-dialogue${symbol ? '' : ' no-symbol'}" role="${type === 'confirm' ? 'dialog' : 'alertdialog'}" aria-label="${title}">
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

  // ── Модальные обёртки: семантика alert() / confirm(), но асинхронная ──
  // Браузерные alert/confirm блокируют ПОТОК; здесь блокируется только
  // интерфейс (скрим + scroll lock + focus trap из Overlay), а «возвращаемое
  // значение» приезжает промисом:
  //   sbShowAlert(opts)   → Promise<undefined> — цель проинформировать, не
  //                         получить ответ; закрывается только кнопкой OK
  //   sbShowConfirm(opts) → Promise<boolean> — true если OK, false если
  //                         Cancel или Esc; готово для if:
  //                         if (await sbShowConfirm({ title: '…' })) { … }
  // Кнопки ожидаются 1–2: [0] — подтверждение, [1] — отмена.
  function showModal(opts, isConfirm) {
    return new Promise((resolve) => {
      const host = document.createElement('div');
      // closeOnBackdrop/-Esc выключены: клик мимо — не ответ; Esc confirm'а
      // обрабатываем сами, чтобы зарезолвить false, а не молча закрыть.
      host.innerHTML = sbMkOverlay({
        closeOnBackdrop: false,
        closeOnEsc: false,
        content: mkDialogue({ ...opts, type: isConfirm ? 'confirm' : 'alert' }),
      });
      const ov = host.firstElementChild;
      document.body.appendChild(ov);
      let settled = false;
      const settle = (val) => {
        if (settled) return;
        settled = true;
        document.removeEventListener('keydown', onKey, true);
        sbOverlayClose(ov);
        setTimeout(() => ov.remove(), 250); // после close-фейда Overlay (0.2s)
        resolve(val);
      };
      const onKey = (e) => { if (isConfirm && e.key === 'Escape') settle(false); };
      const btns = ov.querySelectorAll('.sb-action-bar .sb-btn');
      if (btns[0]) btns[0].addEventListener('click', () => settle(isConfirm ? true : undefined));
      if (btns[1]) btns[1].addEventListener('click', () => settle(false));
      document.addEventListener('keydown', onKey, true);
      sbOverlayOpen(ov);
      // Confirm: дефолтный фокус — на безопасной кнопке (Cancel), не на OK.
      if (isConfirm && btns[1]) btns[1].focus();
    });
  }
  window.sbShowAlert = (opts) => showModal(opts || {}, false);
  window.sbShowConfirm = (opts) => showModal(opts || {}, true);

  // sbDialogueToggleCheck снесён: тогл, клавиатура и aria приехали вместе
  // с нативным Checkbox (делегирование в checkbox.js).
  // Прочитать согласие: sbCheckboxChecked(dlg.querySelector('.sb-dialogue-check'))
  // либо слушать событие 'sb-checkbox:change' — оно всплывает до диалога.

  // Playground state → опции mkDialogue. Вынесено, чтобы render и genCode
  // собирали ОДНО И ТО ЖЕ: превью и скопированный код не расходятся.
  function pgOpts(s) {
    const confirm = s.type === 'confirm';
    // Тексты и кнопки следуют типу: alert информирует (одна OK),
    // confirm спрашивает (OK/Cancel; critical — деструктив по правилу Secondary).
    const texts = confirm
      ? (s.critical
          ? { title: 'Delete this file?', message: 'This action cannot be undone.' }
          : { title: 'Changes are not saved', message: 'All changes will be lost if you go back.' })
      : (s.critical
          ? { title: 'Upload failed', message: 'The file could not be uploaded.' }
          : { title: 'Operation completed', message: 'The file has been uploaded.' });
    const buttons = confirm
      ? (s.critical
          ? [{ label: 'Delete', critical: true }, { label: 'Cancel', variant: 'secondary' }]
          : [{ label: 'OK', variant: 'primary' }, { label: 'Cancel', variant: 'secondary' }])
      : [{ label: 'OK', variant: 'primary' }];
    return {
      type: s.type,
      symbol: s.symbol === 'none' ? false : s.symbol,
      title: texts.title,
      message: s.message ? texts.message : '',
      buttons,
      check: s.consent ? { label: 'Don’t ask again' } : false,
    };
  }

  // ── Register ────────────────────────────────────────────────────────
  sbRegister({
    name: 'dialogues',
    title: 'Dialogues',
    description: sbT(
      'A chat box prompts a question or request and waits for a response. Dialogues can include symbols, titles, messages, and actions. They vary in appearance: modal dialogues cover the screen with a dark background, while non-modal ones stand alone. Dialogues consist of a symbol at the top and button bars at the bottom. Currently, there are alert and confirm dialogues; form dialogues are upcoming.',
      'Окно диалога задаёт вопрос или запрос и ждёт ответа. Диалог может включать символ, заголовок, сообщение и действия. Внешний вид различается: модальные диалоги закрывают экран тёмной подложкой, немодальные стоят сами по себе. Диалог состоит из символа сверху и панелей кнопок снизу. Сейчас доступны alert- и confirm-диалоги; form-диалоги — на подходе.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry (Alert):</b>'
      + '<ul><li>Width: 320px (min 296 / max 320);</li><li>Radius: 16; Shadow-L; --background fill;</li><li>Padding: 16/16/0/16 — the bottom belongs to the Action Bar; card gap 16, center slot gap 8;</li><li>No top symbol — the top padding grows to 24.</li></ul>'
      + '<b>Typography:</b>'
      + '<ul><li>Headline — H8, --text-tertiary, centered;</li><li>Message — Body L, --text-secondary, centered.</li></ul>'
      + '<b>Slots:</b>'
      + '<ul><li>Top (optional) — a Symbol Badge, icon or image;</li><li>Footer — the Action Bar component, align center: one button goes full-width, two split evenly; its side padding is zeroed — the card provides the 16px inset;</li><li>Consent check (optional) — a Checkbox with a label at the left edge, always below the Action Bar and flush to it (0px);</li><li>A critical (red) button defaults to Secondary — a destructive action must not be the main CTA; an explicit variant overrides.</li></ul>'
      + '<b>Behaviour (alert vs confirm):</b>'
      + '<ul><li>Alert informs and expects no answer: one OK button, role alertdialog; the modal version closes only via OK — Esc and the backdrop are off. sbShowAlert(opts) returns a Promise that resolves with nothing, like window.alert;</li><li>Confirm asks for a decision: OK and Cancel, role dialog; Esc equals Cancel. sbShowConfirm(opts) resolves with a boolean — true for OK, false for Cancel or Esc — ready for an if branch. The default focus lands on Cancel, the safe choice;</li><li>Both are modal through the Overlay primitive: the interface is blocked, the code is not — the answer arrives via the Promise.</li></ul>',
      '<b>Геометрия (Alert):</b>'
      + '<ul><li>Ширина: 320px (min 296 / max 320);</li><li>Radius: 16; Shadow-L; заливка --background;</li><li>Padding: 16/16/0/16 — низ отдан Action Bar\'у; gap карточки 16, центрального слота 8;</li><li>Без Very Top символа — верхний padding вырастает до 24.</li></ul>'
      + '<b>Типографика:</b>'
      + '<ul><li>Headline — H8, --text-tertiary, по центру;</li><li>Message — Body L, --text-secondary, по центру.</li></ul>'
      + '<b>Слоты:</b>'
      + '<ul><li>Верхний (опциональный) — Symbol Badge, иконка или картинка;</li><li>Футер — компонент Action Bar, align center: одна кнопка — во всю ширину, две — поровну; его боковой padding обнулён — отступ 16 даёт карточка;</li><li>Consent check (опциональный) — Checkbox с лейблом у левого края, всегда под Action Bar и вплотную к нему (0px);</li><li>Критическая (красная) кнопка по умолчанию Secondary — деструктив не должен быть главным CTA; явный variant побеждает.</li></ul>'
      + '<b>Поведение (alert vs confirm):</b>'
      + '<ul><li>Alert информирует и не ждёт ответа: одна кнопка OK, role alertdialog; модальная версия закрывается только по OK — Esc и подложка выключены. sbShowAlert(opts) возвращает промис без значения, как window.alert;</li><li>Confirm просит решение: OK и Cancel, role dialog; Esc равен Cancel. sbShowConfirm(opts) резолвится булевым — true при OK, false при Cancel или Esc — готово для if. Дефолтный фокус — на Cancel, безопасном выборе;</li><li>Оба модальны через примитив Overlay: блокируется интерфейс, а не код — ответ приезжает промисом.</li></ul>'
    )),
    playground: {
      title: 'Dialogues Playground',
      // Лейблы тоглов — одним словом: ячейка .pg-toggles узкая, режет длинные.
      // Кнопки не переключаются отдельно — их диктует тип (alert = OK,
      // confirm = OK/Cancel; critical заменяет OK на деструктив).
      state: { type: 'alert', symbol: 'warnLine', message: true, critical: false, consent: false },
      controls(pg) {
        return sbPgGroup('Type', `
          ${pg.select('type', [
            { value: 'alert',   label: 'Alert' },
            { value: 'confirm', label: 'Confirm' },
          ])}
          <div class="pg-toggles">${pg.toggle('critical', 'Critical')}</div>
        `) + sbPgGroup('Symbol', `
          ${pg.select('symbol', [
            { value: 'warnLine',    label: 'Warning' },
            { value: 'critLine',    label: 'Critical' },
            { value: 'infoLine',    label: 'Info' },
            { value: 'checkCircle', label: 'Success' },
            { value: 'none',        label: 'None' },
          ])}
        `) + sbPgGroup('Content', `
          <div class="pg-toggles">${pg.toggle('message', 'Message')}${pg.toggle('consent', 'Consent')}</div>
        `);
      },
      render(s) {
        return mkDialogue(pgOpts(s));
      },
      genCode(s) {
        const o = pgOpts(s);
        const call = `sbMkDialogue({\n`
          + `  type: '${o.type}',\n`
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
          + `<div class="sb-dialogue${o.symbol ? '' : ' no-symbol'}" role="${o.type === 'confirm' ? 'dialog' : 'alertdialog'}">\n`
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
        title: sbT('Alert — informs', 'Alert — информирует'),
        desc: sbT(
          'An alert reports a fact and expects no answer: a single OK button, no choice to make. The role is alertdialog; in the modal version Esc and the backdrop are off — the window closes only via its button. Variants: a success message, a critical one and a symbol-less one.',
          'Alert сообщает факт и не ждёт ответа: одна кнопка OK, выбора нет. Роль — alertdialog; в модальной версии Esc и подложка выключены — окно закрывается только кнопкой. Варианты: успех, критический и без символа.'
        ),
        preview: `${sbMkFlex({ gap: 'lg', align: 'start', wrap: true, attrs: ' style="padding:var(--pad-vert-24); background:var(--surface-1); border-radius:var(--radius-12)"', content: `${mkDialogue({
            symbol: 'checkCircle',
          })}
          ${mkDialogue({
            symbol: 'critLine',
            title: 'Upload failed',
            message: 'The file could not be uploaded.',
          })}
          ${mkDialogue({
            symbol: false,
            title: 'Session expired',
            message: 'Please log in again to continue.',
            buttons: [{ label: 'Log In', variant: 'primary' }],
          })}` })}`,
        html: `<!-- Alert информирует — промис резолвится без значения, как window.alert -->
sbShowAlert({ symbol: 'checkCircle', title: 'Operation completed', message: 'The file has been uploaded.' });

<!-- Разметка (sbMkDialogue({ type: 'alert', ... })): -->
<div class="sb-dialogue" role="alertdialog" aria-label="Operation completed">
  <div class="sb-dialogue-center">
    <span class="sb-dialogue-symbol"><!-- Symbol Badge: checkCircle 24×24 --></span>
    <div class="sb-dialogue-title sb-h8">Operation completed</div>
    <div class="sb-dialogue-message sb-body-l">The file has been uploaded.</div>
  </div>
  <nav class="sb-action-bar align-center" aria-label="Actions">
    ${sbMkButton({ label: 'OK', variant: 'primary' })}
  </nav>
</div>`,
        css: COMP_CSS.dialogues,
      },
      {
        title: sbT('Confirm — asks for a decision', 'Confirm — просит решение'),
        desc: sbT(
          'A confirm intercepts an action and waits for a decision: OK and Cancel, role dialog. sbShowConfirm resolves with a boolean — true for OK, false for Cancel or Esc — so the result drops straight into an if. The default focus lands on Cancel, the safe choice. A destructive confirmation follows the critical rule: the red button is Secondary, not the main CTA.',
          'Confirm перехватывает действие и ждёт решения: OK и Cancel, роль dialog. sbShowConfirm резолвится булевым — true при OK, false при Cancel или Esc — результат сразу ложится в if. Дефолтный фокус — на Cancel, безопасном выборе. Деструктивное подтверждение следует critical-правилу: красная кнопка — Secondary, не главный CTA.'
        ),
        preview: `${sbMkFlex({ gap: 'lg', align: 'start', wrap: true, attrs: ' style="padding:var(--pad-vert-24); background:var(--surface-1); border-radius:var(--radius-12)"', content: `${mkDialogue({ type: 'confirm' })}
          ${mkDialogue({
            type: 'confirm',
            symbol: 'critLine',
            title: 'Delete the file?',
            message: 'This action cannot be undone.',
            buttons: [
              { label: 'Delete', critical: true }, // без variant → Secondary (правило)
              { label: 'Cancel', variant: 'secondary' },
            ],
          })}` })}`,
        html: `<!-- Confirm возвращает решение: true — OK, false — Cancel или Esc -->
if (await sbShowConfirm({ title: 'Do you want to continue?' })) {
  // действие подтверждено
} else {
  // действие отменено
}

<!-- Деструктив: критическая кнопка остаётся Secondary -->
sbShowConfirm({
  symbol: 'critLine',
  title: 'Delete the file?',
  message: 'This action cannot be undone.',
  buttons: [
    { label: 'Delete', critical: true },
    { label: 'Cancel', variant: 'secondary' },
  ],
})

<!-- Разметка та же, что у Alert, но role="dialog" и две кнопки -->`,
        css: COMP_CSS.dialogues,
      },
      {
        title: sbT('Consent check', 'Consent check'),
        desc: sbT(
          'An optional Checkbox with a label for confirmations and agreements («don’t ask again», terms consent). It always sits below the Action Bar, flush to it (0px), at the left edge — the buttons stay the last thing before the card ends. This is the DS Checkbox itself, not a copy of its markup, so it comes with Tab and Space out of the box — important here, because a modal alert traps focus and has Esc switched off. Read the answer with sbCheckboxChecked(el), or listen for the sb-checkbox:change event — it bubbles up to the dialogue. Click it or tab to it.',
          'Опциональный Checkbox с лейблом для подтверждений и согласий («не спрашивать снова», принятие условий). Всегда под Action Bar, вплотную к нему (0px), у левого края — кнопки остаются последним, что видно перед краем карточки. Это сам DS-Checkbox, а не копия его разметки, поэтому Tab и Space работают из коробки — здесь это важно: модальный алерт держит фокус внутри и Esc у него выключен. Ответ читается через sbCheckboxChecked(el) или по событию sb-checkbox:change — оно всплывает до диалога. Кликни или дойди табом.'
        ),
        preview: `${sbMkFlex({ gap: 'lg', align: 'start', wrap: true, attrs: ' style="padding:var(--pad-vert-24); background:var(--surface-1); border-radius:var(--radius-12)"', content: `${mkDialogue({
            check: { label: 'Don’t ask again' },
          })}
          ${mkDialogue({
            symbol: 'infoLine',
            title: 'Accept the terms',
            message: 'Please review the terms of service before continuing.',
            buttons: [{ label: 'Continue', variant: 'primary' }],
            check: { label: 'I agree to the terms of service' },
          })}` })}`,
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
          'Modality is composition, not a prop of the window: the Dialogue mounts into the Overlay and gets the scrim, scroll lock, focus trap and the portal to body for free. The escape hatches follow the type: an alert closes only via OK, a confirm treats Esc as Cancel and resolves false. The buttons below call the real helpers — the snackbar reports what the confirm returned.',
          'Модальность — композиция, а не свойство окна: Dialogue монтируется в Overlay и бесплатно получает скрим, scroll lock, focus trap и portal в body. «Запасные выходы» следуют типу: alert закрывается только по OK, confirm трактует Esc как Cancel и резолвит false. Кнопки ниже зовут настоящие хелперы — снэкбар показывает, что вернул confirm.'
        ),
        preview: `${sbMkFlex({ gap: 'm', align: 'center', content: sbMkButton({ label: 'Open Alert', variant: 'primary', attrs: ` onclick="sbShowAlert({ symbol: 'checkCircle' })"` })
          + sbMkButton({ label: 'Open Confirm', variant: 'secondary', attrs: ` onclick="sbShowConfirm({ symbol: 'critLine', title: 'Delete the file?', message: 'This action cannot be undone.', buttons: [{ label: 'Delete', critical: true }, { label: 'Cancel', variant: 'secondary' }] }).then((ok) => sbShowSnackbar({ success: ok, text: ok ? 'Deleted' : 'Cancelled' }))"` }) })}`,
        html: `// Alert: интерфейс заблокирован до OK; промис — без значения
await sbShowAlert({ symbol: 'checkCircle', title: 'Operation completed', message: 'The file has been uploaded.' });

// Confirm: true — OK, false — Cancel или Esc
const ok = await sbShowConfirm({
  symbol: 'critLine',
  title: 'Delete the file?',
  message: 'This action cannot be undone.',
  buttons: [{ label: 'Delete', critical: true }, { label: 'Cancel', variant: 'secondary' }],
});
sbShowSnackbar({ success: ok, text: ok ? 'Deleted' : 'Cancelled' });

// Под капотом — та же композиция, доступная и вручную:
sbMkOverlay({ id: 'my-dialogue', closeOnBackdrop: false, closeOnEsc: false,
              content: sbMkDialogue({ type: 'confirm', ... }) })
sbOverlayOpen('#my-dialogue'); // скрим + scroll lock + focus trap из примитива`,
        css: COMP_CSS.dialogues,
      },
    ],
  });
})();
