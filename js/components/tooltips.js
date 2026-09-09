// ═══════════════════════════════════════════════════════════════════════════
//  TOOLTIPS
//  CSS в css/components/tooltips.css — SYNC-маркеры обязательны.
//  Hover (200ms delay) / click-подсказка: bubble + фигурный SVG-носик.
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.tooltips = `.sb-tooltip-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.sb-tooltip {
  position: absolute;
  z-index: 30;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: max-content;
  min-width: 50px;
  max-width: 192px;
  padding: var(--pad-vert-8) var(--pad-horiz-16);
  border-radius: var(--radius-4);
  background: var(--background);
  box-shadow: 0 10px 20px 0 var(--shadow-overlay); /* Shadow-L */
  pointer-events: none;
  /* Скрыт по умолчанию. Показ — с задержкой 200ms (transition-delay
     в :hover-правиле ниже), скрытие — сразу, с коротким fade. */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0s linear 0.15s;
}
.sb-tooltip-wrap:not(.click):hover > .sb-tooltip,
.sb-tooltip-wrap:not(.click):focus-within > .sb-tooltip {
  opacity: 1;
  visibility: visible;
  transition-delay: 0.2s, 0.2s;
}
/* Клик-вариант: показ без задержки, управляется .is-open (sbTipToggle). */
.sb-tooltip-wrap.click { cursor: pointer; }
.sb-tooltip-wrap.is-open > .sb-tooltip {
  opacity: 1;
  visibility: visible;
  transition-delay: 0s, 0s;
}

/* Текст. База — многострочный вариант (Body M, стреч по ширине). */
.sb-tooltip-text {
  align-self: stretch;
  color: var(--text-tertiary);
  font-size: var(--body-font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: var(--body-line-height);
  letter-spacing: var(--letter-spacing);
}
/* Однострочный вариант: Title M semibold, по центру, ellipsis при
   переполнении max-width. Figma leading-trim не переносится в CSS —
   вертикальное центрирование даёт flex bubble'а. */
.sb-tooltip.line { height: 36px; }
.sb-tooltip.line .sb-tooltip-text {
  text-align: center;
  font-size: var(--title-font-size-m);
  font-weight: var(--font-weight-semibold);
  line-height: var(--title-line-height-s);
  font-variant-numeric: lining-nums tabular-nums;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Носик: svg 44×14, прилегает к bubble с перекрытием 1px (шов).
   Тень — drop-shadow, чтобы повторяла контур волны. */
.sb-tooltip-tail {
  position: absolute;
  fill: var(--background);
  filter: drop-shadow(0 10px 20px var(--shadow-overlay));
}

/* Позиции. Насадка на wrap: data-tip-pos="top|bottom|left|right".
   Отступ bubble = 13px видимого носика + 4px воздуха до триггера.
   Для left/right носик повёрнут вокруг центра (layout-box 44×14 →
   визуально 14×44), отсюда сдвиг calc(100% - 16px):
   центр носика = край bubble + 6px → кончик = край + 13px. */
.sb-tooltip-wrap[data-tip-pos="top"] > .sb-tooltip {
  bottom: calc(100% + 17px);
  left: 50%;
  transform: translateX(-50%);
}
.sb-tooltip-wrap[data-tip-pos="top"] .sb-tooltip-tail {
  top: calc(100% - 1px);
  left: 50%;
  transform: translateX(-50%);
}
.sb-tooltip-wrap[data-tip-pos="bottom"] > .sb-tooltip {
  top: calc(100% + 17px);
  left: 50%;
  transform: translateX(-50%);
}
.sb-tooltip-wrap[data-tip-pos="bottom"] .sb-tooltip-tail {
  bottom: calc(100% - 1px);
  left: 50%;
  transform: translateX(-50%) rotate(180deg);
}
.sb-tooltip-wrap[data-tip-pos="right"] > .sb-tooltip {
  left: calc(100% + 17px);
  top: 50%;
  transform: translateY(-50%);
}
.sb-tooltip-wrap[data-tip-pos="right"] .sb-tooltip-tail {
  right: calc(100% - 16px);
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
}
.sb-tooltip-wrap[data-tip-pos="left"] > .sb-tooltip {
  right: calc(100% + 17px);
  top: 50%;
  transform: translateY(-50%);
}
.sb-tooltip-wrap[data-tip-pos="left"] .sb-tooltip-tail {
  left: calc(100% - 16px);
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
}`;

// --- TOOLTIPS ---
(() => {
  // Фигурный носик из Figma (tip-down.svg, 44×14). Единственный
  // согласованный локальный <svg> в DS: это не иконка 24×24, в
  // ICON_PATHS/sbIcon не влезает. fill приходит из CSS (--background).
  const TAIL_PATH = 'M0 0C10.0182 0 13.9956 5.56034 20 12.8322C21.5 14.3893 22.5 14.3893 24 12.8322C29.7757 5.8374 34.3333 0 44 0H0Z';

  function mkTail() {
    return `<svg class="sb-tooltip-tail" width="44" height="14" viewBox="0 0 44 14" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="${TAIL_PATH}"/></svg>`;
  }

  /**
   * sbMkTooltip({ trigger, text, variant, pos, click })
   *   trigger — HTML триггера (обязателен: подсказка живёт вокруг него)
   *   text    — содержимое bubble
   *   variant — 'line' (однострочный, Title M) | 'para' (абзац, Body M)
   *   pos     — 'top' | 'bottom' | 'left' | 'right' (default 'top')
   *   click   — true: показ по клику (sbTipToggle), не по ховеру
   */
  function mkTooltip(opts) {
    const { trigger = '', text = '', variant = 'para', pos = 'top', click = false } = opts || {};
    return `<span class="sb-tooltip-wrap${click ? ' click' : ''}" data-tip-pos="${pos}"${click ? ' onclick="sbTipToggle(this, event)"' : ''}>
      ${trigger}
      <span class="sb-tooltip${variant === 'line' ? ' line' : ''}" role="tooltip">
        <span class="sb-tooltip-text">${text}</span>
        ${mkTail()}
      </span>
    </span>`;
  }
  window.sbMkTooltip = mkTooltip;

  // Клик-вариант: toggle .is-open; открытие одного закрывает остальные.
  window.sbTipToggle = function(wrap, e) {
    if (e) e.stopPropagation();
    const open = wrap.classList.contains('is-open');
    document.querySelectorAll('.sb-tooltip-wrap.is-open').forEach(w => w.classList.remove('is-open'));
    if (!open) wrap.classList.add('is-open');
  };
  // Клик мимо — закрыть все открытые. Биндимся один раз глобально.
  if (!window.__sbTipDocBound) {
    window.__sbTipDocBound = true;
    document.addEventListener('click', () => {
      document.querySelectorAll('.sb-tooltip-wrap.is-open').forEach(w => w.classList.remove('is-open'));
    });
  }

  // Demo-триггер: «Sit Status ●» как в футере (реюз .sb-status-dot из status.css).
  function demoTrigger() {
    return `<span class="sb-body-m" style="color:var(--text-secondary)">Sit Status</span>&nbsp;<span class="sb-status-dot online"></span>`;
  }

  const DEMO_PARA = 'When the cursor hovers over elements in charts or diagrams, a tooltip appears. This feature also activates when an element is clicked, providing additional information to the user who requires further details.';

  sbRegister({
    name: 'tooltips',
    title: 'Tooltips',
    description: sbT(
      'A small hint that appears next to an element on hover or focus (with a 200ms delay) or on click. Two content variants: a one-line hint — for example, a parameter value or a status name — and a paragraph of supporting text up to 192px wide. The bubble carries a sculpted tail pointing at the trigger; four placements are available.',
      'Небольшая подсказка, появляющаяся рядом с элементом по ховеру или фокусу (с задержкой 200ms) либо по клику. Два варианта содержимого: однострочная подсказка — например, значение параметра или имя статуса — и абзац поясняющего текста шириной до 192px. У bubble фигурный носик, указывающий на триггер; доступны четыре позиции.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>Bubble settings:</b>'
      + '<ul><li>Background: background;</li><li>Radius: radius-4;</li><li>Shadow: Shadow-L;</li><li>Minimum size: min 50 px;</li><li>Maximum size: max 192 px.</li></ul>'
      + '<b>Text settings:</b>'
      + '<ul><li>Title: One-line — Title M semibold, centered, ellipsis on overflow;</li><li>Paragraph: Body M.</li></ul>'
      + '<b>Tail:</b>'
      + '<ul><li>Type: local SVG path (not a 24×24 icon);</li><li>Fill: <code>var(--background)</code>;</li><li>Shadow: <code>drop-shadow</code> filter following the curve.</li></ul>'
      + '<b>Hover effect:</b>'
      + '<ul><li>Display: via CSS only (<code>transition-delay: 200ms</code>).</li></ul>'
      + '<b>Click variant:</b>'
      + '<ul><li>Toggles: <code>.is-open</code> through <code>sbTipToggle</code>;</li><li>Outside click: closes it.</li></ul>',
      '<b>Настройки bubble:</b>'
      + '<ul><li>Фон: background;</li><li>Радиус: radius-4;</li><li>Тень: Shadow-L;</li><li>Минимальный размер: min 50 px;</li><li>Максимальный размер: max 192 px.</li></ul>'
      + '<b>Настройки текста:</b>'
      + '<ul><li>Тайтл: однострочный — Title M semibold, по центру, ellipsis при переполнении;</li><li>Абзац: Body M.</li></ul>'
      + '<b>Носик:</b>'
      + '<ul><li>Тип: локальный SVG-путь (не иконка 24×24);</li><li>Заливка: <code>var(--background)</code>;</li><li>Тень: фильтр <code>drop-shadow</code>, повторяющий контур.</li></ul>'
      + '<b>Ховер:</b>'
      + '<ul><li>Показ: чистый CSS (<code>transition-delay: 200ms</code>).</li></ul>'
      + '<b>Клик-вариант:</b>'
      + '<ul><li>Переключение: <code>.is-open</code> через <code>sbTipToggle</code>;</li><li>Клик мимо: закрывает.</li></ul>'
    )),
    playground: {
      title: 'Tooltip Playground',
      state: {
        variant: 'line',
        pos: 'top',
        click: false,
      },
      controls(pg) {
        return `${pg.select('variant', [
            { value: 'line', label: 'One Line' },
            { value: 'para', label: 'Paragraph' },
          ], { label: 'content' })}
          ${pg.select('pos', [
            { value: 'top',    label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'left',   label: 'Left' },
            { value: 'right',  label: 'Right' },
          ], { label: 'position' })}
          <div class="pg-toggles">
            ${pg.toggle('click', 'Click')}
          </div>`;
      },
      render(s) {
        // Фикс-высота окна 256px; горизонтальный запас под absolute-bubble left/right.
        return `<div style="display:flex;align-items:center;justify-content:center;height:256px;box-sizing:border-box;padding:0 200px">
          ${sbMkTooltip({
            trigger: demoTrigger(),
            text: s.variant === 'line' ? 'Active' : DEMO_PARA,
            variant: s.variant,
            pos: s.pos,
            click: s.click,
          })}
        </div>`;
      },
      genCode(s) {
        const text = s.variant === 'line' ? 'Active' : DEMO_PARA;
        return {
          html: sbMkTooltip({
            trigger: '<!-- trigger -->',
            text,
            variant: s.variant,
            pos: s.pos,
            click: s.click,
          }),
          css: window.COMP_CSS.tooltips,
        };
      },
    },
  });
})();
