// ═══════════════════════════════════════════════════════════════════════════
//  DOCS HELPERS — toggleCode, copyCodeSection, codeGrid, exampleBox,
//  resetPreview, dismissBanner, copyColor, copyTypo, sbMkPreviewStage.
//  Загружается после core.js, до компонентов.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * sbMkPreviewStage(content, opts) — стандартная preview-обёртка для wide-
 * компонентов (Nav Bar, Sub Nav, Tab Bar, Segment Menu, и любых других где
 * контент шире preview area).
 *
 * Решает chicken-egg проблему: `overflow-x:auto` резервирует горизонтальный
 * scrollbar (~15px) внутри wrapper'а → effective vertical area уменьшается
 * → vertical overflow → ВЕРТИКАЛЬНЫЙ scrollbar появляется без причины.
 * Inner-stage с padding 16 по периметру создаёт buffer, который поглощает
 * scrollbar reservation. Результат: только горизонтальный скролл, vertical
 * НЕ появляется (если только content реально не выше stage'а).
 *
 * opts: {
 *   stageWidth      — 'auto' (default, content-sized) | '1200px' | '100%' | etc.
 *   framed          — обводка + radius + background (default true)
 *   padded          — 16px padding по периметру (default true). КРИТИЧНО для
 *                     anti-vertical-scrollbar behavior — без неё vertical
 *                     scroll появится. Отключай только если уверен.
 *   preserveScroll  — добавляет data-pg-preserve-scroll для playground (default true).
 *                     В section preview (статичные секции) можно ставить false.
 * }
 *
 * Использование:
 *   preview: sbMkPreviewStage(sbMkNavBar({...}), { stageWidth: '1200px' })
 *   preview: sbMkPreviewStage(sbMkSubNav({...}))
 *   render(s) { return sbMkPreviewStage(sbMkSomeComponent(s), { stageWidth: '...' }); }
 */
function sbMkPreviewStage(content, opts = {}) {
  const {
    stageWidth     = 'auto',
    framed         = true,
    preserveScroll = true,
  } = opts;
  // Outer scroll-wrapper ВСЕГДА с padding-bottom 16 — поглощает резервацию
  // горизонтального scrollbar'а (~15px), без неё появляется паразитный
  // вертикальный scrollbar (chicken-egg).
  const outerStyle = 'width:100%;overflow-x:auto;padding-bottom:var(--pad-vert-16)';
  const outerAttrs = preserveScroll ? ' data-pg-preserve-scroll' : '';
  // Inner stage с рамкой — для компонентов БЕЗ собственного visual frame'а
  // (Nav Bar и т.п.). Для компонентов с собственным border'ом (Sub Nav) —
  // framed:false, тогда inner-stage НЕ оборачивается, content рендерится
  // напрямую и его border визуально не перекрывается чужой рамкой.
  if (!framed && stageWidth === 'auto') {
    return `<div${outerAttrs} style="${outerStyle}">${content}</div>`;
  }
  const innerStyles = [];
  if (stageWidth !== 'auto') innerStyles.push(`width:${stageWidth}`);
  if (framed) {
    innerStyles.push('padding:var(--pad-vert-16)');
    innerStyles.push('border-radius:var(--radius-12)');
    innerStyles.push('border:var(--border-width-1) solid var(--border)');
    innerStyles.push('background:var(--background)');
  }
  return `<div${outerAttrs} style="${outerStyle}">
    <div style="${innerStyles.join(';')}">${content}</div>
  </div>`;
}

// ═══════════════════════════════════════
//  ZONE B: DOCUMENTATION HELPERS
// ═══════════════════════════════════════
function toggleCode(btn) {
  const box = btn.closest('.example-box');
  const code = box.querySelector('.example-code');
  code.classList.toggle('open');
  btn.classList.toggle('is-active', code.classList.contains('open'));
}

function copyCodeSection(btn) {
  const section = btn.closest('.pg-code-section');
  const code = section.querySelector('pre').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.style.color = 'var(--success)';
    setTimeout(() => btn.style.color = '', 1200);
  });
}

function codeGrid(htmlStr, cssStr = '') {
  return `<div class="pg-code-grid">
    <div class="pg-code-section">
      <div class="pg-code-header">
        <span class="pg-code-label sb-caption">HTML</span>
        <button class="pg-code-copy-btn" onclick="copyCodeSection(this)" title="Copy HTML">${sbIcon('file-copy-line','L')}</button>
      </div>
      <div class="pg-code-scroll"><pre>${esc(htmlStr.trim())}</pre></div>
    </div>
    <div class="pg-code-section">
      <div class="pg-code-header">
        <span class="pg-code-label sb-caption">CSS</span>
        <button class="pg-code-copy-btn" onclick="copyCodeSection(this)" title="Copy CSS">${sbIcon('file-copy-line','L')}</button>
      </div>
      <div class="pg-code-scroll"><pre>${cssStr ? esc(cssStr.trim()) : ''}</pre></div>
    </div>
  </div>`;
}

let _exBoxId = 0;
const _exBoxInitial = {};

function exampleBox(previewHTML, codeStr, cssStr = '', opts = {}) {
  const uid = 'eb-' + (++_exBoxId);
  _exBoxInitial[uid] = previewHTML;
  const resetBtn = `<button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm" onclick="resetPreview(this)" title="Reset">${sbIcon('loop-left-line','L')}</button>`;
  return `<div class="example-box" data-eb-id="${uid}">
    <div class="example-preview${opts.col ? ' col' : ''}">${previewHTML}</div>
    <div class="example-toolbar">
      <div class="example-toolbar-left">
        ${opts.footer || ''}
        ${resetBtn}
      </div>
      <button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm" onclick="toggleCode(this)" title="Show/Hide Code">${sbIcon('code-s-slash-line','L')}</button>
    </div>
    <div class="example-code">${codeGrid(codeStr, cssStr)}</div>
  </div>`;
}

function resetPreview(btn) {
  const box = btn.closest('.example-box');
  const uid = box.getAttribute('data-eb-id');
  const preview = box.querySelector('.example-preview');
  if (uid && _exBoxInitial[uid]) {
    preview.innerHTML = _exBoxInitial[uid];
  }
}

function dismissBanner(btn) {
  const banner = btn.closest('.sb-banner');
  banner.style.transition = 'opacity 0.2s ease, height 0.2s ease, padding 0.2s ease, margin 0.2s ease, border-width 0.2s ease';
  banner.style.overflow = 'hidden';
  banner.style.height = banner.offsetHeight + 'px';
  // force reflow
  banner.offsetHeight;
  banner.style.opacity = '0';
  banner.style.height = '0';
  banner.style.padding = '0';
  banner.style.margin = '0';
  banner.style.borderWidth = '0';
  banner.addEventListener('transitionend', () => { banner.style.display = 'none'; }, { once: true });
}

function copyColor(swatch, hex) {
  navigator.clipboard.writeText(hex).then(() => {
    swatch.classList.add('copied');
    let toast = swatch.querySelector('.copy-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'copy-toast sb-body-s';
      swatch.appendChild(toast);
    }
    toast.textContent = 'Copied!';
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toast._tid);
    toast._tid = setTimeout(() => {
      toast.classList.remove('show');
      swatch.classList.remove('copied');
    }, 1500);
  });
}

function copyTypo(btn, css) {
  navigator.clipboard.writeText(css).then(() => {
    btn.style.color = 'var(--success)';
    setTimeout(() => btn.style.color = '', 1200);
  });
}
