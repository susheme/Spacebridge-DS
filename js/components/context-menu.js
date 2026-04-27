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
.sb-ctx-cell.has-radius { border-radius: var(--radius-4); }`;

// Single-select click handler for Context cells — within parent scope.
window.sbSelectContextCell = function(cell) {
  if (!cell || cell.classList.contains('is-disabled')) return;
  const parent = cell.parentElement;
  if (parent) {
    parent.querySelectorAll(':scope > .sb-ctx-cell.is-selected').forEach(c => c.classList.remove('is-selected'));
  }
  cell.classList.add('is-selected');
};

// --- CONTEXT MENU ---
(() => {
  function mkContextCell(opts = {}) {
    const {
      iconLeft,         // string | undefined — L size icon name from ICON_PATHS
      label = 'Name',
      iconRightHover,   // string | undefined — S size icon shown on hover
      state,            // undefined | 'hover' | 'selected' | 'disabled'
      standalone,       // boolean — adds .has-radius
      clickable = true, // boolean — wires onclick to sbSelectContextCell
    } = opts;
    const stateCls =
      state === 'hover'    ? ' is-hover'    :
      state === 'selected' ? ' is-selected' :
      state === 'disabled' ? ' is-disabled' : '';
    const radiusCls = standalone ? ' has-radius' : '';
    const onclickAttr = clickable ? ' onclick="sbSelectContextCell(this)"' : '';
    const iconLeftEl = iconLeft
      ? `<span class="sb-ctx-cell-icon-left">${sbIcon(iconLeft, 'L')}</span>` : '';
    const hoverIconEl = iconRightHover
      ? `<span class="sb-ctx-cell-icon-hover">${sbIcon(iconRightHover, 'S')}</span>` : '';
    const checkEl = `<span class="sb-ctx-cell-icon-check">${sbIcon('check-line', 'S')}</span>`;
    return `<div class="sb-ctx-cell${stateCls}${radiusCls}"${onclickAttr}>
      ${iconLeftEl}
      <span class="sb-ctx-cell-label sb-title-m-bold">${label}</span>
      <span class="sb-ctx-cell-right">${hoverIconEl}${checkEl}</span>
    </div>`;
  }

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
    description: 'Ячейки для контекстных меню, dropdown\'ов, pop-up карточек. Высота 40px, опциональная иконка слева (L), опциональная hover-иконка справа (S, configurable). Selected подсвечивает фон --primary-hover, текст --primary, и показывает check справа. Клик настраиваемый: по умолчанию single-select, галочка sticky (остаётся при повторном открытии меню).',
    playground: {
      title: 'Context Cell Playground',
      state: {
        hasIconLeft: true,
        iconRightHover: 'file-copy-line',  // 'file-copy-line' | 'eye-line' | 'none'
        cellState: 'default',              // 'default' | 'hover' | 'selected' | 'disabled'
        standalone: false,
        clickable: true,
      },
      controls(pg) {
        return pg.select('cellState', [
          { value: 'default',  label: 'Default' },
          { value: 'hover',    label: 'Hover' },
          { value: 'selected', label: 'Selected' },
          { value: 'disabled', label: 'Disabled' },
        ]) + pg.select('iconRightHover', [
          { value: 'file-copy-line', label: 'Hover icon: Copy' },
          { value: 'eye-line',       label: 'Hover icon: Eye' },
          { value: 'none',           label: 'Hover icon: None' },
        ]) + `<div class="pg-toggles">
          ${pg.toggle('hasIconLeft', 'Icon Left')}
          ${pg.toggle('standalone',  'Radius 4px')}
          ${pg.toggle('clickable',   'Clickable')}
        </div>`;
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
  <span class="sb-ctx-cell-label sb-title-m-bold">Name</span>
  <span class="sb-ctx-cell-right">${hoverIconInner}<span class="sb-ctx-cell-icon-check"><!-- check-line S --></span></span>
</div>`;
        return { html, css: COMP_CSS.contextMenu };
      },
    },
    sections: [
      {
        title: 'Context Cell — States',
        desc: 'Default / Hover / Selected / Disabled. Сверху — c Icon Left (24px), снизу — без. Клик по любой ячейке делает её Selected (single-select в рамках родителя).',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-lg);width:100%;max-width:212px">
          ${mkStateRow('With Icon Left', true)}
          ${mkStateRow('Without Icon Left', false)}
        </div>`,
        html: `<!-- Default -->
<div class="sb-ctx-cell" onclick="sbSelectContextCell(this)">
  <span class="sb-ctx-cell-icon-left"><!-- gemini-fill L --></span>
  <span class="sb-ctx-cell-label sb-title-m-bold">Name</span>
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
        title: 'Standalone Cell (Radius 4px)',
        desc: 'Когда ячейка не прижата к границам контейнера — добавляй модификатор .has-radius для скругления углов 4px.',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-s);width:100%;max-width:212px">
          ${mkContextCell({ iconLeft: 'gemini-fill', label: 'Standalone', iconRightHover: 'file-copy-line', standalone: true })}
          ${mkContextCell({ label: 'Standalone (no icon)', iconRightHover: 'file-copy-line', standalone: true })}
        </div>`,
        html: `<div class="sb-ctx-cell has-radius" onclick="sbSelectContextCell(this)">
  ... ячейка тут ...
</div>`,
        css: COMP_CSS.contextMenu,
      },
    ],
  });
})();
