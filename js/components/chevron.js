// ═══════════════════════════════════════════════════════════════════════════
//  CHEVRON
//  CSS в css/components/chevron.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.chevron = `.sb-chevron { display: inline-flex; align-items: center; justify-content: center; width: var(--btn-rounded-max-width-s); height: var(--btn-rounded-max-height-s); flex-shrink: 0; border-radius: var(--radius-100); background: var(--surface-1); color: var(--text-muted); cursor: pointer; transition: color 0.15s, background 0.15s, transform 0.2s ease; }
.sb-chevron.mini { width: 20px; height: 20px; }
.sb-chevron.disabled { color: var(--text-secondary); cursor: not-allowed; pointer-events: none; }`;

// --- CHEVRON ---
(() => {
  const DIRS = {
    down:  'arrow-down-s-line',
    up:    'arrow-up-s-line',
    left:  'arrow-left-s-line',
    right: 'arrow-right-s-line',
  };

  function mkChv(opts = {}) {
    const { dir = 'down', disabled = false, mini = false } = opts;
    let cls = 'sb-chevron';
    if (mini)     cls += ' mini';
    if (disabled) cls += ' disabled';
    const size = mini ? 'S' : 'L';
    return `<div class="${cls}">${sbIcon(DIRS[dir], size)}</div>`;
  }

  sbRegister({
    name: 'chevron',
    title: 'Chevron Button',
    description: 'Круглая иконочная кнопка для навигации и управления направлением. Размеры: 32px (Normal) и 24px (Mini). Четыре направления: Down, Up, Left, Right.',
    playground: {
      title: 'Chevron Playground',
      state: { dir: 'down', disabled: false, mini: false },
      controls(pg) {
        return pg.select('dir', [
          { value: 'down',  label: 'Down' },
          { value: 'up',    label: 'Up' },
          { value: 'left',  label: 'Left' },
          { value: 'right', label: 'Right' },
        ]) + `<div class="pg-toggles">${pg.toggle('disabled', 'Disable')}${pg.toggle('mini', 'Mini')}</div>`;
      },
      render(s) {
        return mkChv(s);
      },
      genCode(s) {
        let cls = 'sb-chevron';
        if (s.mini)     cls += ' mini';
        if (s.disabled) cls += ' disabled';
        const size = s.mini ? 'S' : 'L';
        const html = `<div class="${cls}">\n  <!-- ${DIRS[s.dir]} icon, size ${size} -->\n</div>`;
        return { html, css: COMP_CSS.chevron };
      },
    },
    sections: [
      {
        title: 'Normal — All Directions',
        preview: `<div class="sec-row gap-sm">
          ${mkChv({ dir: 'down' })}
          ${mkChv({ dir: 'up' })}
          ${mkChv({ dir: 'left' })}
          ${mkChv({ dir: 'right' })}
          ${mkChv({ dir: 'down', disabled: true })}
          ${mkChv({ dir: 'up',   disabled: true })}
          ${mkChv({ dir: 'left', disabled: true })}
          ${mkChv({ dir: 'right',disabled: true })}
        </div>`,
        html: `<!-- Down -->\n<div class="sb-chevron"><!-- arrow-down-s-line L --></div>\n\n<!-- Up -->\n<div class="sb-chevron"><!-- arrow-up-s-line L --></div>\n\n<!-- Disabled -->\n<div class="sb-chevron disabled"><!-- arrow-down-s-line L --></div>`,
        css: COMP_CSS.chevron,
      },
      {
        title: 'Mini — All Directions',
        preview: `<div class="sec-row gap-sm">
          ${mkChv({ dir: 'down',  mini: true })}
          ${mkChv({ dir: 'up',    mini: true })}
          ${mkChv({ dir: 'left',  mini: true })}
          ${mkChv({ dir: 'right', mini: true })}
          ${mkChv({ dir: 'down',  mini: true, disabled: true })}
          ${mkChv({ dir: 'up',    mini: true, disabled: true })}
          ${mkChv({ dir: 'left',  mini: true, disabled: true })}
          ${mkChv({ dir: 'right', mini: true, disabled: true })}
        </div>`,
        html: `<!-- Mini Down -->\n<div class="sb-chevron mini"><!-- arrow-down-s-line S --></div>\n\n<!-- Mini Disabled -->\n<div class="sb-chevron mini disabled"><!-- arrow-down-s-line S --></div>`,
        css: COMP_CSS.chevron,
      },
    ],
  });
})();
