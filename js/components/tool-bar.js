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
}
.sb-tool-bar.bottom {
  border-bottom: none;
  border-top: var(--border-width-1-5) solid var(--border-soft);
}
.sb-tool-bar.floating {
  position: sticky;
  top: 0;
  z-index: 10;
  width: calc(100% - 2 * var(--pad-horiz-16));
  margin: var(--pad-vert-16) var(--pad-horiz-16);
  border-radius: var(--radius-12);
  border-bottom: none;
  box-shadow: 0 2px 8px 0 var(--shadow-sm);
  transition: margin 0.25s ease, width 0.25s ease, border-radius 0.25s ease, box-shadow 0.25s ease;
}
.sb-tool-bar.floating.is-stuck {
  width: 100%;
  margin: 0;
  border-radius: 0;
  box-shadow: 0 4px 16px 0 var(--shadow-md);
}
.sb-tool-bar-sentinel { height: 1px; flex-shrink: 0; }`;

// --- TOOL BAR ---
(() => {
  /**
   * mkToolBar({ left, center, right, bottom, floating })
   *   left/center/right — HTML-строки для слотов (опционально).
   *   bottom   — boolean. Bottom Tool Bar: border сверху, не снизу.
   *              Подходит для прилипания к низу карточки (Save/Undo
   *              actions при редактировании).
   *   floating — boolean. Floating mode: sticky к верху scroll-контейнера,
   *              отрывается от краёв (margin + radius + shadow). При скролле
   *              получает .is-stuck (через JS wireFloating ниже) и
   *              схлопывается до full-width. Аналог Nav Bar floating.
   */
  function mkToolBar(opts = {}) {
    const { left = '', center = '', right = '', bottom = false, floating = false } = opts;
    let cls = 'sb-tool-bar';
    if (bottom)   cls += ' bottom';
    if (floating) cls += ' floating';
    return `<div class="${cls}">
      <div class="sb-tool-bar-left">${left}</div>
      <div class="sb-tool-bar-center">${center}</div>
      <div class="sb-tool-bar-right">${right}</div>
    </div>`;
  }
  window.sbMkToolBar = mkToolBar;

  /**
   * sbWireToolBarFloating(scrollRoot, toolBar) — IntersectionObserver wiring
   * для floating Tool Bar'а. Аналог sbWireNavBarFloating, но с собственным
   * sentinel-классом чтобы не конфликтовать с Nav Bar'ом на одной странице.
   * Возвращает dispose() для cleanup'а.
   */
  function wireFloating(scrollRoot, toolBar) {
    if (!scrollRoot || !toolBar) return () => {};
    const barInside = scrollRoot.contains(toolBar);
    let sentinel;
    if (barInside) {
      sentinel = toolBar.previousElementSibling;
      if (!sentinel || !sentinel.classList.contains('sb-tool-bar-sentinel')) {
        sentinel = document.createElement('div');
        sentinel.className = 'sb-tool-bar-sentinel';
        toolBar.parentNode.insertBefore(sentinel, toolBar);
      }
    } else {
      sentinel = scrollRoot.firstElementChild;
      if (!sentinel || !sentinel.classList.contains('sb-tool-bar-sentinel')) {
        sentinel = document.createElement('div');
        sentinel.className = 'sb-tool-bar-sentinel';
        sentinel.style.width = '100%';
        scrollRoot.insertBefore(sentinel, scrollRoot.firstChild);
      }
    }
    const obs = new IntersectionObserver(
      ([entry]) => toolBar.classList.toggle('is-stuck', !entry.isIntersecting),
      { root: scrollRoot === document.body ? null : scrollRoot, threshold: 0 }
    );
    obs.observe(sentinel);
    return () => { obs.disconnect(); sentinel.remove(); };
  }
  window.sbWireToolBarFloating = wireFloating;

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
      {
        title: 'Bottom Tool Bar',
        desc: 'Modifier <code>.bottom</code> — Tool Bar для нижней части карточки. Border сверху вместо снизу (разделяет от контента над ним). Типичные сценарии: actions редактирования (Save / Cancel / Undo) появляются снизу когда юзер вносит изменения; в формах footer с CTA-кнопкой.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto"><div style="min-width:1100px">
          ${mkToolBar({
            bottom: true,
            left: `${demoIconBtn({ icon: 'arrow-go-back-line', label: 'Undo', labelPos: 'right' })}`,
            right: `<button type="button" class="sb-btn sb-btn-secondary">Cancel</button><button type="button" class="sb-btn sb-btn-primary">Save</button>`,
          })}
        </div></div>`,
        html: `<div class="sb-tool-bar bottom">
  <div class="sb-tool-bar-left">
    <span class="sb-btn-with-label">
      <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
      <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Undo</span>
    </span>
  </div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right">
    <button class="sb-btn sb-btn-secondary">Cancel</button>
    <button class="sb-btn sb-btn-primary">Save</button>
  </div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Floating',
        desc: 'Modifier <code>.floating</code> — Tool Bar отрывается от краёв (margin 16, radius 12, shadow-sm). При скролле <code>.is-stuck</code> класс переключает в full-width без отступов с глубокой тенью. Транзишн плавный (0.25s). Реализация: <code>position: sticky</code> + IntersectionObserver через <code>sbWireToolBarFloating(scrollRoot, bar)</code>. Демо — попробуй проскроллить превью.',
        preview: `<div style="background:var(--surface-1);border-radius:var(--radius-12);overflow:hidden;height:280px;display:flex;flex-direction:column" id="tool-bar-floating-demo">
          ${mkToolBar({
            floating: true,
            left: `${demoIconBtn({ icon: 'add-line' })}${demoIconBtn({ icon: 'add-line', label: 'Title', labelPos: 'right' })}`,
            center: DEMO_CENTER_TABS,
            right: `${demoIconBtn({ icon: 'add-line' })}`,
          })}
          <div data-tool-bar-scroll style="flex:1;overflow-y:auto;padding:var(--pad-vert-16) var(--pad-horiz-24)">
            ${Array.from({length:8}).map((_,i) => `<p class="sb-body-m" style="margin:0 0 12px;color:var(--text-tertiary)">Scrollable content block ${i+1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et erat at ipsum interdum lobortis.</p>`).join('')}
          </div>
        </div>`,
        html: `<div class="sb-tool-bar floating">
  <div class="sb-tool-bar-left">…</div>
  <div class="sb-tool-bar-center">…</div>
  <div class="sb-tool-bar-right">…</div>
</div>

<!-- Wire через JS чтобы получать .is-stuck при скролле: -->
<script>
  const bar = document.querySelector('.sb-tool-bar.floating');
  const scrollRoot = bar.parentNode;  // или scroll-контейнер
  sbWireToolBarFloating(scrollRoot, bar);
</script>`,
        css: COMP_CSS["tool-bar"],
      },
    ],
    // После рендера — wire'аем floating Tool Bar в демо-секции.
    // Bar лежит СНАРУЖИ скролл-области (sibling сверху), scroll-area = root.
    onMount() {
      const demo = document.getElementById('tool-bar-floating-demo');
      if (!demo) return;
      const bar = demo.querySelector('.sb-tool-bar.floating');
      const scrollArea = demo.querySelector('[data-tool-bar-scroll]');
      if (!bar || !scrollArea) return;
      if (window.__toolBarDisposeFloating) window.__toolBarDisposeFloating();
      window.__toolBarDisposeFloating = wireFloating(scrollArea, bar);
    },
  });
})();
