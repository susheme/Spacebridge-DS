// ═══════════════════════════════════════════════════════════════════════════
//  CONTEXT MENU
//  CSS в css/components/context-menu.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.contextMenu = `.sb-ctx-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-vert-m);
  width: 100%;
  min-width: var(--list-cell-min-width-standard);
  height: var(--list-min-height-cell);
  padding: var(--pad-horiz-8) var(--pad-vert-8);
  background: var(--background);
  color: var(--text-tertiary);
  cursor: pointer;
  user-select: none;
}
.sb-ctx-cell-icon-left { display: inline-flex; align-items: center; flex-shrink: 0; color: var(--text-secondary); }
.sb-ctx-cell-label {
  flex: 1; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  line-height: var(--headline-line-height-24);
}
.sb-ctx-cell-right {
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; width: 16px; height: 16px;
  color: var(--primary);
}
.sb-ctx-cell-icon-hover,
.sb-ctx-cell-icon-check { display: none; align-items: center; }
.sb-ctx-cell:hover:not(.is-disabled):not(.is-selected),
.sb-ctx-cell.is-hover:not(.is-disabled):not(.is-selected) { background: var(--surface-1); }
.sb-ctx-cell:hover:not(.is-disabled):not(.is-selected) .sb-ctx-cell-icon-hover,
.sb-ctx-cell.is-hover:not(.is-disabled):not(.is-selected) .sb-ctx-cell-icon-hover { display: inline-flex; }
.sb-ctx-cell.is-selected { background: var(--primary-hover); color: var(--primary); }
.sb-ctx-cell.is-selected .sb-ctx-cell-icon-left { color: var(--primary); }
.sb-ctx-cell.is-selected .sb-ctx-cell-icon-check { display: inline-flex; }
.sb-ctx-cell.is-disabled { cursor: not-allowed; pointer-events: none; }
.sb-ctx-cell.is-disabled > * { opacity: 0.5; }
.sb-ctx-cell.has-radius { border-radius: var(--radius-4); }
.sb-ctx-cell.is-action.is-selected { background: var(--background); color: var(--text-tertiary); }
.sb-ctx-cell.is-action.is-selected .sb-ctx-cell-icon-left { color: var(--text-secondary); }
.sb-ctx-cell.is-action .sb-ctx-cell-icon-check { display: none; }
.sb-ctx-card {
  display: inline-flex; flex-direction: column;
  gap: var(--gap-vert-s);
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  min-width: 160px;
  background: var(--background);
  border-radius: var(--radius-12);
  box-shadow: 0 2px 8px 0 var(--shadow-sm);
}
.sb-ctx-card > .sb-ctx-cell { border-radius: var(--radius-4); }
.sb-ctx-card.with-tip::before {
  content: '';
  position: absolute;
  top: -6px; right: 16px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid var(--background);
}`;

// Single-select click handler for Context cells — within parent scope.
window.sbSelectContextCell = function(cell) {
  if (!cell || cell.classList.contains('is-disabled')) return;
  const parent = cell.parentElement;
  if (parent) {
    parent.querySelectorAll(':scope > .sb-ctx-cell.is-selected').forEach(c => c.classList.remove('is-selected'));
  }
  cell.classList.add('is-selected');
};

// Action click handler — does NOT toggle .is-selected. One-shot action UX:
// tap → done → close. Закрытием владеет Popover (closeOnSelect), поэтому
// здесь остаётся только guard на disabled — но хендлер сохранён: ячейки
// вне попапа (standalone-карточки в доках) на него по-прежнему ссылаются.
window.sbActionContextCell = function(cell) {
  if (!cell || cell.classList.contains('is-disabled')) return;
};

// sbOverflowMenuToggle и .sb-overflow-menu удалены 28.07.2026 — их заменил
// примитив Popover (js/components/popover.js). Времянка умела только
// «снизу-справа», без flip, без shift и без портала (position: fixed не
// спасает под предком с transform/contain), и не давала ни фокуса, ни aria.
// Все 30 мест переехали на sbMkPopover — см. CHANGELOG.

// Default demo items used across header overflow menus (Header M / S / L /
// Section…) so the same dropdown content reads consistently in docs.
// Components are free to override with their own items list.
window.SB_DEMO_MORE_ITEMS = [
  { icon: 'file-copy-line',  label: 'Copy' },
  { icon: 'download-2-line', label: 'Download' },
  { icon: 'mail-line',       label: 'Send via email' },
];

// --- CONTEXT MENU ---
(() => {
  function mkContextCell(opts = {}) {
    const {
      iconLeft,         // string | undefined — L size icon name from ICON_PATHS
      label = 'Name',
      iconRightHover,   // string | undefined — S size icon shown on hover
      state,            // undefined | 'hover' | 'selected' | 'disabled'
      standalone,       // boolean — adds .has-radius
      clickable = true, // boolean — wires onclick handler
      mode = 'select',  // 'select' (default — toggles .is-selected) | 'action' (one-shot, no selection)
    } = opts;
    const stateCls =
      state === 'hover'    ? ' is-hover'    :
      state === 'selected' ? ' is-selected' :
      state === 'disabled' ? ' is-disabled' : '';
    const radiusCls = standalone ? ' has-radius' : '';
    const actionCls = mode === 'action' ? ' is-action' : '';
    const handler   = mode === 'action' ? 'sbActionContextCell' : 'sbSelectContextCell';
    const onclickAttr = clickable ? ` onclick="${handler}(this)"` : '';
    const iconLeftEl = iconLeft
      ? `<span class="sb-ctx-cell-icon-left">${sbIcon(iconLeft, 'L')}</span>` : '';
    const hoverIconEl = iconRightHover
      ? `<span class="sb-ctx-cell-icon-hover">${sbIcon(iconRightHover, 'S')}</span>` : '';
    const checkEl = `<span class="sb-ctx-cell-icon-check">${sbIcon('check-line', 'S')}</span>`;
    return `<div class="sb-ctx-cell${stateCls}${radiusCls}${actionCls}"${onclickAttr}>
      ${iconLeftEl}
      <span class="sb-ctx-cell-label sb-title-m sb-fw-semibold">${label}</span>
      <span class="sb-ctx-cell-right">${hoverIconEl}${checkEl}</span>
    </div>`;
  }
  // Expose for other components (Header L overflow menu, etc.).
  window.sbMkContextCell = mkContextCell;

  // Static demo matrix: 4 states × { with iconLeft, without iconLeft }
  function mkStateRow(label, withIconLeft) {
    const iconLeft = withIconLeft ? 'gemini-fill' : undefined;
    return `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-xs)">
      <span class="sb-caption" style="color:var(--text-tertiary)">${label}</span>
      ${mkContextCell({ iconLeft, iconRightHover: 'file-copy-line', label: 'Name' })}
      ${mkContextCell({ iconLeft, iconRightHover: 'file-copy-line', label: 'Name', state: 'hover' })}
      ${mkContextCell({ iconLeft, iconRightHover: 'file-copy-line', label: 'Name', state: 'selected' })}
      ${mkContextCell({ iconLeft, iconRightHover: 'file-copy-line', label: 'Name', state: 'disabled' })}
    </div>`;
  }

  sbRegister({
    name: 'context-menu',
    title: 'Context Menu',
    description: sbT(
      'Cells for context menus, dropdowns and pop-up cards. Examples: the More (⋯) menu in headers, the language switcher in the Navigation Bar. Selection is single-select by default. The check mark is sticky — it survives reopening the menu.',
      'Ячейки для контекстных меню, dropdown-ов и pop-up карточек. Примеры: More-меню (⋯) в хедерах, переключатель языка в Navigation Bar. Выбор по умолчанию single-select. Галочка sticky — сохраняется при повторном открытии меню.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry:</b>'
      + '<ul><li>Cell height: 40px.</li></ul>'
      + '<b>Icons:</b>'
      + '<ul><li>Left: optional (L);</li><li>Right: optional hover icon (S, configurable).</li></ul>'
      + '<b>States:</b>'
      + '<ul><li>Selected: background --primary-hover, text --primary, a check on the right.</li></ul>',
      '<b>Геометрия:</b>'
      + '<ul><li>Высота ячейки: 40px.</li></ul>'
      + '<b>Иконки:</b>'
      + '<ul><li>Слева: опциональная (L);</li><li>Справа: опциональная hover-иконка (S, настраивается).</li></ul>'
      + '<b>Состояния:</b>'
      + '<ul><li>Selected: фон --primary-hover, текст --primary, галочка справа.</li></ul>'
    )),
    playground: {
      title: 'Context Cell Playground',
      minPreview: 320,  // context cell ~280-320px широта — нужно ~320 чтобы не схлопывалось
      state: {
        hasIconLeft: true,
        iconRightHover: 'file-copy-line',  // 'file-copy-line' | 'eye-line' | 'none'
        cellState: 'default',              // 'default' | 'hover' | 'selected' | 'disabled'
        standalone: false,
        clickable: true,
      },
      controls(pg) {
        // State — одиночный select с label'ом (без pg-group обёртки).
        // Icons и Behavior — настоящие группы с несколькими контролами.
        return `${pg.select('cellState', [
            { value: 'default',  label: 'Default'  },
            { value: 'hover',    label: 'Hover'    },
            { value: 'selected', label: 'Selected' },
            { value: 'disabled', label: 'Disabled' },
          ], { label: 'State' })}
          ${sbPgGroup('Icons', `
              ${pg.select('iconRightHover', [
                { value: 'file-copy-line', label: 'Hover icon: Copy' },
                { value: 'eye-line',       label: 'Hover icon: Eye'  },
                { value: 'none',           label: 'Hover icon: None' },
              ])}
              <div class="pg-toggles">
                ${pg.toggle('hasIconLeft', 'Icon Left')}
              </div>
          `)}
          ${sbPgGroup('Behavior', `
              <div class="pg-toggles">
                ${pg.toggle('standalone', 'Radius 4px')}
                ${pg.toggle('clickable',  'Clickable')}
              </div>
          `)}`;
      },
      render(s) {
        return `<div style="width:212px">${mkContextCell({
          iconLeft:       s.hasIconLeft ? 'gemini-fill' : undefined,
          label:          'Name',
          iconRightHover: s.iconRightHover === 'none' ? undefined : s.iconRightHover,
          state:          s.cellState === 'default' ? undefined : s.cellState,
          standalone:     s.standalone,
          clickable:      s.clickable,
        })}</div>`;
      },
      genCode(s) {
        const stateCls =
          s.cellState === 'hover'    ? ' is-hover'    :
          s.cellState === 'selected' ? ' is-selected' :
          s.cellState === 'disabled' ? ' is-disabled' : '';
        const radiusCls = s.standalone ? ' has-radius' : '';
        const onclickAttr = s.clickable ? ' onclick="sbSelectContextCell(this)"' : '';
        const iconLeftLine = s.hasIconLeft
          ? `\n  <span class="sb-ctx-cell-icon-left"><!-- gemini-fill L --></span>` : '';
        const hoverIconInner = s.iconRightHover !== 'none'
          ? `<span class="sb-ctx-cell-icon-hover"><!-- ${s.iconRightHover} S --></span>` : '';
        const html = `<div class="sb-ctx-cell${stateCls}${radiusCls}"${onclickAttr}>${iconLeftLine}
  <span class="sb-ctx-cell-label sb-title-m sb-fw-semibold">Name</span>
  <span class="sb-ctx-cell-right">${hoverIconInner}<span class="sb-ctx-cell-icon-check"><!-- check-line S --></span></span>
</div>`;
        return { html, css: COMP_CSS.contextMenu };
      },
    },
    sections: [
      {
        title: sbT('Context Cell — States', 'Context Cell — состояния'),
        desc: sbT(
          'Default / Hover / Selected / Disabled. The top row — with a left icon (24px), the bottom one — without. A click selects a cell; the selection is single within the parent.',
          'Default / Hover / Selected / Disabled. Верхний ряд — с иконкой слева (24px), нижний — без. Клик выбирает ячейку; выбор одиночный в рамках родителя.'
        ),
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-lg);width:100%;max-width:212px">
          ${mkStateRow('With Icon Left', true)}
          ${mkStateRow('Without Icon Left', false)}
        </div>`,
        html: `<!-- Default -->
<div class="sb-ctx-cell" onclick="sbSelectContextCell(this)">
  <span class="sb-ctx-cell-icon-left"><!-- gemini-fill L --></span>
  <span class="sb-ctx-cell-label sb-title-m sb-fw-semibold">Name</span>
  <span class="sb-ctx-cell-icon-hover"><!-- file-copy-line S --></span>
  <span class="sb-ctx-cell-icon-check"><!-- check-line S --></span>
</div>

<!-- States -->
<div class="sb-ctx-cell is-hover">    ... </div>
<div class="sb-ctx-cell is-selected"> ... </div>
<div class="sb-ctx-cell is-disabled"> ... </div>

<!-- Without Icon Left — omit .sb-ctx-cell-icon-left -->`,
        css: COMP_CSS.contextMenu,
      },
      {
        title: sbT('Standalone Cell (Radius 4px)', 'Отдельная ячейка (радиус 4px)'),
        desc: sbT(
          'When a cell is not pressed against the container edges, the .has-radius modifier rounds its corners to 4px.',
          'Если ячейка не прижата к границам контейнера, модификатор .has-radius скругляет углы до 4px.'
        ),
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-s);width:100%;max-width:212px">
          ${mkContextCell({ iconLeft: 'gemini-fill', label: 'Standalone', iconRightHover: 'file-copy-line', standalone: true })}
          ${mkContextCell({ label: 'Standalone (no icon)', iconRightHover: 'file-copy-line', standalone: true })}
        </div>`,
        html: `<div class="sb-ctx-cell has-radius" onclick="sbSelectContextCell(this)">
  ... ячейка тут ...
</div>`,
        css: COMP_CSS.contextMenu,
      },
      {
        title: sbT('Context Card (Dropdown / Pop-up)', 'Context Card (dropdown / pop-up)'),
        desc: sbT(
          'A wrapper card for a group of cells — the base of dropdown menus. Example: the overflow menu in Header L. Up to 5 cells per card; longer sets become a scrollable list. In mode: "action" a click leaves no selection — for one-shot actions.',
          'Карточка-обёртка для группы ячеек — основа выпадающих меню. Пример: overflow-меню в Header L. До 5 ячеек на карточку; длинные наборы — в скроллируемый список. В mode: "action" клик не оставляет выбора — для one-shot действий.'
        ) + sbDocNote('Important', sbT(
          'Icons are all-or-nothing: either every cell in the card has one, or none does.',
          'Иконки — либо у всех ячеек карточки, либо ни у одной.'
        )) + sbDocNote('Tech Info', sbT(
          '<b>Geometry:</b>'
          + '<ul><li>Radius: 12;</li><li>Padding: 8/8;</li><li>Gap: 8 between cells;</li><li>Shadow: --shadow-sm.</li></ul>',
          '<b>Геометрия:</b>'
          + '<ul><li>Radius: 12;</li><li>Padding: 8/8;</li><li>Gap: 8 между ячейками;</li><li>Тень: --shadow-sm.</li></ul>'
        )),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);display:flex;justify-content:center">
          <div class="sb-ctx-card">
            ${mkContextCell({ iconLeft: 'file-copy-line',  label: 'Copy',          mode: 'action' })}
            ${mkContextCell({ iconLeft: 'download-2-line', label: 'Download',      mode: 'action' })}
            ${mkContextCell({ iconLeft: 'mail-line',       label: 'Send via email',mode: 'action' })}
            ${mkContextCell({ iconLeft: 'loop-left-line',  label: 'Reset',         mode: 'action' })}
            ${mkContextCell({ iconLeft: 'close-line',      label: 'Remove',        mode: 'action' })}
          </div>
        </div>`,
        html: `<div class="sb-ctx-card">
  <div class="sb-ctx-cell is-action" onclick="sbActionContextCell(this)">
    <span class="sb-ctx-cell-icon-left"><!-- file-copy-line L --></span>
    <span class="sb-ctx-cell-label sb-title-m sb-fw-semibold">Copy</span>
    <span class="sb-ctx-cell-right"><span class="sb-ctx-cell-icon-check"><!-- check-line S --></span></span>
  </div>
  <!-- Download / Send via email / Reset / Remove — same pattern with .is-action -->
</div>`,
        css: COMP_CSS.contextMenu,
      },
      {
        title: sbT('Context Card with Tip', 'Context Card с носиком'),
        desc: sbT(
          'The <code>.with-tip</code> modifier adds a triangle at the top right, pointing at the trigger. Examples: a callout menu under an avatar or a kebab button.',
          'Модификатор <code>.with-tip</code> добавляет треугольник сверху справа, указывающий на триггер. Примеры: callout-меню под аватаром или kebab-кнопкой.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Geometry:</b>'
          + '<ul><li>Triangle right-offset: 16px — roughly the center of a 32–40px icon trigger.</li></ul>'
          + '<b>Colors:</b>'
          + '<ul><li>The triangle’s color equals the card background, so the seam is invisible.</li></ul>',
          '<b>Геометрия:</b>'
          + '<ul><li>Right-offset треугольника: 16px — примерно центр иконочного триггера 32–40px.</li></ul>'
          + '<b>Цвета:</b>'
          + '<ul><li>Цвет треугольника равен фону карточки, поэтому шва не видно.</li></ul>'
        )),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);display:flex;justify-content:center">
          <div class="sb-ctx-card with-tip" style="position:relative">
            ${mkContextCell({ iconLeft: 'user-line',   label: 'Settings', mode: 'action' })}
            ${mkContextCell({ iconLeft: 'lock-2-line', label: 'Logout',   mode: 'action' })}
          </div>
        </div>`,
        html: `<!-- Статичный .with-tip — носик прибит к right:16px. Для живых
     выпадашек бери Popover: он даёт носик, который едет за якорем
     при сдвиге, плюс flip, portal и закрытие по клику-вне. -->
sbMkPopover({
  trigger: sbMkAvatar({ type: 'initials', initials: 'VS' }),
  content: '<div class="sb-ctx-card"><!-- sb-ctx-cell .is-action items --></div>',
  placement: 'bottom-end',
  arrow: true,
})`,
        css: COMP_CSS.contextMenu,
      },
    ],
  });
})();
