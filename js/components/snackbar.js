// ═══════════════════════════════════════════════════════════════════════════
//  SNACKBAR
//  CSS в css/components/snackbar.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.snackbar = `/* ── Snackbar ── floating bottom feedback about an action. Inverse plate
   without inverse tokens: --text-tertiary bg + --surface-1 text — the pair
   flips with the theme automatically. Types by composition, not colour:
   Feedback (message only) / Action (message + a mini action button). */
.sb-snackbar {
  display: flex;
  min-width: 320px;
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  justify-content: center;
  align-items: center;
  gap: var(--gap-horiz-s);
  border-radius: var(--radius-8);
  background: var(--text-tertiary);
  box-shadow: 0 10px 20px 0 var(--shadow-overlay); /* Shadow-L */
  box-sizing: border-box;
}
.sb-snackbar-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--gap-horiz-s);
  flex: 1 0 0;
  min-width: 0;
}
.sb-snackbar-lead { flex-shrink: 0; display: inline-flex; align-items: center; color: var(--surface-1); }
/* Позитивный исход (sent / copied) — зелёный Check Circle. */
.sb-snackbar-lead.is-success { color: var(--success); }
/* Message: Title S Regular via sb-* classes in markup; single line + ellipsis.
   Вертикальный padding обязателен: Title S — 14px при line-height 12px,
   overflow:hidden без запаса клипает выносные элементы глифов. */
.sb-snackbar-msg {
  flex: 1 0 0;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: var(--pad-vert-4) 0;
  color: var(--surface-1);
}
.sb-snackbar-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-4);
  color: var(--surface-1);
  cursor: pointer;
  transition: background 0.15s ease;
}
.sb-snackbar-close:hover { background: var(--shadow-overlay); }

/* Обратный таймер-лоадер: кольцо 20px, убывает 5 секунд. В статичных
   демо кольцо полное; анимация — только на живом снэкбаре (.is-live,
   вешает sbShowSnackbar). Длина окружности r=8 → 2πr ≈ 50.27. */
.sb-snackbar-timer {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: var(--surface-1);
}
.sb-snackbar.is-live .sb-snackbar-timer circle {
  animation: sb-snackbar-countdown 5s linear forwards;
}
@keyframes sb-snackbar-countdown {
  to { stroke-dashoffset: 50.27; }
}

/* Host живого снэкбара (sbShowSnackbar): фикс снизу по центру экрана,
   слайд вверх при появлении. 24px от низа — поведенческий слой, не Figma. */
.sb-snackbar-host {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%, 8px);
  opacity: 0;
  z-index: 10000;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.sb-snackbar-host.is-in { opacity: 1; transform: translate(-50%, 0); }`;

(() => {
  // Лид позитивного исхода — Check Circle из наших Symbol Badges
  // (SB_BADGE_SPECS, badge.js грузится раньше). Регистрируем в ICON_PATHS,
  // чтобы рендерить через sbIcon(size 'S' = 16px) и красить currentColor'ом.
  if (typeof SB_BADGE_SPECS !== 'undefined') {
    ICON_PATHS['success-fill'] = SB_BADGE_SPECS.checkCircle.d;
  }

  // ── Snackbar builder ────────────────────────────────────────────────
  // Типы по составу, не по цвету: Feedback (только сообщение — «Message sent»)
  // и Action (сообщение + mini-кнопка — Undo / Refresh).
  // text:    сообщение (одна строка, ellipsis)
  // success: позитивный исход → зелёный Check Circle лид (sent / copied)
  // lead:    свой контент слева (HTML/текст); по умолчанию — check-иконка; false — без лида
  // action:  'OK' или { label, onClick } → Primary Mini кнопка
  // timer:   секунды обратного кольца (true → 5); анимация — только на живом (.is-live)
  // close:   true → крест (уводит снэкбар с фейдом)
  function mkSnackbar(o) {
    const c = o || {};
    // lead: false → нет; имя из ICON_PATHS → иконка S; иначе — свой HTML/текст.
    const leadInner = typeof c.lead === 'string' && ICON_PATHS[c.lead]
      ? sbIcon(c.lead, 'S')
      : (c.lead || sbIcon(c.success ? 'success-fill' : 'check-line', 'S'));
    const lead = c.lead === false ? ''
      : `<span class="sb-snackbar-lead${c.success ? ' is-success' : ''}">${leadInner}</span>`;
    const act = typeof c.action === 'string' ? { label: c.action } : c.action;
    // Клик по действию всегда закрывает снэкбар (после пользовательского onClick).
    const action = act
      ? sbMkButton({ label: act.label, variant: 'primary', size: 'mini',
          attrs: ` onclick="${act.onClick ? act.onClick + '; ' : ''}sbSnackbarDismiss(this)"` })
      : '';
    // Прогресс-кольцо (не иконка из ICON_PATHS — компонентная графика, как SB_SVG).
    // Длительность отсчёта — inline animation-duration (перекрывает 5s из CSS).
    const sec = typeof c.timer === 'number' && c.timer > 0 ? c.timer : 5;
    const timer = c.timer
      ? `<span class="sb-snackbar-timer" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="50.27" stroke-dashoffset="0" transform="rotate(-90 10 10)" style="animation-duration:${sec}s"/></svg></span>`
      : '';
    const close = c.close
      ? `<button class="sb-snackbar-close" onclick="sbSnackbarDismiss(this)" title="Dismiss">${sbIcon('close-line', 'S')}</button>`
      : '';
    return `<div class="sb-snackbar">`
      + `<div class="sb-snackbar-content">${lead}<span class="sb-snackbar-msg sb-title-s sb-fw-regular">${c.text || ''}</span></div>`
      + timer + action + close
      + `</div>`;
  }
  window.sbMkSnackbar = mkSnackbar;

  // Крест: фейд + уход. Живой снэкбар (в host'е) удаляем вместе с host'ом.
  window.sbSnackbarDismiss = function (btn) {
    const el = btn.closest('.sb-snackbar');
    if (!el) return;
    const host = el.closest('.sb-snackbar-host');
    if (host && host._t) clearTimeout(host._t);
    el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => (host || el).remove(), 200);
  };

  // ── Live snackbar ───────────────────────────────────────────────────
  // Показ снизу экрана: слайд вверх, обратный таймер 5с, авто-уход.
  // Один снэкбар на экран — новый вытесняет предыдущий.
  // Дефолт без аргументов = кейс копирования: зелёный Check Circle,
  // «Copied / Скопировано» (двуязычно через sbT), таймер, крест.
  window.sbShowSnackbar = function (o) {
    const c = o || {};
    const opts = {
      success: c.success !== false,
      // Кольцо-таймер — ТОЛЬКО для критичных/отменяемых действий (delete + Undo):
      // даёт время передумать. Обычный фидбэк (copied/sent) — без кольца.
      timer:   c.timer || false,
      close:   c.close   !== false,
      text:    c.text || sbT('Copied', 'Скопировано'),
      lead:    c.lead,
      action:  c.action,
    };
    const prev = document.querySelector('.sb-snackbar-host');
    if (prev) { if (prev._t) clearTimeout(prev._t); prev.remove(); }
    const host = document.createElement('div');
    host.className = 'sb-snackbar-host';
    host.innerHTML = mkSnackbar(opts);
    host.firstElementChild.classList.add('is-live');
    document.body.appendChild(host);
    requestAnimationFrame(() => host.classList.add('is-in'));
    // Авто-уход: с кольцом — по его секундам (true → 5); обычный фидбэк без
    // кольца — тихо через 4с; action БЕЗ кольца (Refresh) — sticky, висит
    // до нажатия действия или креста.
    const hide = () => {
      host.classList.remove('is-in');
      setTimeout(() => host.remove(), 200);
    };
    if (opts.timer) {
      const sec = typeof opts.timer === 'number' && opts.timer > 0 ? opts.timer : 5;
      host._t = setTimeout(hide, sec * 1000);
    } else if (!opts.action) {
      host._t = setTimeout(hide, 4000);
    }
    return host;
  };

  sbRegister({
    name: 'snackbar',
    title: 'Snackbar',
    description: sbT(
      'A floating plate that slides in at the bottom of the screen and reports an action. Two types by composition. Feedback — a message only; positive outcomes (sent, copied) carry a green Check Circle. Action — a message plus a mini button: File was deleted with Undo, or New changes available with Refresh. The countdown ring appears only on critical, undoable actions — it buys time for Undo; plain feedback quietly auto-hides after 4 seconds. This design system dogfoods it: every copy button shows the Copied snackbar.',
      'Плавающая плашка, выезжающая снизу экрана и сообщающая о действии. Два типа по составу. Feedback — только сообщение; позитивные исходы (отправлено, скопировано) несут зелёный Check Circle. Action — сообщение и mini-кнопка: File was deleted с Undo или New changes available с Refresh. Кольцо-таймер появляется только у критичных, отменяемых действий — оно даёт время на Undo; обычный фидбэк тихо исчезает через 4 секунды. Дизайн-система сама его использует: каждая копи-кнопка показывает снэкбар Copied.'
    ),
    sections: [
      {
        title: sbT('Snackbar Types', 'Типы снэкбара'),
        desc: sbDocNote('Tech Info', sbT(
          'To show the message box, you can use this code:'
          + '<pre class="sb-mono">sbShowSnackbar({\n  text: "Your message here",\n  success: true, // set true for a success message\n  lead: "delete-bin-line", // left icon: an ICON_PATHS name or custom HTML\n  action: "OK", // text for the action button; pressing it closes the snackbar\n  timer: 5, // countdown ring in seconds — only for critical / undoable actions\n  close: true // if you want a close button\n  // no timer: plain feedback auto-hides in 4 s; with an action it stays until pressed\n});</pre>'
          + 'This will show the message box with the specified text and settings.',
          'Показать плашку с сообщением можно этим кодом:'
          + '<pre class="sb-mono">sbShowSnackbar({\n  text: "Ваше сообщение",\n  success: true, // true для позитивного сообщения\n  lead: "delete-bin-line", // иконка слева: имя из ICON_PATHS или свой HTML\n  action: "OK", // текст action-кнопки; нажатие закрывает снэкбар\n  timer: 5, // кольцо-таймер в секундах — только для критичных / отменяемых действий\n  close: true // нужна ли кнопка закрытия\n  // без timer: обычный фидбэк исчезает через 4 с; с action — висит до нажатия\n});</pre>'
          + 'Плашка появится с указанным текстом и настройками.'
        )),
        col: true, interactive: true,
        preview: `${sbMkFlex({ dir: 'col', gap: 'm', full: true, maxWidth: '480px', content: `${mkSnackbar({ success: true, text: 'Message sent.', close: true })}
          ${mkSnackbar({ text: 'File was deleted.', lead: sbIcon('delete-bin-line', 'S'), action: { label: 'Undo' }, timer: true, close: true })}
          ${mkSnackbar({ text: 'New changes available.', lead: sbIcon('loop-left-line', 'S'), action: { label: 'Refresh' }, close: true })}
          ${sbPgGroup('Show Live:', `
              ${sbMkButton({ label: 'Copied', size: 's', attrs: ' onclick="sbShowSnackbar()"' })}
              ${sbMkButton({ label: 'Undo', size: 's', attrs: ` onclick="sbShowSnackbar({ text: 'File was deleted.', success: false, lead: 'delete-bin-line', action: 'Undo', timer: 5 })"` })}
              ${sbMkButton({ label: 'Refresh', size: 's', attrs: ` onclick="sbShowSnackbar({ text: 'New changes available.', success: false, lead: 'loop-left-line', action: 'Refresh' })"` })}
          `, { attrs: 'style="margin-top:var(--pad-vert-8)"' })}` })}`,
        html: `<div class="sb-snackbar">
  <div class="sb-snackbar-content">
    <span class="sb-snackbar-lead"><!-- icon --></span>
    <span class="sb-snackbar-msg sb-title-s sb-fw-regular">File was deleted.</span>
  </div>
  <span class="sb-snackbar-timer"><!-- countdown ring: critical / undoable only --></span>
  ${sbMkButton({ label: 'Undo', variant: 'primary', size: 'mini' })}
  <button class="sb-snackbar-close"><!-- close icon --></button>
</div>

<!-- Feedback: message only (success → green Check Circle), auto-hides in 4 s
     Action: + mini button; countdown ring (timer) — critical / undoable only
     sbMkSnackbar({ text, success?, lead?, action?: { label, onClick }, timer?, close? })
     Live (bottom of the screen): sbShowSnackbar(opts) -->`,
        css: COMP_CSS.snackbar,
      },
    ],
  });
})();
