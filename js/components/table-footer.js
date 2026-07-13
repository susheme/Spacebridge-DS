// ═══════════════════════════════════════════════════════════════════════════
//  TABLE FOOTER
//  CSS в css/components/table-footer.css — SYNC-маркеры обязательны.
//  3-слотовая полоса для Table / List: { left, center, right }.
//    left   — summary / bulk-actions
//    center — jump-input / utility-controls (X-centered)
//    right  — Pagination (controls)
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS['table-footer'] = `.sb-table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--gap-horiz-m);
  min-height: 48px;
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  background: var(--background);
  border-top: var(--border-width-1) solid var(--border);
  box-sizing: border-box;
}
.sb-table-footer-left,
.sb-table-footer-center,
.sb-table-footer-right {
  display: flex;
  align-items: center;
  gap: var(--gap-horiz-s);
}`;

// --- TABLE FOOTER ---
(() => {
  // mkTableFooter({ left, center, right }) — все слоты опциональны,
  // обёртки рендерятся всегда (нужно для grid 1fr auto 1fr layout'а).
  function mkTableFooter(opts) {
    const s = opts || {};
    return `<div class="sb-table-footer">
      <div class="sb-table-footer-left">${s.left || ''}</div>
      <div class="sb-table-footer-center">${s.center || ''}</div>
      <div class="sb-table-footer-right">${s.right || ''}</div>
    </div>`;
  }
  window.sbMkTableFooter = mkTableFooter;

  // ── Demo helpers ────────────────────────────────────────────────────────
  // Левый слот: счётчик рядов (row-info) — «Rows: X of N».
  function demoRowInfo(text) {
    return `<span class="sb-body-s" style="color:var(--text-tertiary)">${text}</span>`;
  }
  // Левый слот в режиме выбора — «Selected: N» (primary). Bulk-действия в реальной
  // таблице живут во floating Tool Bar, не в футере.
  function demoSelected(n) {
    return `<span class="sb-body-s sb-fw-semibold" style="color:var(--primary)">Selected: ${n}</span>`;
  }
  function demoPagination() {
    return (typeof sbMkPagination === 'function')
      ? sbMkPagination({ currentPage: 1, totalPages: 2 })
      : '<span class="sb-body-s" style="color:var(--text-secondary)">[Pagination]</span>';
  }
  // Jump-input временно не показывается в demo (паузим до отдельной итерации),
  // но API sbMkPaginationJump остаётся доступным для будущих consumer'ов.

  // Wrapper, имитирующий .sb-table-wrap (border + radius 8 + clip).
  // width:100% обязателен: .example-preview — flex-row, и без него
  // обёртка (как любой flex-ребёнок) сжимается до ширины контента,
  // а не тянется на всю preview area.
  function demoWrap(footerHtml) {
    return `<div style="width:100%;box-sizing:border-box;border:var(--border-width-1) solid var(--border);border-radius:var(--radius-8);overflow:hidden;background:var(--background)">
      <div style="padding:var(--pad-vert-16) var(--pad-horiz-16);color:var(--text-secondary)" class="sb-body-s">
        [ Table body ]
      </div>
      ${footerHtml}
    </div>`;
  }

  sbRegister({
    name: 'table-footer',
    title: 'Table Footer',
    description: sbT(
      'A universal bottom strip for tables and lists. Three slots. Left — a row count: Rows: X of N, or Selected: N during selection. Center — a jump input or utility. Right — Pagination. Example: the footer of a fleet table.',
      'Универсальная нижняя полоса для таблиц и списков. Три слота. Left — счётчик рядов: Rows: X of N, при выборе — Selected: N. Center — jump-инпут или utility. Right — Pagination. Пример: футер таблицы флота.'
    ) + sbDocNote('Tech Info', sbT(
      'Border-top plus background. Radii inherit from the parent <code>.sb-table-wrap</code> via <code>overflow: hidden</code>. Layout: <code>flex + space-between + flex-wrap</code> — slots take their natural width and wrap on narrow containers.',
      'Border-top и background. Радиусы наследуются от родителя <code>.sb-table-wrap</code> через <code>overflow: hidden</code>. Layout: <code>flex + space-between + flex-wrap</code> — слоты получают натуральную ширину и переносятся на узких контейнерах.'
    )),
    sections: [
      {
        title: 'Row Count + Pagination',
        desc: sbT(
          'The base table layout: the row count on the left, Pagination on the right. <code>space-between</code> pushes the slots to the edges.',
          'Базовый layout для таблицы: счётчик рядов слева, Pagination справа. <code>space-between</code> разводит слоты по краям.'
        ),
        preview: demoWrap(mkTableFooter({
          left: demoRowInfo('Rows: 10 of 15'),
          right: demoPagination(),
        })),
        html: `<div class="sb-table-footer">
  <div class="sb-table-footer-left">
    <span class="sb-body-s" style="color:var(--text-tertiary)">Rows: 10 of 15</span>
  </div>
  <div class="sb-table-footer-center"></div>
  <div class="sb-table-footer-right">
    <!-- sbMkPagination({ currentPage: 1, totalPages: 2 }) -->
  </div>
</div>`,
        css: COMP_CSS['table-footer'],
      },
      {
        title: 'Selected mode',
        desc: sbT(
          'During selection the left counter switches to Selected: N (--primary). Bulk actions (Download / Apply / Delete) live in the floating Tool Bar above the footer, not in the footer itself. The right slot keeps Pagination.',
          'При выборе рядов левый счётчик меняется на Selected: N (--primary). Bulk-действия (Download / Apply / Delete) живут во floating Tool Bar над футером, не в самом футере. Правый слот остаётся с Pagination.'
        ),
        preview: demoWrap(mkTableFooter({
          left: demoSelected(3),
          right: demoPagination(),
        })),
        html: `<div class="sb-table-footer">
  <div class="sb-table-footer-left">
    <span class="sb-body-s sb-fw-semibold" style="color:var(--primary)">Selected: 3</span>
  </div>
  <div class="sb-table-footer-center"></div>
  <div class="sb-table-footer-right"><!-- sbMkPagination --></div>
</div>`,
        css: COMP_CSS['table-footer'],
      },
      {
        title: 'Center Pagination (all 3 slots)',
        desc: sbT(
          'Pagination in the center; Rows: X of N on the left, Selected: N on the right. All three slots in use. Note: with <code>space-between</code> the center shifts slightly with the side slots’ width. For a strict center, the side slots can be set to <code>flex:1</code>.',
          'Пагинация по центру; слева Rows: X of N, справа Selected: N. Заняты все три слота. Примечание: при <code>space-between</code> центр слегка смещается от ширины боковых слотов. Для строгого центра боковым слотам задаётся <code>flex:1</code>.'
        ),
        preview: demoWrap(mkTableFooter({
          left: demoRowInfo('Rows: 10 of 15'),
          center: demoPagination(),
          right: demoSelected(3),
        })),
        html: `<div class="sb-table-footer">
  <div class="sb-table-footer-left">
    <span class="sb-body-s" style="color:var(--text-tertiary)">Rows: 10 of 15</span>
  </div>
  <div class="sb-table-footer-center"><!-- sbMkPagination({ currentPage: 1, totalPages: 2 }) --></div>
  <div class="sb-table-footer-right">
    <span class="sb-body-s sb-fw-semibold" style="color:var(--primary)">Selected: 3</span>
  </div>
</div>`,
        css: COMP_CSS['table-footer'],
      },
      {
        title: 'Right-only (Pagination only)',
        desc: sbT(
          'No summary and no bulk actions — the left slot is empty, Pagination sits at the right edge.',
          'Без summary и bulk-действий — левый слот пуст, Pagination прижат к правому краю.'
        ),
        preview: demoWrap(mkTableFooter({ right: demoPagination() })),
        html: `<div class="sb-table-footer">
  <div class="sb-table-footer-left"></div>
  <div class="sb-table-footer-center"></div>
  <div class="sb-table-footer-right"><!-- sbMkPagination --></div>
</div>`,
        css: COMP_CSS['table-footer'],
      },
    ],
  });
})();
