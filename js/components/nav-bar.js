// ═══════════════════════════════════════════════════════════════════════════
//  NAV_BAR (Top Bar)
//  CSS в css/components/nav-bar.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["nav-bar"] = `.sb-nav-bar { display: flex; align-items: center; width: 100%; height: 56px; max-height: var(--nav-bar-max-height); min-width: 320px; padding: 0; background: var(--surface-1); border-bottom: var(--border-width-1) solid var(--border); gap: var(--gap-horiz-m); box-sizing: border-box; container-type: inline-size; container-name: navbar; }
.sb-nav-bar-button { display: inline-flex; align-items: center; }
.sb-nav-bar-button-icon-compact { display: none; }
.sb-nav-bar-button-icon-wide    { display: inline-flex; align-items: center; }
.sb-nav-bar-logo-compact { display: none; }
.sb-nav-bar-logo-full, .sb-nav-bar-logo-title, .sb-nav-bar-badge { display: inline-flex; align-items: center; }
.sb-nav-bar-left { display: flex; align-items: center; gap: var(--gap-horiz-s); flex-shrink: 0; min-width: 0; padding-left: var(--pad-horiz-24); }
.sb-nav-bar-center { display: flex; flex: 1 1 auto; align-items: center; justify-content: center; min-width: 0; }
.sb-nav-bar.align-right .sb-nav-bar-center { justify-content: flex-end; }
.sb-nav-bar.align-right .sb-nav-bar-tabs { margin-right: var(--pad-horiz-24); }
.sb-nav-bar-tabs { display: flex; align-items: center; gap: var(--gap-horiz-xxs); min-width: 0; }
.sb-nav-bar-right { display: flex; align-items: center; gap: var(--gap-horiz-s); flex-shrink: 0; padding-right: var(--pad-horiz-24); }
.sb-nav-btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--gap-horiz-xs); height: 28px; min-width: 88px; max-width: 144px; padding: 0 var(--pad-horiz-8); border: none; border-radius: var(--radius-100); background: transparent; color: var(--text-secondary); font-size: var(--button-font-size); font-weight: var(--font-weight-medium); line-height: var(--body-line-height); font-family: inherit; cursor: pointer; white-space: nowrap; transition: background 0.15s, color 0.15s, box-shadow 0.15s; }
.sb-nav-btn-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; line-height: var(--body-line-height); }
.sb-nav-btn-chevron { display: inline-flex; align-items: center; flex-shrink: 0; color: inherit; }
.sb-nav-btn-chevron-spacer { display: inline-flex; flex-shrink: 0; width: 16px; visibility: hidden; }
.sb-nav-btn:hover:not(.disabled):not(.selected) { box-shadow: 0 2px 8px 0 var(--shadow-sm); color: var(--text-tertiary); }
.sb-nav-btn.selected { background: var(--primary-hover); color: var(--primary); box-shadow: 1px 1px 2px 0 var(--shadow-overlay) inset, -1px -1px 2px 0 var(--shadow-lg) inset; }
.sb-nav-btn.disabled { color: var(--border); cursor: not-allowed; pointer-events: none; }
.sb-nav-bar.floating { position: sticky; top: 16px; z-index: 10; margin: 16px; max-width: calc(100% - 32px); border-bottom: none; border-radius: var(--radius-12); box-shadow: 0 2px 8px 0 var(--shadow-sm); transition: margin 0.25s ease, max-width 0.25s ease, border-radius 0.25s ease, top 0.25s ease, box-shadow 0.25s ease; }
.sb-nav-bar.floating.is-stuck { top: 0; margin: 0; max-width: 100%; border-radius: 0; box-shadow: 0 4px 12px 0 var(--shadow-sm); }
.sb-nav-bar-search-wide { display: inline-flex; align-items: center; }
.sb-nav-bar-search-compact-trigger { display: none; }
.sb-nav-bar:where([data-density="L1"],[data-density="L2"],[data-density="L3"],[data-density="L4"],[data-density="L5"]) .sb-nav-bar-badge { display: none; }
.sb-nav-bar:where([data-density="L2"],[data-density="L3"],[data-density="L4"],[data-density="L5"]) .sb-nav-bar-logo-title { display: none; }
.sb-nav-bar:where([data-density="L3"],[data-density="L4"],[data-density="L5"]) .sb-nav-bar-search-wide { display: none; }
.sb-nav-bar:where([data-density="L3"],[data-density="L4"],[data-density="L5"]) .sb-nav-bar-search-compact-trigger { display: inline-flex; align-items: center; }
.sb-nav-bar:where([data-density="L4"],[data-density="L5"]) .sb-nav-bar-center { display: none; }
.sb-nav-bar:where([data-density="L4"],[data-density="L5"]) .sb-nav-bar-right { margin-left: auto; }
.sb-nav-bar[data-density="L5"] .sb-nav-bar-logo-full { display: none; }
.sb-nav-bar[data-density="L5"] .sb-nav-bar-logo-compact { display: inline-flex; align-items: center; }
.sb-nav-bar[data-density="L5"] .sb-nav-bar-button-icon-wide { display: none; }
.sb-nav-bar[data-density="L5"] .sb-nav-bar-button-icon-compact { display: inline-flex; align-items: center; }
.sb-nav-bar[data-density="L5"] .sb-nav-bar-left { padding-left: var(--pad-horiz-16); }
.sb-nav-bar[data-density="L5"] .sb-nav-bar-right { padding-right: var(--pad-horiz-16); margin-left: auto; }
@container navbar (max-width: 1024px) {
  .sb-nav-bar:not([data-density]) .sb-nav-bar-left  { padding-left:  var(--pad-horiz-16); }
  .sb-nav-bar:not([data-density]) .sb-nav-bar-right { padding-right: var(--pad-horiz-16); margin-left: auto; }
  .sb-nav-bar:not([data-density]) .sb-nav-bar-center { display: none; }
  .sb-nav-bar:not([data-density]) .sb-nav-bar-logo-full,
  .sb-nav-bar:not([data-density]) .sb-nav-bar-logo-title,
  .sb-nav-bar:not([data-density]) .sb-nav-bar-badge { display: none; }
  .sb-nav-bar:not([data-density]) .sb-nav-bar-logo-compact { display: inline-flex; align-items: center; }
  .sb-nav-bar:not([data-density]) .sb-nav-bar-button-icon-wide    { display: none; }
  .sb-nav-bar:not([data-density]) .sb-nav-bar-button-icon-compact { display: inline-flex; align-items: center; }
  .sb-nav-bar:not([data-density]) .sb-nav-bar-search-wide { display: none; }
  .sb-nav-bar:not([data-density]) .sb-nav-bar-search-compact-trigger { display: inline-flex; align-items: center; }
}
@container navbar (max-width: 640px) {
  .sb-nav-bar.floating { margin: 8px; max-width: calc(100% - 16px); }
}
.sb-nav-bar-search-overlay { position: fixed; inset: 0; z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
.sb-nav-bar-search-overlay.is-open { opacity: 1; pointer-events: auto; }
.sb-nav-bar-search-overlay-backdrop { position: absolute; inset: 0; background: var(--shadow-overlay); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
.sb-nav-bar-search-overlay-content { position: absolute; top: 12px; left: 50%; transform: translate(-50%, -8px); width: calc(100% - var(--pad-horiz-32)); max-width: 600px; display: flex; align-items: center; gap: var(--gap-horiz-s); opacity: 0; transition: transform 0.2s ease, opacity 0.2s ease; }
.sb-nav-bar-search-overlay.is-open .sb-nav-bar-search-overlay-content { transform: translate(-50%, 0); opacity: 1; }
.sb-nav-bar-search-overlay-content > .sb-search { flex: 1; min-width: 0; }
.sb-nav-lang-btn { min-width: auto; }
.sb-nav-lang-switcher.is-open .sb-nav-lang-btn svg { transform: rotate(180deg); }
.sb-nav-lang-btn svg { transition: transform 0.15s ease; }`;

// --- NAV BAR ---
(() => {
  const CHEVRON_DOWN = sbIcon('arrow-down-s-line', 16);
  const BURGER       = sbIcon('menu-line', 'L');

  /**
   * sbMkNavBtn(opts) — одна кнопка раздела.
   *   label      — текст (обрезается многоточием при > max-width 144)
   *   selected   — активный раздел (--primary-hover bg + Pressed shadow)
   *   disabled   — серый текст --border, не кликается
   *   hasChevron — chevron-down в right-slot (для dropdown-кнопок)
   */
  function mkNavBtn(opts = {}) {
    const { label = 'Section', selected, disabled, hasChevron, menuItems } = opts;
    let cls = 'sb-nav-btn';
    if (selected) cls += ' selected';
    if (disabled) cls += ' disabled';
    const chev = hasChevron ? `<span class="sb-nav-btn-chevron">${CHEVRON_DOWN}</span>` : '';
    // Optical balance: невидимый spacer слева балансирует chevron справа,
    // чтобы label визуально оказался по центру кнопки.
    const chevSpacer = hasChevron ? `<span class="sb-nav-btn-chevron-spacer" aria-hidden="true"></span>` : '';

    // Без menuItems — обычная кнопка с click-select handler'ом.
    if (!menuItems || !menuItems.length) {
      const onclickAttr = disabled ? '' : ' onclick="sbSelectNavBtn(this)"';
      return `<button class="${cls}" type="button"${disabled ? ' disabled' : ''}${onclickAttr}>
        ${chevSpacer}<span class="sb-nav-btn-label">${label}</span>${chev}
      </button>`;
    }

    // С menuItems — оборачиваем в .sb-overflow-menu с .sb-ctx-card,
    // hover-intent + click-toggle для открытия dropdown'а.
    // Items идут как sb-ctx-cell mode='select' (sticky check, без иконок).
    const cells = menuItems.map(item => sbMkContextCell({
      label: item.label,
      state: item.selected ? 'selected' : (item.disabled ? 'disabled' : undefined),
      mode: 'select',
    })).join('');
    const clickHandler = disabled ? '' : ' onclick="sbNavBarDropdownClick(this)"';
    return `<div class="sb-overflow-menu sb-nav-btn-dropdown"
                 onmouseenter="sbNavBarDropdownOpen(this)"
                 onmouseleave="sbNavBarDropdownClose(this)">
      <button class="${cls}" type="button"${disabled ? ' disabled' : ''}${clickHandler}>
        ${chevSpacer}<span class="sb-nav-btn-label">${label}</span>${chev}
      </button>
      <div class="sb-ctx-card">${cells}</div>
    </div>`;
  }

  // Single-select handler — snap .selected на нажатой кнопке, снимаем
  // с соседей в том же .sb-nav-bar-tabs контейнере. Через .closest, чтобы
  // работало и когда btn вложен в .sb-overflow-menu wrapper (dropdown-таб).
  window.sbSelectNavBtn = function(btn) {
    if (!btn || btn.classList.contains('disabled')) return;
    const tabs = btn.closest('.sb-nav-bar-tabs');
    if (!tabs) return;
    tabs.querySelectorAll('.sb-nav-btn.selected')
      .forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  };

  // ── HOVER-DROPDOWN handlers для nav-btn'ов с menuItems ──────────────
  // Intent-delays — чтобы меню не «прыгало» при случайном проходе мышью:
  //   mouseenter → open через 100ms
  //   mouseleave → close через 200ms (cancel'ится при возврате)
  // Click работает мгновенно, отменяя все таймеры (для тача/клавиатуры).
  window.sbNavBarDropdownOpen = function(wrap) {
    clearTimeout(wrap._navBtnCloseTimer); wrap._navBtnCloseTimer = null;
    if (wrap.classList.contains('is-open') || wrap._navBtnOpenTimer) return;
    wrap._navBtnOpenTimer = setTimeout(() => {
      wrap._navBtnOpenTimer = null;
      if (wrap.classList.contains('is-open')) return;
      const trigger = wrap.querySelector('.sb-nav-btn');
      if (trigger) sbOverflowMenuToggle(trigger);
    }, 100);
  };
  window.sbNavBarDropdownClose = function(wrap) {
    clearTimeout(wrap._navBtnOpenTimer); wrap._navBtnOpenTimer = null;
    if (!wrap.classList.contains('is-open') || wrap._navBtnCloseTimer) return;
    wrap._navBtnCloseTimer = setTimeout(() => {
      wrap._navBtnCloseTimer = null;
      wrap.classList.remove('is-open');
    }, 200);
  };
  // Click: cancel any pending hover-таймеры + toggle сразу.
  window.sbNavBarDropdownClick = function(btn) {
    const wrap = btn.closest('.sb-overflow-menu');
    if (wrap) {
      clearTimeout(wrap._navBtnOpenTimer);  wrap._navBtnOpenTimer = null;
      clearTimeout(wrap._navBtnCloseTimer); wrap._navBtnCloseTimer = null;
    }
    sbSelectNavBtn(btn);
    sbOverflowMenuToggle(btn);
  };

  /**
   * sbMkNavBar(opts) — полный nav-bar.
   *   leftSlot   — HTML для левого слота (logo + extras)
   *   tabs       — массив { label, selected, disabled, hasChevron } для центральных кнопок
   *                Selected допускается только у ОДНОЙ — лишние игнорируются.
   *                До 7 элементов; сверх — обрезаются с console.warn.
   *   rightSlot  — массив HTML-строк до 4. Сверх — обрезаются с console.warn.
   *   align      — 'center' (default) | 'right'
   */
  function mkNavBar(opts = {}) {
    const {
      // Структурные слоты — отдельные пропсы для responsive переключения.
      // Когда container < 1024px: full-logo / title / badge прячутся,
      // logo-compact показывается. Button всегда виден, но иконку внутри
      // CSS swap'ает (.sb-nav-bar-button-icon-wide/-compact).
      button,         // HTML кнопки (с двумя icon-spans внутри для swap'а)
      logo,           // HTML full-logo (wide mode only)
      logoCompact,    // HTML compact-logo (compact mode only)
      logoTitle,      // HTML текста справа от лого (wide mode only)
      badge,          // HTML бейджа (wide mode only)
      // Search Bar — отдельный prop. Wide-mode: рендерится full search;
      // compact-mode: заменяется secondary icon-only кнопкой, которая
      // по клику открывает overlay с full search'ем (см. sbNavBarOpenSearch).
      search,
      // Fallback raw HTML — used when структурные пропсы не переданы.
      // Без responsive магии — content остаётся как есть.
      leftSlot = '',
      rightSlot = [], align = 'center', floating = false,
    } = opts;
    let tabs = opts.tabs || [];

    if (tabs.length > 7) {
      console.warn('sbMkNavBar: tabs > 7, обрезаю до 7');
      tabs = tabs.slice(0, 7);
    }
    let seenSelected = false;
    tabs = tabs.map(t => {
      if (t.selected && !seenSelected) { seenSelected = true; return t; }
      return { ...t, selected: false };
    });

    let right = rightSlot;
    if (right.length > 4) {
      console.warn('sbMkNavBar: rightSlot > 4, обрезаю до 4 (используй more-button для overflow)');
      right = right.slice(0, 4);
    }

    const tabsHTML = tabs.length
      ? `<div class="sb-nav-bar-tabs">${tabs.map(mkNavBtn).join('')}</div>`
      : '';

    // Если хоть один структурный проп передан — собираем left-slot из них
    // (responsive через CSS container query). Иначе используем raw leftSlot.
    const hasStructured = button || logo || logoCompact || logoTitle || badge;
    let leftContent = '';
    if (hasStructured) {
      if (button)      leftContent += `<span class="sb-nav-bar-button">${button}</span>`;
      if (logo)        leftContent += `<span class="sb-nav-bar-logo-full">${logo}</span>`;
      if (logoCompact) leftContent += `<span class="sb-nav-bar-logo-compact">${logoCompact}</span>`;
      if (logoTitle)   leftContent += `<span class="sb-nav-bar-logo-title">${logoTitle}</span>`;
      if (badge)       leftContent += `<span class="sb-nav-bar-badge">${badge}</span>`;
    } else {
      leftContent = leftSlot;
    }

    let cls = 'sb-nav-bar';
    if (align === 'right') cls += ' align-right';
    if (floating)          cls += ' floating';

    // Search slot: wide-вариант (full search) + compact-trigger (icon-only кнопка).
    // Container query показывает один из двух. Overlay рендерим внутри header'а
    // — fixed-positioning выходит из всех ancestor-clip'ов.
    let searchSlot = '';
    let searchOverlay = '';
    if (search) {
      searchSlot = `<div class="sb-nav-bar-search-wide">${search}</div>` +
        `<button class="sb-btn sb-btn-secondary sb-btn-icon sb-nav-bar-search-compact-trigger" type="button" onclick="sbNavBarOpenSearch(this)" aria-label="Open search">${sbIcon('search-line', 'L')}</button>`;
      searchOverlay = `<div class="sb-nav-bar-search-overlay">
        <div class="sb-nav-bar-search-overlay-backdrop" onclick="sbNavBarCloseSearch(this)"></div>
        <div class="sb-nav-bar-search-overlay-content">${search}<button class="sb-btn sb-btn-secondary sb-btn-icon" type="button" onclick="sbNavBarCloseSearch(this)" aria-label="Close search">${sbIcon('close-line', 'L')}</button></div>
      </div>`;
    }

    return `<header class="${cls}">
      <div class="sb-nav-bar-left">${leftContent}</div>
      <div class="sb-nav-bar-center">${tabsHTML}</div>
      <div class="sb-nav-bar-right">${searchSlot}${right.join('')}</div>
      ${searchOverlay}
    </header>`;
  }

  // Search-overlay handlers — открывают/закрывают полноразмерный search
  // в overlay'е поверх nav-bar'а. ESC и outside-click тоже закрывают.
  window.sbNavBarOpenSearch = function(triggerEl) {
    const bar = triggerEl.closest('.sb-nav-bar');
    if (!bar) return;
    const overlay = bar.querySelector('.sb-nav-bar-search-overlay');
    if (!overlay) return;
    overlay.classList.add('is-open');
    const input = overlay.querySelector('.sb-search-input');
    if (input) setTimeout(() => input.focus(), 50);
  };
  window.sbNavBarCloseSearch = function(srcEl) {
    const overlay = srcEl.closest('.sb-nav-bar-search-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
  };
  // One-time global ESC listener — закрывает любые открытые overlay'ы.
  if (!window.__sbNavBarSearchBound) {
    window.__sbNavBarSearchBound = true;
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.sb-nav-bar-search-overlay.is-open')
        .forEach(el => el.classList.remove('is-open'));
    });
  }

  /**
   * sbWireNavBarFloating(container, navBar) — публичный helper для
   * scroll-to-stuck behavior. Создаёт sentinel перед navBar и навешивает
   * IntersectionObserver. Возвращает функцию dispose() для cleanup.
   *
   * Пример:
   *   const dispose = sbWireNavBarFloating(document.body, document.querySelector('.sb-nav-bar.floating'));
   *   // ... позже при unmount:
   *   dispose();
   */
  function wireFloating(scrollRoot, navBar) {
    if (!scrollRoot || !navBar) return () => {};
    // Sentinel — 1px-плашка, отслеживающая «не скроллились ещё» состояние.
    // Два сценария размещения:
    //   1) Bar ВНУТРИ scrollRoot (классический page-level sticky): sentinel
    //      кладём перед bar (его previousElementSibling) — уходит из view
    //      ровно когда контент над баром прокручивается прочь.
    //   2) Bar СНАРУЖИ scrollRoot (bar и scroll-area — sibling'и; используется
    //      когда нужно, чтобы scrollbar упирался в низ bar'а, а не покрывал
    //      его область): sentinel кладём первым ребёнком scrollRoot'а —
    //      уходит из view как только пользователь начинает скроллить.
    const barInside = scrollRoot.contains(navBar);
    let sentinel;
    if (barInside) {
      sentinel = navBar.previousElementSibling;
      if (!sentinel || !sentinel.classList.contains('sb-nav-bar-sentinel')) {
        sentinel = document.createElement('div');
        sentinel.className = 'sb-nav-bar-sentinel';
        sentinel.style.height = '1px';
        navBar.parentNode.insertBefore(sentinel, navBar);
      }
    } else {
      sentinel = scrollRoot.firstElementChild;
      if (!sentinel || !sentinel.classList.contains('sb-nav-bar-sentinel')) {
        sentinel = document.createElement('div');
        sentinel.className = 'sb-nav-bar-sentinel';
        sentinel.style.height = '1px';
        sentinel.style.width = '100%';
        scrollRoot.insertBefore(sentinel, scrollRoot.firstChild);
      }
    }
    const obs = new IntersectionObserver(
      ([entry]) => navBar.classList.toggle('is-stuck', !entry.isIntersecting),
      { root: scrollRoot === document.body ? null : scrollRoot, threshold: 0 }
    );
    obs.observe(sentinel);
    return () => { obs.disconnect(); sentinel.remove(); };
  }

  // ── SMART COLLAPSE ──────────────────────────────────────────────────
  // Progressive density management. JS меряет реальные ширины слотов
  // ОДИН РАЗ при mount (natural widths), потом решает density level
  // на каждом resize по чистой арифметике — никаких layout reads в
  // hot path. 6 уровней — каждый прячет один доп. элемент:
  //   L0 — всё видно
  //   L1 — drop badge
  //   L2 — drop logoTitle
  //   L3 — search-wide → icon-trigger (overlay)
  //   L4 — drop tabs (center hidden)
  //   L5 — logoFull → compact + button icon swap + 16px paddings
  // Hysteresis в 24px не даёт прыгать density на границе threshold'а.
  // CSS rules:
  //   - .sb-nav-bar[data-density="..."] — селекторы переключают слоты;
  //   - @container правила имеют :not([data-density]) — fallback для
  //     bare-HTML usage без JS.
  // Auto-wire через MutationObserver — все .sb-nav-bar в DOM получают
  // smart-collapse автоматически, без явного вызова.
  const SMART_MIN_GAP = 32;
  const SMART_HYSTERESIS = 24;
  const SMART_ICON_BTN = 40;
  const SMART_LEVELS = ['L0','L1','L2','L3','L4','L5'];

  function wireSmartCollapse(bar) {
    if (!bar || bar.__smartWired) return () => {};
    bar.__smartWired = true;
    // Ставим data-density СРАЗУ — это:
    // 1) отключает @container fallback rules (:not([data-density])),
    // 2) обеспечивает L0-визуал для корректного измерения natural widths.
    bar.dataset.density = 'L0';

    // natural — IMMUTABLE кэш ширин слотов от L0-состояния. Снимаем ОДИН
    // раз через rAF после mount'а (когда layout уже точно settled), и
    // больше НИКОГДА не перезахватываем. Это убирает целый класс багов
    // c corruption natural'ов когда recapture'ится в момент, когда бар
    // в collapsed-состоянии (display:none → scrollWidth=0 → мусор).
    // Цена — natural может быть на 5-10px не идеальным если fonts ещё
    // не дозагрузились в момент measure. В рамках 32px gap'а — пофиг.
    let natural = null;
    let currentLevel = 'L0';
    let rafPending = false;

    function readW(sel) {
      const el = bar.querySelector(sel);
      return el ? el.scrollWidth : 0;
    }

    function captureNatural() {
      bar.dataset.density = 'L0';
      // Flush pending style/layout invalidations — без этого scrollWidth
      // на дочерних слотах может вернуться от ПРЕДЫДУЩЕГО state (если
      // бар был collapsed) → display:none → scrollWidth=0 → corruption.
      void bar.offsetWidth;
      natural = {
        left:       readW('.sb-nav-bar-left'),
        right:      readW('.sb-nav-bar-right'),
        tabs:       readW('.sb-nav-bar-tabs'),
        badge:      readW('.sb-nav-bar-badge'),
        logoTitle:  readW('.sb-nav-bar-logo-title'),
        searchWide: readW('.sb-nav-bar-search-wide'),
      };
    }

    // decide(total) — чистая арифметика, БЕЗ DOM reads. Hot path.
    function decide(total) {
      if (!natural || total <= 0) return 'L0';
      const n = natural;
      const g = SMART_MIN_GAP;
      if (total >= n.left + n.right + n.tabs + 2 * g) return 'L0';
      const left1 = n.left - n.badge;
      if (total >= left1 + n.right + n.tabs + 2 * g) return 'L1';
      const left2 = left1 - n.logoTitle;
      if (total >= left2 + n.right + n.tabs + 2 * g) return 'L2';
      const right3 = n.right - n.searchWide + (n.searchWide ? SMART_ICON_BTN : 0);
      if (total >= left2 + right3 + n.tabs + 2 * g) return 'L3';
      if (total >= left2 + right3 + g) return 'L4';
      return 'L5';
    }

    function update() {
      rafPending = false;
      if (!bar.isConnected) return;
      // natural может быть null если update пришёл от RO ДО initial rAF.
      // Просто скипаем — initial rAF всё равно вызовет update() сам.
      if (!natural) return;
      const total = bar.getBoundingClientRect().width;
      if (total <= 0) return;

      let next = decide(total);
      const curIdx = SMART_LEVELS.indexOf(currentLevel);
      const nxtIdx = SMART_LEVELS.indexOf(next);
      if (nxtIdx < curIdx) {
        const conservative = decide(total - SMART_HYSTERESIS);
        if (SMART_LEVELS.indexOf(conservative) >= curIdx) return; // stay
        next = conservative;
      }
      if (next !== currentLevel) {
        currentLevel = next;
        bar.dataset.density = next;
      }
    }

    function scheduleUpdate() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(update);
    }

    // Initial capture — DEFERRED в rAF. Sync capture был racy: на mount'е
    // bar.getBoundingClientRect().width мог быть 0 / неверным, особенно
    // при position:sticky внутри flex-column (sticky участвует в flex
    // sizing нетипично, размер резолвится во второй frame'е).
    // rAF гарантирует, что layout первого кадра уже completed.
    requestAnimationFrame(() => {
      if (!bar.isConnected || !bar.__smartWired) return;
      captureNatural();
      update();
    });

    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(bar);

    // Публичный API на случай, если consumer меняет содержимое слотов
    // runtime'ом (добавляет/убирает tabs, меняет логотип и т.п.).
    // ВАЖНО: вызывать ТОЛЬКО когда бар в L0-state (or force его перед
    // вызовом), иначе natural закэшируется от collapsed-state и поломает
    // smart-collapse навсегда.
    bar.__smartRecompute = () => {
      natural = null;
      scheduleUpdate();
    };

    return () => {
      ro.disconnect();
      bar.__smartWired = false;
      delete bar.__smartRecompute;
      delete bar.dataset.density;
    };
  }

  // Auto-wire: single MutationObserver на весь app. Каждый новый
  // .sb-nav-bar в DOM автоматически получает smart-collapse, при
  // удалении — dispose'ится (RO disconnect). Один MO instance на window
  // — не множим (см. __sbNavBarAutoWire flag).
  const wiredBars = new WeakMap();
  function scanWire(root) {
    if (!root || root.nodeType !== 1) return;
    const list = root.matches && root.matches('.sb-nav-bar')
      ? [root]
      : (root.querySelectorAll ? root.querySelectorAll('.sb-nav-bar') : []);
    for (const bar of list) {
      if (!wiredBars.has(bar)) wiredBars.set(bar, wireSmartCollapse(bar));
    }
  }
  function scanDispose(root) {
    if (!root || root.nodeType !== 1) return;
    const list = root.matches && root.matches('.sb-nav-bar')
      ? [root]
      : (root.querySelectorAll ? root.querySelectorAll('.sb-nav-bar') : []);
    for (const bar of list) {
      const d = wiredBars.get(bar);
      if (d) { d(); wiredBars.delete(bar); }
    }
  }
  if (!window.__sbNavBarAutoWire) {
    window.__sbNavBarAutoWire = true;
    const initAutoWire = () => {
      scanWire(document.body);
      const mo = new MutationObserver(muts => {
        for (const m of muts) {
          for (const n of m.addedNodes)   scanWire(n);
          for (const n of m.removedNodes) scanDispose(n);
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAutoWire, { once: true });
    } else {
      initAutoWire();
    }
  }

  window.sbMkNavBar = mkNavBar;
  window.sbMkNavBtn = mkNavBtn;
  window.sbWireNavBarFloating = wireFloating;
  window.sbWireNavBarSmartCollapse = wireSmartCollapse;

  // ── Демо-конструкторы для preview-секций ────────────────────────────
  const DEMO_LOGO = `<span class="sb-brand" style="font-size:18px;color:var(--primary)">SPACEBRIDGE</span>`;
  const DEMO_LOGO_COMPACT = `<span class="sb-brand" style="font-size:18px;color:var(--primary)">SB</span>`;
  const DEMO_LOGO_TITLE = `<span class="sb-caption" style="color:var(--text-secondary)">| Mission Control</span>`;
  const DEMO_BADGE = `<span class="sb-badge-status mini bs-green">v2.4</span>`;
  // Кнопка слева от лого: в wide режиме показывает side-bar (collapse sidebar),
  // в compact — burger (open side menu). Иконки переключаются через CSS
  // (см. .sb-nav-bar-button-icon-wide/-compact в nav-bar.css).
  const DEMO_BUTTON = `<button class="sb-btn sb-btn-secondary sb-btn-icon" type="button" aria-label="Toggle side menu">
    <span class="sb-nav-bar-button-icon-wide">${sbIcon('side-bar-line', 'L')}</span>
    <span class="sb-nav-bar-button-icon-compact">${BURGER}</span>
  </button>`;
  const DEMO_BELL = `<button class="sb-btn sb-btn-secondary sb-btn-icon" type="button" aria-label="Notifications">${sbIcon('notification-3-fill', 'L')}</button>`;
  const DEMO_SEARCH = `<div style="width:240px">${sbMkSearch({ iconLeft: true, placeholder: 'Search', rightSlot: sbMkKbdGroup(['⌘','K']) })}</div>`;
  // Avatar — кликабельный, по нажатию открывает context-menu c tip
  // (Settings / Logout). Используем штатный sb-overflow-menu pattern
  // и .sb-ctx-card.with-tip из context-menu component.
  const DEMO_AVATAR = `<div class="sb-overflow-menu">
    <div class="sb-avatar" onclick="sbOverflowMenuToggle(this)" style="cursor:pointer">
      <div class="sb-avatar-circle"><span class="sb-avatar-initials">VS</span></div>
    </div>
    <div class="sb-ctx-card with-tip">
      ${sbMkContextCell({ iconLeft: 'user-line',   label: 'Settings', mode: 'action' })}
      ${sbMkContextCell({ iconLeft: 'lock-2-line', label: 'Logout',   mode: 'action' })}
    </div>
  </div>`;
  const DEMO_PRIMARY = `<button class="sb-btn sb-btn-primary" type="button">Login</button>`;

  // ── Language Switcher ──────────────────────────────────────────────
  // Secondary Small кнопка с chevron-down (icon-R). По hover открывается
  // .sb-ctx-card с 4 языками (ENG/RUS/FRA/ESP). Клик по cell обновляет
  // лейбл кнопки и закрывает меню. Сейчас демо — реального переключения
  // языков ещё нет, но UX-паттерн и DOM готовы для будущего wiring'а.
  const LANG_OPTIONS = ['ENG', 'RUS', 'FRA', 'ESP'];
  function mkLangSwitcher(opts = {}) {
    const selected = opts.selected || 'ENG';
    const cells = LANG_OPTIONS.map(code => {
      const cls = code === selected ? 'sb-ctx-cell is-selected' : 'sb-ctx-cell';
      return `<div class="${cls}" onclick="sbNavBarLangPick(this, '${code}')">
        <span class="sb-ctx-cell-label sb-title-m sb-fw-semibold">${code}</span>
        <span class="sb-ctx-cell-right"><span class="sb-ctx-cell-icon-check">${sbIcon('check-line', 'S')}</span></span>
      </div>`;
    }).join('');
    return `<div class="sb-overflow-menu sb-nav-lang-switcher"
         onmouseenter="sbNavBarLangOpen(this)"
         onmouseleave="sbNavBarLangClose(this)">
      <button class="sb-btn sb-btn-secondary sb-nav-lang-btn" type="button"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
        <span class="sb-nav-lang-label">${selected}</span>${sbIcon('arrow-drop-down-line', 'L')}
      </button>
      <div class="sb-ctx-card">${cells}</div>
    </div>`;
  }

  window.sbMkLangSwitcher = mkLangSwitcher;

  // Hover-intent handlers для lang switcher'а (аналог sbNavBarDropdownOpen/Close
  // но targets .sb-nav-lang-btn). Open после 100ms, close после 200ms — чтобы
  // меню не «прыгало» при случайном проходе мышью.
  window.sbNavBarLangOpen = function(wrap) {
    clearTimeout(wrap._langCloseTimer); wrap._langCloseTimer = null;
    if (wrap.classList.contains('is-open') || wrap._langOpenTimer) return;
    wrap._langOpenTimer = setTimeout(() => {
      wrap._langOpenTimer = null;
      if (wrap.classList.contains('is-open')) return;
      const trigger = wrap.querySelector('.sb-nav-lang-btn');
      if (trigger) sbOverflowMenuToggle(trigger);
    }, 100);
  };
  window.sbNavBarLangClose = function(wrap) {
    clearTimeout(wrap._langOpenTimer); wrap._langOpenTimer = null;
    if (!wrap.classList.contains('is-open') || wrap._langCloseTimer) return;
    wrap._langCloseTimer = setTimeout(() => {
      wrap._langCloseTimer = null;
      wrap.classList.remove('is-open');
    }, 200);
  };
  // Pick: обновляем выбранный cell + лейбл кнопки + закрываем dropdown.
  // Если внутри playground'а (есть SB_PG state с ключом 'lang') — синкаем
  // туда, чтобы re-render после toggle controls'ов сохранил выбор.
  window.sbNavBarLangPick = function(cell, code) {
    const card = cell.parentElement;
    if (card) {
      card.querySelectorAll('.sb-ctx-cell').forEach(c => c.classList.remove('is-selected'));
    }
    cell.classList.add('is-selected');
    const wrap = cell.closest('.sb-overflow-menu');
    if (!wrap) return;
    const label = wrap.querySelector('.sb-nav-lang-label');
    if (label) label.textContent = code;
    wrap.classList.remove('is-open');
    // Sync into playground state if we're inside one. SB_PG — top-level const
    // в core.js, не на window — поэтому проверяем через typeof.
    if (typeof SB_PG !== 'undefined' && SB_PG._states && SB_PG._states['nav-bar']) {
      SB_PG._states['nav-bar'].lang = code;
    }
  };

  sbRegister({
    name: 'nav-bar',
    title: 'Nav Bar (Top Bar)',
    // Nav Bar — full-width компонент. TOC съел бы ~260px у .page, оставив
    // playground всего ~750px. Container threshold 1024 → всё равно compact,
    // но без TOC хотя бы ~848px даёт больше места для compact-демо.
    // См. core.js renderComponentPage noToc-логику.
    noToc: true,
    // Подцепляем scroll-demo через публичный helper.
    // renderPage() вызывает onMount() после innerHTML — DOM уже готов.
    onMount() {
      const demo = document.getElementById('nav-bar-scroll-demo');
      if (!demo) return;
      const bar = demo.querySelector('.sb-nav-bar.floating');
      // Bar — sibling scroll-area, scrollbar упирается в низ bar'а.
      // wireFloating сам разберётся куда положить sentinel (bar снаружи
      // scrollRoot — sentinel первым ребёнком scrollRoot'а).
      const scrollArea = demo.querySelector('.sb-nav-bar-scroll-area');
      if (!bar || !scrollArea) return;
      if (window.__navBarDisposeFloating) window.__navBarDisposeFloating();
      window.__navBarDisposeFloating = wireFloating(scrollArea, bar);
      // Smart-collapse safety net: auto-wire MO ставится в microtask после
      // innerHTML, а onMount — sync до microtask. Если по какой-то причине
      // MO не успел подхватить, дёргаем wire здесь. Initial capture внутри
      // wireSmartCollapse теперь через rAF — layout с sticky+flex успевает
      // устакаться к моменту измерения natural'ов.
      if (!bar.__smartWired) wireSmartCollapse(bar);
    },
    description: 'Header-полоса сверху приложения. Высота 56px (max 64). Левый слот — leading-button (side-bar / burger icon swap) / logo / logo-title / Badge-Status mini / icon-only buttons. Центр — до 7 кнопок разделов (центрированы или прижаты к правому). Правый слот — до 4 элементов: Button Secondary icon-only, Primary Button, Avatar, Search Bar. На container <1024px центральные tabs прячутся, full-logo / title / badge → compact-logo + burger-icon (mobile-overflow через Bottom Sheet — TODO).',
    playground: {
      title: 'Nav Bar Playground',
      wide: true,  // широкий компонент — preview под панелью контролов, на всю ширину
      state: {
        align: 'center',
        floating: false,
        compact: false,        // false → wide stage 1200px; true → narrow 600px (триггерит container query)
        showButton: true,      // кнопка слева — всегда видна когда вкл, иконка swap'ается между side-bar/menu
        showLogo: true,
        showLogoTitle: true,
        showBadge: false,
        tabsCount: 3,
        selectedIdx: 0,
        disabledOnTabs: false,
        showSearch: false,
        showBell: true,
        showPrimary: false,
        showAvatar: true,
        lang: 'ENG',           // выбранный язык в lang switcher'е (always shown в demo)
      },
      // Login XOR Avatar — вкл один, второй автоматически выкл (визуально снимается).
      onControlChange(key, value, state) {
        if (key === 'showPrimary' && value) state.showAvatar  = false;
        if (key === 'showAvatar'  && value) state.showPrimary = false;
      },
      controls(pg) {
        // 4 группы укладываются в 2×2 grid через `.pg-card.wide .pg-controls:has(> .pg-group)`
        // правило в playground.css (cell minmax 320, 1fr). Row 1: Left Slot | Right Slot.
        // Row 2: Tabs | Bar (Floating/Compact).
        return `<div class="pg-group">
            <div class="pg-group-title sb-field-label">Left Slot</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('showButton',    'Button')}
                ${pg.toggle('showLogo',      'Logo')}
                ${pg.toggle('showLogoTitle', 'Logo Title')}
                ${pg.toggle('showBadge',     'Badge')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Right Slot</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('showSearch',  'Search')}
                ${pg.toggle('showBell',    'Bell')}
                ${pg.toggle('showPrimary', 'Login')}
                ${pg.toggle('showAvatar',  'Avatar')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Tabs</div>
            <div class="pg-group-body">
              ${pg.select('align', [
                { value: 'center', label: 'Center' },
                { value: 'right',  label: 'Right'  },
              ], { label: 'alignment' })}
              <div class="pg-toggles">
                ${pg.toggle('disabledOnTabs', 'disabled')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Bar</div>
            <div class="pg-group-body">
              <div class="pg-toggles">
                ${pg.toggle('floating', 'Floating')}
                ${pg.toggle('compact',  'Compact')}
              </div>
            </div>
          </div>`;
      },
      render(s) {
        const tabs = [];
        const names = ['Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item'];
        // Tab[1] всегда с chevron + dropdown (демо hover-меню). Не attached
        // к toggle'у в controls — это «всегда здесь» в wide mode. В compact
        // tabs прячутся целиком.
        const dropdownItems = [
          { label: 'Subsection 1' },
          { label: 'Subsection 2' },
          { label: 'Subsection 3' },
        ];
        for (let i = 0; i < s.tabsCount; i++) {
          const isDropdown = i === 1;
          tabs.push({
            label: names[i] || `Section ${i + 1}`,
            selected: i === s.selectedIdx,
            disabled: s.disabledOnTabs && i === s.tabsCount - 1,
            hasChevron: isDropdown,
            menuItems: isDropdown ? dropdownItems : undefined,
          });
        }
        // Login XOR Avatar — взаимоисключающие. Если Login вкл → Avatar скрыт.
        // Lang switcher всегда показан (нет toggle'а — это просто кнопка).
        const right = [
          mkLangSwitcher({ selected: s.lang }),
          s.showBell    ? DEMO_BELL    : null,
          s.showPrimary ? DEMO_PRIMARY : null,
          (!s.showPrimary && s.showAvatar) ? DEMO_AVATAR : null,
        ].filter(Boolean);

        const navBar = mkNavBar({
          button:      s.showButton    ? DEMO_BUTTON        : '',
          logo:        s.showLogo      ? DEMO_LOGO          : '',
          logoCompact: s.showLogo      ? DEMO_LOGO_COMPACT  : '',
          logoTitle:   s.showLogoTitle ? DEMO_LOGO_TITLE    : '',
          badge:       s.showBadge     ? DEMO_BADGE         : '',
          search:      s.showSearch    ? DEMO_SEARCH        : '',
          tabs,
          rightSlot: right,
          align: s.align,
          floating: s.floating,
        });

        // compact=false → wide stage 1200px (>1024 → wide mode). Превью-окно
        //                 ~848px не влезает → outer wrapper c overflow-x:auto
        //                 даёт горизонтальный скролл. Ширина превью не меняется.
        // compact=true  → 600px по центру, < 1024 → compact mode active.
        const innerStyle = s.compact
          ? 'width:100%;max-width:600px;margin:0 auto;'
          : 'width:1200px;';
        return `<div data-pg-preserve-scroll style="width:100%;overflow-x:auto">
          <div style="${innerStyle}padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${navBar}</div>
        </div>`;
      },
      genCode(s) {
        const tabs = [];
        const names = ['Item', 'Item', 'Item', 'Item', 'Item', 'Item', 'Item'];
        for (let i = 0; i < s.tabsCount; i++) {
          const isDropdown = i === 1;
          tabs.push({
            label: names[i] || `Section ${i + 1}`,
            selected: i === s.selectedIdx,
            disabled: s.disabledOnTabs && i === s.tabsCount - 1,
            hasChevron: isDropdown,
            menuItems: isDropdown ? [{ label: 'Subsection 1' }, { label: 'Subsection 2' }, { label: 'Subsection 3' }] : undefined,
          });
        }
        return {
          html: `<!-- См. js/components/nav-bar.js — sbMkNavBar({...}) -->\n${mkNavBar({
            button:      '<!-- side-bar/menu button (icon swaps via container query) -->',
            logo:        '<!-- full logo -->',
            logoCompact: '<!-- compact logo (icon-only) -->',
            logoTitle:   '<!-- title text -->',
            badge:       '<!-- status badge -->',
            tabs,
            search:    '<!-- sbMkSearch output (auto-collapses to icon in compact) -->',
            rightSlot: ['<!-- bell / login / avatar -->'],
            align: s.align,
            floating: s.floating,
          })}`,
          css: COMP_CSS["nav-bar"],
        };
      },
    },
    sections: [
      {
        title: 'Anatomy',
        desc: 'Три слота: левый (logo + extras), центральный (tabs), правый (actions). Высота 56px по дефолту, до 64px. Padding 24px по бокам (16 на мобиле). На < 640px центральные tabs прячутся.',
        preview: `<div style="width:100%;padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${mkNavBar({
          logo: DEMO_LOGO, logoCompact: DEMO_LOGO_COMPACT, logoTitle: DEMO_LOGO_TITLE,
          tabs: [
            { label: 'Item', selected: true },
            { label: 'Item' },
            { label: 'Item' },
          ],
          rightSlot: [DEMO_BELL, DEMO_AVATAR],
        })}</div>`,
        html: `<header class="sb-nav-bar">
  <div class="sb-nav-bar-left">
    <!-- logo / logo-title / badge / burger -->
  </div>
  <div class="sb-nav-bar-center">
    <div class="sb-nav-bar-tabs">
      <button class="sb-nav-btn selected"><span class="sb-nav-btn-label">Overview</span></button>
      <button class="sb-nav-btn"><span class="sb-nav-btn-label">Missions</span></button>
      <!-- ... до 7 -->
    </div>
  </div>
  <div class="sb-nav-bar-right">
    <!-- до 4 элементов: button-icon / primary / avatar / search-bar -->
  </div>
</header>`,
        css: COMP_CSS["nav-bar"],
      },
      {
        title: 'Nav Button — States',
        desc: 'Эксклюзивная кнопка раздела (не из Buttons): 28px высоты, radius 100, --text-secondary по дефолту. Hover — Shadow-S. Selected — --primary-hover bg + Pressed-inset shadow. Disabled — серый --border, не кликается. Min-width 104, max-width 144 (длинный label обрезается многоточием).',
        preview: `<div class="sec-row" style="gap:var(--gap-horiz-s);align-items:center;padding:24px;background:var(--surface-1);border-radius:var(--radius-8)">
          ${mkNavBtn({ label: 'Default' })}
          ${mkNavBtn({ label: 'Selected', selected: true })}
          ${mkNavBtn({ label: 'Disabled', disabled: true })}
          ${mkNavBtn({ label: 'With chevron', hasChevron: true })}
          ${mkNavBtn({ label: 'Selected + chevron', selected: true, hasChevron: true })}
          ${mkNavBtn({ label: 'A very long section name that will truncate' })}
        </div>`,
        html: `<!-- Default -->
<button class="sb-nav-btn"><span class="sb-nav-btn-label">Default</span></button>

<!-- Selected -->
<button class="sb-nav-btn selected"><span class="sb-nav-btn-label">Selected</span></button>

<!-- Disabled -->
<button class="sb-nav-btn disabled" disabled><span class="sb-nav-btn-label">Disabled</span></button>

<!-- With chevron (dropdown trigger) -->
<button class="sb-nav-btn">
  <span class="sb-nav-btn-label">With chevron</span>
  <span class="sb-nav-btn-chevron"><!-- arrow-down-s-line --></span>
</button>`,
        css: COMP_CSS["nav-bar"],
      },
      {
        title: 'Center align vs Right align',
        desc: 'По умолчанию tabs центрируются в свободной зоне между left и right слотами. Modifier .align-right прижимает их к правому слоту с зазором 24px. Выбирается дизайнером per-app.',
        preview: `<div class="sec-col" style="gap:var(--gap-vert-m)">
          <div style="width:100%;padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${mkNavBar({
            logo: DEMO_LOGO, logoCompact: DEMO_LOGO_COMPACT,
            tabs: [
              { label: 'Item' }, { label: 'Item', selected: true }, { label: 'Item' },
            ],
            rightSlot: [DEMO_BELL, DEMO_AVATAR],
            align: 'center',
          })}</div>
          <div style="width:100%;padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${mkNavBar({
            logo: DEMO_LOGO, logoCompact: DEMO_LOGO_COMPACT,
            tabs: [
              { label: 'Item' }, { label: 'Item', selected: true }, { label: 'Item' },
            ],
            rightSlot: [DEMO_BELL, DEMO_AVATAR],
            align: 'right',
          })}</div>
        </div>`,
        html: `<!-- Center align (default) -->
<header class="sb-nav-bar"> ... </header>

<!-- Right align (tabs прижаты к правому слоту) -->
<header class="sb-nav-bar align-right"> ... </header>`,
        css: COMP_CSS["nav-bar"],
      },
      {
        title: 'Right slot — composition',
        desc: 'До 4 элементов: Button Secondary icon-only, Primary Button (Login), Avatar, Search Bar. Сверх 4 — обрезаем + console.warn. Для overflow используй more-button с Context Menu / Bottom Sheet (mobile).',
        preview: `<div class="sec-col" style="gap:var(--gap-vert-s)">
          <div style="width:100%;padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${mkNavBar({
            logo: DEMO_LOGO, logoCompact: DEMO_LOGO_COMPACT,
            tabs: [{ label: 'Item', selected: true }, { label: 'Item' }],
            rightSlot: [DEMO_BELL, DEMO_AVATAR],
          })}</div>
          <div style="width:100%;padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${mkNavBar({
            logo: DEMO_LOGO, logoCompact: DEMO_LOGO_COMPACT,
            tabs: [{ label: 'Item', selected: true }, { label: 'Item' }],
            search: DEMO_SEARCH,
            rightSlot: [DEMO_BELL, DEMO_AVATAR],
          })}</div>
          <div style="width:100%;padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${mkNavBar({
            logo: DEMO_LOGO, logoCompact: DEMO_LOGO_COMPACT,
            tabs: [],
            rightSlot: [DEMO_PRIMARY],
          })}</div>
        </div>`,
        html: `<!-- bell + avatar -->
<div class="sb-nav-bar-right">
  <button class="sb-btn sb-btn-secondary sb-btn-icon">...</button>
  <div class="sb-avatar sb-avatar-m">...</div>
</div>

<!-- search + bell + avatar -->
<div class="sb-nav-bar-right">
  <div style="width:240px"><div class="sb-search icon-left">...</div></div>
  <button class="sb-btn sb-btn-secondary sb-btn-icon">...</button>
  <div class="sb-avatar sb-avatar-m">...</div>
</div>

<!-- minimal: только Login -->
<div class="sb-nav-bar-right">
  <button class="sb-btn sb-btn-primary">Login</button>
</div>`,
        css: COMP_CSS["nav-bar"],
      },
      {
        title: 'Floating + Scroll behavior',
        desc: 'Modifier <code>.floating</code> — бар отрывается от краёв (margin 16, radius 12, Shadow-S), без border-bottom. При скролле вниз — переключается в <code>.is-stuck</code>: схлопывается до full-width (margin 0, radius 0, тень глубже). Транзишн плавный (0.25s). Реализация: <code>position: sticky</code> + IntersectionObserver на sentinel\'е (см. <code>sbWireNavBarFloating</code>).<br><br><b>Два паттерна размещения, выбирай по контексту:</b><br>• <b>Page-level sticky</b> — bar ВНУТРИ скролл-контейнера (обычно <code>&lt;main&gt;</code> или сам <code>document</code>). Bar реально «прилипает» при скролле страницы, scrollbar страницы идёт за баром на всю высоту. Подходит для главного chrome приложения.<br>• <b>Inline-panel</b> (как демо ниже) — bar СНАРУЖИ скролл-области, sibling\'ом сверху. Scrollbar упирается в низ bar\'а, не покрывает его. Подходит для виджетов / диалогов / встроенных панелей с собственным скроллом. Outer wrap = <code>display:flex;flex-direction:column;overflow:hidden</code>, scroll-область = <code>flex:1;min-height:0;overflow-y:auto;scrollbar-gutter:stable</code>. <code>wireFloating</code> сам поймёт, что bar снаружи, и положит sentinel внутрь scroll-области.',
        preview: `<div id="nav-bar-scroll-demo" style="width:100%;display:flex;flex-direction:column;height:340px;background:var(--background);border-radius:var(--radius-8);border:var(--border-width-1) solid var(--border);overflow:hidden">
          ${mkNavBar({
            button: DEMO_BUTTON,
            logo: DEMO_LOGO, logoCompact: DEMO_LOGO_COMPACT,
            logoTitle: DEMO_LOGO_TITLE,
            badge: DEMO_BADGE,
            tabs: [
              { label: 'Item', selected: true },
              { label: 'Item' },
              { label: 'Item' },
            ],
            search: DEMO_SEARCH,
            rightSlot: [DEMO_BELL, DEMO_AVATAR],
            floating: true,
          })}
          <div class="sb-nav-bar-scroll-area" style="flex:1;min-height:0;overflow-y:auto;scrollbar-gutter:stable">
            <div style="padding:24px;display:flex;flex-direction:column;gap:var(--gap-vert-m)">
              <p class="sb-body-m" style="color:var(--text-tertiary);margin:0">↓ Scroll down to see the <code>floating → stuck</code> transition.</p>
              <div style="height:560px;display:flex;align-items:center;justify-content:center;background:var(--surface-1);border-radius:var(--radius-8)">
                <span class="sb-body-l" style="color:var(--text-secondary)">Page content (560px tall)</span>
              </div>
            </div>
          </div>
        </div>`,
        html: `<!-- ─────────────────────────────────────────────────────────────
     ПАТТЕРН A — Page-level sticky (bar ВНУТРИ скролл-контейнера).
     Bar реально «прилипает», scrollbar страницы идёт за баром на
     всю высоту. Для главного chrome приложения.
     ───────────────────────────────────────────────────────────── -->
<div class="scroll-root" style="overflow-y:auto;height:100vh">
  <header class="sb-nav-bar floating">
    <!-- left / center / right slots -->
  </header>
  <main>
    <!-- ваш контент -->
  </main>
</div>
<script>
  const root   = document.querySelector('.scroll-root');
  const navBar = root.querySelector('.sb-nav-bar.floating');
  // Bar inside scrollRoot — sentinel автоматически кладётся перед bar'ом.
  const dispose = sbWireNavBarFloating(root, navBar);
  // dispose() для cleanup при размонтировании
</script>


<!-- ─────────────────────────────────────────────────────────────
     ПАТТЕРН B — Inline panel (bar СНАРУЖИ скролл-области).
     Scrollbar упирается в низ bar'а, не покрывает его область.
     Для виджетов / диалогов / встроенных панелей с собственным
     скроллом.
     Ключевые моменты:
       • outer:  display:flex; flex-direction:column; overflow:hidden
       • bar:    sibling сверху, обычный .sb-nav-bar.floating
       • scroll: flex:1; min-height:0; overflow-y:auto;
                 scrollbar-gutter:stable
     ───────────────────────────────────────────────────────────── -->
<div class="panel" style="display:flex;flex-direction:column;height:340px;overflow:hidden">
  <header class="sb-nav-bar floating">
    <!-- left / center / right slots -->
  </header>
  <div class="panel-scroll" style="flex:1;min-height:0;overflow-y:auto;scrollbar-gutter:stable">
    <!-- ваш контент -->
  </div>
</div>
<script>
  const panel  = document.querySelector('.panel');
  const navBar = panel.querySelector('.sb-nav-bar.floating');
  const scrollArea = panel.querySelector('.panel-scroll');
  // Bar снаружи scrollArea — wireFloating сам положит sentinel первым
  // ребёнком scrollArea (а не перед bar'ом).
  const dispose = sbWireNavBarFloating(scrollArea, navBar);
</script>`,
        css: COMP_CSS["nav-bar"],
      },
      {
        title: 'Left slot — composition (responsive)',
        desc: 'Структурный API: <code>button</code> / <code>logo</code> / <code>logoCompact</code> / <code>logoTitle</code> / <code>badge</code> — отдельные пропсы. CSS container query переключает между wide и compact: при container <1024px tabs прячутся, full-logo / title / badge → compact-logo. Button всегда виден, но иконка внутри swap\'ается (side-bar-line в wide, menu-line в compact). Ниже — два примера на одной ширине.',
        preview: `<div class="sec-col" style="gap:var(--gap-vert-m)">
          ${sbMkSectionHeader({ slotLeft: `<span class="sb-caption">Wide (container > 1024px)</span>` })}
          <span class="sb-body-m" style="color:var(--text-tertiary);padding:0 var(--pad-horiz-16)">Горизонтальный скролл для full-view</span>
          <div style="width:100%;overflow-x:auto">
            <div style="width:1200px;padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${mkNavBar({
              button: DEMO_BUTTON,
              logo: DEMO_LOGO,
              logoCompact: DEMO_LOGO_COMPACT,
              logoTitle: DEMO_LOGO_TITLE,
              badge: DEMO_BADGE,
              tabs: [
                { label: 'Item', selected: true },
                { label: 'Item' },
                { label: 'Item' },
              ],
              rightSlot: [DEMO_BELL, DEMO_AVATAR],
            })}</div>
          </div>
          ${sbMkSectionHeader({ slotLeft: `<span class="sb-caption">Compact (container &lt; 1024px)</span>` })}
          <span class="sb-body-m" style="color:var(--text-tertiary);padding:0 var(--pad-horiz-16)">Tabs уходят в side menu, иконка кнопки swap'ается на menu-line</span>
          <div style="width:100%;max-width:560px;padding:var(--pad-vert-16);border-radius:var(--radius-12);border:var(--border-width-1) solid var(--border);background:var(--background)">${mkNavBar({
            button: DEMO_BUTTON,
            logo: DEMO_LOGO,
            logoCompact: DEMO_LOGO_COMPACT,
            logoTitle: DEMO_LOGO_TITLE,
            badge: DEMO_BADGE,
            tabs: [
              { label: 'Item', selected: true },
              { label: 'Item' },
              { label: 'Item' },
            ],
            rightSlot: [DEMO_BELL, DEMO_AVATAR],
          })}</div>
        </div>`,
        html: `<!-- Структурный API с responsive переключением -->
sbMkNavBar({
  button:      '<button>...</button>',     // всегда видна, иконка swap'ается
  logo:        '<svg>FULL_LOGO</svg>',      // скрывается в compact
  logoCompact: '<svg>SB</svg>',             // показывается в compact
  logoTitle:   '| Mission Control',         // скрывается в compact
  badge:       '<span>v2.4</span>',         // скрывается в compact
  tabs:        [...],                       // скрываются в compact
  rightSlot:   [...],                       // всегда видны
})

<!-- Container query (см. CSS): @container navbar (max-width: 1024px) -->
<header class="sb-nav-bar">
  <div class="sb-nav-bar-left">
    <span class="sb-nav-bar-button">...</span>
    <span class="sb-nav-bar-logo-full">...</span>
    <span class="sb-nav-bar-logo-compact">...</span>
    <span class="sb-nav-bar-logo-title">...</span>
    <span class="sb-nav-bar-badge">...</span>
  </div>
  ...
</header>`,
        css: COMP_CSS["nav-bar"],
      },
    ],
  });
})();
