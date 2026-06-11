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
  border-bottom: var(--border-width-1) solid var(--border-soft);
  box-sizing: border-box;
}
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
      return `<header class="sb-sub-nav">${opts}</header>`;
    }
    const sticky = opts.sticky === true;
    const variant = opts.variant; // 'led' для LED-content layout
    const mode = opts.mode;       // 'tablet' для force-Tablet layout (docs/демо)
    const hasSlots = ('left' in opts) || ('center' in opts) || ('right' in opts);
    if (hasSlots) {
      const { left = '', center = '', right = '' } = opts;
      let cls = 'sb-sub-nav has-slots';
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
    let cls = 'sb-sub-nav';
    if (align === 'left')   cls += ' align-left';
    if (align === 'right')  cls += ' align-right';
    if (variant === 'led')  cls += ' led';
    if (mode === 'tablet')  cls += ' tablet';
    if (sticky)             cls += ' sticky';
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
    description: 'Контейнер-полоса под Nav Bar / Header. Sticky-positioned как второй слой (z-index 9). Holds Segment Menu, Tab Bar, LED-панель или комбинацию. На текущий момент имплементирован Desktop centered variant с Segment Menu — остальные (mobile, multi-row, со slot left/right, с LED-панелью без segment\'ов) добавятся по мере получения Figma-параметров.',
    sections: [
      {
        title: 'Desktop — Segment Menu left-aligned',
        desc: 'Тот же контейнер, но контент прижат к левому краю через модификатор .align-left (justify-content: flex-start). API: sbMkSubNav({ content, align: \'left\' }). Размеры/паддинги/border идентичны centered-варианту.',
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
        title: 'Desktop — Segment Menu right-aligned',
        desc: 'Зеркальный вариант — контент прижат к правому краю через модификатор .align-right (justify-content: flex-end). API: sbMkSubNav({ content, align: \'right\' }). Полезно когда основной контент страницы слева, а навигация по подразделам — справа.',
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
        title: 'Desktop — Segment Menu centered',
        desc: 'Базовый desktop-вариант: Sub Nav с centered Segment Menu внутри. min-width 780, max-width var(--screens-max-screen-width) = 5000. min-height 40, max-height 64. Padding-top 8 (без bottom). justify-content: center, align-items: flex-end (segments прижаты к низу, прямо к границе). Background --background, border-bottom 1px --surface-2.',
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
        title: 'Desktop — LED Panel centered (alone)',
        desc: 'Sub Nav с LED Panel\'ом solo по центру. variant:\'led\' включает align-items: center (LED ниже Segment Menu по высоте, при flex-end висел бы сверху). API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: \'led\' }).',
        preview: sbMkPreviewStage(mkSubNav({ content: demoLed(), variant: 'led' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav led">
  <div class="sb-led-panel">…</div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: 'Desktop — LED Panel left (alone)',
        desc: 'Sub Nav с LED Panel\'ом solo, прижатым к левому краю (24px padding от края, sync с Nav Bar). align: \'left\' добавляет justify-content: flex-start, variant: \'led\' оставляет вертикальное центрирование. API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: \'led\', align: \'left\' }).',
        preview: sbMkPreviewStage(mkSubNav({ content: demoLed(), variant: 'led', align: 'left' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav led align-left">
  <div class="sb-led-panel">…</div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: 'Desktop — LED Panel + Segment Menu (combined)',
        desc: 'Multi-slot режим: LED Panel в left-слоте + Segment Menu в right-слоте. Left slot stretches на всю высоту бара (58), content внутри слота вертикально центрируется. Right slot прижат к правому краю бара (padding 24 от края), content анкорится к низу (segment indicator align\'ится с border-bottom). API: sbMkSubNav({ left: sbMkLedPanel([...]), right: sbMkSegmentMenu([...]) }).',
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
        title: 'Tablet — Segment Menu centered (alone)',
        desc: 'Tablet mode forced через mode:\'tablet\' (in real app активируется автоматически @media max-width:1024). Sub Nav column-flex, content анкорится к низу (justify-content: flex-end), X-centered. Segment Menu touches border-bottom. Высота 58 (min), но может расти до 114 при multi-row. API: sbMkSubNav({ content: sbMkSegmentMenu([...]), mode: \'tablet\' }).',
        preview: sbMkPreviewStage(mkSubNav({ content: demoSegment('top'), mode: 'tablet' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav tablet">
  <div class="sb-segment-menu icon-top">…</div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
      {
        title: 'Tablet — LED + Segment Menu (two-row stack)',
        desc: 'Multi-slot Tablet mode: column-flex стэкает слоты вертикально в HTML-порядке (left → center → right). LED Panel сверху, Segment Menu снизу (всегда у нижней границы — justify-content: flex-end). Высота растёт до 114 чтобы оба row\'а уместились. Padding/gap = 0 — rows touch без зазора. API: sbMkSubNav({ left: sbMkLedPanel([...]), right: sbMkSegmentMenu([...]), mode: \'tablet\' }).',
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
        title: 'Tablet — LED Panel centered (alone)',
        desc: 'Tablet LED-alone: variant:\'led\' overrides .tablet column-stack с row-flex + центрирование по обоим осям (justify-content + align-items: center). LED панель сидит ровно в центре бара по X и Y. API: sbMkSubNav({ content: sbMkLedPanel([...]), variant: \'led\', mode: \'tablet\' }).',
        preview: sbMkPreviewStage(mkSubNav({ content: demoLed(), variant: 'led', mode: 'tablet' }), { framed: false, preserveScroll: false }),
        html: `<header class="sb-sub-nav tablet led">
  <div class="sb-led-panel">…</div>
</header>`,
        css: COMP_CSS["sub-nav"],
      },
    ],
  });
})();
