// ═══════════════════════════════════════════════════════════════════════════
//  SIDE NAVIGATION
//  CSS в css/components/side-navigation.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS.sideNav и CSS-файл).
//
//  Композиция готовых компонентов: Header M + опц. Sub Nav (tab-bar) + опц.
//  Tool Bar (Search) + рекурсивное дерево (Section / Group / Item) + опц. Footer.
//  MVP: только expanded. Collapsed-рельса / mobile drawer / hover edit-delete /
//  search-with-filter — отдельными заходами.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.sideNav = `.sb-side-nav {
  position: relative;
  display: flex;
  flex-direction: column;
  width: var(--side-nav-min-max-width);
  height: 100%;
  background: var(--background);
  border: var(--border-width-1) solid var(--border-soft);
  border-radius: var(--radius-12);
  overflow: hidden;
  box-sizing: border-box;
}

.sb-side-nav-header,
.sb-side-nav-subnav,
.sb-side-nav-toolbar,
.sb-side-nav-footer { flex-shrink: 0; }

.sb-side-nav-toolbar { padding: var(--pad-vert-8) var(--pad-horiz-16); }
.sb-side-nav-toolbar .sb-search { width: 100%; }
.sb-side-nav-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: var(--border-width-1) solid var(--border-soft);
  padding: var(--pad-vert-16);
  background: var(--background);
}

.sb-side-nav-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
  /* horiz 16 — вровень с Header M / Search (панель-padding по спеке Side Menu).
     Ячейки заполняют ширину панели (≈288), «272» из спеки ячейки — номинал. */
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  display: flex;
  flex-direction: column;
  gap: var(--gap-vert-xxs);
}

/* Figma-спека ячейки: height 40, padding 8/8/8/16 (top/right/bottom/left —
   ведущий край шире), gap 8, radius 4, bg background. */
.sb-side-nav-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--gap-horiz-s);
  height: var(--side-nav-item-height);
  padding: var(--pad-vert-8) var(--pad-horiz-8) var(--pad-vert-8) var(--pad-horiz-16);
  border-radius: var(--radius-4);
  /* transparent (а не --background): визуально = фон сайдбара, но прозрачность
     не даёт соседним ячейкам перекрывать hover-тень соседа сверху/снизу. */
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  transition: box-shadow var(--transition), background var(--transition), color var(--transition);
}
/* Hover — drop Shadow-S + синий текст (--primary). К disabled не применяется. */
.sb-side-nav-row:hover:not(.is-disabled) { box-shadow: 0 2px 8px 0 var(--shadow-overlay); }
.sb-side-nav.is-menu .sb-side-nav-row:hover:not(.is-disabled) { color: var(--primary); }
.sb-side-nav-row.is-section { height: var(--side-nav-grand-parent-item-height); }

/* Selected (Active) — surface-1 + Pressed-inset shadow (канон DS, как у
   Nav Bar / Tab Bar) + синий текст (--primary). */
.sb-side-nav-row.is-selected {
  background: var(--surface-1);
  color: var(--primary);
  box-shadow:
     1px  1px 2px 0 var(--shadow-overlay) inset,
    -1px -1px 2px 0 var(--shadow-lg) inset;
}

/* Disabled — серый текст (--border). Hover-эффекты к нему не применяются. */
.sb-side-nav-row.is-disabled { color: var(--border); cursor: not-allowed; }
.sb-side-nav-row.is-disabled .sb-status-dot { background: var(--border); }

.sb-side-nav-row-lead {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: inherit;
}
.sb-side-nav-row-label {
  flex: 1 0 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* line-height Title S = 12px < font-size 14 → overflow:hidden режет
     descender'ы (g/p/y). Берём --body-line-height (20), как в Nav Bar.
     На одну строку визуально не влияет — текст центрируется в 40px ряду. */
  line-height: var(--body-line-height);
  font-variant-numeric: lining-nums tabular-nums;
}
.sb-side-nav-row-meta {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-horiz-xs);
  flex-shrink: 0;
}
.sb-side-nav-row-chevron {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: inherit;
}

.sb-side-nav-section-label {
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-l);
  color: var(--text-muted);
}

.sb-side-nav-row-chevron.toggle { transition: transform var(--transition); }
.sb-side-nav-node.expanded > .sb-side-nav-row .sb-side-nav-row-chevron.toggle {
  transform: rotate(180deg);
}

.sb-side-nav-children {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows var(--transition);
}
.sb-side-nav-node.expanded > .sb-side-nav-children { grid-template-rows: 1fr; }
.sb-side-nav-children-inner {
  overflow: hidden;
  min-height: 0;
  position: relative;
}

.sb-side-nav-folder-closed { display: inline-flex; align-items: center; }
.sb-side-nav-folder-open { display: none; }
.sb-side-nav-node.is-group.expanded > .sb-side-nav-row .sb-side-nav-folder-closed { display: none; }
.sb-side-nav-node.is-group.expanded > .sb-side-nav-row .sb-side-nav-folder-open  { display: inline-flex; }

.sb-side-nav-node.is-section {
  border-radius: var(--radius-4);
  border-left: var(--border-width-4) solid var(--primary);
  background: var(--background);
  transition: background var(--transition), box-shadow var(--transition);
}
.sb-side-nav-node.is-section:has(> .sb-side-nav-row:hover) {
  box-shadow: 0 2px 8px 0 var(--shadow-overlay);
}
.sb-side-nav-node.is-section:has(> .sb-side-nav-row.is-selected) {
  background: var(--surface-1);
}
.sb-side-nav-row.is-section.is-selected { background: transparent; box-shadow: none; }
.sb-side-nav-node.is-section.is-disabled { border-left-color: var(--border); }
.sb-side-nav-node.is-section.is-disabled .sb-side-nav-section-label { color: var(--border); }

.sb-side-nav-row.is-group.is-selected { box-shadow: none; }
.sb-side-nav-row-actions {
  display: none;
  align-items: center;
  gap: var(--gap-horiz-s);
  flex-shrink: 0;
}
.sb-side-nav.is-bar .sb-side-nav-row.is-group:hover:not(.is-disabled) .sb-side-nav-row-actions { display: flex; }
.sb-side-nav.is-bar .sb-side-nav-row.is-group:hover:not(.is-disabled) .sb-side-nav-row-meta { display: none; }
.sb-side-nav-edit   { color: var(--primary); }
.sb-side-nav-delete { color: var(--error); }

/* Базовый is-selected (Pressed-пилюля) задан выше по спеке Single Item.
   Ниже — провизорные оверрайды для ещё неспеканных Group/Child (скрины). */
.sb-side-nav-row.is-group.is-selected .sb-side-nav-folder-closed,
.sb-side-nav-row.is-group.is-selected .sb-side-nav-folder-open { color: var(--primary); }

.sb-side-nav-children .sb-side-nav-row.is-selected {
  background: transparent;
  box-shadow: none;
  color: var(--primary);
}
.sb-side-nav-children .sb-side-nav-row.is-selected .sb-side-nav-row-lead,
.sb-side-nav-children .sb-side-nav-row.is-selected .sb-side-nav-row-chevron { color: var(--primary); }

/* ══ Variant: SIDE MENU ═══════════════════════════════════════════════════ */
.sb-side-nav.is-menu {
  border: none;
  box-shadow: 0 10px 20px 0 var(--shadow-overlay);
}
.sb-side-nav-row.is-parent { gap: var(--gap-vert-m); }
.sb-side-nav-chev {
  flex-shrink: 0;
  transition: transform var(--transition), background var(--transition), color var(--transition);
}
.sb-side-nav-node.expanded > .sb-side-nav-row .sb-side-nav-chev { transform: rotate(180deg); }
.sb-side-nav-node.is-parent.expanded > .sb-side-nav-row .sb-side-nav-chev {
  background: transparent;
  color: var(--primary);
}
.sb-side-nav-node.is-parent,
.sb-side-nav-node.is-group {
  transition: background var(--transition), box-shadow var(--transition);
}
.sb-side-nav-node.is-parent.expanded,
.sb-side-nav-node.is-section.expanded,
.sb-side-nav-node.is-group.expanded {
  background: var(--surface-1);
  border-radius: var(--radius-4);
  padding-bottom: var(--pad-vert-16);
  box-shadow:
     1px  1px 2px 0 var(--shadow-overlay) inset,
    -1px -1px 2px 0 var(--shadow-lg) inset;
}
.sb-side-nav-node.is-parent.expanded > .sb-side-nav-row,
.sb-side-nav-node.is-group.expanded > .sb-side-nav-row { color: var(--primary); }
.sb-side-nav-node.is-section > .sb-side-nav-children > .sb-side-nav-children-inner > * + * {
  margin-top: var(--gap-horiz-s);
}
.sb-side-nav.is-menu .sb-side-nav-children .sb-side-nav-row.is-item {
  padding-left: var(--pad-horiz-24);
}
.sb-side-nav.is-bar .sb-side-nav-children .sb-side-nav-row.is-item {
  padding-left: var(--sn-item-pad, var(--pad-horiz-24));
}
.sb-side-nav.is-bar .sb-side-nav-row.is-group {
  padding-left: var(--sn-group-pad, var(--pad-horiz-16));
}
.sb-side-nav-node.is-parent > .sb-side-nav-children > .sb-side-nav-children-inner::before,
.sb-side-nav-node.is-group  > .sb-side-nav-children > .sb-side-nav-children-inner::before {
  content: "";
  position: absolute;
  left: var(--sn-rail, var(--pad-horiz-16));
  top: 0;
  bottom: 0;
  width: var(--border-width-1-5);
  border-radius: var(--radius-100);
  background: var(--border-soft);
  transform: translateX(-50%);
}
.sb-side-nav-children .sb-side-nav-row.is-item.is-selected::before {
  content: "";
  position: absolute;
  left: var(--sn-rail, var(--pad-horiz-16));
  top: 0;
  bottom: 0;
  width: var(--border-width-1-5);
  border-radius: var(--radius-100);
  background: var(--primary);
  transform: translateX(-50%);
}

.sb-side-nav-empty {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap-vert-s);
  text-align: center;
  padding: var(--pad-vert-48) var(--pad-horiz-16);
  color: var(--text-tertiary);
}`;

// --- SIDE NAVIGATION ---
(() => {
  // ── Click-хендлеры (глобальные, по паттерну DS) ──────────────────────
  // selectFlag — эксклюзивный выбор внутри одного .sb-side-nav.
  // expandFlag — toggle сворачивания ближайшего .sb-side-nav-node.
  function sbSideNavRow(rowEl, expandFlag, selectFlag) {
    if (selectFlag) {
      const root = rowEl.closest('.sb-side-nav');
      if (root) root.querySelectorAll('.sb-side-nav-row.is-selected')
        .forEach(r => r.classList.remove('is-selected'));
      rowEl.classList.add('is-selected');
    }
    if (expandFlag) {
      const node = rowEl.closest('.sb-side-nav-node');
      if (node) {
        // Аккордеон: раскрывая узел, схлопываем соседние того же уровня
        // (иначе при открытии одного parent'а список «скачет»).
        if (!node.classList.contains('expanded') && node.parentElement) {
          node.parentElement
            .querySelectorAll(':scope > .sb-side-nav-node.expanded')
            .forEach(n => { if (n !== node) n.classList.remove('expanded'); });
        }
        node.classList.toggle('expanded');
      }
    }
  }
  window.sbSideNavRow = sbSideNavRow;

  // ── Мелкие билдеры ───────────────────────────────────────────────────
  function cnt(counter) {
    if (counter == null) return '';
    if (typeof counter === 'object') {
      if (counter.empty) return `<div class="sb-counter range empty">--/--</div>`;
      return `<div class="sb-counter range"><span class="sb-counter-online">${counter.value}</span><span class="sb-counter-sep">/</span><span class="sb-counter-total">${counter.max}</span></div>`;
    }
    return `<div class="sb-counter">${counter}</div>`;
  }
  function badge(b) {
    if (!b) return '';
    const tone = b.tone || 'grey';
    return `<span class="sb-badge-status mini bs-${tone}">${b.text}</span>`;
  }

  // ── Рендер узлов (рекурсивно) ────────────────────────────────────────
  // Роли по типам Side Navigation:
  //   menu: item (Single/Child) + parent (раскрывается инлайн)
  //   bar : item + group (folder) + section (Grand-Parent) — основа, в работе
  function renderNode(node, depth = 0) {
    const role = node.role || 'item';
    if (role === 'parent') return renderParent(node);
    if (role === 'section' || role === 'group') return renderBranch(node, role, depth);
    return renderItem(node);
  }

  function renderItem(node) {
    const lead = node.status
      ? `<span class="sb-status-dot mini ${node.status}"></span>`
      : (node.icon ? sbIcon(node.icon, 'L') : '');
    const leadEl = lead ? `<span class="sb-side-nav-row-lead">${lead}</span>` : '';
    const meta = badge(node.badge) + cnt(node.counter);
    const metaEl = meta ? `<span class="sb-side-nav-row-meta">${meta}</span>` : '';
    const chev = node.navigable
      ? `<span class="sb-side-nav-row-chevron nav">${sbIcon('arrow-right-s-line', 'S')}</span>`
      : '';
    const sel = node.selected ? ' is-selected' : '';
    const dis = node.disabled ? ' is-disabled' : '';
    const onclick = node.disabled ? '' : ' onclick="sbSideNavRow(this, false, true)"';
    return `<div class="sb-side-nav-row is-item${sel}${dis}"${onclick}>
      ${leadEl}<span class="sb-side-nav-row-label sb-title-s">${node.label}</span>${metaEl}${chev}
    </div>`;
  }

  // Parent (Side Menu) — раскрываемая ячейка-контейнер. Шеврон — наш Chevron
  // Button (серый кружок, ротация при раскрытии). Дети инлайн в surface-1
  // группе с полоской слева. Клик по строке = только раскрытие (это контейнер
  // навигации, не selectable; «активность» = синий заголовок при expanded).
  function renderParent(node) {
    const exp = node.expanded ? ' expanded' : '';
    const kids = (node.children || []).map(c => renderNode(c, 0)).join('');
    const chev = `<div class="sb-chevron sb-side-nav-chev">${sbIcon('arrow-down-s-line', 'L')}</div>`;
    const lead = node.icon ? `<span class="sb-side-nav-row-lead">${sbIcon(node.icon, 'L')}</span>` : '';
    return `<div class="sb-side-nav-node is-parent${exp}">
      <div class="sb-side-nav-row is-parent" onclick="sbSideNavRow(this, true, false)">
        ${lead}<span class="sb-side-nav-row-label sb-title-s">${node.label}</span>${chev}
      </div>
      <div class="sb-side-nav-children"><div class="sb-side-nav-children-inner">${kids}</div></div>
    </div>`;
  }

  function renderBranch(node, role, depth = 0) {
    const exp = node.expanded ? ' expanded' : '';
    const sel = node.selected ? ' is-selected' : '';
    // Ступенчатая вложенность: section → дети на depth 0 (top-level группы).
    // group → item-дети на своём depth, group-дети (sub-group) глубже (depth+1).
    const kids = (node.children || []).map(c => {
      const cd = (role === 'section') ? 0 : ((c.role === 'group') ? depth + 1 : depth);
      return renderNode(c, cd);
    }).join('');
    const childrenEl = `<div class="sb-side-nav-children"><div class="sb-side-nav-children-inner">${kids}</div></div>`;

    if (role === 'section') {
      // Grand-Parent: шеврон — Chevron Button (кружок). Кликабельна (expand +
      // select). Counter опционален. Disabled — без onclick.
      const chevBtn = `<div class="sb-chevron sb-side-nav-chev">${sbIcon('arrow-down-s-line', 'L')}</div>`;
      const dis = node.disabled ? ' is-disabled' : '';
      const selRow = node.selected ? ' is-selected' : '';
      const onclick = node.disabled ? '' : ' onclick="sbSideNavRow(this, true, true)"';
      const metaEl = node.counter != null ? `<span class="sb-side-nav-row-meta">${cnt(node.counter)}</span>` : '';
      return `<div class="sb-side-nav-node is-section${exp}${dis}">
        <div class="sb-side-nav-row is-section${selRow}"${onclick}>
          <span class="sb-side-nav-row-label sb-side-nav-section-label sb-caption">${node.label}</span>
          ${metaEl}${chevBtn}
        </div>
        ${childrenEl}
      </div>`;
    }

    // group
    const folder = `<span class="sb-side-nav-row-lead sb-side-nav-folder">
        <span class="sb-side-nav-folder-closed">${sbIcon('folder-line', 'L')}</span>
        <span class="sb-side-nav-folder-open">${sbIcon('folder-open-line', 'L')}</span>
      </span>`;
    // group (Parent / Sub-group): folder + name; правый слот — counter (default)
    // / edit+delete по hover (icon-only-small). Раскрытие по клику (folder swap),
    // без chevron-кнопки. Selected → surface-1, hover → Shadow-S.
    const gMeta = node.counter != null ? `<span class="sb-side-nav-row-meta">${cnt(node.counter)}</span>` : '';
    const gActions = `<span class="sb-side-nav-row-actions">
        <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon sb-side-nav-edit" onclick="event.stopPropagation()">${sbIcon('pencil-line', 'S')}</button>
        <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon sb-side-nav-delete" onclick="event.stopPropagation()">${sbIcon('delete-bin-line', 'S')}</button>
      </span>`;
    const gDis = node.disabled ? ' is-disabled' : '';
    const gOnclick = node.disabled ? '' : ' onclick="sbSideNavRow(this, true, true)"';
    // Позиции уровня (всё от depth, в CSS — без магических px):
    //   --sn-group-pad = 16 + depth*32       — отступ Group/Parent (16, 48, …)
    //   --sn-rail      = group-pad + 12       — колонка рельсы = ЦЕНТР папки родителя
    //                                           (12 = половина 24px-иконки): 28, 60, …
    //   --sn-item-pad  = rail + 8 (gap-vert-s) — контент Child на 8px ПРАВЕЕ рельсы,
    //                                           между ними зазор 8px: 36, 68, …
    const groupPad = 16 + depth * 32;
    const railCol  = groupPad + 12;
    const itemPad  = railCol + 8;
    return `<div class="sb-side-nav-node is-group${exp}" style="--sn-group-pad:${groupPad}px;--sn-item-pad:${itemPad}px;--sn-rail:${railCol}px">
      <div class="sb-side-nav-row is-group${sel}${gDis}"${gOnclick}>
        ${folder}<span class="sb-side-nav-row-label sb-title-s">${node.label}</span>${gMeta}${gActions}
      </div>
      ${childrenEl}
    </div>`;
  }

  // ── Главный билдер ───────────────────────────────────────────────────
  // variant: 'menu' (overlay-меню, замена Nav Bar в компакте — Single/Parent/
  // Child, read-only) | 'bar' (навигатор-дерево с Grand-Parent / edit-delete —
  // в работе). По умолчанию 'menu'.
  function mkSideNav({ variant = 'menu', header, subNav, toolBar, tree = [], footer, empty } = {}) {
    const cls = 'sb-side-nav is-' + (variant === 'bar' ? 'bar' : 'menu');
    const headerEl  = header  ? `<div class="sb-side-nav-header">${header}</div>`   : '';
    const subNavEl  = subNav  ? `<div class="sb-side-nav-subnav">${subNav}</div>`   : '';
    const toolBarEl = toolBar ? `<div class="sb-side-nav-toolbar">${toolBar}</div>` : '';
    const footerEl  = footer  ? `<div class="sb-side-nav-footer">${footer}</div>`   : '';

    let bodyInner;
    if (empty) {
      bodyInner = `<div class="sb-side-nav-empty">
        <button type="button" class="sb-btn sb-btn-secondary"><span class="sb-btn-text">${empty.buttonLabel || 'Button'}</span></button>
        <span class="sb-sub">${empty.subText || 'Subscription Text'}</span>
      </div>`;
    } else {
      bodyInner = tree.map(n => renderNode(n, 0)).join('');
    }
    const bodyEl = `<div class="sb-side-nav-body">${bodyInner}</div>`;

    return `<nav class="${cls}">${headerEl}${subNavEl}${toolBarEl}${bodyEl}${footerEl}</nav>`;
  }
  window.sbMkSideNav = mkSideNav;

  // ── Демо-хелперы ─────────────────────────────────────────────────────
  const BRAND = `<span class="sb-brand">SPACEBRIDGE</span>`;
  const ADD_BTN = `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>`;

  function demoHeader(variant) {
    if (variant === 'headline') {
      return sbMkHeaderM({ title: 'Headline', slotRight: ADD_BTN + ADD_BTN });
    }
    return sbMkHeaderM({ slotLeft: BRAND });
  }
  function demoSearch() { return sbMkSearch({ iconLeft: true, placeholder: 'Search' }); }
  function demoSubNav() {
    if (typeof sbMkSubNav !== 'function' || typeof sbMkTabBar !== 'function') return '';
    return sbMkSubNav({
      content: `<div style="width:272px">${sbMkTabBar(['Section', 'Section', 'Section'], { selectedIndex: 0 })}</div>`,
      variant: 'tab-bar',
    });
  }
  // Device-info footer (как на мобильном скрине). sb-caption-строки.
  const DEMO_FOOTER = `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-xxs)">
      <span class="sb-caption" style="color:var(--text-secondary)">MAC: 00-40-fd-01-d1-4f</span>
      <span class="sb-caption" style="color:var(--text-secondary)">S/n: DD 1609700282</span>
      <span class="sb-caption" style="color:var(--text-secondary)">Ver.: 7 400.R03.07.DEV03.b163</span>
      <span class="sb-caption" style="color:var(--text-secondary)">Part/n: 16D-007 400-100</span>
      <span class="sb-caption" style="color:var(--text-secondary)">Name: SIT_Default_Name</span>
    </div>`;

  // Деревья-пресеты.
  const TREE_FLAT = [
    { role: 'item', label: 'Single Item' },
    { role: 'item', label: 'Single Item', selected: true },
    { role: 'item', label: 'Single Item' },
    { role: 'item', label: 'Single Item' },
    { role: 'item', label: 'Single Item' },
  ];
  // Side Menu: Single Item + Parent (раскрывается инлайн) + Child.
  const MENU_CHILDREN = [
    { role: 'item', label: 'Child', status: 'online', navigable: true },
    { role: 'item', label: 'Child', status: 'online', navigable: true },
    { role: 'item', label: 'Child', status: 'online', navigable: true },
    { role: 'item', label: 'Child', status: 'online', navigable: true },
    { role: 'item', label: 'Child', status: 'online', navigable: true },
  ];
  const TREE_MENU = [
    { role: 'item',   label: 'Single Item' },
    { role: 'item',   label: 'Single Item' },
    { role: 'parent', label: 'Parent', children: MENU_CHILDREN },
    { role: 'parent', label: 'Parent', children: MENU_CHILDREN },
    { role: 'parent', label: 'Parent', expanded: true, children: MENU_CHILDREN },
  ];
  const TREE_GROUPS = [
    { role: 'group', label: 'Parent', counter: 9 },
    { role: 'group', label: 'Parent', counter: 9 },
    { role: 'group', label: 'Parent', counter: 5, expanded: true, children: [
      { role: 'item', label: 'Child', status: 'online', counter: 9, navigable: true },
      { role: 'item', label: 'Child', status: 'online', counter: 9, navigable: true },
      { role: 'item', label: 'Child', status: 'online', counter: 9, navigable: true, selected: true },
      { role: 'item', label: 'Child', status: 'online', counter: 9, navigable: true },
      { role: 'item', label: 'Child', status: 'online', counter: 9, navigable: true },
    ] },
    { role: 'group', label: 'Parent', counter: 9 },
  ];
  // Grand-Parent состояния (без детей — изолируем ячейку).
  const TREE_GP_STATES = [
    { role: 'section', label: 'Grand Parent', counter: 9 },
    { role: 'section', label: 'Grand Parent', counter: 9, selected: true },
    { role: 'section', label: 'Grand Parent', counter: { value: 30, max: 40 } },
    { role: 'section', label: 'Grand Parent', counter: { empty: true }, disabled: true },
  ];
  const TREE_DEEP = [
    { role: 'section', label: 'Grand Parent', counter: 9 },
    { role: 'section', label: 'Grand Parent', counter: { value: 30, max: 40 }, expanded: true, children: [
      { role: 'group', label: 'Parent', counter: 9 },
      { role: 'group', label: 'Parent', counter: 9 },
      { role: 'group', label: 'Parent', counter: 9, expanded: true, children: [
        { role: 'item', label: 'Child', status: 'online', counter: 9, navigable: true },
        { role: 'item', label: 'Child', status: 'online', counter: 9, navigable: true },
        { role: 'group', label: 'Great-Grand-Parent', counter: 9, expanded: true, children: [
          { role: 'item', label: 'Grand-Child', status: 'online', counter: 9, navigable: true },
          { role: 'item', label: 'Grand-Child', status: 'online', counter: 9, navigable: true, selected: true },
          { role: 'item', label: 'Grand-Child', status: 'online', counter: 9, navigable: true },
        ] },
      ] },
      { role: 'group', label: 'Parent', counter: 9 },
    ] },
    { role: 'section', label: 'Grand Parent', counter: 9 },
  ];

  function treeFor(content) {
    if (content === 'flat')   return TREE_FLAT;
    if (content === 'menu')   return TREE_MENU;
    if (content === 'groups') return TREE_GROUPS;
    return TREE_DEEP;
  }

  // Тогл "Icon": leading-иконка в top-level ячейках (Parent + Single Item).
  // У детей остаётся status-dot (renderItem приоритезирует status над icon).
  function withIcons(tree) {
    return tree.map(n => (n.role === 'parent' || n.role === 'item')
      ? { ...n, icon: 'building-2-line' }
      : n);
  }

  // Превью-стейдж фиксированной высоты — чтобы было видно скролл body и
  // прижатый footer. На surface-1 подложке.
  function stage(content, h = 560) {
    return `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);display:inline-block">
      <div style="height:${h}px">${content}</div>
    </div>`;
  }

  sbRegister({
    name: 'side-navigation',
    title: 'Side Navigation',
    description: 'Вертикальный навигационный сайдбар (320px). Два типа (variant): Side Menu — замена меню Nav Bar в компактных режимах (read-only: Single Item / Parent с инлайн-раскрытием / Child); Side Bar — навигатор-дерево с ролью Grand-Parent и edit/delete (наполняется юзером, в работе). Композиция: Header M + опц. Sub Nav (tab-bar) + опц. Tool Bar (Search) + дерево + опц. Footer. Ячейка: 40px, padding 8/8/8/16, Title S. Default/Hover (Shadow-S + синий текст)/Selected (Pressed-inset + синий)/Disabled.',
    playground: {
      title: 'Side Navigation Playground',
      wide: true,
      state: {
        variant:     'menu',     // menu | bar
        headerStyle: 'logo',     // logo | headline
        search:      true,
        subNav:      false,
        footer:      false,
        content:     'menu',     // flat | menu
        icon:        false,      // leading-иконка в Parent/Single
        empty:       false,
      },
      controls(pg) {
        return `<div class="pg-group">
            <div class="pg-group-title sb-field-label">Type</div>
            <div class="pg-group-body">
              ${pg.select('variant', [
                { value: 'menu', label: 'Side Menu' },
                { value: 'bar',  label: 'Side Bar (WIP)' },
              ], { label: 'Variant' })}
              ${pg.select('content', [
                { value: 'flat', label: 'Flat (Single Items)' },
                { value: 'menu', label: 'Menu (+ Parents)' },
              ], { label: 'Content' })}
              <div class="pg-toggles">
                ${pg.toggle('icon',  'Icon')}
                ${pg.toggle('empty', 'Empty')}
              </div>
            </div>
          </div>
          <div class="pg-group">
            <div class="pg-group-title sb-field-label">Layout</div>
            <div class="pg-group-body">
              ${pg.select('headerStyle', [
                { value: 'logo',     label: 'Logo' },
                { value: 'headline', label: 'Headline + Actions' },
              ], { label: 'Header M' })}
              <div class="pg-toggles">
                ${pg.toggle('search', 'Search')}
                ${pg.toggle('subNav', 'Sub Nav')}
                ${pg.toggle('footer', 'Footer')}
              </div>
            </div>
          </div>`;
      },
      render(s) {
        let tree = treeFor(s.content);
        if (s.icon) tree = withIcons(tree);
        return stage(mkSideNav({
          variant: s.variant,
          header:  demoHeader(s.headerStyle),
          subNav:  s.subNav ? demoSubNav() : '',
          toolBar: s.search ? demoSearch() : '',
          tree,
          footer:  s.footer ? DEMO_FOOTER : '',
          empty:   s.empty,
        }));
      },
      genCode(s) {
        return {
          html: `<!-- sbMkSideNav({ variant:'menu'|'bar', header, subNav, toolBar, tree, footer, empty }).\n     Узлы дерева: { role:'item'|'parent'|'group'|'section', label, icon, status, badge, counter, selected, expanded, navigable, disabled, children }. -->`,
          css: COMP_CSS.sideNav,
        };
      },
    },
    sections: [
      {
        title: 'Single Item — states',
        desc: 'Ячейка 272×40, padding 8/8/8/16, radius 4. Item name — Title S (14/700), цвет --text-secondary. Default → bg --background. Hover → drop Shadow-S (наведи курсор). Selected → surface-1 + Pressed-inset shadow. Disabled → текст --border. Вариант + Icon — то же с leading-иконкой.',
        preview: stage(mkSideNav({
          header: demoHeader('logo'),
          tree: [
            { role: 'item', label: 'Single Item' },
            { role: 'item', label: 'Single Item — Selected', selected: true },
            { role: 'item', label: 'Single Item — Disabled', disabled: true },
            { role: 'item', label: 'Single Item + Icon', icon: 'building-2-line' },
            { role: 'item', label: 'Icon + Selected', icon: 'building-2-line', selected: true },
            { role: 'item', label: 'Icon + Disabled', icon: 'building-2-line', disabled: true },
          ],
        }), 380),
        html: `<!-- tree-узлы: { role:'item', label, icon?, selected?, disabled? } -->`,
        css: COMP_CSS.sideNav,
      },
      {
        title: 'Side Menu — anatomy',
        desc: 'Тип 1 — замена меню Nav Bar в компактных режимах. Read-only. Панель — overlay со Shadow-L. Header M (Logo) + Search + плоский список Single Item + Footer с device-инфо.',
        preview: stage(mkSideNav({
          variant: 'menu',
          header:  demoHeader('logo'),
          toolBar: demoSearch(),
          tree:    TREE_FLAT,
          footer:  DEMO_FOOTER,
        })),
        html: `<!-- sbMkSideNav({ variant:'menu', header: sbMkHeaderM({slotLeft: logo}), toolBar: sbMkSearch({iconLeft:true}), tree:[ {role:'item', label:'Single Item'}, ... ], footer }) -->`,
        css: COMP_CSS.sideNav,
      },
      {
        title: 'Side Menu — Parent + Children',
        desc: 'Parent (= таб с дропдауном в Nav Bar) раскрывается ИНЛАЙН: дети появляются в surface-1 группе с непрерывной полоской слева (1.5px). Шеврон раскрытия — Chevron Button (серый кружок), при раскрытии ↑ + синий заголовок. Child — status-dot + label + правый navigation-chevron.',
        preview: stage(mkSideNav({
          variant: 'menu',
          header:  demoHeader('logo'),
          toolBar: demoSearch(),
          tree:    TREE_MENU,
        }), 600),
        html: `<!-- tree:[ {role:'parent', label:'Parent', expanded:true, children:[ {role:'item', label:'Child', status:'online', navigable:true}, ... ]} ] -->`,
        css: COMP_CSS.sideNav,
      },
      {
        title: 'Side Bar — Grand-Parent (states)',
        desc: 'Grand-Parent: CAPTION-лейбл (12/500, uppercase, --text-muted), акцент-полоска слева (border-left 4px --primary, растягивается на детей при раскрытии), counter single/range, Chevron Button. Состояния: Default → Hover (Shadow-S) → Selected (surface-1) → Disabled (серый stroke + текст --border, counter --/--).',
        preview: stage(mkSideNav({
          variant: 'bar',
          header:  demoHeader('headline'),
          tree:    TREE_GP_STATES,
        }), 360),
        html: `<!-- variant:'bar' — { role:'section', label, counter: 9 | {value,max} | {empty:true}, selected?, disabled? } -->`,
        css: COMP_CSS.sideNav,
      },
      {
        title: 'Side Bar — Groups + Children (WIP)',
        desc: 'Тип 2 — навигатор-дерево, наполняется юзером (появятся edit/delete по ховеру). Group (Parent) с folder-иконкой и counter; раскрытый Group — дети с guide-линией. Эта роль ещё дорабатывается по отдельной спеке.',
        preview: stage(mkSideNav({
          variant: 'bar',
          header:  demoHeader('headline'),
          toolBar: demoSearch(),
          tree:    TREE_GROUPS,
        })),
        html: `<!-- variant:'bar' — tree:[ {role:'group', label:'Parent', counter:5, expanded:true, children:[ {role:'item', label:'Child', ...} ]} ] -->`,
        css: COMP_CSS.sideNav,
      },
      {
        title: 'Side Bar — Deep nesting (WIP)',
        desc: 'Grand-Parent (Section) — UPPERCASE-лейбл с синим accent-stroke и range-counter. Внутри — Group\'ы на любую глубину (Great-Grand-Parent → Grand-Child). Роли Grand-Parent / edit-delete — в работе по отдельной спеке.',
        preview: stage(mkSideNav({
          variant: 'bar',
          header:  demoHeader('headline'),
          toolBar: demoSearch(),
          tree:    TREE_DEEP,
        }), 620),
        html: `<!-- variant:'bar' — tree:[ {role:'section', label:'Grand Parent', counter:{value:30,max:40}, expanded:true, children:[ {role:'group', ...} ]} ] -->`,
        css: COMP_CSS.sideNav,
      },
      {
        title: 'Empty state',
        desc: 'Когда дерево пустое — центрированный CTA (Button) + Subscription Text. Chrome (Header / Sub Nav / Tool Bar) остаётся.',
        preview: stage(mkSideNav({
          variant: 'menu',
          header:  demoHeader('headline'),
          toolBar: demoSearch(),
          empty:   { buttonLabel: 'Button', subText: 'Subscription Text' },
        }), 420),
        html: `<!-- sbMkSideNav({ variant:'menu', header, toolBar, empty: { buttonLabel:'Button', subText:'Subscription Text' } }) -->`,
        css: COMP_CSS.sideNav,
      },
      {
        title: 'Full composition — + Sub Nav + Tool Bar + Footer',
        desc: 'Полный chrome: Header M + Sub Nav (tab-bar) + Tool Bar (Search) + дерево + Footer. Стандартная конфигурация рабочего приложения.',
        preview: stage(mkSideNav({
          variant: 'menu',
          header:  demoHeader('headline'),
          subNav:  demoSubNav(),
          toolBar: demoSearch(),
          tree:    TREE_MENU,
          footer:  DEMO_FOOTER,
        }), 680),
        html: `<!-- sbMkSideNav({ variant:'menu', header, subNav: sbMkSubNav({variant:'tab-bar', content: sbMkTabBar([...])}), toolBar: sbMkSearch(...), tree, footer }) -->`,
        css: COMP_CSS.sideNav,
      },
    ],
  });
})();
