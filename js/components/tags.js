// ═══════════════════════════════════════════════════════════════════════════
//  TAGS
//  CSS в css/components/tags.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.tags = `.sb-tag { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; height: var(--btn-tag-max-height); min-width: var(--status-text-min-width); font-size: var(--body-font-size-m); font-weight: var(--font-weight-bold); line-height: var(--button-line-height); font-family: inherit; white-space: nowrap; cursor: default; }
.sb-tag.input-mode { padding: var(--pad-vert-2) var(--pad-horiz-4); gap: 0; border-radius: var(--radius-16); background: var(--background); }
.sb-tag-placeholder { color: var(--border); }
.sb-tag.input-mode .sb-tag-label { color: var(--text-tertiary); }
.sb-tag.input-mode.critical .sb-tag-label { color: var(--error); }
.sb-tag-caret { display: inline-block; flex-shrink: 0; width: 1.5px; height: 16px; background: var(--primary); border-radius: var(--radius-1); }
.sb-tag.filled { padding: var(--pad-vert-2) var(--pad-horiz-8); gap: var(--gap-horiz-xs); border-radius: var(--radius-100); background: var(--primary); color: var(--background); }
.sb-tag.filled.removable { padding-right: 0; }
.sb-tag-remove { width: 24px; height: 24px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: var(--background); padding: var(--pad-horiz-2); }
.sb-tag.filled.tc-success { background: var(--success); }
.sb-tag.filled.tc-error { background: var(--error); }
.sb-tag.filled.tc-warning { background: var(--warning); color: var(--text-primary); }
.sb-tag.filled.tc-alert { background: var(--alert); }
.sb-tag.more { padding: var(--pad-vert-2) var(--pad-horiz-8); gap: var(--gap-horiz-xs); border-radius: var(--radius-100); background: var(--primary-hover); color: var(--primary); }
.sb-tag-group { display: flex; flex-wrap: wrap; align-items: center; gap: var(--gap-horiz-xs); }
.sb-tag-input-wrap { display: flex; flex-wrap: wrap; align-items: center; gap: var(--gap-horiz-xs); padding: var(--pad-vert-8) 0; min-height: var(--status-text-max-height); cursor: text; border-bottom: var(--border-width-1-5) solid var(--border); background: transparent; transition: border-color 0.15s; }
.sb-tag-input-wrap:focus-within { border-bottom-color: var(--primary); }
.sb-tag-input-field { border: none; outline: none; background: transparent; flex: 1; font-size: var(--body-font-size-m); font-weight: var(--font-weight-bold); font-family: inherit; color: var(--text-tertiary); min-width: 80px; height: 20px; }
.sb-tag-input-field::placeholder { color: var(--border); font-weight: var(--font-weight-regular); }`;

// --- TAGS ---
(() => {
  const CLOSE_ICON = sbIconRaw('close-circle-fill', 20);

  // Expose for dynamic tag creation in playground
  window._sbTagClose = CLOSE_ICON;

  window.sbTagCreate = function(input, color) {
    const val = input.value.trim();
    if (!val) return;
    const wrap = input.closest('.sb-tag-input-wrap');
    const tag = document.createElement('div');
    tag.className = 'sb-tag filled removable' + (color ? ' tc-' + color : '');
    tag.innerHTML = `<span class="sb-tag-label">${val}</span><button class="sb-tag-remove" title="Remove" onclick="sbTagRemove(this)">${window._sbTagClose}</button>`;
    wrap.insertBefore(tag, input);
    input.value = '';
  };

  window.sbTagRemove = function(btn) {
    btn.closest('.sb-tag').remove();
  };

  function mkTag(opts = {}) {
    const { mode = 'filled', text = 'Name', critical = false, removable = false, color = '' } = opts;
    if (mode === 'placeholder') {
      return `<div class="sb-tag input-mode">
        <span class="sb-tag-caret"></span>
        <span class="sb-tag-placeholder">Tag</span>
      </div>`;
    }
    if (mode === 'typing') {
      return `<div class="sb-tag input-mode${critical ? ' critical' : ''}">
        <span class="sb-tag-label">${text}</span>
        <span class="sb-tag-caret"></span>
      </div>`;
    }
    if (mode === 'more') {
      return `<div class="sb-tag more">${text}</div>`;
    }
    const colorCls = color ? ` tc-${color}` : '';
    return `<div class="sb-tag filled${removable ? ' removable' : ''}${colorCls}">
      <span class="sb-tag-label">${text}</span>
      ${removable ? `<button class="sb-tag-remove" title="Remove" onclick="sbTagRemove(this)">${CLOSE_ICON}</button>` : ''}
    </div>`;
  }

  function mkTagInputWrap(tags = [], color = '') {
    const tagHtml = tags.map(t => mkTag({ mode: 'filled', text: t, removable: true, color })).join('');
    const colorArg = color ? `'${color}'` : "''";
    return `<div class="sb-tag-input-wrap sec-wide" onclick="this.querySelector('.sb-tag-input-field').focus()">
      ${tagHtml}
      <input class="sb-tag-input-field" placeholder="Add tag..."
        onkeydown="if(event.key==='Enter'){sbTagCreate(this,${colorArg});event.preventDefault()}"
        onblur="sbTagCreate(this,${colorArg})">
    </div>`;
  }

  sbRegister({
    name: 'tags',
    title: 'Tags',
    description: 'Теги для маркировки и фильтрации. Режимы: Input (Placeholder → Typing → Critical) и Display (Default, Removable, Show More). Используй .sb-tag-group для групп тегов.',
    playground: {
      title: 'Tag Playground',
      wide: true,
      state: { colorful: false },
      controls(pg) {
        return pg.toggle('colorful', 'Colorful');
      },
      render(s) {
        if (s.colorful) {
          const group = (title, tags, variant) => `
            <div class="sec-col gap-xs">
              <span class="sb-caption" style="color:var(--text-muted)">${title}</span>
              ${mkTagInputWrap(tags, variant)}
            </div>`;
          return `<div class="sec-col wide">
            ${group('Online', ['Ka-Band', 'Active'], 'success')}
            ${group('Offline / Error', ['Region-3', 'Offline'], 'error')}
            ${group('Maintenance', ['Scheduled'], 'warning')}
          </div>`;
        }
        return mkTagInputWrap(['Ka-Band', 'Active', 'Region-3']);
      },
      genCode() {
        return {
          html: `<div class="sb-tag-input-wrap">\n  <div class="sb-tag filled removable">\n    <span class="sb-tag-label">Ka-Band</span>\n    <button class="sb-tag-remove" onclick="sbTagRemove(this)"><!-- close icon --></button>\n  </div>\n  <input class="sb-tag-input-field" placeholder="Add tag..."\n    onkeydown="if(event.key==='Enter'){sbTagCreate(this);event.preventDefault()}"\n    onblur="sbTagCreate(this)">\n</div>`,
          css: COMP_CSS.tags,
        };
      },
    },
    sections: [
      {
        title: 'Creating Flow',
        desc: 'Шаги создания тега: Placeholder (курсор слева), Typing (текст + курсор справа), Critical (ошибка в имени).',
        preview: `<div class="sec-row spread">
          ${mkTag({ mode: 'placeholder' })}
          ${mkTag({ mode: 'typing', text: 'Name' })}
          ${mkTag({ mode: 'typing', text: 'Wrong name', critical: true })}
        </div>`,
        html: `<!-- Placeholder -->\n<div class="sb-tag input-mode">\n  <span class="sb-tag-caret"></span>\n  <span class="sb-tag-placeholder">Tag</span>\n</div>\n\n<!-- Typing -->\n<div class="sb-tag input-mode">\n  <span class="sb-tag-label">Name</span>\n  <span class="sb-tag-caret"></span>\n</div>\n\n<!-- Critical -->\n<div class="sb-tag input-mode critical">\n  <span class="sb-tag-label">Wrong name</span>\n  <span class="sb-tag-caret"></span>\n</div>`,
        css: COMP_CSS.tags,
      },
      {
        title: 'Display Tags',
        desc: 'Default (без удаления) и Removable (с кнопкой ×). Нажатие × удаляет тег.',
        preview: `<div class="sec-row spread">
          ${mkTag({ mode: 'filled', text: 'Ka-Band' })}
          ${mkTag({ mode: 'filled', text: 'Active' })}
          ${mkTag({ mode: 'filled', text: 'Region-3' })}
          ${mkTag({ mode: 'filled', text: 'Ka-Band', removable: true })}
          ${mkTag({ mode: 'filled', text: 'Active', removable: true })}
        </div>`,
        html: `<!-- Default -->\n<div class="sb-tag filled">\n  <span class="sb-tag-label">Ka-Band</span>\n</div>\n\n<!-- Removable -->\n<div class="sb-tag filled removable">\n  <span class="sb-tag-label">Ka-Band</span>\n  <button class="sb-tag-remove" title="Remove"><!-- close icon --></button>\n</div>`,
        css: COMP_CSS.tags,
      },
      {
        title: 'Show More',
        desc: 'Показывается когда теги не помещаются в строку. Число = количество скрытых тегов.',
        preview: `<div class="sec-row gap-sm">
          ${mkTag({ mode: 'filled', text: 'Ka-Band', removable: true })}
          ${mkTag({ mode: 'filled', text: 'Active', removable: true })}
          ${mkTag({ mode: 'more', text: '+3' })}
        </div>`,
        html: `<div class="sb-tag more">+3</div>`,
        css: COMP_CSS.tags,
      },
      {
        title: 'Color Variants',
        desc: 'Теги с цветовой семантикой. Добавь класс tc-success / tc-error / tc-warning / tc-alert / tc-neutral к .sb-tag.filled.',
        preview: `<div style="display:flex;flex-direction:column;gap: var(--gap-horiz-s)">
          <div class="sec-row wrap gap-xs">
            ${mkTag({ mode: 'filled', text: 'Online', color: 'success' })}
            ${mkTag({ mode: 'filled', text: 'Active', color: 'success', removable: true })}
          </div>
          <div class="sec-row wrap gap-xs">
            ${mkTag({ mode: 'filled', text: 'Offline', color: 'error' })}
            ${mkTag({ mode: 'filled', text: 'Region-3', color: 'error', removable: true })}
          </div>
          <div class="sec-row wrap gap-xs">
            ${mkTag({ mode: 'filled', text: 'Warning', color: 'warning' })}
            ${mkTag({ mode: 'filled', text: 'Degraded', color: 'warning', removable: true })}
          </div>
          <div class="sec-row wrap gap-xs">
            ${mkTag({ mode: 'filled', text: 'Alert', color: 'alert' })}
            ${mkTag({ mode: 'filled', text: 'Ka-Band', color: 'alert', removable: true })}
          </div>
        </div>`,
        html: `<div class="sb-tag filled tc-success"><span class="sb-tag-label">Online</span></div>\n<div class="sb-tag filled tc-error"><span class="sb-tag-label">Offline</span></div>\n<div class="sb-tag filled tc-warning"><span class="sb-tag-label">Warning</span></div>\n<div class="sb-tag filled tc-alert"><span class="sb-tag-label">Alert</span></div>`,
        css: COMP_CSS.tags,
      },
      {
        title: 'Tag Group',
        desc: 'Несколько тегов с переносом. Используй .sb-tag-group как обёртку.',
        preview: `<div class="sb-tag-group" style="max-width:400px">
          ${mkTag({ mode: 'filled', text: 'SB-Terminal-001', removable: true })}
          ${mkTag({ mode: 'filled', text: 'Ka-Band', removable: true })}
          ${mkTag({ mode: 'filled', text: 'Active', removable: true })}
          ${mkTag({ mode: 'filled', text: 'Region-3', removable: true })}
          ${mkTag({ mode: 'filled', text: 'Online', removable: true })}
          ${mkTag({ mode: 'more', text: '+2' })}
        </div>`,
        html: `<div class="sb-tag-group">\n  <div class="sb-tag filled removable">\n    <span class="sb-tag-label">Ka-Band</span>\n    <button class="sb-tag-remove"><!-- close icon --></button>\n  </div>\n  <div class="sb-tag more">+2</div>\n</div>`,
        css: COMP_CSS.tags,
      },
    ],
  });
})();
