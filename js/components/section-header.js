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
    description: sbT(
      'A compact header that groups sections inside cards, forms and content blocks. The left slot holds the section title with an optional icon or indicator; the right slot holds section actions — a toggle, icons, a chevron or the More menu. A chevron in the right slot makes the section collapsible; sticky behavior, when needed, is the parent’s responsibility. On narrow widths, inline buttons collapse into a dropdown menu behind the More (⋯) button.',
      'Компактная шапка для группировки секций внутри карточек, форм и контентных блоков. Левый слот — заголовок секции с опциональной иконкой или индикатором; правый — действия секции: toggle, иконки, шеврон или More-меню. Шеврон в правом слоте делает секцию сворачиваемой; sticky-поведение, когда оно нужно, — зона ответственности родителя. На узкой ширине inline-кнопки сворачиваются в выпадающее меню под More-кнопкой (⋯).'
    ),
    sections: [
      {
        title: sbT('Anatomy', 'Анатомия'),
        desc: sbT(
          'A single row with two slots pushed to opposite edges: the title on the left, the actions on the right.',
          'Одна строка с двумя разведёнными по краям слотами: слева заголовок, справа действия.'
        ) + sbDocNote('Tech Info', sbT(
          '<b>Root:</b>'
          + '<ul><li>Height: 40px;</li><li>Background: surface-2;</li><li>Radius: 6;</li><li>Padding: 8/16.</li></ul>'
          + '<b>Slots:</b>'
          + '<ul><li>Left — flex, 24px;</li><li>Right — inline-flex, 32px, up to 700px wide;</li><li>Slot behavior via data-slot-left / data-slot-right.</li></ul>'
          + '<b>Behavior:</b>'
          + '<ul><li>Breakpoint 320px: inline buttons collapse behind More (⋯).</li></ul>',
          '<b>Корень:</b>'
          + '<ul><li>Высота: 40px;</li><li>Фон: surface-2;</li><li>Radius: 6;</li><li>Padding: 8/16.</li></ul>'
          + '<b>Слоты:</b>'
          + '<ul><li>Левый — flex, 24px;</li><li>Правый — inline-flex, 32px, ширина до 700px;</li><li>Поведение слотов — через data-slot-left / data-slot-right.</li></ul>'
          + '<b>Поведение:</b>'
          + '<ul><li>Breakpoint 320px: inline-кнопки сворачиваются под More (⋯).</li></ul>'
        )),
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-lg);width:100%">
          ${mkSectionHeader({
            slotLeft: `<span class="sb-caption">Section title</span>`,
            slotRight: sbMkChevron(),
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
        title: sbT('Title only', 'Только тайтл'),
        desc: sbT(
          'The simplest configuration — only the title in the left slot; the right slot is hidden via <code>data-slot-right="false"</code>.',
          'Простейшая конфигурация — только заголовок в левом слоте; правый слот скрыт через <code>data-slot-right="false"</code>.'
        ),
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
        title: sbT('With Symbol Badge', 'С Symbol Badge'),
        desc: sbT(
          'A Symbol Badge (24×24) precedes the title in the left slot. Most often an Info Pop-up; Warning, Critical or Check can reflect the section’s status.',
          'Перед заголовком в левом слоте — Symbol Badge (24×24). Чаще всего Info Pop-up; Warning, Critical или Check могут отражать статус секции.'
        ),
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
        title: sbT('Collapsible (chevron)', 'Сворачиваемый (шеврон)'),
        desc: sbT(
          'The collapsible variant places a chevron at the far right. The expanded state is stored on the parent; the chevron only reflects it.',
          'Сворачиваемый вариант — шеврон крайним справа. Состояние раскрытия хранится на родителе; шеврон лишь отражает его.'
        ),
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-s);width:100%">
          ${mkSectionHeader({
            slotLeft: `<span class="sb-caption">Expanded section</span>`,
            slotRight: sbMkChevron({ dir: 'up' }),
          })}
          ${mkSectionHeader({
            slotLeft: `<span class="sb-caption">Collapsed section</span>`,
            slotRight: sbMkChevron(),
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
        title: sbT('With indicator + actions', 'С индикатором и действиями'),
        desc: sbT(
          'Left slot: a status indicator and the title. Right slot: an additional caption, a toggle and a chevron.',
          'Левый слот: status-индикатор и заголовок. Правый слот: дополнительная подпись, toggle и шеврон.'
        ),
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
            ${sbMkChevron({ dir: 'up' })}
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
        title: sbT('With overflow menu (More button)', 'С overflow-меню (кнопка More)'),
        desc: sbT(
          'The More (⋯) button with an attached dropdown menu — for sections with a set of secondary actions that do not fit inline. On narrow widths (below 320px), inline buttons collapse into this menu automatically.',
          'More-кнопка (⋯) с прикреплённым выпадающим меню — для секций с набором второстепенных действий, которые не помещаются инлайн. На узкой ширине (меньше 320px) inline-кнопки сворачиваются в это меню автоматически.'
        ),
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
