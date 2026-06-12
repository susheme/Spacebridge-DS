// ═══════════════════════════════════════════════════════════════════════════
//  HEADER M
//  CSS в css/components/header-m.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.headerM = `.sb-header-m {
  display: flex;
  width: 100%;
  min-width: var(--header-min-width);
  max-width: var(--header-max-width);
  min-height: var(--header-min-height-m);
  max-height: var(--header-max-height-m);
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-0);
  background: var(--background);
  container-type: inline-size;
}

.sb-header-m-left,
.sb-header-m-right {
  display: flex;
  max-width: var(--nav-menu-max-width-right-content);
  min-height: var(--header-m-row-height);
  max-height: var(--header-m-row-height);
  align-items: center;
  gap: var(--gap-vert-s);
  color: var(--text-tertiary);
}

.sb-header-m-left {
  flex: 1 1 0;
  min-width: 0;
}
.sb-header-m-right {
  flex-shrink: 0;
  justify-content: flex-end;
}
.sb-header-m-right .sb-caption { white-space: nowrap; }

.sb-header-m-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sb-header-m-more { flex-shrink: 0; }
.sb-header-m-menu-extra { display: none; }

@container (max-width: 600px) {
  .sb-header-m-action     { display: none; }
  .sb-header-m-menu-extra { display: flex; }
}`;

// --- HEADER M ---
// Overflow-menu open/close, click-outside, scroll-close, and the global
// SB_DEMO_MORE_ITEMS list live in context-menu.js (generic for any
// .sb-overflow-menu wrapper).
(() => {
  function mkHeaderM({ slotLeft, title, slotRight } = {}) {
    const hasLeft  = slotLeft  != null && slotLeft  !== false && slotLeft  !== '';
    const hasTitle = title     != null && title     !== false && title     !== '';
    const hasRight = slotRight != null && slotRight !== false && slotRight !== '';

    const titleEl = hasTitle ? `<span class="sb-header-m-title sb-h6">${title}</span>` : '';
    const leftInner = (hasLeft ? slotLeft : '') + titleEl;
    const left = leftInner ? `<div class="sb-header-m-left">${leftInner}</div>` : '';
    const right = hasRight ? `<div class="sb-header-m-right">${slotRight}</div>` : '';

    return `<div class="sb-header-m">${left}${right}</div>`;
  }

  // Expose helper для будущих хедеров и dev-консоли.
  window.sbMkHeaderM = mkHeaderM;

  // ── Actions builder ──────────────────────────────────────────────
  // Same shape as mkHeaderLActions: inline buttons (visible wide / hidden
  // narrow), More button with dropdown card containing native items + the
  // surfaced inline actions (.sb-header-m-menu-extra).
  function mkHeaderMActions({ inline = [], more } = {}) {
    const inlineHtml = inline.map(a => {
      if (a.type === 'icon') {
        return `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon sb-header-m-action">${sbIcon(a.icon, 'L')}</button>`;
      }
      return `<button type="button" class="sb-btn sb-btn-secondary sb-header-m-action"><span>${a.label}</span></button>`;
    }).join('');

    const hasInline = inline.length > 0;
    const moreItems = (more && more.items) || [];
    if (!hasInline && moreItems.length === 0) return '';

    const extraCells = inline.map(a => {
      const iconLeft = a.icon || (a.type === 'icon' ? a.icon : undefined);
      const cellHtml = sbMkContextCell({ iconLeft, label: a.label, mode: 'action' });
      return cellHtml.replace('class="sb-ctx-cell', 'class="sb-ctx-cell sb-header-m-menu-extra');
    }).join('');

    const moreCells = moreItems
      .map(it => sbMkContextCell({ iconLeft: it.icon, label: it.label, mode: 'action' }))
      .join('');

    return inlineHtml + `<div class="sb-header-m-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">${sbIcon('more-2-line', 'L')}</button>
      <div class="sb-ctx-card">${extraCells}${moreCells}</div>
    </div>`;
  }
  window.sbMkHeaderMActions = mkHeaderMActions;

  const DEMO_MORE_ITEMS = window.SB_DEMO_MORE_ITEMS;

  // ── Title text presets — short/medium/long для playground'а. ─────────
  const HM_TITLE = {
    short:  'Headline',
    medium: 'Section Headline',
    long:   'Very Long Section Headline With Many Words',
  };

  sbRegister({
    name: 'header-m',
    title: 'Header M',
    description: 'Используется для Page Blocks, Modals и Cards. Горизонтальный наладдер 56-64px высотой без border-radius (живёт внутри других контейнеров). Два свободных слота — Left и Right (max 700px каждый, gap 8). Заголовок — H6 (24/900). Между слотами — justify-content: space-between. Responsive: при ширине Header M < 600px inline-кнопки правого слота автоматически сворачиваются в выпадающее меню под More-кнопкой (⋯). Caption и Status остаются видимыми.',
    playground: {
      title: 'Header M Playground',
      wide: true,
      state: {
        backButton:    false,
        leftSymbol:    'infoPop',  // 'none' | 'infoPop'
        titleText:     'short',
        rightStatus:   true,
        iconCount:     '0',  // '0' | '1' | '2'
        actionButton:  false,
        chevron:       false,
        subNav:        'none',  // none | segment | tab-bar | led
        toolBarEnable: false,
        compact:       false,   // false → wide stage 1200px; true → 480px (триггерит @container < 600)
      },
      controls(pg) {
        return `<div class="pg-group">
            <div class="pg-group-title sb-field-label">Left Slot</div>
            <div class="pg-group-body">
              ${pg.select('leftSymbol', [
                { value: 'none',    label: 'None' },
                { value: 'infoPop', label: 'Info Pop-up' },
              ], { label: 'Symbol' })}
              ${pg.select('titleText', [
                { value: 'short',  label: 'Short'  },
                { value: 'medium', label: 'Medium' },
                { value: 'long',   label: 'Long'   },
              ], { label: 'Headline' })}
              <div class="pg-toggles">
                ${pg.toggle('backButton', 'Back button')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Right Slot</div>
            <div class="pg-group-body">
              ${pg.select('iconCount', [
                { value: '0', label: '0' },
                { value: '1', label: '1' },
                { value: '2', label: '2' },
              ], { label: 'Icon-only btns' })}
              <div class="pg-toggles">
                ${pg.toggle('rightStatus',  'Status')}
                ${pg.toggle('actionButton', 'Action btn')}
                ${pg.toggle('chevron',      'Chevron')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Composition</div>
            <div class="pg-group-body">
              ${pg.select('subNav', [
                { value: 'none',    label: 'None' },
                { value: 'segment', label: 'Segment Menu' },
                { value: 'tab-bar', label: 'Tab Bar' },
                { value: 'led',     label: 'LED Panel' },
              ], { label: 'Sub Nav' })}
              <div class="pg-toggles">
                ${pg.toggle('toolBarEnable', 'Tool Bar')}
                ${pg.toggle('compact', 'Compact')}
              </div>
            </div>
          </div>`;
      },
      render(s) {
        const wantIcons  = parseInt(s.iconCount, 10) || 0;
        const wantAction = !!s.actionButton;
        const totalBtns  = Math.min(3, wantIcons + (wantAction ? 1 : 0));
        const useAction  = wantAction && totalBtns > 0;
        const useIcons   = totalBtns - (useAction ? 1 : 0);

        // ── Left slot ──
        const leftParts = [];
        if (s.backButton) leftParts.push(`<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>`);
        if (s.leftSymbol === 'infoPop') leftParts.push(SB_SVG.infoPop);
        const slotLeft = leftParts.join('');

        // ── Right slot ──
        const staticParts = [];
        if (s.rightStatus) staticParts.push(`<span class="sb-badge-status mini bs-grey">Status</span>`);
        const inline = [];
        for (let i = 0; i < useIcons; i++) {
          inline.push({ type: 'icon', icon: i === 0 ? 'add-line' : 'more-2-line', label: i === 0 ? 'Add' : 'More' });
        }
        if (useAction) inline.push({ type: 'text', label: 'Action', icon: 'arrow-right-s-line' });
        const actionsHtml = mkHeaderMActions({ inline, more: { items: DEMO_MORE_ITEMS } });
        const chevronHtml = s.chevron ? `<div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>` : '';
        const slotRight = staticParts.join('') + actionsHtml + chevronHtml;

        // ── Optional Sub Nav (4 варианта) + Tool Bar ──
        const subNavHtml = (() => {
          if (s.subNav === 'none' || typeof sbMkSubNav !== 'function') return '';
          if (s.subNav === 'segment' && typeof sbMkSegmentMenu === 'function') {
            return sbMkSubNav({ content: sbMkSegmentMenu(['Item', 'Item', 'Item'], { selectedIndex: 1 }) });
          }
          if (s.subNav === 'tab-bar' && typeof sbMkTabBar === 'function') {
            return sbMkSubNav({ content: `<div style="width:360px">${sbMkTabBar(['Section', 'Section', 'Section'], { selectedIndex: 0 })}</div>`, variant: 'tab-bar' });
          }
          if (s.subNav === 'led' && typeof sbMkLedPanel === 'function') {
            return sbMkSubNav({ content: sbMkLedPanel([
              { name: 'CPU',   status: 'online'  },
              { name: 'NET',   status: 'warning' },
              { name: 'FAULT', status: 'error'   },
            ]), variant: 'led' });
          }
          return '';
        })();
        const toolBarHtml = s.toolBarEnable && typeof sbMkToolBar === 'function'
          ? sbMkToolBar({
              left: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('add-line', 'L')}</button><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button>`,
              right: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('search-line', 'L')}</button>`,
            })
          : '';

        // Stage — паттерн Nav Bar (см. header-l.js / nav-bar.js):
        //   compact=false → фикс 1200px, горизонтальный скролл через wrapper.
        //   compact=true  → 480px по центру (< 600px container breakpoint) —
        //                   inline-кнопки сворачиваются в More.
        const stageStyle = s.compact
          ? 'width:100%;max-width:480px;margin:0 auto;'
          : 'width:1200px;';
        return `<div data-pg-preserve-scroll style="width:100%;overflow-x:auto;padding-bottom:var(--pad-vert-16)">
          <div style="${stageStyle}background:var(--surface-1);padding:var(--pad-vert-16);border-radius:var(--radius-12);box-sizing:border-box">
            ${mkHeaderM({ slotLeft, title: HM_TITLE[s.titleText], slotRight })}
            ${subNavHtml}
            ${toolBarHtml}
          </div>
        </div>`;
      },
      genCode(s) {
        return {
          html: `<!-- См. js/components/header-m.js — sbMkHeaderM({ slotLeft, title, slotRight }) + опционально sbMkSubNav + sbMkToolBar ниже. -->`,
          css: COMP_CSS.headerM,
        };
      },
    },
    sections: [
      {
        title: 'Anatomy',
        desc: 'Корневой контейнер 56-64px / row-flex / space-between / без скругления / bg --background. Слева: Info Pop-up + Headline. Справа: Status mini + More-кнопка с прикреплённым выпадающим меню.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:600px">
          ${mkHeaderM({
            slotLeft: `${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status mini bs-grey">Status</span>${mkHeaderMActions({ more: { items: DEMO_MORE_ITEMS } })}`,
          })}
        </div>`,
        html: `<div class="sb-header-m">
  <div class="sb-header-m-left">
    <!-- Symbol Badge: infoPop SVG 24×24 -->
    <span class="sb-header-m-title sb-h6">Headline</span>
  </div>
  <div class="sb-header-m-right">
    <span class="sb-badge-status mini bs-grey">Status</span>
    <div class="sb-header-m-more sb-overflow-menu">
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
        css: COMP_CSS.headerM,
      },
      {
        title: 'Title only',
        desc: 'Простейший вариант — только заголовок в левом слоте, без правого.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:600px">
          ${mkHeaderM({
            title: 'Headline',
          })}
        </div>`,
        html: `<div class="sb-header-m">
  <div class="sb-header-m-left">
    <span class="sb-header-m-title sb-h6">Headline</span>
  </div>
</div>`,
        css: COMP_CSS.headerM,
      },
      {
        title: 'Navigation pattern (Back button + collapsible)',
        desc: 'Типичный сценарий: Secondary-Button «назад» в левом слоте, справа — Status, More-кнопка с дополнительными опциями и Chevron (collapsible).',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:600px">
          ${mkHeaderM({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status mini bs-grey">Status</span>${mkHeaderMActions({ more: { items: DEMO_MORE_ITEMS } })}<div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
          })}
        </div>`,
        html: `<div class="sb-header-m">
  <div class="sb-header-m-left">
    <button type="button" class="sb-btn sb-btn-secondary">
      <!-- arrow-left-s-line L -->
      <span>Back</span>
    </button>
    <span class="sb-header-m-title sb-h6">Headline</span>
  </div>
  <div class="sb-header-m-right">
    <span class="sb-badge-status mini bs-grey">Status</span>
    <div class="sb-header-m-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
        <!-- more-2-line L -->
      </button>
      <div class="sb-ctx-card">
        <!-- ctx-cells: Copy / Download / Send via email -->
      </div>
    </div>
    <div class="sb-chevron"><!-- arrow-down-s-line L --></div>
  </div>
</div>`,
        css: COMP_CSS.headerM,
      },
      {
        title: 'Full slot composition',
        desc: 'Максимальное наполнение: слева Back + Indicator + Info Pop-up + Headline; справа Caption + Status + inline Add (icon) + inline Action (text) + More-кнопка с дополнительным набором + Chevron. При сжатии Header M < 600px — Add и Action автоматически сворачиваются в выпадающее меню под More.',
        preview: `<div style="width:100%;overflow-x:auto;padding-bottom:var(--pad-vert-16)"><div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:900px">
          ${mkHeaderM({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button><span class="sb-status-dot online"></span>${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<span class="sb-caption" style="color:var(--text-secondary)">Additional info</span><span class="sb-badge-status mini bs-grey">Status</span>${mkHeaderMActions({
              inline: [
                { type: 'icon', icon: 'add-line', label: 'Add' },
                { type: 'text', label: 'Action', icon: 'arrow-right-s-line' },
              ],
              more: { items: DEMO_MORE_ITEMS },
            })}<div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
          })}
        </div></div>`,
        html: `<div class="sb-header-m">
  <div class="sb-header-m-left">
    <button type="button" class="sb-btn sb-btn-secondary">
      <!-- arrow-left-s-line L -->
      <span>Back</span>
    </button>
    <span class="sb-status-dot online"></span>
    <!-- Symbol Badge: infoPop SVG 24×24 -->
    <span class="sb-header-m-title sb-h6">Headline</span>
  </div>
  <div class="sb-header-m-right">
    <span class="sb-caption">Additional info</span>
    <span class="sb-badge-status mini bs-grey">Status</span>
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon sb-header-m-action">
      <!-- add-line L -->
    </button>
    <button type="button" class="sb-btn sb-btn-secondary sb-header-m-action">
      <span>Action</span>
    </button>
    <div class="sb-header-m-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
        <!-- more-2-line L -->
      </button>
      <div class="sb-ctx-card">
        <!-- extras (visible @narrow): Add, Action -->
        <!-- native: Copy / Download / Send via email -->
      </div>
    </div>
    <div class="sb-chevron"><!-- arrow-down-s-line L --></div>
  </div>
</div>`,
        css: COMP_CSS.headerM,
      },
      {
        title: 'Composition: + Sub Nav + Tool Bar',
        desc: 'Header M в композиции с Sub Nav и Tool Bar — стандартный chrome для основных рабочих страниц приложения: заголовок, навигация по разделам, action-полоска.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;box-sizing:border-box">
          ${mkHeaderM({
            slotLeft: SB_SVG.infoPop,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status mini bs-grey">Status</span>${mkHeaderMActions({ more: { items: DEMO_MORE_ITEMS } })}`,
          })}
          ${(typeof sbMkSubNav === 'function' && typeof sbMkTabBar === 'function')
            ? sbMkSubNav({ content: `<div style="width:360px">${sbMkTabBar(['Section', 'Section', 'Section'], { selectedIndex: 0 })}</div>`, variant: 'tab-bar' })
            : ''}
          ${(typeof sbMkToolBar === 'function') ? sbMkToolBar({
            left: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('add-line', 'L')}</button><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button>`,
            right: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('search-line', 'L')}</button>`,
          }) : ''}
        </div>`,
        html: `<div class="sb-header-m">…</div>
<header class="sb-sub-nav">
  <!-- sbMkTabBar([...]) -->
</header>
<div class="sb-tool-bar">
  <div class="sb-tool-bar-left">…</div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right">…</div>
</div>`,
        css: COMP_CSS.headerM,
      },
    ],
  });
})();
