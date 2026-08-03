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
/* divider — опциональный нижний бордер (separator). Toggled через sbMkHeaderM({divider:true}). */
.sb-header-m.has-divider { border-bottom: var(--border-width-1) solid var(--border-soft); }

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
}
.sb-header-m-narrow .sb-header-m-menu-extra { display: flex; }`;

// --- HEADER M ---
// Позиционирование и поведение More-меню держит примитив Popover
// (sbMkPopover): flip, shift, portal в <body>. Header M отдаёт ему только
// содержимое карточки и свой класс на обёртку. Общий список
// SB_DEMO_MORE_ITEMS живёт в context-menu.js.
(() => {
  function mkHeaderM({ slotLeft, title, slotRight, divider = false } = {}) {
    const hasLeft  = slotLeft  != null && slotLeft  !== false && slotLeft  !== '';
    const hasTitle = title     != null && title     !== false && title     !== '';
    const hasRight = slotRight != null && slotRight !== false && slotRight !== '';

    const titleEl = hasTitle ? `<span class="sb-header-m-title sb-h6">${title}</span>` : '';
    const leftInner = (hasLeft ? slotLeft : '') + titleEl;
    const left = leftInner ? `<div class="sb-header-m-left">${leftInner}</div>` : '';
    const right = hasRight ? `<div class="sb-header-m-right">${slotRight}</div>` : '';

    // divider — нижний бордер (separator). Default OFF: Header M живёт внутри
    // разных контейнеров, линия включается потребителем по месту.
    const cls = 'sb-header-m' + (divider ? ' has-divider' : '');
    return `<div class="${cls}">${left}${right}</div>`;
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

    return inlineHtml + sbMkPopover({
      wrapCls: 'sb-header-m-more',
      trigger: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button>`,
      content: sbMkContextCard(extraCells + moreCells),
      placement: 'bottom-end',
      onOpen: 'sbHeaderMSyncMenu',
    });
  }
  window.sbMkHeaderMActions = mkHeaderMActions;

  // Зеркала inline-действий в меню. @container прячет inline-кнопки на узком
  // хедере и показывает их копии в карточке — но Popover уносит карточку
  // порталом в <body>, где @container хедера её уже не достаёт. Поэтому
  // состояние снимаем с хедера в момент открытия: inline-кнопка скрыта →
  // хедер узкий → ставим на панель .sb-header-m-narrow (правило в header-m.css).
  window.sbHeaderMSyncMenu = function(pop, anchor) {
    const hdr = anchor.closest('.sb-header-m');
    const act = hdr && hdr.querySelector('.sb-header-m-action');
    pop.classList.toggle('sb-header-m-narrow',
      !!act && getComputedStyle(act).display === 'none');
  };

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
    description: sbT(
      'A mid-size header for page blocks, modals and cards. It always sits inside another container, so it has no rounded corners of its own. Two flexible slots — Left and Right — are pushed to opposite edges; on narrow widths, inline buttons in the right slot collapse into the More (⋯) dropdown while the caption and status stay visible.',
      'Средний хедер — для блоков страницы, модалок и карточек. Всегда находится внутри другого контейнера, поэтому собственных скруглений не имеет. Два свободных слота — Left и Right — разведены по краям; на узкой ширине inline-кнопки правого слота сворачиваются в меню под More-кнопкой (⋯), caption и статус остаются видимыми.'
    ),
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
        return `${sbPgGroup('Left Slot', `
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
          `)}
          ${sbPgGroup('Right Slot', `
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
          `)}
          ${sbPgGroup('Composition', `
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
          `)}`;
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
        const chevronHtml = s.chevron ? sbMkChevron() : '';
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
        title: sbT('Anatomy', 'Анатомия'),
        desc: sbT(
          'A single row with content at opposite edges: an Info Pop-up and the headline on the left, a mini status and the More button with an attached dropdown menu on the right.',
          'Одна строка с содержимым по краям: слева Info Pop-up и заголовок, справа Status mini и More-кнопка с прикреплённым выпадающим меню.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Root:</b>'
          + '<ul><li>Height: 56–64px;</li><li>Row-flex, space-between;</li><li>No border-radius;</li><li>Background: --background.</li></ul>'
          + '<b>Typography:</b>'
          + '<ul><li>Headline — H6 (24 / 900).</li></ul>'
          + '<b>Slots:</b>'
          + '<ul><li>Up to 700px each;</li><li>Gap: 8.</li></ul>'
          + '<b>Behavior:</b>'
          + '<ul><li>Breakpoint 600px: right-slot inline buttons collapse behind More (⋯).</li></ul>',
          '<b>Корень:</b>'
          + '<ul><li>Высота: 56–64px;</li><li>Row-flex, space-between;</li><li>Без скругления;</li><li>Фон: --background.</li></ul>'
          + '<b>Типографика:</b>'
          + '<ul><li>Headline — H6 (24 / 900).</li></ul>'
          + '<b>Слоты:</b>'
          + '<ul><li>До 700px каждый;</li><li>Gap: 8.</li></ul>'
          + '<b>Поведение:</b>'
          + '<ul><li>Breakpoint 600px: inline-кнопки правого слота сворачиваются под More (⋯).</li></ul>'
        )),
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
    <span class="sb-popover-wrap sb-header-m-more" onclick="sbPopoverToggle(this, event)">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
        <!-- more-2-line L -->
      </button>
      <div class="sb-popover" role="dialog" tabindex="-1"
           data-placement="bottom-end" data-side="bottom">
        <div class="sb-ctx-card">
          <!-- ctx-cells: Copy / Download / Send via email -->
        </div>
      </div>
    </span>
  </div>
</div>`,
        css: COMP_CSS.headerM,
      },
      {
        title: sbT('Title only', 'Только тайтл'),
        desc: sbT(
          'The minimal configuration — only the headline in the left slot, no right slot.',
          'Минимальная конфигурация — только заголовок в левом слоте, без правого.'
        ),
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
        title: sbT('Navigation pattern (Back button + collapsible)', 'Паттерн навигации (кнопка «Назад» + сворачивание)'),
        desc: sbT(
          'A typical pattern: a Secondary back button in the left slot; a status, the More button with secondary options and a chevron (collapsible) on the right.',
          'Типичный паттерн: Secondary-кнопка «назад» в левом слоте; справа — статус, More-кнопка с второстепенными действиями и шеврон (collapsible).'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:600px">
          ${mkHeaderM({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status mini bs-grey">Status</span>${mkHeaderMActions({ more: { items: DEMO_MORE_ITEMS } })}${sbMkChevron()}`,
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
    <span class="sb-popover-wrap sb-header-m-more" onclick="sbPopoverToggle(this, event)">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
        <!-- more-2-line L -->
      </button>
      <div class="sb-popover" role="dialog" tabindex="-1"
           data-placement="bottom-end" data-side="bottom">
        <div class="sb-ctx-card">
          <!-- ctx-cells: Copy / Download / Send via email -->
        </div>
      </div>
    </span>
    <div class="sb-chevron"><!-- arrow-down-s-line L --></div>
  </div>
</div>`,
        css: COMP_CSS.headerM,
      },
      {
        title: sbT('Full slot composition', 'Полная композиция слотов'),
        desc: sbT(
          'Every slot filled: Back, an indicator, an Info Pop-up and the headline on the left; a caption, a status, inline Add (icon), inline Action (text), the More button and a chevron on the right.',
          'Максимальное наполнение: слева Back, индикатор, Info Pop-up и заголовок; справа caption, статус, inline Add (иконка), inline Action (текст), More-кнопка и шеврон.'
        ) + sbDocNote('Tech Info', sbT(
          'Below 600px, Add and Action collapse into the dropdown behind the More button.',
          'При ширине меньше 600px Add и Action сворачиваются в меню под More-кнопкой.'
        )),
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
            })}${sbMkChevron()}`,
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
    <span class="sb-popover-wrap sb-header-m-more" onclick="sbPopoverToggle(this, event)">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
        <!-- more-2-line L -->
      </button>
      <div class="sb-popover" role="dialog" tabindex="-1"
           data-placement="bottom-end" data-side="bottom">
        <div class="sb-ctx-card">
          <!-- extras (visible @narrow): Add, Action -->
          <!-- native: Copy / Download / Send via email -->
        </div>
      </div>
    </span>
    <div class="sb-chevron"><!-- arrow-down-s-line L --></div>
  </div>
</div>`,
        css: COMP_CSS.headerM,
      },
      {
        title: sbT('Composition: + Sub Nav + Tool Bar', 'Композиция: + Sub Nav + Tool Bar'),
        desc: sbT(
          'Header M combined with Sub Nav and Tool Bar — the standard chrome for the application’s primary working pages: a title, section navigation and an action strip.',
          'Header M в композиции с Sub Nav и Tool Bar — стандартный chrome основных рабочих страниц приложения: заголовок, навигация по разделам и полоса действий.'
        ),
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
