// ═══════════════════════════════════════════════════════════════════════════
//  SECTION HEADER (Sub-Header)
//  CSS в css/components/section-header.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.sectionHeader = `.sb-section-header {
  display: flex;
  width: 100%;
  min-width: var(--sub-header-min-width);
  max-width: var(--sub-header-max-width);
  height: var(--sub-header-min-max-height);
  min-height: var(--sub-header-min-max-height);
  max-height: var(--sub-header-min-max-height);
  padding: var(--pad-horiz-8) var(--pad-vert-16);
  justify-content: space-between;
  align-items: center;
  border-radius: var(--radius-6);
  background: var(--surface-2);
  container-type: inline-size;
}

.sb-section-header-left {
  display: flex;
  height: 24px;
  justify-content: center;
  align-items: center;
  gap: var(--gap-vert-s);
  min-width: 0;
  color: var(--text-muted);
}

.sb-section-header-right {
  display: inline-flex;
  height: 32px;
  max-width: var(--nav-menu-max-width-right-content);
  justify-content: flex-end;
  align-items: center;
  gap: var(--gap-vert-m);
}

.sb-section-header[data-slot-left="false"] .sb-section-header-left { display: none; }
.sb-section-header[data-slot-right="false"] .sb-section-header-right { display: none; }

.sb-section-header-more { flex-shrink: 0; }
.sb-section-header-menu-extra { display: none; }

@container (max-width: 320px) {
  .sb-section-header-action     { display: none; }
  .sb-section-header-menu-extra { display: flex; }
}`;

// --- SECTION HEADER ---
(() => {
  function mkSectionHeader({ slotLeft, slotRight } = {}) {
    const hasLeft  = slotLeft  != null && slotLeft  !== false && slotLeft  !== '';
    const hasRight = slotRight != null && slotRight !== false && slotRight !== '';
    const left  = hasLeft  ? `<div class="sb-section-header-left">${slotLeft}</div>`   : '';
    const right = hasRight ? `<div class="sb-section-header-right">${slotRight}</div>` : '';
    return `<div class="sb-section-header" data-slot-left="${hasLeft}" data-slot-right="${hasRight}">${left}${right}</div>`;
  }

  // Expose helper для других header-компонентов / dev-консоли.
  window.sbMkSectionHeader = mkSectionHeader;

  // ── Actions builder ──────────────────────────────────────────────
  // Same shape as Header L/M/S Actions: inline buttons (Small / icon S)
  // collapse into More dropdown when container narrow (< 320px).
  function mkSectionHeaderActions({ inline = [], more } = {}) {
    const inlineHtml = inline.map(a => {
      if (a.type === 'icon') {
        return `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon sb-section-header-action">${sbIcon(a.icon, 'S')}</button>`;
      }
      return `<button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-section-header-action"><span>${a.label}</span></button>`;
    }).join('');

    const hasInline = inline.length > 0;
    const moreItems = (more && more.items) || [];
    if (!hasInline && moreItems.length === 0) return '';

    const extraCells = inline.map(a => {
      const iconLeft = a.icon || (a.type === 'icon' ? a.icon : undefined);
      const cellHtml = sbMkContextCell({ iconLeft, label: a.label, mode: 'action' });
      return cellHtml.replace('class="sb-ctx-cell', 'class="sb-ctx-cell sb-section-header-menu-extra');
    }).join('');

    const moreCells = moreItems
      .map(it => sbMkContextCell({ iconLeft: it.icon, label: it.label, mode: 'action' }))
      .join('');

    return inlineHtml + `<div class="sb-section-header-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">${sbIcon('more-2-line', 'S')}</button>
      <div class="sb-ctx-card">${extraCells}${moreCells}</div>
    </div>`;
  }
  window.sbMkSectionHeaderActions = mkSectionHeaderActions;

  const DEMO_MORE_ITEMS = window.SB_DEMO_MORE_ITEMS;

  sbRegister({
    name: 'section-header',
    title: 'Header Section',
    description: 'Самый компактный из шапок (40px). Используется внутри карточек, форм, контентных блоков для группировки секций. Два слота: левый (24px высота) — обычно заголовок секции с опциональной иконкой/индикатором; правый (32px высота, до 700px ширины) — экшены секции (toggle, иконки, шеврон, More-кнопка с выпадающим меню). Без табов снизу. Может быть свёрнутым — для этого добавь шеврон в правый слот. Может быть sticky — за это отвечает обёртка/родитель, а не сам компонент. Responsive: при ширине Section Header < 320px inline-кнопки сворачиваются в выпадающее меню под More-кнопкой (⋯).',
    sections: [
      {
        title: 'Anatomy',
        desc: 'Корневой контейнер 40px / surface-2 / radius-6 / padding 8/16. Внутри — два слота: left (flex, 24px) и right (inline-flex, 32px). Поведение слотов управляется data-slot-left / data-slot-right.',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-lg);width:100%">
          ${mkSectionHeader({
            slotLeft: `<span class="sb-caption">Section title</span>`,
            slotRight: `<div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
          })}
        </div>`,
        html: `<div class="sb-section-header" data-slot-left="true" data-slot-right="true">
  <div class="sb-section-header-left">
    <span class="sb-caption">Section title</span>
  </div>
  <div class="sb-section-header-right">
    <div class="sb-chevron"><!-- arrow-down-s-line --></div>
  </div>
</div>`,
        css: COMP_CSS.sectionHeader,
      },
      {
        title: 'Title only',
        desc: 'Простейший вариант — только заголовок в левом слоте, правый слот скрыт через data-slot-right="false".',
        preview: mkSectionHeader({
          slotLeft: `<span class="sb-caption">Section title</span>`,
          slotRight: false,
        }),
        html: `<div class="sb-section-header" data-slot-left="true" data-slot-right="false">
  <div class="sb-section-header-left">
    <span class="sb-caption">Section title</span>
  </div>
</div>`,
        css: COMP_CSS.sectionHeader,
      },
      {
        title: 'With Symbol Badge',
        desc: 'В левом слоте перед заголовком — Symbol Badge (24×24). Чаще всего Info Pop-up, реже — Warning / Critical / Check для статуса секции.',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-s);width:100%">
          ${mkSectionHeader({
            slotLeft: `${SB_SVG.infoPop}<span class="sb-caption">Section title</span>`,
            slotRight: false,
          })}
          ${mkSectionHeader({
            slotLeft: `${SB_SVG.warnLine}<span class="sb-caption">Warning section</span>`,
            slotRight: false,
          })}
        </div>`,
        html: `<div class="sb-section-header" data-slot-left="true" data-slot-right="false">
  <div class="sb-section-header-left">
    <!-- Symbol Badge: infoPop SVG 24×24 -->
    <span class="sb-caption">Section title</span>
  </div>
</div>`,
        css: COMP_CSS.sectionHeader,
      },
      {
        title: 'Collapsible (chevron)',
        desc: 'Свёрнутый вариант — шеврон самым крайним справа. Состояние раскрытия (вверх/вниз) хранится на родителе, шеврон отражает его.',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-s);width:100%">
          ${mkSectionHeader({
            slotLeft: `<span class="sb-caption">Expanded section</span>`,
            slotRight: `<div class="sb-chevron">${sbIcon('arrow-up-s-line', 'L')}</div>`,
          })}
          ${mkSectionHeader({
            slotLeft: `<span class="sb-caption">Collapsed section</span>`,
            slotRight: `<div class="sb-chevron">${sbIcon('arrow-down-s-line', 'L')}</div>`,
          })}
        </div>`,
        html: `<div class="sb-section-header" data-slot-left="true" data-slot-right="true">
  <div class="sb-section-header-left">
    <span class="sb-caption">Expanded section</span>
  </div>
  <div class="sb-section-header-right">
    <div class="sb-chevron"><!-- arrow-up-s-line --></div>
  </div>
</div>`,
        css: COMP_CSS.sectionHeader,
      },
      {
        title: 'With indicator + actions',
        desc: 'Левый слот: status-индикатор + заголовок. Правый слот: дополнительная подпись + toggle + шеврон.',
        preview: mkSectionHeader({
          slotLeft: `
            <span class="sb-status-dot online"></span>
            <span class="sb-caption">Connection</span>
          `,
          slotRight: `
            <span class="sb-sub" style="color:var(--text-secondary)">subscription</span>
            <label class="sb-toggle-wrap">
              <span class="sb-toggle">
                <input type="checkbox" checked>
                <span class="sb-toggle-track"></span>
                <span class="sb-toggle-thumb"></span>
              </span>
            </label>
            <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon">${sbIcon('add-line', 'S')}</button>
            <div class="sb-chevron">${sbIcon('arrow-up-s-line', 'L')}</div>
          `,
        }),
        html: `<div class="sb-section-header" data-slot-left="true" data-slot-right="true">
  <div class="sb-section-header-left">
    <span class="sb-status-dot online"></span>
    <span class="sb-caption">Connection</span>
  </div>
  <div class="sb-section-header-right">
    <span class="sb-sub">subscription</span>
    <label class="sb-toggle-wrap">…</label>
    <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon"><!-- add-line --></button>
    <div class="sb-chevron"><!-- arrow-up-s-line --></div>
  </div>
</div>`,
        css: COMP_CSS.sectionHeader,
      },
      {
        title: 'With overflow menu (More button)',
        desc: 'В правом слоте — More-кнопка (⋯) с прикреплённым выпадающим меню. Используй когда у секции есть набор второстепенных действий, не помещающихся инлайн. Inline-кнопки автоматически сворачиваются в меню при ширине Section Header < 320px.',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-s);width:100%">
          ${mkSectionHeader({
            slotLeft: `<span class="sb-caption">Section title</span>`,
            slotRight: mkSectionHeaderActions({ more: { items: DEMO_MORE_ITEMS } }),
          })}
          ${mkSectionHeader({
            slotLeft: `<span class="sb-caption">With inline + more</span>`,
            slotRight: mkSectionHeaderActions({
              inline: [
                { type: 'icon', icon: 'add-line', label: 'Add' },
                { type: 'text', label: 'Action', icon: 'arrow-right-s-line' },
              ],
              more: { items: DEMO_MORE_ITEMS },
            }),
          })}
        </div>`,
        html: `<div class="sb-section-header" data-slot-left="true" data-slot-right="true">
  <div class="sb-section-header-left">
    <span class="sb-caption">Section title</span>
  </div>
  <div class="sb-section-header-right">
    <div class="sb-section-header-more sb-overflow-menu">
      <button type="button" class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon"
              onclick="event.stopPropagation(); sbOverflowMenuToggle(this)">
        <!-- more-2-line S -->
      </button>
      <div class="sb-ctx-card">
        <!-- ctx-cells: Copy / Download / Send via email -->
      </div>
    </div>
  </div>
</div>`,
        css: COMP_CSS.sectionHeader,
      },
    ],
  });
})();
