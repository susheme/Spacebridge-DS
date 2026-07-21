// ═══════════════════════════════════════════════════════════════════════════
//  CHIPS
//  CSS в css/components/chips.css — SYNC-маркеры обязательны.
//  Кнопка-пилюля: иконка 24 (close — крестик в круге, L) + лейбл.
//  Dogfood: Clear-чипса стека тостов (toast.js).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.chips = `.sb-chip {
  display: inline-flex;
  height: 32px;
  min-width: var(--btn-rounded-min-width);
  max-height: var(--btn-rounded-max-height);
  padding: var(--pad-vert-4) var(--pad-horiz-16) var(--pad-vert-4) var(--pad-horiz-4);
  justify-content: center;
  align-items: center;
  gap: var(--gap-vert-s);
  border: none;
  cursor: pointer;
  border-radius: var(--radius-100);
  background: var(--text-secondary);
  color: var(--background);
  font-size: var(--button-font-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--button-line-height);
  letter-spacing: var(--letter-spacing);
  font-variant-numeric: lining-nums tabular-nums;
  box-sizing: border-box;
}
/* Слот иконки — строго 24×24 (Close L по спеке). */
.sb-chip .sb-icon-wrap {
  width: 24px;
  height: 24px;
  max-width: 24px;
  max-height: 24px;
  flex-shrink: 0;
}
/* Без иконки паддинги симметричные. */
.sb-chip.no-icon { padding-left: var(--pad-horiz-16); }`;

// --- CHIPS ---
(() => {
  /**
   * sbMkChip({ label, icon, onClick, cls })
   *   label   — текст (допускается HTML — консьюмеры вроде стека тостов
   *             кладут внутрь свои спаны)
   *   icon    — имя из ICON_PATHS (default 'close' — Name=close Size=L);
   *             false — чип без иконки (симметричные паддинги)
   *   onClick — строка-обработчик для onclick
   *   cls     — доп. классы на корневой кнопке
   */
  function mkChip(opts) {
    const c = opts || {};
    const noIcon = c.icon === false;
    const icon = noIcon ? '' : sbIcon(c.icon || 'close', 'L');
    const cls = 'sb-chip' + (noIcon ? ' no-icon' : '') + (c.cls ? ' ' + c.cls : '');
    const onclick = c.onClick ? ` onclick="${c.onClick}"` : '';
    return `<button type="button" class="${cls}"${onclick}>${icon}${c.label || ''}</button>`;
  }
  window.sbMkChip = mkChip;

  sbRegister({
    name: 'chips',
    title: 'Chips',
    description: sbT(
      'A pill-shaped action button: a 24px icon on the left and a label. Sits on an inverse gray pill and works on top of any content. Example: the Clear (N) / Clear All chip of the toast stack — the design system dogfoods it there.',
      'Кнопка-пилюля: иконка 24px слева и лейбл. Сидит на инверсной серой пилюле и работает поверх любого контента. Пример: чипса Clear (N) / Clear All у стека тостов — дизайн-система сама использует её там.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Geometry:</b>'
      + '<ul><li>Height: 32px (min-width 40 / max-height 40 — rounded-button tokens);</li><li>Radius: radius-100;</li><li>Padding: 4 left (icon side) / 16 right (text side), symmetric without an icon;</li><li>Gap: 8.</li></ul>'
      + '<b>Colors:</b>'
      + '<ul><li>Background: <code>--text-secondary</code>;</li><li>Content: <code>--background</code> — the pair flips with the theme.</li></ul>'
      + '<b>Typography:</b>'
      + '<ul><li>Button 15 / semibold, line-height 12, tabular nums.</li></ul>'
      + '<b>Icon:</b>'
      + '<ul><li>24×24 slot, Close L (<code>close</code> — a cross in a filled circle) by default.</li></ul>'
      + '<b>API:</b>'
      + '<ul><li><code>sbMkChip({ label, icon, onClick, cls })</code>.</li></ul>',
      '<b>Геометрия:</b>'
      + '<ul><li>Высота: 32px (min-width 40 / max-height 40 — rounded-button токены);</li><li>Радиус: radius-100;</li><li>Паддинги: 4 слева (сторона иконки) / 16 справа (сторона текста), без иконки — симметрично;</li><li>Gap: 8.</li></ul>'
      + '<b>Цвета:</b>'
      + '<ul><li>Фон: <code>--text-secondary</code>;</li><li>Контент: <code>--background</code> — пара инвертируется темой.</li></ul>'
      + '<b>Типографика:</b>'
      + '<ul><li>Button 15 / semibold, line-height 12, tabular nums.</li></ul>'
      + '<b>Иконка:</b>'
      + '<ul><li>Слот 24×24, по умолчанию Close L (<code>close</code> — крестик в залитом круге).</li></ul>'
      + '<b>API:</b>'
      + '<ul><li><code>sbMkChip({ label, icon, onClick, cls })</code>.</li></ul>'
    )),
    playground: {
      title: 'Chips Playground',
      state: {
        withIcon: true,
        longLabel: false,
      },
      controls(pg) {
        return `<div class="pg-toggles">
            ${pg.toggle('withIcon', 'Icon')}
            ${pg.toggle('longLabel', 'Long')}
          </div>`;
      },
      render(s) {
        const label = s.longLabel ? 'Clear All Notifications (42)' : 'Clear All';
        return `<div style="display:flex;justify-content:center;padding:var(--pad-vert-24)">
          ${mkChip({ label, icon: s.withIcon ? 'close' : false })}
        </div>`;
      },
      genCode(s) {
        const label = s.longLabel ? 'Clear All Notifications (42)' : 'Clear All';
        return {
          html: mkChip({ label, icon: s.withIcon ? 'close' : false }),
          css: window.COMP_CSS.chips,
        };
      },
    },
  });
})();
