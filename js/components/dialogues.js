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
.sb-dialogue-check { align-self: flex-start; margin-bottom: calc(var(--gap-vert-s) - var(--gap-vert-m)); }
.sb-dialogue-check.below { margin-top: calc(-1 * var(--gap-vert-m)); margin-bottom: var(--pad-vert-16); }
.sb-dialogue-check .sb-checkbox-label { white-space: normal; }
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
   *   check   — consent-чекбокс: { label, below, checked } | false;
   *             above (default) — между слотом и баром, below — под баром
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
    const checkHtml = check ? `<div class="sb-checkbox sb-dialogue-check${check.below ? ' below' : ''}${check.checked ? ' checked' : ''}" onclick="sbDialogueToggleCheck(this)"><div class="sb-checkbox-box">${check.checked ? SB_GLYPHS.check : ''}</div><span class="sb-checkbox-label">${check.label || 'Don&#39;t ask again'}</span></div>` : '';
    return `<div class="sb-dialogue${symbol ? '' : ' no-symbol'}" role="alertdialog" aria-label="${title}">
      <div class="sb-dialogue-center">
        ${sym}
        <div class="sb-dialogue-title sb-h8">${title}</div>
        <div class="sb-dialogue-message sb-body-l">${message}</div>
      </div>
      ${check && !check.below ? checkHtml : ''}
      ${sbMkActionBar({ buttons: btns, align: 'center' })}
      ${check && check.below ? checkHtml : ''}
    </div>`;
  }
  window.sbMkDialogue = mkDialogue;

  // Живой тогл consent-чекбокса (DS-чекбокс — div, не input).
  window.sbDialogueToggleCheck = function(cb) {
    const on = cb.classList.toggle('checked');
    const box = cb.querySelector('.sb-checkbox-box');
    if (box) box.innerHTML = on ? SB_GLYPHS.check : '';
  };

  // ── Register ────────────────────────────────────────────────────────
  sbRegister({
    name: 'dialogues',
    title: 'Dialogues',
    description: sbT(
      'A conversation window: it asks a question or requests input and waits for the answer. A Dialogue is defined by its content — an optional symbol, a headline, a message and actions — while modality is not baked in: a modal Dialogue mounts on the Overlay primitive (over its Scrim backdrop), a non-modal one floats on its own. Assembled from DS parts: Symbol Badges on top, an Action Bar with Buttons at the bottom. The Alert variant is specced; Confirm and Form are coming next.',
      'Окно-разговор: задаёт вопрос или просит ввод и ждёт ответа. Dialogue определяется контентом — опциональный символ, headline, message и экшены — а модальность не вшита: модальный диалог монтируется на примитив Overlay (поверх его Scrim-подложки), немодальный плавает сам. Собран из частей DS: Symbol Badges сверху, Action Bar с Buttons снизу. Вариант Alert по спеке; Confirm и Form — следующие заходы.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry (Alert):</b>'
      + '<ul><li>Width: 320px (min 296 / max 320);</li><li>Radius: 16; Shadow-L; --background fill;</li><li>Padding: 16/16/0/16 — the bottom belongs to the Action Bar; card gap 16, center slot gap 8;</li><li>No top symbol — the top padding grows to 24.</li></ul>'
      + '<b>Typography:</b>'
      + '<ul><li>Headline — H8, --text-tertiary, centered;</li><li>Message — Body L, --text-secondary, centered.</li></ul>'
      + '<b>Slots:</b>'
      + '<ul><li>Top (optional) — a Symbol Badge, icon or image;</li><li>Footer — the Action Bar component, align center: one button goes full-width, two split evenly; its side padding is zeroed — the card provides the 16px inset;</li><li>Consent check (optional) — a Checkbox with a label at the left edge: above the Action Bar (16px from the center slot, 8px to the bar) or below it (flush to the bar, 0px);</li><li>A critical (red) button defaults to Secondary — a destructive action must not be the main CTA; an explicit variant overrides.</li></ul>',
      '<b>Геометрия (Alert):</b>'
      + '<ul><li>Ширина: 320px (min 296 / max 320);</li><li>Radius: 16; Shadow-L; заливка --background;</li><li>Padding: 16/16/0/16 — низ отдан Action Bar\'у; gap карточки 16, центрального слота 8;</li><li>Без Very Top символа — верхний padding вырастает до 24.</li></ul>'
      + '<b>Типографика:</b>'
      + '<ul><li>Headline — H8, --text-tertiary, по центру;</li><li>Message — Body L, --text-secondary, по центру.</li></ul>'
      + '<b>Слоты:</b>'
      + '<ul><li>Верхний (опциональный) — Symbol Badge, иконка или картинка;</li><li>Футер — компонент Action Bar, align center: одна кнопка — во всю ширину, две — поровну; его боковой padding обнулён — отступ 16 даёт карточка;</li><li>Consent check (опциональный) — Checkbox с лейблом у левого края: над Action Bar (16px от центрального слота, 8px до бара) или под ним (вплотную к бару, 0px);</li><li>Критическая (красная) кнопка по умолчанию Secondary — деструктив не должен быть главным CTA; явный variant побеждает.</li></ul>'
    )),
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
          'An optional Checkbox with a label for confirmations and agreements («don’t ask again», terms consent). Two placements: above the Action Bar — at the left edge, 16px from the center slot and 8px to the bar; or below the bar, flush to it (0px). The checkbox is alive — click it.',
          'Опциональный Checkbox с лейблом для подтверждений и согласий («не спрашивать снова», принятие условий). Два размещения: над Action Bar — у левого края, 16px от центрального слота и 8px до бара; или под баром, вплотную к нему (0px). Чекбокс живой — кликни.'
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
            check: { label: 'I agree to the terms of service', below: true },
          })}
        </div>`,
        html: `<!-- Above the Action Bar (default) -->
sbMkDialogue({ ..., check: { label: 'Don’t ask again' } })

<!-- Below the Action Bar -->
sbMkDialogue({ ..., check: { label: 'I agree to the terms of service', below: true } })

<!-- Разметка: DS Checkbox у левого края -->
<div class="sb-checkbox sb-dialogue-check">
  <div class="sb-checkbox-box"></div>
  <span class="sb-checkbox-label">Don’t ask again</span>
</div>`,
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
