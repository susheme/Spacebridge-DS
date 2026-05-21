// ═══════════════════════════════════════════════════════════════════════════
//  TABS (Tab building block)
//  CSS в css/components/tabs.css — SYNC-маркеры обязательны.
//
//  ВАЖНО: Tabs — это building block для Tab Bar, в NAV НЕ регистрируется.
//  Экспортит sbMkTab(opts) — одна tab-кнопка с состояниями:
//  Default / Hover / Selected / Disabled. Опциональный Status Mini
//  indicator слева от label (придёт в след. итерации).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["tabs"] = `.sb-tab {
  display: flex;
  height: 28px;
  min-width: var(--tab-bar-min-width-tab);
  max-width: var(--tab-bar-max-width-tab);
  min-height: var(--tab-bar-min-height-tab);
  max-height: var(--tab-bar-max-height-tab);
  padding: var(--pad-vert-4) var(--pad-horiz-8);
  justify-content: center;
  align-items: center;
  gap: var(--gap-vert-xs);
  border: none;
  border-radius: var(--radius-4);
  background: var(--surface-1);
  color: var(--text-secondary);
  font-family: var(--font-family);
  font-size: var(--button-font-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--button-line-height);
  letter-spacing: var(--letter-spacing);
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
.sb-tab-label {
  min-height: 12px;
}
.sb-tab:hover:not(.is-disabled):not(.selected),
.sb-tab.is-hover:not(.is-disabled):not(.selected) {
  color: var(--primary);
}
.sb-tab.selected {
  background: var(--background);
  color: var(--primary);
  box-shadow: 0 2px 8px 0 var(--shadow-sm);
}
.sb-tab.is-disabled {
  background: var(--surface-2);
  color: var(--border);
  cursor: not-allowed;
  pointer-events: none;
}`;

// Single-select click handler. Снимает .selected с соседей внутри ближайшего
// .sb-tab-bar (если есть), иначе — внутри прямого parent'а. Это позволяет
// использовать tabs как внутри Tab Bar контейнера, так и loose в demo-обёртке.
window.sbSelectTab = function(item) {
  if (!item || item.classList.contains('is-disabled')) return;
  const scope = item.closest('.sb-tab-bar') || item.parentElement;
  if (scope) {
    scope.querySelectorAll('.sb-tab.selected').forEach(c => c.classList.remove('selected'));
  }
  item.classList.add('selected');
};

// --- TABS ---
(() => {
  /**
   * mkTab(opts | label)
   *   opts: {
   *     label     — string, текст таба (default 'Tab')
   *     selected  — boolean, активный таб
   *     disabled  — boolean, неактивный (приоритет над selected)
   *     hover     — boolean, статичный force-hover для демо (.is-hover класс)
   *     indicator — string | falsy. Если строка — Status Mini indicator
   *                 слева от label со статусом-классом (online/offline/error/
   *                 warning/maintenance/connecting/info). См. status.css.
   *   }
   *   Принимает либо объект-opts, либо просто string как label.
   */
  function mkTab(opts = {}) {
    const data = typeof opts === 'string' ? { label: opts } : opts;
    const { label = 'Tab', selected, disabled, hover, indicator } = data;
    let cls = 'sb-tab';
    if (selected && !disabled) cls += ' selected';
    if (disabled)              cls += ' is-disabled';
    if (hover && !disabled && !selected) cls += ' is-hover';
    // Indicator — переиспользуем готовый .sb-status-dot.mini из status.css.
    // 6×6 точка + 2px белая обводка. Gap до label берётся из tab'a gap.
    const indicatorHTML = indicator
      ? `<span class="sb-status-dot mini ${indicator}"></span>`
      : '';
    return `<button type="button" class="${cls}" onclick="sbSelectTab(this)">${indicatorHTML}<span class="sb-tab-label">${label}</span></button>`;
  }

  window.sbMkTab = mkTab;
})();
