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
  const DEMO = [
    { icon: 'radar-line',        label: 'RL Status',          value: 'Not Acquired' },
    { icon: 'arrow-up-s-line',   label: 'UT Power Level',     value: '-99.99 dBm' },
    { icon: 'loop-left-line',    label: 'Symbol Rate',        value: '0 ksymb/s' },
    // Title Case не только по правилу DS: строчное «undefined» тест
    // целостности разметки принимает за протёкший в вывод мусор.
    { icon: 'code-s-slash-line', label: 'MODCOD',             value: 'Undefined Waveform' },
    { icon: 'arrow-up-s-line',   label: 'Max Tx Power Level', value: '-14.5 dBm' },
    { icon: 'radar-line',        label: 'Required Es/No',     value: '-99.99 dB' },
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
      'A key-value row for cards: the left slot carries an optional icon and the label, the right slot carries the value. It is deliberately not a table — there are no column headers, no sorting and no selection, and each row is its own field with its own value type: plain text, a status badge, an icon button. The left slot also takes a status dot. The label shrinks with an ellipsis, the value never does, and the row height stays fixed at 40 whatever the slots carry. Head is a standalone cell that lives outside a list and only differs by a more contrasting bottom line.',
      'Строка «подпись → значение» для карточек: в левом слоте необязательная иконка и подпись, в правом — значение. Это сознательно не таблица: нет шапки колонок, сортировки и выбора, а каждая строка — самостоятельное поле со своим типом значения: текст, бейдж статуса, иконка-кнопка. В левый слот дополнительно ставится точка-индикатор. Подпись жмётся с многоточием, значение — никогда, а высота строки остаётся фиксированной — 40, чем бы ни набили слоты. Head — одиночная ячейка, живущая вне списка; отличается только более контрастной нижней линией.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry:</b>'
      + '<ul><li>Height: 40px, fixed (<code>--list-min-height-cell</code>) — a 28px badge or a 24px icon overflows the invisible content box but stays inside the cell, so rows never jump;</li><li>Width: min 80 (<code>--list-cell-min-width-standard</code>) / max 980 on mobile and 1024 from tablet up (<code>--list-max-width-cell</code>);</li><li>Padding: 8 vertical / 0 horizontal — the row is flush with the card edge;</li><li>Gap: 8 in the left slot, 4 in the right one (both responsive, halved on mobile).</li></ul>'
      + '<b>Slots:</b>'
      + '<ul><li>Left: <code>flex: 1 1 auto</code> with <code>min-width: 0</code> — takes the free space and truncates with an ellipsis;</li><li>Right: <code>flex: 0 1 auto</code>, right-aligned, never wraps or truncates — the value is what the reader came for, the label yields space to it;</li><li>The right slot takes any markup: a string, a status badge, a button, an icon;</li><li>The left slot takes an optional status dot (<code>sbMkStatusDot</code> from Status) — always leftmost, so the column of dots reads vertically whether or not there is an icon.</li></ul>'
      + '<b>Typography:</b>'
      + '<ul><li>Both slots: Title M 16/600, tabular numerals so the value column stays aligned;</li><li>Line-height comes from Body, not from <code>--title-line-height-s</code>: Title M has no line-height of its own in Figma, and S gives 12px under a 16px font — on a truncating label that clips the descenders.</li></ul>'
      + '<b>Colors:</b>'
      + '<ul><li>Label: <code>--text-tertiary</code>;</li><li>Value: <code>--text-secondary</code> by default, overridden by a modifier — <code>primary</code> / <code>success</code> / <code>error</code> / <code>alert</code> / <code>info</code> / <code>text</code>;</li><li>Separator: <code>--border-soft</code>, and <code>--border</code> for Head.</li></ul>'
      + '<b>List:</b>'
      + '<ul><li>A plain column of cells; the last one loses its separator — the card edge does that job;</li><li>The border is turned transparent rather than removed, so the last row keeps the same height as the others;</li><li>Two columns side by side are two lists inside the Grid System — the component has no column layout of its own on purpose.</li></ul>'
      + '<b>API:</b>'
      + '<ul><li><code>sbMkPropertyCell({ label, icon, indicator, value, valueColor, head, cls })</code>;</li><li><code>sbMkPropertyList({ items, cls })</code>.</li></ul>',
      '<b>Геометрия:</b>'
      + '<ul><li>Высота: 40px, фиксированная (<code>--list-min-height-cell</code>) — бейдж 28 и иконка 24 переполняют невидимый content-box, но лежат внутри ячейки, поэтому строки не скачут;</li><li>Ширина: min 80 (<code>--list-cell-min-width-standard</code>) / max 980 на мобиле и 1024 с планшета (<code>--list-max-width-cell</code>);</li><li>Паддинги: 8 по вертикали / 0 по горизонтали — строка идёт вровень с краем карточки;</li><li>Gap: 8 в левом слоте, 4 в правом (оба адаптивные, на мобиле вдвое меньше).</li></ul>'
      + '<b>Слоты:</b>'
      + '<ul><li>Левый: <code>flex: 1 1 auto</code> и <code>min-width: 0</code> — забирает свободное место и жмётся с многоточием;</li><li>Правый: <code>flex: 0 1 auto</code>, прижат вправо, не переносится и не режется — за значением человек и пришёл, место ему уступает подпись;</li><li>В правый слот кладётся любая разметка: строка, бейдж статуса, кнопка, иконка;</li><li>В левый слот опционально ставится точка-индикатор (<code>sbMkStatusDot</code> из Status) — всегда самая левая, чтобы колонка точек читалась вертикально независимо от наличия иконки.</li></ul>'
      + '<b>Типографика:</b>'
      + '<ul><li>Оба слота: Title M 16/600, моноширинные цифры — ради них колонка значений и стоит ровно;</li><li>Line-height берётся из Body, а не из <code>--title-line-height-s</code>: своего line-height у Title M в Figma нет, а S даёт 12px при шрифте 16 — на жмущейся подписи это срезает хвосты букв.</li></ul>'
      + '<b>Цвета:</b>'
      + '<ul><li>Подпись: <code>--text-tertiary</code>;</li><li>Значение: по умолчанию <code>--text-secondary</code>, переопределяется модификатором — <code>primary</code> / <code>success</code> / <code>error</code> / <code>alert</code> / <code>info</code> / <code>text</code>;</li><li>Разделитель: <code>--border-soft</code>, у Head — <code>--border</code>.</li></ul>'
      + '<b>Список:</b>'
      + '<ul><li>Обычная колонка ячеек; у последней разделитель снимается — его роль играет край карточки;</li><li>Border не убирается, а красится в прозрачный, чтобы последняя строка не стала ниже остальных;</li><li>Две колонки рядом — это два списка внутри Grid System; собственной колоночной раскладки у компонента намеренно нет.</li></ul>'
      + '<b>API:</b>'
      + '<ul><li><code>sbMkPropertyCell({ label, icon, indicator, value, valueColor, head, cls })</code>;</li><li><code>sbMkPropertyList({ items, cls })</code>.</li></ul>'
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
          icon: s.icon ? d.icon : undefined,
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
          icon: s.icon ? d.icon : undefined,
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
