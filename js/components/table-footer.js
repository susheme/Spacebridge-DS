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
  function demoSummary(text) {
    return `<span class="sb-body-s" style="color:var(--text-tertiary)">${text}</span>`;
  }
  function demoBulkActions(selected) {
    return `<span class="sb-body-m" style="color:var(--text-primary)"><strong>${selected}</strong> selected</span>
        <button class="sb-btn sb-btn-text sb-btn-sm">Export</button>
        <button class="sb-btn sb-btn-text sb-btn-sm sb-btn-critical">Delete</button>`;
  }
  function demoPagination() {
    return (typeof sbMkPagination === 'function')
      ? sbMkPagination({ currentPage: 1, totalPages: 26 })
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
    description: 'Универсальная нижняя полоса для Table / List. 3 слота: <code>left</code> (counters / bulk-actions / summary), <code>center</code> (jump-input / utility), <code>right</code> (Pagination). Border-top + background. Радиусы наследуются от parent <code>.sb-table-wrap</code> через <code>overflow: hidden</code>. Layout: <code>flex + space-between + flex-wrap</code> — слоты получают натуральную ширину; если все три не влезают в одну строку — оборачиваются (грационная деградация на узких контейнерах).',
    sections: [
      {
        title: 'Summary + Pagination',
        desc: 'Базовый layout для Table: слева — счётчик строк, справа — Pagination controls. <code>space-between</code> прижимает слоты к краям бара.',
        preview: demoWrap(mkTableFooter({
          left: demoSummary('5 of 128'),
          right: demoPagination(),
        })),
        html: `<div class="sb-table-footer">
  <div class="sb-table-footer-left">
    <span class="sb-body-s" style="color:var(--text-tertiary)">5 of 128</span>
  </div>
  <div class="sb-table-footer-center"></div>
  <div class="sb-table-footer-right">
    <!-- sbMkPagination({ currentPage: 1, totalPages: 26 }) -->
  </div>
</div>`,
        css: COMP_CSS['table-footer'],
      },
      {
        title: 'Bulk-actions mode',
        desc: 'Когда есть выбранные строки — left превращается в action-bar: counter + Export + Delete. Right остаётся с Pagination.',
        preview: demoWrap(mkTableFooter({
          left: demoBulkActions(12),
          right: demoPagination(),
        })),
        html: `<div class="sb-table-footer">
  <div class="sb-table-footer-left">
    <span class="sb-body-m"><strong>12</strong> selected</span>
    <button class="sb-btn sb-btn-text sb-btn-sm">Export</button>
    <button class="sb-btn sb-btn-text sb-btn-sm sb-btn-critical">Delete</button>
  </div>
  <div class="sb-table-footer-center"></div>
  <div class="sb-table-footer-right"><!-- sbMkPagination --></div>
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
