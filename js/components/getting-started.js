// ═══════════════════════════════════════════════════════════════════════════
//  GETTING_STARTED
//  CSS в css/components/getting-started.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
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
    'Spacebridge UI is the design system for satellite communication and network management software. Built for clarity, precision and 24/7 operational environments. This page holds the foundation: color tokens, the type scale and effect styles.',
    'Spacebridge UI — дизайн-система для ПО спутниковой связи и управления сетями. Создана ради ясности, точности и круглосуточных операционных сред. На этой странице — фундамент: цветовые токены, типографическая шкала и стили эффектов.'
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

    const weightName = w => ({ '300':'Light','400':'Regular','500':'Medium','600':'SemiBold','700':'Bold','900':'Black' }[w] || w);
    const typoRows = [
      { label: 'Brand', cls: '', size: '', weight: '', lh: null, sample: 'SpaceBridge Classic', download: './SpaceBridge-Classic.otf', downloadName: 'SpaceBridge-Classic.otf' },
      { label: 'H1',      cls: 'sb-h1',       size: '96px', weight: '300', lh: null,   sample: 'Headline' },
      { label: 'H2',      cls: 'sb-h2',       size: '64px', weight: '900', lh: null,   sample: 'Headline' },
      { label: 'H3',      cls: 'sb-h3',       size: '48px', weight: '900', lh: null,   sample: 'Headline' },
      { label: 'H4',      cls: 'sb-h4',       size: '32px', weight: '900', lh: '32px', sample: 'Headline' },
      { label: 'H5',      cls: 'sb-h5',       size: '28px', weight: '900', lh: '32px', sample: 'Headline' },
      { label: 'H6',      cls: 'sb-h6',       size: '24px', weight: '900', lh: '32px', sample: 'Headline' },
      { label: 'H7',      cls: 'sb-h7',       size: '22px', weight: '900', lh: null,   sample: 'Headline' },
      { label: 'H8',      cls: 'sb-h8',       size: '20px', weight: '700', lh: null,   sample: 'Headline' },
      { label: 'Title L', cls: 'sb-title-l',  size: '18px', weight: '500', lh: null,   sample: 'Section Title' },
      { label: 'Title M', cls: 'sb-title-m',  size: '16px', weight: '500', lh: null,   sample: 'Component Label' },
      { label: 'Title S', cls: 'sb-title-s',  size: '14px', weight: '600', lh: null,   sample: 'Section Title' },
      { label: 'Body L',  cls: 'sb-body-l',   size: '16px', weight: '400', lh: '24px', sample: 'Saturn is the sixth planet from the Sun and is famous for its stunning rings.' },
      { label: 'Body M',  cls: 'sb-body-m',   size: '14px', weight: '400', lh: '20px', sample: 'Saturn is the sixth planet from the Sun and is famous for its stunning rings.' },
      { label: 'Body S',  cls: 'sb-body-s',   size: '12px', weight: '400', lh: '20px', sample: 'Saturn is the sixth planet from the Sun and is famous for its stunning rings.' },
      { label: 'Sub',     cls: 'sb-sub',      size: '10px', weight: '400', lh: '12px', sample: 'Saturn is the sixth planet from the Sun and is famous for its stunning rings.' },
      { label: 'Caption', cls: 'sb-caption',  size: '12px', weight: '500', lh: null,   sample: 'Status Label / Category' },
      { label: 'Link L',  cls: 'sb-link-l',   size: '18px', weight: '500', lh: null,   sample: 'Learn more about Spacebridge' },
      { label: 'Link M',  cls: 'sb-link-m',   size: '16px', weight: '500', lh: null,   sample: 'Learn more about Spacebridge' },
      { label: 'Link S',  cls: 'sb-link-s',   size: '14px', weight: '500', lh: null,   sample: 'Learn more about Spacebridge' },
      { label: 'Button',  cls: 'sb-btn-text',   size: '15px', weight: '600', lh: null,   sample: 'Button Label' },
      { label: 'Badge',   cls: 'sb-badge-text', size: '10px', weight: '500', lh: '12px', sample: 'Default' },
    ];

    let typoHTML = '<div class="typo-scale">';
    typoRows.forEach(r => {
      if (r.download) {
        typoHTML += `<div class="typo-row">
          <div class="typo-label sb-body-s">${r.label}</div>
          <div class="typo-sample sb-brand sb-h7">${r.sample}</div>
          <div class="typo-end">
            <div class="typo-meta sb-body-s">OTF Font</div>
            <a class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm" href="${r.download}" download="${r.downloadName}" title="Download font">${sbIcon('download-2-line','L')}</a>
          </div>
        </div>`;
        return;
      }
      const meta = `${r.size} / ${weightName(r.weight)}${r.lh ? ' / ' + r.lh : ''}`;
      let css = `font-size: ${r.size}; font-weight: ${r.weight};`;
      if (r.lh) css += ` line-height: ${r.lh};`;
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

    // TOC-якоря: эта страница рендерится кастомно (renderPage), поэтому
    // TOC встраиваем вручную — стандартный auto-build из renderComponentPage
    // здесь не работает.
    const tocItems = [
      { id: 'sec-color-palette', label: sbT('Color Palette', 'Цветовая палитра') },
      { id: 'sec-typography',    label: sbT('Typography', 'Типографика') },
      { id: 'sec-effect-styles', label: sbT('Effect Styles', 'Стили эффектов') },
    ];

    // Page-level breadcrumbs (site-wide pattern, см. core.js renderComponentPage).
    const bcHtml = (typeof sbBuildPageBreadcrumbs === 'function') ? sbBuildPageBreadcrumbs('getting-started') : '';
    const bcBlock = bcHtml ? `<div style="margin-bottom: var(--pad-vert-16)">${bcHtml}</div>` : '';

    return `<div class="page-shell"><div class="page fade-in">
      ${bcBlock}
      <h1 class="page-title sb-h4">Getting Started</h1>
      <div class="page-desc sb-body-l">${sbT(
        'Spacebridge UI is the design system for satellite communication and network management software. Built for clarity, precision and 24/7 operational environments. This page holds the foundation: color tokens, the type scale and effect styles.',
        'Spacebridge UI — дизайн-система для ПО спутниковой связи и управления сетями. Создана ради ясности, точности и круглосуточных операционных сред. На этой странице — фундамент: цветовые токены, типографическая шкала и стили эффектов.'
      )}</div>

      <div class="comp-section" id="sec-color-palette">
        <h2 class="comp-title sb-title-l">${sbT('Color Palette', 'Цветовая палитра')}</h2>
        <div class="comp-desc sb-body-m">${sbT(
          'Semantic color tokens that adapt between the light and dark themes. A click on a swatch copies the value. Currently showing the ' + (isDark ? 'dark' : 'light') + ' theme values.',
          'Семантические цветовые токены, адаптирующиеся между светлой и тёмной темой. Клик по свотчу копирует значение. Сейчас показаны значения ' + (isDark ? 'тёмной' : 'светлой') + ' темы.'
        )}</div>
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
            <div class="typo-sample" style="display:flex;align-items:center;gap: var(--gap-horiz-m)">
              <div style="width:40px;height:40px;border-radius:var(--radius-8);background:${bg};${e.shadow};flex-shrink:0"></div>
              <span class="sb-body-s" style="color:var(--text-tertiary)">${e.desc}</span>
            </div>
            <div class="typo-end">
              <div class="typo-meta sb-sub" style="max-width:260px;word-break:break-all">${cssSnippet}</div>
              <button class="pg-code-copy-btn" onclick="navigator.clipboard.writeText('${cssSnippet}').then(function(){ if (typeof sbShowSnackbar === 'function') sbShowSnackbar(); })" title="Copy">${sbIcon('file-copy-line','L')}</button>
            </div>
          </div>`;
          }).join('')}
        </div>
      </div>
    </div><aside class="page-toc">${sbMkToc(tocItems)}</aside></div>`;
  },
});

