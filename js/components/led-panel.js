// ═══════════════════════════════════════════════════════════════════════════
//  LED PANEL (Status Indicators Panel)
//  CSS в css/components/led-panel.css — SYNC-маркеры обязательны.
//
//  Горизонтальный bar c LED-item-ами. Каждый item — NAME сверху +
//  Status Indicator Regular снизу. Имитирует real-device LED-панель.
//  Используется внутри Sub Nav или standalone в layout'е.
//
//  Переиспользует .sb-status-dot (regular, без .mini) из status.css
//  со статусами: online / offline / error / warning / maintenance /
//  connecting / info.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["led-panel"] = `.sb-led-panel {
  display: inline-flex;
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  justify-content: center;
  align-items: center;
  gap: var(--gap-vert-lg);
  border-radius: var(--radius-8);
  background: var(--surface-1);
}
.sb-led-panel-item {
  display: flex;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--gap-horiz-xs);
  border-radius: var(--radius-0);
  color: var(--text-secondary);
}`;

// --- LED PANEL ---
(() => {
  /**
   * mkLedPanel(opts | items)
   *   opts: {
   *     items — array<{ name, status } | string>
   *   }
   *   Также принимает прямо массив items как shorthand.
   *
   *   items:
   *     - string  → name только, status='online' по умолчанию
   *     - object  → { name, status } где status — один из online/offline/
   *                 error/warning/maintenance/connecting/info
   */
  function mkLedPanel(opts = {}) {
    let items = Array.isArray(opts) ? opts : (opts.items || []);
    if (items.length < 1) {
      console.warn('sbMkLedPanel: минимум 1 item, получено', items.length);
    }
    if (items.length > 5) {
      console.warn('sbMkLedPanel: максимум 5 items, обрезаю');
      items = items.slice(0, 5);
    }
    const inner = items.map(item => {
      const data = typeof item === 'string' ? { name: item } : item;
      const { name = '', status = 'online' } = data;
      return `<div class="sb-led-panel-item">
        <span class="sb-caption">${name}</span>
        <span class="sb-status-dot ${status}"></span>
      </div>`;
    }).join('');
    return `<div class="sb-led-panel">${inner}</div>`;
  }

  window.sbMkLedPanel = mkLedPanel;

  // Demo data — типичные real-device LED'ы для космического коммуникатора.
  const DEMO_ITEMS = [
    { name: 'PWR',   status: 'online'      },
    { name: 'LINK',  status: 'connecting'  },
    { name: 'RX',    status: 'online'      },
    { name: 'TX',    status: 'warning'     },
    { name: 'FAULT', status: 'error'       },
  ];

  sbRegister({
    name: 'led-panel',
    title: 'LED Panel',
    description: 'Status Indicators Panel — горизонтальный bar с LED-item-ами для имитации real-device LED-панели. Каждый item: NAME label сверху (sb-caption uppercase) + Status Indicator Regular снизу. Panel — surface-1 фон, radius 8, padding 8/8, gap 24 между item-ами. Item — column flex, gap 4 между NAME и indicator. Используется внутри Sub Nav (как слот в любом alignment) или standalone. Переиспользует .sb-status-dot из status.css со всеми его статусами.',
    sections: [
      {
        title: 'Basic — 5 indicators',
        desc: 'Минимальный набор: 5 типовых статусов real-device. PWR — online (success). LINK — connecting (pulse). RX — online. TX — warning. FAULT — error. Каждый item: NAME + Status Indicator Regular.',
        preview: `<div style="display:flex;justify-content:center;padding:var(--pad-vert-16)">
          ${mkLedPanel(DEMO_ITEMS)}
        </div>`,
        html: `<div class="sb-led-panel">
  <div class="sb-led-panel-item">
    <span class="sb-caption">PWR</span>
    <span class="sb-status-dot online"></span>
  </div>
  <div class="sb-led-panel-item">
    <span class="sb-caption">LINK</span>
    <span class="sb-status-dot connecting"></span>
  </div>
  <!-- ... ещё item'ы ... -->
</div>`,
        css: COMP_CSS["led-panel"],
      },
      {
        title: 'All status types',
        desc: 'Все доступные статусы из status.css. online (success green) / offline (grey) / error (red) / warning (orange) / maintenance (alert) / connecting (primary с pulse-анимацией) / info (cyan).',
        preview: `<div style="display:flex;justify-content:center;padding:var(--pad-vert-16)">
          ${mkLedPanel([
            { name: 'ONLINE',  status: 'online'      },
            { name: 'OFFLINE', status: 'offline'     },
            { name: 'ERROR',   status: 'error'       },
            { name: 'WARN',    status: 'warning'     },
            { name: 'MAINT',   status: 'maintenance' },
            { name: 'CONN',    status: 'connecting'  },
            { name: 'INFO',    status: 'info'        },
          ])}
        </div>`,
        html: `<!-- Status types — class на .sb-status-dot:
     online / offline / error / warning / maintenance / connecting / info.
     connecting также добавляет pulse-анимацию. -->`,
        css: COMP_CSS["led-panel"],
      },
    ],
  });
})();
