// ═══════════════════════════════════════════════════════════════════════════
//  SUB NAV
//  CSS в css/components/sub-nav.css — SYNC-маркеры обязательны.
//
//  Контейнер-полоса под Nav Bar / Header. Может содержать Segment Menu,
//  Tab Bar, LED-панель (будущий компонент), или комбинацию. Sticky-positioned
//  как второй слой под Nav Bar (z-index 9, против nav-bar z-index 10).
//
//  TODO: slot system (left / center / right) и multi-row layout придут
//  с мобильными и комбинированными Figma-вариантами от пользователя.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["sub-nav"] = `.sb-sub-nav {
  display: flex;
  width: 100%;
  min-width: max-content;
  max-width: var(--screens-max-screen-width);
  min-height: 58px;
  max-height: 58px;
  padding: 0 var(--pad-horiz-24);
  justify-content: center;
  align-items: flex-end;
  gap: var(--gap-vert-m);
  border-radius: var(--radius-0);
  background: var(--background);
  box-sizing: border-box;
}
.sb-sub-nav.has-divider { border-bottom: var(--border-width-1) solid var(--border-soft); }
.sb-sub-nav.sticky {
  position: sticky;
  top: var(--sub-nav-top, 0);
  z-index: 9;
}
.sb-sub-nav.align-left  { justify-content: flex-start; }
.sb-sub-nav.align-right { justify-content: flex-end; }
.sb-sub-nav.led {
  align-items: center;
}
.sb-sub-nav.tab-bar {
  align-items: center;
}
.sb-sub-nav.has-slots {
  display: grid;
  grid-template-columns: minmax(max-content, 1fr) auto minmax(max-content, 1fr);
  align-items: end;
  gap: var(--gap-horiz-xxl);
}
.sb-sub-nav-slot-left {
  justify-self: start;
  align-self: stretch;
  display: flex;
  align-items: center;
}
.sb-sub-nav-slot-center { justify-self: center; }
.sb-sub-nav-slot-right  { justify-self: end; }
.sb-sub-nav.tablet {
  min-height: 58px;
  max-height: 114px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0;
  gap: 0;
}
.sb-sub-nav.tablet.has-slots {
  display: flex;
  grid-template-columns: none;
}
.sb-sub-nav.tablet .sb-sub-nav-slot-left {
  align-self: auto;
  padding-top: var(--pad-vert-8);
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.sb-sub-nav.tablet.led {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
@media (max-width: 1024px) {
  .sb-sub-nav {
    min-height: 58px;
    max-height: 114px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: 0;
    gap: 0;
  }
  .sb-sub-nav.has-slots {
    display: flex;
    grid-template-columns: none;
  }
  .sb-sub-nav-slot-left {
    align-self: auto;
    padding-top: var(--pad-vert-8);
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .sb-sub-nav.led {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}`;

// --- SUB NAV ---
(() => {
  /**
   * mkSubNav(opts | content)
   *
   * Два режима:
   *   1) single-content — opts: { content, align? }
   *      align: 'center' (default) | 'left' | 'right'
   *      Принимает также прямо HTML-строку как shorthand.
   *
   *   2) multi-slot — opts: { left?, center?, right? }
   *      Grid layout (1fr auto 1fr). Любая комбинация слотов; пропущенные
   *      слоты рендерятся как пустые ячейки. Используй для случая
   *      «LED Panel на левом крае + Segment Menu по центру».
   *
   *   Режим определяется автоматически: если задан хотя бы один из
   *   left/center/right — multi-slot; иначе single-content.
   */
  function mkSubNav(opts = '') {
    if (typeof opts === 'string') {
      return `<header class="sb-sub-nav has-divider">${opts}</header>`;
    }
    const sticky = opts.sticky === true;
    const variant = opts.variant; // 'led' для LED-content layout
    const mode = opts.mode;       // 'tablet' для force-Tablet layout (docs/демо)
    // divider — нижний бордер (separator). Default ON (так Sub Nav жил исторически);
    // потребитель гасит через sbMkSubNav({divider:false}).
    const dividerCls = opts.divider === false ? '' : ' has-divider';
    const hasSlots = ('left' in opts) || ('center' in opts) || ('right' in opts);
    if (hasSlots) {
      const { left = '', center = '', right = '' } = opts;
      let cls = 'sb-sub-nav has-slots' + dividerCls;
      if (mode === 'tablet') cls += ' tablet';
      if (sticky)            cls += ' sticky';
      return `<header class="${cls}">
        <div class="sb-sub-nav-slot-left">${left}</div>
        <div class="sb-sub-nav-slot-center">${center}</div>
        <div class="sb-sub-nav-slot-right">${right}</div>
      </header>`;
    }
    // Single-content mode
    const { content = '', align = 'center' } = opts;
    let cls = 'sb-sub-nav' + dividerCls;
    if (align === 'left')      cls += ' align-left';
    if (align === 'right')     cls += ' align-right';
    if (variant === 'led')     cls += ' led';
    if (variant === 'tab-bar') cls += ' tab-bar';
    if (mode === 'tablet')     cls += ' tablet';
    if (sticky)                cls += ' sticky';
    return `<header class="${cls}">${content}</header>`;
  }

  window.sbMkSubNav = mkSubNav;

  // Demo helpers — заглушки сегмент-меню для разных вариантов превью.
  const demoSegment = (iconPosition = 'top') => sbMkSegmentMenu(
    [
      { label: 'Segment', icon: 'gemini-fill' },
      { label: 'Segment', icon: 'gemini-fill' },
      { label: 'Segment', icon: 'gemini-fill' },
      { label: 'Segment', icon: 'gemini-fill' },
      { label: 'Segment', icon: 'gemini-fill' },
      { label: 'Segment', icon: 'gemini-fill' },
      { label: 'Segment', icon: 'gemini-fill' },
    ],
    { selectedIndex: 0, iconPosition }
  );

  const demoLed = () => sbMkLedPanel([
    { name: 'PWR',   status: 'online'     },
    { name: 'LINK',  status: 'connecting' },
    { name: 'RX',    status: 'online'     },
    { name: 'TX',    status: 'warning'    },
    { name: 'FAULT', status: 'error'      },
  ]);

  sbRegister({
    name: 'sub-nav',
    title: 'Sub Nav',
    description: sbT(
      'A container strip below the Navigation Bar or a header, positioned sticky as the second chrome layer. It holds a Segment Menu, a Tab Bar, an LED Panel or their combination. Desktop and tablet variants are implemented; the mobile ones will follow as the Figma parameters arrive.',
      'Контейнер-полоса под Navigation Bar или хедером, sticky-позиционирована как второй слой хрома. Вмещает Segment Menu, Tab Bar, LED Panel или их комбинацию. Реализованы desktop- и tablet-варианты; мобильные добавятся по мере получения Figma-параметров.'
    ),
    sections: [
      {
        title: sbT('Desktop — Segment Menu left-aligned', 'Desktop — Segment Menu слева'),
        desc: sbT(
          "The content is pushed to the left edge with the .align-left modifier (justify-content: flex-start); sizes, paddings and the border match the centered variant. API: sbMkSubNav({ content, align: 'left' }).",
          "Контент прижат к левому краю модификатором .align-left (justify-content: flex-start); размеры, отступы и граница совпадают с centered-вариантом. API: sbMkSubNav({ content, align: 'left' })."
        ),
        preview: sbMkPreviewStage(mkSubNav({ content: demoSegment('none'), align: 'left' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav align-left">
  <div class="sb-segment-menu">
    <!-- segments ... -->
    <div class="sb-segment-menu-indicator"></div>
  </div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Desktop — Segment Menu right-aligned', 'Desktop — Segment Menu справа'),
        desc: sbT(
          "The mirrored variant — the content is pushed to the right edge with the .align-right modifier (justify-content: flex-end). Convenient when the main page content is on the left and the sub-section navigation is on the right. API: sbMkSubNav({ content, align: 'right' }).",
          "Зеркальный вариант — контент прижат к правому краю модификатором .align-right (justify-content: flex-end). Удобно, когда основной контент страницы слева, а навигация по подразделам справа. API: sbMkSubNav({ content, align: 'right' })."
        ),
        preview: sbMkPreviewStage(mkSubNav({ content: demoSegment('none'), align: 'right' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav align-right">
  <div class="sb-segment-menu">
    <!-- segments ... -->
    <div class="sb-segment-menu-indicator"></div>
  </div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Desktop — Segment Menu centered', 'Desktop — Segment Menu по центру'),
        desc: sbT(
          'The base desktop variant: a Sub Nav with a centered Segment Menu, whose segments sit right against the bottom border.',
          'Базовый desktop-вариант: Sub Nav с центрированным Segment Menu, сегменты прижаты прямо к нижней границе.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Geometry:</b>'
          + '<ul><li>Height: 58px, fixed;</li><li>Min-width: max-content (the content does not shrink; a narrower parent gets a horizontal scroll wrapper);</li><li>Max-width: var(--screens-max-screen-width);</li><li>Padding: 0/24.</li></ul>'
          + '<b>Layout:</b>'
          + '<ul><li>justify-content: center, align-items: flex-end;</li><li>Background: --background.</li></ul>'
          + '<b>Divider:</b>'
          + '<ul><li>Border-bottom: 1px --border-soft;</li><li>On by default, disabled via divider: false.</li></ul>',
          '<b>Геометрия:</b>'
          + '<ul><li>Высота: 58px, фиксированная;</li><li>Min-width: max-content (контент не сжимается; при более узком родителе — горизонтальный скролл-враппер);</li><li>Max-width: var(--screens-max-screen-width);</li><li>Padding: 0/24.</li></ul>'
          + '<b>Layout:</b>'
          + '<ul><li>justify-content: center, align-items: flex-end;</li><li>Фон: --background.</li></ul>'
          + '<b>Divider:</b>'
          + '<ul><li>Border-bottom: 1px --border-soft;</li><li>Включён по умолчанию, отключается через divider: false.</li></ul>'
        )),
        preview: sbMkPreviewStage(mkSubNav({ content: demoSegment('top') }), { framed: false, preserveScroll: false }),
        html: `<!-- Centered Segment Menu внутри Sub Nav -->
<header class="sb-sub-nav">
  <div class="sb-segment-menu icon-top">
    <button class="sb-segment-menu-item selected" onclick="sbSelectSegmentItem(this)">
      <!-- icon L + label -->
    </button>
    <!-- ... ещё segments ... -->
    <div class="sb-segment-menu-indicator"></div>
  </div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Desktop — Tab Bar centered', 'Desktop — Tab Bar по центру'),
        desc: sbT(
          "A Sub Nav with a Tab Bar in the center. variant: 'tab-bar' switches to align-items: center — the Tab Bar centers vertically, unlike the Segment Menu, which anchors to the bottom. The Tab Bar must be wrapped in a fixed-width container: by default it stretches to width: 100%. API: sbMkSubNav({ content: wrapped Tab Bar, variant: 'tab-bar' }).",
          "Sub Nav с Tab Bar по центру. variant: 'tab-bar' включает align-items: center — Tab Bar центрируется по вертикали, в отличие от Segment Menu, который анкорится к низу. Tab Bar должен быть обёрнут в контейнер фиксированной ширины: по умолчанию он растягивается на width: 100%. API: sbMkSubNav({ content: обёрнутый Tab Bar, variant: 'tab-bar' })."
        ),
        preview: sbMkPreviewStage(
          (typeof sbMkTabBar === 'function')
            ? mkSubNav({ content: `<div style="width:360px">${sbMkTabBar(['Section', 'Section', 'Section'], { selectedIndex: 0 })}</div>`, variant: 'tab-bar' })
            : '',
          { framed: false, preserveScroll: false }
        ),
        html: `<header class="sb-sub-nav tab-bar">
  <div style="width:360px">
    <div class="sb-tab-bar">
      <button class="sb-tab selected" onclick="sbSelectTab(this)">
        <span class="sb-tab-label">Section</span>
      </button>
      <!-- ... ещё tabs ... -->
    </div>
  </div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Desktop — LED Panel centered (alone)', 'Desktop — LED Panel по центру (одна)'),
        desc: sbT(
          "A Sub Nav with a solo LED Panel in the center. variant: 'led' switches to align-items: center — the LED Panel is shorter than a Segment Menu and would hang at the top with flex-end. API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: 'led' }).",
          "Sub Nav с одиночной LED Panel по центру. variant: 'led' включает align-items: center — LED Panel ниже Segment Menu по высоте и при flex-end висела бы сверху. API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: 'led' })."
        ),
        preview: sbMkPreviewStage(mkSubNav({ content: demoLed(), variant: 'led' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav led">
  <div class="sb-led-panel">…</div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Desktop — LED Panel left (alone)', 'Desktop — LED Panel слева (одна)'),
        desc: sbT(
          "A solo LED Panel pushed to the left edge (24px of padding, in sync with the Navigation Bar). align: 'left' adds justify-content: flex-start; variant: 'led' keeps the vertical centering. API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: 'led', align: 'left' }).",
          "Одиночная LED Panel, прижатая к левому краю (padding 24px, синхронно с Navigation Bar). align: 'left' добавляет justify-content: flex-start; variant: 'led' сохраняет вертикальное центрирование. API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: 'led', align: 'left' })."
        ),
        preview: sbMkPreviewStage(mkSubNav({ content: demoLed(), variant: 'led', align: 'left' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav led align-left">
  <div class="sb-led-panel">…</div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Desktop — LED Panel + Segment Menu (combined)', 'Desktop — LED Panel + Segment Menu (вместе)'),
        desc: sbT(
          'The multi-slot mode: an LED Panel in the left slot and a Segment Menu in the right one. The left slot stretches to the full bar height (58) with its content centered vertically; the right slot is pushed to the right edge (24px of padding) with its content anchored to the bottom, so the segment indicator aligns with the border. API: sbMkSubNav({ left: sbMkLedPanel([...]), right: sbMkSegmentMenu([...]) }).',
          'Multi-slot режим: LED Panel в левом слоте и Segment Menu в правом. Левый слот растягивается на всю высоту бара (58), контент внутри центрируется по вертикали; правый прижат к правому краю (padding 24px), контент анкорится к низу — индикатор сегмента совпадает с границей. API: sbMkSubNav({ left: sbMkLedPanel([...]), right: sbMkSegmentMenu([...]) }).'
        ),
        preview: sbMkPreviewStage(mkSubNav({ left: demoLed(), right: demoSegment('top') }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav has-slots">
  <div class="sb-sub-nav-slot-left">
    <div class="sb-led-panel">…</div>
  </div>
  <div class="sb-sub-nav-slot-center"></div>
  <div class="sb-sub-nav-slot-right">
    <div class="sb-segment-menu icon-top">…</div>
  </div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Tablet — Segment Menu centered (alone)', 'Tablet — Segment Menu по центру (одно)'),
        desc: sbT(
          "The tablet mode, forced here via mode: 'tablet' (in a real application it activates automatically below 1024px). The container becomes a column with the content anchored to the bottom and centered horizontally; the Segment Menu touches the bottom border. Height 58 minimum, growing to 114 with multiple rows. API: sbMkSubNav({ content: sbMkSegmentMenu([...]), mode: 'tablet' }).",
          "Tablet-режим, здесь включён принудительно через mode: 'tablet' (в реальном приложении активируется автоматически при ширине меньше 1024px). Контейнер становится колонкой: контент анкорится к низу и центрируется по горизонтали; Segment Menu касается нижней границы. Высота 58 минимум, растёт до 114 при нескольких рядах. API: sbMkSubNav({ content: sbMkSegmentMenu([...]), mode: 'tablet' })."
        ),
        preview: sbMkPreviewStage(mkSubNav({ content: demoSegment('top'), mode: 'tablet' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav tablet">
  <div class="sb-segment-menu icon-top">…</div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Tablet — LED + Segment Menu (two-row stack)', 'Tablet — LED + Segment Menu (два ряда)'),
        desc: sbT(
          "The multi-slot tablet mode stacks the slots vertically in HTML order (left → center → right): the LED Panel on top, the Segment Menu at the bottom border (justify-content: flex-end). The height grows to 114 to fit both rows; paddings and gaps are 0, so the rows touch. API: sbMkSubNav({ left: sbMkLedPanel([...]), right: sbMkSegmentMenu([...]), mode: 'tablet' }).",
          "Multi-slot tablet-режим стэкает слоты вертикально в HTML-порядке (left → center → right): LED Panel сверху, Segment Menu у нижней границы (justify-content: flex-end). Высота растёт до 114, чтобы уместить оба ряда; отступы и gap нулевые — ряды соприкасаются. API: sbMkSubNav({ left: sbMkLedPanel([...]), right: sbMkSegmentMenu([...]), mode: 'tablet' })."
        ),
        preview: sbMkPreviewStage(mkSubNav({ left: demoLed(), right: demoSegment('top'), mode: 'tablet' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav has-slots tablet">
  <div class="sb-sub-nav-slot-left">
    <div class="sb-led-panel">…</div>
  </div>
  <div class="sb-sub-nav-slot-center"></div>
  <div class="sb-sub-nav-slot-right">
    <div class="sb-segment-menu icon-top">…</div>
  </div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: sbT('Tablet — LED Panel centered (alone)', 'Tablet — LED Panel по центру (одна)'),
        desc: sbT(
          "A solo LED Panel in tablet mode: variant: 'led' overrides the column stack with a row and centers the panel on both axes. API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: 'led', mode: 'tablet' }).",
          "Одиночная LED Panel в tablet-режиме: variant: 'led' заменяет column-stack на row и центрирует панель по обеим осям. API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: 'led', mode: 'tablet' })."
        ),
        preview: sbMkPreviewStage(mkSubNav({ content: demoLed(), variant: 'led', mode: 'tablet' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav tablet led">
  <div class="sb-led-panel">…</div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
    ],
  });
})();
