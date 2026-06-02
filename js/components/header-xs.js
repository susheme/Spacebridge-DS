// ═══════════════════════════════════════════════════════════════════════════
//  HEADER XS
//  CSS в css/components/header-xs.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.headerXs = `.sb-header-xs {
  display: flex;
  width: 100%;
  min-width: var(--header-min-width);
  max-width: var(--header-xs-max-width);
  height: var(--header-xs-min-height);
  min-height: var(--header-xs-min-height);
  max-height: var(--header-xs-max-height);
  padding: var(--pad-horiz-8) var(--pad-vert-8);
  align-items: center;
  gap: var(--gap-vert-xxs);
  border-radius: var(--radius-12) var(--radius-12) 0 0;
  background: var(--background);
}

.sb-header-xs.flush-right {
  border-top-right-radius: 0;
}

.sb-header-xs-left {
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  max-width: var(--nav-menu-max-width-right-content);
  min-height: 24px;
  max-height: 24px;
  align-items: center;
  gap: var(--gap-vert-s);
  color: var(--text-tertiary);
}

.sb-header-xs-title {
  flex: 1 1 0;
  min-width: 0;
  /* line-height из .sb-title-m sb-fw-semibold = 12px (по Figma).
     Перебиваем до 24px (= высота слота), иначе overflow:hidden
     ниже клипает descender'ы и восклицательные. */
  line-height: var(--headline-line-height-24);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sb-header-xs-loader {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border: var(--border-width-2) solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: sb-spin 0.6s linear infinite;
}`;

// --- HEADER XS ---
(() => {
  function mkHeaderXS({ slotLeft, slotRight, flushRight = false } = {}) {
    const cls = 'sb-header-xs' + (flushRight ? ' flush-right' : '');
    const hasLeft  = slotLeft  != null && slotLeft  !== false && slotLeft  !== '';
    const hasRight = slotRight != null && slotRight !== false && slotRight !== '';
    const left  = hasLeft  ? `<div class="sb-header-xs-left">${slotLeft}</div>` : '';
    const right = hasRight ? slotRight : '';
    return `<div class="${cls}">${left}${right}</div>`;
  }

  // Expose helper для будущих хедеров и dev-консоли.
  window.sbMkHeaderXS = mkHeaderXS;

  // ── Playground content builders ───────────────────────────
  const LEFT_BUILDERS = {
    none:             () => '',
    warnLine:         () => SB_SVG.warnLine,
    warnFilled:       () => SB_SVG.warnFilled,
    critLine:         () => SB_SVG.critLine,
    critFilled:       () => SB_SVG.critFilled,
    infoLine:         () => SB_SVG.infoLine,
    infoFilled:       () => SB_SVG.infoFilled,
    loader:           () => `<span class="sb-header-xs-loader" aria-label="Loading"></span>`,
    statusOnline:     () => `<span class="sb-status-dot online"></span>`,
    statusConnecting: () => `<span class="sb-status-dot connecting"></span>`,
    statusError:      () => `<span class="sb-status-dot error"></span>`,
  };
  const LEFT_CODE_COMMENT = {
    none:             null,
    warnLine:         '<!-- Symbol Badge: warnLine SVG 24×24 -->',
    warnFilled:       '<!-- Symbol Badge: warnFilled SVG 24×24 -->',
    critLine:         '<!-- Symbol Badge: critLine SVG 24×24 -->',
    critFilled:       '<!-- Symbol Badge: critFilled SVG 24×24 -->',
    infoLine:         '<!-- Symbol Badge: infoLine SVG 24×24 -->',
    infoFilled:       '<!-- Symbol Badge: infoFilled SVG 24×24 -->',
    loader:           '<span class="sb-header-xs-loader" aria-label="Loading"></span>',
    statusOnline:     '<span class="sb-status-dot online"></span>',
    statusConnecting: '<span class="sb-status-dot connecting"></span>',
    statusError:      '<span class="sb-status-dot error"></span>',
  };
  const TITLE_TEXT = {
    short:   'Title',
    warning: 'Warning!',
    long:    'Very long title that should be truncated with an ellipsis',
  };
  const RIGHT_BUILDERS = {
    none:        () => '',
    close:       () => `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('close-line', 'S')}</button>`,
    chevronDown: () => `<div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
    chevronUp:   () => `<div class="sb-chevron">${sbIcon('arrow-up-s-line',   'L')}</div>`,
  };
  const RIGHT_CODE = {
    none:        null,
    close:       `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">\n  <!-- close-line S -->\n</button>`,
    chevronDown: `<div class="sb-chevron">\n  <!-- arrow-down-s-line L -->\n</div>`,
    chevronUp:   `<div class="sb-chevron">\n  <!-- arrow-up-s-line L -->\n</div>`,
  };

  sbRegister({
    name: 'header-xs',
    title: 'Header XS',
    description: 'Самый компактный из header-семейства (40px). Применяется в Toast Notifications и небольших Cards. Левый слот (24px высота, до 700px ширины): Symbol Badge / Status / Loader + Title M (semibold). Правый слот без обёртки — туда кладётся одна Icon-Only Small Button или Chevron. Скруглены только верхние углы 12px (нижние 0 — внизу всегда соседний блок карточки). Для toast-варианта с accent-полосой справа добавь .flush-right — top-right угол станет 0.',
    playground: {
      title: 'Header XS Playground',
      minPreview: 400,  // stage 360 + padding 24×2 = 408, нужно ~400 чтобы header не clip'нулся
      state: {
        leftType: 'warnLine',
        titleText: 'warning',
        rightType: 'close',
        flushRight: false,
      },
      controls(pg) {
        return pg.select('leftType', [
          { value: 'none',             label: 'None' },
          { value: 'warnLine',         label: 'Warning Line' },
          { value: 'warnFilled',       label: 'Warning Filled' },
          { value: 'critLine',         label: 'Critical Line' },
          { value: 'critFilled',       label: 'Critical Filled' },
          { value: 'infoLine',         label: 'Info Line' },
          { value: 'infoFilled',       label: 'Info Filled' },
          { value: 'loader',           label: 'Loader' },
          { value: 'statusOnline',     label: 'Status Online' },
          { value: 'statusConnecting', label: 'Status Connecting' },
          { value: 'statusError',      label: 'Status Error' },
        ], { label: 'Left slot' }) + pg.select('titleText', [
          { value: 'short',   label: 'Short' },
          { value: 'warning', label: 'Warning!' },
          { value: 'long',    label: 'Long (ellipsis)' },
        ], { label: 'Title' }) + pg.select('rightType', [
          { value: 'none',        label: 'None' },
          { value: 'close',       label: 'Close button' },
          { value: 'chevronDown', label: 'Chevron ↓' },
          { value: 'chevronUp',   label: 'Chevron ↑' },
        ], { label: 'Right slot' }) + `<div class="pg-toggles">${pg.toggle('flushRight', 'Flush right corner')}</div>`;
      },
      render(s) {
        const leftEl = LEFT_BUILDERS[s.leftType]();
        const titleEl = `<span class="sb-header-xs-title sb-title-m sb-fw-semibold">${TITLE_TEXT[s.titleText]}</span>`;
        const slotLeft = leftEl + titleEl;
        const slotRight = RIGHT_BUILDERS[s.rightType]();
        // Стейдж 360px → header внутри = 312px (после 24×2 padding'а), как в sections.
        return `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:360px">
          ${mkHeaderXS({ slotLeft, slotRight, flushRight: s.flushRight })}
        </div>`;
      },
      genCode(s) {
        const cls = 'sb-header-xs' + (s.flushRight ? ' flush-right' : '');
        const leftLine = LEFT_CODE_COMMENT[s.leftType];
        const titleLine = `<span class="sb-header-xs-title sb-title-m sb-fw-semibold">${TITLE_TEXT[s.titleText]}</span>`;
        const leftInner = (leftLine ? `    ${leftLine}\n` : '') + `    ${titleLine}`;
        const rightCode = RIGHT_CODE[s.rightType];
        const rightBlock = rightCode ? '\n  ' + rightCode.replace(/\n/g, '\n  ') : '';
        const html = `<div class="${cls}">
  <div class="sb-header-xs-left">
${leftInner}
  </div>${rightBlock}
</div>`;
        return { html, css: COMP_CSS.headerXs };
      },
    },
    sections: [
      {
        title: 'Anatomy',
        desc: 'Корневой контейнер 40px / background / radius 12 12 0 0 / padding 8/8 / gap 2px. Левый слот: flex-grow, 24px высота, gap 8px. Правый слот без обёртки — Icon-Only Small Button / Chevron кладётся прямо в корень.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;max-width:360px">
          ${mkHeaderXS({
            slotLeft: `<span class="sb-header-xs-title sb-title-m sb-fw-semibold">Header XS</span>`,
            slotRight: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('close-line', 'S')}</button>`,
          })}
        </div>`,
        html: `<div class="sb-header-xs">
  <div class="sb-header-xs-left">
    <span class="sb-header-xs-title sb-title-m sb-fw-semibold">Header XS</span>
  </div>
  <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
    <!-- close-line S -->
  </button>
</div>`,
        css: COMP_CSS.headerXs,
      },
      {
        title: 'Toast — Warning',
        desc: 'Типичный кейс: Symbol Badge (warning) + Title M + Close-кнопка. Контент карточки рендерится отдельно ниже хедера.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;max-width:360px">
          ${mkHeaderXS({
            slotLeft: `${SB_SVG.warnLine}<span class="sb-header-xs-title sb-title-m sb-fw-semibold">Warning!</span>`,
            slotRight: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('close-line', 'S')}</button>`,
          })}
        </div>`,
        html: `<div class="sb-header-xs">
  <div class="sb-header-xs-left">
    <!-- Symbol Badge: warnLine SVG 24×24 -->
    <span class="sb-header-xs-title sb-title-m sb-fw-semibold">Warning!</span>
  </div>
  <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
    <!-- close-line S -->
  </button>
</div>`,
        css: COMP_CSS.headerXs,
      },
      {
        title: 'Loader (Loading state)',
        desc: 'Вместо Symbol Badge в левый слот ставится крутилка 24×24. Та же sb-spin-анимация, что у кнопок-лоадеров. Полезно для toast-ов с длительной операцией ("Saving…", "Connecting…").',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;max-width:360px">
          ${mkHeaderXS({
            slotLeft: `<span class="sb-header-xs-loader" aria-label="Loading"></span><span class="sb-header-xs-title sb-title-m sb-fw-semibold">Saving…</span>`,
            slotRight: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('close-line', 'S')}</button>`,
          })}
        </div>`,
        html: `<div class="sb-header-xs">
  <div class="sb-header-xs-left">
    <span class="sb-header-xs-loader" aria-label="Loading"></span>
    <span class="sb-header-xs-title sb-title-m sb-fw-semibold">Saving…</span>
  </div>
  <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
    <!-- close-line S -->
  </button>
</div>`,
        css: COMP_CSS.headerXs,
      },
      {
        title: 'Flush Right (для accent-полосы)',
        desc: 'Когда у toast-карточки есть цветная вертикальная полоса справа, верхний правый угол хедера должен быть 0 (иначе полоса выглядит обрезанной). Включается через .flush-right.',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;max-width:360px">
          ${mkHeaderXS({
            flushRight: true,
            slotLeft: `${SB_SVG.warnLine}<span class="sb-header-xs-title sb-title-m sb-fw-semibold">Warning!</span>`,
            slotRight: `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('close-line', 'S')}</button>`,
          })}
        </div>`,
        html: `<div class="sb-header-xs flush-right">
  <div class="sb-header-xs-left">
    <!-- Symbol Badge: warnLine SVG 24×24 -->
    <span class="sb-header-xs-title sb-title-m sb-fw-semibold">Warning!</span>
  </div>
  <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">
    <!-- close-line S -->
  </button>
</div>`,
        css: COMP_CSS.headerXs,
      },
      {
        title: 'With Chevron',
        desc: 'Альтернатива close-кнопке в правом слоте — Chevron из DS (collapsible toast).',
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;max-width:360px">
          ${mkHeaderXS({
            slotLeft: `<span class="sb-status-dot online"></span><span class="sb-header-xs-title sb-title-m sb-fw-semibold">Connection</span>`,
            slotRight: `<div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
          })}
        </div>`,
        html: `<div class="sb-header-xs">
  <div class="sb-header-xs-left">
    <span class="sb-status-dot online"></span>
    <span class="sb-header-xs-title sb-title-m sb-fw-semibold">Connection</span>
  </div>
  <div class="sb-chevron">
    <!-- arrow-down-s-line L -->
  </div>
</div>`,
        css: COMP_CSS.headerXs,
      },
    ],
  });
})();
