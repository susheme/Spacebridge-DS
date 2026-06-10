// ═══════════════════════════════════════════════════════════════════════════
//  TOOL BAR (Top)
//  CSS в css/components/tool-bar.css — SYNC-маркеры обязательны.
//
//  Top Tool Bar — горизонтальная action-bar под Header'ом / Sub Nav'ом.
//  3 слота: Left (action buttons) / Center (Tab Bar или контент) / Right
//  (поиск + actions). Шаблон обёрток в slot'ах: icon-only Secondary +
//  опциональный label через .sb-btn-with-label.
//
//  Bottom Tool Bar — будет добавлен отдельным заходом.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["tool-bar"] = `.sb-tool-bar {
  display: flex;
  width: 100%;
  max-width: var(--screens-max-screen-width);
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-horiz-m);
  border-radius: 0;
  border-bottom: var(--border-width-1-5) solid var(--border-soft);
  background: var(--background);
  box-sizing: border-box;
}
.sb-tool-bar-left {
  display: flex;
  max-width: var(--nav-menu-max-width-right-content);
  align-items: center;
  gap: var(--gap-vert-m);
  flex-shrink: 0;
}
.sb-tool-bar-center {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  justify-content: center;
  align-items: center;
}
.sb-tool-bar-right {
  display: flex;
  max-width: var(--nav-menu-max-width-right-content);
  justify-content: flex-end;
  align-items: center;
  gap: var(--gap-vert-m);
  flex-shrink: 0;
}`;

// --- TOOL BAR ---
(() => {
  /**
   * mkToolBar({ left, center, right })
   *   left   — HTML-строка для левого слота (icon-only Secondary buttons +
   *            опционально label через .sb-btn-with-label обёртку).
   *   center — HTML-строка для центра (Tab Bar / любой контент).
   *   right  — HTML-строка для правого слота (search bar, icon-only buttons,
   *            label-обёрнутые кнопки).
   * Все слоты опциональны. Пустой слот рендерится как пустой div чтобы
   * space-between корректно распределял оставшиеся.
   */
  function mkToolBar(opts = {}) {
    const { left = '', center = '', right = '' } = opts;
    return `<div class="sb-tool-bar">
      <div class="sb-tool-bar-left">${left}</div>
      <div class="sb-tool-bar-center">${center}</div>
      <div class="sb-tool-bar-right">${right}</div>
    </div>`;
  }
  window.sbMkToolBar = mkToolBar;

  // ── Demo-конструкторы ───────────────────────────────────────────────
  // icon-only Secondary с опциональным label через .sb-btn-with-label.
  // labelPos: 'left' | 'right' | undefined.
  function demoIconBtn({ icon = 'add-line', label, labelPos } = {}) {
    const btn = `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon(icon, 'L')}</button>`;
    if (!label) return btn;
    const lbl = `<span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">${label}</span>`;
    const parts = labelPos === 'left' ? lbl + btn : btn + lbl;
    return `<span class="sb-btn-with-label">${parts}</span>`;
  }

  // icon-only Secondary + chevron справа (демо dropdown trigger,
  // реального dropdown поведения нет — только визуал).
  function demoDropdownBtn(icon = 'add-line') {
    return `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon" style="width:auto;padding:0 var(--pad-horiz-8);gap:var(--gap-horiz-xs)">
      ${sbIcon(icon, 'L')}${sbIcon('arrow-drop-down-line', 'L')}
    </button>`;
  }

  // Tab Bar в center — 2 таба для демо.
  const DEMO_CENTER_TABS = (typeof sbMkTabBar === 'function')
    ? `<div style="width:240px">${sbMkTabBar(['Tab', 'Tab'], { selectedIndex: 0 })}</div>`
    : '';

  // Search Bar для right slot.
  const DEMO_SEARCH = (typeof sbMkSearch === 'function')
    ? `<div style="width:200px">${sbMkSearch({ placeholder: 'Search' })}</div>`
    : '';

  sbRegister({
    name: 'tool-bar',
    title: 'Tool Bar',
    description: 'Tool Bar — горизонтальная action-полоска под Header\'ами или Sub Nav\'ом. Три слота: Left (action buttons, до 2 Secondary), Center (опциональный Tab Bar или контент), Right (Search Bar + icon-only кнопки, опционально с label через .sb-btn-with-label). Высота auto от padding 8/16 + контента. Border-bottom 1.5px для разделения с контентом ниже. Bottom Tool Bar — будет добавлен отдельным заходом.',
    sections: [
      {
        title: 'Anatomy',
        desc: 'Базовый Tool Bar со всеми тремя слотами: слева — dropdown-кнопка + label-обёрнутая кнопка, центр — Tab Bar, справа — label-кнопка + icon-only buttons + Search Bar + ещё icon-only.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto"><div style="min-width:1100px">
          ${mkToolBar({
            left: `${demoDropdownBtn('add-line')}${demoIconBtn({ icon: 'add-line', label: 'Title', labelPos: 'right' })}`,
            center: DEMO_CENTER_TABS,
            right: `${demoIconBtn({ icon: 'add-line', label: 'Title', labelPos: 'left' })}${demoIconBtn({ icon: 'add-line' })}${DEMO_SEARCH}${demoIconBtn({ icon: 'add-line' })}`,
          })}
        </div></div>`,
        html: `<div class="sb-tool-bar">
  <div class="sb-tool-bar-left">
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>  <!-- dropdown trigger -->
    <span class="sb-btn-with-label">
      <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
      <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Title</span>
    </span>
  </div>
  <div class="sb-tool-bar-center">
    <!-- Tab Bar (sbMkTabBar) или любой контент -->
  </div>
  <div class="sb-tool-bar-right">
    <span class="sb-btn-with-label">
      <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Title</span>
      <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
    </span>
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
    <!-- Search Bar (sbMkSearch) -->
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
  </div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Left only',
        desc: 'Минимальный Tool Bar — только левый слот с одной icon-only кнопкой. Center и Right пустые. Кнопка прижата к левому краю padding\'ом 16.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto"><div style="min-width:1100px">
          ${mkToolBar({
            left: demoIconBtn({ icon: 'add-line' }),
          })}
        </div></div>`,
        html: `<div class="sb-tool-bar">
  <div class="sb-tool-bar-left">
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
  </div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right"></div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Left + Right (no Center)',
        desc: 'Tool Bar без Tab Bar в центре. Left action group слева, Search Bar + action group справа. justify-content: space-between разносит слоты по краям.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto"><div style="min-width:1100px">
          ${mkToolBar({
            left: `${demoIconBtn({ icon: 'add-line' })}${demoIconBtn({ icon: 'add-line', label: 'Title', labelPos: 'right' })}`,
            right: `${DEMO_SEARCH}${demoIconBtn({ icon: 'add-line' })}`,
          })}
        </div></div>`,
        html: `<div class="sb-tool-bar">
  <div class="sb-tool-bar-left">
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
    <span class="sb-btn-with-label">
      <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
      <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Title</span>
    </span>
  </div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right">
    <!-- Search Bar (sbMkSearch) -->
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
  </div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
    ],
  });
})();
