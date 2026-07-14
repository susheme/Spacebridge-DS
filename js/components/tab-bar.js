// ═══════════════════════════════════════════════════════════════════════════
//  TAB BAR
//  CSS в css/components/tab-bar.css — SYNC-маркеры обязательны.
//
//  Контейнер для табов (sbMkTab из tabs.js). Регистрируется в NAV.
//  От 2 до 6 табов внутри, flex:1 — делят ширину контейнера поровну.
//  Используется в side menu, модалках на маленьких окнах, мобилках.
//  Не путать с Segment Menu — другой компонент.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["tab-bar"] = `.sb-tab-bar {
  display: flex;
  width: 100%;
  height: 32px;
  padding: var(--pad-vert-2) var(--pad-horiz-2);
  justify-content: center;
  align-items: center;
  gap: var(--gap-vert-xs);
  border-radius: var(--radius-6);
  background: var(--surface-1);
  box-sizing: border-box;
  box-shadow:
     1px  1px 2px 0 var(--shadow-overlay) inset,
    -1px -1px 2px 0 var(--shadow-lg)      inset;
}
.sb-tab-bar .sb-tab {
  flex: 1 1 0%;
}`;

// --- TAB BAR ---
(() => {
  /**
   * mkTabBar(tabs, opts)
   *   tabs: array<string | { label, indicator?, disabled? }>
   *   opts: { selectedIndex }
   *
   * Constraints: 2-6 табов. Меньше 2 → console.warn. Больше 6 → обрезаем.
   * Tabs внутри стретчатся через flex:1 — делят ширину Tab Bar поровну.
   * Ширина Tab Bar определяется parent'ом (block-level flex, fill width).
   */
  function mkTabBar(tabs, opts = {}) {
    const { selectedIndex = 0 } = opts;
    let arr = Array.isArray(tabs) ? tabs : [];
    if (arr.length < 2) {
      console.warn('sbMkTabBar: рекомендуется минимум 2 таба, получено', arr.length);
    }
    if (arr.length > 6) {
      console.warn('sbMkTabBar: максимум 6 табов, обрезаю');
      arr = arr.slice(0, 6);
    }
    const inner = arr.map((tab, i) => {
      const data = typeof tab === 'string' ? { label: tab } : tab;
      return sbMkTab({
        ...data,
        selected: i === selectedIndex && !data.disabled,
      });
    }).join('');
    return `<div class="sb-tab-bar">${inner}</div>`;
  }

  window.sbMkTabBar = mkTabBar;

  sbRegister({
    name: 'tab-bar',
    title: 'Tab Bar',
    description: sbT(
      'A container for tabs (sbMkTab). It holds 2 to 6 tabs that share the container width equally. Used in side menus, in modals on small windows and on mobile.',
      'Контейнер для табов (sbMkTab). Вмещает от 2 до 6 табов, которые делят ширину контейнера поровну. Используется в side-menu, в модалках на маленьких окнах и на мобильных.'
    ) + sbDocNote('Important', sbT(
      'Not to be confused with the Segment Menu — a different component with a different visual model.',
      'Не путать с Segment Menu — это другой компонент с другой визуальной моделью.'
    )),
    playground: {
      title: 'Tab Bar Playground',
      minPreview: 360,  // Tab Bar демо-stage 360px → нужно столько же в preview-box
      state: {
        tabCount: 3,
        withIndicator: false,
        disableLast: false,
      },
      controls(pg) {
        return pg.select('tabCount', [
          { value: 2, label: '2 tabs' },
          { value: 3, label: '3 tabs' },
          { value: 4, label: '4 tabs' },
          { value: 5, label: '5 tabs' },
          { value: 6, label: '6 tabs' },
        ]) + `<div class="pg-toggles">
          ${pg.toggle('withIndicator', 'Indicator')}
          ${pg.toggle('disableLast',   'Disable')}
        </div>`;
      },
      render(s) {
        const labels = ['Day', 'Night', 'List', 'Grid', 'Map', 'Chart'];
        const items = labels.slice(0, s.tabCount).map((label, i) => ({
          label,
          indicator: s.withIndicator ? 'online' : undefined,
          disabled: s.disableLast && i === s.tabCount - 1,
        }));
        // Wrap с фиксированной шириной 360 — без неё Tab Bar в demo-area
        // непредсказуемой ширины (depends on preview window). 360 хватает
        // на 6 табов с запасом, демонстрирует stretch-поведение flex:1.
        return `<div style="width:360px;max-width:100%">${mkTabBar(items, { selectedIndex: 0 })}</div>`;
      },
      genCode(s) {
        const labels = ['Day', 'Night', 'List', 'Grid', 'Map', 'Chart'];
        const items = labels.slice(0, s.tabCount);
        const buttons = items.map((label, i) => {
          const cls = 'sb-tab' + (i === 0 ? ' selected' : '');
          const indicator = s.withIndicator ? '\n    <span class="sb-status-dot mini online"></span>' : '';
          return `  <button type="button" class="${cls}" onclick="sbSelectTab(this)">${indicator}\n    <span class="sb-tab-label">${label}</span>\n  </button>`;
        }).join('\n');
        const html = `<div class="sb-tab-bar">\n${buttons}\n</div>`;
        return { html, css: COMP_CSS["tab-bar"] + '\n\n/* --- Tab (см. tabs.css) --- */\n' + COMP_CSS["tabs"] };
      },
    },
    sections: [
      {
        title: sbT('Layouts (2-6 tabs)', 'Layout\'ы (2–6 табов)'),
        desc: sbT(
          'All tab counts at the same container width (360px). Tabs are flex: 1 and share the space equally — the fewer the tabs, the wider each one. In real usage the container width is set by the parent.',
          'Все варианты по количеству табов на одной ширине контейнера (360px). Табы — flex: 1 и делят пространство поровну: чем меньше табов, тем шире каждый. В реальном использовании ширину контейнера задаёт родитель.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Container:</b>'
          + '<ul><li>Height: 32px;</li><li>Padding: 2/2;</li><li>Radius: 6;</li><li>Background: --surface-1 with a pressed inset shadow (the sunken look);</li><li>Block-level flex.</li></ul>',
          '<b>Контейнер:</b>'
          + '<ul><li>Высота: 32px;</li><li>Padding: 2/2;</li><li>Radius: 6;</li><li>Фон: --surface-1 с Pressed-inset тенью (вдавленный вид);</li><li>Block-level flex.</li></ul>'
        )),
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-m);width:360px;max-width:100%">
          ${mkTabBar(['Day', 'Night'],                                       { selectedIndex: 0 })}
          ${mkTabBar(['List', 'Grid', 'Map'],                                { selectedIndex: 0 })}
          ${mkTabBar(['Day', 'Night', 'List', 'Grid'],                       { selectedIndex: 0 })}
          ${mkTabBar(['Day', 'Night', 'List', 'Grid', 'Map'],                { selectedIndex: 0 })}
          ${mkTabBar(['Day', 'Night', 'List', 'Grid', 'Map', 'Chart'],       { selectedIndex: 0 })}
        </div>`,
        html: `<!-- 2 tabs (each ~50% width minus gap/padding) -->
<div class="sb-tab-bar">
  <button type="button" class="sb-tab selected" onclick="sbSelectTab(this)">
    <span class="sb-tab-label">Day</span>
  </button>
  <button type="button" class="sb-tab" onclick="sbSelectTab(this)">
    <span class="sb-tab-label">Night</span>
  </button>
</div>

<!-- 6 tabs (max) — каждый ~1/6 ширины контейнера -->
<div class="sb-tab-bar">
  <button type="button" class="sb-tab selected" onclick="sbSelectTab(this)">…</button>
  <button type="button" class="sb-tab" onclick="sbSelectTab(this)">…</button>
  <!-- ... 4 more ... -->
</div>`,
        css: COMP_CSS["tab-bar"],
      },
      {
        title: sbT('Tab states', 'Состояния таба'),
        desc: sbT(
          'A single tab button is the building block of the Tab Bar. In the demo, Hover is rendered statically via the .is-hover modifier; the specimens are display-only (pointer-events: none), with interaction disabled to avoid confusion. The optional indicator to the left of the label reuses the Status Mini dot.',
          'Одиночная таб-кнопка — building block для Tab Bar. В демо Hover показан статично модификатором .is-hover; образцы display-only (pointer-events: none), интерактивность отключена, чтобы не путать. Опциональный индикатор слева от подписи переиспользует Status Mini.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>States:</b>'
          + '<ul><li>Default: surface-1 background, text-secondary;</li><li>Hover: text-primary, background unchanged;</li><li>Selected: --background plus Shadow-S and text-primary (a raised pill);</li><li>Disabled: surface-2 background, text --border, non-interactive.</li></ul>'
          + '<b>Indicator:</b>'
          + '<ul><li>.sb-status-dot.mini.</li></ul>',
          '<b>Состояния:</b>'
          + '<ul><li>Default: фон surface-1, text-secondary;</li><li>Hover: text-primary, фон не меняется;</li><li>Selected: --background, Shadow-S и text-primary (вид приподнятой пилюли);</li><li>Disabled: фон surface-2, текст --border, без интеракции.</li></ul>'
          + '<b>Индикатор:</b>'
          + '<ul><li>.sb-status-dot.mini.</li></ul>'
        )),
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-m);width:100%">
          <div style="display:flex;flex-direction:column;gap:var(--gap-vert-m)">
            ${sbMkSectionHeader({ slotLeft: `<span class="sb-caption">Without indicator</span>` })}
            <div style="display:flex;gap:var(--gap-horiz-lg);flex-wrap:wrap;align-items:flex-start;pointer-events:none">
              ${sbMkTab({ label: 'Default' })}
              ${sbMkTab({ label: 'Hover',    hover: true })}
              ${sbMkTab({ label: 'Selected', selected: true })}
              ${sbMkTab({ label: 'Disabled', disabled: true })}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--gap-vert-m)">
            ${sbMkSectionHeader({ slotLeft: `<span class="sb-caption">With indicator (online)</span>` })}
            <div style="display:flex;gap:var(--gap-horiz-lg);flex-wrap:wrap;align-items:flex-start;pointer-events:none">
              ${sbMkTab({ label: 'Default',  indicator: 'online' })}
              ${sbMkTab({ label: 'Hover',    indicator: 'online', hover: true })}
              ${sbMkTab({ label: 'Selected', indicator: 'online', selected: true })}
              ${sbMkTab({ label: 'Disabled', indicator: 'online', disabled: true })}
            </div>
          </div>
        </div>`,
        html: `<!-- Default — без indicator -->
<button type="button" class="sb-tab" onclick="sbSelectTab(this)">
  <span class="sb-tab-label">Default</span>
</button>

<!-- С indicator (Status Mini слева от label) -->
<button type="button" class="sb-tab" onclick="sbSelectTab(this)">
  <span class="sb-status-dot mini online"></span>
  <span class="sb-tab-label">Default</span>
</button>`,
        css: COMP_CSS["tabs"],
      },
    ],
  });
})();
