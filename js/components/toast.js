// ═══════════════════════════════════════════════════════════════════════════
//  TOAST
//  CSS в css/components/toast.css — SYNC-маркеры обязательны.
//  Default-вариант: Header XS (глиф/лоадер + тайтл + close) + body Body M,
//  цветовая полоса severity справа. Redirector / Collapsable / стеки и
//  runtime-менеджер SB_TOAST — следующими заходами.
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
   max-height снимается: в раскрытом тост растёт под контент (в стеке /
   у менеджера появится кап по высоте экрана — следующий заход). */
.sb-toast.collapsable.expanded { max-height: none; }
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
.sb-toast-stack:not(.expanded) .sb-toast-stack-x { display: none; }
.sb-toast-stack.expanded .sb-toast-stack-peek { display: none; }

/* Нижний ряд: чипса Clear + (в expanded) круглая кнопка-шеврон сборки. */
.sb-toast-stack-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--gap-horiz-s);
  margin-top: var(--gap-vert-m);
}
/* Чипса — инверсная пилюля (трюк снэкбара: text-токен фоном, surface
   контентом — пара сама инвертируется темой). */
.sb-toast-stack-clear {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-horiz-xs);
  border: none;
  cursor: pointer;
  padding: var(--pad-vert-4) var(--pad-horiz-16);
  border-radius: var(--radius-100);
  background: var(--text-secondary);
  color: var(--surface-1);
  font-size: var(--body-font-size-s);
  font-weight: var(--font-weight-semibold);
  line-height: var(--body-line-height);
  transition: opacity 0.15s ease;
}
/* Collapsed: чипса Clear (N) появляется только по ховеру на стек. */
.sb-toast-stack:not(.expanded) .sb-toast-stack-clear {
  opacity: 0;
  pointer-events: none;
}
.sb-toast-stack:not(.expanded):hover .sb-toast-stack-clear {
  opacity: 1;
  pointer-events: auto;
}
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
}`;

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
    close: () => `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon" aria-label="Close">${sbIcon('close-line', 'S')}</button>`,
    'chevron-down': () => `<div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
    'chevron-up':   () => `<div class="sb-chevron">${sbIcon('arrow-up-s-line', 'L')}</div>`,
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
    const right = `<div class="sb-chevron sb-toast-stack-peek">${sbIcon('arrow-down-s-line', 'L')}</div>`
      + `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon sb-toast-stack-x" aria-label="Close" onclick="sbToastStackDismiss(this)">${sbIcon('close-line', 'S')}</button>`;
    const cards = toasts.map(t => mkToast(Object.assign({}, t, { right }))).join('');
    return `<div class="sb-toast-stack${expanded ? ' expanded' : ''}" data-count="${toasts.length}"${demoLoop ? ' data-demo-loop' : ''}>
      <div class="sb-toast-stack-cards" onclick="sbToastStackOpen(this)">${cards}</div>
      <div class="sb-toast-stack-bar">
        <button type="button" class="sb-toast-stack-clear" onclick="sbToastStackClear(this)">${sbIcon('close-circle-fill', 'S')}<span class="sb-toast-stack-clear-n">Clear (${toasts.length})</span><span class="sb-toast-stack-clear-all">Clear All</span></button>
        <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon sb-toast-stack-fold" aria-label="Collapse" onclick="sbToastStackFold(this)">${sbIcon('arrow-up-s-line', 'S')}</button>
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
  // Сборка обратно — круглая кнопка-шеврон в баре.
  window.sbToastStackFold = function(btn) {
    const stack = btn.closest('.sb-toast-stack');
    if (stack) stack.classList.remove('expanded');
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
      + '<ul><li>Closed: same as Redirector, the button is Details;</li><li>Expanded: a details zone — Info Cells from List (status + timestamp), the contract takes any content; the button turns into Hide;</li><li>Toggle: <code>sbToastDetailsToggle</code> flips <code>.expanded</code> and swaps the label with the chevron.</li></ul>'
      + '<b>Stack:</b>'
      + '<ul><li>Only one toast type collects into a stack;</li><li>Collapsed: the top toast with a chevron + two pseudo-underlays (<code>::before/::after</code>, no fake DOM); hover slides the underlays 2px down and reveals the Clear (N) chip;</li><li>Expanded (click the pile or the chevron): a column of toasts with individual close buttons, the chip turns into Clear All with a round fold chevron next to it.</li></ul>'
      + '<b>API:</b>'
      + '<ul><li><code>sbMkToast({ severity, title, text, lead, right, action, details })</code>;</li><li><code>sbMkToastStack({ toasts, expanded })</code>.</li></ul>',
      '<b>Геометрия:</b>'
      + '<ul><li>Ширина: 360px (min 288 / max 360);</li><li>Высота: 88px (min 88 / max 208);</li><li>Радиусы: 12 / 4 / 4 / 12 — правые углы площе из-за полосы;</li><li>Тень: Shadow-L.</li></ul>'
      + '<b>Полоса severity:</b>'
      + '<ul><li>Border-right 4px: <code>--success</code> / <code>--info</code> / <code>--alert</code> / <code>--error</code> / <code>--primary</code> (progress).</li></ul>'
      + '<b>Состав:</b>'
      + '<ul><li>Хедер: Header XS — глиф Symbol Badge или лоадер + тайтл + Close;</li><li>Body: Body M, <code>--text-muted</code>, до 2 строк с многоточием, отступ 40px в линию с тайтлом.</li></ul>'
      + '<b>Redirector:</b>'
      + '<ul><li>Body: до 3 строк;</li><li>Футер: Action Bar с одной текстовой кнопкой на всю ширину (<code>align: center</code>);</li><li>Радиусы: 12 / 2 / 2 / 12.</li></ul>'
      + '<b>Collapsable:</b>'
      + '<ul><li>Закрытый: как Redirector, кнопка — Details;</li><li>Раскрытый: details-зона — Info Cells из List (статус + timestamp), контракт принимает любой контент; кнопка меняется на Hide;</li><li>Toggle: <code>sbToastDetailsToggle</code> переключает <code>.expanded</code> и свапает лейбл с шевроном.</li></ul>'
      + '<b>Stack:</b>'
      + '<ul><li>В стек собирается только один тип тостов;</li><li>Collapsed: верхний тост с шевроном + две псевдо-подложки (<code>::before/::after</code>, без фейкового DOM); hover выдвигает подложки на 2px и показывает чипсу Clear (N);</li><li>Expanded (клик по стопке или шеврону): столбец тостов с крестиками, чипса становится Clear All, рядом круглая кнопка-шеврон сборки.</li></ul>'
      + '<b>API:</b>'
      + '<ul><li><code>sbMkToast({ severity, title, text, lead, right, action, details })</code>;</li><li><code>sbMkToastStack({ toasts, expanded })</code>.</li></ul>'
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
      // без эффекта). Stack — стопка ДЕФОЛТНЫХ тостов (правило юзера: в стек
      // собирается один тип), поэтому гасит оба варианта и наоборот.
      // Чекбоксы синкает _syncControls после render.
      onControlChange(key, value, s) {
        if (key === 'collapsable' && value) { s.withAction = false; s.stack = false; }
        if (key === 'withAction'  && value) { s.collapsable = false; s.stack = false; }
        if (key === 'stack'       && value) { s.withAction = false; s.collapsable = false; }
      },
      render(s) {
        const d = DEMO[s.severity];
        const text = s.longText
          ? d.text + ' ' + d.text + ' ' + d.text
          : d.text;
        // Паддинги под Shadow-L, чтобы тень не резалась краем превью.
        const action  = s.withAction ? { label: 'Check' } : undefined;
        const details = s.collapsable ? { items: DEMO_STEPS } : undefined;
        const single  = mkToast({ severity: s.severity, title: s.longText ? d.title + ' — a very long title to demonstrate the ellipsis' : d.title, text, right: s.right, action, details });
        const content = s.stack
          ? mkToastStack({ toasts: [1, 2, 3].map(() => ({ severity: s.severity, title: d.title, text })), demoLoop: true })
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
      genCode(s) {
        const d = DEMO[s.severity];
        if (s.stack) {
          return {
            html: mkToastStack({ toasts: [1, 2].map(() => ({ severity: s.severity, title: d.title, text: d.text })) }),
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
