// ═══════════════════════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUT (KBD)
//  CSS в css/components/kbd.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.kbd = `.sb-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 20px;
  padding: var(--pad-horiz-2) var(--pad-vert-8);
  background: var(--surface-2);
  border-radius: var(--radius-4);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--subscription-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--subscription-line-height);
  letter-spacing: var(--letter-spacing);
  white-space: nowrap;
  user-select: none;
}

.sb-kbd-group {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-vert-xxs);
  color: var(--text-secondary);
}
.sb-kbd-group .sb-kbd-sep {
  font-size: var(--subscription-font-size);
  user-select: none;
}`;

// --- KBD ---
(() => {
  function mkKbd(label) {
    return `<kbd class="sb-kbd">${label}</kbd>`;
  }

  function mkKbdGroup(keys, sep = '+') {
    const parts = keys.map(k => mkKbd(k)).join(`<span class="sb-kbd-sep">${sep}</span>`);
    return `<span class="sb-kbd-group">${parts}</span>`;
  }

  window.sbMkKbd = mkKbd;
  window.sbMkKbdGroup = mkKbdGroup;

  sbRegister({
    name: 'kbd',
    title: 'Keyboard Shortcut',
    description: 'Маленький стилизованный «клавишный» элемент для отображения хоткеев и подсказок (⌘+K, /, Esc и т. п.). Используется в search-баре, тултипах, command-палетте, диалогах. Минимальная высота 20px, monospace-шрифт, фон surface-2, радиус 4px. Не интерактивен: подсказка, не кнопка.',
    sections: [
      {
        title: 'Anatomy — single key',
        desc: 'Один клавишный элемент. Inline-flex 20px высотой, padding 2/8, surface-2 фон, monospace-шрифт subscription-размера.',
        preview: `<div class="sec-row" style="gap:var(--gap-vert-s);align-items:center">
          ${mkKbd('⌘K')}
          ${mkKbd('Esc')}
          ${mkKbd('/')}
          ${mkKbd('Enter')}
          ${mkKbd('?')}
        </div>`,
        html: `<kbd class="sb-kbd">⌘K</kbd>
<kbd class="sb-kbd">Esc</kbd>
<kbd class="sb-kbd">/</kbd>`,
        css: COMP_CSS.kbd,
      },
      {
        title: 'Group — combo keys',
        desc: 'Несколько клавиш с разделителем (по умолчанию «+»). Используй sb-kbd-group для chord-комбинаций. Разделитель — обычный текст вне фоновой плашки.',
        preview: `<div class="sec-col" style="gap:var(--gap-vert-s);align-items:flex-start">
          ${mkKbdGroup(['⌘', 'K'])}
          ${mkKbdGroup(['⌘', 'Shift', 'P'])}
          ${mkKbdGroup(['Ctrl', 'Alt', 'Del'])}
          ${mkKbdGroup(['⌘', 'C'], '+')}
        </div>`,
        html: `<span class="sb-kbd-group">
  <kbd class="sb-kbd">⌘</kbd>
  <span class="sb-kbd-sep">+</span>
  <kbd class="sb-kbd">K</kbd>
</span>`,
        css: COMP_CSS.kbd,
      },
      {
        title: 'Inline в подсказках',
        desc: 'Типичные кейсы использования — внутри Search Bar, тултипа, helper-текста, footer\'а команд-палетты.',
        preview: `<div class="sec-col" style="gap:var(--gap-vert-m);align-items:flex-start">
          <span class="sb-body-m" style="color:var(--text-secondary);display:inline-flex;align-items:center;gap:var(--gap-vert-s)">
            Press ${mkKbdGroup(['⌘', 'K'])} to search
          </span>
          <span class="sb-body-m" style="color:var(--text-secondary);display:inline-flex;align-items:center;gap:var(--gap-vert-s)">
            Hit ${mkKbd('Esc')} to close
          </span>
          <span class="sb-body-m" style="color:var(--text-secondary);display:inline-flex;align-items:center;gap:var(--gap-vert-s)">
            ${mkKbdGroup(['↑', '↓'])} to navigate &nbsp;·&nbsp; ${mkKbd('Enter')} to select
          </span>
        </div>`,
        html: `<span>Press <span class="sb-kbd-group"><kbd class="sb-kbd">⌘</kbd><span class="sb-kbd-sep">+</span><kbd class="sb-kbd">K</kbd></span> to search</span>`,
        css: COMP_CSS.kbd,
      },
    ],
  });
})();
