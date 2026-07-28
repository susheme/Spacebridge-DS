// ═══════════════════════════════════════════════════════════════════════════
//  POPOVER
//  CSS в css/components/popover.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//
//  Примитив якорного позиционирования — второй близнец Overlay. Overlay
//  отвечает за «поверх всей страницы, со скримом», Popover — за «возле вот
//  этого элемента, без скрима». Своего вида у него нет: в слот кладут
//  готовый контейнер (обычно .sb-ctx-card), а примитив даёт координаты,
//  flip/shift, portal, клик-вне, Esc и фокус.
//
//  Потребители: overflow-меню «⋯» (Header L/M/S, Tool Bar), Selectors,
//  Info Pop-up в хедерах, Picker'ы. Это ОДИН движок под все эти места.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.popover = `.sb-popover-wrap { position: relative; display: inline-flex; align-items: center; flex-shrink: 0; }
.sb-popover { position: fixed; top: 0; left: 0; z-index: 1000; max-width: calc(100vw - 16px); visibility: hidden; opacity: 0; transform: scale(0.96); transform-origin: top left; transition: opacity 0.15s ease, transform 0.15s ease, visibility 0s linear 0.15s; }
.sb-popover.is-open { visibility: visible; opacity: 1; transform: scale(1); transition-delay: 0s; }
.sb-popover:focus, .sb-popover:focus-visible { outline: none; }
.sb-popover[data-side="top"]   { transform-origin: bottom left; }
.sb-popover[data-side="left"]  { transform-origin: top right; }
.sb-popover.above-overlay { z-index: 10000; }
.sb-popover-arrow { position: absolute; width: 0; height: 0; }
.sb-popover[data-side="bottom"] > .sb-popover-arrow { top: -6px; left: var(--sb-arrow, 16px); border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 6px solid var(--background); }
.sb-popover[data-side="top"] > .sb-popover-arrow { bottom: -6px; left: var(--sb-arrow, 16px); border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--background); }
.sb-popover[data-side="right"] > .sb-popover-arrow { left: -6px; top: var(--sb-arrow, 16px); border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 6px solid var(--background); }
.sb-popover[data-side="left"] > .sb-popover-arrow { right: -6px; top: var(--sb-arrow, 16px); border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 6px solid var(--background); }`;

// --- POPOVER ---
(() => {
  const OFFSET = 8;   // зазор между якорем и панелью
  const MARGIN = 8;   // минимальный отступ панели от края вьюпорта
  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const OPPOSITE = { bottom: 'top', top: 'bottom', right: 'left', left: 'right' };

  let uid = 0;

  /**
   * sbMkPopover(opts) — триггер + привязанная к нему панель (закрытая).
   *   trigger       — html триггера (кнопка, поле, аватар — что угодно)
   *   content       — html внутренностей панели: .sb-ctx-card, форма, что угодно
   *   placement     — 'bottom-start' (default) | side-align, где
   *                   side = top|bottom|left|right, align = start|center|end
   *   arrow         — носик, указывающий на триггер (default false)
   *   matchWidth    — min-width панели = ширине триггера (для Selectors)
   *   closeOnSelect — клик по ячейке внутри закрывает (default true)
   *   id, cls       — id панели (для sbPopoverOpen('#id')) и доп. классы
   *   wrapCls       — классы на обёртку-якорь. Нужен потребителям, у которых
   *                   на обёртке висит своя геометрия: .sb-header-l-more и
   *                   родня держат на ней flex-shrink: 0 в правом слоте.
   *   wrapAttrs     — доп. атрибуты на обёртку (Nav Bar вешает ховер-intent).
   *                   Пока панель открыта, обёртка носит .is-open — по нему
   *                   триггер держит активный вид (шеврон Nav Bar разворачивается).
   *   onOpen        — ИМЯ глобальной функции (строка), зовётся при открытии
   *                   как fn(panel, anchor). Нужен из-за портала: панель
   *                   уезжает в <body> и выпадает из @container потребителя,
   *                   поэтому состояние, которое считал CSS, приходится
   *                   снимать с якоря на месте и стемпить классом на панель.
   *
   * Для готовой разметки — sbPopoverToggle / sbPopoverOpen / sbPopoverClose.
   */
  function mkPopover(opts = {}) {
    const { trigger = '', wrapCls = '', wrapAttrs = '', ...rest } = opts;
    return `<span class="sb-popover-wrap${wrapCls ? ' ' + wrapCls : ''}" onclick="sbPopoverToggle(this, event)"${wrapAttrs ? ' ' + wrapAttrs : ''}>${trigger}${mkPanel(rest)}</span>`;
  }

  function mkPanel(opts = {}) {
    const { content = '', placement = 'bottom-start', arrow = false,
            matchWidth = false, closeOnSelect = true, id = '', cls = '',
            onOpen = '' } = opts;
    const side = String(placement).split('-')[0];
    // tabindex="-1" — панель сама принимает фокус, если внутри нет ни одного
    // фокусируемого элемента (напр. Context Cell'ы — это div'ы с onclick).
    // Без этого фокус остаётся на странице, и клавиатурой в меню не попасть.
    return `<div class="sb-popover${cls ? ' ' + cls : ''}" id="${id || 'sb-pop-' + (++uid)}"
     role="dialog" tabindex="-1" data-placement="${placement}" data-side="${side}"
     data-arrow="${!!arrow}" data-match-width="${!!matchWidth}"
     data-close-select="${closeOnSelect !== false}"${onOpen ? ` data-on-open="${onOpen}"` : ''}>${arrow ? '<span class="sb-popover-arrow"></span>' : ''}${content}</div>`;
  }

  window.sbMkPopover = mkPopover;
  window.sbMkPopoverPanel = mkPanel;

  // ── Позиционирование ────────────────────────────────────────────────
  // Считается в координатах вьюпорта (position: fixed), поэтому rect якоря
  // берётся как есть — без поправки на скролл.
  function place(pop, anchor) {
    const parts = String(pop.dataset.placement || 'bottom-start').split('-');
    const side0 = parts[0] || 'bottom';
    const align = parts[1] || 'center';
    const r = anchor.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    if (pop.dataset.matchWidth === 'true') pop.style.minWidth = r.width + 'px';

    // Замер до показа: visibility:hidden сохраняет layout, а scale() не
    // влияет на offsetWidth/Height — отдельный «pre-measure» хак не нужен.
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;

    // FLIP — с выбранной стороны не влезает, а с противоположной влезает.
    const fits = {
      bottom: vh - r.bottom - OFFSET - MARGIN >= h,
      top:    r.top          - OFFSET - MARGIN >= h,
      right:  vw - r.right  - OFFSET - MARGIN >= w,
      left:   r.left        - OFFSET - MARGIN >= w,
    };
    const side = (!fits[side0] && fits[OPPOSITE[side0]]) ? OPPOSITE[side0] : side0;

    let top, left;
    if (side === 'bottom' || side === 'top') {
      top  = side === 'bottom' ? r.bottom + OFFSET : r.top - OFFSET - h;
      left = align === 'start' ? r.left
           : align === 'end'   ? r.right - w
           :                     r.left + (r.width - w) / 2;
    } else {
      left = side === 'right' ? r.right + OFFSET : r.left - OFFSET - w;
      top  = align === 'start' ? r.top
           : align === 'end'   ? r.bottom - h
           :                     r.top + (r.height - h) / 2;
    }

    // SHIFT — упёрлись в край: сдвигаем вдоль, а не обрезаем. Панель шире
    // вьюпорта прижимается к левому/верхнему краю (max с MARGIN).
    left = Math.min(Math.max(left, MARGIN), Math.max(MARGIN, vw - MARGIN - w));
    top  = Math.min(Math.max(top,  MARGIN), Math.max(MARGIN, vh - MARGIN - h));

    pop.dataset.side = side;
    pop.style.top  = Math.round(top) + 'px';
    pop.style.left = Math.round(left) + 'px';

    // Носик остаётся на якоре даже после shift'а — считается от финальной
    // позиции панели. Ближе 12px к углу не пускаем (там радиус карточки).
    if (pop.dataset.arrow === 'true') {
      const vertical = side === 'bottom' || side === 'top';
      const centre = vertical ? r.left + r.width / 2 - left : r.top + r.height / 2 - top;
      const span = vertical ? w : h;
      const val = Math.min(Math.max(centre - 6, 12), Math.max(12, span - 18));
      pop.style.setProperty('--sb-arrow', Math.round(val) + 'px');
    }
  }

  // ── Поведение ───────────────────────────────────────────────────────
  const resolve = t => (typeof t === 'string' ? document.querySelector(t) : t);
  const triggerBtn = a => (a && a.matches && a.matches('button, [role="button"]'))
    ? a : (a && a.querySelector ? a.querySelector('button, [role="button"]') : null);

  /**
   * sbPopoverOpen(target, anchor, opts)
   *   opts.focus — уводить ли фокус внутрь панели (default true).
   *     Ховер-меню обязаны передавать false: человек ведёт мышью, а не
   *     навигирует с клавиатуры — у него не должен уезжать каретка/фокус,
   *     и на триггере не должно вспыхивать focus-кольцо при закрытии.
   */
  window.sbPopoverOpen = function(target, anchor, opts) {
    const pop = resolve(target);
    if (!pop || pop.classList.contains('is-open')) return;
    sbPopoverCloseAll(pop);

    const anc = anchor || pop._sbAnchor;
    if (!anc || !anc.isConnected) return;
    pop._sbAnchor = anc;

    // Якорь внутри Overlay → панель должна лечь ВЫШЕ скрима (z 9999).
    pop.classList.toggle('above-overlay', !!anc.closest('.sb-overlay'));

    // Portal в <body>. Без него не обойтись: overflow:hidden у предка режет
    // панель, а transform/filter/contain делает предка containing block'ом
    // даже для position: fixed — и панель уезжает вместе с ним.
    // Родной дом запоминаем, на close вернёмся (см. sbPopoverClose).
    clearTimeout(pop._sbReturnT);  // переоткрыли до конца фейда — отменяем возврат
    if (pop.parentElement !== document.body) {
      pop._sbHome = { parent: pop.parentElement, next: pop.nextSibling };
      document.body.appendChild(pop);
    }

    // Хук ДО замера: он может показать/скрыть содержимое (напр. зеркала
    // inline-действий в узком хедере), а от этого зависят размеры панели.
    // Имя функции, а не код — никакого eval, и работает из file://.
    const hook = pop.dataset.onOpen && window[pop.dataset.onOpen];
    if (typeof hook === 'function') hook(pop, anc);

    place(pop, anc);
    pop.classList.add('is-open');
    // Зеркалим состояние на обёртку: пока панель открыта, триггер держит
    // свой «активный» вид (у Nav Bar по этому классу разворачивается шеврон).
    if (anc.classList.contains('sb-popover-wrap')) anc.classList.add('is-open');

    const btn = triggerBtn(anc);
    if (btn) { btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-haspopup', 'true'); }

    // Фокус уводим внутрь, но без прокрутки страницы к панели. Фолбэк на саму
    // панель: контент бывает без интерактивных элементов (Context Cell — div
    // с onclick), и тогда фокус остался бы снаружи — Esc и Tab мимо цели.
    // При opts.focus === false не трогаем фокус вообще (ховер-меню): иначе на
    // закрытии он возвращается на кнопку и та вспыхивает focus-кольцом.
    pop._sbTookFocus = !opts || opts.focus !== false;
    if (pop._sbTookFocus) {
      pop._sbPrevFocus = document.activeElement;
      (pop.querySelector(FOCUSABLE) || pop).focus({ preventScroll: true });
    }
  };

  window.sbPopoverClose = function(target) {
    const pop = resolve(target);
    if (!pop || !pop.classList.contains('is-open')) return;
    pop.classList.remove('is-open');
    if (pop._sbAnchor && pop._sbAnchor.classList.contains('sb-popover-wrap')) {
      pop._sbAnchor.classList.remove('is-open');
    }

    const btn = triggerBtn(pop._sbAnchor);
    if (btn) btn.setAttribute('aria-expanded', 'false');
    // Возвращаем фокус, только если сами его забирали. Иначе ховер-меню
    // дёргало бы фокус у того, кто им реально пользуется.
    if (pop._sbTookFocus && pop._sbPrevFocus
        && typeof pop._sbPrevFocus.focus === 'function' && pop._sbPrevFocus.isConnected) {
      pop._sbPrevFocus.focus({ preventScroll: true });
    }
    pop._sbTookFocus = false;

    // Возврат из портала — после фейда (0.15s, см. transition в CSS).
    // Если родной дом снесён (страницу перерендерили) — не сиротеть в body.
    // Таймер один: быстрый open/close/open копил их пачками, и опоздавший
    // таймер видел уже обнулённый _sbHome → уходил в else и УДАЛЯЛ панель.
    clearTimeout(pop._sbReturnT);
    if (pop._sbHome) pop._sbReturnT = setTimeout(() => {
      if (pop.classList.contains('is-open')) return; // успели переоткрыть
      const home = pop._sbHome;
      if (!home) return;                             // уже вернули домой
      pop._sbHome = null;
      if (home.parent && home.parent.isConnected) {
        home.parent.insertBefore(pop, home.next && home.next.isConnected ? home.next : null);
      } else {
        pop.remove();
      }
    }, 150);
  };

  window.sbPopoverCloseAll = function(except) {
    document.querySelectorAll('.sb-popover.is-open').forEach(p => {
      if (p !== except) sbPopoverClose(p);
    });
  };

  /**
   * sbPopoverToggle(el, event) — переключатель для разметки из sbMkPopover.
   * Висит на .sb-popover-wrap: клик по триггеру всплывает до обёртки.
   * Якорем служит сама обёртка (inline-flex → её rect равен триггеру).
   */
  window.sbPopoverToggle = function(el, ev) {
    // До первого открытия панель ещё лежит внутри обёртки — клик по её
    // содержимому не должен закрывать сам себя.
    if (ev && ev.target.closest && ev.target.closest('.sb-popover')) return;
    const wrap = el.closest('.sb-popover-wrap');
    if (!wrap) return;
    // Клик по триггеру дальше не всплывает: у предков свои реакции — ряд
    // таблицы выделяется, хедер сворачивается, таб переключается. Каждый
    // потребитель времянки писал event.stopPropagation() руками; теперь это
    // поведение примитива. sbPopoverOpen сам гасит другие панели, так что
    // глобальный слушатель для этого не нужен.
    if (ev && typeof ev.stopPropagation === 'function') ev.stopPropagation();
    // После портала панели в обёртке уже нет — держим ссылку на ней.
    const pop = wrap._sbPop || wrap.querySelector('.sb-popover');
    if (!pop) return;
    wrap._sbPop = pop;
    if (pop.classList.contains('is-open')) sbPopoverClose(pop);
    else sbPopoverOpen(pop, wrap);
  };

  // ── Глобальные слушатели (однократно) ───────────────────────────────
  if (!window.__sbPopoverBound) {
    window.__sbPopoverBound = true;

    document.addEventListener('click', (e) => {
      const inPanel = e.target.closest('.sb-popover');
      if (inPanel) {
        // closeOnSelect: выбор пункта завершает взаимодействие.
        if (inPanel.dataset.closeSelect !== 'false'
            && e.target.closest('.sb-ctx-cell, [data-sb-popover-close]')) {
          sbPopoverClose(inPanel);
        }
        return;
      }
      if (e.target.closest('.sb-popover-wrap')) return; // это toggle
      sbPopoverCloseAll();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') sbPopoverCloseAll();
    });

    // Скролл ловим в capture-фазе — так приходят и вложенные скроллеры,
    // а не только окно. Панель едет за якорем, а не «отклеивается».
    const reflow = () => {
      document.querySelectorAll('.sb-popover.is-open').forEach(p => {
        if (p._sbAnchor && p._sbAnchor.isConnected) place(p, p._sbAnchor);
        else sbPopoverClose(p);
      });
    };
    document.addEventListener('scroll', reflow, true);
    window.addEventListener('resize', reflow);
  }

  // ── Демо-контент ────────────────────────────────────────────────────
  // Guard на sbMkContextCell обязателен, а не «на всякий случай»: popover.js
  // грузится РАНЬШЕ context-menu.js, а sbRegister один раз трогает геттер
  // sections при регистрации (валидация html/css) — в этот момент фабрики
  // ячеек ещё нет. На реальном рендере страницы она уже загружена.
  function demoCard(items) {
    if (typeof sbMkContextCell !== 'function') {
      return '<div class="sb-ctx-card"><div class="sb-body-m">Menu</div></div>';
    }
    return `<div class="sb-ctx-card">${items.map(i =>
      sbMkContextCell({ iconLeft: i.icon, label: i.label, mode: 'action' })).join('')}</div>`;
  }

  const MENU = [
    { icon: 'file-copy-line',  label: 'Copy' },
    { icon: 'download-2-line', label: 'Download' },
    { icon: 'loop-left-line',  label: 'Reset' },
    { icon: 'delete-bin-line', label: 'Remove' },
  ];

  const kebab = (label = 'Open menu') =>
    `<button class="sb-btn sb-btn-secondary sb-btn-icon" type="button" aria-label="${label}">${sbIcon('more-2-line', 24)}</button>`;

  // ── Register ────────────────────────────────────────────────────────
  sbRegister({
    name: 'popover',
    title: 'Popover',
    description: sbT(
      'The anchored-positioning primitive — the twin of Overlay. Overlay owns “over the whole page, with a scrim”; Popover owns “next to this element, no scrim”. It has no look of its own: you put a ready container into the slot (usually a Context Card) and the primitive supplies coordinates, flip, shift, the portal, outside-click, Esc and focus. One engine for every dropdown in the system — the “⋯” overflow menus, Selectors, the Info Pop-up in headers, pickers.',
      'Примитив якорного позиционирования — близнец Overlay. Overlay отвечает за «поверх всей страницы, со скримом», Popover — за «возле вот этого элемента, без скрима». Своего вида у него нет: в слот кладут готовый контейнер (обычно Context Card), а примитив даёт координаты, flip, shift, portal, клик-вне, Esc и фокус. Один движок под все выпадашки системы — overflow-меню «⋯», Selectors, Info Pop-up в хедерах, Picker’ы.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Positioning:</b>'
      + '<ul><li>12 placements — top/bottom/left/right × start/center/end;</li><li>Offset from the anchor — 8px; minimum gap to the viewport edge — 8px;</li><li>Flip — no room on the chosen side and room on the opposite one: the panel swaps sides;</li><li>Shift — the panel slides along the cross axis instead of being clipped; the arrow stays on the anchor;</li><li>Reflow on scroll (capture phase, so nested scrollers count too) and on resize.</li></ul>'
      + '<b>Behavior:</b>'
      + '<ul><li>z-index 1000; 10000 when the anchor sits inside an Overlay — otherwise the menu would fall under the scrim;</li><li>Portal — on open the panel moves to &lt;body&gt; and returns home on close;</li><li>No scrim and no scroll lock — the page behind stays live (that is the whole difference from Overlay);</li><li>Closes on outside click, Esc, a cell click (closeOnSelect) and a repeat click on the trigger;</li><li>Only one panel open at a time;</li><li>Focus moves into the panel and returns to the trigger on close; the trigger carries aria-expanded / aria-haspopup.</li></ul>',
      '<b>Позиционирование:</b>'
      + '<ul><li>12 placements — top/bottom/left/right × start/center/end;</li><li>Отступ от якоря — 8px, минимальный зазор до края вьюпорта — 8px;</li><li>Flip — с выбранной стороны не влезает, с противоположной влезает: панель переворачивается;</li><li>Shift — вместо обрезки панель едет вдоль поперечной оси; носик остаётся на якоре;</li><li>Пересчёт на скролле (capture-фаза, поэтому считаются и вложенные скроллеры) и на resize.</li></ul>'
      + '<b>Поведение:</b>'
      + '<ul><li>z-index 1000; 10000, если якорь внутри Overlay — иначе меню уедет под скрим;</li><li>Portal — при открытии панель переезжает в &lt;body&gt; и возвращается на место при закрытии;</li><li>Ни скрима, ни scroll lock — страница под ним остаётся живой (в этом и всё отличие от Overlay);</li><li>Закрытие: клик-вне, Esc, клик по ячейке (closeOnSelect), повторный клик по триггеру;</li><li>Открытой может быть только одна панель;</li><li>Фокус уходит внутрь и возвращается на триггер при закрытии; на триггере aria-expanded / aria-haspopup.</li></ul>'
    )),

    playground: {
      // Лейблы тоглов — одним словом: ячейка .pg-toggles узкая, режет длинные.
      state: { side: 'bottom', align: 'start', arrow: false, wide: false },
      controls(pg) {
        return sbPgGroup('Side', `
          ${pg.select('side', [
            { value: 'bottom', label: 'Bottom' },
            { value: 'top',    label: 'Top' },
            { value: 'right',  label: 'Right' },
            { value: 'left',   label: 'Left' },
          ])}
        `) + sbPgGroup('Align', `
          <div class="pg-toggles">${pg.radio('align', [
            { value: 'start',  label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'end',    label: 'End' },
          ])}</div>
        `) + sbPgGroup('Panel', `
          <div class="pg-toggles">${pg.toggle('arrow', 'Arrow')}${pg.toggle('wide', 'Wide')}</div>
        `);
      },
      render(s) {
        // Перерисовка плейграунда: старая панель могла уехать в <body>
        // порталом — снимаем сироту, иначе они копятся при каждом клике.
        const stale = document.getElementById('sb-pop-pg');
        if (stale) stale.remove();
        return `<div style="display:flex;justify-content:center;padding:var(--pad-vert-32) var(--pad-horiz-16)">
          ${mkPopover({
            id: 'sb-pop-pg',
            trigger: kebab(),
            placement: `${s.side}-${s.align}`,
            arrow: s.arrow,
            content: demoCard(s.wide ? MENU.concat([{ icon: 'add-line', label: 'A noticeably longer item label' }]) : MENU),
          })}
        </div>`;
      },
      genCode(s) {
        const call = `sbMkPopover({\n`
          + `  trigger: '<button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>',\n`
          + `  content: '<div class="sb-ctx-card">…</div>',\n`
          + `  placement: '${s.side}-${s.align}',\n`
          + (s.arrow ? `  arrow: true,\n` : '')
          + `})`;
        const html = `<!-- Собирается хелпером: -->\n${call}\n\n`
          + `<!-- Разметка (панель закрыта; координаты ставит JS): -->\n`
          + `<span class="sb-popover-wrap" onclick="sbPopoverToggle(this, event)">\n`
          + `  <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>\n`
          + `  <div class="sb-popover" id="my-menu" role="dialog" tabindex="-1"\n`
          + `       data-placement="${s.side}-${s.align}" data-side="${s.side}"\n`
          + `       data-arrow="${!!s.arrow}" data-close-select="true">\n`
          + (s.arrow ? `    <span class="sb-popover-arrow"></span>\n` : '')
          + `    <div class="sb-ctx-card"> ... ячейки ... </div>\n`
          + `  </div>\n`
          + `</span>`;
        return { html, css: COMP_CSS.popover };
      },
    },

    // Геттер, а не массив-литерал: демо зовут sbMkContextCell и sbMkOverlay,
    // и как литерал они бы вычислились при регистрации — то есть привязали бы
    // popover.js к месту в очереди <script> ПОСЛЕ context-menu и overlay.
    // А примитиву надо грузиться РАНЬШЕ своих потребителей (table.js,
    // section-header.js идут в начале списка). Геттер сдвигает вычисление на
    // момент открытия страницы, когда загружено уже всё.
    get sections() { return [
      {
        title: sbT('Flip and shift', 'Flip и shift'),
        desc: sbT(
          'Two rules keep the panel on screen. Flip: there is no room below but there is room above — the panel swaps sides. Shift: the panel would stick out past the right edge — it slides left along the edge instead of being clipped, and the arrow stays pointing at the trigger. Open the right-hand trigger and scroll the page: the panel follows its anchor and flips when the room runs out.',
          'Панель держат на экране два правила. Flip: снизу места нет, сверху есть — панель переворачивается. Shift: панель вылезла бы за правый край — вместо обрезки она едет влево вдоль края, а носик остаётся на триггере. Открой правый триггер и поскролль страницу: панель едет за якорем и переворачивается, когда место кончается.'
        ),
        preview: `<div style="display:flex;justify-content:space-between;align-items:center;gap:var(--gap-horiz-m);width:100%;padding:var(--pad-vert-24) var(--pad-horiz-16);background:var(--surface-1);border-radius:var(--radius-12)">
          ${mkPopover({ trigger: kebab('Bottom start'), placement: 'bottom-start', arrow: true, content: demoCard(MENU) })}
          ${mkPopover({ trigger: kebab('Right center'), placement: 'right-center', arrow: true, content: demoCard(MENU) })}
          ${mkPopover({ trigger: kebab('Bottom end'),   placement: 'bottom-end',   arrow: true, content: demoCard(MENU) })}
        </div>`,
        html: `<!-- 12 placements: side-align, side = top|bottom|left|right,
     align = start|center|end. Указанное — предпочтение, а не приказ:
     не влезло — примитив сам перевернёт (flip) и подвинет (shift). -->
sbMkPopover({ trigger: kebabBtn, content: card, placement: 'bottom-end', arrow: true })

<!-- Разметка из sbMkPopover открывается сама по клику. Если нужно управлять
     руками (свой триггер, открытие из кода) — императивный API: -->
sbPopoverOpen('#my-menu', anchorEl);  // anchorEl — элемент, возле которого встать
sbPopoverClose('#my-menu');
sbPopoverCloseAll();`,
        css: COMP_CSS.popover,
      },
      {
        title: sbT('Inside a modal', 'Внутри модалки'),
        desc: sbT(
          'The classic trap: a menu opened inside a modal window lands under the scrim, because the portal drops it at the body level while the Overlay sits at z-index 9999. The primitive checks whether the anchor is inside an .sb-overlay and raises the panel above it. Open the modal, then the menu inside it.',
          'Классическая ловушка: меню, открытое внутри модалки, уезжает под скрим — портал кладёт его на уровень body, а Overlay сидит на z-index 9999. Примитив проверяет, находится ли якорь внутри .sb-overlay, и поднимает панель выше. Открой модалку, а в ней — меню.'
        ),
        preview: `<button class="sb-btn sb-btn-primary" type="button" onclick="sbOverlayOpen('#sb-popover-modal-demo')">Open Modal</button>
          ${typeof sbMkOverlay === 'function' ? sbMkOverlay({
            id: 'sb-popover-modal-demo',
            content: `<div style="width:min(360px, 84vw);padding:var(--pad-vert-24) var(--pad-horiz-24);box-sizing:border-box;background:var(--background);border-radius:var(--radius-16);box-shadow:0 10px 20px 0 var(--shadow-overlay)">
              <div class="sb-h8" style="margin-bottom:var(--pad-vert-8)">Backup File</div>
              <div class="sb-body-m" style="color:var(--text-secondary);margin-bottom:var(--pad-vert-16)">The menu below is anchored inside the overlay.</div>
              ${mkPopover({ trigger: kebab('Menu inside a modal'), placement: 'bottom-start', arrow: true, content: demoCard(MENU) })}
            </div>`,
          }) : ''}`,
        html: `<!-- Ничего дополнительно не передаётся: якорь внутри .sb-overlay
     распознаётся сам, панель получает класс .above-overlay (z 10000). -->
.sb-popover.above-overlay { z-index: 10000; }`,
        css: COMP_CSS.popover,
      },
    ]; },
  });
})();
