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
      const aria = isCurrent ? ' aria-current="page"' : '';
      // Номер = тот же Icon-Only Small, что и стрелки (current = Primary). Квадрат
      // 24; .sb-pagination-page разрешает ширине расти для много-значных номеров.
      return sbMkButton({ variant: isCurrent ? 'primary' : 'secondary', size: 's', iconOnly: true,
        content: String(p), cls: 'sb-pagination-page', attrs: aria + onClick(p) });
    }).join('\n      ');

    const prevDisabled = current <= 1 ? ' disabled' : '';
    const nextDisabled = current >= total ? ' disabled' : '';
    const prevBtn = sbMkButton({ icon: 'arrow-drop-left-line', iconSize: 'S', size: 's',
      attrs: ' aria-label="Previous page"' + prevDisabled + onClick(current - 1) });
    const nextBtn = sbMkButton({ icon: 'arrow-drop-right-line', iconSize: 'S', size: 's',
      attrs: ' aria-label="Next page"' + nextDisabled + onClick(current + 1) });

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
    description: sbT(
      'Page navigation for tables and lists. Two atoms: <code>sbMkPagination</code> — the controls (previous / next and page numbers); <code>sbMkPaginationJump</code> — a jump input built on Input Field. The info text (X of Y rows) is the consumer’s responsibility, usually the left slot of a Table Footer.',
      'Постраничная навигация для таблиц и списков. Два атома: <code>sbMkPagination</code> — контролы (previous / next и номера страниц); <code>sbMkPaginationJump</code> — jump-инпут на базе Input Field. Info-текст (X of Y rows) — зона ответственности потребителя, обычно левый слот Table Footer.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Composition:</b>'
      + '<ul><li>Controls are built on Button Secondary Icon-Only Small;</li><li>The current page is Primary Icon-Only.</li></ul>'
      + '<b>Behavior:</b>'
      + '<ul><li>Visible pages algorithm: the first page, the tail and current ± 1;</li><li>Gaps are filled with an ellipsis.</li></ul>',
      '<b>Состав:</b>'
      + '<ul><li>Контролы построены на Button Secondary Icon-Only Small;</li><li>Текущая страница — Primary Icon-Only.</li></ul>'
      + '<b>Поведение:</b>'
      + '<ul><li>Алгоритм видимых страниц: первая, хвост и current ± 1;</li><li>Разрывы заполняются многоточием.</li></ul>'
    )),
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
