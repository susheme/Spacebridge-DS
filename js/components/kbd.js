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
    description: sbT(
      'A small key-styled element for hotkeys and hints: ⌘+K, /, Esc. Examples: the KBS hint in the Search Bar, shortcuts in tooltips and dialogs. Not interactive — a hint, not a button.',
      'Маленький элемент в виде клавиши для хоткеев и подсказок: ⌘+K, /, Esc. Примеры: KBS-подсказка в Search Bar, шорткаты в тултипах и диалогах. Не интерактивен — подсказка, а не кнопка.'
    ) + sbDocNote('Tech Info', sbT(
      'Min-height 20px · monospace font · background surface-2 · radius 4px.',
      'Min-height 20px · monospace-шрифт · фон surface-2 · radius 4px.'
    )),
    sections: [
      {
        title: 'Anatomy — single key',
        desc: sbT(
          'A single key element.',
          'Один клавишный элемент.'
        ) + sbDocNote('Tech Info', sbT(
          'Inline-flex, 20px tall · padding 2/8 · surface-2 background · monospace font at the subscription size.',
          'Inline-flex, высота 20px · padding 2/8 · фон surface-2 · monospace-шрифт subscription-размера.'
        )),
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
        desc: sbT(
          'Several keys with a separator (+ by default). The sb-kbd-group wrapper builds chord combinations. The separator is plain text outside the key plates.',
          'Несколько клавиш с разделителем (по умолчанию +). Chord-комбинации собирает обёртка sb-kbd-group. Разделитель — обычный текст вне клавишных плашек.'
        ),
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
        desc: sbT(
          'Typical placements: inside a Search Bar, a tooltip, helper text, or the footer of a command palette.',
          'Типичные размещения: внутри Search Bar, тултипа, helper-текста или футера command-палитры.'
        ),
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
