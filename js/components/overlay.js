// ═══════════════════════════════════════════════════════════════════════════
//  OVERLAY
//  CSS в css/components/overlay.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//
//  Примитив модальности: модальность — ПОВЕДЕНИЕ, а не тип окна. Поведением
//  (scrim, центрирование, Esc, backdrop-close, scroll lock, focus trap)
//  владеет этот компонент; окна (Dialogues, Sheets, лайтбоксы) монтируются
//  в content-слот. MVP: placement center; placement-проп — вместе с Drawer.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.overlay = `.sb-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: var(--pad-vert-16) var(--pad-horiz-16); box-sizing: border-box; visibility: hidden; opacity: 0; transition: opacity 0.2s ease, visibility 0.2s; }
.sb-overlay.is-open { visibility: visible; opacity: 1; }
.sb-overlay.placement-top { align-items: flex-start; }
.sb-overlay-scrim { position: absolute; inset: 0; background: var(--shadow-overlay); }
.sb-overlay-content { position: relative; max-width: 100%; max-height: 100%; transform: translateY(8px); transition: transform 0.2s ease; }
.sb-overlay.is-open .sb-overlay-content { transform: translateY(0); }
.sb-overlay-lock { overflow: hidden; }`;

// --- OVERLAY ---
(() => {
  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  /**
   * sbMkOverlay(opts) — модальный примитив (закрытым, открывается хелпером).
   *   content         — html окна в content-слоте
   *   id              — id корня (для sbOverlayOpen('#id'))
   *   cls             — доп. классы на корень (для контекстных стилей контента)
   *   placement       — 'center' (default) | 'top' (search-style оверлеи)
   *   closeOnBackdrop — закрытие кликом в scrim (default true)
   *   closeOnEsc      — закрытие по Esc (default true)
   *   open            — отрендерить сразу открытым (для статичных доков)
   */
  function mkOverlay(opts = {}) {
    const { content = '', id = '', cls = '', placement = 'center',
            closeOnBackdrop = true, closeOnEsc = true, open = false } = opts;
    let rootCls = 'sb-overlay';
    if (placement === 'top') rootCls += ' placement-top';
    if (cls)  rootCls += ' ' + cls;
    if (open) rootCls += ' is-open';
    return `<div class="${rootCls}"${id ? ` id="${id}"` : ''}
         data-close-backdrop="${closeOnBackdrop !== false}"
         data-close-esc="${closeOnEsc !== false}"
         role="dialog" aria-modal="true">
      <div class="sb-overlay-scrim" onclick="sbOverlayBackdrop(this)"></div>
      <div class="sb-overlay-content">${content}</div>
    </div>`;
  }
  window.sbMkOverlay = mkOverlay;

  // ── Поведение ───────────────────────────────────────────────────────
  window.sbOverlayBackdrop = function(scrim) {
    const ov = scrim.closest('.sb-overlay');
    if (ov && ov.dataset.closeBackdrop !== 'false') sbOverlayClose(ov);
  };

  window.sbOverlayOpen = function(target) {
    const ov = typeof target === 'string' ? document.querySelector(target) : target;
    if (!ov || ov.classList.contains('is-open')) return;
    // Portal в <body>: вырываемся из stacking-context'ов контентной зоны —
    // иначе sticky-хром (search бар, section-header'ы) рисуется ПОВЕРХ скрима.
    // Запоминаем родной дом, на close вернёмся (см. sbOverlayClose).
    clearTimeout(ov._sbReturnT);  // переоткрыли до конца фейда — отменяем возврат
    if (ov.parentElement !== document.body) {
      ov._sbHome = { parent: ov.parentElement, next: ov.nextSibling };
      document.body.appendChild(ov);
    }
    ov.classList.add('is-open');
    document.documentElement.classList.add('sb-overlay-lock');
    // Focus: запоминаем, куда вернуть, и заходим внутрь окна.
    ov._sbPrevFocus = document.activeElement;
    const first = ov.querySelector(FOCUSABLE);
    if (first) first.focus();
    // Esc + focus trap (Tab циклится внутри оверлея).
    ov._sbKeydown = function(e) {
      if (e.key === 'Escape' && ov.dataset.closeEsc !== 'false') { sbOverlayClose(ov); return; }
      if (e.key !== 'Tab') return;
      const items = Array.from(ov.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0], lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    document.addEventListener('keydown', ov._sbKeydown);
  };

  window.sbOverlayClose = function(target) {
    const ov = typeof target === 'string' ? document.querySelector(target) : target;
    if (!ov || !ov.classList.contains('is-open')) return;
    ov.classList.remove('is-open');
    document.documentElement.classList.remove('sb-overlay-lock');
    if (ov._sbKeydown) document.removeEventListener('keydown', ov._sbKeydown);
    if (ov._sbPrevFocus && typeof ov._sbPrevFocus.focus === 'function') ov._sbPrevFocus.focus();
    // Возврат из portal'а — после close-фейда (0.2s, см. transition в CSS).
    // Если родной дом снесён (страницу перерендерили) — не сиротеть в body.
    // Таймер строго один: быстрый open/close/open копил их пачками, и
    // опоздавший видел уже обнулённый _sbHome → уходил в else и УДАЛЯЛ оверлей
    // из DOM (воспроизводилось за 20 циклов). Отсюда clearTimeout + ранний выход.
    clearTimeout(ov._sbReturnT);
    if (ov._sbHome) ov._sbReturnT = setTimeout(() => {
      if (ov.classList.contains('is-open')) return; // успели переоткрыть
      const home = ov._sbHome;
      if (!home) return;                            // уже вернули домой
      ov._sbHome = null;
      if (home.parent && home.parent.isConnected) {
        home.parent.insertBefore(ov, home.next && home.next.isConnected ? home.next : null);
      } else {
        ov.remove();
      }
    }, 200);
  };

  // ── Демо-контент: Framed Uploader (юзер: аплоудер будет жить в модалках).
  // Guard на случай отсутствия sbMkUploader — секция не должна ронять IIFE.
  function demoContent() {
    if (typeof sbMkUploader !== 'function') return '<div class="sb-body-m">Demo content</div>';
    return `<div style="width:min(480px, 84vw)">${sbMkUploader({
      framed: true,
      files: [{ name: 'backup-file-name-1.json', size: '110 Mb' }],
    }).replace('class="sb-uploader framed"', 'class="sb-uploader framed" style="width:100%;background:var(--background)"')}</div>`;
  }

  // ── Register ────────────────────────────────────────────────────────
  sbRegister({
    name: 'overlay',
    title: 'Overlay',
    description: sbT(
      'The modality primitive: everything that mounts over the page. Modality is a behavior, not a window type — this component owns the behavior (scrim, centering, Esc, backdrop close, scroll lock, focus trap), and windows of any kind (Dialogues, future Sheets and Drawers, lightboxes) mount into its content slot. The Navigation Bar compact search already follows this pattern and will migrate here.',
      'Примитив модальности: всё, что монтируется поверх страницы. Модальность — поведение, а не тип окна: поведением владеет этот компонент (scrim, центрирование, Esc, закрытие по подложке, scroll lock, focus trap), а окна любого рода (Dialogues, будущие Sheets и Drawers, лайтбоксы) монтируются в его content-слот. Компактный поиск Navigation Bar уже живёт по этому паттерну и переедет сюда.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Scrim:</b>'
      + '<ul><li>Fill — --shadow-overlay, no blur;</li><li>A click on the scrim closes the overlay (closeOnBackdrop, default on).</li></ul>'
      + '<b>Behavior:</b>'
      + '<ul><li>z-index 9999 — the Nav Bar search overlay layer;</li><li>Portal — on open the overlay moves to &lt;body&gt; (escapes page stacking contexts, nothing paints over the scrim) and returns home on close;</li><li>Esc closes (closeOnEsc, default on);</li><li>Scroll lock on the page while open;</li><li>Focus trap — Tab cycles inside, focus returns on close;</li><li>Content centers; no overflow clipping on the slot (it was cutting the window shadow) — scrolling of tall content is the window&#39;s own job;</li><li>Placement — center (default) or top (search-style overlays), the placement prop.</li></ul>',
      '<b>Scrim:</b>'
      + '<ul><li>Заливка — --shadow-overlay, без блюра;</li><li>Клик по scrim закрывает оверлей (closeOnBackdrop, по умолчанию включён).</li></ul>'
      + '<b>Поведение:</b>'
      + '<ul><li>z-index 9999 — слой search-overlay Nav Bar;</li><li>Portal — при открытии оверлей переезжает в &lt;body&gt; (вырывается из stacking-context&#39;ов страницы, поверх скрима ничего не рисуется) и возвращается на место при закрытии;</li><li>Esc закрывает (closeOnEsc, по умолчанию включён);</li><li>Scroll lock на странице, пока открыт;</li><li>Focus trap — Tab циклится внутри, фокус возвращается при закрытии;</li><li>Контент центрируется; overflow на слоте НЕ клипается (резал тень окна) — скролл длинного контента остаётся за самим окном;</li><li>Placement — center (default) или top (search-style оверлеи), проп placement.</li></ul>'
    )),
    sections: [
      {
        title: 'Scrim',
        desc: sbT(
          'The dimming backdrop between the window and the page: a --shadow-overlay fill without blur. It mutes the content and reads as “not now”. Below — a static sample over mock content.',
          'Затемняющая подложка между окном и страницей: заливка --shadow-overlay без блюра. Приглушает контент и читается как «сюда сейчас нельзя». Ниже — статичный образец поверх контента-муляжа.'
        ),
        preview: `<div style="position:relative;width:100%;max-width:480px;height:140px;border-radius:var(--radius-8);border:var(--border-width-1) solid var(--border-soft);background:var(--background);overflow:hidden">
          <div style="padding:var(--pad-vert-16) var(--pad-horiz-16)" class="sb-body-m">
            <div class="sb-title-s" style="margin-bottom:var(--pad-vert-8)">Page content</div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </div>
          <div class="sb-overlay-scrim"></div>
        </div>`,
        html: `<div class="sb-overlay-scrim"></div>`,
        css: COMP_CSS.overlay,
      },
      {
        title: sbT('Live — Uploader in a modal', 'Live — Uploader в модалке'),
        desc: sbT(
          'A live overlay with the Framed Uploader inside — exactly the scenario the Framed variant exists for. Open it and check: Esc and a scrim click close it, Tab cycles inside the window, the page behind does not scroll.',
          'Живой оверлей с Framed Uploader внутри — ровно тот сценарий, ради которого существует Framed-вариант. Открой и проверь: Esc и клик по подложке закрывают, Tab циклится внутри окна, страница под ним не скроллится.'
        ),
        preview: `<button class="sb-btn sb-btn-primary" type="button" onclick="sbOverlayOpen('#sb-overlay-demo')">Open Overlay</button>
          ${mkOverlay({ id: 'sb-overlay-demo', content: demoContent() })}`,
        html: `<!-- Разметка (закрытый; открывается хелпером) -->
<div class="sb-overlay" id="my-overlay" data-close-backdrop="true" data-close-esc="true" role="dialog" aria-modal="true">
  <div class="sb-overlay-scrim" onclick="sbOverlayBackdrop(this)"></div>
  <div class="sb-overlay-content"> ... окно ... </div>
</div>

<!-- Управление -->
<script>
  sbOverlayOpen('#my-overlay');   // scrim + scroll lock + focus trap
  sbOverlayClose('#my-overlay');  // вернёт фокус туда, откуда открывали
</script>

<!-- JS: sbMkOverlay({ content, id, closeOnBackdrop, closeOnEsc }) → html -->`,
        css: COMP_CSS.overlay,
      },
    ],
  });
})();
