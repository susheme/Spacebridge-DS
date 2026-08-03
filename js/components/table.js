// ═══════════════════════════════════════════════════════════════════════════
//  TABLE
//  Composable flex-таблица (div + ARIA-роли, не <table> — для будущих
//  drag/pin/accordion рядов). Фаза 1: Header Primary + Secondary. CSS в
//  css/components/
//  table.css — SYNC-маркеры обязательны.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.table = `.sb-table {
  display: inline-flex;
  flex-direction: column;
}
/* Хедер-ряд — flex-строка ячеек, gap 0 (границы дают separator'ы). */
.sb-thead-row {
  display: inline-flex;
  align-items: flex-start;
}
/* Текстовая ячейка хедера. Типографика CAPTION — на лейбле (.sb-caption +
   .sb-fw-medium), цвет наследуется от ячейки. */
.sb-th {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--gap-horiz-xs);
  height: 40px;
  min-width: 80px;
  box-sizing: border-box;
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  background: var(--background);
  border-bottom: var(--border-width-1) solid var(--border);
  color: var(--text-secondary);
  white-space: nowrap;
  user-select: none;
}
/* Чекбокс-ячейка — квадрат 40×40, контент по центру. */
.sb-th-check {
  width: 40px;
  min-width: 40px;
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  justify-content: center;
  gap: var(--gap-vert-0);
}
/* Скруглены ТОЛЬКО верхние углы хедера: первая ячейка — TL, последняя — TR. */
.sb-thead-row > :first-child { border-top-left-radius: var(--radius-8); }
.sb-thead-row > :last-child  { border-top-right-radius: var(--radius-8); }
/* Ячейки кликабельны: текстовые — сортировка, чекбокс-ячейка — select-all. */
.sb-th { cursor: pointer; }
/* Sort-иконка 24×24, всегда ghost (--border) — цвет при сортировке НЕ меняется.
   Направление — поворотом одной иконки (arrow-up): asc = 0°, desc = 180°. */
.sb-th-sort {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-left: auto;
  color: var(--border);
  transition: transform 0.15s ease;
}
.sb-th-sort svg { width: 24px; height: 24px; }
.sb-th[data-sort="desc"] .sb-th-sort { transform: rotate(180deg); }
/* Вертикальный separator ВНУТРИ ячейки — у правого края, ПОЛНОСТЬЮ внутри (без
   выноса наружу: вынесенная половина перекрывалась непрозрачным фоном соседней
   ячейки и резала сепаратор пополам). Ячейки встык → border-bottom сплошной.
   sep-v sep-l = 23px, центр по ряду 40px → зазор ~8px сверху/снизу. */
.sb-th > .sb-sep.sep-v {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
/* === Header Secondary — ячейка типа Title M (16/600 --text-tertiary) с иконка-
   слотом (антенна-статус или любая sbIcon) слева/справа. База — .sb-th, тут
   только отличия от Primary: gap-vert-s, min-width 40, паддинг 8/8, цвет, курсор.
   Бордер-низ — наследует --border (как у Primary). Сортировки нет. */
.sb-th-secondary {
  gap: var(--gap-vert-s);
  min-width: 40px;
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  color: var(--text-tertiary);
  cursor: default;
}
/* Иконка-слот 24×24, не сжимается (антенна .sb-antenna-icon и sbIconRaw — оба 24). */
.sb-th-ic { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sb-th-ic svg { width: 24px; height: 24px; display: block; }
/* === Table Cell (body-ячейка ряда, 40px) === Контейнер: flex, ширина 200
   (min 80), padding 8/8, space-between, border-bottom --border-soft,
   цвет --text-tertiary. Внутрь — один из типов контента. */
.sb-td {
  display: flex;
  width: 200px;
  min-width: 80px;
  height: 40px;
  box-sizing: border-box;
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  justify-content: space-between;
  align-items: center;
  background: var(--background);
  border-bottom: var(--border-width-1) solid var(--border-soft);
  color: var(--text-tertiary);
}
/* Состояния Hover/Selected — цвета как у Context Cell (context-menu.css):
   hover → surface-1 (если не selected); selected → primary-hover + текст primary.
   Hover/Selected — на уровне РЯДА (.sb-trow); .is-hover/.is-selected на ячейке —
   для одиночного показа состояния в демо. Selected перебивает hover. */
.sb-trow:hover:not(.is-selected) .sb-td,
.sb-td.is-hover:not(.is-selected) { background: var(--surface-1); }
.sb-trow.is-selected .sb-td,
.sb-td.is-selected { background: var(--primary-hover); color: var(--primary); }
/* Узкие control-ячейки: контент по центру, без горизонтального паддинга.
   Ширина — модификатором: Checkbox = 40 (дефолт), Chevron/Icon-Button/Drawer = 32
   (и компактный чекбокс). */
.sb-td-ctrl { padding-left: 0; padding-right: 0; justify-content: center; }
.sb-td-w40 { width: 40px; min-width: 40px; }
.sb-td-w32 { width: 32px; min-width: 32px; }
/* Toggle-ячейка — ширина по содержимому (тоглу) + паддинг 8. */
.sb-td-auto { width: auto; min-width: 0; }
/* Drawer — иконка draggable (16px, size S), muted, grab-курсор. */
.sb-td-drag { display: inline-flex; align-items: center; color: var(--text-secondary); cursor: grab; }
.sb-td-drag svg { display: block; }
/* Text-контент: Title S (14/600) с обрезкой по ellipsis. min-width:0 — чтобы
   flex-ребёнок мог ужиматься и реально включился text-overflow. */
.sb-td-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-variant-numeric: lining-nums tabular-nums;
  text-transform: none;  /* данные — как есть, без Title-Case энфорсмента */
}
/* Date-контент — CAPTION + цвет --text-secondary (светлее обычного текста). */
.sb-td-date { color: var(--text-secondary); }
/* Слотовая система: левый слот (ведущая группа — растёт и ужимается под
   ellipsis) + правый (трейлинг: icon/chevron/toggle/btn — не ужимается).
   space-between на .sb-td разводит их по краям. Gap внутри слота — 8px. */
.sb-td-l, .sb-td-r { display: flex; align-items: center; gap: var(--gap-vert-s); }
.sb-td-l { flex: 1; min-width: 0; }
.sb-td-r { flex-shrink: 0; margin-left: auto; }
/* Иконочный слот (icon/chevron) 24×24, чуть светлее текста. */
.sb-td-ic { display: inline-flex; align-items: center; flex-shrink: 0; color: var(--text-secondary); }
.sb-td-ic svg { width: 24px; height: 24px; display: block; }
/* Input внутри ячейки тянется на ширину слота (перебиваем min/max-width поля). */
.sb-td .sb-tf { flex: 1; min-width: 0; }
/* Body-ряд таблицы — горизонтальный flex ячеек (как thead-row, но для данных). */
.sb-trow { display: flex; }
/* Kebab-колонка (row-actions): пустой хедер без сортировки. */
.sb-th-kebab { cursor: default; }
/* Delete (последний пункт row-меню) — danger-цвет. Скоуп таблицы, чтобы не
   трогать общий Context Menu (там нет danger-варианта — см. BACKLOG). */
.sb-td .sb-ctx-card > .sb-ctx-cell:last-child,
.sb-td .sb-ctx-card > .sb-ctx-cell:last-child .sb-ctx-cell-icon-left { color: var(--error); }
/* Table Wrap — контейнер: таблица + Tool Bar + Footer, общий бордер/радиус/клип. */
.sb-table-wrap {
  display: inline-flex;
  flex-direction: column;
  max-width: 100%;
  border-radius: var(--radius-8);
  background: var(--background);
}
/* Footer — низ wrap'а: скруглён снизу. position/z-index — футер поверх
   выезжающего из-под него Tool Bar (тень — на тул-баре, не на футере). */
.sb-table-wrap .sb-table-footer {
  position: relative;
  z-index: 2;
  border-top-color: var(--border-soft);
  border-bottom-left-radius: var(--radius-8);
  border-bottom-right-radius: var(--radius-8);
}
/* Зона футера — позиционный контекст для floating Tool Bar. */
.sb-table-foot { position: relative; }
/* Table Tool Bar — ФЛОУТИНГ ОСТРОВОК: компактная плашка по центру над футером
   (gap 8px), авто-ширина под контент, НЕ меняет высоту таблицы (всплывает поверх
   центра нижнего ряда). Выезжает вверх (translateY + fade). Shadow-S, radius-8. */
.sb-table-toolbar {
  position: absolute;
  left: 50%;
  bottom: calc(100% + var(--gap-vert-s));
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--gap-horiz-s);
  max-width: calc(100% - var(--pad-horiz-16));
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  background: var(--background);
  border-radius: var(--radius-8);
  box-shadow: 0 2px 8px 0 var(--shadow-overlay);
  box-sizing: border-box;
  white-space: nowrap;
  opacity: 0;
  transform: translate(-50%, 8px);
  pointer-events: none;
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.sb-table-toolbar.is-visible {
  opacity: 1;
  transform: translate(-50%, 0);
  pointer-events: auto;
}
/* Кнопки островка — единая высота 32 (S); иконки — квадрат 32, Apply — снаг. */
.sb-table-toolbar .sb-btn { height: 32px; }
.sb-table-toolbar .sb-btn-icon { width: 32px; min-width: 32px; min-height: 32px; max-height: 32px; }
.sb-table-toolbar .sb-btn:not(.sb-btn-icon) { min-width: 0; }`;

// --- TABLE ---
(() => {
  // mkTable({ columns:[{title, sort?:'asc'|'desc'}], selectable:bool })
  // Фаза 1 — только Header Primary. Ряды / типы ячеек / тулбар — далее.
  // Чекбокс-ячейка select-all. Чекбокс — нативный DS-компонент в режиме
  // managed: роль и Tab у него есть, а тогл — наш (источник правды это
  // .is-selected на рядах, а не класс чекбокса). Клик по всей ячейке
  // → sbTableSelectAll; Space по чекбоксу — туда же (см. keydown ниже).
  const checkCell = () => ({
    cls: 'sb-th sb-th-check',
    attrs: ' onclick="sbTableSelectAll(this)"',
    body: sbMkCheckbox({ managed: true }),
  });

  // Сборка хедер-ряда из ячеек {cls, attrs?, body}. Separator живёт ВНУТРИ ячейки
  // (абсолют на правом стыке) — кроме последней, чтобы border-bottom был сплошной.
  function buildRow(inner) {
    const sep = '<span class="sb-sep sep-v sep-l"></span>';
    const cells = inner.map((c, i) =>
      `<div class="${c.cls}" role="columnheader"${c.attrs || ''}>${c.body}${i < inner.length - 1 ? sep : ''}</div>`
    );
    return `<div class="sb-table" role="table">
      <div class="sb-thead-row" role="row">${cells.join('')}</div>
    </div>`;
  }

  // Header Primary — CAPTION-ячейки (12/500 uppercase) + sort-иконка.
  // mkTable({ columns:[{title, sort?:'asc'|'desc'}], selectable:bool })
  function mkTable({ columns = [], selectable = false } = {}) {
    const inner = [];
    if (selectable) inner.push(checkCell());
    columns.forEach(col => {
      // Одна иконка arrow-up — направление задаёт поворот через [data-sort].
      const sorted = col.sort ? ' is-sorted' : '';
      const dirAttr = col.sort ? ` data-sort="${col.sort}"` : '';
      inner.push({
        cls: `sb-th${sorted}`,
        attrs: `${dirAttr} onclick="sbTableSort(this)"`,
        body: `
        <span class="sb-caption sb-fw-medium">${col.title}</span>
        <span class="sb-th-sort">${sbIconRaw('arrow-up-s-fill', 'L')}</span>`,
      });
    });
    return buildRow(inner);
  }
  window.sbMkTable = mkTable;

  // Иконка для Header Secondary: антенна-статус (window.sbAntenna: full/high/mid/
  // low/off, переиспользуем из Status) или любая sbIcon по имени из ICON_PATHS.
  function secIcon(col) {
    if (col.antenna && window.sbAntenna) return window.sbAntenna[col.antenna] || window.sbAntenna.high;
    if (col.icon) return sbIconRaw(col.icon, 'L');
    return '';
  }

  // Header Secondary — Title M (16/600 --text-tertiary) ячейки с иконка-слотом
  // (антенна/любая) слева или справа. Без сортировки.
  // mkTableSecondary({ columns:[{title, antenna?, icon?, iconSide?:'left'|'right'}], selectable })
  function mkTableSecondary({ columns = [], selectable = false } = {}) {
    const inner = [];
    if (selectable) inner.push(checkCell());
    columns.forEach(col => {
      const ic = secIcon(col);
      const slot = ic ? `<span class="sb-th-ic">${ic}</span>` : '';
      const label = `<span class="sb-title-m sb-fw-semibold">${col.title}</span>`;
      inner.push({
        cls: 'sb-th sb-th-secondary',
        body: col.iconSide === 'right' ? `${label}${slot}` : `${slot}${label}`,
      });
    });
    return buildRow(inner);
  }
  window.sbMkTableSecondary = mkTableSecondary;

  // Слот-примитивы Table Cell — инлайн DS-классов (публичных билдеров у этих
  // компонентов нет). Меняется чужая разметка — синхронизировать здесь.
  const _txt  = v => `<span class="sb-td-text sb-title-s sb-fw-semibold">${v}</span>`;
  const _date = v => `<span class="sb-td-text sb-td-date sb-caption">${v || '30.06.2026'}</span>`;
  const _lnk  = v => `<a class="sb-td-text sb-link-s" href="#" onclick="return false">${v}</a>`;
  const _ic   = n => `<span class="sb-td-ic">${sbIconRaw(n || 'radar-line', 'L')}</span>`;
  const _chv  = () => sbMkChevron();  // Chevron Button (вниз — раскрытие ряда)
  const _drag = () => `<span class="sb-td-drag">${sbIconRaw('draggable', 'S')}</span>`;        // Drawer / drag-handle
  const _cb   = () => sbMkCheckbox({ static: true });  // витрина типа ячейки: выбором не рулит, Tab не забирает
  const _tgl  = () => sbMkToggle({ on: true });
  const _btn  = () => `<button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm" type="button">${sbIcon('more-2-line', 'M')}</button>`;
  const _inp  = v => `<div class="sb-tf"><input class="sb-tf-input" placeholder="${v || 'Value'}"></div>`;
  const _badge = (c, l) => `<span class="sb-badge-status mini ${c}">${l}</span>`;  // Badge-Status Mini
  const _dot  = c => `<span class="sb-status-dot ${c}"></span>`;
  const _mark = c => `<span class="sb-mark sm ${c}"></span>`;  // Mark Horizontal (10×3px)
  const _av   = i => sbMkAvatar({ type: 'initials', initials: i || 'NS' });

  // Table Cell (body-ячейка ряда, 40px). Типы контента в слотовой системе:
  // левый слот = ведущая группа, правый = трейлинг. Узкие control-ячейки
  // control-ячейки по центру: checkbox=40, chevron/icon-button/drawer=32; toggle — по тоглу.
  // mkCell({ type, value })
  function mkCell({ type = 'text', value = '', state = '', width } = {}) {
    const sc = state ? ` ${state}` : '';  // is-hover | is-selected
    const ws = width ? ` style="width:${width}px"` : '';  // для выравнивания колонок
    // Узкие control-ячейки: контент по центру, без слотов. Checkbox = 40px,
    // Chevron Button / Icon-Button / Drawer = 32px.
    const CTRL = { checkbox: [_cb, 'sb-td-w40'], chevron: [_chv, 'sb-td-w32'], 'icon-button': [_btn, 'sb-td-w32'], drawer: [_drag, 'sb-td-w32'] };
    if (CTRL[type]) { const [fn, wcls] = CTRL[type]; return `<div class="sb-td sb-td-ctrl ${wcls}${sc}" role="cell"${ws}>${fn()}</div>`; }
    // Toggle — ширина по содержимому.
    if (type === 'toggle') return `<div class="sb-td sb-td-auto${sc}" role="cell"${ws}>${_tgl()}</div>`;

    let left = [], right = [];
    switch (type) {
      case 'text':              left = [_txt(value || 'Text')]; break;
      case 'link':              left = [_lnk(value || 'Link')]; break;
      case 'date':              left = [_date(value)]; break;
      case 'status-text':       left = [_badge('bs-green', value || 'Online')]; break;
      case 'icon':              left = [_ic(value)]; break;
      case 'input':             left = [_inp(value)]; break;
      case 'icon-text':         left = [_ic(), _txt(value || 'Text')]; break;
      case 'link-icon':         left = [_lnk(value || 'Link')]; right = [_ic()]; break;
      case 'text-icon':         left = [_txt(value || 'Text')]; right = [_ic()]; break;
      case 'avatar-text':       left = [_av(), _txt(value || 'Text')]; break;
      case 'avatar-text-icon':  left = [_av(), _txt(value || 'Text')]; right = [_ic()]; break;
      case 'avatar-link':       left = [_av(), _lnk(value || 'Link')]; break;
      case 'avatar-link-icon':  left = [_av(), _lnk(value || 'Link')]; right = [_ic()]; break;
      case 'status-circle-text':left = [_dot('online'), _txt(value || 'Online')]; break;
      case 'mark-text':         left = [_mark('success'), _txt(value || 'Value')]; break;
    }
    const l = left.length  ? `<span class="sb-td-l">${left.join('')}</span>` : '';
    const r = right.length ? `<span class="sb-td-r">${right.join('')}</span>` : '';
    return `<div class="sb-td${sc}" role="cell"${ws}>${l}${r}</div>`;
  }
  window.sbMkTableCell = mkCell;

  // Компактный островок bulk-действий, набор кнопок — data-driven. Кнопки
  // Secondary S (высоты выровнены до 32 в CSS). Action:
  //   { icon?, label?, variant?:'secondary'|'primary'|'text', critical?, onclick?, ariaLabel? }
  //   только icon → icon-only; icon+label → текст с иконкой; только label → текст.
  // mkTableToolBar({ actions, visible })
  const _TOOLBAR_DEFAULT = [
    { icon: 'download-2-line', ariaLabel: 'Download' },
    { label: 'Apply' },
    { icon: 'delete-bin-line', critical: true, ariaLabel: 'Delete' },
  ];
  function _toolBtn(a) {
    const variant = a.variant === 'primary' ? 'sb-btn-primary'
                  : a.variant === 'text'    ? 'sb-btn-text'
                  : 'sb-btn-secondary';
    const iconOnly = a.icon && !a.label;
    const cls = `sb-btn ${variant} sb-btn-sm${iconOnly ? ' sb-btn-icon' : ''}${a.critical ? ' sb-btn-critical' : ''}`;
    const aria = iconOnly && a.ariaLabel ? ` aria-label="${a.ariaLabel}"` : '';
    const click = a.onclick ? ` onclick="${a.onclick}"` : '';
    const icon = a.icon ? sbIcon(a.icon, 'M') : '';
    return `<button class="${cls}" type="button"${aria}${click}>${icon}${a.label || ''}</button>`;
  }
  function mkTableToolBar({ actions, visible = false } = {}) {
    const list = Array.isArray(actions) && actions.length ? actions : _TOOLBAR_DEFAULT;
    return `<div class="sb-table-toolbar${visible ? ' is-visible' : ''}">${list.map(_toolBtn).join('')}</div>`;
  }
  window.sbMkTableToolBar = mkTableToolBar;

  // Левый слот футера: инфо о кол-ве рядов (по умолчанию) + счётчик выбранных
  // (скрыт). При выборе _syncSelUI прячет row-info и показывает «Selected: N».
  const _footInfo = (total, pageSize) => {
    const shown = pageSize ? Math.min(pageSize, total) : total;
    const label = pageSize ? `Rows: ${shown} of ${total}` : `${total} rows`;
    return `<span class="sb-body-s" data-row-info style="color:var(--text-tertiary)">${label}</span>`
      + `<span class="sb-body-s sb-fw-semibold" data-sel-count style="display:none;color:var(--primary)">Selected: 0</span>`;
  };

  // Row-меню (kebab в конце ряда): overflow-menu из Context Menu. Последний пункт
  // (Delete) — danger-цвет через скоуп-стиль (у Context Menu нет danger-варианта).
  const _ROWMENU_DEFAULT = [
    { icon: 'file-copy-line',  label: 'Copy' },
    { icon: 'pencil-line',     label: 'Rename' },
    { icon: 'download-2-line', label: 'Download' },
    { icon: 'delete-bin-line', label: 'Delete' },
  ];
  function _rowKebab(items, wStyle) {
    // Фабрики Context Menu доступны без guard'а: table.js грузится ПОСЛЕ
    // context-menu.js (см. index.html и _index.js). Раньше здесь стоял
    // typeof-фолбэк на пустые ячейки — он молча рисовал пустой kebab.
    const cells = items.map(it => sbMkContextCell({ iconLeft: it.icon, label: it.label, mode: 'action' }));
    // Позиционирование — примитив Popover: bottom-end повторяет прежний вид
    // (меню под кнопкой, прижато вправо), но добавляет flip у нижнего края
    // экрана и portal — kebab в последнем ряду больше не режется таблицей.
    // Носик динамический (arrow), поэтому .with-tip у карточки не нужен:
    // тот прибит к right:16px и после сдвига переставал смотреть на кнопку.
    const menu = sbMkPopover({
      trigger: `<button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm" type="button" aria-label="Row actions">${sbIcon('more-2-line', 'M')}</button>`,
      content: sbMkContextCard(cells),
      placement: 'bottom-end',
      arrow: true,
    });
    return `<div class="sb-td sb-td-ctrl" role="cell"${wStyle}>${menu}</div>`;
  }

  // Полная таблица: Header Primary + N рядов body-ячеек. Колонки выровнены —
  // одна ширина на хедер- и body-ячейку столбца (обе box-sizing:border-box).
  // Первый столбец — чекбокс (select-all в хедере, row-select в рядах).
  // С toolbar/footer оборачивается в .sb-table-wrap (Tool Bar всплывает по выбору,
  // Footer = row-info + Pagination). rowMenu: true|Array — kebab-колонка в конце.
  // pageSize>0 — рабочая пагинация (ряды режутся на страницы, переключение sbTablePage).
  // mkTableFull({ columns, rows, checkW, toolbar, footer, rowMenu, pageSize })
  function mkTableFull({ columns = [], rows = [], checkW = 40, toolbar = false, footer = false, rowMenu = false, pageSize = 0 } = {}) {
    const sep = '<span class="sb-sep sep-v sep-l"></span>';
    const w = px => ` style="width:${px}px;min-width:${px}px"`;
    const kebabW = 48;
    const menuItems = Array.isArray(rowMenu) ? rowMenu : _ROWMENU_DEFAULT;
    const total = rows.length;
    const paged = pageSize > 0;
    const totalPages = paged ? Math.max(1, Math.ceil(total / pageSize)) : 1;
    // Header Primary: чекбокс-ячейка + колонки (sort-иконка, separator на стыках) +
    // (опц.) пустая kebab-ячейка в конце.
    const h = [`<div class="sb-th sb-th-check" role="columnheader"${w(checkW)} onclick="sbTableSelectAll(this)">${sbMkCheckbox({ managed: true })}${sep}</div>`];
    columns.forEach((c, i) => {
      const dir = c.sort ? ` data-sort="${c.sort}"` : '';
      const isLast = i === columns.length - 1 && !rowMenu;  // kebab-колонка идёт после
      h.push(`<div class="sb-th${c.sort ? ' is-sorted' : ''}" role="columnheader"${w(c.width)}${dir} onclick="sbTableSort(this)"><span class="sb-caption sb-fw-medium">${c.title}</span><span class="sb-th-sort">${sbIconRaw('arrow-up-s-fill', 'L')}</span>${isLast ? '' : sep}</div>`);
    });
    if (rowMenu) h.push(`<div class="sb-th sb-th-kebab" role="columnheader"${w(kebabW)}></div>`);
    const head = `<div class="sb-thead-row" role="row">${h.join('')}</div>`;
    // Body: ряды с row-чекбоксом (выровнен под хедер-чекбокс) + (опц.) kebab в конце.
    const body = rows.map((row, ri) => {
      const hidden = paged && ri >= pageSize ? ' style="display:none"' : '';  // видна только 1-я страница
      const cells = [`<div class="sb-td sb-td-ctrl" role="cell"${w(checkW)} onclick="sbTableRowSelect(this)">${sbMkCheckbox({ managed: true })}</div>`];
      columns.forEach((c, i) => cells.push(mkCell({ type: c.type || 'text', value: row[i], width: c.width })));
      if (rowMenu) cells.push(_rowKebab(menuItems, w(kebabW)));
      return `<div class="sb-trow" role="row"${hidden}>${cells.join('')}</div>`;
    }).join('');
    // При пагинации фиксируем высоту таблицы по лейауту (хедер + pageSize рядов
    // × 40px), а не по факт. кол-ву — не прыгает при переключении. Хвост-пустота
    // на неполной странице — фон --background (как ряды).
    const bodyStyle = paged ? ` style="min-height:${(pageSize + 1) * 40}px;background:var(--background)"` : '';
    const tableHtml = `<div class="sb-table" role="table"${bodyStyle}>${head}${body}</div>`;
    if (!toolbar && !footer) return tableHtml;
    // Tool Bar (floating, absolute) + Footer в зоне .sb-table-foot (поз. контекст).
    const tb = toolbar ? mkTableToolBar() : '';
    const ft = footer && typeof sbMkTableFooter === 'function'
      ? sbMkTableFooter({
          left: _footInfo(total, pageSize),
          right: typeof sbMkPagination === 'function'
            ? sbMkPagination({ currentPage: 1, totalPages, onPage: paged ? 'sbTablePage(this,{N})' : '' })
            : '',
        })
      : '';
    return `<div class="sb-table-wrap"${paged ? ` data-page-size="${pageSize}"` : ''}>${tableHtml}<div class="sb-table-foot">${tb}${ft}</div></div>`;
  }
  window.sbMkTableFull = mkTableFull;

  // Переключение страницы пагинации: показать ряды страницы, обновить счётчик и
  // перерисовать контролы пагинации. btn — кнопка пагинации, page — номер.
  function sbTablePage(btn, page) {
    const wrap = btn.closest('.sb-table-wrap');
    if (!wrap) return;
    const rows = [...wrap.querySelectorAll('.sb-trow')];
    const total = rows.length;
    const pageSize = parseInt(wrap.getAttribute('data-page-size'), 10) || total;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    page = Math.max(1, Math.min(totalPages, page));
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    rows.forEach((r, i) => { r.style.display = (i >= start && i < end) ? '' : 'none'; });
    // Счётчик рядов (только когда не в selection-режиме — текст обновляем всегда,
    // видимость держит _syncSelUI).
    const info = wrap.querySelector('[data-row-info]');
    if (info) info.textContent = `Rows: ${end - start} of ${total}`;
    // Перерисовать контролы (active-страница + prev/next disabled).
    const pag = wrap.querySelector('.sb-pagination');
    if (pag && typeof sbMkPagination === 'function') {
      pag.outerHTML = sbMkPagination({ currentPage: page, totalPages, onPage: 'sbTablePage(this,{N})' });
    }
  }
  window.sbTablePage = sbTablePage;

  // Клик по текстовой ячейке — сортировка колонки. Дефолтная стрелка смотрит
  // ВВЕРХ (= asc-вид), поэтому первый клик ведём в desc — стрелка видимо
  // поворачивается вниз (иначе asc==дефолт, и казалось бы «клик не сработал»).
  // Дальше toggle desc⇄asc. Активна только одна колонка.
  function sbTableSort(cell) {
    const headRow = cell.closest('.sb-thead-row');
    const table = cell.closest('.sb-table');
    if (headRow) headRow.querySelectorAll('.sb-th.is-sorted').forEach(c => {
      if (c !== cell) { c.classList.remove('is-sorted'); c.removeAttribute('data-sort'); }
    });
    const dir = cell.getAttribute('data-sort') === 'desc' ? 'asc' : 'desc';
    cell.classList.add('is-sorted');
    cell.setAttribute('data-sort', dir);
    // Реальная сортировка рядов по колонке (если есть body). Индекс колонки —
    // позиция хедер-ячейки среди детей ряда; body-ячейки выровнены по индексу.
    if (!table || !headRow) return;
    const colIdx = [...headRow.children].indexOf(cell);
    const rows = [...table.querySelectorAll('.sb-trow')];
    if (colIdx < 0 || !rows.length) return;
    const val = tr => (tr.children[colIdx]?.textContent || '').trim();
    // Числовой ключ для чистых чисел (в т.ч. со знаком/единицей: «-68 dBm»),
    // но НЕ для IP-подобных (10.0.12.4) — их натуральной строкой.
    const key = s => {
      const m = s.match(/^-?\d+(?:\.\d+)?/);
      return (m && !/^\d+\.\d+\.\d+/.test(s)) ? { n: parseFloat(m[0]) } : { t: s };
    };
    rows.sort((a, b) => {
      const ka = key(val(a)), kb = key(val(b));
      const r = ('n' in ka && 'n' in kb)
        ? ka.n - kb.n
        : String('t' in ka ? ka.t : ka.n).localeCompare(String('t' in kb ? kb.t : kb.n), undefined, { numeric: true, sensitivity: 'base' });
      return dir === 'asc' ? r : -r;
    });
    rows.forEach(tr => table.appendChild(tr));  // переставляем в отсортированном порядке
  }
  window.sbTableSort = sbTableSort;

  // --- Checkbox-логика таблицы ---
  // Отрисовку и aria делает сам компонент Checkbox (sbCheckboxSet). Таблица
  // только решает, ЧТО показать: источник правды — .is-selected на рядах.
  const _setCb = (cb, state) => sbCheckboxSet(cb, state);

  // Space по чекбоксу = клик по его ячейке. Чекбоксы тут managed, поэтому
  // делегированный тогл из checkbox.js их не трогает — клавиатуру таблица
  // разводит сама, чтобы не разъехаться с выбором ряда.
  if (!window.__sbTableKeysBound) {
    window.__sbTableKeysBound = true;
    document.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Spacebar') return;
      const cb = e.target.closest && e.target.closest('.sb-checkbox[role="checkbox"]');
      if (!cb) return;
      const cell = cb.closest('.sb-th-check, .sb-td-ctrl');
      if (!cell) return;
      e.preventDefault();  // иначе Space проскроллит страницу
      if (cell.classList.contains('sb-th-check')) sbTableSelectAll(cell);
      else sbTableRowSelect(cell);
    });
  }
  // Синхронизировать хедер-чекбокс по числу выбранных рядов:
  //   0 → пусто, все → checked, часть → indeterminate (minus, «Unselect All»).
  function _syncHead(table) {
    const headCb = table.querySelector('.sb-thead-row .sb-checkbox');
    if (!headCb) return;
    const rows = table.querySelectorAll('.sb-trow');
    const sel = [...rows].filter(r => r.classList.contains('is-selected')).length;
    if (sel === 0)                _setCb(headCb, { checked: false });
    else if (sel === rows.length) _setCb(headCb, { checked: true });
    else                          _setCb(headCb, { indeterminate: true });
  }
  // Обновить selection-UI во wrap'е: счётчик «Selected: N» + видимость Tool Bar.
  function _syncSelUI(table) {
    const wrap = table.closest('.sb-table-wrap');
    if (!wrap) return;
    const n = table.querySelectorAll('.sb-trow.is-selected').length;
    // Левый слот футера: row-info ⇄ «Selected: N» (взаимоисключающе).
    wrap.querySelectorAll('[data-sel-count]').forEach(el => {
      el.textContent = `Selected: ${n}`;
      el.style.display = n > 0 ? '' : 'none';
    });
    wrap.querySelectorAll('[data-row-info]').forEach(el => {
      el.style.display = n > 0 ? 'none' : '';
    });
    const tb = wrap.querySelector('.sb-table-toolbar');
    if (tb) tb.classList.toggle('is-visible', n > 0);
  }
  // Клик по хедер-чекбоксу: пусто → выбрать все ряды; часть/все → снять все.
  function sbTableSelectAll(cell) {
    const table = cell.closest('.sb-table');
    const cb = cell.querySelector('.sb-checkbox');
    if (!cb) return;
    const rows = table ? [...table.querySelectorAll('.sb-trow')] : [];
    if (!rows.length) {  // хедер-only демо (нет рядов): простой toggle пусто⇄checked
      const active = cb.classList.contains('checked') || cb.classList.contains('indeterminate');
      _setCb(cb, { checked: !active });
      return;
    }
    const selectAll = !rows.some(r => r.classList.contains('is-selected'));
    rows.forEach(r => {
      r.classList.toggle('is-selected', selectAll);
      const rc = r.querySelector('.sb-checkbox');
      if (rc) _setCb(rc, { checked: selectAll });
    });
    _syncHead(table);
    _syncSelUI(table);
  }
  window.sbTableSelectAll = sbTableSelectAll;
  // Клик по row-чекбоксу: тоггл выбора ряда + пересинк хедера.
  function sbTableRowSelect(cell) {
    const row = cell.closest('.sb-trow');
    if (!row) return;
    const sel = !row.classList.contains('is-selected');
    row.classList.toggle('is-selected', sel);
    const rc = row.querySelector('.sb-checkbox');
    if (rc) _setCb(rc, { checked: sel });
    const table = cell.closest('.sb-table');
    if (table) { _syncHead(table); _syncSelUI(table); }
  }
  window.sbTableRowSelect = sbTableRowSelect;

  function stage(content) {
    return `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);overflow-x:auto">${content}</div>`;
  }

  sbRegister({
    name: 'table',
    title: 'Table',
    description: sbT(
      'A composable flex table (div plus ARIA roles). Two header types, a body cell with all content types and states, and the assembled Full Table: selection, sorting, pagination, a tool bar and a footer. Example: a fleet table of terminals. Pin / drag / accordion, filtering and the empty state come next.',
      'Композируемая flex-таблица (div и ARIA-роли). Два типа хедера, body-ячейка со всеми типами контента и состояниями, и собранная Full Table: выбор, сортировка, пагинация, тул-бар и футер. Пример: таблица флота терминалов. Pin / drag / accordion, фильтрация и empty-state — следующими шагами.'
    ),
    renderPage() {
      const header = mkTable({
        selectable: true,
        columns: [
          { title: 'Terminal' },
          { title: 'IP Address' },
          { title: 'Band' },
          { title: 'Status' },
          { title: 'Signal' },
        ],
      });
      const codeHTML = `<!-- sbMkTable({ selectable:true, columns:[ {title:'Terminal'}, …, {title:'Signal'} ] })\n     активная сортировка колонки: { title:'Signal', sort:'desc' } → стрелка вниз (desc) -->`;

      const headerSec = mkTableSecondary({
        selectable: true,
        columns: [
          { title: 'Item', antenna: 'high', iconSide: 'left' }, // первая — с антенной
          { title: 'Item' },                                    // дальше — без иконки
          { title: 'Item' },
          { title: 'Item' },
          { title: 'Item' },
        ],
      });
      const codeSecHTML = `<!-- sbMkTableSecondary({ selectable:true, columns:[\n     {title:'Item', antenna:'high', iconSide:'left'},  // первая — с антенной\n     {title:'Item'}, {title:'Item'}, {title:'Item'}, {title:'Item'},\n] }) — antenna: full|high|mid|low|off (из Status), либо icon:'<ICON_PATHS>'; iconSide:'left'|'right' -->`;

      // Cell — Text: колонка из body-ячеек; средняя — длинный текст (ellipsis).
      const cellText = `<div class="sb-table" role="table">
        ${mkCell({ value: 'Terminal Alpha' })}
        ${mkCell({ value: 'Ground Station Reykjavik North' })}
        ${mkCell({ value: '192.168.0.1' })}
      </div>`;
      const codeCellHTML = `<!-- sbMkTableCell({ type:'text', value:'Terminal Alpha' })\n     длинный текст обрезается по ellipsis (ширина 200, min 80) -->`;

      // Cell — каталог типов контента (лейбл + ячейка в ряд).
      const CELL_TYPES = [
        ['text', 'Text'], ['link', 'Link'], ['date', 'Date'], ['status-text', 'Status Text'],
        // Узкие control-ячейки (checkbox=40, остальные=32) — группой.
        ['checkbox', 'Checkbox'], ['chevron', 'Chevron Button'], ['icon-button', 'Icon-Button'], ['drawer', 'Drawer (drag)'],
        ['toggle', 'Toggle'], ['icon', 'Icon'], ['input', 'Input'],
        ['icon-text', 'Icon → Text'], ['link-icon', 'Link → Icon'], ['text-icon', 'Text → Icon'],
        ['avatar-text', 'Avatar → Text'], ['avatar-text-icon', 'Avatar → Text → Icon'],
        ['avatar-link', 'Avatar → Link'], ['avatar-link-icon', 'Avatar → Link → Icon'],
        ['status-circle-text', 'Status Circle → Text'], ['mark-text', 'Mark Horiz → Text'],
      ];
      const cellTypes = `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-m)">`
        + CELL_TYPES.map(([t, label]) =>
            `<div style="display:flex;align-items:center;gap:var(--gap-horiz-m)">`
            + `<span class="sb-caption" style="width:172px;flex-shrink:0;color:var(--text-secondary)">${label}</span>`
            + mkCell({ type: t })
            + `</div>`).join('')
        + `</div>`;
      const codeTypesHTML = `<!-- sbMkTableCell({ type, value }) — type:\n     text | link | date | status-text | checkbox | chevron | icon-button | drawer |\n     toggle | icon | input | icon-text | link-icon | text-icon | avatar-text |\n     avatar-text-icon | avatar-link | avatar-link-icon | status-circle-text | mark-text\n     Узкие: checkbox=40; chevron (Chevron Button)/icon-button/drawer=32. -->`;

      // Cell — States: Default / Hover / Selected.
      const cellStates = `<div class="sb-table" role="table">
        ${mkCell({ value: 'Default' })}
        ${mkCell({ value: 'Hover', state: 'is-hover' })}
        ${mkCell({ value: 'Selected', state: 'is-selected' })}
      </div>`;
      const codeStatesHTML = `<!-- sbMkTableCell({ value:'Hover', state:'is-hover' })\n     state: '' | 'is-hover' | 'is-selected' — цвета как у Context Cell:\n     hover → --surface-1; selected → --primary-hover + текст --primary -->`;

      // Full Table — Header Primary (чекбокс + 5 колонок) + 15 рядов, пагинация 2 стр (pageSize 10: 10+5).
      const fullCols = [
        { title: 'Terminal', type: 'text',        width: 160 },
        { title: 'IP Address', type: 'text',      width: 140 },
        { title: 'Band', type: 'text',            width: 90 },
        { title: 'Status', type: 'status-text',   width: 120 },
        { title: 'Signal', type: 'text',          width: 110 },
      ];
      const fullRows = [
        ['SAT-Alpha-01', '10.0.12.4', 'Ka', 'Online', '-68 dBm'],
        ['Orbital-7',    '10.0.12.9', 'Ku', 'Online', '-71 dBm'],
        ['Relay-North',  '10.0.13.2', 'Ka', 'Online', '-65 dBm'],
        ['Ground-RKV',   '10.0.13.7', 'C',  'Online', '-74 dBm'],
        ['Beacon-12',    '10.0.14.1', 'Ku', 'Online', '-69 dBm'],
        ['Polar-Uplink', '10.0.14.5', 'Ka', 'Online', '-73 dBm'],
        ['Mesh-Node-3',  '10.0.15.0', 'S',  'Online', '-66 dBm'],
        ['Array-West',   '10.0.15.6', 'Ku', 'Online', '-70 dBm'],
        ['Downlink-9',   '10.0.16.2', 'Ka', 'Online', '-72 dBm'],
        ['Sensor-Hub',   '10.0.16.8', 'C',  'Online', '-67 dBm'],
        ['Uplink-East',  '10.0.17.3', 'Ka', 'Online', '-70 dBm'],
        ['Node-Vega',    '10.0.17.9', 'Ku', 'Online', '-64 dBm'],
        ['Relay-South',  '10.0.18.4', 'C',  'Online', '-75 dBm'],
        ['Beacon-Alt',   '10.0.18.8', 'S',  'Online', '-69 dBm'],
        ['Array-Delta',  '10.0.19.2', 'Ka', 'Online', '-71 dBm'],
      ];
      const fullTable = mkTableFull({ columns: fullCols, rows: fullRows, toolbar: true, footer: true, pageSize: 10, rowMenu: true });
      const codeFullHTML = `<!-- sbMkTableFull({\n     columns:[ {title:'Terminal',type:'text',width:160}, …, {title:'Signal',type:'text',width:110} ],\n     rows:[ ['SAT-Alpha-01','10.0.12.4','Ka','Online','-68 dBm'], … ×15 ],\n     toolbar:true, footer:true, pageSize:10, rowMenu:true\n}) — pageSize:10 → 2 страницы (10+5); высота фиксирована, хвост-пустота --background; Footer = «Rows: X of N» (слева, → Selected при выборе) + Pagination (справа) -->`;

      const pageHTML = `<div class="page fade-in">
        <h1 class="page-title sb-h4">Table</h1>
        <div class="page-desc sb-body-l">${sbT(
          'A composable table for structured terminal and device data. It is built from parts: two header types (Primary, Secondary), a body cell with all content types and states, and the assembled Full Table with a tool bar, a footer and working pagination. Example: a fleet table of terminals.',
          'Композируемая таблица для структурных данных терминалов и устройств. Строится по частям: два типа хедера (Primary, Secondary), body-ячейка со всеми типами контента и состояниями, и собранная Full Table с тул-баром, футером и рабочей пагинацией. Пример: таблица флота терминалов.'
        )}</div>
        <div class="comp-section" id="sec-header-primary">
          <h2 class="comp-title sb-title-l">Header Primary</h2>
          <div class="comp-desc sb-body-m">${sbT(
            'The main header: a checkbox cell plus caption cells with sorting. Example: the header of a selectable fleet table. Minimum 2 cells.',
            'Основной хедер: ячейка-чекбокс и caption-ячейки с сортировкой. Пример: хедер таблицы флота с выбором рядов. Минимум 2 ячейки.'
          ) + sbDocNote('Tech Info', sbT(
            '<b>Cells:</b>'
            + '<ul><li>Checkbox cell: 40×40;</li><li>Text cells: min 80, CAPTION 12/500 --text-secondary uppercase, sort icon 24.</li></ul>'
            + '<b>Borders:</b>'
            + '<ul><li>Top corners rounded;</li><li>Border-bottom: --border;</li><li>A 2px vertical separator inside cells at the seams.</li></ul>',
            '<b>Ячейки:</b>'
            + '<ul><li>Ячейка-чекбокс: 40×40;</li><li>Текстовые ячейки: min 80, CAPTION 12/500 --text-secondary uppercase, sort-иконка 24.</li></ul>'
            + '<b>Границы:</b>'
            + '<ul><li>Верхние углы скруглены;</li><li>Border-bottom: --border;</li><li>На стыках вертикальный separator 2px внутри ячейки.</li></ul>'
          ))}</div>
          ${exampleBox(stage(header), codeHTML, COMP_CSS.table, { col: true })}
        </div>
        <div class="comp-section" id="sec-header-secondary">
          <h2 class="comp-title sb-title-l">Header Secondary</h2>
          <div class="comp-desc sb-body-m">${sbT(
            'A lighter header without sorting. Cells carry an optional icon slot on the left or right — an antenna status from Status, or any icon. In the demo, only the first cell has an antenna. Example: a sub-table inside a device card.',
            'Облегчённый хедер без сортировки. Ячейки несут опциональный иконка-слот слева или справа — антенна-статус из Status или любая иконка. В демо антенна только на первой ячейке. Пример: под-таблица внутри карточки устройства.'
          ) + sbDocNote('Tech Info', sbT(
            '<b>Typography:</b>'
            + '<ul><li>Cells: Title M 16/600 --text-tertiary, Title Case.</li></ul>'
            + '<b>Geometry:</b>'
            + '<ul><li>Min-width: 40;</li><li>Padding: 8/8;</li><li>Gap: 8;</li><li>Border-bottom: --border;</li><li>A vertical separator at the seams.</li></ul>',
            '<b>Типографика:</b>'
            + '<ul><li>Ячейки: Title M 16/600 --text-tertiary, Title Case.</li></ul>'
            + '<b>Геометрия:</b>'
            + '<ul><li>Min-width: 40;</li><li>Padding: 8/8;</li><li>Gap: 8;</li><li>Border-bottom: --border;</li><li>На стыках вертикальный separator.</li></ul>'
          ))}</div>
          ${exampleBox(stage(headerSec), codeSecHTML, COMP_CSS.table, { col: true })}
        </div>
        <div class="comp-section" id="sec-cell-text">
          <h2 class="comp-title sb-title-l">${sbT('Cell — Text', 'Ячейка — текст')}</h2>
          <div class="comp-desc sb-body-m">${sbT(
            'The base body cell (40px). The Text content truncates with an ellipsis on overflow.',
            'Базовая body-ячейка (40px). Контент Text при переполнении обрезается многоточием.'
          ) + sbDocNote('Tech Info', sbT(
            '<b>Geometry:</b>'
            + '<ul><li>Flex, space-between;</li><li>Width: 200 (min 80);</li><li>Padding: 8/0/8/8;</li><li>Border-bottom: --border-soft.</li></ul>'
            + '<b>Typography:</b>'
            + '<ul><li>Text: Title S (14/600 --text-tertiary).</li></ul>',
            '<b>Геометрия:</b>'
            + '<ul><li>Flex, space-between;</li><li>Ширина: 200 (min 80);</li><li>Padding: 8/0/8/8;</li><li>Border-bottom: --border-soft.</li></ul>'
            + '<b>Типографика:</b>'
            + '<ul><li>Text: Title S (14/600 --text-tertiary).</li></ul>'
          ))}</div>
          ${exampleBox(stage(cellText), codeCellHTML, COMP_CSS.table, { col: true })}
        </div>
        <div class="comp-section" id="sec-cell-content">
          <h2 class="comp-title sb-title-l">${sbT('Cell — Content Types', 'Ячейка — типы контента')}</h2>
          <div class="comp-desc sb-body-m">${sbT(
            'Content types on a slot system. The left slot is the leading group: an avatar, an icon or a status, plus text or a link. The right slot is trailing: an icon or an icon button. Narrow control cells are centered. Everything reuses DS components: Checkbox, Toggle, Input, Status, Mark, Avatar, Link, Button, Chevron.',
            'Типы контента на слотовой системе. Левый слот — ведущая группа: аватар, иконка или статус, плюс текст или ссылка. Правый слот — трейлинг: иконка или icon-кнопка. Узкие control-ячейки центрируются. Всё переиспользует DS-компоненты: Checkbox, Toggle, Input, Status, Mark, Avatar, Link, Button, Chevron.'
          ) + sbDocNote('Tech Info', sbT(
            '<b>Layout:</b>'
            + '<ul><li>Slots split by space-between;</li><li>Gap and padding: 8.</li></ul>'
            + '<b>Control cell widths:</b>'
            + '<ul><li>Checkbox — 40px;</li><li>Chevron Button (.sb-chevron, down) / Icon-Button / Drawer (drag handle, end of row) — 32px;</li><li>Toggle — by the toggle.</li></ul>'
            + '<b>Typography:</b>'
            + '<ul><li>Date — CAPTION, format DD.MM.YYYY;</li><li>Link — Link S.</li></ul>',
            '<b>Layout:</b>'
            + '<ul><li>Слоты разводятся space-between;</li><li>Gap и padding: 8.</li></ul>'
            + '<b>Ширины control-ячеек:</b>'
            + '<ul><li>Checkbox — 40px;</li><li>Chevron Button (.sb-chevron, вниз) / Icon-Button / Drawer (drag-handle, конец ряда) — 32px;</li><li>Toggle — по тоглу.</li></ul>'
            + '<b>Типографика:</b>'
            + '<ul><li>Date — CAPTION, формат DD.MM.YYYY;</li><li>Link — Link S.</li></ul>'
          ))}</div>
          ${exampleBox(stage(cellTypes), codeTypesHTML, COMP_CSS.table, { col: true })}
        </div>
        <div class="comp-section" id="sec-cell-states">
          <h2 class="comp-title sb-title-l">${sbT('Cell — States', 'Ячейка — состояния')}</h2>
          <div class="comp-desc sb-body-m">${sbT(
            'Cell states use the same colors as Context Cell. Hover — background --surface-1. Selected — background --primary-hover, text --primary. Hover does not apply on top of Selected. Cell classes: <code>is-hover</code> / <code>is-selected</code>.',
            'Состояния ячейки — цвета как у Context Cell. Hover — фон --surface-1. Selected — фон --primary-hover, текст --primary. Hover не применяется поверх Selected. Классы на ячейке: <code>is-hover</code> / <code>is-selected</code>.'
          )}</div>
          ${exampleBox(stage(cellStates), codeStatesHTML, COMP_CSS.table, { col: true })}
        </div>
        <div class="comp-section" id="sec-full-table">
          <h2 class="comp-title sb-title-l">${sbT('Full Table', 'Полная таблица')}</h2>
          <div class="comp-desc sb-body-m">${sbT(
            'The assembled table: Header Primary (a checkbox and 5 columns), 15 rows, a <b>Table Tool Bar</b> and a <b>Table Footer</b>. Pagination works live — 2 pages. Sorting is clickable. The checkbox covers select-all and row selection. When rows are selected, a compact <b>floating island</b> (Download / Apply / Delete) appears above the footer, and the footer counter switches to Selected: N. Each row ends with a kebab (⋯) that opens a context menu (Copy / Rename / Download / Delete). Select a few rows with the checkboxes to see the island and the counters react.',
            'Собранная таблица: Header Primary (чекбокс и 5 колонок), 15 рядов, <b>Table Tool Bar</b> и <b>Table Footer</b>. Пагинация рабочая — 2 страницы. Сортировка кликабельна. Чекбокс покрывает select-all и выбор ряда. При выборе рядов над футером всплывает компактный <b>floating-островок</b> (Download / Apply / Delete), а счётчик футера меняется на Selected: N. В конце каждого ряда — kebab (⋯), открывающий контекст-меню (Copy / Rename / Download / Delete). Выделите несколько рядов чекбоксами, чтобы увидеть, как оживают островок и счётчики.'
          ) + sbDocNote('Tech Info', sbT(
            '<b>Layout:</b>'
            + '<ul><li>pageSize 10 → 2 pages (10+5);</li><li>The table height is fixed by the layout and does not jump; the tail emptiness on page 2 is --background;</li><li>Columns align by explicit widths.</li></ul>'
            + '<b>Island:</b>'
            + '<ul><li>Secondary S buttons, Shadow-S, radius 8;</li><li>8px above the footer; it does not change the table height.</li></ul>'
            + '<b>Footer:</b>'
            + '<ul><li>Rows: X of N on the left (updates on page change);</li><li>Pagination on the right.</li></ul>'
            + '<b>Menu:</b>'
            + '<ul><li>The last item (Delete) is red.</li></ul>',
            '<b>Layout:</b>'
            + '<ul><li>pageSize 10 → 2 страницы (10+5);</li><li>Высота таблицы фиксирована по лейауту и не прыгает; хвост-пустота на 2-й странице — фон --background;</li><li>Колонки выровнены по явной ширине.</li></ul>'
            + '<b>Островок:</b>'
            + '<ul><li>Кнопки Secondary S, Shadow-S, radius 8;</li><li>8px над футером; высоту таблицы не меняет.</li></ul>'
            + '<b>Футер:</b>'
            + '<ul><li>Слева Rows: X of N (обновляется при смене страницы);</li><li>Справа Pagination.</li></ul>'
            + '<b>Меню:</b>'
            + '<ul><li>Последний пункт (Delete) — красный.</li></ul>'
          ))}</div>
          ${exampleBox(stage(fullTable), codeFullHTML, COMP_CSS.table, { col: true })}
        </div>
      </div>`;

      // Sticky ToC — как в core.renderComponentPage: .page-shell + .page-toc,
      // якоря = id секций выше, scrollspy (IntersectionObserver) в init.js.
      const tocHTML = (typeof sbMkToc === 'function') ? sbMkToc([
        { id: 'sec-header-primary',   label: 'Header Primary' },
        { id: 'sec-header-secondary', label: 'Header Secondary' },
        { id: 'sec-cell-text',        label: sbT('Cell — Text', 'Ячейка — текст') },
        { id: 'sec-cell-content',     label: sbT('Cell — Content Types', 'Ячейка — типы контента') },
        { id: 'sec-cell-states',      label: sbT('Cell — States', 'Ячейка — состояния') },
        { id: 'sec-full-table',       label: sbT('Full Table', 'Полная таблица') },
      ]) : '';
      return tocHTML
        ? `<div class="page-shell">${pageHTML}<aside class="page-toc">${tocHTML}</aside></div>`
        : pageHTML;
    },
  });
})();
