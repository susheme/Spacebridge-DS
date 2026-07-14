// ═══════════════════════════════════════════════════════════════════════════
//  HEADER S
//  CSS в css/components/header-s.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.headerS = `.sb-header-s {
  display: flex;
  width: 100%;
  min-width: 320px;
  max-width: var(--header-s-max-width);
  min-height: var(--header-s-min-height);
  max-height: var(--header-s-max-height);
  padding: var(--pad-vert-16) var(--pad-horiz-16);
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--gap-horiz-0);
  border-radius: var(--radius-16) var(--radius-16) 0 0;
  background: var(--background);
  container-type: inline-size;
}

.sb-header-s.top-right {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-vert-s);
}

.sb-header-s-top {
  display: flex;
  width: 100%;
  max-width: var(--nav-menu-max-width-right-content);
  min-height: var(--header-s-row-height);
  max-height: var(--header-s-row-height);
  align-items: center;
  gap: var(--gap-vert-s);
  color: var(--text-tertiary);
}

.sb-header-s-left {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: var(--gap-vert-s);
}

.sb-header-s-right {
  display: flex;
  max-width: var(--nav-menu-max-width-right-content);
  justify-content: flex-end;
  align-items: center;
  gap: var(--gap-vert-s);
}

.sb-header-s-meta {
  display: flex;
  align-self: stretch;
  max-width: var(--nav-menu-max-width-right-content);
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-vert-s);
}
.sb-header-s-meta:not(:has(.sb-header-s-meta-info)) {
  justify-content: flex-end;
}

.sb-header-s-meta-info {
  color: var(--text-secondary);
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: var(--headline-line-height-24);
}

.sb-header-s-meta-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--gap-vert-s);
  flex-shrink: 0;
}

.sb-header-s-more { flex-shrink: 0; }
.sb-header-s-menu-extra { display: none; }

@container (max-width: 400px) {
  .sb-header-s-action     { display: none; }
  .sb-header-s-menu-extra { display: flex; }
}

.sb-header-s:has(.sb-header-s-tabs) {
  padding-bottom: var(--pad-horiz-0);
}

.sb-header-s-tabs {
  display: flex;
  width: 100%;
  min-width: 320px;
  min-height: var(--tabs-min-height);
  max-height: 120px;
  padding: var(--pad-vert-16) var(--pad-horiz-0);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--gap-vert-s);
  border-bottom: var(--border-width-1) solid var(--border-soft);
  background: var(--background);
}
.sb-header-s-tabs .sb-tab { max-width: none; }

.sb-header-s-title {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`;

// --- HEADER S ---
// Overflow-menu open/close, click-outside, scroll-close, and the global
// SB_DEMO_MORE_ITEMS list live in context-menu.js (generic for any
// .sb-overflow-menu wrapper).
(() => {
  function mkHeaderS({ slotLeft, title, slotRight, topRight = false, metaInfo, metaActions, tabs } = {}) {
    const cls = 'sb-header-s' + (topRight ? ' top-right' : '');
    const hasLeft       = slotLeft    != null && slotLeft    !== false && slotLeft    !== '';
    const hasRight      = slotRight   != null && slotRight   !== false && slotRight   !== '';
    const hasMetaInfo   = metaInfo    != null && metaInfo    !== false && metaInfo    !== '';
    const hasMetaActs   = metaActions != null && metaActions !== false && metaActions !== '';
    const hasTabs       = tabs        != null && tabs        !== false && tabs        !== '';
    const hasMeta       = (hasMetaInfo || hasMetaActs) && !topRight;
    const showTabs      = hasTabs && !topRight;

    const left = hasLeft ? `<div class="sb-header-s-left">${slotLeft}</div>` : '';
    const titleEl = title ? `<span class="sb-header-s-title sb-h7">${title}</span>` : '';
    const topBlock = `<div class="sb-header-s-top">${left}${titleEl}</div>`;
    const rightBlock = hasRight ? `<div class="sb-header-s-right">${slotRight}</div>` : '';

    let metaBlock = '';
    if (hasMeta) {
      const infoEl = hasMetaInfo ? `<span class="sb-header-s-meta-info sb-caption">${metaInfo}</span>` : '';
      const actsEl = hasMetaActs ? `<div class="sb-header-s-meta-actions">${metaActions}</div>` : '';
      metaBlock = `<div class="sb-header-s-meta">${infoEl}${actsEl}</div>`;
    }

    const tabsBlock = showTabs ? `<div class="sb-header-s-tabs">${tabs}</div>` : '';

    return `<div class="${cls}">
      ${topBlock}${rightBlock}${metaBlock}${tabsBlock}
    </div>`;
  }

  // Expose helper для будущих хедеров и dev-консоли.
  window.sbMkHeaderS = mkHeaderS;

  // ── Actions builder ──────────────────────────────────────────────
  // Same shape as mkHeaderL/MActions: inline buttons (Small size — Header S
  // uses sb-btn-sm) collapse into More dropdown when container narrow.
  function mkHeaderSActions({ inline = [], more } = {}) {
    const inlineHtml = inline.map(a => {
      if (a.type === 'icon') {
        return `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon sb-header-s-action">${sbIcon(a.icon, 'S')}</button>`;
      }
      return `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-header-s-action"><span>${a.label}</span></button>`;
    }).join('');

    const hasInline = inline.length > 0;
    const moreItems = (more && more.items) || [];
    if (!hasInline && moreItems.length === 0) return '';

    const extraCells = inline.map(a => {
      const iconLeft = a.icon || (a.type === 'icon' ? a.icon : undefined);
      const cellHtml = sbMkContextCell({ iconLeft, label: a.label, mode: 'action' });
      return cellHtml.replace('class="sb-ctx-cell', 'class="sb-ctx-cell sb-header-s-menu-extra');
    }).join('');

    const moreCells = moreItems
      .map(it => sbMkContextCell({ iconLeft: it.icon, label: it.label, mode: 'action' }))
      .join('');

    return inlineHtml + `<div class="sb-header-s-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">${sbIcon('more-2-line', 'S')}</button>
      <div class="sb-ctx-card">${extraCells}${moreCells}</div>
    </div>`;
  }
  window.sbMkHeaderSActions = mkHeaderSActions;

  const DEMO_MORE_ITEMS = window.SB_DEMO_MORE_ITEMS;

  sbRegister({
    name: 'header-s',
    title: 'Header S',
    description: sbT(
      'A mobile-oriented header for main windows, side menus and mid-size cards. By default it stacks vertically: a top row with the headline, an optional meta row (caption, status and actions) and an optional sub-nav slot. The .top-right modifier places the right slot inline with the headline instead. On narrow widths, inline buttons collapse into a dropdown menu behind the More (⋯) button.',
      'Мобильный хедер для основных окон, side-menu и карточек среднего размера. По умолчанию строится вертикально: верхняя строка с заголовком, опциональная meta-строка (caption, статус и действия) и опциональный sub-nav слот. Модификатор .top-right выносит правый слот в одну строку с заголовком. На узкой ширине inline-кнопки сворачиваются в выпадающее меню под More-кнопкой (⋯).'
    ) + sbDocNote('Important', sbT(
      'Always use a Tab Bar in the sub-nav slot. A Segment Menu may not fit the narrow contexts this header is designed for (mobile screens, narrow cards).',
      'В sub-nav слоте всегда используется Tab Bar. Segment Menu может не поместиться в узких контекстах, на которые рассчитан этот хедер (мобильные экраны, узкие карточки).'
    )),
    sections: [
      {
        title: sbT('Top row only — Anatomy', 'Только верхний ряд — анатомия'),
        desc: sbT(
          'The minimal configuration: a single top row with the left slot and the headline — no right slot, no tabs.',
          'Минимальная конфигурация: одна верхняя строка с левым слотом и заголовком — без правого слота и табов.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Root:</b>'
          + '<ul><li>Column-flex;</li><li>Top corners 16px, bottom 0 (flush with the layout);</li><li>Min-height: 40px, max-height: 136px (with the meta row and sub-nav);</li><li>Top row: 24px.</li></ul>'
          + '<b>Typography:</b>'
          + '<ul><li>Headline — H6 (24 / 900).</li></ul>'
          + '<b>Behavior:</b>'
          + '<ul><li>Breakpoint 400px: inline buttons collapse behind More (⋯).</li></ul>',
          '<b>Корень:</b>'
          + '<ul><li>Column-flex;</li><li>Верхние углы 16px, нижние 0 (стык с layout);</li><li>Min-height: 40px, max-height: 136px (с meta-строкой и sub-nav);</li><li>Верхняя строка: 24px.</li></ul>'
          + '<b>Типографика:</b>'
          + '<ul><li>Headline — H6 (24 / 900).</li></ul>'
          + '<b>Поведение:</b>'
          + '<ul><li>Breakpoint 400px: inline-кнопки сворачиваются под More (⋯).</li></ul>'
        )),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);flex-shrink:0;width:368px">
          ${mkHeaderS({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>${SB_SVG.infoPop}`,
            title: 'Headline',
          })}
        </div>`,
        html: `<div class="sb-header-s">
  <div class="sb-header-s-top">
    <div class="sb-header-s-left">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
        <!-- add-line S -->
      </button>
      <!-- Symbol Badge: infoPop SVG 24×24 -->
    </div>
    <span class="sb-header-s-title sb-h7">Headline</span>
  </div>
</div>`,
        css: COMP_CSS.headerS,
      },
      {
        title: sbT('With Meta row', 'С Meta-рядом'),
        desc: sbT(
          'A meta row appears under the top row: additional info (a caption) on the left and an actions group on the right — a mini status badge and the More button with an attached dropdown menu. The root height grows automatically; without a caption, the actions align to the right edge.',
          'Под верхней строкой появляется meta-строка: дополнительная информация (caption) слева и группа действий справа — Status mini и More-кнопка с прикреплённым выпадающим меню. Высота корня растёт автоматически; без caption действия прижимаются к правому краю.'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);flex-shrink:0;width:368px">
          ${mkHeaderS({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>${SB_SVG.infoPop}`,
            title: 'Headline',
            metaInfo: 'Additional info',
            metaActions: `<span class="sb-badge-status mini bs-grey">Status</span>${mkHeaderSActions({ more: { items: DEMO_MORE_ITEMS } })}`,
          })}
        </div>`,
        html: `<div class="sb-header-s">
  <div class="sb-header-s-top">
    <div class="sb-header-s-left">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
        <!-- add-line S -->
      </button>
      <!-- Symbol Badge: infoPop SVG 24×24 -->
    </div>
    <span class="sb-header-s-title sb-h7">Headline</span>
  </div>
  <div class="sb-header-s-meta">
    <span class="sb-header-s-meta-info sb-caption">Additional info</span>
    <div class="sb-header-s-meta-actions">
      <span class="sb-badge-status mini bs-grey">Status</span>
      <div class="sb-header-s-more sb-overflow-menu">
        <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon"
                onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
          <!-- more-2-line S -->
        </button>
        <div class="sb-ctx-card">
          <!-- ctx-cells: Copy / Download / Send via email -->
        </div>
      </div>
    </div>
  </div>
</div>`,
        css: COMP_CSS.headerS,
      },
      {
        title: sbT('With Sub-nav slot (Tab Bar)', 'Со слотом Sub-nav (Tab Bar)'),
        desc: sbT(
          'An optional bottom slot for section navigation, with a Tab Bar inside — a Segment Menu would not fit the narrow width of Header S.',
          'Опциональный нижний слот для навигации по разделам, внутри — Tab Bar: Segment Menu на узкой ширине Header S не поместится.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Slot:</b>'
          + '<ul><li>Min-height: 40px, max-height: 120px;</li><li>Border-bottom: 1px (border).</li></ul>'
          + '<b>Behavior:</b>'
          + '<ul><li>When the slot is present, the root’s bottom padding becomes 0 — the slot sits flush with the bottom edge.</li></ul>',
          '<b>Слот:</b>'
          + '<ul><li>Min-height: 40px, max-height: 120px;</li><li>Border-bottom: 1px (border).</li></ul>'
          + '<b>Поведение:</b>'
          + '<ul><li>Когда слот присутствует, нижний padding корня становится 0 — слот прилегает к нижней грани вплотную.</li></ul>'
        )),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);flex-shrink:0;width:400px">
          ${mkHeaderS({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>${SB_SVG.infoPop}`,
            title: 'Headline',
            tabs: sbMkTabBar(['Tab', 'Tab', 'Tab'], { selectedIndex: 0 }),
          })}
        </div>`,
        html: `<div class="sb-header-s">
  <div class="sb-header-s-top">
    <div class="sb-header-s-left">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
        <!-- add-line S -->
      </button>
      <!-- Symbol Badge: infoPop SVG 24×24 -->
    </div>
    <span class="sb-header-s-title sb-h7">Headline</span>
  </div>
  <div class="sb-header-s-tabs">
    <div class="sb-tab-bar">
      <button type="button" class="sb-tab selected" onclick="sbSelectTab(this)">
        <span class="sb-tab-label">Tab</span>
      </button>
      <button type="button" class="sb-tab" onclick="sbSelectTab(this)">
        <span class="sb-tab-label">Tab</span>
      </button>
      <button type="button" class="sb-tab" onclick="sbSelectTab(this)">
        <span class="sb-tab-label">Tab</span>
      </button>
    </div>
  </div>
</div>`,
        css: COMP_CSS.headerS,
      },
      {
        title: sbT('Full anatomy — top + meta + sub-nav', 'Полная анатомия — top + meta + sub-nav'),
        desc: sbT(
          'All three tiers together: the top row, the meta row (with the More button and its dropdown menu) and the sub-nav slot with a Tab Bar. Maximum height — 136px.',
          'Все три яруса вместе: верхняя строка, meta-строка (с More-кнопкой и выпадающим меню) и sub-nav слот с Tab Bar. Максимальная высота — 136px.'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);flex-shrink:0;width:400px">
          ${mkHeaderS({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>${SB_SVG.infoPop}`,
            title: 'Headline',
            metaInfo: 'Additional info',
            metaActions: `<span class="sb-badge-status mini bs-grey">Status</span>${mkHeaderSActions({ more: { items: DEMO_MORE_ITEMS } })}`,
            tabs: sbMkTabBar(['Tab', 'Tab', 'Tab'], { selectedIndex: 0 }),
          })}
        </div>`,
        html: `<div class="sb-header-s">
  <div class="sb-header-s-top">…</div>
  <div class="sb-header-s-meta">…</div>
  <div class="sb-header-s-tabs">
    <div class="sb-tab-bar">…</div>
  </div>
</div>`,
        css: COMP_CSS.headerS,
      },
      {
        title: sbT('Top right slot — inline (.top-right)', 'Правый верхний слот — inline (.top-right)'),
        desc: sbT(
          'The .top-right modifier keeps the right slot on the same line as the headline: the root becomes a row, with the left block (the left slot and the headline) and the right slot pushed to opposite edges.',
          'Модификатор .top-right оставляет правый слот в одной строке с заголовком: корень становится строкой, левый блок (левый слот и заголовок) и правый слот разводятся по краям.'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);flex-shrink:0;width:368px">
          ${mkHeaderS({
            topRight: true,
            slotLeft: `${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: mkHeaderSActions({ more: { items: DEMO_MORE_ITEMS } }),
          })}
        </div>`,
        html: `<div class="sb-header-s top-right">
  <div class="sb-header-s-top">
    <div class="sb-header-s-left">
      <!-- Symbol Badge: infoPop SVG 24×24 -->
    </div>
    <span class="sb-header-s-title sb-h7">Headline</span>
  </div>
  <div class="sb-header-s-right">
    <div class="sb-header-s-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
        <!-- more-2-line S -->
      </button>
      <div class="sb-ctx-card">
        <!-- ctx-cells: Copy / Download / Send via email -->
      </div>
    </div>
  </div>
</div>`,
        css: COMP_CSS.headerS,
      },
      {
        title: sbT('Composition: + Tool Bar', 'Композиция: + Tool Bar'),
        desc: sbT(
          'Header S with its own sub-nav slot (a Tab Bar) plus a Tool Bar below — a standard composition for the application’s secondary pages: navigation on top, actions underneath.',
          'Header S с собственным sub-nav слотом (Tab Bar) и Tool Bar снизу — стандартная композиция для второстепенных страниц приложения: навигация сверху, действия ниже.'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:400px">
          ${mkHeaderS({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>${SB_SVG.infoPop}`,
            title: 'Headline',
            tabs: sbMkTabBar(['Tab', 'Tab', 'Tab'], { selectedIndex: 0 }),
          })}
          ${(typeof sbMkToolBar === 'function') ? sbMkToolBar({
            compact: true,
            left: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('add-line', 'L')}</button><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button>`,
            right: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('search-line', 'L')}</button>`,
          }) : ''}
        </div>`,
        html: `<div class="sb-header-s">
  <div class="sb-header-s-top">…</div>
  <div class="sb-header-s-tabs">
    <div class="sb-tab-bar">…</div>
  </div>
</div>
<!-- В Header S контексте Tool Bar в compact mode — мобильный chrome. -->
<div class="sb-tool-bar compact">
  <div class="sb-tool-bar-left">…</div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right">…</div>
</div>`,
        css: COMP_CSS.headerS,
      },
    ],
  });
})();
