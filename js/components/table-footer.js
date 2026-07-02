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
  function demoWrap(footerHtml) {
    return `<div style="border:var(--border-width-1) solid var(--border);border-radius:var(--radius-8);overflow:hidden;background:var(--background)">
      <div style="padding:var(--pad-vert-16) var(--pad-horiz-16);color:var(--text-secondary)" class="sb-body-s">
        [ Table body — placeholder, реальный Table придёт в следующей итерации ]
      </div>
      ${footerHtml}
    </div>`;
  }

  sbRegister({
    name: 'table-footer',
    title: 'Table Footer',
    description: 'Универсальная нижняя полоса для Table / List. 3 слота: <code>left</code> (row-count «Rows: X of N» → «Selected: N» при выборе), <code>center</code> (jump-input / utility), <code>right</code> (Pagination). Border-top + background. Радиусы наследуются от parent <code>.sb-table-wrap</code> через <code>overflow: hidden</code>. Layout: <code>flex + space-between + flex-wrap</code> — слоты получают натуральную ширину; если все три не влезают в одну строку — оборачиваются (грационная деградация на узких контейнерах).',
    sections: [
      {
        title: 'Row Count + Pagination',
        desc: 'Базовый layout для Table: слева — счётчик рядов «Rows: X of N», справа — Pagination. <code>space-between</code> прижимает слоты к краям.',
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
        desc: 'Когда выбраны ряды — left-счётчик меняется на «Selected: N» (--primary). Bulk-действия (Download / Apply / Delete) живут во floating Tool Bar над футером, не в самом футере. Right остаётся с Pagination.',
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
        desc: 'Пагинация по центру, слева — «Rows: X of N», справа — «Selected: N». Задействованы все три слота (left / center / right). Примечание: при <code>space-between</code> центр слегка смещается от ширины боковых слотов — для строгого центра боковые слоты можно сделать <code>flex:1</code>.',
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
        desc: 'Без summary и bulk-actions — left пустой, Pagination прижат к правому краю.',
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
