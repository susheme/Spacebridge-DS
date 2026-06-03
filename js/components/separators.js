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
  sections: [
    {
      title: 'Horizontal',
      desc: 'Горизонтальный разделитель для секций и блоков. L — 2px, M — 1.5px, S — 1px. Toggle Soft color переключает все sep\'ы внутри блока на модификатор .soft (--border-soft).',
      col: true,
      preview: `
        <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-lg);width:100%">
          <label class="sb-toggle-wrap">
            <span class="sb-toggle">
              <input type="checkbox" onchange="this.closest('.example-box').querySelectorAll('.sb-sep').forEach(s => s.classList.toggle('soft', this.checked))">
              <span class="sb-toggle-track"></span>
              <span class="sb-toggle-thumb"></span>
            </span>
            <span class="sb-toggle-label-text">Soft color</span>
          </label>
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
      html: `<div class="sb-sep sep-h sep-l"></div>\n<div class="sb-sep sep-h sep-m"></div>\n<div class="sb-sep sep-h sep-s"></div>\n\n<!-- Soft color variant — добавь .soft модификатор -->\n<div class="sb-sep sep-h sep-l soft"></div>`,
      css: COMP_CSS.separator,
    },
    {
      title: 'Vertical',
      desc: 'Вертикальный разделитель — разграничение инлайн-элементов. L — 2px, M — 1.5px, S — 1px. У вертикальных sep\'ов фон --border-soft из коробки; toggle Soft color ставит .soft класс явно (визуально не меняется).',
      preview: `
        <div style="display:flex;flex-direction:column;gap: var(--gap-horiz-lg);width:100%">
          <label class="sb-toggle-wrap">
            <span class="sb-toggle">
              <input type="checkbox" onchange="this.closest('.example-box').querySelectorAll('.sb-sep').forEach(s => s.classList.toggle('soft', this.checked))">
              <span class="sb-toggle-track"></span>
              <span class="sb-toggle-thumb"></span>
            </span>
            <span class="sb-toggle-label-text">Soft color</span>
          </label>
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
          </div>
        </div>`,
      html: `<div class="sb-sep sep-v sep-l"></div>\n<div class="sb-sep sep-v sep-m"></div>\n<div class="sb-sep sep-v sep-s"></div>`,
      css: COMP_CSS.separator,
    },
  ],
});
