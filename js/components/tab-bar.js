// ═══════════════════════════════════════════════════════════════════════════
//  TAB BAR (Segment Control)
//  CSS в css/components/tab-bar.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.tabBar = `.sb-tab-bar {
  display: flex;
  width: 100%;
  border-bottom: var(--border-width-1) solid var(--border);
}
.sb-tab-bar-item {
  flex: 0 1 auto; min-width: 0; max-width: 200px;
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  background: transparent; border: none;
  border-bottom: var(--border-width-2) solid transparent;
  margin-bottom: calc(-1 * var(--border-width-1));
  color: var(--text-secondary);
  font-family: var(--font-family);
  font-size: var(--button-font-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--button-line-height);
  letter-spacing: var(--letter-spacing);
  text-align: center;
  cursor: pointer; user-select: none;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: var(--transition);
}
.sb-tab-bar-item:hover:not(.is-disabled):not(.selected) {
  color: var(--text-primary); background: var(--surface-1);
}
.sb-tab-bar-item.selected {
  color: var(--primary);
  border-bottom-color: var(--primary);
}
.sb-tab-bar-item.is-disabled {
  opacity: 0.5; cursor: not-allowed; pointer-events: none;
}`;

// Single-select click handler — within parent scope.
window.sbSelectTab = function(item) {
  if (!item || item.classList.contains('is-disabled')) return;
  const parent = item.parentElement;
  if (parent) {
    parent.querySelectorAll(':scope > .sb-tab-bar-item.selected').forEach(c => c.classList.remove('selected'));
  }
  item.classList.add('selected');
};

// --- TAB BAR ---
(() => {
  function mkTabBar(items, opts = {}) {
    const { selectedIndex = 0 } = opts;
    const inner = items.map((it, i) => {
      const cls = 'sb-tab-bar-item'
        + (i === selectedIndex ? ' selected' : '')
        + (it.disabled ? ' is-disabled' : '');
      const label = typeof it === 'string' ? it : it.label;
      return `<button type="button" class="${cls}" onclick="sbSelectTab(this)">${label}</button>`;
    }).join('');
    return `<div class="sb-tab-bar">${inner}</div>`;
  }

  sbRegister({
    name: 'tab-bar',
    title: 'Tab Bar',
    description: 'Сегментный контрол для переключения между разделами/вариантами. Auto-width по контенту, ellipsis при переполнении. Используется внутри Headers, Cards, Modals и других контейнеров для табовой навигации. Селекшен — primary-цвет текста + 2px primary-подчёркивание. Single-select в рамках родителя.',
    playground: {
      title: 'Tab Bar Playground',
      state: {
        tabCount: 4,
        selectedIndex: 0,
      },
      controls(pg) {
        return pg.select('tabCount', [
          { value: 2, label: '2 tabs' },
          { value: 3, label: '3 tabs' },
          { value: 4, label: '4 tabs' },
          { value: 5, label: '5 tabs' },
          { value: 7, label: '7 tabs' },
        ]) + pg.select('selectedIndex', [
          { value: 0, label: 'Selected: 1st' },
          { value: 1, label: 'Selected: 2nd' },
          { value: 2, label: 'Selected: 3rd' },
          { value: 3, label: 'Selected: 4th' },
        ]);
      },
      render(s) {
        const labels = ['Section', 'Header L', 'Modal', 'Card', 'Sidebar', 'Toast', 'Nav Bar'];
        const items = labels.slice(0, s.tabCount);
        const idx = Math.min(s.selectedIndex, items.length - 1);
        return mkTabBar(items, { selectedIndex: idx });
      },
      genCode(s) {
        const labels = ['Section', 'Header L', 'Modal', 'Card', 'Sidebar', 'Toast', 'Nav Bar'];
        const items = labels.slice(0, s.tabCount);
        const idx = Math.min(s.selectedIndex, items.length - 1);
        const buttons = items.map((label, i) => {
          const cls = 'sb-tab-bar-item' + (i === idx ? ' selected' : '');
          return `  <button type="button" class="${cls}" onclick="sbSelectTab(this)">${label}</button>`;
        }).join('\n');
        const html = `<div class="sb-tab-bar">\n${buttons}\n</div>`;
        return { html, css: COMP_CSS.tabBar };
      },
    },
    sections: [
      {
        title: 'States',
        desc: 'Default (text-secondary) / Hover (text-primary + surface-1 bg) / Selected (primary text + primary 2px underline) / Disabled (opacity 0.5).',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-lg);width:100%">
          <div style="display:flex;flex-direction:column;gap:var(--gap-vert-xs)">
            <span class="sb-caption" style="color:var(--text-tertiary)">Default selection</span>
            ${mkTabBar(['Section', 'Header L', 'Modal', 'Card'], { selectedIndex: 0 })}
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--gap-vert-xs)">
            <span class="sb-caption" style="color:var(--text-tertiary)">With disabled item</span>
            ${mkTabBar([
              { label: 'Section' },
              { label: 'Header L' },
              { label: 'Modal', disabled: true },
              { label: 'Card' },
            ], { selectedIndex: 0 })}
          </div>
        </div>`,
        html: `<div class="sb-tab-bar">
  <button type="button" class="sb-tab-bar-item selected" onclick="sbSelectTab(this)">Section</button>
  <button type="button" class="sb-tab-bar-item" onclick="sbSelectTab(this)">Header L</button>
  <button type="button" class="sb-tab-bar-item" onclick="sbSelectTab(this)">Modal</button>
  <button type="button" class="sb-tab-bar-item is-disabled" onclick="sbSelectTab(this)">Disabled</button>
</div>`,
        css: COMP_CSS.tabBar,
      },
    ],
  });
})();
