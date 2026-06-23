// ═══════════════════════════════════════════════════════════════════════════
//  PAGINATION
//  CSS в css/components/pagination.css — SYNC-маркеры обязательны.
//  API:
//    sbMkPagination({ currentPage, totalPages, onPage })       — controls only
//    sbMkPaginationJump({ totalPages, onPage, placeholder })   — jump-input atom
//  Info-текст ("X of Y rows") и расстановка по слотам — задача consumer'а
//  (обычно через Table Footer: left=summary, center=jump, right=pagination).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.pagination = `.sb-pagination {
  display: flex;
  align-items: center;
  gap: var(--gap-horiz-xs);
}
.sb-btn-sm.sb-btn-icon.sb-pagination-page {
  width: auto;
  min-width: var(--btn-rounded-min-width-s);
  max-width: none;
  padding-left: var(--pad-horiz-4);
  padding-right: var(--pad-horiz-4);
}
.sb-pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--btn-rounded-min-width-s);
  height: var(--btn-rounded-max-height-s);
  color: var(--text-secondary);
  font-size: var(--body-font-size-m);
  user-select: none;
}
.sb-tf.sb-pagination-jump {
  min-width: 64px;
  width: 64px;
}
.sb-tf.sb-pagination-jump .sb-tf-input { text-align: center; padding: 0; }
.sb-tf.sb-pagination-jump .sb-tf-input::-webkit-inner-spin-button,
.sb-tf.sb-pagination-jump .sb-tf-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.sb-tf.sb-pagination-jump .sb-tf-input { -moz-appearance: textfield; appearance: textfield; }`;

// --- PAGINATION ---
(() => {
  // Алгоритм видимых страниц. Правила: первая, последняя, current ± 1 — всегда.
  // current ≤ 4 → раскрываем начало (1..5 + last). current ≥ total-3 → хвост
  // (1 + last-4..last). Между несмежными — '…'. total ≤ 7 → все подряд.
  function paginationPages(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, current - 1, current, current + 1]);
    if (current <= 4) [2, 3, 4, 5].forEach(p => set.add(p));
    if (current >= total - 3) [total - 4, total - 3, total - 2, total - 1].forEach(p => set.add(p));
    const arr = Array.from(set).filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(arr[i]);
      if (i < arr.length - 1 && arr[i + 1] !== arr[i] + 1) result.push('...');
    }
    return result;
  }

  // mkPagination({ currentPage, totalPages, onPage })
  //   onPage : template "...{N}..." — {N} подставится номером, например
  //            "SB_PG.set('pagination','currentPage',{N})". Без onPage кнопки
  //            не интерактивны (для copyable-кода в genCode).
  function mkPagination(opts) {
    const s = opts || {};
    const total = s.totalPages || 1;
    const current = Math.max(1, Math.min(total, s.currentPage || 1));
    const onPageTpl = s.onPage || '';
    const onClick = (n) => onPageTpl ? ` onclick="${onPageTpl.replace('{N}', n)}"` : '';

    const pages = paginationPages(current, total);
    const pagesHtml = pages.map(p => {
      if (p === '...') return `<span class="sb-pagination-ellipsis">…</span>`;
      const isCurrent = p === current;
      const variant = isCurrent ? 'sb-btn-primary' : 'sb-btn-secondary';
      const aria = isCurrent ? ' aria-current="page"' : '';
      // Номер = тот же Icon-Only Small, что и стрелки (current = Primary). Квадрат
      // 24; .sb-pagination-page разрешает ширине расти для много-значных номеров.
      return `<button class="sb-btn ${variant} sb-btn-sm sb-btn-icon sb-pagination-page"${aria}${onClick(p)}>${p}</button>`;
    }).join('\n      ');

    const prevDisabled = current <= 1 ? ' disabled' : '';
    const nextDisabled = current >= total ? ' disabled' : '';
    const prevBtn = `<button class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon" aria-label="Previous page"${prevDisabled}${onClick(current - 1)}>${sbIcon('arrow-drop-left-line', 'S')}</button>`;
    const nextBtn = `<button class="sb-btn sb-btn-secondary sb-btn-sm sb-btn-icon" aria-label="Next page"${nextDisabled}${onClick(current + 1)}>${sbIcon('arrow-drop-right-line', 'S')}</button>`;

    return `<nav class="sb-pagination" aria-label="Pagination">
      ${prevBtn}
      ${pagesHtml}
      ${nextBtn}
    </nav>`;
  }

  // mkPaginationJump({ totalPages, onPage, placeholder })
  //   Standalone jump-input. Enter парсит число, валидирует диапазон,
  //   дёргает onPage. После прыжка — input очищается + blur.
  function mkPaginationJump(opts) {
    const s = opts || {};
    const total = s.totalPages || 1;
    const onPageTpl = s.onPage || '';
    const placeholder = s.placeholder || 'Go';
    const onkey = onPageTpl
      ? ` onkeydown="if(event.key==='Enter'){var v=parseInt(this.value);if(v>=1&&v<=${total}){${onPageTpl.replace('{N}', 'v')}}this.value='';this.blur();}"`
      : '';
    return `<div class="sb-tf sb-pagination-jump">
      <input class="sb-tf-input" type="number" min="1" max="${total}" placeholder="${placeholder}"${onkey}>
    </div>`;
  }

  window.sbMkPagination = mkPagination;
  window.sbMkPaginationJump = mkPaginationJump;

  sbRegister({
    name: 'pagination',
    title: 'Pagination',
    description: 'Page-навигация для Table / List. Two atoms: <code>sbMkPagination</code> — controls (prev/next + numbers, на базе Button Secondary Icon-Only Small, current = Primary Icon-Only); <code>sbMkPaginationJump</code> — jump-input на базе Input Field. Info-текст ("X of Y rows") — задача consumer\'а (обычно левый слот Table Footer\'а). Алгоритм видимых страниц: первая + хвост + current ± 1, разрывы заполняются «…».',
    playground: {
      state: { currentPage: 1, totalPages: 26 },
      controls(pg) {
        return `<div class="pg-toggles">
          <span class="sb-body-s" style="color:var(--text-secondary)">Click page numbers or arrows to navigate</span>
        </div>`;
      },
      render(s) {
        return `<div style="padding:24px;width:100%;box-sizing:border-box">
          ${mkPagination({
            currentPage: s.currentPage,
            totalPages: s.totalPages,
            onPage: "SB_PG.set('pagination','currentPage',{N})",
          })}
        </div>`;
      },
      genCode(s) {
        const html = mkPagination({
          currentPage: s.currentPage,
          totalPages: s.totalPages,
          // Без onPage → copyable-код без onclick'ов.
        });
        return { html, css: COMP_CSS.pagination };
      },
    },
  });
})();
