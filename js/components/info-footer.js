// ═══════════════════════════════════════════════════════════════════════════
//  INFO FOOTER
//  Всегда-видимая системная инфа (MAC / S/n / Ver / Status / copyright), разбитая
//  по слотам. Два лейаута: Long (горизонтальная полоса на всю ширину, sticky внизу)
//  и Compact (вертикальный блок — для footer-слота Side Menu). Слот = текст или
//  status-индикатор; опц. popup-якорь (Tooltip приедет позже). НЕ путать с Action
//  Bar (кнопки) и Tool Bar (манипуляция). CSS в css/components/info-footer.css.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["info-footer"] = `.sb-info-footer {
  display: flex;
  background: var(--surface-1);
  box-sizing: border-box;
}
/* Long — горизонтальная полоса на всю ширину экрана, прижата снизу (Shadow-S +
   border-top, radius 0). Слоты в ряд, между ними вертикальный Separator. */
.sb-info-footer.is-long {
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: var(--gap-horiz-s);
  padding: var(--pad-vert-2) var(--pad-horiz-8);
  border-radius: var(--radius-0);
  border-top: var(--border-width-1) solid var(--border);
  box-shadow: 0 2px 8px 0 var(--shadow-overlay);
}
.sb-info-footer.is-long.align-center { justify-content: center; }
/* Compact — вертикальный блок (footer-слот Side Menu): строки стопкой, radius 8,
   без border-top/тени. min-width = ширина ячейки Side Menu (272). */
.sb-info-footer.is-compact {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--gap-vert-xxs);
  width: 100%;
  min-width: var(--side-nav-item-width);
  max-width: var(--nav-menu-max-width);
  min-height: 24px; /* Figma-спека; нет dimension-токена — hardcode, согласовано */
  max-height: var(--textarea-max-height);
  padding: var(--pad-vert-8) var(--pad-horiz-8);
  border-radius: var(--radius-8);
}
/* Слот — типографика Badge (--badge-font-size 10), цвет text-muted. Текст внутри
   наследует (без отдельного sb-* класса — font в CSS компонента через токены). */
.sb-info-footer-slot {
  display: inline-flex;
  align-items: center;
  font-size: var(--badge-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--button-line-height);
  color: var(--text-muted);
  white-space: nowrap;
}
/* Status-индикатор в слоте: dot + лейбл, gap 4. */
.sb-info-footer-indicator {
  display: flex;
  align-items: center;
  gap: var(--gap-horiz-xs);
}
/* Popup-якорь: слот с расширенной/реалтайм-инфой по ховеру. Сам popup — позже
   (Tooltip в работе). Сейчас — только якорь (data-attr + фокусируемость + cursor). */
.sb-info-footer-slot.has-popup { cursor: help; }`;

// --- INFO FOOTER ---
(() => {
  // Слот: { text } | { status, label } | { html }, опц. popup (строка-якорь).
  function slotEl(s) {
    const popup = s.popup ? ` data-info-popup="${esc(s.popup)}" tabindex="0"` : '';
    const cls = 'sb-info-footer-slot' + (s.popup ? ' has-popup' : '');
    let inner;
    if (s.status) {
      inner = `<span class="sb-info-footer-indicator"><span class="sb-status-dot mini ${s.status}"></span>${s.label || ''}</span>`;
    } else if (s.html) {
      inner = s.html;
    } else {
      inner = s.text || '';
    }
    return `<span class="${cls}"${popup}>${inner}</span>`;
  }

  // mkInfoFooter({ slots, variant:'long'|'compact', align:'left'|'center' })
  function mkInfoFooter({ slots = [], variant = 'long', align = 'left' } = {}) {
    const isCompact = variant === 'compact';
    let cls = 'sb-info-footer ' + (isCompact ? 'is-compact' : 'is-long');
    if (!isCompact && align === 'center') cls += ' align-center';
    // Long: между слотами вертикальный Separator (sep-v sep-s). Compact: стопка без них.
    const sep = isCompact ? '' : '<span class="sb-sep sep-v sep-s"></span>';
    const body = slots.map(slotEl).join(sep);
    return `<footer class="${cls}">${body}</footer>`;
  }
  window.sbMkInfoFooter = mkInfoFooter;

  // ── Демо ─────────────────────────────────────────────────────────────
  const DEVICE = [
    { text: 'MAC: 00-40-fd-01-d1-4f' },
    { text: 'S/n: DD 1609700282' },
    { text: 'Ver.: 7 400.R03.07.DEV03.b163' },
    { text: 'Part/n: 16D-007 400-100' },
    { text: 'Name: SIT_Default_Name' },
    { status: 'online', label: 'Sit Status', popup: 'Realtime device status — online, 42 ms' },
    { text: '© Copyright 2026 SpaceBridge Inc.' },
  ];

  // Стейдж: Long — на surface-2 подложке (footer surface-1 контрастит); Compact —
  // в мок-«side menu» (background-панель 272).
  function longStage(content) {
    // Long футер — full-bleed (углы 0, растягивается на весь экран). Горизонтальный
    // скролл как у Nav Bar: при переполнении превью — overflow-x:auto на обёртке +
    // min-width:max-content на подложке (контент не сжимается, а скроллится).
    return `<div data-pg-preserve-scroll style="width:100%;overflow-x:auto"><div style="min-width:max-content;background:var(--surface-2)">${content}</div></div>`;
  }
  function compactStage(content) {
    return `<div style="width:304px;padding:var(--pad-vert-16) var(--pad-horiz-16);background:var(--background);border:var(--border-width-1) solid var(--border);border-radius:var(--radius-12)">${content}</div>`;
  }

  sbRegister({
    name: 'info-footer',
    title: 'Info Footer',
    description: sbT(
      'An always-visible strip of system data, split into slots. Examples: MAC, serial number, firmware version, device status, copyright. Two layouts: Long — a horizontal bar stuck to the bottom of the screen; Compact — a vertical block for the Side Menu footer. Alignment: left or center.',
      'Всегда видимая полоса системных данных, разбитая по слотам. Примеры: MAC, серийный номер, версия прошивки, статус устройства, copyright. Два лейаута: Long — горизонтальная полоса, прижатая к низу экрана; Compact — вертикальный блок для футера Side Menu. Выравнивание: left или center.'
    ) + sbDocNote('Important', sbT(
      'Not to be confused with the Action Bar (buttons) or the Tool Bar (content manipulation).',
      'Не путать с Action Bar (кнопки) и Tool Bar (манипуляция контентом).'
    )),
    playground: {
      title: 'Info Footer Playground',
      wide: true,
      state: { variant: 'long', align: 'left' },
      controls(pg) {
        return `${sbPgGroup('Layout', `
              ${pg.select('variant', [
                { value: 'long',    label: 'Long' },
                { value: 'compact', label: 'Compact' },
              ], { label: 'Variant' })}
              ${pg.select('align', [
                { value: 'left',   label: 'Left' },
                { value: 'center', label: 'Center' },
              ], { label: 'Align' })}
          `)}`;
      },
      render(s) {
        const footer = mkInfoFooter({ slots: DEVICE, variant: s.variant, align: s.align });
        return s.variant === 'compact' ? compactStage(footer) : longStage(footer);
      },
      genCode(s) {
        return {
          html: `<!-- sbMkInfoFooter({ variant:'long'|'compact', align:'left'|'center',\n     slots:[ {text}, {status:'online', label, popup?}, {html} ] }) -->`,
          css: COMP_CSS["info-footer"],
        };
      },
    },
    sections: [
      {
        title: 'Long — full-width strip',
        desc: sbT(
          'A horizontal bar across the full screen width, stuck to the bottom. Slots go in a row, divided by vertical separators. The status slot is a dot with a label; it carries a popup anchor.',
          'Горизонтальная полоса на всю ширину экрана, прижата к низу. Слоты идут в ряд, между ними вертикальные разделители. Status-слот — точка с лейблом; на нём заложен popup-якорь.'
        ) + sbDocNote('Tech Info', sbT(
          'Border-top --border · surface-1 · Shadow-S. A slot is text (Badge typography, --text-muted) or a status indicator. The hover popup comes later — Tooltip is in progress. Mobile plan: a sticky bar with 16px margins; with lots of data, Compact moves into the Side Menu.',
          'Border-top --border · surface-1 · Shadow-S. Слот — текст (типографика Badge, --text-muted) или статус-индикатор. Popup по ховеру появится позже — Tooltip в работе. План на мобильные: sticky-полоса с отступами 16; при большом объёме данных Compact уезжает в Side Menu.'
        )),
        preview: longStage(mkInfoFooter({ slots: DEVICE })),
        html: `<!-- sbMkInfoFooter({ variant:'long', slots:[ {text:'MAC: …'}, …, {status:'online', label:'Sit Status'}, {text:'© …'} ] }) -->`,
        css: COMP_CSS["info-footer"],
      },
      {
        title: 'Long — centered',
        desc: sbT(
          'Center alignment — the slots gather in the middle of the strip.',
          'Выравнивание Center — слоты собираются по центру полосы.'
        ),
        preview: longStage(mkInfoFooter({ slots: DEVICE, align: 'center' })),
        html: `<!-- align: 'center' -->`,
        css: COMP_CSS["info-footer"],
      },
      {
        title: 'Compact — Side Menu block',
        desc: sbT(
          'A vertical block (radius 8) for the Side Menu footer. Rows stack with a 2px gap, no separators. The same device info as in the Side Navigation footer — dogfooded.',
          'Вертикальный блок (radius 8) для footer-слота Side Menu. Строки стопкой с gap 2, без разделителей. Тот же device-info, что в футере Side Navigation, — догфуд.'
        ),
        preview: compactStage(mkInfoFooter({ slots: DEVICE, variant: 'compact' })),
        html: `<!-- sbMkInfoFooter({ variant:'compact', slots:[ {text:'MAC: …'}, … ] }) -->`,
        css: COMP_CSS["info-footer"],
      },
    ],
  });
})();
