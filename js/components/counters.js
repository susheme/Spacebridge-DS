// ═══════════════════════════════════════════════════════════════════════════
//  COUNTERS
//  CSS в css/components/counters.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.counter = `.sb-counter { display: inline-flex; align-items: center; justify-content: center; height: 24px; min-width: 24px; padding: var(--pad-vert-4) var(--pad-horiz-8); box-sizing: border-box; border-radius: var(--radius-4); border: var(--border-width-1-5) solid var(--border); background: var(--background); color: var(--text-secondary); font-size: var(--body-font-size-m); font-weight: var(--font-weight-bold); line-height: 1; white-space: nowrap; user-select: none; }
.sb-counter.empty { color: var(--text-secondary); opacity: 0.5; }
.sb-counter-online { color: var(--success); }
.sb-counter-sep    { color: var(--text-secondary); }
.sb-counter-total  { color: var(--text-secondary); }`;

// --- COUNTERS ---
(() => {
  function fmtN(n) {
    if (n >= 1_000_000) return (n / 1_000_000 % 1 === 0 ? n / 1_000_000 : (n / 1_000_000).toFixed(1).replace(/\.0$/, '')) + 'M';
    if (n >= 10_000)    return (n / 1_000 % 1 === 0    ? n / 1_000    : (n / 1_000).toFixed(1).replace(/\.0$/, ''))    + 'K';
    return n;
  }

  function mkCnt(opts = {}) {
    const { type = 'single', value = 9, max = 9999, empty = false } = opts;
    if (type === 'range') {
      if (empty) return `<div class="sb-counter range empty">--/--</div>`;
      return `<div class="sb-counter range"><span class="sb-counter-online">${fmtN(value)}</span><span class="sb-counter-sep">/</span><span class="sb-counter-total">${fmtN(max)}</span></div>`;
    }
    if (empty) return `<div class="sb-counter empty">--</div>`;
    return `<div class="sb-counter">${fmtN(value)}</div>`;
  }

  sbRegister({
    name: 'counters',
    title: 'Counters',
    description: 'Компактный элемент отображения числовых значений. Высота 24px, border-radius 4px. Варианты: Single (одно значение), Range (текущее/максимум). Состояние Empty — плейсхолдер.',
    playground: {
      title: 'Counter Playground',
      state: { type: 'single', value: 9, max: 9999, empty: false },
      controls(pg) {
        return `<div class="pg-toggles">
          ${pg.toggle('empty', 'Empty')}
        </div>
        <div class="pg-toggles">
          <div class="sb-radio selected" data-cnt-single onclick="SB_PG.set('counters','type','single')"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div><span class="sb-radio-label">Single</span></div>
          <div class="sb-radio" data-cnt-range onclick="SB_PG.set('counters','type','range')"><div class="sb-radio-circle"><div class="sb-radio-dot"></div></div><span class="sb-radio-label">Range</span></div>
        </div>`;
      },
      syncControls(s, container) {
        const rbSingle = container.querySelector('[data-cnt-single]');
        const rbRange  = container.querySelector('[data-cnt-range]');
        if (rbSingle) rbSingle.classList.toggle('selected', s.type === 'single');
        if (rbRange)  rbRange.classList.toggle('selected', s.type === 'range');
      },
      render(s) { return mkCnt(s); },
      genCode(s) { return { html: mkCnt(s), css: COMP_CSS.counter }; },
    },
    sections: [
      {
        title: 'Single',
        desc: 'Одиночное числовое значение. Минимальная ширина 24px, растёт по контенту.',
        preview: `<div class="sec-row wrap">
          ${mkCnt({ value: 9 })}
          ${mkCnt({ value: 999 })}
          ${mkCnt({ value: 9999 })}
          ${mkCnt({ value: 10000 })}
          ${mkCnt({ value: 150000 })}
          ${mkCnt({ value: 1500000 })}
          ${mkCnt({ empty: true })}
        </div>`,
        html: `<!-- Single -->\n<div class="sb-counter">9</div>\n\n<!-- Empty -->\n<div class="sb-counter empty">--</div>`,
        css: COMP_CSS.counter,
      },
      {
        title: 'Range',
        desc: 'Формат value/max — используется для отображения заполненности (слоты, квоты, списки).',
        preview: `<div class="sec-row">
          ${mkCnt({ type: 'range', value: 1,    max: 9 })}
          ${mkCnt({ type: 'range', value: 99,   max: 999 })}
          ${mkCnt({ type: 'range', value: 9999, max: 9999 })}
          ${mkCnt({ type: 'range', empty: true })}
        </div>`,
        html: `<!-- Range: 9 онлайн из 18 -->\n<div class="sb-counter range">\n  <span class="sb-counter-online">9</span>\n  <span class="sb-counter-sep">/</span>\n  <span class="sb-counter-total">18</span>\n</div>\n\n<!-- Empty -->\n<div class="sb-counter range empty">--/--</div>`,
        css: COMP_CSS.counter,
      },
    ],
  });
})();
