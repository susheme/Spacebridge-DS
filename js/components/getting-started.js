// ═══════════════════════════════════════════════════════════════════════════
//  GETTING_STARTED
//  CSS в css/components/getting-started.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

// --- GETTING STARTED ---
sbRegister({
  name: 'getting-started',
  title: 'Getting Started',
  description: 'Spacebridge UI is the design system for satellite communication and network management software. Built for clarity, precision, and 24/7 operational environments.',
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
      { id: 'sec-color-palette', label: 'Color Palette' },
      { id: 'sec-typography',    label: 'Typography' },
      { id: 'sec-effect-styles', label: 'Effect Styles' },
    ];

    // Page-level breadcrumbs (site-wide pattern, см. core.js renderComponentPage).
    const bcHtml = (typeof sbBuildPageBreadcrumbs === 'function') ? sbBuildPageBreadcrumbs('getting-started') : '';
    const bcBlock = bcHtml ? `<div style="margin-bottom: var(--pad-vert-16)">${bcHtml}</div>` : '';

    return `<div class="page-shell"><div class="page fade-in">
      ${bcBlock}
      <h1 class="page-title sb-h4">Getting Started</h1>
      <p class="page-desc sb-body-l">Spacebridge UI is the design system for satellite communication and network management software. Built for clarity, precision, and 24/7 operational environments.</p>

      <div class="comp-section" id="sec-color-palette">
        <h2 class="comp-title sb-title-l">Color Palette</h2>
        <p class="comp-desc sb-body-m">Semantic color tokens that adapt between light and dark themes. Currently showing ${isDark ? 'dark' : 'light'} theme values.</p>
        ${colorHTML}
      </div>

      <div class="comp-section" id="sec-typography">
        <h2 class="comp-title sb-title-l">Typography</h2>
        <p class="comp-desc sb-body-m">Roboto is used across all Spacebridge products. The type scale ranges from 96px display to 12px captions.</p>
        ${typoHTML}
      </div>

      <div class="comp-section" id="sec-effect-styles">
        <h2 class="comp-title sb-title-l">Effect Styles</h2>
        <p class="comp-desc sb-body-m">Тени и эффекты, адаптированные под тёмную и светлую тему через CSS-токены.</p>
        <div class="typo-scale">
          ${[
            {
              name: 'Shadow-S',
              shadow: 'box-shadow: 0 2px 8px 0 var(--shadow-overlay)',
              desc: 'Стандартная elevation — карточки, поповеры, компоненты',
            },
            {
              name: 'Shadow-L',
              shadow: 'box-shadow: 0 10px 20px 0 var(--shadow-overlay)',
              desc: 'Тяжёлая elevation — модальные окна, overlay-панели',
            },
            {
              name: 'Hover-red',
              shadow: 'box-shadow: 0 6px 10px -6px var(--error-hover), 0 2px 8px 0 var(--error-hover), 0 10px 20px 0 var(--error-hover)',
              desc: 'Hover-эффект для красных элементов — critical-кнопки, деструктивные действия',
            },
            {
              name: 'Hover-blue',
              shadow: 'box-shadow: 0 6px 10px -6px var(--primary-hover), 0 2px 8px 0 var(--primary-hover), 0 10px 20px 0 var(--primary-hover)',
              desc: 'Hover-эффект для синих элементов — кнопки primary, активные состояния',
            },
            {
              name: 'Pressed',
              shadow: 'box-shadow: 1px 1px 2px 0 var(--shadow-overlay) inset, -1px -1px 2px 0 var(--shadow-lg) inset',
              bg: 'var(--surface-1)',
              desc: 'Вложенная поверхность внутри родительской — карты, секции, разделение контента',
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
              <button class="pg-code-copy-btn" onclick="navigator.clipboard.writeText('${cssSnippet}')" title="Copy">${sbIcon('file-copy-line','L')}</button>
            </div>
          </div>`;
          }).join('')}
        </div>
      </div>
    </div><aside class="page-toc">${sbMkToc(tocItems)}</aside></div>`;
  },
});

