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
  padding: var(--pad-horiz-8) var(--pad-vert-0);
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-0);
  background: var(--background);
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

.sb-header-m-right {
  justify-content: flex-end;
}

.sb-header-m-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`;

// --- HEADER M ---
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

  sbRegister({
    name: 'header-m',
    title: 'Header M',
    description: 'Используется для Page Blocks, Modals и Cards. Горизонтальный наладдер 56-64px высотой без border-radius (живёт внутри других контейнеров). Два свободных слота — Left и Right (max 700px каждый, gap 8). Заголовок — H7 (22/900). Между слотами — justify-content: space-between.',
    sections: [
      {
        title: 'Anatomy',
        desc: 'Корневой контейнер 56-64px / row-flex / space-between / без скругления / bg --background. Слева: Info Pop-up + Headline. Справа: Status mini + Icon-Only-Small (more).',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:600px">
          ${mkHeaderM({
            slotLeft: `${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status mini bs-grey">Status</span><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button>`,
          })}
        </div>`,
        html: `<div class="sb-header-m">
  <div class="sb-header-m-left">
    <!-- Symbol Badge: infoPop SVG 24×24 -->
    <span class="sb-header-m-title sb-h6">Headline</span>
  </div>
  <div class="sb-header-m-right">
    <span class="sb-badge-status mini bs-grey">Status</span>
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
      <!-- more-2-line L -->
    </button>
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
        desc: 'Типичный сценарий: Secondary-Button с указателем «назад» в левом слоте, справа — Status, Icon-Only и Chevron (collapsible). Header M может коллапситься, поэтому шеврон уместен.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:600px">
          ${mkHeaderM({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button>`,
            title: 'Headline',
            slotRight: `<span class="sb-badge-status mini bs-grey">Status</span><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button><div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
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
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
      <!-- more-2-line L -->
    </button>
    <div class="sb-chevron"><!-- arrow-down-s-line L --></div>
  </div>
</div>`,
        css: COMP_CSS.headerM,
      },
      {
        title: 'Full slot composition',
        desc: 'Максимальное наполнение слотов из спеки. Слева (порядок: контент → headline): Back button → Indicator → Info Pop-up → Headline. Справа (порядок: caption → actions → chevron): Additional info → Status → 2× Icon-Only Small → Secondary text button → Chevron.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:900px">
          ${mkHeaderM({
            slotLeft: `<button type="button" class="sb-btn sb-btn-secondary">${sbIcon('arrow-left-s-line', 'L')}<span>Back</span></button><span class="sb-status-dot online"></span>${SB_SVG.infoPop}`,
            title: 'Headline',
            slotRight: `<span class="sb-caption" style="color:var(--text-secondary)">Additional info</span><span class="sb-badge-status mini bs-grey">Status</span><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('add-line', 'L')}</button><button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon('more-2-line', 'L')}</button><button type="button" class="sb-btn sb-btn-secondary"><span>Action</span></button><div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
          })}
        </div>`,
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
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
      <!-- add-line L -->
    </button>
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">
      <!-- more-2-line L -->
    </button>
    <button type="button" class="sb-btn sb-btn-secondary">
      <span>Action</span>
    </button>
    <div class="sb-chevron"><!-- arrow-down-s-line L --></div>
  </div>
</div>`,
        css: COMP_CSS.headerM,
      },
    ],
  });
})();
