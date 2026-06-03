// ═══════════════════════════════════════════════════════════════════════════
//  SEPARATORS
//  CSS в css/components/separators.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.separator = `.sb-sep { display: block; background: var(--border); flex-shrink: 0; }
.sb-sep.sep-h { width: 100%; }
.sb-sep.sep-h.sep-l { height: 2px; }
.sb-sep.sep-h.sep-m { height: 1.5px; }
.sb-sep.sep-h.sep-s { height: 1px; }
.sb-sep.sep-v { border-radius: var(--radius-100); background: var(--border-soft); }
.sb-sep.sep-v.sep-l { width: 2px;   height: 23px; }
.sb-sep.sep-v.sep-m { width: 1.5px; height: 23px; }
.sb-sep.sep-v.sep-s { width: 1px;   height: 23px; }
.sb-sep.soft { background: var(--border-soft); }`;

// --- SEPARATORS ---
sbRegister({
  name: 'separators',
  title: 'Separator',
  description: 'Разделители для визуального разграничения контента. Горизонтальные и вертикальные варианты в трёх размерах: L, M, S. Цвет фона — --border по умолчанию или --border-soft через модификатор .soft (опционально). Вертикальные sep\'ы используют --border-soft из коробки.',
  playground: {
    title: 'Separator Playground',
    state: { soft: false },
    controls(pg) {
      return `<div class="pg-toggles">${pg.toggle('soft', 'Soft color')}</div>`;
    },
    render(s) {
      const cls = s.soft ? ' soft' : '';
      return `<div style="display:flex;flex-direction:column;gap: var(--gap-horiz-lg);width:100%">
        <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-s);width:100%">
          <span class="sb-body-s" style="color:var(--text-tertiary)">Horizontal L — 2px</span>
          <div class="sb-sep sep-h sep-l${cls}"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-s);width:100%">
          <span class="sb-body-s" style="color:var(--text-tertiary)">Horizontal M — 1.5px</span>
          <div class="sb-sep sep-h sep-m${cls}"></div>
        </div>
        <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-s);width:100%">
          <span class="sb-body-s" style="color:var(--text-tertiary)">Horizontal S — 1px</span>
          <div class="sb-sep sep-h sep-s${cls}"></div>
        </div>
        <div style="display:flex;align-items:flex-end;gap: var(--gap-horiz-xl)">
          <div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s)">
            <div class="sb-sep sep-v sep-l${cls}"></div>
            <span class="sb-body-s" style="color:var(--text-tertiary)">V — L</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s)">
            <div class="sb-sep sep-v sep-m${cls}"></div>
            <span class="sb-body-s" style="color:var(--text-tertiary)">V — M</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s)">
            <div class="sb-sep sep-v sep-s${cls}"></div>
            <span class="sb-body-s" style="color:var(--text-tertiary)">V — S</span>
          </div>
        </div>
      </div>`;
    },
    genCode(s) {
      const m = s.soft ? ' soft' : '';
      const html = `<div class="sb-sep sep-h sep-l${m}"></div>\n<div class="sb-sep sep-h sep-m${m}"></div>\n<div class="sb-sep sep-h sep-s${m}"></div>\n<div class="sb-sep sep-v sep-l${m}"></div>\n<div class="sb-sep sep-v sep-m${m}"></div>\n<div class="sb-sep sep-v sep-s${m}"></div>`;
      return { html, css: COMP_CSS.separator };
    },
  },
  sections: [
    {
      title: 'Horizontal',
      desc: 'Горизонтальный разделитель для секций и блоков. L — 2px, M — 1.5px, S — 1px.',
      col: true,
      preview: `
        <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-lg);width:100%">
          <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-s);width:100%">
            <span class="sb-body-s" style="color:var(--text-tertiary)">L — 2px</span>
            <div class="sb-sep sep-h sep-l"></div>
          </div>
          <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-s);width:100%">
            <span class="sb-body-s" style="color:var(--text-tertiary)">M — 1.5px</span>
            <div class="sb-sep sep-h sep-m"></div>
          </div>
          <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-s);width:100%">
            <span class="sb-body-s" style="color:var(--text-tertiary)">S — 1px</span>
            <div class="sb-sep sep-h sep-s"></div>
          </div>
        </div>`,
      html: `<div class="sb-sep sep-h sep-l"></div>\n<div class="sb-sep sep-h sep-m"></div>\n<div class="sb-sep sep-h sep-s"></div>`,
      css: COMP_CSS.separator,
    },
    {
      title: 'Vertical',
      desc: 'Вертикальный разделитель — разграничение инлайн-элементов. L — 2px, M — 1.5px, S — 1px.',
      preview: `
        <div style="display:flex;align-items:flex-end;gap: var(--gap-horiz-xl)">
          <div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s)">
            <div class="sb-sep sep-v sep-l"></div>
            <span class="sb-body-s" style="color:var(--text-tertiary)">L</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s)">
            <div class="sb-sep sep-v sep-m"></div>
            <span class="sb-body-s" style="color:var(--text-tertiary)">M</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s)">
            <div class="sb-sep sep-v sep-s"></div>
            <span class="sb-body-s" style="color:var(--text-tertiary)">S</span>
          </div>
        </div>`,
      html: `<div class="sb-sep sep-v sep-l"></div>\n<div class="sb-sep sep-v sep-m"></div>\n<div class="sb-sep sep-v sep-s"></div>`,
      css: COMP_CSS.separator,
    },
  ],
});
