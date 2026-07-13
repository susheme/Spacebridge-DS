// ═══════════════════════════════════════════════════════════════════════════
//  TOOL BAR (Top)
//  CSS в css/components/tool-bar.css — SYNC-маркеры обязательны.
//
//  Top Tool Bar — горизонтальная action-bar под Header'ом / Sub Nav'ом.
//  3 слота: Left (action buttons) / Center (Tab Bar или контент) / Right
//  (поиск + actions). Шаблон обёрток в slot'ах: icon-only Secondary +
//  опциональный label через .sb-btn-with-label.
//
//  Bottom Tool Bar — будет добавлен отдельным заходом.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS["tool-bar"] = `.sb-tool-bar {
  display: flex;
  width: 100%;
  max-width: var(--screens-max-screen-width);
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-horiz-m);
  border-radius: 0;
  border-bottom: var(--border-width-1-5) solid var(--border-soft);
  background: var(--background);
  box-sizing: border-box;
  container-type: inline-size;
  container-name: tool-bar;
}
.sb-tool-bar-menu-extra { display: none; }
.sb-tool-bar-left {
  display: flex;
  max-width: var(--nav-menu-max-width-right-content);
  align-items: center;
  gap: var(--gap-vert-m);
  flex-shrink: 0;
}
.sb-tool-bar-center {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  justify-content: center;
  align-items: center;
}
.sb-tool-bar-right {
  display: flex;
  max-width: var(--nav-menu-max-width-right-content);
  justify-content: flex-end;
  align-items: center;
  gap: var(--gap-vert-m);
  flex-shrink: 0;
}
.sb-tool-bar.compact {
  padding: var(--pad-vert-4) var(--pad-horiz-8);
  gap: var(--gap-horiz-s);
}
.sb-tool-bar.compact .sb-tool-bar-left,
.sb-tool-bar.compact .sb-tool-bar-right { gap: var(--gap-vert-s); }
.sb-tool-bar.compact .sb-btn-icon {
  width: var(--btn-rounded-max-width-s);
  min-width: var(--btn-rounded-min-width-s);
  max-width: var(--btn-rounded-max-width-s);
  height: var(--btn-rounded-max-height-s);
  min-height: var(--btn-rounded-min-height-s);
  max-height: var(--btn-rounded-max-height-s);
  padding: var(--pad-horiz-4) var(--pad-vert-2);
  gap: var(--gap-vert-0);
  border-radius: var(--radius-4);
}
.sb-tool-bar.compact .sb-btn-icon svg { width: 16px; height: 16px; }
.sb-tool-bar.bottom {
  border-bottom: none;
  border-top: var(--border-width-1-5) solid var(--border-soft);
}
.sb-tool-bar.floating {
  position: sticky;
  top: 0;
  z-index: 10;
  width: calc(100% - 2 * var(--pad-horiz-16));
  margin: var(--pad-vert-16) var(--pad-horiz-16);
  border-radius: var(--radius-12);
  border-bottom: none;
  box-shadow: 0 2px 8px 0 var(--shadow-sm);
  transition: margin 0.25s ease, width 0.25s ease, border-radius 0.25s ease, box-shadow 0.25s ease;
}
.sb-tool-bar.floating.is-stuck {
  width: 100%;
  margin: 0;
  border-radius: 0;
  box-shadow: 0 4px 16px 0 var(--shadow-md);
}
.sb-tool-bar-sentinel { height: 1px; flex-shrink: 0; }
@container tool-bar (max-width: 600px) {
  .sb-tool-bar:not(.compact-disabled) {
    padding: var(--pad-vert-4) var(--pad-horiz-8);
    gap: var(--gap-horiz-s);
  }
  .sb-tool-bar:not(.compact-disabled) .sb-tool-bar-left,
  .sb-tool-bar:not(.compact-disabled) .sb-tool-bar-right { gap: var(--gap-vert-s); }
  .sb-tool-bar:not(.compact-disabled) .sb-btn-icon {
    width: var(--btn-rounded-max-width-s);
    min-width: var(--btn-rounded-min-width-s);
    max-width: var(--btn-rounded-max-width-s);
    height: var(--btn-rounded-max-height-s);
    min-height: var(--btn-rounded-min-height-s);
    max-height: var(--btn-rounded-max-height-s);
    padding: var(--pad-horiz-4) var(--pad-vert-2);
    gap: var(--gap-vert-0);
    border-radius: var(--radius-4);
  }
  .sb-tool-bar:not(.compact-disabled) .sb-btn-icon svg { width: 16px; height: 16px; }
  .sb-tool-bar-action     { display: none; }
  .sb-tool-bar-menu-extra { display: flex; }
}`;

// --- TOOL BAR ---
(() => {
  /**
   * mkToolBar({ left, center, right, bottom, floating })
   *   left/center/right — HTML-строки для слотов (опционально).
   *   bottom   — boolean. Bottom Tool Bar: border сверху, не снизу.
   *              Подходит для прилипания к низу карточки (Save/Undo
   *              actions при редактировании).
   *   floating — boolean. Floating mode: sticky к верху scroll-контейнера,
   *              отрывается от краёв (margin + radius + shadow). При скролле
   *              получает .is-stuck (через JS wireFloating ниже) и
   *              схлопывается до full-width. Аналог Nav Bar floating.
   *   compact  — boolean. Compact mode для мобилок / узких контекстов
   *              (Header S, sidebar). Icon-only buttons → 24×24, paddings
   *              уменьшены. Без auto-responsive (включается явно).
   */
  function mkToolBar(opts = {}) {
    const { left = '', center = '', right = '', bottom = false, floating = false, compact = false } = opts;
    let cls = 'sb-tool-bar';
    if (bottom)   cls += ' bottom';
    if (floating) cls += ' floating';
    if (compact)  cls += ' compact';
    return `<div class="${cls}">
      <div class="sb-tool-bar-left">${left}</div>
      <div class="sb-tool-bar-center">${center}</div>
      <div class="sb-tool-bar-right">${right}</div>
    </div>`;
  }
  window.sbMkToolBar = mkToolBar;

  /**
   * mkToolBarActions({ inline, more }) — auto-responsive action group для
   * Tool Bar слота. Wide: inline buttons видимы, More-кнопка с dropdown'ом
   * содержит only more.items. Narrow (container query): inline buttons
   * скрываются (.sb-tool-bar-action display:none), их дубликаты в menu
   * (.sb-tool-bar-menu-extra) показываются.
   *
   * inline: [{ icon, label }, ...] — icon-only Secondary кнопки.
   * more: { items: [{ icon, label }] } — постоянные пункты в dropdown'е.
   *
   * Возвращает HTML-строку с inline buttons + More-кнопкой + ctx-card'ом.
   * Пустой массив inline + пустой more → ''.
   */
  function mkToolBarActions({ inline = [], more } = {}) {
    const moreItems = (more && more.items) || [];
    if (inline.length === 0 && moreItems.length === 0) return '';

    const inlineHtml = inline.map(a =>
      `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon sb-tool-bar-action">${sbIcon(a.icon, 'L')}</button>`
    ).join('');

    // Все inline items дублируем в overflow card как menu-extra cells —
    // CSS показывает их когда action-кнопки скрыты (compact mode).
    const extraCells = inline.map(a => {
      const cellHtml = sbMkContextCell({ iconLeft: a.icon, label: a.label, mode: 'action' });
      return cellHtml.replace('class="sb-ctx-cell', 'class="sb-ctx-cell sb-tool-bar-menu-extra');
    }).join('');
    const moreCells = moreItems
      .map(it => sbMkContextCell({ iconLeft: it.icon, label: it.label, mode: 'action' }))
      .join('');

    // More-кнопка показывается всегда (нет смысла в Tool Bar action group без
    // overflow). Если только inline без more — More-кнопку всё равно рендерим,
    // потому что в compact это единственный способ доступа к actions.
    const moreBtn = `<div class="sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">${sbIcon('more-2-line', 'L')}</button>
      <div class="sb-ctx-card">${extraCells}${moreCells}</div>
    </div>`;

    return inlineHtml + moreBtn;
  }
  window.sbMkToolBarActions = mkToolBarActions;

  /**
   * sbWireToolBarFloating(scrollRoot, toolBar) — IntersectionObserver wiring
   * для floating Tool Bar'а. Аналог sbWireNavBarFloating, но с собственным
   * sentinel-классом чтобы не конфликтовать с Nav Bar'ом на одной странице.
   * Возвращает dispose() для cleanup'а.
   */
  function wireFloating(scrollRoot, toolBar) {
    if (!scrollRoot || !toolBar) return () => {};
    const barInside = scrollRoot.contains(toolBar);
    let sentinel;
    if (barInside) {
      sentinel = toolBar.previousElementSibling;
      if (!sentinel || !sentinel.classList.contains('sb-tool-bar-sentinel')) {
        sentinel = document.createElement('div');
        sentinel.className = 'sb-tool-bar-sentinel';
        toolBar.parentNode.insertBefore(sentinel, toolBar);
      }
    } else {
      sentinel = scrollRoot.firstElementChild;
      if (!sentinel || !sentinel.classList.contains('sb-tool-bar-sentinel')) {
        sentinel = document.createElement('div');
        sentinel.className = 'sb-tool-bar-sentinel';
        sentinel.style.width = '100%';
        scrollRoot.insertBefore(sentinel, scrollRoot.firstChild);
      }
    }
    const obs = new IntersectionObserver(
      ([entry]) => toolBar.classList.toggle('is-stuck', !entry.isIntersecting),
      { root: scrollRoot === document.body ? null : scrollRoot, threshold: 0 }
    );
    obs.observe(sentinel);
    return () => { obs.disconnect(); sentinel.remove(); };
  }
  window.sbWireToolBarFloating = wireFloating;

  // ── Demo-конструкторы ───────────────────────────────────────────────
  // icon-only Secondary с опциональным label через .sb-btn-with-label.
  // labelPos: 'left' | 'right' | undefined.
  function demoIconBtn({ icon = 'add-line', label, labelPos } = {}) {
    const btn = `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon">${sbIcon(icon, 'L')}</button>`;
    if (!label) return btn;
    const lbl = `<span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">${label}</span>`;
    const parts = labelPos === 'left' ? lbl + btn : btn + lbl;
    return `<span class="sb-btn-with-label">${parts}</span>`;
  }

  // icon-only Secondary + chevron справа (демо dropdown trigger,
  // реального dropdown поведения нет — только визуал).
  function demoDropdownBtn(icon = 'add-line') {
    return `<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon" style="width:auto;padding:0 var(--pad-horiz-8);gap:var(--gap-horiz-xs)">
      ${sbIcon(icon, 'L')}${sbIcon('arrow-drop-down-line', 'L')}
    </button>`;
  }

  // Tab Bar в center — 2 таба для демо.
  const DEMO_CENTER_TABS = (typeof sbMkTabBar === 'function')
    ? `<div style="width:240px">${sbMkTabBar(['Tab', 'Tab'], { selectedIndex: 0 })}</div>`
    : '';

  // Search Bar для right slot.
  const DEMO_SEARCH = (typeof sbMkSearch === 'function')
    ? `<div style="width:200px">${sbMkSearch({ placeholder: 'Search' })}</div>`
    : '';

  // Scroll-контент для Floating-демо: оригинальная стилизация под мемуары
  // Эвелина Миллера («The American Inferno», RDR2) — НЕ текст из игры
  // (внутриигровая книга — копирайт Rockstar, дословно не копируем).
  // По строке на <p>, пары EN/RU зипуются через sbT — язык переключается
  // вместе с остальной документацией.
  const DEMO_SCROLL_LINES_EN = [
    'They told me I would find hell out west, and so I went looking for it.',
    'I crossed rivers that had never been named and prairies that had never been fenced,',
    'and everywhere I went I found men busy building the very inferno they had fled.',
    'The wilderness did not burn us. We brought the fire with us,',
    'in ledgers and in locomotives, in deeds and in debts.',
    'I met a man in the mountains who owned nothing and wanted nothing,',
    'and I could not decide if he was the last free American or the first of the damned.',
    'Civilization, I have come to believe, is a circle like any other circle of hell:',
    'we descend it together, applauding our progress at every ring.',
    'And yet — I have seen dawn come up over country no fence has touched,',
    'and heard a silence older than any scripture,',
    'and in that moment I forgave America everything,',
    'the way a man forgives the fire for being hot.',
    'If this is the inferno, Lord, let me be the last to leave it.',
  ];
  const DEMO_SCROLL_LINES_RU = [
    'Мне говорили, что на западе я найду ад, — и я отправился его искать.',
    'Я пересекал реки, которым не дали имён, и прерии, которых не касались изгороди,',
    'и всюду встречал людей, усердно строящих тот самый ад, от которого они бежали.',
    'Дикие земли не жгли нас. Огонь мы принесли с собой —',
    'в гроссбухах и локомотивах, в купчих и долгах.',
    'В горах я встретил человека, который ничем не владел и ничего не хотел,',
    'и так и не решил: последний ли он свободный американец или первый из проклятых.',
    'Цивилизация, как я теперь понимаю, — такой же круг, как любой круг ада:',
    'мы спускаемся по нему вместе, рукоплеща своему прогрессу на каждом витке.',
    'И всё же — я видел, как рассвет встаёт над землёй, не тронутой ни одной изгородью,',
    'и слышал тишину древнее любого писания,',
    'и в тот миг я простил Америке всё —',
    'как прощают огню то, что он горяч.',
    'Если это и есть ад — Господи, позволь мне уйти из него последним.',
  ];

  sbRegister({
    name: 'tool-bar',
    title: 'Tool Bar',
    description: sbT(
      'A horizontal action strip below a header or Sub Nav. Three slots: Left for action buttons, Center for an optional Tab Bar or custom content, Right for a Search Bar and icon-only buttons. Modifiers cover a compact mode, a bottom placement and a floating variant with scroll behavior.',
      'Горизонтальная полоса действий под хедером или Sub Nav. Три слота: Left — кнопки действий, Center — опциональный Tab Bar или произвольный контент, Right — Search Bar и icon-only кнопки. Модификаторы покрывают компактный режим, нижнее размещение и floating-вариант с поведением при скролле.'
    ),
    sections: [
      {
        title: 'Anatomy',
        desc: sbT(
          'A full Tool Bar with all three slots: a dropdown button and a labeled button on the left, a Tab Bar in the center, a labeled button, icon-only buttons and a Search Bar on the right.',
          'Полный Tool Bar со всеми тремя слотами: слева dropdown-кнопка и кнопка с подписью, в центре Tab Bar, справа кнопка с подписью, icon-only кнопки и Search Bar.'
        ) + sbDocNote('Tech Info', sbT(
          'Left slot: up to 2 Secondary action buttons. Right slot: a Search Bar and icon-only buttons, optionally labeled via .sb-btn-with-label. Height: auto — padding 8/16 plus content. Border-bottom 1.5px separates the bar from the content below.',
          'Left слот: до 2 Secondary-кнопок действий. Right слот: Search Bar и icon-only кнопки, опционально с подписью через .sb-btn-with-label. Высота: auto — padding 8/16 плюс контент. Border-bottom 1.5px отделяет бар от контента ниже.'
        )),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto"><div style="min-width:1100px">
          ${mkToolBar({
            left: `${demoDropdownBtn('add-line')}${demoIconBtn({ icon: 'add-line', label: 'Title', labelPos: 'right' })}`,
            center: DEMO_CENTER_TABS,
            right: `${demoIconBtn({ icon: 'add-line', label: 'Title', labelPos: 'left' })}${demoIconBtn({ icon: 'add-line' })}${DEMO_SEARCH}${demoIconBtn({ icon: 'add-line' })}`,
          })}
        </div></div>`,
        html: `<div class="sb-tool-bar">
  <div class="sb-tool-bar-left">
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>  <!-- dropdown trigger -->
    <span class="sb-btn-with-label">
      <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
      <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Title</span>
    </span>
  </div>
  <div class="sb-tool-bar-center">
    <!-- Tab Bar (sbMkTabBar) или любой контент -->
  </div>
  <div class="sb-tool-bar-right">
    <span class="sb-btn-with-label">
      <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Title</span>
      <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
    </span>
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
    <!-- Search Bar (sbMkSearch) -->
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
  </div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Left only',
        desc: sbT(
          'The minimal Tool Bar — a single icon-only button in the left slot; the center and right slots are empty.',
          'Минимальный Tool Bar — одна icon-only кнопка в левом слоте; центральный и правый слоты пусты.'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto"><div style="min-width:1100px">
          ${mkToolBar({
            left: demoIconBtn({ icon: 'add-line' }),
          })}
        </div></div>`,
        html: `<div class="sb-tool-bar">
  <div class="sb-tool-bar-left">
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
  </div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right"></div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Left + Right (no Center)',
        desc: sbT(
          'A Tool Bar without a central Tab Bar: an action group on the left, a Search Bar and an action group on the right, pushed to opposite edges (justify-content: space-between).',
          'Tool Bar без Tab Bar в центре: группа действий слева, Search Bar и группа действий справа, разведены по краям (justify-content: space-between).'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto"><div style="min-width:1100px">
          ${mkToolBar({
            left: `${demoIconBtn({ icon: 'add-line' })}${demoIconBtn({ icon: 'add-line', label: 'Title', labelPos: 'right' })}`,
            right: `${DEMO_SEARCH}${demoIconBtn({ icon: 'add-line' })}`,
          })}
        </div></div>`,
        html: `<div class="sb-tool-bar">
  <div class="sb-tool-bar-left">
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
    <span class="sb-btn-with-label">
      <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
      <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Title</span>
    </span>
  </div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right">
    <!-- Search Bar (sbMkSearch) -->
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
  </div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Auto-responsive (container query)',
        desc: sbT(
          'The Tool Bar watches its own width: in a narrow container it switches to compact mode and moves its inline action buttons into the More (⋯) dropdown, which duplicates the actions. The demo shows two identical Tool Bars in a wide and a narrow wrapper.',
          'Tool Bar следит за собственной шириной: в узком контейнере включается компактный режим, а inline-кнопки действий сворачиваются в More-меню (⋯) с дубликатами действий. В демо — два одинаковых Tool Bar в широком и узком враппере.'
        ) + sbDocNote('Tech Info', sbT(
          '<code>container-type: inline-size</code>; breakpoint 600px — compact mode (24×24 icon buttons) plus the collapse into the More dropdown. Built with the <code>mkToolBarActions({ inline, more })</code> builder.',
          '<code>container-type: inline-size</code>; breakpoint 600px — компактный режим (icon-кнопки 24×24) и сворачивание в More-меню. Собирается билдером <code>mkToolBarActions({ inline, more })</code>.'
        )),
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-horiz-lg);width:100%">
          <div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto">
            <div style="min-width:900px">
              ${mkToolBar({
                left: `${demoIconBtn({ icon: 'add-line' })}`,
                center: DEMO_CENTER_TABS,
                right: mkToolBarActions({
                  inline: [
                    { icon: 'add-line',    label: 'Add' },
                    { icon: 'search-line', label: 'Search' },
                    { icon: 'eye-line',    label: 'View' },
                  ],
                  more: {
                    items: [
                      { icon: 'file-copy-line', label: 'Copy' },
                      { icon: 'mail-line',      label: 'Send via email' },
                    ]
                  }
                }),
              })}
            </div>
            <p class="sb-body-s" style="color:var(--text-secondary);margin:var(--pad-vert-8) 0 0">↑ Wide (>600px): все inline buttons видны, More содержит только Copy/Download.</p>
          </div>
          <div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:400px">
            ${mkToolBar({
              left: `${demoIconBtn({ icon: 'add-line' })}`,
              right: mkToolBarActions({
                inline: [
                  { icon: 'add-line',    label: 'Add' },
                  { icon: 'search-line', label: 'Search' },
                  { icon: 'eye-line',    label: 'View' },
                ],
                more: {
                  items: [
                    { icon: 'file-copy-line', label: 'Copy' },
                    { icon: 'mail-line',      label: 'Send via email' },
                  ]
                }
              }),
            })}
            <p class="sb-body-s" style="color:var(--text-secondary);margin:var(--pad-vert-8) 0 0">↑ Narrow (≤600px): inline скрыты, More содержит Add/Search/View + Copy/Mail.</p>
          </div>
        </div>`,
        html: `<!-- Используй sbMkToolBarActions для responsive action group: -->
<div class="sb-tool-bar-right">
  <!-- Visible @wide, hidden @narrow: -->
  <button class="sb-btn sb-btn-secondary sb-btn-icon sb-tool-bar-action">…</button>
  <button class="sb-btn sb-btn-secondary sb-btn-icon sb-tool-bar-action">…</button>

  <!-- Always visible — More button + dropdown: -->
  <div class="sb-overflow-menu">
    <button class="sb-btn sb-btn-secondary sb-btn-icon"
            onclick="sbOverflowMenuToggle(this)">…</button>
    <div class="sb-ctx-card">
      <!-- Inline duplicates (hidden @wide, visible @narrow): -->
      <div class="sb-ctx-cell is-action sb-tool-bar-menu-extra">…</div>
      <div class="sb-ctx-cell is-action sb-tool-bar-menu-extra">…</div>
      <!-- Permanent more items: -->
      <div class="sb-ctx-cell is-action">…</div>
    </div>
  </div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Compact',
        desc: sbT(
          'The <code>.compact</code> modifier — for mobile screens and narrow slots (a sidebar, Header S): icon-only Secondary buttons shrink to 24×24 (Buttons-Rounded-S) and the bar padding tightens to 4/8.',
          'Модификатор <code>.compact</code> — для мобильных экранов и узких слотов (sidebar, Header S): icon-only Secondary-кнопки уменьшаются до 24×24 (Buttons-Rounded-S), padding бара сжимается до 4/8.'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:400px">
          ${mkToolBar({
            compact: true,
            left: `${demoIconBtn({ icon: 'add-line' })}${demoIconBtn({ icon: 'more-2-line' })}`,
            right: `${demoIconBtn({ icon: 'search-line' })}${demoIconBtn({ icon: 'more-2-line' })}`,
          })}
        </div>`,
        html: `<div class="sb-tool-bar compact">
  <div class="sb-tool-bar-left">
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
  </div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right">
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
    <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
  </div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Bottom Tool Bar',
        desc: sbT(
          'The <code>.bottom</code> modifier places the Tool Bar at the bottom of a card, with the border on top instead of the bottom. Typical cases: editing actions (Save / Cancel / Undo) that appear once the user makes changes, or a form footer with a CTA button.',
          'Модификатор <code>.bottom</code> размещает Tool Bar внизу карточки — граница сверху, а не снизу. Типичные случаи: действия редактирования (Save / Cancel / Undo), появляющиеся когда пользователь вносит изменения, или footer формы с CTA-кнопкой.'
        ),
        preview: `<div style="background:var(--surface-1);padding:var(--pad-vert-24);border-radius:var(--radius-12);width:100%;overflow-x:auto"><div style="min-width:1100px">
          ${mkToolBar({
            bottom: true,
            left: `${demoIconBtn({ icon: 'arrow-go-back-line', label: 'Undo', labelPos: 'right' })}`,
            right: `<button type="button" class="sb-btn sb-btn-secondary">Cancel</button><button type="button" class="sb-btn sb-btn-primary">Save</button>`,
          })}
        </div></div>`,
        html: `<div class="sb-tool-bar bottom">
  <div class="sb-tool-bar-left">
    <span class="sb-btn-with-label">
      <button class="sb-btn sb-btn-secondary sb-btn-icon">…</button>
      <span class="sb-btn-with-label-text sb-title-m sb-fw-semibold">Undo</span>
    </span>
  </div>
  <div class="sb-tool-bar-center"></div>
  <div class="sb-tool-bar-right">
    <button class="sb-btn sb-btn-secondary">Cancel</button>
    <button class="sb-btn sb-btn-primary">Save</button>
  </div>
</div>`,
        css: COMP_CSS["tool-bar"],
      },
      {
        title: 'Floating',
        desc: sbT(
          'The <code>.floating</code> modifier detaches the bar from the edges; on scroll it expands to full width with a deeper shadow. Scroll the preview to see the transition in action.',
          'Модификатор <code>.floating</code> отрывает бар от краёв; при скролле он раскрывается на всю ширину с более глубокой тенью. Прокрутите превью, чтобы увидеть переход в действии.'
        ) + sbDocNote('Tech Info', sbT(
          'Detached: margin 16, radius 12, shadow-sm. On scroll, the <code>.is-stuck</code> class switches to full width with no margins and a deeper shadow; the transition takes 0.25s. Implementation: <code>position: sticky</code> plus an IntersectionObserver via <code>sbWireToolBarFloating(scrollRoot, bar)</code>.',
          'В отрыве: margin 16, radius 12, shadow-sm. При скролле класс <code>.is-stuck</code> переключает в full-width без отступов и с более глубокой тенью; транзишн — 0.25s. Реализация: <code>position: sticky</code> и IntersectionObserver через <code>sbWireToolBarFloating(scrollRoot, bar)</code>.'
        )),
        preview: `<div style="background:var(--surface-1);border-radius:var(--radius-12);overflow:hidden;width:100%;height:280px;display:flex;flex-direction:column" id="tool-bar-floating-demo">
          ${mkToolBar({
            floating: true,
            left: `${demoIconBtn({ icon: 'add-line' })}${demoIconBtn({ icon: 'add-line', label: 'Title', labelPos: 'right' })}`,
            center: DEMO_CENTER_TABS,
            right: `${demoIconBtn({ icon: 'add-line' })}`,
          })}
          <div data-tool-bar-scroll style="flex:1;overflow-y:auto;padding:var(--pad-vert-16) var(--pad-horiz-24)">
            ${DEMO_SCROLL_LINES_EN.map((en, i) => `<p class="sb-body-m" style="margin:0 0 4px;color:var(--text-tertiary)">${sbT(en, DEMO_SCROLL_LINES_RU[i])}</p>`).join('')}
          </div>
        </div>`,
        html: `<div class="sb-tool-bar floating">
  <div class="sb-tool-bar-left">…</div>
  <div class="sb-tool-bar-center">…</div>
  <div class="sb-tool-bar-right">…</div>
</div>

<!-- Wire через JS чтобы получать .is-stuck при скролле: -->
<script>
  const bar = document.querySelector('.sb-tool-bar.floating');
  const scrollRoot = bar.parentNode;  // или scroll-контейнер
  sbWireToolBarFloating(scrollRoot, bar);
</script>`,
        css: COMP_CSS["tool-bar"],
      },
    ],
    // После рендера — wire'аем floating Tool Bar в демо-секции.
    // Bar лежит СНАРУЖИ скролл-области (sibling сверху), scroll-area = root.
    onMount() {
      const demo = document.getElementById('tool-bar-floating-demo');
      if (!demo) return;
      const bar = demo.querySelector('.sb-tool-bar.floating');
      const scrollArea = demo.querySelector('[data-tool-bar-scroll]');
      if (!bar || !scrollArea) return;
      if (window.__toolBarDisposeFloating) window.__toolBarDisposeFloating();
      window.__toolBarDisposeFloating = wireFloating(scrollArea, bar);
    },
  });
})();
