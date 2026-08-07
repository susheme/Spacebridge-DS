// ═══════════════════════════════════════════════════════════════════════════
//  TOAST
//  CSS в css/components/toast.css — SYNC-маркеры обязательны.
//  Варианты: Default / Redirector / Collapsable + стеки (одного типа).
//  Runtime-менеджер SB_TOAST: host под Navigation Bar, политика стекования
//  (Default сразу, action-тосты — от 3+ с grace 8с). См. Tech Info.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.toast = `.sb-toast {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 360px;
  min-width: 288px;
  max-width: 360px;
  min-height: 88px;
  max-height: 208px;
  border-radius: var(--radius-12) var(--radius-4) var(--radius-4) var(--radius-12);
  background: var(--background);
  box-shadow: 0 10px 20px 0 var(--shadow-overlay); /* Shadow-L */
  border-right: var(--border-width-4) solid var(--success);
  box-sizing: border-box;
}
/* Severity — цвет полосы. Дефолт (success) задан выше. */
.sb-toast.info     { border-right-color: var(--info); }
.sb-toast.warning  { border-right-color: var(--alert); }
.sb-toast.error    { border-right-color: var(--error); }
.sb-toast.progress { border-right-color: var(--primary); }

/* Body-текст: Body M, --text-muted, максимум 2 строки с многоточием
   (высота 40 = 2 × line-height 20 по Figma). Отступ слева 40px ставит
   текст в линию с тайтлом хедера (pad 8 + глиф 24 + gap 8); справа
   симметрично — в Figma body 280px при карточке 360. Паддинги вместо
   фикс-ширины: на min-width 288 текст сжимается сам. */
.sb-toast-text {
  /* Нижний отступ — margin, НЕ padding: у -webkit-line-clamp overflow
     клипает только content-box, и обрезанная 3-я строка просвечивала
     сквозь padding-bottom. */
  padding: 0 var(--pad-horiz-40);
  margin-bottom: var(--pad-vert-8);
  color: var(--text-muted);
  font-size: var(--body-font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  letter-spacing: var(--letter-spacing);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* ── Redirector ── тост побольше: до 3 строк body + Action Bar снизу
   с одной текстовой кнопкой на всю ширину (sbMkActionBar align-center).
   Правые радиусы ещё площе — 2 (по Figma: 12 2 2 12). */
.sb-toast.redirector {
  border-radius: var(--radius-12) var(--radius-2) var(--radius-2) var(--radius-12);
}
.sb-toast.redirector .sb-toast-text {
  -webkit-line-clamp: 3;
}
/* Action Bar внутри тоста компактнее базового: paddings 8 вместо 16
   (scoped-оверрайд у консьюмера, сам компонент Action Bar не трогаем).
   Нижние радиусы повторяют карточку (BL 12 / BR 2) — иначе прямые углы
   бара торчат из скруглённого низа тоста. */
.sb-toast .sb-action-bar {
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  border-radius: 0 0 var(--radius-2) var(--radius-12);
}

/* ── Collapsable ── закрытый = Redirector (кнопка Details в Action Bar);
   по клику раскрывается details-зона (пока список Info Cells из List,
   контракт — любой контент), кнопка меняется на Hide (sbToastDetailsToggle).
   Раскрытый тост растёт под контент, но капится высотой экрана до
   футера: точный кап менеджер кладёт в --sb-toast-cap на хосте
   (вьюпорт − top хоста − резерв под футер), вне менеджера — дефолт.
   Если данных больше капа — details скроллятся внутри (функциональный
   скролл, не косметика); хедер, body и Action Bar не сжимаются. */
.sb-toast.collapsable.expanded { max-height: var(--sb-toast-cap, calc(100vh - 200px)); }
.sb-toast.collapsable.expanded .sb-header-xs,
.sb-toast.collapsable.expanded .sb-toast-text,
.sb-toast.collapsable.expanded .sb-action-bar { flex-shrink: 0; }
.sb-toast.collapsable.expanded .sb-toast-details {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
.sb-toast-details {
  display: none;
  flex-direction: column;
  align-items: stretch;
  gap: var(--gap-horiz-s);
  /* Ширина контента 280 при карточке 360 (Figma) — резиновые паддинги 40,
     как у body; снизу 8 по спеке. */
  padding: 0 var(--pad-horiz-40) var(--pad-vert-8);
}
.sb-toast.expanded .sb-toast-details { display: flex; }

/* ── Stack ── стопка тостов ОДНОГО типа. Collapsed: виден верхний тост +
   две псевдо-подложки (::before/::after — без фейковых DOM-тостов);
   hover выдвигает подложки на 2px вниз и показывает чипсу Clear (N).
   Клик по стопке или шеврону — раскрытие: столбец тостов с крестиками,
   чипса становится Clear All, рядом круглая кнопка-шеврон сборки. */
.sb-toast-stack {
  display: flex;
  flex-direction: column;
  width: 360px;
  max-width: 360px;
}
.sb-toast-stack-cards {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap-vert-m);
}
/* Тосты поверх подложек. */
.sb-toast-stack .sb-toast { position: relative; z-index: 1; }
.sb-toast-stack .sb-toast-stack-cards { transition: padding-bottom 0.3s ease; }
.sb-toast-stack:not(.expanded) .sb-toast-stack-cards {
  cursor: pointer;
  padding-bottom: 12px; /* место под подложки стопки */
}
/* Плавная сборка/раскрытие: display:none не анимируется — скрытые тосты
   сжимаются max-height'ом в 0, отрицательный margin-top съедает flex-gap
   ряда, opacity и лёгкий сдвиг дают «втягивание» под верхнюю карточку. */
.sb-toast-stack .sb-toast {
  transition: max-height 0.3s ease, opacity 0.25s ease, margin-top 0.3s ease,
              transform 0.3s ease;
}
.sb-toast-stack:not(.expanded) .sb-toast:not(:first-child) {
  max-height: 0;
  min-height: 0;
  opacity: 0;
  margin-top: calc(-1 * var(--gap-vert-m));
  transform: translateY(-8px);
  overflow: hidden;
  pointer-events: none;
  box-shadow: none;
}
/* Подложки: нижние «срезы» карточек — фон, нижние радиусы, Shadow-L.
   Живут всегда (для анимации), в expanded растворяются opacity. */
.sb-toast-stack .sb-toast-stack-cards::before,
.sb-toast-stack .sb-toast-stack-cards::after {
  content: '';
  position: absolute;
  z-index: 0;
  height: 12px;
  background: var(--background);
  border-radius: 0 0 var(--radius-4) var(--radius-12);
  box-shadow: 0 10px 20px 0 var(--shadow-overlay); /* Shadow-L */
  transition: transform 0.15s ease, opacity 0.3s ease;
}
.sb-toast-stack .sb-toast-stack-cards::before {
  left: 0; right: 0; bottom: 6px;
}
.sb-toast-stack .sb-toast-stack-cards::after {
  left: 0; right: 0; bottom: 0;
}
.sb-toast-stack.expanded .sb-toast-stack-cards::before,
.sb-toast-stack.expanded .sb-toast-stack-cards::after { opacity: 0; }
/* В стопке из двух — одна подложка. */
.sb-toast-stack[data-count="2"]:not(.expanded) .sb-toast-stack-cards::after { display: none; }
/* Hover: подложки выезжают на 2px вниз. */
.sb-toast-stack:not(.expanded) .sb-toast-stack-cards:hover::before,
.sb-toast-stack:not(.expanded) .sb-toast-stack-cards:hover::after {
  transform: translateY(2px);
}

/* Правые контролы тостов в стеке: шеврон-подсказка (collapsed) ↔
   крестик закрытия (expanded). Шеврон не ловит клики — раскрытием
   занимается вся стопка (onclick на cards). */
.sb-toast-stack-peek { pointer-events: none; }
/* Redirector/Collapsable в стопке: пока стек собран, внутренние кнопки
   (Check / Details) не кликаются — любой клик раскрывает стек. */
.sb-toast-stack:not(.expanded) .sb-toast .sb-action-bar { pointer-events: none; }
.sb-toast-stack:not(.expanded) .sb-toast-stack-x { display: none; }
.sb-toast-stack.expanded .sb-toast-stack-peek { display: none; }

/* Нижний ряд: чипса Clear + (в expanded) круглая кнопка-шеврон сборки.
   В collapsed ряд схлопнут в 0 и не резервирует место; по ховеру на стек
   плавно выезжает (max-height + margin) и сдвигает нижестоящие тосты. */
.sb-toast-stack-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--gap-horiz-s);
  margin-top: var(--gap-vert-m);
  max-height: 32px;
  overflow: hidden;
  transition: max-height 0.25s ease, margin-top 0.25s ease, opacity 0.2s ease;
}
.sb-toast-stack:not(.expanded) .sb-toast-stack-bar {
  max-height: 0;
  margin-top: 0;
  opacity: 0;
  pointer-events: none;
}
.sb-toast-stack:not(.expanded):hover .sb-toast-stack-bar {
  max-height: 32px;
  margin-top: var(--gap-vert-m);
  opacity: 1;
  pointer-events: auto;
}
/* Чипса Clear — DS-компонент Chips (sbMkChip, стили в chips.css);
   здесь только переключение лейблов Clear (N) / Clear All по состоянию. */
.sb-toast-stack:not(.expanded) .sb-toast-stack-clear-all { display: none; }
.sb-toast-stack.expanded .sb-toast-stack-clear-n { display: none; }
/* Кнопка сборки — только в expanded, круглая. */
.sb-toast-stack-fold {
  display: none;
  border-radius: var(--radius-100);
}
.sb-toast-stack.expanded .sb-toast-stack-fold { display: inline-flex; }

/* Уход тоста/стека (крестик, Clear): fade + сдвиг вправо, удаление из DOM
   по таймеру в JS (250ms, синхронно с transition). */
.sb-toast.is-leaving,
.sb-toast-stack.is-leaving {
  opacity: 0;
  transform: translateX(16px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}
/* ── Host (runtime SB_TOAST) ── fixed-контейнер справа сверху, под
   Navigation Bar (top задаёт менеджер: высота нав-бара + 16, или + 32
   в padded-режиме «с подложкой»). Пустая зона хоста клики не ловит;
   при переполнении экрана хост скроллится (кап высоты — функционал). */
.sb-toast-host {
  position: fixed;
  right: 0;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--gap-vert-m);
  max-height: calc(100vh - 104px);
  overflow-y: auto;
  /* Не косметика: overflow-y:auto делает overflow-x тоже auto, и въезд
     карточки (translateX) мигал горизонтальным скроллбаром. Попапов
     внутри тостов нет — клип по X безопасен. */
  overflow-x: hidden;
  pointer-events: none;
  /* Воздух под Shadow-L (0 10px 20px): overflow-y:auto клипал тени по
     краям хоста. Карточки остаются в 16px от края экрана (right:0 +
     padding-right), снизу запас больше — тень смещена вниз. */
  padding: var(--pad-vert-8) var(--pad-horiz-16) var(--pad-vert-32) var(--pad-horiz-32);
}
.sb-toast-host > * { pointer-events: auto; }
/* Вход нового тоста. Класс .anim менеджер ставит только на рендеры с
   НОВЫМИ тостами — служебные перегруппировки (grace-таймеры) проходят
   без анимации, карточки не мелькают. */
@keyframes sb-toast-in {
  from { opacity: 0; transform: translateX(16px); }
}
.sb-toast-host.anim .sb-toast,
.sb-toast-host.anim .sb-toast-stack { animation: sb-toast-in 0.2s ease; }`;

// --- TOAST ---
(() => {
  // Лид-глиф по severity: аутлайн-версии Symbol Badges (SB_SVG из badge.js),
  // для progress — лоадер Header XS (реюз .sb-header-xs-loader).
  const LEAD = {
    success:  () => SB_SVG.checkCircle,
    info:     () => SB_SVG.infoLine,
    warning:  () => SB_SVG.warnLine,
    error:    () => SB_SVG.critLine,
    progress: () => '<span class="sb-header-xs-loader" aria-label="Loading"></span>',
  };
  // Правый слот хедера — паттерны из Header XS.
  const RIGHT = {
    none:  () => '',
    close: () => sbMkButton({ icon: 'close-line', iconSize: 'S', size: 's', attrs: ' aria-label="Close"' }),
    'chevron-down': () => sbMkChevron(),
    'chevron-up':   () => sbMkChevron({ dir: 'up' }),
  };

  /**
   * sbMkToast({ severity, title, text, lead, right, action, details })
   *   severity — 'success' | 'info' | 'warning' | 'error' | 'progress'
   *              (полоса справа + дефолтный лид-глиф)
   *   title    — тайтл хедера (1 строка, ellipsis — из Header XS)
   *   text     — body-текст (Body M; 2 строки max, у Redirector/Collapsable — 3)
   *   lead     — свой HTML лид-слота (перебивает дефолт severity)
   *   right    — 'close' (default) | 'chevron-down' | 'chevron-up' |
   *              'none' | произвольный HTML
   *   action   — Redirector-вариант: { label, iconR?, onClick? } —
   *              Action Bar снизу с одной текстовой кнопкой на всю ширину.
   *   details  — Collapsable-вариант (перебивает action):
   *              { items?: [{ title, time, status }], content?: HTML,
   *                expanded?: bool, labelShow?: 'Details', labelHide?: 'Hide' }
   *              items рендерятся Info Cell'ами из List (indicator + timestamp);
   *              content — произвольный HTML вместо/вместе со списком.
   */
  function mkToast(opts) {
    const { severity = 'success', title = '', text = '', lead, right = 'close', action, details } = opts || {};
    const leadHtml  = lead != null ? lead : (LEAD[severity] || LEAD.success)();
    const rightHtml = RIGHT[right] ? RIGHT[right]() : (right || '');
    const header = sbMkHeaderXS({
      slotLeft: `${leadHtml}<span class="sb-header-xs-title sb-title-m sb-fw-semibold">${title}</span>`,
      slotRight: rightHtml,
    });
    const expanded = !!(details && details.expanded);
    const cls = 'sb-toast ' + severity
      + (action || details ? ' redirector' : '')
      + (details ? ' collapsable' : '')
      + (expanded ? ' expanded' : '');

    let footer = '';
    let detailsHtml = '';
    if (details) {
      const show = details.labelShow || 'Details';
      const hide = details.labelHide || 'Hide';
      const cells = (details.items || []).map(it => sbMkInfoCell({
        title: it.title,
        subtitle: it.time,
        indicator: { status: it.status || 'online' },
        selectable: false,
      })).join('');
      detailsHtml = `<div class="sb-toast-details">${(details.content || '') + cells}</div>`;
      // Кнопка Details/Hide: sbMkActionBar + data-лейблы для рантайм-свапа
      // в sbToastDetailsToggle (у actionBtn нет проброса атрибутов).
      footer = sbMkActionBar({
        buttons: [{
          label: expanded ? hide : show,
          iconR: expanded ? 'arrow-up-s-line' : 'arrow-down-s-line',
          variant: 'text',
          onClick: 'sbToastDetailsToggle(this)',
        }],
        align: 'center',
      }).replace('<button ', `<button data-lbl-show="${show}" data-lbl-hide="${hide}" `);
    } else if (action) {
      footer = sbMkActionBar({
        buttons: [{ label: action.label || 'Check', iconR: action.iconR || 'arrow-right-s-line', variant: 'text', onClick: action.onClick }],
        align: 'center',
      });
    }

    return `<div class="${cls}" role="status">
      ${header}
      <div class="sb-toast-text">${text}</div>
      ${detailsHtml}
      ${footer}
    </div>`;
  }
  window.sbMkToast = mkToast;

  // Details/Hide toggle Collapsable-тоста. Свапает класс .expanded на карточке
  // и лейбл+шеврон на кнопке (лейблы — из data-атрибутов, конфигурируемы).
  // Поведение в стеке (кап высоты, схлопывание соседей) — зона будущего
  // менеджера SB_TOAST, здесь только сам тост.
  window.sbToastDetailsToggle = function(btn) {
    const toast = btn.closest('.sb-toast');
    if (!toast) return;
    const open = toast.classList.toggle('expanded');
    const lbl = open ? (btn.dataset.lblHide || 'Hide') : (btn.dataset.lblShow || 'Details');
    btn.innerHTML = lbl + ' ' + sbIcon(open ? 'arrow-up-s-line' : 'arrow-down-s-line', 'L');
  };

  /**
   * sbMkToastStack({ toasts, expanded, demoLoop }) — стопка тостов одного типа.
   *   toasts   — массив opts для sbMkToast (right подменяется контролами
   *              стека: шеврон-подсказка в collapsed, крестик в expanded)
   *   expanded — стартовое состояние (default: collapsed)
   *   demoLoop — только для playground/доков: после Clear стек через паузу
   *              рендерится заново (иначе превью остаётся пустым)
   */
  function mkToastStack(opts) {
    const { toasts = [], expanded = false, demoLoop = false } = opts || {};
    const right = sbMkChevron({ cls: 'sb-toast-stack-peek' })
      + sbMkButton({ icon: 'close-line', iconSize: 'S', size: 's', cls: 'sb-toast-stack-x',
          attrs: ' aria-label="Close" onclick="sbToastStackDismiss(this)"' });
    const cards = toasts.map(t => mkToast(Object.assign({}, t, { right }))).join('');
    return `<div class="sb-toast-stack${expanded ? ' expanded' : ''}" data-count="${toasts.length}"${demoLoop ? ' data-demo-loop' : ''}>
      <div class="sb-toast-stack-cards" onclick="sbToastStackOpen(this)">${cards}</div>
      <div class="sb-toast-stack-bar">
        ${sbMkChip({
          cls: 'sb-toast-stack-clear',
          onClick: 'sbToastStackClear(this)',
          label: `<span class="sb-toast-stack-clear-n">Clear (${toasts.length})</span><span class="sb-toast-stack-clear-all">Clear All</span>`,
        })}
        ${sbMkButton({ icon: 'arrow-up-s-line', iconSize: 'S', size: 's', cls: 'sb-toast-stack-fold', attrs: ' aria-label="Collapse" onclick="sbToastStackFold(this)"' })}
      </div>
    </div>`;
  }
  window.sbMkToastStack = mkToastStack;

  // Снос стека с анимацией. Обычный режим: is-leaving → remove по таймеру
  // transition'а. data-demo-loop (playground/доки): элемент НЕ удаляем —
  // невидимый (opacity 0, pointer-events none) он остаётся в потоке и
  // держит высоту превью, лейаут не схлопывается; через паузу превью
  // перерисовывается свежим стеком поверх — «залуплено» без скачка.
  function removeStack(stack) {
    stack.classList.add('is-leaving');
    if (stack.hasAttribute('data-demo-loop') && typeof SB_PG !== 'undefined') {
      setTimeout(() => SB_PG.render('toast'), 700);
    } else {
      setTimeout(() => stack.remove(), 250);
    }
  }

  // Раскрытие по клику на стопку (или шеврон — он pointer-events:none,
  // клик проходит сюда же). В expanded клики по карточкам — no-op.
  window.sbToastStackOpen = function(el) {
    const stack = el.closest('.sb-toast-stack');
    if (stack && !stack.classList.contains('expanded')) stack.classList.add('expanded');
  };
  // Сборка обратно — круглая кнопка-шеврон в баре. Раскрытые details
  // вложенных Collapsable-тостов схлопываем тоже (иначе collapsed-стопка
  // получает верхнюю карточку в полный рост), кнопки Details/Hide — в
  // исходное состояние.
  window.sbToastStackFold = function(btn) {
    const stack = btn.closest('.sb-toast-stack');
    if (!stack) return;
    stack.classList.remove('expanded');
    stack.querySelectorAll('.sb-toast.expanded').forEach(t => {
      t.classList.remove('expanded');
      const dBtn = t.querySelector('.sb-action-bar .sb-btn-text');
      if (dBtn) dBtn.innerHTML = (dBtn.dataset.lblShow || 'Details') + ' ' + sbIcon('arrow-down-s-line', 'L');
    });
  };
  // Крестик на тосте в expanded: fade-out тоста, затем remove + пересчёт
  // счётчика чипсы; последний закрытый — сносит стек целиком (с loop'ом).
  window.sbToastStackDismiss = function(btn) {
    const stack = btn.closest('.sb-toast-stack');
    const toast = btn.closest('.sb-toast');
    if (!stack || !toast) return;
    toast.classList.add('is-leaving');
    setTimeout(() => {
      toast.remove();
      const n = stack.querySelectorAll('.sb-toast').length;
      if (!n) { removeStack(stack); return; }
      stack.dataset.count = n;
      const lbl = stack.querySelector('.sb-toast-stack-clear-n');
      if (lbl) lbl.textContent = `Clear (${n})`;
    }, 250);
  };
  // Чипса Clear (N) / Clear All — сносит весь стек (с анимацией и loop'ом).
  window.sbToastStackClear = function(btn) {
    const stack = btn.closest('.sb-toast-stack');
    if (stack) removeStack(stack);
  };

  // ── SB_TOAST — runtime-менеджер ───────────────────────────────────────
  // Host: fixed справа сверху, top = высота .sb-nav-bar + 16 (или + 32 в
  // padded-режиме «с подложкой», см. configure). Политика стекования:
  //   - группа = вариант (default/redirector/collapsable) + severity;
  //   - Default: 2+ в группе → сразу собираются в стек;
  //   - Redirector/Collapsable (action-тосты): стек только как защита от
  //     потопа — при 3+; САМЫЙ СВЕЖИЙ action-тост группы держится ОТДЕЛЬНОЙ
  //     карточкой сверху GRACE_MS (8с), чтобы призыв к действию был виден;
  //     приход следующего тоста той же группы снимает свежесть с предыдущего
  //     сразу — свежая карточка всегда ровно одна;
  //   - клики по крестикам/Clear в стеке синкают модель менеджера
  //     (delegated-слушатель на host), DOM-анимации делают хендлеры стека.
  const GRACE_MS = 8000;
  const TOAST_MGR = {
    items: [],   // { id, opts, kind, fresh, timer }
    seq: 0,
    padded: false,
    host: null,

    configure(opts) {
      this.padded = !!(opts && opts.padded);
      if (this.items.length) this.render();
    },
    kindOf(opts) {
      const variant = opts.details ? 'collapsable' : (opts.action ? 'redirector' : 'default');
      return variant + ':' + (opts.severity || 'success');
    },
    ensureHost() {
      if (this.host && document.body.contains(this.host)) return this.host;
      const el = document.createElement('div');
      el.className = 'sb-toast-host';
      el.addEventListener('click', e => this.syncFromDom(e));
      document.body.appendChild(el);
      this.host = el;
      return el;
    },
    offsetTop() {
      const nav = document.querySelector('.sb-nav-bar');
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      return Math.round(navH + (this.padded ? 32 : 16));
    },

    // Снять свежесть немедленно (таймер больше не нужен).
    demote(it) {
      if (it.timer) clearTimeout(it.timer);
      it.timer = null;
      it.fresh = false;
    },
    show(opts) {
      const id = 't' + (++this.seq);
      const kind = this.kindOf(opts || {});
      const item = { id, opts: opts || {}, kind, fresh: !kind.startsWith('default'), timer: null };
      if (item.fresh) {
        // Отдельной карточкой держится ТОЛЬКО самый свежий тост группы.
        // Без этого у каждого свой независимый grace, и N тостов за 8с
        // висят N отдельными карточками — ровно тот потоп, от которого
        // стек и защищает (собираются они только когда таймеры отстреляют).
        this.items.forEach(i => { if (i.kind === kind && i.fresh) this.demote(i); });
        item.timer = setTimeout(() => { item.fresh = false; item.timer = null; this.render(); }, GRACE_MS);
      }
      this.items.push(item);
      this.render();
      return id;
    },
    hide(id) {
      const it = this.items.find(i => i.id === id);
      if (it && it.timer) clearTimeout(it.timer);
      this.items = this.items.filter(i => i.id !== id);
      this.render();
    },
    clearAll() {
      this.items.forEach(i => i.timer && clearTimeout(i.timer));
      this.items = [];
      this.render();
    },

    // Крестик/Clear внутри менеджерского стека: модель — источник правды,
    // но немедленный re-render не нужен — DOM-хендлеры стека уже сделали
    // правильную вещь (анимация + удаление).
    syncFromDom(e) {
      const stack = e.target.closest('.sb-toast-stack[data-kind]');
      if (!stack) return;
      const kind = stack.getAttribute('data-kind');
      if (e.target.closest('.sb-toast-stack-clear')) {
        this.items = this.items.filter(i => i.kind !== kind || i.fresh);
        return;
      }
      const x = e.target.closest('.sb-toast-stack-x');
      if (x) {
        const toastEl = x.closest('.sb-toast');
        const idx = Array.prototype.indexOf.call(stack.querySelectorAll('.sb-toast'), toastEl);
        const rest = this.items.filter(i => i.kind === kind && !i.fresh);
        const victim = rest[idx];
        if (victim) this.items = this.items.filter(i => i !== victim);
      }
    },

    single(item, expandedIds) {
      const closeBtn = sbMkButton({ icon: 'close-line', iconSize: 'S', size: 's',
        attrs: ` aria-label="Close" onclick="sbToastHide('${item.id}')"` });
      const opts = Object.assign({}, item.opts, { right: closeBtn });
      if (opts.details && expandedIds && expandedIds.has(item.id)) {
        opts.details = Object.assign({}, opts.details, { expanded: true });
      }
      return mkToast(opts)
        .replace('<div class="sb-toast', `<div data-toast-id="${item.id}" class="sb-toast`);
    },
    render() {
      const host = this.ensureHost();
      const top = this.offsetTop();
      host.style.top = top + 'px';
      // Кап раскрытого Collapsable: до низа экрана минус резерв под футер
      // (высота .sb-info-footer, если он есть, + воздух).
      const footer = document.querySelector('.sb-info-footer');
      const reserve = (footer ? Math.round(footer.getBoundingClientRect().height) : 0) + 32;
      host.style.setProperty('--sb-toast-cap', `calc(100vh - ${top + reserve}px)`);

      // Снапшот раскрытий из DOM: innerHTML-пересборка иначе схлопывала
      // открытые details и стеки при каждой перегруппировке.
      const openToasts = new Set(
        Array.from(host.querySelectorAll('.sb-toast.expanded[data-toast-id]'))
          .map(el => el.getAttribute('data-toast-id')));
      const openStacks = new Set(
        Array.from(host.querySelectorAll('.sb-toast-stack.expanded[data-kind]'))
          .map(el => el.getAttribute('data-kind')));

      // Входную анимацию получают только рендеры с новыми тостами.
      const ids = this.items.map(i => i.id);
      const prev = this._renderedIds || [];
      host.classList.toggle('anim', ids.some(id => !prev.includes(id)));
      this._renderedIds = ids;

      const order = [];
      const groups = {};
      this.items.forEach(it => {
        if (!groups[it.kind]) { groups[it.kind] = []; order.push(it.kind); }
        groups[it.kind].push(it);
      });
      let html = '';
      order.forEach(kind => {
        const fresh = groups[kind].filter(i => i.fresh);
        const rest  = groups[kind].filter(i => !i.fresh);
        const threshold = kind.startsWith('default') ? 2 : 3;
        fresh.forEach(i => { html += this.single(i, openToasts); });
        if (rest.length >= threshold) {
          html += mkToastStack({ toasts: rest.map(i => i.opts), expanded: openStacks.has(kind) })
            .replace('<div class="sb-toast-stack', `<div data-kind="${kind}" class="sb-toast-stack`);
        } else {
          rest.forEach(i => { html += this.single(i, openToasts); });
        }
      });
      host.innerHTML = html;
    },
  };
  window.SB_TOAST = TOAST_MGR;
  window.sbToastShow = o => TOAST_MGR.show(o);
  window.sbToastHide = id => TOAST_MGR.hide(id);
  window.sbToastClearAll = () => TOAST_MGR.clearAll();

  // Live-демо из playground: собирает opts из текущих контролов и зовёт
  // настоящий sbToastShow — политика стекования видна вживую.
  window.sbToastPgShow = function() {
    const s = (typeof SB_PG !== 'undefined' && SB_PG._states) ? SB_PG._states['toast'] : null;
    if (!s) return;
    const d = DEMO[s.severity];
    sbToastShow({
      severity: s.severity,
      title: s.longText ? d.title + ' — a very long title to demonstrate the ellipsis' : d.title,
      text: s.longText ? d.text + ' ' + d.text + ' ' + d.text : d.text,
      action: s.withAction ? { label: 'Check' } : undefined,
      details: s.collapsable ? { items: DEMO_STEPS.slice(0, 4) } : undefined,
    });
  };

  // ── Demo-контент ──────────────────────────────────────────────────────
  // Шаги для Collapsable details (Info Cells: status + title + timestamp).
  const DEMO_STEPS = [
    { title: 'Initiate configuration process.',   time: '2025-02-28|09:15:00', status: 'online' },
    { title: 'Set up initial parameters.',        time: '2025-02-27|10:20:30', status: 'online' },
    { title: 'Configure user access settings.',   time: '2025-02-26|11:25:45', status: 'online' },
    { title: 'Integrate third-party services.',   time: '2025-02-25|12:30:10', status: 'error' },
    { title: 'Adjust system preferences.',        time: '2025-02-24|13:35:55', status: 'online' },
    { title: 'Establish network connections.',    time: '2025-02-23|14:40:22', status: 'online' },
    { title: 'Check compatibility requirements.', time: '2025-02-22|15:45:33', status: 'error' },
    { title: 'Finalize installation settings.',   time: '2025-02-21|16:50:12', status: 'online' },
  ];
  const DEMO = {
    success:  { title: 'Connection Successful', text: 'The connection to the central server in Reykjavik has been established. Data transfer is now active.' },
    info:     { title: 'Firmware Update',       text: 'A new firmware version is available for your device. Update now to improve performance.' },
    warning:  { title: 'High Latency Detected', text: 'Terminal SB-003 latency exceeds the 500 ms threshold. Check the uplink quality.' },
    error:    { title: 'Uplink Lost',           text: 'Terminal SB-002 lost uplink connection. Immediate corrective action is required.' },
    progress: { title: 'Configuration Definition... (3/100)', text: 'Lorem ipsum dolor sit amet consectetur. Est in euismod vestibulum vel ultricies tincidunt velit mollis purus.' },
  };

  sbRegister({
    name: 'toast',
    title: 'Toast',
    description: sbT(
      'A pop-up notification that slides in at the top-right corner of the screen, below the Navigation Bar. The header is a Header XS — a severity glyph or loader, a one-line title and a Close button; below it — up to two lines of Body M text. The severity colors the vertical stripe on the right edge. The Redirector and Collapsable variants, stacks and the runtime manager are coming next.',
      'Всплывающее уведомление, выезжающее в правом верхнем углу экрана, под Navigation Bar. Хедер — Header XS: глиф severity или лоадер, однострочный тайтл и кнопка Close; ниже — до двух строк текста Body M. Severity красит вертикальную полосу у правого края. Варианты Redirector и Collapsable, стеки и runtime-менеджер — следующими заходами.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry:</b>'
      + '<ul><li>Width: 360px (min 288 / max 360);</li><li>Height: 88px (min 88 / max 208);</li><li>Radius: 12 / 4 / 4 / 12 — the right corners are flatter because of the stripe;</li><li>Shadow: Shadow-L.</li></ul>'
      + '<b>Severity stripe:</b>'
      + '<ul><li>Border-right 4px: <code>--success</code> / <code>--info</code> / <code>--alert</code> / <code>--error</code> / <code>--primary</code> (progress).</li></ul>'
      + '<b>Composition:</b>'
      + '<ul><li>Header: Header XS — Symbol Badge glyph or loader + title + Close;</li><li>Body: Body M, <code>--text-muted</code>, up to 2 lines with an ellipsis, indented 40px to align with the title.</li></ul>'
      + '<b>Redirector:</b>'
      + '<ul><li>Body: up to 3 lines;</li><li>Footer: Action Bar with one text button stretched across the container (<code>align: center</code>);</li><li>Radius: 12 / 2 / 2 / 12.</li></ul>'
      + '<b>Collapsable:</b>'
      + '<ul><li>Closed: same as Redirector, the button is Details;</li><li>Expanded: a details zone — Info Cells from List (status + timestamp), the contract takes any content; the button turns into Hide;</li><li>Toggle: <code>sbToastDetailsToggle</code> flips <code>.expanded</code> and swaps the label with the chevron;</li><li>Expanded height is capped at the screen height down to the footer (<code>--sb-toast-cap</code>, set by the manager); longer details scroll inside.</li></ul>'
      + '<b>Stack:</b>'
      + '<ul><li>Only one toast type collects into a stack — Default, Redirector and Collapsable all stack;</li><li>While the stack is collapsed, the inner Check / Details buttons are inert — any click expands the stack; folding the stack also folds expanded details;</li><li>Collapsed: the top toast with a chevron + two pseudo-underlays (<code>::before/::after</code>, no fake DOM); hover slides the underlays 2px down and reveals the Clear (N) chip;</li><li>Expanded (click the pile or the chevron): a column of toasts with individual close buttons, the chip turns into Clear All with a round fold chevron next to it.</li></ul>'
      + '<b>Manager (SB_TOAST):</b>'
      + '<ul><li>Host: fixed at the top-right, below the Navigation Bar — nav height + 16px (or + 32px in the padded mode, <code>SB_TOAST.configure({ padded: true })</code>);</li><li>API: <code>sbToastShow(opts) → id</code>, <code>sbToastHide(id)</code>, <code>sbToastClearAll()</code>;</li><li>Grouping: variant + severity; Default — 2+ collapse into a stack immediately;</li><li>Redirector / Collapsable: stacking is flood-protection only (3+); only the freshest action toast of a group stays a separate card above it for 8s (a newer toast of the same group demotes the previous one immediately), then joins the stack;</li><li>Close / Clear clicks inside a stack sync the manager model automatically.</li></ul>'
      + '<b>API:</b>'
      + '<ul><li><code>sbMkToast({ severity, title, text, lead, right, action, details })</code>;</li><li><code>sbMkToastStack({ toasts, expanded })</code>;</li><li><code>sbToastShow / sbToastHide / sbToastClearAll</code>.</li></ul>',
      '<b>Геометрия:</b>'
      + '<ul><li>Ширина: 360px (min 288 / max 360);</li><li>Высота: 88px (min 88 / max 208);</li><li>Радиусы: 12 / 4 / 4 / 12 — правые углы площе из-за полосы;</li><li>Тень: Shadow-L.</li></ul>'
      + '<b>Полоса severity:</b>'
      + '<ul><li>Border-right 4px: <code>--success</code> / <code>--info</code> / <code>--alert</code> / <code>--error</code> / <code>--primary</code> (progress).</li></ul>'
      + '<b>Состав:</b>'
      + '<ul><li>Хедер: Header XS — глиф Symbol Badge или лоадер + тайтл + Close;</li><li>Body: Body M, <code>--text-muted</code>, до 2 строк с многоточием, отступ 40px в линию с тайтлом.</li></ul>'
      + '<b>Redirector:</b>'
      + '<ul><li>Body: до 3 строк;</li><li>Футер: Action Bar с одной текстовой кнопкой на всю ширину (<code>align: center</code>);</li><li>Радиусы: 12 / 2 / 2 / 12.</li></ul>'
      + '<b>Collapsable:</b>'
      + '<ul><li>Закрытый: как Redirector, кнопка — Details;</li><li>Раскрытый: details-зона — Info Cells из List (статус + timestamp), контракт принимает любой контент; кнопка меняется на Hide;</li><li>Toggle: <code>sbToastDetailsToggle</code> переключает <code>.expanded</code> и свапает лейбл с шевроном;</li><li>Высота раскрытого капится экраном до футера (<code>--sb-toast-cap</code>, задаёт менеджер); длинные details скроллятся внутри.</li></ul>'
      + '<b>Stack:</b>'
      + '<ul><li>В стек собирается только один тип тостов — стекуются и Default, и Redirector, и Collapsable;</li><li>Пока стек собран, внутренние кнопки Check / Details не кликаются — любой клик раскрывает стек; сборка стека схлопывает и раскрытые details;</li><li>Collapsed: верхний тост с шевроном + две псевдо-подложки (<code>::before/::after</code>, без фейкового DOM); hover выдвигает подложки на 2px и показывает чипсу Clear (N);</li><li>Expanded (клик по стопке или шеврону): столбец тостов с крестиками, чипса становится Clear All, рядом круглая кнопка-шеврон сборки.</li></ul>'
      + '<b>Менеджер (SB_TOAST):</b>'
      + '<ul><li>Host: fixed справа сверху, под Navigation Bar — высота нав-бара + 16px (или + 32px в padded-режиме, <code>SB_TOAST.configure({ padded: true })</code>);</li><li>API: <code>sbToastShow(opts) → id</code>, <code>sbToastHide(id)</code>, <code>sbToastClearAll()</code>;</li><li>Группировка: вариант + severity; Default — 2+ собираются в стек сразу;</li><li>Redirector / Collapsable: стек — только защита от потопа (3+); отдельной карточкой над группой держится только самый свежий action-тост, 8с (приход следующего тоста группы снимает свежесть с предыдущего сразу), затем уезжает в стек;</li><li>Клики Close / Clear внутри стека синкают модель менеджера автоматически.</li></ul>'
      + '<b>API:</b>'
      + '<ul><li><code>sbMkToast({ severity, title, text, lead, right, action, details })</code>;</li><li><code>sbMkToastStack({ toasts, expanded })</code>;</li><li><code>sbToastShow / sbToastHide / sbToastClearAll</code>.</li></ul>'
    )),
    playground: {
      title: 'Toast Playground',
      state: {
        severity: 'success',
        right: 'close',
        longText: false,
        withAction: false,
        collapsable: false,
        stack: false,
      },
      controls(pg) {
        return `${sbPgGroup('Header', `
            ${pg.select('severity', [
              { value: 'success',  label: 'Success' },
              { value: 'info',     label: 'Info' },
              { value: 'warning',  label: 'Warning' },
              { value: 'error',    label: 'Error' },
              { value: 'progress', label: 'Progress' },
            ], { label: 'severity' })}
            ${pg.select('right', [
              { value: 'close',        label: 'Close' },
              { value: 'chevron-down', label: 'Chevron Down' },
              { value: 'chevron-up',   label: 'Chevron Up' },
              { value: 'none',         label: 'None' },
            ], { label: 'right slot' })}
          `)}
          ${sbPgGroup('Options', `
            <div class="pg-toggles">
              ${pg.toggle('longText', 'Long')}
              ${pg.toggle('withAction', 'Redirector')}
              ${pg.toggle('collapsable', 'Collapsable')}
              ${pg.toggle('stack', 'Stack')}
            </div>
          `)}`;
      },
      // Взаимоисключение вариантов: Redirector и Collapsable вместе не живут
      // (details в render перебивал бы action — тогл висел бы включённым
      // без эффекта). Stack комбинируется с любым из них: стопка — всегда
      // из тостов ОДНОГО типа (Default / Redirector / Collapsable).
      // Чекбоксы синкает _syncControls после render.
      onControlChange(key, value, s) {
        if (key === 'collapsable' && value) s.withAction = false;
        if (key === 'withAction'  && value) s.collapsable = false;
      },
      render(s) {
        const d = DEMO[s.severity];
        const text = s.longText
          ? d.text + ' ' + d.text + ' ' + d.text
          : d.text;
        // Паддинги под Shadow-L, чтобы тень не резалась краем превью.
        const action  = s.withAction ? { label: 'Check' } : undefined;
        const details = s.collapsable ? { items: s.stack ? DEMO_STEPS.slice(0, 4) : DEMO_STEPS } : undefined;
        const single  = mkToast({ severity: s.severity, title: s.longText ? d.title + ' — a very long title to demonstrate the ellipsis' : d.title, text, right: s.right, action, details });
        // Стек наследует выбранный вариант: Default / Redirector / Collapsable —
        // все тосты стопки одного типа.
        const content = s.stack
          ? mkToastStack({ toasts: [1, 2, 3].map(() => ({ severity: s.severity, title: d.title, text, action, details })), demoLoop: true })
          : single;
        // Scroll view для интерактивных режимов (Stack / Collapsable):
        // высота ФИКСИРОВАННАЯ, не max-height — иначе обёртка растёт при
        // раскрытии и превью скачет. Внутри — свой скролл. Для статичных
        // режимов обёртка не нужна: высота меняется только сменой контролов.
        const inner = `<div style="display:flex;justify-content:center;padding:var(--pad-vert-32) var(--pad-horiz-24)">
            ${content}
          </div>`;
        return (s.stack || s.collapsable)
          ? `<div style="height:480px;overflow-y:auto" data-pg-preserve-scroll>${inner}</div>`
          : inner;
      },
      // Live-демо менеджера SB_TOAST: настоящие тосты поверх страницы.
      // Несколько кликов подряд — видно политику стекования.
      extraPreview() {
        return `<div style="display:flex;justify-content:center;padding:0 0 var(--pad-vert-16)">
          ${sbMkButton({ label: 'Show Live', size: 's', attrs: ' onclick="sbToastPgShow()"' })}
        </div>`;
      },
      genCode(s) {
        const d = DEMO[s.severity];
        if (s.stack) {
          const gAction  = s.withAction ? { label: 'Check' } : undefined;
          const gDetails = s.collapsable ? { items: DEMO_STEPS.slice(0, 3) } : undefined;
          return {
            html: mkToastStack({ toasts: [1, 2].map(() => ({ severity: s.severity, title: d.title, text: d.text, action: gAction, details: gDetails })) }),
            css: window.COMP_CSS.toast,
          };
        }
        return {
          html: mkToast({
            severity: s.severity, title: d.title, text: d.text, right: s.right,
            action: s.withAction && !s.collapsable ? { label: 'Check' } : undefined,
            details: s.collapsable ? { items: DEMO_STEPS.slice(0, 3) } : undefined,
          }),
          css: window.COMP_CSS.toast,
        };
      },
    },
  });
})();
