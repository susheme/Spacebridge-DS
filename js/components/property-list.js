// ═══════════════════════════════════════════════════════════════════════════
//  PROPERTY LIST
//  CSS в css/components/property-list.css — SYNC-маркеры обязательны.
//  Ячейка «лейбл → значение» для карточек: левый слот (иконка + подпись),
//  правый слот (произвольный контент). Вариант Head — одиночная ячейка.
// ═══════════════════════════════════════════════════════════════════════════

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

// --- PROPERTY LIST ---
(() => {
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
  const DEMO_ICON = 'radar-line';
  const DEMO = [
    { label: 'RL Status',          value: 'Not Acquired' },
    { label: 'UT Power Level',     value: '-99.99 dBm' },
    { label: 'Symbol Rate',        value: '0 ksymb/s' },
    // Title Case не только по правилу DS: строчное «undefined» тест
    // целостности разметки принимает за протёкший в вывод мусор.
    { label: 'MODCOD',             value: 'Undefined Waveform' },
    { label: 'Max Tx Power Level', value: '-14.5 dBm' },
    { label: 'Required Es/No',     value: '-99.99 dB' },
  ];
  const LONG_LABEL = 'Required Es/No At The Receiver Input Under Clear Sky Conditions';

  // Значение правого слота по типу. Только фабрики DS — своей разметки
  // чужих компонентов здесь нет.
  function demoValue(type, text) {
    if (type === 'badge')  return sbMkBadgeStatus({ label: 'Not Acquired', color: 'grey', mini: true });
    if (type === 'button') return sbMkButton({ icon: 'more-2-line', iconSize: 'S', size: 's', attrs: ' aria-label="Actions"' });
    if (type === 'icon')   return text + sbIcon('lock-2-line', 'L');
    return text;
  }

  sbRegister({
    name: 'property-list',
    title: 'Property List',
    description: sbT(
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
    playground: {
      title: 'Property List Playground',
      state: {
        valueType: 'text',
        valueColor: '',
        indicator: '',
        pulse: false,
        icon: true,
        head: false,
        long: false,
        list: true,
      },
      controls(pg) {
        return `${sbPgGroup('Left Slot', `
            ${pg.select('indicator', [
              { value: '',            label: 'None' },
              { value: 'online',      label: 'Online (green)' },
              { value: 'error',       label: 'Error (red)' },
              { value: 'warning',     label: 'Warning (yellow)' },
              { value: 'maintenance', label: 'Maintenance (orange)' },
              { value: 'info',        label: 'Info (blue)' },
              { value: 'connecting',  label: 'Connecting (primary)' },
              { value: 'offline',     label: 'Offline (gray)' },
            ], { label: 'indicator' })}
            <!-- .pg-toggles — ПРЯМОЙ ребёнок группы: полноширинный ряд даёт
                 правило .pg-group-body > .pg-toggles, оно ловит только их. -->
            <div class="pg-toggles">
              ${pg.toggle('icon', 'Icon')}
              <span data-pg-needs-indicator>${pg.toggle('pulse', 'Pulse')}</span>
            </div>
          `)}
          ${sbPgGroup('Right Slot', `
            ${pg.select('valueType', [
              { value: 'text',   label: 'Text' },
              { value: 'badge',  label: 'Badge-Status — Mini' },
              { value: 'button', label: 'Icon Button' },
              { value: 'icon',   label: 'Text + Icon' },
            ], { label: 'value' })}
            ${pg.select('valueColor', [
              { value: '',        label: 'Default' },
              { value: 'text',    label: 'Text' },
              { value: 'primary', label: 'Primary' },
              { value: 'success', label: 'Success' },
              { value: 'error',   label: 'Error' },
              { value: 'alert',   label: 'Alert' },
            ], { label: 'color' })}
          `)}
          ${sbPgGroup('Options', `
            <div class="pg-toggles">
              ${pg.toggle('long', 'Long')}
              ${pg.toggle('list', 'List')}
              ${pg.toggle('head', 'Head')}
            </div>
          `)}`;
      },
      // Pulse без индикатора ни на что не влияет — прячем, чтобы тогл не
      // выглядел сломанным.
      syncControls(s, container) {
        container.querySelectorAll('[data-pg-needs-indicator]').forEach(el => {
          el.style.display = s.indicator ? '' : 'none';
        });
      },
      // Head — одиночная ячейка вне списка, поэтому со списком не сочетается.
      onControlChange(key, value, s) {
        if (key === 'head' && value) s.list = false;
        if (key === 'list' && value) s.head = false;
      },
      render(s) {
        const items = DEMO.map((d, i) => ({
          icon: s.icon ? DEMO_ICON : undefined,
          indicator: s.indicator ? { status: s.indicator, pulse: s.pulse } : undefined,
          label: s.long && i === DEMO.length - 1 ? LONG_LABEL : d.label,
          value: demoValue(s.valueType, d.value),
          valueColor: s.valueColor || undefined,
        }));
        const content = s.list
          ? mkPropertyList({ items })
          : mkPropertyCell(Object.assign({}, items[0], { head: s.head }));
        // Обёртка под max-width токена: без неё ячейка растянулась бы на всё
        // превью и трункейт подписи не показать.
        return `<div style="width:100%;max-width:352px;margin:0 auto">${content}</div>`;
      },
      genCode(s) {
        const items = DEMO.slice(0, 3).map(d => ({
          icon: s.icon ? DEMO_ICON : undefined,
          indicator: s.indicator ? { status: s.indicator, pulse: s.pulse } : undefined,
          label: d.label,
          value: demoValue(s.valueType, d.value),
          valueColor: s.valueColor || undefined,
        }));
        return {
          html: s.list
            ? mkPropertyList({ items })
            : mkPropertyCell(Object.assign({}, items[0], { head: s.head })),
          // Точка и mini-бейдж живут в Status — без его стилей скопированный
          // пример отрисуется голым. COMP_CSS.status разбит по подключам.
          css: window.COMP_CSS.propertyList
            + (s.indicator ? '\n' + window.COMP_CSS.status.indicator
                             + (s.pulse ? '\n' + window.COMP_CSS.status.pulse : '') : '')
            + (s.valueType === 'badge'
                ? '\n' + window.COMP_CSS.status.badgeStatus + '\n' + window.COMP_CSS.status.badgeStatusMini
                : ''),
        };
      },
    },
  });
})();
