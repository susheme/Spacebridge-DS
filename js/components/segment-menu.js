// ═══════════════════════════════════════════════════════════════════════════
//  SEGMENT MENU
//  CSS в css/components/segment-menu.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
//
//  Не путать с Mobile Tab Bar — это другой компонент (Phase 2), с табами и
//  опциональным Status mini indicator слева от label.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["segment-menu"] = `.sb-segment-menu {
  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  position: relative;
}
.sb-segment-menu-item {
  display: inline-flex;
  height: 40px;
  min-width: var(--segment-menu-min-width-segment);
  max-width: var(--segment-menu-max-width-segment);
  min-height: 32px;
  max-height: 40px;
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--gap-vert-xs);
  border: none;
  border-radius: var(--radius-0);
  border-bottom: var(--border-width-2) solid var(--background);
  background: var(--background);
  color: var(--text-secondary);
  font-family: var(--font-family);
  font-size: var(--button-font-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--button-line-height);
  letter-spacing: var(--letter-spacing);
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
}
.sb-segment-menu.icon-left .sb-segment-menu-item {
  flex-direction: row;
}
.sb-segment-menu.icon-top .sb-segment-menu-item {
  height: auto;
  max-height: 56px;
}
.sb-segment-menu-item:hover:not(.is-disabled):not(.selected),
.sb-segment-menu-item.is-hover:not(.is-disabled):not(.selected) {
  color: var(--primary);
}
.sb-segment-menu-item.selected {
  color: var(--primary);
}
.sb-segment-menu-item.is-disabled {
  color: var(--border);
  cursor: not-allowed;
  pointer-events: none;
}
.sb-segment-menu-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: var(--border-width-2);
  background: var(--primary);
  width: 0;
  transform: translateX(0);
  opacity: 0;
  pointer-events: none;
  transition: none;
  will-change: transform, width;
}
.sb-segment-menu.has-indicator .sb-segment-menu-indicator {
  opacity: 1;
}
.sb-segment-menu.is-positioned .sb-segment-menu-indicator {
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    width     0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity   0.2s ease;
}`;

// --- SEGMENT MENU ---
(() => {
  /**
   * positionIndicator(container)
   *
   * Под текущим .selected item-ом ставит индикатор: transform: translateX(L)
   * + width: W, где L/W — offsetLeft/offsetWidth selected'а внутри контейнера.
   * Первый paint без transition (флаг .is-positioned добавляется после force
   * layout flush) — чтобы initial mount не давал slide-from-zero.
   */
  function positionIndicator(container) {
    if (!container) return;
    const indicator = container.querySelector(':scope > .sb-segment-menu-indicator');
    const selected  = container.querySelector(':scope > .sb-segment-menu-item.selected');
    if (!indicator) return;
    if (!selected) {
      container.classList.remove('has-indicator');
      return;
    }
    indicator.style.transform = `translateX(${selected.offsetLeft}px)`;
    indicator.style.width = `${selected.offsetWidth}px`;
    container.classList.add('has-indicator');
    if (!container.classList.contains('is-positioned')) {
      // Force layout flush — без этого добавление .is-positioned и установка
      // transform/width схлопнутся в одну транзакцию, и первый paint
      // выйдет с уже-включённой transition → slide-from-zero. С flush'ем
      // initial position painted мгновенно, потом transition включается.
      void indicator.offsetWidth;
      container.classList.add('is-positioned');
    }
  }

  /**
   * mkSegmentMenu(items, opts)
   *   items: string[] | { label, icon?, disabled? }[]
   *   opts: {
   *     selectedIndex     — индекс выбранного таба, default 0
   *     iconPosition      — 'none' (default) | 'left' | 'top'
   *   }
   *
   *   Когда iconPosition='left' — добавляется класс .icon-left на контейнер,
   *   item-ы становятся row-flex. iconPosition='top' использует дефолтный
   *   column-flex (icon над label). 'none' — text only.
   */
  function mkSegmentMenu(items, opts = {}) {
    const { selectedIndex = 0, iconPosition = 'none' } = opts;
    const inner = items.map((it, i) => {
      const data = typeof it === 'string' ? { label: it } : it;
      const { label, icon, disabled, hover } = data;
      let cls = 'sb-segment-menu-item';
      if (i === selectedIndex && !disabled) cls += ' selected';
      if (disabled)                         cls += ' is-disabled';
      // hover — статичный force-hover для state-демо в docs. На реальных
      // юзается :hover. С selected/disabled не совмещается.
      if (hover && !disabled && i !== selectedIndex) cls += ' is-hover';
      const iconHTML = (icon && iconPosition !== 'none') ? sbIcon(icon, 'L') : '';
      return `<button type="button" class="${cls}" onclick="sbSelectSegmentItem(this)">${iconHTML}<span class="sb-segment-menu-item-label">${label}</span></button>`;
    }).join('');
    let containerCls = 'sb-segment-menu';
    if (iconPosition === 'left') containerCls += ' icon-left';
    if (iconPosition === 'top')  containerCls += ' icon-top';
    // Indicator — последний child, JS его потом позиционирует.
    return `<div class="${containerCls}">${inner}<div class="sb-segment-menu-indicator"></div></div>`;
  }

  window.sbMkSegmentMenu = mkSegmentMenu;

  // Single-select handler — снимает .selected с соседей, ставит на нажатый
  // item, и repositions indicator. closest(.sb-segment-menu) — на случай
  // если item обёрнут в wrapper (хотя сейчас он прямой child).
  window.sbSelectSegmentItem = function(item) {
    if (!item || item.classList.contains('is-disabled')) return;
    const container = item.closest('.sb-segment-menu');
    if (container) {
      container.querySelectorAll(':scope > .sb-segment-menu-item.selected')
        .forEach(c => c.classList.remove('selected'));
    }
    item.classList.add('selected');
    positionIndicator(container);
  };

  // ── Auto-wire ───────────────────────────────────────────────────────
  // Single MO на весь app + ResizeObserver на каждый .sb-segment-menu.
  // - На mount нового бара: rAF → positionIndicator (initial position
  //   для уже-selected item-а).
  // - На resize контейнера (window resize / flex-parent изменился):
  //   reposition indicator (offsetLeft/Width могут сдвинуться).
  // - На removeNodes: disconnect RO, очистить WeakSet.
  const wired = new WeakSet();

  function wire(container) {
    if (!container || wired.has(container)) return;
    wired.add(container);
    requestAnimationFrame(() => positionIndicator(container));
    const ro = new ResizeObserver(() => positionIndicator(container));
    ro.observe(container);
    container.__segDispose = () => {
      ro.disconnect();
      wired.delete(container);
    };
  }

  function scanWire(root) {
    if (!root || root.nodeType !== 1) return;
    const list = root.matches && root.matches('.sb-segment-menu')
      ? [root]
      : (root.querySelectorAll ? Array.from(root.querySelectorAll('.sb-segment-menu')) : []);
    for (const c of list) wire(c);
  }
  function scanDispose(root) {
    if (!root || root.nodeType !== 1) return;
    const list = root.matches && root.matches('.sb-segment-menu')
      ? [root]
      : (root.querySelectorAll ? Array.from(root.querySelectorAll('.sb-segment-menu')) : []);
    for (const c of list) {
      if (c.__segDispose) c.__segDispose();
    }
  }

  if (!window.__sbSegmentMenuAutoWire) {
    window.__sbSegmentMenuAutoWire = true;
    const init = () => {
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
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  }

  sbRegister({
    name: 'segment-menu',
    title: 'Segment Menu',
    description: 'Сегментный таб-бар. Используется внутри Headers, Nav Bar, Cards, Modals, Side Menu и любых других layout-контейнеров для переключения между разделами/вариантами. Три варианта содержимого таба: text only, icon-L left + label, icon-L top + label. Состояния: Default / Hover / Selected / Disabled. Selected индикатор — отдельный элемент с GPU-slide-анимацией между табами (transform/width 0.25s, cubic-bezier). Не путать с Mobile Tab Bar (Phase 2) — другой компонент с табами и Status mini indicator.',
    playground: {
      title: 'Segment Menu Playground',
      state: {
        tabCount: 3,
        selectedIndex: 0,
        iconPosition: 'none',
        disabledOnTabs: false,
      },
      controls(pg) {
        return pg.select('tabCount', [
          { value: 2, label: '2 segments' },
          { value: 3, label: '3 segments' },
          { value: 4, label: '4 segments' },
          { value: 5, label: '5 segments' },
        ]) + pg.select('iconPosition', [
          { value: 'none', label: 'Text only' },
          { value: 'left', label: 'Icon left' },
          { value: 'top',  label: 'Icon top'  },
        ], { label: 'icon position' }) + `<div class="pg-toggles">
          ${pg.toggle('disabledOnTabs', 'Disable')}
        </div>`;
      },
      render(s) {
        const labels = ['Section', 'Header L', 'Modal', 'Card', 'Sidebar'];
        // Только существующие имена из ICON_PATHS (см. js/core.js).
        // Не выдумывать! sbIcon на несуществующее имя вернёт пусто.
        const iconNames = ['gemini-fill', 'radar-line', 'building-2-line', 'mail-line', 'user-line'];
        const items = labels.slice(0, s.tabCount).map((label, i) => ({
          label,
          icon: iconNames[i] || iconNames[0],
          disabled: s.disabledOnTabs && i === s.tabCount - 1,
        }));
        const idx = Math.min(s.selectedIndex, items.length - 1);
        return mkSegmentMenu(items, { selectedIndex: idx, iconPosition: s.iconPosition });
      },
      genCode(s) {
        const labels = ['Section', 'Header L', 'Modal', 'Card', 'Sidebar'];
        const items = labels.slice(0, s.tabCount);
        const idx = Math.min(s.selectedIndex, items.length - 1);
        const buttons = items.map((label, i) => {
          const cls = 'sb-segment-menu-item' + (i === idx ? ' selected' : '');
          return `  <button type="button" class="${cls}" onclick="sbSelectSegmentItem(this)">${label}</button>`;
        }).join('\n');
        const containerCls = 'sb-segment-menu' + (s.iconPosition === 'left' ? ' icon-left' : '');
        const html = `<div class="${containerCls}">\n${buttons}\n  <div class="sb-segment-menu-indicator"></div>\n</div>`;
        return { html, css: COMP_CSS["segment-menu"] };
      },
    },
    sections: (() => {
      // Каждый state-демо — это standalone segment-menu с одним item-ом
      // в нужном состоянии. Сам label item-а = название состояния.
      // Auto-wire индикатора срабатывает на каждый, позиционирует под
      // selected (если есть).
      function stateGroup(groupTitle, iconPosition) {
        const icon = iconPosition !== 'none' ? 'gemini-fill' : undefined;
        const mk = (label, extra, opts) =>
          mkSegmentMenu([{ label, icon, ...extra }], { iconPosition, ...opts });
        return `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-m);width:100%">
          ${sbMkSectionHeader({ slotLeft: `<span class="sb-caption">${groupTitle}</span>` })}
          <div style="display:flex;gap:var(--gap-horiz-lg);flex-wrap:wrap;align-items:flex-start">
            ${mk('Default',  {},                  { selectedIndex: -1 })}
            ${mk('Hover',    { hover: true },     { selectedIndex: -1 })}
            ${mk('Selected', {},                  { selectedIndex: 0  })}
            ${mk('Disabled', { disabled: true },  { selectedIndex: -1 })}
          </div>
        </div>`;
      }
      return [
        {
          title: 'Segments States',
          desc: 'Каждый вариант таба (text only / icon left / icon top) в четырёх состояниях. Default — text-secondary. Hover — text-primary. Selected — primary text + animated indicator под item-ом. Disabled — text --border, без интеракции. В реальном использовании клики переключают selected через sbSelectSegmentItem, hover триггерится по :hover. В демо ниже Hover показан статично через модификатор .is-hover.',
          preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-xl);width:100%">
            ${stateGroup('Text only', 'none')}
            ${stateGroup('Icon left', 'left')}
            ${stateGroup('Icon top',  'top')}
          </div>`,
          html: `<!-- Default -->
<div class="sb-segment-menu">
  <button type="button" class="sb-segment-menu-item" onclick="sbSelectSegmentItem(this)">
    <span class="sb-segment-menu-item-label">Item</span>
  </button>
  <div class="sb-segment-menu-indicator"></div>
</div>

<!-- Hover (статически через .is-hover; на реальных по :hover) -->
<button type="button" class="sb-segment-menu-item is-hover">…</button>

<!-- Selected — primary text + indicator под item-ом -->
<button type="button" class="sb-segment-menu-item selected">…</button>

<!-- Disabled — text --border, без интеракции -->
<button type="button" class="sb-segment-menu-item is-disabled">…</button>`,
          css: COMP_CSS["segment-menu"],
        },
      ];
    })(),
  });
})();
