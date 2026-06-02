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
.sb-overflow-menu { position: relative; flex-shrink: 0; }
.sb-overflow-menu .sb-ctx-card {
  position: fixed; top: 0; left: 0; z-index: 1000;
  transform: scale(0.95); transform-origin: top right;
  opacity: 0; pointer-events: none;
  transition: transform 0.15s, opacity 0.15s;
}
.sb-overflow-menu.is-open .sb-ctx-card {
  transform: scale(1); opacity: 1; pointer-events: auto;
}
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

// Action click handler — does NOT toggle .is-selected. Closes any open
// overflow-menu wrapper containing the cell (one-shot action UX: tap →
// done → close). Works for any wrapper carrying the .sb-overflow-menu class
// (Header L/M/S/Section overflow buttons all share it).
window.sbActionContextCell = function(cell) {
  if (!cell || cell.classList.contains('is-disabled')) return;
  const wrap = cell.closest('.sb-overflow-menu');
  if (wrap) wrap.classList.remove('is-open');
};

// Generic overflow-menu toggle. Used by every "More button + .sb-ctx-card"
// pair across DS. The trigger button must be a direct child of an element
// with .sb-overflow-menu (and .sb-overflow-menu must contain a .sb-ctx-card
// child as the dropdown). Card position is computed in fixed coords from
// the trigger's bounding rect so it escapes any clipping ancestor.
window.sbOverflowMenuToggle = function(triggerBtn) {
  const wrap = triggerBtn.closest('.sb-overflow-menu');
  if (!wrap) return;
  const willOpen = !wrap.classList.contains('is-open');
  // Close every other open overflow menu first.
  document.querySelectorAll('.sb-overflow-menu.is-open').forEach(el => {
    if (el !== wrap) el.classList.remove('is-open');
  });
  if (willOpen) {
    const card = wrap.querySelector('.sb-ctx-card');
    if (card) {
      // Pre-measure while still hidden (visibility:hidden gives layout).
      const prev = card.style.cssText;
      card.style.cssText = prev + ';visibility:hidden;opacity:1;pointer-events:none;transform:none';
      const cardW = card.offsetWidth;
      card.style.cssText = prev;
      const r = triggerBtn.getBoundingClientRect();
      card.style.top  = (r.bottom + 4) + 'px';
      card.style.left = Math.max(8, r.right - cardW) + 'px';
    }
  }
  wrap.classList.toggle('is-open', willOpen);
};

// One-time global listeners — outside-click / Escape / scroll close any
// open overflow menu across the whole DS.
if (!window.__sbOverflowMenuBound) {
  window.__sbOverflowMenuBound = true;
  const closeAll = () => {
    document.querySelectorAll('.sb-overflow-menu.is-open')
      .forEach(el => el.classList.remove('is-open'));
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('.sb-overflow-menu')) return;
    closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
  // Capture-phase scroll catches every scrolling ancestor (page + nested).
  // Fixed-position dropdown would otherwise stay glued to its old viewport
  // location while content under it moves.
  window.addEventListener('scroll', closeAll, true);
}

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
    description: 'Ячейки для контекстных меню, dropdown\'ов, pop-up карточек. Высота 40px, опциональная иконка слева (L), опциональная hover-иконка справа (S, configurable). Selected подсвечивает фон --primary-hover, текст --primary, и показывает check справа. Клик настраиваемый: по умолчанию single-select, галочка sticky (остаётся при повторном открытии меню).',
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
        // 3 группы: State (cellState) / Icons (left icon + hover-right icon) / Behavior.
        return `<div class="pg-group">
            <div class="pg-group-title sb-field-label">State</div>
            <div class="pg-group-body">
              ${pg.select('cellState', [
                { value: 'default',  label: 'Default' },
                { value: 'hover',    label: 'Hover' },
                { value: 'selected', label: 'Selected' },
                { value: 'disabled', label: 'Disabled' },
              ])}
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Icons</div>
            <div class="pg-group-body">
              ${pg.select('iconRightHover', [
                { value: 'file-copy-line', label: 'Hover icon: Copy' },
                { value: 'eye-line',       label: 'Hover icon: Eye' },
                { value: 'none',           label: 'Hover icon: None' },
              ])}
              <div class="pg-toggles">
                ${pg.toggle('hasIconLeft', 'Icon Left')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Behavior</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('standalone',  'Radius 4px')}
                ${pg.toggle('clickable',   'Clickable')}
              </div>
            </div>
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
  <span class="sb-ctx-cell-label sb-title-m sb-fw-semibold">Name</span>
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
      {
        title: 'Context Card (Dropdown / Pop-up)',
        desc: 'Карточка-обёртка для группы ячеек — для выпадающих меню (например, overflow-menu в Header L). Radius 12, padding 8/8, gap 8 между ячейками, лёгкая тень (--shadow-sm). До 5 ячеек на карточку — иначе превращай в скроллируемый список. Ячейки в mode:"action" — клик не оставляет .is-selected (one-shot действия), только подсвечивается hover-фон. Если все ячейки в карточке без иконок — все равно без иконок; иконка либо у всех, либо ни у кого.',
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
        title: 'Context Card with Tip',
        desc: 'Modifier <code>.with-tip</code> — карточка получает треугольник сверху-справа, «указывающий» на триггер. Используется для callout-меню над аватаром, kebab-кнопкой, tooltip\'ами с действиями. Right-offset треугольника = 16px (попадает примерно в центр 32-40px иконочного триггера). Цвет триангла = фон карточки → шёва не видно.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);display:flex;justify-content:center">
          <div class="sb-ctx-card with-tip" style="position:relative">
            ${mkContextCell({ iconLeft: 'user-line',   label: 'Settings', mode: 'action' })}
            ${mkContextCell({ iconLeft: 'lock-2-line', label: 'Logout',   mode: 'action' })}
          </div>
        </div>`,
        html: `<!-- Card с tip — используется в паре с триггером выше (avatar, kebab-кнопка),
     который JS позиционирует через sbOverflowMenuToggle(triggerEl) -->
<div class="sb-overflow-menu">
  <div class="sb-avatar" onclick="sbOverflowMenuToggle(this)">
    <div class="sb-avatar-circle"><span class="sb-avatar-initials">VS</span></div>
  </div>
  <div class="sb-ctx-card with-tip">
    <!-- sb-ctx-cell .is-action items -->
  </div>
</div>`,
        css: COMP_CSS.contextMenu,
      },
    ],
  });
})();
