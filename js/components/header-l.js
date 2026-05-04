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

.sb-header-l-right {
  justify-content: flex-end;
}

.sb-header-l-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`;

// --- HEADER L ---
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

  sbRegister({
    name: 'header-l',
    title: 'Header L',
    description: 'Самый крупный хедер — для Page-уровня. Высота до 88px, padding 16/0, нижняя граница 1px (surface-2). Headline — H5 (28/900/32). Два свободных слота — Left и Right (max 700px каждый, gap 16). Между слотами — justify-content: space-between.',
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

        // ── Right slot (caption → extra → icons → action) ──
        const rightParts = [];
        if (s.rightCaption) rightParts.push(`<span class="sb-caption" style="color:var(--text-secondary)">Additional info</span>`);
        const extraHtml = RIGHT_EXTRA_BUILD[rightExt]();
        if (extraHtml) rightParts.push(extraHtml);
        for (let i = 0; i < useIcons; i++) {
          const icon = i === 0 ? 'add-line' : 'more-2-line';
          rightParts.push(`<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon(icon, 'L')}</button>`);
        }
        if (useAction) rightParts.push(`<button type="button" class="sb-btn sb-btn-secondary"><span>Action</span></button>`);
        const slotRight = rightParts.join('');

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

        // Left lines
        const leftLines = [];
        if (s.backButton) leftLines.push(`<button type="button" class="sb-btn sb-btn-secondary">\n      <!-- arrow-left-s-line L -->\n      <span>Back</span>\n    </button>`);
        const leftSymCode = LEFT_SYMBOL_CODE[leftSym];
        if (leftSymCode) leftLines.push(leftSymCode);
        leftLines.push(`<span class="sb-header-l-title sb-h5">${TITLE_TEXT_L[s.titleText]}</span>`);
        const leftInner = leftLines.map(l => '    ' + l).join('\n');

        // Right lines
        const rightLines = [];
        if (s.rightCaption) rightLines.push(`<span class="sb-caption">Additional info</span>`);
        const extraCode = RIGHT_EXTRA_CODE[rightExt];
        if (extraCode) rightLines.push(extraCode);
        for (let i = 0; i < useIcons; i++) {
          const iconName = i === 0 ? 'add-line' : 'more-2-line';
          rightLines.push(`<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">\n      <!-- ${iconName} L -->\n    </button>`);
        }
        if (useAction) rightLines.push(`<button type="button" class="sb-btn sb-btn-secondary">\n      <span>Action</span>\n    </button>`);
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
        desc: 'Корневой контейнер до 88px / row-flex / space-between / без скругления / нижняя граница 1px surface-2 / bg --background. Слева: Info Pop-up + Headline. Справа: Status + Icon-Only (more).',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:720px">
          ${mkHeaderL({
            slotLeft: `${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status bs-grey">Status</span><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button>`,
          })}
        </div>`,
        html: `<div class="sb-header-l">
  <div class="sb-header-l-left">
    <!-- Symbol Badge: infoPop SVG 24×24 -->
    <span class="sb-header-l-title sb-h5">Headline</span>
  </div>
  <div class="sb-header-l-right">
    <span class="sb-badge-status bs-grey">Status</span>
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
      <!-- more-2-line L -->
    </button>
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
        desc: 'Типичный сценарий: Secondary-Button с указателем «назад» в левом слоте, справа — Status, Icon-Only (more) и Action button.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:720px">
          ${mkHeaderL({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status bs-grey">Status</span><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button><button type="button" class="sb-btn sb-btn-secondary"><span>Action</span></button>`,
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
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
      <!-- more-2-line L -->
    </button>
    <button type="button" class="sb-btn sb-btn-secondary">
      <span>Action</span>
    </button>
  </div>
</div>`,
        css: COMP_CSS.headerL,
      },
      {
        title: 'Full slot composition',
        desc: 'Разумный максимум по UX-правилам: слева Back + Info Pop-up + Headline; справа Additional info (caption) + Badge-Status + до 3 кнопок (Icon-Only × 2 + Action). Нельзя одновременно Indicator слева и справа — выбираем что-то одно. И нельзя одновременно Badge-Status и Indicator в правом слоте — тоже выбираем одно.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:960px">
          ${mkHeaderL({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<span class="sb-caption" style="color:var(--text-secondary)">Additional info</span><span class="sb-badge-status bs-grey">Status</span><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('add-line', 'L')}</button><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button><button type="button" class="sb-btn sb-btn-secondary"><span>Action</span></button>`,
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
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
      <!-- add-line L -->
    </button>
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
      <!-- more-2-line L -->
    </button>
    <button type="button" class="sb-btn sb-btn-secondary">
      <span>Action</span>
    </button>
  </div>
</div>`,
        css: COMP_CSS.headerL,
      },
    ],
  });
})();
