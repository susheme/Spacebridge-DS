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
  border: var(--border-width-2) solid var(--border-soft);
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
    chevronDown: () => sbMkChevron(),
    chevronUp:   () => sbMkChevron({ dir: 'up' }),
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
    description: sbT(
      'The most compact header in the family, used in toast notifications and small cards. The left slot pairs a Symbol Badge, status or loader with the title; the right slot takes a single small icon-only button or a chevron.',
      'Самый компактный хедер семейства — для toast-уведомлений и небольших карточек. Левый слот сочетает Symbol Badge, статус или лоадер с заголовком; правый — одна маленькая icon-only кнопка или шеврон.'
    ),
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
        return `${sbPgGroup('Composition', `
            ${pg.select('leftType', [
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
        ], { label: 'Right slot' })}
            <div class="pg-toggles">${pg.toggle('flushRight', 'Flush')}</div>
          `)}`;
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
        title: sbT('Anatomy', 'Анатомия'),
        desc: sbT(
          'A single 40px row: the left slot grows to fill the available width; the right control is placed directly into the root, without a wrapper.',
          'Одна строка 40px: левый слот растягивается на доступную ширину; правый контрол кладётся прямо в корень, без обёртки.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Root:</b>'
          + '<ul><li>Height: 40px;</li><li>Background: --background;</li><li>Radius: 12 12 0 0 (a card block always adjoins below);</li><li>Padding: 8/8;</li><li>Gap: 2px.</li></ul>'
          + '<b>Left slot:</b>'
          + '<ul><li>Flex-grow;</li><li>Height: 24px;</li><li>Width: up to 700px;</li><li>Gap: 8px.</li></ul>'
          + '<b>Typography:</b>'
          + '<ul><li>Title — Title M (semibold).</li></ul>',
          '<b>Корень:</b>'
          + '<ul><li>Высота: 40px;</li><li>Фон: --background;</li><li>Radius: 12 12 0 0 (снизу всегда примыкает блок карточки);</li><li>Padding: 8/8;</li><li>Gap: 2px.</li></ul>'
          + '<b>Левый слот:</b>'
          + '<ul><li>Flex-grow;</li><li>Высота: 24px;</li><li>Ширина: до 700px;</li><li>Gap: 8px.</li></ul>'
          + '<b>Типографика:</b>'
          + '<ul><li>Заголовок — Title M (semibold).</li></ul>'
        )),
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
        desc: sbT(
          'A typical case: a warning Symbol Badge, the title and a Close button. The card content renders separately, below the header.',
          'Типичный случай: Symbol Badge (warning), заголовок и Close-кнопка. Содержимое карточки рендерится отдельно, ниже хедера.'
        ),
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
        title: sbT('Loader (Loading state)', 'Loader (состояние загрузки)'),
        desc: sbT(
          'A 24×24 spinner takes the Symbol Badge’s place in the left slot — the same sb-spin animation as in button loaders. Suited for toasts that track a long-running operation (Saving…, Connecting…).',
          'Вместо Symbol Badge в левом слоте — спиннер 24×24, та же анимация sb-spin, что у кнопок-лоадеров. Подходит для toast-уведомлений с длительной операцией (Saving…, Connecting…).'
        ),
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
        title: sbT('Flush Right (accent stripe)', 'Flush Right (акцентная полоса)'),
        desc: sbT(
          'When a toast card has a colored vertical stripe on the right, the header’s top-right corner must stay square — otherwise the stripe looks clipped. Enabled with the .flush-right modifier.',
          'Если у toast-карточки есть цветная вертикальная полоса справа, верхний правый угол хедера должен оставаться прямым — иначе полоса выглядит обрезанной. Включается модификатором .flush-right.'
        ),
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
        title: sbT('With Chevron', 'С шевроном'),
        desc: sbT(
          'An alternative to the Close button in the right slot — the DS Chevron, for collapsible toasts.',
          'Альтернатива Close-кнопке в правом слоте — Chevron из DS, для сворачиваемых toast-уведомлений.'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;max-width:360px">
          ${mkHeaderXS({
            slotLeft: `<span class="sb-status-dot online"></span><span class="sb-header-xs-title sb-title-m sb-fw-semibold">Connection</span>`,
            slotRight: sbMkChevron(),
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
