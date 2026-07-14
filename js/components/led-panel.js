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
    description: sbT(
      'A horizontal bar of LED items. It mimics the LED panel of a real device. Each item: a NAME label on top, a status indicator below. Example: PWR / LINK / RX / TX / FAULT in a Sub Nav. Works inside a Sub Nav or standalone.',
      'Горизонтальный бар из LED-элементов. Имитирует LED-панель реального устройства. Каждый элемент: NAME-лейбл сверху, статус-индикатор снизу. Пример: PWR / LINK / RX / TX / FAULT в Sub Nav. Работает внутри Sub Nav или standalone.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Panel:</b>'
      + '<ul><li>Background: surface-1;</li><li>Radius: 8;</li><li>Padding: 8/8;</li><li>Gap: 24 between items.</li></ul>'
      + '<b>Item:</b>'
      + '<ul><li>Column flex;</li><li>Gap: 4.</li></ul>'
      + '<b>Typography:</b>'
      + '<ul><li>The label is sb-caption uppercase.</li></ul>'
      + '<b>Reuse:</b>'
      + '<ul><li>Reuses .sb-status-dot from Status with all its states.</li></ul>',
      '<b>Панель:</b>'
      + '<ul><li>Фон: surface-1;</li><li>Radius: 8;</li><li>Padding: 8/8;</li><li>Gap: 24 между элементами.</li></ul>'
      + '<b>Элемент:</b>'
      + '<ul><li>Column flex;</li><li>Gap: 4.</li></ul>'
      + '<b>Типографика:</b>'
      + '<ul><li>Лейбл — sb-caption uppercase.</li></ul>'
      + '<b>Переиспользование:</b>'
      + '<ul><li>Переиспользует .sb-status-dot из Status со всеми его статусами.</li></ul>'
    )),
    sections: [
      {
        title: sbT('Basic — 5 indicators', 'База — 5 индикаторов'),
        desc: sbT(
          'A typical real-device set. PWR — online. LINK — connecting (pulse). RX — online. TX — warning. FAULT — error.',
          'Типовой набор реального устройства. PWR — online. LINK — connecting (pulse). RX — online. TX — warning. FAULT — error.'
        ),
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
        title: sbT('All status types', 'Все типы статусов'),
        desc: sbT(
          'Every status from Status: online (green), offline (grey), error (red), warning (orange), maintenance (alert), connecting (primary, pulse), info (cyan).',
          'Все статусы из Status: online (зелёный), offline (серый), error (красный), warning (оранжевый), maintenance (alert), connecting (primary, pulse), info (cyan).'
        ),
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
