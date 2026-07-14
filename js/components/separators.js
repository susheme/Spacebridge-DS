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
  title: 'Separators',
  description: sbT(
    'Separators visually divide content. Horizontal and vertical variants come in three sizes — L, M and S.',
    'Разделители визуально разграничивают контент. Горизонтальный и вертикальный варианты в трёх размерах — L, M и S.'
  ) + sbDocNote('Tech Info', sbT(
    '<b>Thickness:</b>'
    + '<ul><li>L — 2px;</li><li>M — 1.5px;</li><li>S — 1px.</li></ul>'
    + '<b>Colors:</b>'
    + '<ul><li>Default color — --border;</li><li>The .soft modifier switches it to --border-soft;</li><li>Vertical separators use --border-soft out of the box.</li></ul>',
    '<b>Толщина:</b>'
    + '<ul><li>L — 2px;</li><li>M — 1.5px;</li><li>S — 1px.</li></ul>'
    + '<b>Цвета:</b>'
    + '<ul><li>Цвет по умолчанию — --border;</li><li>Модификатор .soft переключает на --border-soft;</li><li>Вертикальные разделители используют --border-soft из коробки.</li></ul>'
  )),
  sections: [
    {
      title: sbT('Horizontal', 'Горизонтальный'),
      desc: sbT(
        'A horizontal separator for sections and blocks. The Soft color toggle applies the .soft modifier (--border-soft) to every separator in the example.',
        'Горизонтальный разделитель для секций и блоков. Переключатель Soft color применяет ко всем разделителям в примере модификатор .soft (--border-soft).'
      ),
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
      title: sbT('Vertical', 'Вертикальный'),
      desc: sbT(
        'A vertical separator that divides inline elements. Vertical separators use --border-soft out of the box, so the Soft color toggle only sets the .soft class explicitly, with no visual change.',
        'Вертикальный разделитель — разграничивает инлайн-элементы. Вертикальные разделители используют --border-soft из коробки, поэтому переключатель Soft color лишь явно ставит класс .soft, ничего не меняя визуально.'
      ),
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
