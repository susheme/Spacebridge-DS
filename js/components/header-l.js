// ═══════════════════════════════════════════════════════════════════════════
//  HEADER L
//  CSS в css/components/header-l.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.headerL = `.sb-header-l {
  display: flex;
  width: 100%;
  min-width: var(--header-min-width);
  max-width: var(--header-max-width);
  max-height: var(--header-max-height);
  padding: var(--pad-horiz-16) var(--pad-vert-0);
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-0) var(--radius-0) 0 0;
  border-bottom: var(--border-width-1) solid var(--surface-2);
  background: var(--background);
  container-type: inline-size;
}

.sb-header-l-left,
.sb-header-l-right {
  display: inline-flex;
  max-width: var(--nav-menu-max-width-right-content);
  min-height: var(--header-s-max-min-height);
  max-height: var(--header-s-max-min-height);
  align-items: center;
  gap: var(--gap-vert-m);
  color: var(--text-tertiary);
}

.sb-header-l-left {
  flex: 1 1 0;
  min-width: 0;
}

.sb-header-l-right {
  flex-shrink: 0;
  justify-content: flex-end;
}

.sb-header-l-right .sb-caption {
  white-space: nowrap;
}

.sb-header-l-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sb-header-l-more { flex-shrink: 0; }
.sb-header-l-menu-extra { display: none; }

@container (max-width: 768px) {
  .sb-header-l-left,
  .sb-header-l-right     { gap: var(--gap-vert-s); }
  .sb-header-l-action    { display: none; }
  .sb-header-l-menu-extra { display: flex; }
}`;

// --- HEADER L ---
// Overflow-menu open/close behavior, click-outside handling, and the global
// SB_DEMO_MORE_ITEMS list now live in context-menu.js (generic for any
// .sb-overflow-menu wrapper). Header L just renders the markup with the
// shared class and sbOverflowMenuToggle hook.
(() => {
  function mkHeaderL({ slotLeft, title, slotRight } = {}) {
    const hasLeft  = slotLeft  != null && slotLeft  !== false && slotLeft  !== '';
    const hasTitle = title     != null && title     !== false && title     !== '';
    const hasRight = slotRight != null && slotRight !== false && slotRight !== '';

    const titleEl = hasTitle ? `<span class="sb-header-l-title sb-h5">${title}</span>` : '';
    const leftInner = (hasLeft ? slotLeft : '') + titleEl;
    const left = leftInner ? `<div class="sb-header-l-left">${leftInner}</div>` : '';
    const right = hasRight ? `<div class="sb-header-l-right">${slotRight}</div>` : '';

    return `<div class="sb-header-l">${left}${right}</div>`;
  }

  // Expose helper для будущих хедеров и dev-консоли.
  window.sbMkHeaderL = mkHeaderL;

  // ── Actions builder ──────────────────────────────────────────────
  // Renders inline action buttons (visible on wide) + the More button
  // with its always-attached dropdown card (.sb-ctx-card with cells).
  // At narrow widths, inline actions are hidden and surface inside the
  // dropdown via the .sb-header-l-menu-extra modifier (CSS-controlled).
  //
  //   inline: [{ type: 'icon', icon: 'add-line', label: 'Add' },
  //            { type: 'text', label: 'Action' }]
  //   more:   { items: [{ icon: 'file-copy-line', label: 'Copy' }, ...] }
  //
  // If `more` is omitted but `inline` exists, a More button is still
  // rendered so narrow users have a way to access the actions.
  function mkHeaderLActions({ inline = [], more } = {}) {
    const inlineHtml = inline.map(a => {
      if (a.type === 'icon') {
        return `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon sb-header-l-action">${sbIcon(a.icon, 'L')}</button>`;
      }
      // text button
      return `<button type="button" class="sb-btn sb-btn-secondary sb-header-l-action"><span>${a.label}</span></button>`;
    }).join('');

    const hasInline = inline.length > 0;
    const moreItems = (more && more.items) || [];
    if (!hasInline && moreItems.length === 0) return '';

    // Extras = inline actions duplicated as ctx-cells, surfaced only at narrow.
    // All cells in the overflow menu use mode:'action' — clicking executes
    // the action and closes the menu, no .is-selected sticking. Each action
    // carries `icon` (used in the menu cell). For type:'icon', the same icon
    // is reused; for type:'text', `icon` is optional but RECOMMENDED when the
    // dropdown has any other iconed cells (mixing iconed/non-iconed cells in
    // the same card looks inconsistent).
    const extraCells = inline.map(a => {
      const iconLeft = a.icon || (a.type === 'icon' ? a.icon : undefined);
      const cellHtml = sbMkContextCell({ iconLeft, label: a.label, mode: 'action' });
      // mkContextCell returns a <div class="sb-ctx-cell …">; inject the extra class.
      return cellHtml.replace('class="sb-ctx-cell', 'class="sb-ctx-cell sb-header-l-menu-extra');
    }).join('');

    const moreCells = moreItems
      .map(it => sbMkContextCell({ iconLeft: it.icon, label: it.label, mode: 'action' }))
      .join('');

    const moreBlock = `<div class="sb-header-l-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">${sbIcon('more-2-line', 'L')}</button>
      <div class="sb-ctx-card">${extraCells}${moreCells}</div>
    </div>`;

    return inlineHtml + moreBlock;
  }
  window.sbMkHeaderLActions = mkHeaderLActions;

  // ── Playground content builders ───────────────────────────
  const LEFT_SYMBOL_BUILD = {
    none:      () => '',
    infoPop:   () => SB_SVG.infoPop,
    indicator: () => `<span class="sb-status-dot online"></span>`,
  };
  const LEFT_SYMBOL_CODE = {
    none:      null,
    infoPop:   '<!-- Symbol Badge: infoPop SVG 24×24 -->',
    indicator: '<span class="sb-status-dot online"></span>',
  };
  const TITLE_TEXT_L = {
    short:  'Headline',
    medium: 'Page section title',
    long:   'Very long page title that should be truncated with an ellipsis',
  };
  const RIGHT_EXTRA_BUILD = {
    none:      () => '',
    badge:     () => `<span class="sb-badge-status bs-grey">Status</span>`,
    indicator: () => `<span class="sb-status-dot online"></span>`,
  };
  const RIGHT_EXTRA_CODE = {
    none:      null,
    badge:     '<span class="sb-badge-status bs-grey">Status</span>',
    indicator: '<span class="sb-status-dot online"></span>',
  };
  // Default demo items for the More dropdown — shared with other headers
  // via window.SB_DEMO_MORE_ITEMS (defined in context-menu.js).
  const DEMO_MORE_ITEMS = window.SB_DEMO_MORE_ITEMS;

  sbRegister({
    name: 'header-l',
    title: 'Header L',
    description: 'Самый крупный хедер — для Page-уровня. Высота до 88px, padding 16/0, нижняя граница 1px (surface-2). Headline — H5 (28/900/32). Два свободных слота — Left и Right (max 700px каждый, gap 16). Между слотами — justify-content: space-between. Responsive: при ширине Header L < 768px gap сжимается до 8, inline-кнопки правого слота автоматически сворачиваются в выпадающее меню под More-кнопкой (⋯). Caption и Badge-Status остаются видимыми всегда.',
    playground: {
      title: 'Header L Playground',
      wide: true,
      state: {
        backButton: false,
        leftSymbol: 'none',
        titleText: 'short',
        rightCaption: false,
        rightExtra: 'none',
        iconCount: '0',
        actionButton: false,
      },
      controls(pg) {
        // Левая половина — селекты 2×2.
        const selectsHalf = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--gap-vert-m) var(--gap-horiz-m)">
          ${pg.select('leftSymbol', [
            { value: 'none',      label: 'None' },
            { value: 'infoPop',   label: 'Info Pop-up' },
            { value: 'indicator', label: 'Indicator' },
          ], { label: 'Left symbol' })}
          ${pg.select('rightExtra', [
            { value: 'none',      label: 'None' },
            { value: 'badge',     label: 'Badge-Status' },
            { value: 'indicator', label: 'Indicator' },
          ], { label: 'Right badge' })}
          ${pg.select('titleText', [
            { value: 'short',  label: 'Short' },
            { value: 'medium', label: 'Medium' },
            { value: 'long',   label: 'Long' },
          ], { label: 'Headline' })}
          ${pg.select('iconCount', [
            { value: '0', label: '0' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ], { label: 'Icon-only btns' })}
        </div>`;

        // Правая половина — тоглы 2×2.
        const togglesHalf = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--gap-vert-m) var(--gap-horiz-m);align-content:start">
          ${pg.toggle('backButton',   'Back button')}
          ${pg.toggle('rightCaption', 'Caption')}
          ${pg.toggle('actionButton', 'Action button')}
        </div>`;

        // Внешний grid: при широкой панели — две колонки (селекты | тоглы),
        // при узкой — auto-fit перекладывает их вертикально.
        return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:var(--gap-horiz-lg)">
          ${selectsHalf}
          ${togglesHalf}
        </div>`;
      },
      render(s) {
        // Constraints:
        //  • Indicator не может быть одновременно слева и справа — приоритет за левым.
        //  • Badge-Status и Indicator справа взаимоисключают друг друга — UI уже одно из.
        //  • В правом слоте суммарно ≤ 3 кнопок (Icon-Only + Action).
        const leftSym = s.leftSymbol;
        let rightExt = s.rightExtra;
        if (leftSym === 'indicator' && rightExt === 'indicator') rightExt = 'none';

        const wantIcons  = parseInt(s.iconCount, 10) || 0;
        const wantAction = !!s.actionButton;
        const totalBtns  = Math.min(3, wantIcons + (wantAction ? 1 : 0));
        const useAction  = wantAction && totalBtns > 0;
        const useIcons   = totalBtns - (useAction ? 1 : 0);

        // ── Left slot ──
        const leftParts = [];
        if (s.backButton) leftParts.push(`<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>`);
        const leftSymHtml = LEFT_SYMBOL_BUILD[leftSym]();
        if (leftSymHtml) leftParts.push(leftSymHtml);
        const slotLeft = leftParts.join('');

        // ── Right slot ──
        // Static parts (caption + status/indicator) precede dynamic actions.
        const staticParts = [];
        if (s.rightCaption) staticParts.push(`<span class="sb-caption" style="color:var(--text-secondary)">Additional info</span>`);
        const extraHtml = RIGHT_EXTRA_BUILD[rightExt]();
        if (extraHtml) staticParts.push(extraHtml);

        // Build inline action descriptors from playground state.
        const inline = [];
        for (let i = 0; i < useIcons; i++) {
          inline.push({ type: 'icon', icon: i === 0 ? 'add-line' : 'more-2-line', label: i === 0 ? 'Add' : 'More' });
        }
        if (useAction) inline.push({ type: 'text', label: 'Action', icon: 'arrow-right-s-line' });

        // The More button + dropdown is always rendered when there are actions
        // (or always, even when none — to demo the responsive collapse).
        const actionsHtml = mkHeaderLActions({ inline, more: { items: DEMO_MORE_ITEMS } });
        const slotRight = staticParts.join('') + actionsHtml;

        return `<div style="background:var(--surface-1);padding:var(--pad-vert-16);border-radius:var(--radius-12);width:100%;box-sizing:border-box">
          ${mkHeaderL({ slotLeft, title: TITLE_TEXT_L[s.titleText], slotRight })}
        </div>`;
      },
      genCode(s) {
        const leftSym = s.leftSymbol;
        let rightExt = s.rightExtra;
        if (leftSym === 'indicator' && rightExt === 'indicator') rightExt = 'none';

        const wantIcons  = parseInt(s.iconCount, 10) || 0;
        const wantAction = !!s.actionButton;
        const totalBtns  = Math.min(3, wantIcons + (wantAction ? 1 : 0));
        const useAction  = wantAction && totalBtns > 0;
        const useIcons   = totalBtns - (useAction ? 1 : 0);

        // Left
        const leftLines = [];
        if (s.backButton) leftLines.push(`<button type="button" class="sb-btn sb-btn-secondary">\n      <!-- arrow-left-s-line L -->\n      <span>Back</span>\n    </button>`);
        const leftSymCode = LEFT_SYMBOL_CODE[leftSym];
        if (leftSymCode) leftLines.push(leftSymCode);
        leftLines.push(`<span class="sb-header-l-title sb-h5">${TITLE_TEXT_L[s.titleText]}</span>`);
        const leftInner = leftLines.map(l => '    ' + l).join('\n');

        // Right
        const rightLines = [];
        if (s.rightCaption) rightLines.push(`<span class="sb-caption">Additional info</span>`);
        const extraCode = RIGHT_EXTRA_CODE[rightExt];
        if (extraCode) rightLines.push(extraCode);

        // Inline actions (visible @ wide, hidden @ narrow via .sb-header-l-action)
        for (let i = 0; i < useIcons; i++) {
          const iconName = i === 0 ? 'add-line' : 'more-2-line';
          rightLines.push(`<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon sb-header-l-action">\n      <!-- ${iconName} L -->\n    </button>`);
        }
        if (useAction) rightLines.push(`<button type="button" class="sb-btn sb-btn-secondary sb-header-l-action">\n      <span>Action</span>\n    </button>`);

        // More button + dropdown (always rendered)
        const extraCellsCode = [];
        for (let i = 0; i < useIcons; i++) {
          const iconName = i === 0 ? 'add-line' : 'more-2-line';
          const lbl = i === 0 ? 'Add' : 'More';
          extraCellsCode.push(`<div class="sb-ctx-cell is-action sb-header-l-menu-extra" onclick="sbActionContextCell(this)">\n        <span class="sb-ctx-cell-icon-left"><!-- ${iconName} L --></span>\n        <span class="sb-ctx-cell-label sb-title-m-bold">${lbl}</span>\n        <span class="sb-ctx-cell-right"><span class="sb-ctx-cell-icon-check"><!-- check-line S --></span></span>\n      </div>`);
        }
        if (useAction) extraCellsCode.push(`<div class="sb-ctx-cell is-action sb-header-l-menu-extra" onclick="sbActionContextCell(this)">\n        <span class="sb-ctx-cell-icon-left"><!-- arrow-right-s-line L --></span>\n        <span class="sb-ctx-cell-label sb-title-m-bold">Action</span>\n        <span class="sb-ctx-cell-right"><span class="sb-ctx-cell-icon-check"><!-- check-line S --></span></span>\n      </div>`);
        const nativeCellsCode = DEMO_MORE_ITEMS.map(it =>
          `<div class="sb-ctx-cell is-action" onclick="sbActionContextCell(this)">\n        <span class="sb-ctx-cell-icon-left"><!-- ${it.icon} L --></span>\n        <span class="sb-ctx-cell-label sb-title-m-bold">${it.label}</span>\n        <span class="sb-ctx-cell-right"><span class="sb-ctx-cell-icon-check"><!-- check-line S --></span></span>\n      </div>`
        );
        const cardCells = extraCellsCode.concat(nativeCellsCode).join('\n      ');
        rightLines.push(`<div class="sb-header-l-more sb-overflow-menu">\n      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"\n              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">\n        <!-- more-2-line L -->\n      </button>\n      <div class="sb-ctx-card">\n      ${cardCells}\n      </div>\n    </div>`);

        const rightInner = rightLines.map(l => '    ' + l).join('\n');
        const rightBlock = rightLines.length
          ? `\n  <div class="sb-header-l-right">\n${rightInner}\n  </div>`
          : '';

        const html = `<div class="sb-header-l">
  <div class="sb-header-l-left">
${leftInner}
  </div>${rightBlock}
</div>`;
        return { html, css: COMP_CSS.headerL };
      },
    },
    sections: [
      {
        title: 'Anatomy',
        desc: 'Корневой контейнер до 88px / row-flex / space-between / без скругления / нижняя граница 1px surface-2 / bg --background. Слева: Info Pop-up + Headline. Справа: Status + More-кнопка (⋯) с прикреплённым выпадающим меню.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:720px">
          ${mkHeaderL({
            slotLeft: `${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status bs-grey">Status</span>${mkHeaderLActions({ more: { items: DEMO_MORE_ITEMS } })}`,
          })}
        </div>`,
        html: `<div class="sb-header-l">
  <div class="sb-header-l-left">
    <!-- Symbol Badge: infoPop SVG 24×24 -->
    <span class="sb-header-l-title sb-h5">Headline</span>
  </div>
  <div class="sb-header-l-right">
    <span class="sb-badge-status bs-grey">Status</span>
    <div class="sb-header-l-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
        <!-- more-2-line L -->
      </button>
      <div class="sb-ctx-card">
        <!-- ctx-cells: Copy / Download / Send via email -->
      </div>
    </div>
  </div>
</div>`,
        css: COMP_CSS.headerL,
      },
      {
        title: 'Title only',
        desc: 'Простейший вариант — только заголовок в левом слоте, без правого.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:720px">
          ${mkHeaderL({
            title: 'Headline',
          })}
        </div>`,
        html: `<div class="sb-header-l">
  <div class="sb-header-l-left">
    <span class="sb-header-l-title sb-h5">Headline</span>
  </div>
</div>`,
        css: COMP_CSS.headerL,
      },
      {
        title: 'Navigation pattern (Back button)',
        desc: 'Типичный сценарий: Secondary-Button с указателем «назад» в левом слоте, справа — Status, primary Action и More-кнопка с дополнительными опциями.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:720px">
          ${mkHeaderL({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status bs-grey">Status</span>${mkHeaderLActions({
              inline: [{ type: 'text', label: 'Action', icon: 'arrow-right-s-line' }],
              more:   { items: DEMO_MORE_ITEMS },
            })}`,
          })}
        </div>`,
        html: `<div class="sb-header-l">
  <div class="sb-header-l-left">
    <button type="button" class="sb-btn sb-btn-secondary">
      <!-- arrow-left-s-line L -->
      <span>Back</span>
    </button>
    <span class="sb-header-l-title sb-h5">Headline</span>
  </div>
  <div class="sb-header-l-right">
    <span class="sb-badge-status bs-grey">Status</span>
    <button type="button" class="sb-btn sb-btn-secondary sb-header-l-action">
      <span>Action</span>
    </button>
    <div class="sb-header-l-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
        <!-- more-2-line L -->
      </button>
      <div class="sb-ctx-card">
        <!-- extras (visible @narrow): Action -->
        <!-- native: Copy / Download / Send via email -->
      </div>
    </div>
  </div>
</div>`,
        css: COMP_CSS.headerL,
      },
      {
        title: 'Full slot composition',
        desc: 'Максимальное наполнение: слева Back + Info Pop-up + Headline; справа Caption + Status + inline Add (icon) + inline Action (text) + More-кнопка с дополнительным набором. При сжатии Header L < 768px — Add и Action автоматически сворачиваются в выпадающее меню под More, gap слотов сжимается до 8 px. Caption и Status остаются видимыми всегда.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:960px">
          ${mkHeaderL({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<span class="sb-caption" style="color:var(--text-secondary)">Additional info</span><span class="sb-badge-status bs-grey">Status</span>${mkHeaderLActions({
              inline: [
                { type: 'icon', icon: 'add-line', label: 'Add' },
                { type: 'text', label: 'Action', icon: 'arrow-right-s-line' },
              ],
              more: { items: DEMO_MORE_ITEMS },
            })}`,
          })}
        </div>`,
        html: `<div class="sb-header-l">
  <div class="sb-header-l-left">
    <button type="button" class="sb-btn sb-btn-secondary">
      <!-- arrow-left-s-line L -->
      <span>Back</span>
    </button>
    <!-- Symbol Badge: infoPop SVG 24×24 -->
    <span class="sb-header-l-title sb-h5">Headline</span>
  </div>
  <div class="sb-header-l-right">
    <span class="sb-caption">Additional info</span>
    <span class="sb-badge-status bs-grey">Status</span>
    <!-- inline actions: hidden @ narrow -->
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon sb-header-l-action">
      <!-- add-line L -->
    </button>
    <button type="button" class="sb-btn sb-btn-secondary sb-header-l-action">
      <span>Action</span>
    </button>
    <!-- More button + dropdown card -->
    <div class="sb-header-l-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
        <!-- more-2-line L -->
      </button>
      <div class="sb-ctx-card">
        <!-- extras (visible @narrow): Add, Action -->
        <!-- native: Copy / Download / Send via email -->
      </div>
    </div>
  </div>
</div>`,
        css: COMP_CSS.headerL,
      },
    ],
  });
})();
