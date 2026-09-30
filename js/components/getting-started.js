// ═══════════════════════════════════════════════════════════════════════════
//  GETTING_STARTED
//  Своего CSS-файла нет: страница целиком собрана на docs-стилях
//  (css/docs.css — .color-grid, .typo-scale и т.д.). COMP_CSS не нужен.
// ═══════════════════════════════════════════════════════════════════════════

// --- GETTING STARTED ---
// Палитра печатает literal hex текущей темы (isDark в renderPage) — при
// переключении data-theme свотчи протухают. Обновляем их НА МЕСТЕ (bg,
// hex-подпись, copy-значение) без ре-рендера страницы: скролл и состояние
// не трогаются. Порядок .color-swatch в DOM = порядок COLOR_TOKENS.
if (!window.__sbGsThemeWatch) {
  window.__sbGsThemeWatch = true;
  new MutationObserver(() => {
    const swatches = document.querySelectorAll('#content .color-swatch');
    if (!swatches.length) return; // Getting Started не открыт
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const note = document.querySelector('#content .gs-theme-note');
    if (note) note.textContent = sbT(
      'Currently showing the ' + (isDark ? 'dark' : 'light') + ' theme values.',
      'Сейчас показаны значения ' + (isDark ? 'тёмной' : 'светлой') + ' темы.'
    );
    let i = 0;
    window.COLOR_TOKENS.forEach(group => group.tokens.forEach(c => {
      const sw = swatches[i++];
      if (!sw) return;
      const val = isDark ? c.dark : c.light;
      const prev = sw.querySelector('.color-swatch-preview');
      const hex  = sw.querySelector('.color-swatch-hex');
      if (prev) prev.style.background = val;
      if (hex)  hex.textContent = val;
      sw.onclick = () => copyColor(sw, val); // перебивает inline-атрибут со старым hex
    }));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

sbRegister({
  name: 'getting-started',
  title: 'Getting Started',
  description: sbT(
    'Spacebridge UI is the design system for satellite communication and network management software. Built for clarity, precision and 24/7 operational environments. This page holds the foundation: color tokens, the type scale, size tokens and effect styles.',
    'Spacebridge UI — дизайн-система для ПО спутниковой связи и управления сетями. Создана ради ясности, точности и круглосуточных операционных сред. На этой странице — фундамент: цветовые токены, типографическая шкала, размерные токены и стили эффектов.'
  ),
  renderPage() {
    const colorGroups = window.COLOR_TOKENS;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    let colorHTML = '';
    colorGroups.forEach(group => {
      colorHTML += `<h3 class="sb-title-s" style="margin:24px 0 10px;color:var(--text-tertiary)">${group.label}</h3><div class="color-grid">`;
      group.tokens.forEach(c => {
        const val = isDark ? c.dark : c.light;
        colorHTML += `<div class="color-swatch" onclick="copyColor(this,'${val}')">
          <div class="color-swatch-preview" style="background:${val}"></div>
          <div class="color-swatch-info">
            <div class="color-swatch-name sb-body-s">${c.name}</div>
            <div class="color-swatch-hex sb-sub">${val}</div>
          </div>
        </div>`;
      });
      colorHTML += '</div>';
    });

    // Значения в meta-колонке НЕ хардкодятся: токены mobile-first и меняются
    // по брейкпоинтам, а руками вписанные px уже дважды расходились с Figma.
    // Читаем текущие значения токенов через getComputedStyle при рендере;
    // копируется CSS на var(--…) — как в css/typography.css.
    const rootStyle = getComputedStyle(document.documentElement);
    const tok = v => rootStyle.getPropertyValue(v).trim();
    const weightName = w => ({ '300':'Light','400':'Regular','500':'Medium','600':'SemiBold','700':'Bold','900':'Black' }[w] || w);

    // fs / fw / lh — токены из css/typography.css (Badge — из css/components/badge.css).
    // extra — довесок класса, без которого копия неполна (caption, links).
    const typoRows = [
      { label: 'Brand', sample: 'SpaceBridge Classic', download: './SpaceBridge-Classic.otf', downloadName: 'SpaceBridge-Classic.otf' },
      { label: 'H1',      cls: 'sb-h1',      fs: '--headline-font-size-h1', fw: '--font-weight-light',    lh: '--headline-line-height-96', sample: 'Headline' },
      { label: 'H2',      cls: 'sb-h2',      fs: '--headline-font-size-h2', fw: '--font-weight-black',    lh: '--headline-line-height-64', sample: 'Headline' },
      { label: 'H3',      cls: 'sb-h3',      fs: '--headline-font-size-h3', fw: '--font-weight-black',    lh: '--headline-line-height-48', sample: 'Headline' },
      { label: 'H4',      cls: 'sb-h4',      fs: '--headline-font-size-h4', fw: '--font-weight-black',    lh: '--headline-line-height-32', sample: 'Headline' },
      { label: 'H5',      cls: 'sb-h5',      fs: '--headline-font-size-h5', fw: '--font-weight-black',    lh: '--headline-line-height-h5', sample: 'Headline' },
      { label: 'H6',      cls: 'sb-h6',      fs: '--headline-font-size-h6', fw: '--font-weight-black',    lh: '--headline-line-height-24', sample: 'Headline' },
      { label: 'H7',      cls: 'sb-h7',      fs: '--headline-font-size-h7', fw: '--font-weight-black',    lh: '--headline-line-height-16', sample: 'Headline' },
      { label: 'H8',      cls: 'sb-h8',      fs: '--headline-font-size-h8', fw: '--font-weight-bold',     lh: '--headline-line-height-h8', sample: 'Headline' },
      { label: 'Title L', cls: 'sb-title-l', fs: '--title-font-size-l',     fw: '--font-weight-medium',   lh: '--title-line-height-l',     sample: 'Section Title' },
      { label: 'Title M', cls: 'sb-title-m', fs: '--title-font-size-m',     fw: '--font-weight-semibold', lh: '--title-line-height-s',     sample: 'Component Label' },
      { label: 'Title S', cls: 'sb-title-s', fs: '--title-font-size-s',     fw: '--font-weight-bold',     lh: '--title-line-height-s',     sample: 'Section Title' },
      { label: 'Body L',  cls: 'sb-body-l',  fs: '--body-font-size-l',      fw: '--font-weight-regular',  lh: '--body-line-height',        sample: 'Saturn is the sixth planet from the Sun and is famous for its stunning rings.' },
      { label: 'Body M',  cls: 'sb-body-m',  fs: '--body-font-size-m',      fw: '--font-weight-regular',  lh: '--body-line-height',        sample: 'Saturn is the sixth planet from the Sun and is famous for its stunning rings.' },
      { label: 'Body S',  cls: 'sb-body-s',  fs: '--body-font-size-s',      fw: '--font-weight-regular',  lh: '--body-line-height',        sample: 'Saturn is the sixth planet from the Sun and is famous for its stunning rings.' },
      { label: 'Sub',     cls: 'sb-sub',     fs: '--subscription-font-size', fw: '--font-weight-regular', lh: '--subscription-line-height', sample: 'Saturn is the sixth planet from the Sun and is famous for its stunning rings.' },
      { label: 'Caption', cls: 'sb-caption', fs: '--title-font-size-caption', fw: '--font-weight-medium', lh: '--title-line-height-caption', sample: 'Status Label / Category',
        extra: 'letter-spacing: var(--letter-spacing-l); text-transform: uppercase;' },
      { label: 'Link L',  cls: 'sb-link-l',  fs: '--link-font-size-l',      fw: '--font-weight-medium',   lh: '--link-line-height',        sample: 'Learn more about Spacebridge',
        extra: 'color: var(--primary); text-decoration: underline;' },
      { label: 'Link M',  cls: 'sb-link-m',  fs: '--link-font-size-m',      fw: '--font-weight-medium',   lh: '--link-line-height',        sample: 'Learn more about Spacebridge',
        extra: 'color: var(--primary); text-decoration: underline;' },
      { label: 'Link S',  cls: 'sb-link-s',  fs: '--link-font-size-s',      fw: '--font-weight-medium',   lh: '--link-line-height',        sample: 'Learn more about Spacebridge',
        extra: 'color: var(--primary); text-decoration: underline;' },
      { label: 'Button',  cls: 'sb-btn-text',   fs: '--button-font-size',   fw: '--font-weight-semibold', lh: '--button-line-height',      sample: 'Button Label' },
      { label: 'Badge',   cls: 'sb-badge-text', fs: '--badge-font-size',    fw: '--font-weight-medium',   lh: '--button-line-height',      sample: 'Default' },
    ];

    let typoHTML = '<div class="typo-scale">';
    typoRows.forEach(r => {
      if (r.download) {
        typoHTML += `<div class="typo-row">
          <div class="typo-label sb-body-s">${r.label}</div>
          <div class="typo-sample sb-brand sb-h7">${r.sample}</div>
          <div class="typo-end">
            <div class="typo-meta sb-body-s">OTF Font</div>
            ${sbMkButton({ icon: 'download-2-line', size: 's', href: r.download,
              attrs: ` download="${r.downloadName}" title="Download font"` })}
          </div>
        </div>`;
        return;
      }
      const meta = `${tok(r.fs)} / ${weightName(tok(r.fw))} / ${tok(r.lh)}`;
      let css = `font-size: var(${r.fs}); font-weight: var(${r.fw}); line-height: var(${r.lh});`;
      if (r.extra) css += ` ${r.extra}`;
      typoHTML += `<div class="typo-row">
        <div class="typo-label sb-body-s">${r.label}</div>
        <div class="typo-sample ${r.cls}">${r.sample}</div>
        <div class="typo-end">
          <div class="typo-meta sb-body-s">${meta}</div>
          <button class="pg-code-copy-btn" onclick="copyTypo(this,'${css}')" title="Copy style">${sbIcon('file-copy-line','L')}</button>
        </div>
      </div>`;
    });
    typoHTML += '</div>';

    // Размерные токены. Списки имён — зеркало css/tokens.css (генерится из
    // Figma Dimensions-DS.json); значения читаются живьём через tok(), как в
    // шкале типографики. Демо-ячейки переиспользуют .color-swatch: observer
    // темы их не трогает — он обходит только первые COLOR_TOKENS.length
    // свотчей, а цветовая секция в DOM раньше этой.
    const sizeGroups = [
      {
        label: 'Radius',
        tokens: ['--radius-0','--radius-1','--radius-2','--radius-4','--radius-6','--radius-8','--radius-10','--radius-12','--radius-14','--radius-16','--radius-18','--radius-20','--radius-22','--radius-24','--radius-28','--radius-100'],
        demo: v => `<div style="width:36px;height:36px;background:var(--background);border:var(--border-width-1) solid var(--border);border-radius:var(${v})"></div>`,
      },
      {
        label: 'Border Width',
        tokens: ['--border-width-1','--border-width-1-5','--border-width-2','--border-width-4'],
        demo: v => `<div style="width:36px;border-top:var(${v}) solid var(--primary)"></div>`,
      },
      {
        label: 'Gap',
        tokens: ['--gap-horiz-0','--gap-horiz-xxs','--gap-horiz-xs','--gap-horiz-s','--gap-horiz-m','--gap-horiz-lg','--gap-horiz-xl','--gap-horiz-xxl','--gap-vert-0','--gap-vert-xxs','--gap-vert-xs','--gap-vert-s','--gap-vert-m','--gap-vert-lg','--gap-vert-xl','--gap-vert-xxl'],
        demo: v => `<div style="height:24px;background:var(--primary);width:var(${v})"></div>`,
      },
      {
        label: 'Padding',
        tokens: ['--pad-horiz-0','--pad-horiz-2','--pad-horiz-4','--pad-horiz-8','--pad-horiz-16','--pad-horiz-24','--pad-horiz-28','--pad-horiz-32','--pad-horiz-40','--pad-horiz-42','--pad-horiz-44','--pad-horiz-48','--pad-vert-0','--pad-vert-2','--pad-vert-4','--pad-vert-8','--pad-vert-16','--pad-vert-24','--pad-vert-28','--pad-vert-32','--pad-vert-40','--pad-vert-42','--pad-vert-44','--pad-vert-48'],
        demo: v => `<div style="height:24px;background:var(--primary);width:var(${v})"></div>`,
      },
    ];

    let sizeHTML = '';
    sizeGroups.forEach(group => {
      sizeHTML += `<h3 class="sb-title-s" style="margin:24px 0 10px;color:var(--text-tertiary)">${group.label}</h3><div class="color-grid">`;
      group.tokens.forEach(t => {
        sizeHTML += `<div class="color-swatch" onclick="copyColor(this,'var(${t})')">
          <div class="color-swatch-preview" style="height:56px;display:flex;align-items:center;justify-content:center;background:var(--surface-1)">${group.demo(t)}</div>
          <div class="color-swatch-info">
            <div class="color-swatch-name sb-body-s">${t}</div>
            <div class="color-swatch-hex sb-sub">${tok(t)}</div>
          </div>
        </div>`;
      });
      sizeHTML += '</div>';
    });

    // TOC-якоря: эта страница рендерится кастомно (renderPage), поэтому
    // TOC встраиваем вручную — стандартный auto-build из renderComponentPage
    // здесь не работает.
    const tocItems = [
      { id: 'sec-color-palette', label: sbT('Color Palette', 'Цветовая палитра') },
      { id: 'sec-typography',    label: sbT('Typography', 'Типографика') },
      { id: 'sec-size-tokens',   label: sbT('Size Tokens', 'Размерные токены') },
      { id: 'sec-effect-styles', label: sbT('Effect Styles', 'Стили эффектов') },
    ];

    // Page-level breadcrumbs (site-wide pattern, см. core.js renderComponentPage).
    const bcHtml = (typeof sbBuildPageBreadcrumbs === 'function') ? sbBuildPageBreadcrumbs('getting-started') : '';
    const bcBlock = bcHtml ? `<div style="margin-bottom: var(--pad-vert-16)">${bcHtml}</div>` : '';

    return `<div class="page-shell"><div class="page fade-in">
      ${bcBlock}
      <h1 class="page-title sb-h4">Getting Started</h1>
      <div class="page-desc sb-body-l">${sbT(
        'Spacebridge UI is the design system for satellite communication and network management software. Built for clarity, precision and 24/7 operational environments. This page holds the foundation: color tokens, the type scale, size tokens and effect styles.',
        'Spacebridge UI — дизайн-система для ПО спутниковой связи и управления сетями. Создана ради ясности, точности и круглосуточных операционных сред. На этой странице — фундамент: цветовые токены, типографическая шкала, размерные токены и стили эффектов.'
      )}</div>

      <div class="comp-section" id="sec-color-palette">
        <h2 class="comp-title sb-title-l">${sbT('Color Palette', 'Цветовая палитра')}</h2>
        <div class="comp-desc sb-body-m">${sbT(
          'Semantic color tokens that adapt between the light and dark themes. A click on a swatch copies the value.',
          'Семантические цветовые токены, адаптирующиеся между светлой и тёмной темой. Клик по свотчу копирует значение.'
        )} <span class="gs-theme-note">${sbT(
          'Currently showing the ' + (isDark ? 'dark' : 'light') + ' theme values.',
          'Сейчас показаны значения ' + (isDark ? 'тёмной' : 'светлой') + ' темы.'
        )}</span></div>
        ${colorHTML}
      </div>

      <div class="comp-section" id="sec-typography">
        <h2 class="comp-title sb-title-l">${sbT('Typography', 'Типографика')}</h2>
        <div class="comp-desc sb-body-m">${sbT(
          'Roboto is used across all Spacebridge products. The scale ranges from the 96px display size down to the 10px subscription text. Each row copies its CSS; the brand font (SpaceBridge Classic) is available for download in the first row.',
          'Во всех продуктах Spacebridge используется Roboto. Шкала — от display-размера 96px до subscription-текста 10px. Каждая строка копирует свой CSS; брендовый шрифт (SpaceBridge Classic) можно скачать в первой строке.'
        )}</div>
        ${typoHTML}
      </div>

      <div class="comp-section" id="sec-size-tokens">
        <h2 class="comp-title sb-title-l">${sbT('Size Tokens', 'Размерные токены')}</h2>
        <div class="comp-desc sb-body-m">${sbT(
          'Radii, border widths, gaps and paddings from the Figma dimension tokens. Gap and padding values follow the breakpoint. A click on a cell copies the var() reference.',
          'Радиусы, толщины обводок, гэпы и отступы из размерных токенов Figma. Значения gap и padding зависят от брейкпоинта. Клик по ячейке копирует var()-ссылку.'
        )}</div>
        ${sizeHTML}
      </div>

      <div class="comp-section" id="sec-effect-styles">
        <h2 class="comp-title sb-title-l">${sbT('Effect Styles', 'Стили эффектов')}</h2>
        <div class="comp-desc sb-body-m">${sbT(
          'Shadows and effects, adapted to the light and dark themes via CSS tokens. The copy button takes the ready-made CSS.',
          'Тени и эффекты, адаптированные под светлую и тёмную тему через CSS-токены. Кнопка копирования забирает готовый CSS.'
        )}</div>
        <div class="typo-scale">
          ${[
            {
              name: 'Shadow-S',
              shadow: 'box-shadow: 0 2px 8px 0 var(--shadow-overlay)',
              desc: sbT(
                'Standard elevation — cards, popovers, components',
                'Стандартная elevation — карточки, поповеры, компоненты'
              ),
            },
            {
              name: 'Shadow-L',
              shadow: 'box-shadow: 0 10px 20px 0 var(--shadow-overlay)',
              desc: sbT(
                'Heavy elevation — modal windows, overlay panels',
                'Тяжёлая elevation — модальные окна, overlay-панели'
              ),
            },
            {
              name: 'Hover-red',
              shadow: 'box-shadow: 0 6px 10px -6px var(--error-hover), 0 2px 8px 0 var(--error-hover), 0 10px 20px 0 var(--error-hover)',
              desc: sbT(
                'Hover effect for red elements — critical buttons, destructive actions',
                'Hover-эффект для красных элементов — critical-кнопки, деструктивные действия'
              ),
            },
            {
              name: 'Hover-blue',
              shadow: 'box-shadow: 0 6px 10px -6px var(--primary-hover), 0 2px 8px 0 var(--primary-hover), 0 10px 20px 0 var(--primary-hover)',
              desc: sbT(
                'Hover effect for blue elements — primary buttons, active states',
                'Hover-эффект для синих элементов — primary-кнопки, активные состояния'
              ),
            },
            {
              name: 'Pressed',
              shadow: 'box-shadow: 1px 1px 2px 0 var(--shadow-overlay) inset, -1px -1px 2px 0 var(--shadow-lg) inset',
              bg: 'var(--surface-1)',
              desc: sbT(
                'A nested surface inside its parent — cards, sections, content separation',
                'Вложенная поверхность внутри родительской — карточки, секции, разделение контента'
              ),
            },
          ].map(e => {
            const bg = e.bg || 'var(--background)';
            const cssSnippet = e.bg ? `background: ${e.bg}; ${e.shadow}` : e.shadow;
            return `
          <div class="typo-row">
            <div class="typo-label sb-body-s">${e.name}</div>
            ${sbMkFlex({ align: 'center', gap: 'm', cls: 'typo-sample', content: `
              <div style="width:40px;height:40px;border-radius:var(--radius-8);background:${bg};${e.shadow};flex-shrink:0"></div>
              <span class="sb-body-s" style="color:var(--text-tertiary)">${e.desc}</span>
            ` })}
            <div class="typo-end">
              <div class="typo-meta sb-sub" style="max-width:260px;word-break:break-all">${cssSnippet}</div>
              <button class="pg-code-copy-btn" onclick="copyTypo(this,'${cssSnippet}')" title="Copy">${sbIcon('file-copy-line','L')}</button>
            </div>
          </div>`;
          }).join('')}
        </div>
      </div>
    </div><aside class="page-toc">${sbMkToc(tocItems)}</aside></div>`;
  },
});

