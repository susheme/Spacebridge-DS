// ═══════════════════════════════════════════════════════════════════════════
//  LIST
//  CSS в css/components/list.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.list = `.sb-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: var(--list-cell-min-width-standard);
  max-width: var(--list-max-width-cell);
}
.sb-list-cell {
  display: flex;
  align-items: center;
  gap: var(--gap-vert-s);
  width: 100%;
  min-width: var(--list-cell-min-width-standard);
  max-width: var(--list-max-width-cell);
  height: var(--list-min-height-cell);
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  background: var(--surface-1);
}
.sb-list-cell.single { border-radius: var(--radius-8); }
.sb-list-cell.top    { border-radius: var(--radius-8) var(--radius-8) var(--radius-0) var(--radius-0); }
.sb-list-cell.inside { border-radius: var(--radius-0); }
.sb-list-cell.bottom { border-radius: var(--radius-0) var(--radius-0) var(--radius-8) var(--radius-8); }
.sb-list-cell-label {
  flex: 1;
  min-width: 0;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sb-profile-cell {
  display: flex;
  align-items: center;
  gap: var(--gap-vert-m);
  width: 100%;
  min-width: var(--list-cell-min-width-standard);
  max-width: var(--list-max-width-cell);
  height: var(--list-min-height-cell);
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  background: var(--background);
  border-bottom: var(--border-width-1) solid var(--border-soft);
}
.sb-profile-cell-left {
  display: flex; align-items: center; gap: var(--gap-vert-s);
  flex: 1; min-width: 0;
}
.sb-profile-cell-text {
  display: flex; flex-direction: column;
  justify-content: center; align-items: flex-start;
  gap: var(--gap-horiz-xs);
  flex: 1; min-width: 0;
}
.sb-profile-cell-text .sb-title-s,
.sb-profile-cell-text .sb-sub {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
}
.sb-profile-cell-text .sb-title-s { color: var(--text-tertiary); }
.sb-profile-cell-text .sb-sub     { color: var(--text-secondary); }
.sb-profile-cell-right {
  display: flex; justify-content: flex-end; align-items: center;
  gap: var(--gap-vert-s); flex-shrink: 0;
  color: var(--border);
}
.sb-profile-cell:hover,
.sb-profile-cell.is-hover { background: var(--surface-1); }
.sb-profile-cell.is-disabled { cursor: not-allowed; pointer-events: none; }
.sb-profile-cell.is-disabled > * { opacity: 0.5; }
.sb-info-cell {
  position: relative;
  display: flex; align-items: center; gap: var(--gap-vert-m);
  width: 100%; min-width: var(--list-cell-min-width-standard);
  max-width: var(--list-max-width-cell);
  height: var(--list-min-height-cell);
  padding: var(--pad-vert-4) var(--pad-horiz-8);
  background: var(--background);
  cursor: pointer; user-select: none;
}
.sb-info-cell-text {
  display: flex; flex-direction: column;
  justify-content: center; align-items: flex-start;
  gap: var(--gap-horiz-xs); flex: 1; min-width: 0;
}
.sb-info-cell-title {
  color: var(--text-tertiary); width: 100%;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;
  overflow: hidden; text-overflow: ellipsis;
}
.sb-info-cell-sub { color: var(--text-secondary); }
.sb-info-cell:hover,
.sb-info-cell.is-hover { background: var(--surface-1); }
.sb-info-cell.is-selected {
  background: var(--primary-hover);
  border-bottom: var(--border-width-1) solid var(--primary-hover);
}
.sb-info-cell.is-disabled { cursor: not-allowed; pointer-events: none; }
.sb-info-cell.is-disabled > * { opacity: 0.5; }
.sb-info-cell.has-indicator { gap: var(--gap-vert-s); }
.sb-info-cell.has-mark .sb-mark {
  position: absolute;
  top: var(--border-width-1); bottom: var(--border-width-1); left: var(--gap-horiz-0);
  width: var(--border-width-2); height: auto;
}`;

window.COMP_CSS.propertyList = `.sb-prop-cell {
  display: flex;
  align-items: center;
  gap: var(--gap-vert-s);
  min-width: var(--list-cell-min-width-standard);
  max-width: var(--list-max-width-cell);
  /* Высота ФИКСИРОВАННАЯ — ряд всегда 40, чем бы ни набили слоты. Бейдж 28
     и иконка 24 переполняют content-box (40 − 16 паддингов − 1 бордер = 23),
     но лежат внутри ячейки и не клипаются: content-box невидим. Тот же
     случай, что аватар 32 в ячейке Profile из List. */
  height: var(--list-min-height-cell);
  /* Оси Figma-экспорта развёрнуты в наши токены: 8 по вертикали, 0 по
     горизонтали (в Figma эта переменная названа pad-horiz-8, но стоит она
     в вертикальном поле — см. спеку). */
  padding: var(--pad-vert-8) var(--pad-horiz-0);
  border-bottom: var(--border-width-1) solid var(--border-soft);
  background: var(--background);
  box-sizing: border-box;
}
/* Head — одиночная ячейка вне списка: тот же контракт слотов, но линия
   контрастнее, чтобы самостоятельный элемент не читался обрывком списка. */
.sb-prop-cell.head { border-bottom-color: var(--border); }

/* Левый слот: лейбл забирает всё свободное место и жмётся с многоточием —
   значение важнее, режется всегда подпись. min-width:0 обязателен, без него
   ellipsis во вложенном флексе не срабатывает вообще. */
.sb-prop-cell-label {
  display: flex;
  align-items: center;
  gap: var(--gap-vert-s);
  flex: 1 1 auto;
  min-width: 0;
  color: var(--text-tertiary);
}
.sb-prop-cell-label .sb-icon-wrap { flex-shrink: 0; }
.sb-prop-cell-label-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Правый слот: значение не режется и не переносится — за ним человек и
   пришёл. flex-shrink: 0 — иначе слот ужимается, а при nowrap текст без
   многоточия просто вылезает за край. Место уступает лейбл, он и жмётся. */
.sb-prop-cell-value {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--gap-horiz-xs);
  flex: 0 0 auto;
  white-space: nowrap;
  color: var(--text-secondary);
}
/* Цвет значения переопределяется модификатором — инлайн-стили запрещены. */
.sb-prop-cell-value.pv-primary { color: var(--primary); }
.sb-prop-cell-value.pv-success { color: var(--success); }
.sb-prop-cell-value.pv-error   { color: var(--error); }
.sb-prop-cell-value.pv-alert   { color: var(--alert); }
.sb-prop-cell-value.pv-info    { color: var(--info); }
.sb-prop-cell-value.pv-text    { color: var(--text-tertiary); }

/* Типографика обоих слотов — Title M 16/600 по спеке. Line-height берём
   body, а НЕ --title-line-height-s: у Title M в Figma своего line-height нет,
   а S даёт 12px при шрифте 16 — на лейбле с overflow:hidden это срезает
   хвосты у/g/p/q. Одинаковый line-height держит слоты на общей базовой линии. */
.sb-prop-cell-label-text,
.sb-prop-cell-value {
  font-size: var(--title-font-size-m);
  font-weight: var(--font-weight-semibold);
  line-height: var(--body-line-height);
  letter-spacing: var(--letter-spacing);
  font-variant-numeric: lining-nums tabular-nums;
}

/* Список — колонка ячеек. Последней разделитель не нужен: его роль играет
   край карточки. Красим в transparent, а не снимаем border — иначе
   последняя ячейка стала бы на 1px ниже остальных. */
.sb-prop-list {
  display: flex;
  flex-direction: column;
  min-width: var(--list-cell-min-width-standard);
  max-width: var(--list-max-width-cell);
}
.sb-prop-list > .sb-prop-cell:last-child { border-bottom-color: transparent; }`;

// Single-select click handler for Info cells — removes is-selected from sibling
// cells in the same parent, sets it on the clicked cell.
window.sbSelectInfoCell = function(cell) {
  if (!cell) return;
  const parent = cell.parentElement;
  if (parent) {
    parent.querySelectorAll(':scope > .sb-info-cell.is-selected').forEach(c => {
      c.classList.remove('is-selected');
    });
  }
  cell.classList.add('is-selected');
};

// --- LIST ---
(() => {
  function mkToggle(opts = {}) {
    const { on, disabled } = opts;
    return sbMkToggle({ on, disabled });
  }

  function mkControlCell(pos, label, toggleOpts = {}) {
    return `<div class="sb-list-cell ${pos}">
      <span class="sb-list-cell-label sb-title-m">${label}</span>
      ${mkToggle(toggleOpts)}
    </div>`;
  }

  function mkInfoCell(opts = {}) {
    const {
      title = 'NMS: "Witness Terminal Name"',
      subtitle = '2025-03-01|08:12:21',
      state,       // undefined | 'hover' | 'selected' | 'disabled'
      indicator,   // { status: 'online'|'offline'|'error'|'warning'|'maintenance'|'connecting'|'info', pulse?: bool } | undefined
      mark,        // { status: 'success'|'error'|'warning'|'alert'|'info'|'neutral' } | undefined
      selectable = true, // false — статичная ячейка без select-поведения (реюз вне List: Toast details и т.п.)
    } = opts;
    const stateCls =
      state === 'hover'    ? ' is-hover'    :
      state === 'selected' ? ' is-selected' :
      state === 'disabled' ? ' is-disabled' : '';
    const modCls = (indicator ? ' has-indicator' : '') + (mark ? ' has-mark' : '');
    const indicatorEl = indicator
      ? `<span class="sb-status-dot ${indicator.status || 'online'}${indicator.pulse ? ' pulse' : ''}"></span>`
      : '';
    const markEl = mark
      ? `<span class="sb-mark ${mark.status || 'info'}"></span>`
      : '';
    return `<div class="sb-info-cell${modCls}${stateCls}"${selectable ? ' onclick="sbSelectInfoCell(this)"' : ''}>
      ${markEl}${indicatorEl}
      <div class="sb-info-cell-text">
        <span class="sb-title-s sb-fw-regular sb-info-cell-title">${title}</span>
        <span class="sb-caption sb-info-cell-sub">${subtitle}</span>
      </div>
    </div>`;
  }
  // Экспорт для реюза вне List (Toast Collapsable details). Прецедент —
  // sbAntenna из status.js для Table.
  window.sbMkInfoCell = mkInfoCell;

  function mkProfileCell(opts = {}) {
    const {
      avatarType = 'user',      // 'user' | 'image' | 'company' | 'initials'
      initials,
      title = 'Jean Dubois',
      subtitle,
      right = '',               // HTML for right side
      state,                    // undefined | 'hover' | 'disabled'
    } = opts;
    const avatar = mkAv(avatarType, {}, initials);
    const subEl = subtitle ? `<span class="sb-sub">${subtitle}</span>` : '';
    const stateCls = state === 'hover' ? ' is-hover' : state === 'disabled' ? ' is-disabled' : '';
    return `<div class="sb-profile-cell${stateCls}">
      <div class="sb-profile-cell-left">
        ${avatar}
        <div class="sb-profile-cell-text">
          <span class="sb-title-s">${title}</span>
          ${subEl}
        </div>
      </div>
      ${right ? `<div class="sb-profile-cell-right">${right}</div>` : ''}
    </div>`;
  }

  function mkControlList(cells) {
    const inner = cells.map((c, i) => {
      let pos;
      if (cells.length === 1)             pos = 'single';
      else if (i === 0)                   pos = 'top';
      else if (i === cells.length - 1)    pos = 'bottom';
      else                                pos = 'inside';
      return mkControlCell(pos, c.label, { on: c.on, disabled: c.disabled });
    }).join('');
    return `<div class="sb-list">${inner}</div>`;
  }

  function mkCellWithTypeTag(pos, typeLabel, cellLabel, toggleOpts) {
    return `${sbMkFlex({ dir: 'col', gap: 'xs', full: true, maxWidth: '360px', content: `<span class="sb-caption" style="color:var(--text-tertiary)">${typeLabel}</span>
      ${mkControlCell(pos, cellLabel, toggleOpts)}` })}`;
  }

  function buildProfileRight(type) {
    if (type === 'icon')   return sbIcon('arrow-right-s-line', 'L');
    if (type === 'icons2') return sbIcon('mail-line', 'L') + sbIcon('phone-line', 'L');
    if (type === 'button') return sbMkButton({ icon: 'add-line', iconSize: 'S', size: 's' });
    return '';
  }

  // Лейблы Control-ячеек: те же настройки терминала, что и в секции ниже.
  const CONTROL_ITEMS = [
    'DC Power', 'Low Power Mode', 'RL RF Spectral Inversion',
    'ODU Present Flag', 'BUC 10 MHz Reference',
  ];

  const PROFILE_PEOPLE = [
    { avatarType: 'image',    title: 'Jean Dubois',    subtitle: 'Administrator' },
    { avatarType: 'initials', initials: 'AM', title: 'Anna Müller', subtitle: 'Network Engineer' },
    { avatarType: 'company',  title: 'Spacebridge HQ', subtitle: 'Paris, France' },
    { avatarType: 'user',     title: 'Unnamed User' },
  ];

  function mkProfileList(rightType) {
    return PROFILE_PEOPLE.map(p => mkProfileCell({
      ...p, right: buildProfileRight(rightType),
    })).join('');
  }

  // ═══ PROPERTY LIST ═══════════════════════════════════════════════════
  // Второе семейство ячеек того же компонента: «подпись → значение».
  // Делит с Standard List токены группы List и страницу документации.

  /**
   * sbMkPropertyCell({ label, icon, indicator, value, valueColor, head, cls })
   *   label      — подпись левого слота (жмётся с многоточием)
   *   icon       — имя из ICON_PATHS перед подписью (опционально)
   *   indicator  — точка статуса перед иконкой: { status, pulse? }; статусы —
   *                online / offline / error / warning / maintenance /
   *                connecting / info (фабрика sbMkStatusDot из Status)
   *   value      — правый слот: строка ИЛИ готовая разметка любого
   *                DS-компонента (sbMkBadgeStatus, sbMkButton, sbIcon…)
   *   valueColor — 'primary' | 'success' | 'error' | 'alert' | 'info' |
   *                'text'; по умолчанию --text-secondary
   *   head       — одиночная ячейка вне списка: контрастная линия снизу
   *   cls        — доп. классы на корне
   */
  function mkPropertyCell(opts) {
    const { label = '', icon, indicator, value = '', valueColor, head = false, cls = '' } = opts || {};
    // Индикатор идёт САМЫМ левым — как в Info Cell из List, чтобы колонка
    // точек читалась вертикально и не прыгала от наличия иконки.
    const dotHtml = indicator
      ? sbMkStatusDot({ status: indicator.status, pulse: indicator.pulse })
      : '';
    const iconHtml = icon ? sbIcon(icon, 'L') : '';
    const valueCls = 'sb-prop-cell-value' + (valueColor ? ' pv-' + valueColor : '');
    return `<div class="sb-prop-cell${head ? ' head' : ''}${cls ? ' ' + cls : ''}">
      <span class="sb-prop-cell-label">${dotHtml}${iconHtml}<span class="sb-prop-cell-label-text">${label}</span></span>
      <span class="${valueCls}">${value}</span>
    </div>`;
  }
  window.sbMkPropertyCell = mkPropertyCell;

  /**
   * sbMkPropertyList({ items, cls }) — колонка ячеек.
   *   items — массив opts для sbMkPropertyCell
   * Две колонки рядом — это два списка внутри Grid System (sbMkFlex),
   * собственной колоночной раскладки у компонента нет намеренно.
   */
  function mkPropertyList(opts) {
    const { items = [], cls = '' } = opts || {};
    return `<div class="sb-prop-list${cls ? ' ' + cls : ''}">${items.map(it => mkPropertyCell(it)).join('')}</div>`;
  }
  window.sbMkPropertyList = mkPropertyList;

  // ── Demo-контент ──────────────────────────────────────────────────────
  // Иконка во всех строках одна: слот демонстрирует САМ СЕБЯ, а разнобой
  // читался как значащий — будто иконка кодирует тип параметра.
  const PROP_ICON = 'radar-line';
  const PROP_DEMO = [
    { label: 'RL Status',          value: 'Not Acquired' },
    { label: 'UT Power Level',     value: '-99.99 dBm' },
    { label: 'Symbol Rate',        value: '0 ksymb/s' },
    // Title Case не только по правилу DS: строчное «undefined» тест
    // целостности разметки принимает за протёкший в вывод мусор.
    { label: 'MODCOD',             value: 'Undefined Waveform' },
    { label: 'Max Tx Power Level', value: '-14.5 dBm' },
    { label: 'Required Es/No',     value: '-99.99 dB' },
  ];
  const PROP_LONG_LABEL = 'Required Es/No At The Receiver Input Under Clear Sky Conditions';

  // Значение правого слота по типу. Только фабрики DS — своей разметки
  // чужих компонентов здесь нет.
  // Ячейки Property List под состояние плейграунда. Общая для превью и
  // панели кода: копируемый пример обязан совпадать с картинкой.
  function propItems(s, rows) {
    return rows.map((d, i) => ({
      icon: s.propIcon ? PROP_ICON : undefined,
      indicator: s.propIndicator ? { status: s.propIndicator, pulse: s.propPulse } : undefined,
      label: s.propLong && i === rows.length - 1 ? PROP_LONG_LABEL : d.label,
      value: propDemoValue(s.propValueType, d.value),
      valueColor: s.propValueColor || undefined,
    }));
  }

  function propDemoValue(type, text) {
    if (type === 'badge')  return sbMkBadgeStatus({ label: 'Not Acquired', color: 'grey', mini: true });
    if (type === 'button') return sbMkButton({ icon: 'more-2-line', iconSize: 'S', size: 's', attrs: ' aria-label="Actions"' });
    if (type === 'icon')   return text + sbIcon('lock-2-line', 'L');
    return text;
  }

  sbRegister({
    name: 'list',
    title: 'List',
    description: sbT(
      'Lists built from 40px cells. Two families. Standard List holds three cell types: Profile for people and organizations, Info for notifications and events, Control for a title with a toggle. Property List holds label → value rows for cards. Both families share the List size tokens and this page.',
      'Списки из ячеек высотой 40px. Два семейства. Standard List содержит три типа ячеек: Profile — люди и организации, Info — уведомления и события, Control — заголовок с переключателем. Property List содержит строки «подпись → значение» для карточек. Оба семейства используют размерные токены группы List и эту страницу.'
    ),
    // Подмаршрут сайдбара: #list/standard-list и #list/property-list. Ребёнок
    // NAV обязан открывать своё семейство, а не просто вести на страницу.
    onSubRoute(sub) {
      const family = sub === 'property-list' ? 'property' : 'standard';
      if (SB_PG._states && SB_PG._states.list) SB_PG.set('list', 'family', family);
    },
    playground: {
      title: 'List Cell Playground',
      minPreview: 360,  // list cell с аватаром + субтитлом — нужно ~360 для нормального layout'а
      state: {
        family: 'standard',              // 'standard' | 'property' — вкладка Segment Menu
        cellType: 'profile',
        // Profile-specific
        avatarType: 'image',
        rightContent: 'icon',
        showSubtitle: true,
        // Info-specific
        infoSubtype: 'default',          // 'default' | 'indicator' | 'mark'
        indicatorStatus: 'online',
        indicatorPulse: false,
        markStatus: 'error',
        // Control-specific
        controlPos: 'single',            // 'single' | 'top' | 'inside' | 'bottom'
        controlOn: true,
        controlList: false,              // показать всю стопку вместо одной ячейки
        // Property List. Префикс prop* — ключи двух семейств лежат в одном
        // состоянии, и без него propIndicator читался бы как indicatorStatus
        // из Info Cell.
        propIndicator: '',               // '' | статус точки
        propPulse: false,
        propIcon: true,
        propValueType: 'text',
        propValueColor: '',
        propLong: false,
        propList: true,
        propHead: false,
        // Shared state
        cellState: 'default',
      },
      controls(pg) {
        // Segment Menu переключает семейство. Контролы обоих семейств живут в
        // одном состоянии, а syncControls показывает группы активного: держать
        // их в одном селекте с типами ячеек значило бы уравнять семейство и
        // тип ячейки, а это разные уровни.
        // SB_PG.render перерисовывает только превью, поэтому подсветка
        // сегмента, которую ставит сам компонент, переживает переключение.
        const tabs = sbMkSegmentMenu(['Standard List', 'Property List'], {
          selectedIndex: SB_PG._states.list.family === 'property' ? 1 : 0,
          onSelect: "SB_PG.set('list', 'family', this.dataset.index === '1' ? 'property' : 'standard')",
        });
        return `<div class="pg-list-family" style="grid-column:1/-1">${tabs}</div>
        ${sbPgGroup('Cell', `
            ${pg.select('cellType', [
              { value: 'profile', label: 'Profile' },
              { value: 'info',    label: 'Info' },
              { value: 'control', label: 'Control' },
            ], { label: 'Type' })}
            ${pg.select('cellState', [
              { value: 'default',  label: 'Default' },
              { value: 'hover',    label: 'Hover' },
              { value: 'selected', label: 'Selected (Info only)' },
              { value: 'disabled', label: 'Disabled' },
            ], { label: 'State' })}
          `, { fullRow: true, attrs: 'data-pg-family="standard"' })}
        ${sbPgGroup('Profile Cell', `
            ${pg.select('avatarType', [
              { value: 'user',     label: 'User' },
              { value: 'initials', label: 'Initials' },
              { value: 'company',  label: 'Company' },
              { value: 'image',    label: 'Image' },
            ], { label: 'Avatar' })}
            ${pg.select('rightContent', [
              { value: 'none',   label: 'None' },
              { value: 'icon',   label: '1 Icon' },
              { value: 'icons2', label: '2 Icons' },
              { value: 'button', label: 'Icon Button' },
            ], { label: 'Right' })}
            <div class="pg-toggles">${pg.toggle('showSubtitle', 'Subtitle')}</div>
          `, { fullRow: true, attrs: 'data-pg-family="standard" data-pg-cell-type="profile"' })}
        ${sbPgGroup('Info Cell', `
            ${pg.select('infoSubtype', [
              { value: 'default',   label: 'Default' },
              { value: 'indicator', label: 'Status Indicator' },
              { value: 'mark',      label: 'Status Mark' },
            ], { label: 'Subtype' })}
            <div data-pg-info-subtype="indicator">
              ${pg.select('indicatorStatus', [
                { value: 'online',      label: 'Online (green)' },
                { value: 'error',       label: 'Error (red)' },
                { value: 'warning',     label: 'Warning (yellow)' },
                { value: 'maintenance', label: 'Maintenance (orange)' },
                { value: 'info',        label: 'Info (blue)' },
                { value: 'connecting',  label: 'Connecting (primary)' },
                { value: 'offline',     label: 'Offline (gray)' },
              ], { label: 'Indicator' })}
            </div>
            <!-- .pg-toggles — СОСЕД селекта, а не его сосед по обёртке: ряд на
                 всю ширину даёт правило .pg-group-body > .pg-toggles, и оно
                 ловит только ПРЯМЫХ детей грида. Внутри общей обёртки тогл
                 слипался с селектом в одну ячейку без гэпа. Оба элемента несут
                 один data-pg-info-subtype — syncControls гасит их вместе. -->
            <div class="pg-toggles" data-pg-info-subtype="indicator">${pg.toggle('indicatorPulse', 'Pulse')}</div>
            <div data-pg-info-subtype="mark">
              ${pg.select('markStatus', [
                { value: 'success', label: 'Success (green)' },
                { value: 'error',   label: 'Error (red)' },
                { value: 'warning', label: 'Warning (yellow)' },
                { value: 'alert',   label: 'Alert (orange)' },
                { value: 'info',    label: 'Info (blue)' },
                { value: 'neutral', label: 'Neutral (gray)' },
              ], { label: 'Mark' })}
            </div>
          `, { fullRow: true, attrs: 'data-pg-family="standard" data-pg-cell-type="info"' })}
        ${sbPgGroup('Control Cell', `
            <div data-pg-control-pos>
              ${pg.select('controlPos', [
                { value: 'single', label: 'Single' },
                { value: 'top',    label: 'Top' },
                { value: 'inside', label: 'Inside' },
                { value: 'bottom', label: 'Bottom' },
              ], { label: 'Position' })}
            </div>
            <div class="pg-toggles">
              ${pg.toggle('controlOn', 'On')}
              ${pg.toggle('controlList', 'List')}
            </div>
          `, { fullRow: true, attrs: 'data-pg-family="standard" data-pg-cell-type="control"' })}
        ${sbPgGroup('Left Slot', `
            ${pg.select('propIndicator', [
              { value: '',            label: 'None' },
              { value: 'online',      label: 'Online (green)' },
              { value: 'error',       label: 'Error (red)' },
              { value: 'warning',     label: 'Warning (yellow)' },
              { value: 'maintenance', label: 'Maintenance (orange)' },
              { value: 'info',        label: 'Info (blue)' },
              { value: 'connecting',  label: 'Connecting (primary)' },
              { value: 'offline',     label: 'Offline (gray)' },
            ], { label: 'Indicator' })}
            <div class="pg-toggles">
              ${pg.toggle('propIcon', 'Icon')}
              <span data-pg-needs-indicator>${pg.toggle('propPulse', 'Pulse')}</span>
            </div>
          `, { fullRow: true, attrs: 'data-pg-family="property"' })}
        ${sbPgGroup('Right Slot', `
            ${pg.select('propValueType', [
              { value: 'text',   label: 'Text' },
              { value: 'badge',  label: 'Badge-Status — Mini' },
              { value: 'button', label: 'Icon Button' },
              { value: 'icon',   label: 'Text + Icon' },
            ], { label: 'Value' })}
            ${pg.select('propValueColor', [
              { value: '',        label: 'Default' },
              { value: 'text',    label: 'Text' },
              { value: 'primary', label: 'Primary' },
              { value: 'success', label: 'Success' },
              { value: 'error',   label: 'Error' },
              { value: 'alert',   label: 'Alert' },
            ], { label: 'Color' })}
          `, { fullRow: true, attrs: 'data-pg-family="property"' })}
        ${sbPgGroup('Options', `
            <div class="pg-toggles">
              ${pg.toggle('propLong', 'Long')}
              ${pg.toggle('propList', 'List')}
              ${pg.toggle('propHead', 'Head')}
            </div>
          `, { fullRow: true, attrs: 'data-pg-family="property"' })}`;
      },
      syncControls(s, container) {
        // Семейство первично: сначала гасим группы неактивной вкладки, потом
        // внутри Standard List уточняем по типу ячейки. Порядок важен —
        // группы типов несут оба атрибута сразу.
        const std = s.family !== 'property';
        // Подсветку сегмента тоже держим здесь. Разметка контролов собирается
        // один раз, а семейство может смениться позже — из onSubRoute при
        // заходе по прямой ссылке #list/property-list. Красим через фабричный
        // sbSelectSegmentItem: он же двигает индикатор.
        const tabs = container.querySelectorAll('.pg-list-family .sb-segment-menu-item');
        const want = tabs[std ? 0 : 1];
        if (want && !want.classList.contains('selected')) sbSelectSegmentItem(want);
        container.querySelectorAll('[data-pg-family]').forEach(wrap => {
          const mine = wrap.getAttribute('data-pg-family') === (std ? 'standard' : 'property');
          wrap.style.display = mine ? '' : 'none';
        });
        if (std) {
          // Обёртки — pg-group'ы с рамкой, показываем обычным display
          // (НЕ 'contents': он растворяет группу, тайтл и body рассыпаются по гриду).
          container.querySelectorAll('[data-pg-cell-type]').forEach(wrap => {
            wrap.style.display = wrap.getAttribute('data-pg-cell-type') === s.cellType ? '' : 'none';
          });
          container.querySelectorAll('[data-pg-info-subtype]').forEach(wrap => {
            wrap.style.display = wrap.getAttribute('data-pg-info-subtype') === s.infoSubtype ? '' : 'none';
          });
          // В режиме List позицию считает mkControlList (single/top/inside/bottom
          // по индексу) — ручной селектор там ни на что не влияет, прячем.
          container.querySelectorAll('[data-pg-control-pos]').forEach(wrap => {
            wrap.style.display = s.controlList ? 'none' : '';
          });
        } else {
          // Pulse без индикатора ни на что не влияет — прячем, чтобы тогл не
          // выглядел сломанным.
          container.querySelectorAll('[data-pg-needs-indicator]').forEach(el => {
            el.style.display = s.propIndicator ? '' : 'none';
          });
        }
      },
      // Head — одиночная ячейка вне списка, поэтому со списком не сочетается.
      onControlChange(key, value, s) {
        if (key === 'propHead' && value) s.propList = false;
        if (key === 'propList' && value) s.propHead = false;
      },
      // Набор ячеек Property List под текущее состояние — общий для превью
      // и для панели кода, чтобы копируемый пример не расходился с картинкой.
      render(s) {
        if (s.family === 'property') {
          const items = propItems(s, PROP_DEMO);
          const content = s.propList
            ? mkPropertyList({ items })
            : mkPropertyCell(Object.assign({}, items[0], { head: s.propHead }));
          // Обёртка под max-width токена: без неё ячейка растянулась бы на всё
          // превью и трункейт подписи не показать.
          return `<div style="width:100%;max-width:352px;margin:0 auto">${content}</div>`;
        }
        if (s.cellType === 'control') {
          // У Control-ячейки нет hover/selected: единственное состояние —
          // выключенный toggle, его и берём из общего селектора состояний.
          const off = s.cellState === 'disabled';
          const body = s.controlList
            ? mkControlList(CONTROL_ITEMS.map(c => ({ label: c, on: s.controlOn, disabled: off })))
            : mkControlCell(s.controlPos, CONTROL_ITEMS[0], { on: s.controlOn, disabled: off });
          return `<div style="width:100%;max-width:360px">${body}</div>`;
        }
        if (s.cellType === 'info') {
          const indicator = s.infoSubtype === 'indicator'
            ? { status: s.indicatorStatus, pulse: s.indicatorPulse }
            : undefined;
          const mark = s.infoSubtype === 'mark'
            ? { status: s.markStatus }
            : undefined;
          return `<div style="width:100%;max-width:360px">${mkInfoCell({
            state: s.cellState === 'default' ? undefined : s.cellState,
            indicator,
            mark,
          })}</div>`;
        }
        // Profile — 'selected' is not applicable; treat as default
        const profileState = (s.cellState === 'default' || s.cellState === 'selected') ? undefined : s.cellState;
        return `<div style="width:100%;max-width:360px">${mkProfileCell({
          avatarType: s.avatarType,
          initials: s.avatarType === 'initials' ? 'AM' : undefined,
          title: s.avatarType === 'company' ? 'Spacebridge HQ' : 'Jean Dubois',
          subtitle: s.showSubtitle
            ? (s.avatarType === 'company' ? 'Paris, France' : 'Administrator')
            : undefined,
          right: buildProfileRight(s.rightContent),
          state: profileState,
        })}</div>`;
      },
      genCode(s) {
        if (s.family === 'property') {
          const items = propItems(s, PROP_DEMO.slice(0, 3));
          return {
            html: s.propList
              ? mkPropertyList({ items })
              : mkPropertyCell(Object.assign({}, items[0], { head: s.propHead })),
            // Точка и mini-бейдж живут в Status — без его стилей скопированный
            // пример отрисуется голым. COMP_CSS.status разбит по подключам.
            css: COMP_CSS.propertyList
              + (s.propIndicator ? '\n' + COMP_CSS.status.indicator
                                   + (s.propPulse ? '\n' + COMP_CSS.status.pulse : '') : '')
              + (s.propValueType === 'badge'
                  ? '\n' + COMP_CSS.status.badgeStatus + '\n' + COMP_CSS.status.badgeStatusMini
                  : ''),
          };
        }
        if (s.cellType === 'control') {
          const off = s.cellState === 'disabled';
          return {
            html: s.controlList
              ? mkControlList(CONTROL_ITEMS.map(c => ({ label: c, on: s.controlOn, disabled: off })))
              : mkControlCell(s.controlPos, CONTROL_ITEMS[0], { on: s.controlOn, disabled: off }),
            css: COMP_CSS.list + '\n' + COMP_CSS.toggles,
          };
        }
        if (s.cellType === 'info') {
          const stateCls =
            s.cellState === 'hover'    ? ' is-hover'    :
            s.cellState === 'selected' ? ' is-selected' :
            s.cellState === 'disabled' ? ' is-disabled' : '';
          const hasInd  = s.infoSubtype === 'indicator';
          const hasMark = s.infoSubtype === 'mark';
          const modCls = (hasInd ? ' has-indicator' : '') + (hasMark ? ' has-mark' : '');
          const dotLine = hasInd
            ? `\n  <span class="sb-status-dot ${s.indicatorStatus}${s.indicatorPulse ? ' pulse' : ''}"></span>`
            : '';
          const markLine = hasMark
            ? `\n  <span class="sb-mark ${s.markStatus}"></span>`
            : '';
          const html = `<div class="sb-info-cell${modCls}${stateCls}">${markLine}${dotLine}
  <div class="sb-info-cell-text">
    <span class="sb-title-s sb-fw-regular sb-info-cell-title">NMS: "Witness Terminal Name"</span>
    <span class="sb-caption sb-info-cell-sub">2025-03-01|08:12:21</span>
  </div>
</div>`;
          const css = (hasInd || hasMark)
            ? COMP_CSS.list + '\n' + COMP_CSS.status
            : COMP_CSS.list;
          return { html, css };
        }
        // Profile
        const isInitials = s.avatarType === 'initials';
        const isImage    = s.avatarType === 'image';
        const isCompany  = s.avatarType === 'company';
        const avatarInner =
          isInitials ? '<span class="sb-avatar-initials">AM</span>' :
          isImage    ? '<img class="sb-avatar-photo" src="./astronaut.png" alt="">' :
          isCompany  ? '<!-- building-2-line icon -->' :
                       '<!-- user-line icon -->';
        const title    = isCompany ? 'Spacebridge HQ' : 'Jean Dubois';
        const subtitle = isCompany ? 'Paris, France' : 'Administrator';
        const subLine  = s.showSubtitle ? `\n      <span class="sb-sub">${subtitle}</span>` : '';
        const rightComment =
          s.rightContent === 'icon'   ? '<!-- arrow-right-s-line -->' :
          s.rightContent === 'icons2' ? '<!-- mail-line --> <!-- phone-line -->' :
          s.rightContent === 'button' ? sbMkButton({ size: 's', iconOnly: true, content: '<!-- add-line S -->' }) :
                                        '';
        const rightBlock = rightComment
          ? `\n  <div class="sb-profile-cell-right">\n    ${rightComment}\n  </div>`
          : '';
        const profileStateCls =
          s.cellState === 'hover'    ? ' is-hover' :
          s.cellState === 'disabled' ? ' is-disabled' : '';
        const html = `<div class="sb-profile-cell${profileStateCls}">
  <div class="sb-profile-cell-left">
    <div class="sb-avatar"><div class="sb-avatar-circle">${avatarInner}</div></div>
    <div class="sb-profile-cell-text">
      <span class="sb-title-s">${title}</span>${subLine}
    </div>
  </div>${rightBlock}
</div>`;
        const css = COMP_CSS.list + '\n' + COMP_CSS.avatar
          + (s.rightContent === 'button' ? '\n' + COMP_CSS.buttons : '');
        return { html, css };
      },
    },
    sections: [
      {
        title: sbT('Standard List — Profile Cell', 'Standard List — ячейка Profile'),
        desc: sbT(
          'A cell for profile lists: people and organizations. On the left — an avatar and a title with an optional subtitle. On the right — one or two icons, or a small button. Below — three lists with different right content.',
          'Ячейка для списков профилей: люди и организации. Слева — аватар и заголовок с опциональным подзаголовком. Справа — одна-две иконки или маленькая кнопка. Ниже — три списка с разным правым контентом.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Geometry:</b>'
          + '<ul><li>Avatar: 32×32;</li><li>Hairline divider: border-bottom 1px --border-soft.</li></ul>'
          + '<b>States:</b>'
          + '<ul><li>Hover — background --surface-1;</li><li>Disabled — content opacity 0.5.</li></ul>',
          '<b>Геометрия:</b>'
          + '<ul><li>Аватар: 32×32;</li><li>Hairline-разделитель: border-bottom 1px --border-soft.</li></ul>'
          + '<b>Состояния:</b>'
          + '<ul><li>Hover — фон --surface-1;</li><li>Disabled — контент с opacity 0.5.</li></ul>'
        )),
        preview: `${sbMkFlex({ dir: 'col', gap: 'xl', full: true, maxWidth: '360px', content: `${sbMkFlex({ dir: 'col', gap: 'xs', content: `<span class="sb-caption" style="color:var(--text-tertiary)">1 Icon</span>
            <div>${mkProfileList('icon')}</div>` })}
          ${sbMkFlex({ dir: 'col', gap: 'xs', content: `<span class="sb-caption" style="color:var(--text-tertiary)">2 Icons</span>
            <div>${mkProfileList('icons2')}</div>` })}
          ${sbMkFlex({ dir: 'col', gap: 'xs', content: `<span class="sb-caption" style="color:var(--text-tertiary)">Icon Button</span>
            <div>${mkProfileList('button')}</div>` })}` })}`,
        html: `<!-- Profile cell: image avatar + title + subtitle + icon -->
<div class="sb-profile-cell">
  <div class="sb-profile-cell-left">
    <div class="sb-avatar"><div class="sb-avatar-circle"><img class="sb-avatar-photo" src="./astronaut.png" alt=""></div></div>
    <div class="sb-profile-cell-text">
      <span class="sb-title-s">Jean Dubois</span>
      <span class="sb-sub">Administrator</span>
    </div>
  </div>
  <div class="sb-profile-cell-right">
    <!-- arrow-right-s-line icon -->
  </div>
</div>

<!-- With 2 icons -->
<div class="sb-profile-cell">
  <div class="sb-profile-cell-left"> ... </div>
  <div class="sb-profile-cell-right">
    <!-- mail-line --> <!-- phone-line -->
  </div>
</div>

<!-- With small secondary icon button -->
<div class="sb-profile-cell">
  <div class="sb-profile-cell-left"> ... </div>
  <div class="sb-profile-cell-right">
    ${sbMkButton({ size: 's', iconOnly: true, content: '<!-- add-line S -->' })}
  </div>
</div>

<!-- Without subtitle -->
<div class="sb-profile-cell">
  <div class="sb-profile-cell-left">
    <div class="sb-avatar">...</div>
    <div class="sb-profile-cell-text">
      <span class="sb-title-s">Unnamed User</span>
    </div>
  </div>
  <div class="sb-profile-cell-right"> ... </div>
</div>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.avatar + '\n' + COMP_CSS.buttons,
      },
      {
        title: sbT('Standard List — Info Cell (Default)', 'Standard List — ячейка Info (Default)'),
        desc: sbT(
          'A cell for notification, event and alarm lists. A title, with a caption (date or time) under it. No dividers. States: Default, Hover, Selected (--primary-hover), Disabled (opacity 0.5).',
          'Ячейка для списков уведомлений, событий и алармов. Заголовок, под ним caption (дата или время). Без разделителей. Состояния: Default, Hover, Selected (--primary-hover), Disabled (opacity 0.5).'
        ),
        preview: `${sbMkFlex({ dir: 'col', gap: 'lg', full: true, maxWidth: '360px', content: `${['default', 'hover', 'selected', 'disabled'].map(st => `
            ${sbMkFlex({ dir: 'col', gap: 'xs', content: `<span class="sb-caption" style="color:var(--text-tertiary)">${st[0].toUpperCase() + st.slice(1)}</span>
              ${mkInfoCell({ state: st === 'default' ? undefined : st })}` })}
          `).join('')}` })}`,
        html: `<!-- Default -->
<div class="sb-info-cell">
  <div class="sb-info-cell-text">
    <span class="sb-title-s sb-fw-regular sb-info-cell-title">NMS: "Witness Terminal Name"</span>
    <span class="sb-caption sb-info-cell-sub">2025-03-01|08:12:21</span>
  </div>
</div>

<!-- Hover -->
<div class="sb-info-cell is-hover"> ... </div>

<!-- Selected -->
<div class="sb-info-cell is-selected"> ... </div>

<!-- Disabled -->
<div class="sb-info-cell is-disabled"> ... </div>`,
        css: COMP_CSS.list,
      },
      {
        title: sbT('Standard List — Info Cell (Status Indicator)', 'Standard List — ячейка Info (Status Indicator)'),
        desc: sbT(
          'The .has-indicator modifier adds a status dot on the left. All Status colors; the .pulse animation is optional. The gap tightens to 8px. A click selects a cell via .is-selected.',
          'Модификатор .has-indicator добавляет статус-точку слева. Все цвета из Status; анимация .pulse опциональна. Gap сужается до 8px. Клик выбирает ячейку через .is-selected.'
        ),
        preview: `<div style="width:100%;max-width:360px">
          ${mkInfoCell({ indicator: { status: 'online',      pulse: true } })}
          ${mkInfoCell({ indicator: { status: 'error',       pulse: true } })}
          ${mkInfoCell({ indicator: { status: 'warning' } })}
          ${mkInfoCell({ indicator: { status: 'maintenance' } })}
          ${mkInfoCell({ indicator: { status: 'info' } })}
          ${mkInfoCell({ indicator: { status: 'connecting' } })}
          ${mkInfoCell({ indicator: { status: 'online' } })}
          ${mkInfoCell({ indicator: { status: 'offline' } })}
        </div>`,
        html: `<!-- Default -->
<div class="sb-info-cell has-indicator">
  <span class="sb-status-dot online"></span>
  <div class="sb-info-cell-text">
    <span class="sb-title-s sb-fw-regular sb-info-cell-title">NMS: "Witness Terminal Name"</span>
    <span class="sb-caption sb-info-cell-sub">2025-03-01|08:12:21</span>
  </div>
</div>

<!-- With pulse animation -->
<div class="sb-info-cell has-indicator">
  <span class="sb-status-dot online pulse"></span>
  ...
</div>

<!-- Other statuses -->
<span class="sb-status-dot error"></span>
<span class="sb-status-dot warning"></span>
<span class="sb-status-dot maintenance"></span>
<span class="sb-status-dot info"></span>
<span class="sb-status-dot connecting"></span>
<span class="sb-status-dot offline"></span>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.status,
      },
      {
        title: sbT('Standard List — Info Cell (Status Mark)', 'Standard List — ячейка Info (Status Mark)'),
        desc: sbT(
          'The .has-mark modifier — a colored vertical stripe at the left edge. Colors from the ready-made .sb-mark: success, error, warning, alert, info, neutral.',
          'Модификатор .has-mark — цветная вертикальная полоска у левого края. Цвета из готового .sb-mark: success, error, warning, alert, info, neutral.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Geometry:</b>'
          + '<ul><li>Stripe: 2×38px;</li><li>Absolute, inset 1px top and bottom.</li></ul>'
          + '<b>Layout:</b>'
          + '<ul><li>The gap stays 16px — the stripe is out of the flex flow.</li></ul>',
          '<b>Геометрия:</b>'
          + '<ul><li>Полоска: 2×38px;</li><li>Absolute, отступ 1px сверху и снизу.</li></ul>'
          + '<b>Layout:</b>'
          + '<ul><li>Gap остаётся 16px — полоска вне flex-потока.</li></ul>'
        )),
        preview: `<div style="width:100%;max-width:360px">
          ${mkInfoCell({ mark: { status: 'error' } })}
          ${mkInfoCell({ mark: { status: 'warning' } })}
          ${mkInfoCell({ mark: { status: 'alert' } })}
          ${mkInfoCell({ mark: { status: 'success' } })}
          ${mkInfoCell({ mark: { status: 'info' } })}
          ${mkInfoCell({ mark: { status: 'success' } })}
          ${mkInfoCell({ mark: { status: 'neutral' } })}
          ${mkInfoCell({ mark: { status: 'info' } })}
        </div>`,
        html: `<div class="sb-info-cell has-mark">
  <span class="sb-mark error"></span>
  <div class="sb-info-cell-text">
    <span class="sb-title-s sb-fw-regular sb-info-cell-title">NMS: "Witness Terminal Name"</span>
    <span class="sb-caption sb-info-cell-sub">2025-03-01|08:12:21</span>
  </div>
</div>

<!-- Other mark colors -->
<span class="sb-mark warning"></span>
<span class="sb-mark alert"></span>
<span class="sb-mark success"></span>
<span class="sb-mark info"></span>
<span class="sb-mark neutral"></span>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.status,
      },
      {
        title: 'Control List',
        desc: sbT(
          'Up to 5 cells per list. With more controls, split them into separate blocks. Example: a Single cell on top for the key control, the rest in a list below.',
          'До 5 ячеек в списке. Если контролов больше — в отдельные блоки. Пример: Single-ячейка сверху для главного контрола, остальные списком ниже.'
        ),
        preview: `${sbMkFlex({ dir: 'col', gap: 'lg', full: true, maxWidth: '360px', content: `${mkControlList([
            { label: 'DC Power', on: false },
          ])}
          ${mkControlList([
            { label: 'DC Power',                 on: false },
            { label: 'Low Power Mode',           on: true },
            { label: 'RL RF Spectral Inversion', on: true },
            { label: 'ODU Present Flag',         on: true },
            { label: 'BUC 10 MHz Reference',     on: true },
          ])}` })}`,
        html: `<!-- Standalone single cell -->
<div class="sb-list">
  <div class="sb-list-cell single">
    <span class="sb-list-cell-label sb-title-m">DC Power</span>
    <label class="sb-toggle-wrap"> ... toggle ... </label>
  </div>
</div>

<!-- 5-cell list -->
<div class="sb-list">
  <div class="sb-list-cell top">    ... DC Power + toggle ... </div>
  <div class="sb-list-cell inside"> ... Low Power Mode + toggle ON ... </div>
  <div class="sb-list-cell inside"> ... RL RF Spectral Inversion + toggle ON ... </div>
  <div class="sb-list-cell inside"> ... ODU Present Flag + toggle ON ... </div>
  <div class="sb-list-cell bottom"> ... BUC 10 MHz Reference + toggle ON ... </div>
</div>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.toggles,
      },
      {
        title: sbT('Control List — Cell Types', 'Control List — типы ячеек'),
        desc: sbT(
          'Single — a standalone cell. Top and Bottom close the list at its ends. Inside — a middle cell; it cannot be first or last.',
          'Single — самостоятельная ячейка. Top и Bottom замыкают список по краям. Inside — серединная ячейка; не может быть первой или последней.'
        ),
        preview: `${sbMkFlex({ dir: 'col', gap: 'lg', full: true, maxWidth: '360px', content: `${mkCellWithTypeTag('single', 'Single', 'DC Power', { on: false })}
          ${mkCellWithTypeTag('top',    'Top',    'Low Power Mode', { on: true })}
          ${mkCellWithTypeTag('inside', 'Inside List', 'RL RF Spectral Inversion', { on: true })}
          ${mkCellWithTypeTag('bottom', 'Bottom', 'ODU Present Flag', { on: true })}` })}`,
        html: `<!-- Single -->
<div class="sb-list-cell single">
  <span class="sb-list-cell-label sb-title-m">DC Power</span>
  <label class="sb-toggle-wrap">
    <span class="sb-toggle">
      <input type="checkbox">
      <span class="sb-toggle-track"></span>
      <span class="sb-toggle-thumb"></span>
    </span>
  </label>
</div>

<!-- Top -->
<div class="sb-list-cell top"> ... </div>

<!-- Inside List -->
<div class="sb-list-cell inside"> ... </div>

<!-- Bottom -->
<div class="sb-list-cell bottom"> ... </div>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.toggles,
      },
      {
        title: sbT('Property List — Cell', 'Property List — ячейка'),
        desc: sbT(
      'List cells use a label → value format: an icon and the label on the left, the value on the right. The format is not a table — there is no header, no sorting and no selection. Rows are independent, and values are text, badges or buttons. The left slot takes a status dot. The label truncates with an ellipsis, the value carries no marking. Row height is 40 pixels. Head is a standalone cell with a contrasting bottom border.',
      'Ячейки списка используют формат «подпись → значение»: слева — иконка и подпись, справа — значение. Формат не в виде таблицы, нет шапки, сортировки и выбора. Строки независимы, значения — текст, бейджи или кнопки. В левом слоте точка-индикатор. Подпись с многоточием, значение без маркировки. Высота строки 40 пикселей. Элемент Head — отдельная ячейка с контрастной нижней границей.'
        ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry</b>'
      + '<ul><li>Height: 40px, fixed (<code>--list-min-height-cell</code>).</li><li>Width: from 80px (<code>--list-cell-min-width-standard</code>) to 980px, and to 1024px from tablet up (<code>--list-max-width-cell</code>).</li><li>Padding: 8px vertical, 0 horizontal.</li><li>Gap: 8px in the left slot, 4px in the right one.</li></ul>'
      + '<b>Left slot</b>'
      + '<ul><li>Content: status dot, icon, label.</li><li>Order: the dot always comes first.</li><li>Behaviour: takes the free width, truncates the label with an ellipsis.</li><li>Status dot: <code>sbMkStatusDot</code> from Status, optional.</li></ul>'
      + '<b>Right slot</b>'
      + '<ul><li>Content: any markup — text, badge, button, icon.</li><li>Alignment: to the right edge.</li><li>Behaviour: never wraps and never truncates.</li></ul>'
      + '<b>Typography</b>'
      + '<ul><li>Style: Title M, 16px, weight 600.</li><li>Line-height: <code>--body-line-height</code>.</li><li>Numerals: tabular.</li></ul>'
      + '<b>Colours</b>'
      + '<ul><li>Label: <code>--text-tertiary</code>.</li><li>Value: <code>--text-secondary</code>; a modifier overrides it — <code>primary</code>, <code>success</code>, <code>error</code>, <code>alert</code>, <code>info</code>, <code>text</code>.</li><li>Separator: <code>--border-soft</code>; <code>--border</code> in the Head variant.</li></ul>'
      + '<b>List</b>'
      + '<ul><li>Structure: a column of cells.</li><li>Last cell: transparent separator.</li><li>Two columns: two lists inside the Grid System.</li></ul>'
      + '<b>API</b>'
      + '<ul><li><code>sbMkPropertyCell({ label, icon, indicator, value, valueColor, head, cls })</code></li><li><code>sbMkPropertyList({ items, cls })</code></li></ul>',
      '<b>Геометрия</b>'
      + '<ul><li>Высота: 40px, фиксированная (<code>--list-min-height-cell</code>).</li><li>Ширина: от 80px (<code>--list-cell-min-width-standard</code>) до 980px, с планшета — до 1024px (<code>--list-max-width-cell</code>).</li><li>Отступы: 8px по вертикали, 0 по горизонтали.</li><li>Интервалы: 8px в левом слоте, 4px в правом.</li></ul>'
      + '<b>Левый слот</b>'
      + '<ul><li>Состав: точка-индикатор, иконка, подпись.</li><li>Порядок: индикатор всегда первый.</li><li>Поведение: занимает свободную ширину, сокращает подпись многоточием.</li><li>Индикатор: <code>sbMkStatusDot</code> из компонента Status, необязателен.</li></ul>'
      + '<b>Правый слот</b>'
      + '<ul><li>Состав: произвольная разметка — текст, бейдж, кнопка, иконка.</li><li>Выравнивание: по правому краю.</li><li>Поведение: не переносится и не сокращается.</li></ul>'
      + '<b>Типографика</b>'
      + '<ul><li>Начертание: Title M, 16px, насыщенность 600.</li><li>Межстрочный интервал: <code>--body-line-height</code>.</li><li>Цифры: моноширинные.</li></ul>'
      + '<b>Цвета</b>'
      + '<ul><li>Подпись: <code>--text-tertiary</code>.</li><li>Значение: <code>--text-secondary</code>; переопределяется модификатором — <code>primary</code>, <code>success</code>, <code>error</code>, <code>alert</code>, <code>info</code>, <code>text</code>.</li><li>Разделитель: <code>--border-soft</code>; в варианте Head — <code>--border</code>.</li></ul>'
      + '<b>Список</b>'
      + '<ul><li>Структура: колонка ячеек.</li><li>Последняя ячейка: разделитель прозрачный.</li><li>Две колонки: два списка внутри Grid System.</li></ul>'
      + '<b>API</b>'
      + '<ul><li><code>sbMkPropertyCell({ label, icon, indicator, value, valueColor, head, cls })</code></li><li><code>sbMkPropertyList({ items, cls })</code></li></ul>'
        )),
        preview: `<div style="width:100%;max-width:352px">${mkPropertyList({ items: propItems({
          propIcon: true, propIndicator: 'online', propPulse: false,
          propValueType: 'text', propValueColor: '', propLong: false,
        }, PROP_DEMO.slice(0, 4)) })}</div>`,
        html: mkPropertyList({ items: propItems({
          propIcon: true, propIndicator: 'online', propPulse: false,
          propValueType: 'text', propValueColor: '', propLong: false,
        }, PROP_DEMO.slice(0, 3)) }),
        css: COMP_CSS.propertyList + '\n' + COMP_CSS.status.indicator,
      },
    ],
  });
})();
