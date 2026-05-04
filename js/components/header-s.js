// ═══════════════════════════════════════════════════════════════════════════
//  HEADER S
//  CSS в css/components/header-s.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.headerS = `.sb-header-s {
  display: flex;
  width: 100%;
  min-width: var(--header-min-width);
  max-width: var(--header-s-max-width);
  min-height: var(--header-s-min-height);
  max-height: var(--header-s-max-height);
  padding: var(--pad-horiz-16) var(--pad-vert-16);
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--gap-horiz-0);
  border-radius: var(--radius-16) var(--radius-16) 0 0;
  background: var(--background);
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

.sb-header-s:has(.sb-header-s-tabs) {
  padding-bottom: var(--pad-horiz-0);
}

.sb-header-s-tabs {
  display: flex;
  width: 100%;
  min-width: 320px;
  max-width: var(--nav-menu-max-width-right-content);
  min-height: var(--tabs-min-height);
  max-height: 120px;
  padding: var(--pad-horiz-16) var(--pad-vert-16);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--gap-vert-s);
  border-bottom: var(--border-width-1) solid var(--surface-2);
  background: var(--background);
}

.sb-header-s-title {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`;

// --- HEADER S ---
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

  sbRegister({
    name: 'header-s',
    title: 'Header S',
    description: 'Mobile-вариант хедера для основных окон, side-menu и карточек среднего размера. Top corners 16px, нижние 0 (стык с layout). Min-height 40px, max-height 136px (с meta-row + Tab Bar). Заголовок — H6 (24/900). Два режима компоновки: column (default, мобильный) с правым слотом ниже, и .top-right — row-flex с правым слотом инлайн в одной строке с заголовком. Дальше — meta-row (CAPTION + Status mini + actions) и Tab Bar slot.',
    sections: [
      {
        title: 'Top row only — Anatomy',
        desc: 'Минимальный вариант: верхняя строка (24px) с Left slot и Headline. Без правого слота, без табов. Root — column-flex.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:368px">
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
        title: 'With Meta row',
        desc: 'Под верхней строкой добавляется meta-row: ADDITIONAL INFO (caption, слева) + actions group (Status mini badge + Icon-Only Small button с more-2-line, справа). Высота корня растёт автоматически. Если caption отсутствует, actions прижимаются к правому краю.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:368px">
          ${mkHeaderS({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>${SB_SVG.infoPop}`,
            title: 'Headline',
            metaInfo: 'Additional info',
            metaActions: `<span class="sb-badge-status mini bs-grey">Status</span><button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('more-2-line', 'S')}</button>`,
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
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
        <!-- more-2-line S -->
      </button>
    </div>
  </div>
</div>`,
        css: COMP_CSS.headerS,
      },
      {
        title: 'With Tab Bar slot',
        desc: 'Опциональный нижний Tab Bar slot. Min-height 40px, max-height 120px. Имеет border-bottom (1px solid surface-2). Когда слот присутствует, padding-bottom у root становится 0 — слот flush с низом.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:400px">
          ${mkHeaderS({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>${SB_SVG.infoPop}`,
            title: 'Headline',
            tabs: `<div class="sb-tab-bar">
              <button type="button" class="sb-tab-bar-item selected" onclick="sbSelectTab(this)">Tab</button>
              <button type="button" class="sb-tab-bar-item" onclick="sbSelectTab(this)">Tab</button>
              <button type="button" class="sb-tab-bar-item" onclick="sbSelectTab(this)">Tab</button>
            </div>`,
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
      <button type="button" class="sb-tab-bar-item selected" onclick="sbSelectTab(this)">Tab</button>
      <button type="button" class="sb-tab-bar-item" onclick="sbSelectTab(this)">Tab</button>
      <button type="button" class="sb-tab-bar-item" onclick="sbSelectTab(this)">Tab</button>
    </div>
  </div>
</div>`,
        css: COMP_CSS.headerS,
      },
      {
        title: 'Full anatomy — top + meta + tabs',
        desc: 'Все три слота вместе: верхняя строка, meta-row, Tab Bar slot. Максимальная высота 136px по спеке.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:400px">
          ${mkHeaderS({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>${SB_SVG.infoPop}`,
            title: 'Headline',
            metaInfo: 'Additional info',
            metaActions: `<span class="sb-badge-status mini bs-grey">Status</span><button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('more-2-line', 'S')}</button>`,
            tabs: `<div class="sb-tab-bar">
              <button type="button" class="sb-tab-bar-item selected" onclick="sbSelectTab(this)">Tab</button>
              <button type="button" class="sb-tab-bar-item" onclick="sbSelectTab(this)">Tab</button>
              <button type="button" class="sb-tab-bar-item" onclick="sbSelectTab(this)">Tab</button>
            </div>`,
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
        title: 'Top right slot — inline (.top-right)',
        desc: 'Когда правый слот лежит в одной строке с заголовком, добавь модификатор .top-right на root. Root становится row-flex с justify-content: space-between. Левый блок (left + headline) и правый слот разводятся по краям.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:368px">
          ${mkHeaderS({
            topRight: true,
            slotLeft: `${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('more-2-line', 'S')}</button>`,
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
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
      <!-- more-2-line S -->
    </button>
  </div>
</div>`,
        css: COMP_CSS.headerS,
      },
    ],
  });
})();
