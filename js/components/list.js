// ═══════════════════════════════════════════════════════════════════════════
//  LIST
//  CSS в css/components/list.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.list = `.sb-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: var(--text-field-min-width);
  max-width: var(--text-field-max-width);
}
.sb-list-cell {
  display: flex;
  align-items: center;
  gap: var(--gap-vert-s);
  width: 100%;
  min-width: var(--text-field-min-width);
  max-width: var(--text-field-max-width);
  height: var(--list-min-height-cell);
  padding: var(--pad-horiz-8) var(--pad-vert-8);
  background: var(--surface-1);
}
.sb-list-cell.single { border-radius: var(--radius-8); }
.sb-list-cell.top    { border-radius: var(--radius-8) var(--radius-8) var(--radius-0) var(--radius-0); }
.sb-list-cell.inside { border-radius: var(--radius-0); }
.sb-list-cell.bottom { border-radius: var(--radius-0) var(--radius-0) var(--radius-8) var(--radius-8); }
.sb-list-cell-label {
  flex: 1;
  min-width: 0;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sb-profile-cell {
  display: flex;
  align-items: center;
  gap: var(--gap-vert-m);
  width: 100%;
  min-width: var(--list-cell-min-width-standard);
  height: var(--list-min-height-cell);
  padding: var(--pad-horiz-8) var(--pad-vert-8);
  background: var(--background);
  border-bottom: var(--border-width-1) solid var(--surface-2);
}
.sb-profile-cell-left {
  display: flex; align-items: center; gap: var(--gap-vert-s);
  flex: 1; min-width: 0;
}
.sb-profile-cell-text {
  display: flex; flex-direction: column;
  justify-content: center; align-items: flex-start;
  gap: var(--gap-horiz-xs);
  flex: 1; min-width: 0;
}
.sb-profile-cell-text .sb-title-s,
.sb-profile-cell-text .sb-sub {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
}
.sb-profile-cell-text .sb-title-s { color: var(--text-tertiary); }
.sb-profile-cell-text .sb-sub     { color: var(--text-secondary); }
.sb-profile-cell-right {
  display: flex; justify-content: flex-end; align-items: center;
  gap: var(--gap-vert-s); flex-shrink: 0;
  color: var(--border);
}
.sb-profile-cell:hover,
.sb-profile-cell.is-hover { background: var(--surface-1); }
.sb-profile-cell.is-disabled { cursor: not-allowed; pointer-events: none; }
.sb-profile-cell.is-disabled > * { opacity: 0.5; }
.sb-info-cell {
  position: relative;
  display: flex; align-items: center; gap: var(--gap-vert-m);
  width: 100%; min-width: var(--list-cell-min-width-standard);
  height: var(--list-min-height-cell);
  padding: var(--pad-horiz-4) var(--pad-vert-8);
  background: var(--background);
  cursor: pointer; user-select: none;
}
.sb-info-cell-text {
  display: flex; flex-direction: column;
  justify-content: center; align-items: flex-start;
  gap: var(--gap-horiz-xs); flex: 1; min-width: 0;
}
.sb-info-cell-title {
  color: var(--text-tertiary); width: 100%;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;
  overflow: hidden; text-overflow: ellipsis;
}
.sb-info-cell-sub { color: var(--text-secondary); }
.sb-info-cell:hover,
.sb-info-cell.is-hover { background: var(--surface-1); }
.sb-info-cell.is-selected {
  background: var(--primary-hover);
  border-bottom: var(--border-width-1) solid var(--primary-hover);
}
.sb-info-cell.is-disabled { cursor: not-allowed; pointer-events: none; }
.sb-info-cell.is-disabled > * { opacity: 0.5; }
.sb-info-cell.has-indicator { gap: var(--gap-vert-s); }
.sb-info-cell.has-mark .sb-mark {
  position: absolute;
  top: var(--border-width-1); bottom: var(--border-width-1); left: var(--gap-horiz-0);
  width: var(--border-width-2); height: auto;
}`;

// Single-select click handler for Info cells — removes is-selected from sibling
// cells in the same parent, sets it on the clicked cell.
window.sbSelectInfoCell = function(cell) {
  if (!cell) return;
  const parent = cell.parentElement;
  if (parent) {
    parent.querySelectorAll(':scope > .sb-info-cell.is-selected').forEach(c => {
      c.classList.remove('is-selected');
    });
  }
  cell.classList.add('is-selected');
};

// --- LIST ---
(() => {
  function mkToggle(opts = {}) {
    const { on, disabled } = opts;
    const wrapCls = 'sb-toggle-wrap' + (disabled ? ' is-disabled' : '');
    const checkedAttr = boolAttr('checked', on);
    const disabledAttr = boolAttr('disabled', disabled);
    return `<label class="${wrapCls}"><span class="sb-toggle"><input type="checkbox"${checkedAttr}${disabledAttr}><span class="sb-toggle-track"></span><span class="sb-toggle-thumb"></span></span></label>`;
  }

  function mkControlCell(pos, label, toggleOpts = {}) {
    return `<div class="sb-list-cell ${pos}">
      <span class="sb-list-cell-label sb-title-m">${label}</span>
      ${mkToggle(toggleOpts)}
    </div>`;
  }

  function mkInfoCell(opts = {}) {
    const {
      title = 'NMS: "Witness Terminal Name"',
      subtitle = '2025-03-01|08:12:21',
      state,       // undefined | 'hover' | 'selected' | 'disabled'
      indicator,   // { status: 'online'|'offline'|'error'|'warning'|'maintenance'|'connecting'|'info', pulse?: bool } | undefined
      mark,        // { status: 'success'|'error'|'warning'|'alert'|'info'|'neutral' } | undefined
    } = opts;
    const stateCls =
      state === 'hover'    ? ' is-hover'    :
      state === 'selected' ? ' is-selected' :
      state === 'disabled' ? ' is-disabled' : '';
    const modCls = (indicator ? ' has-indicator' : '') + (mark ? ' has-mark' : '');
    const indicatorEl = indicator
      ? `<span class="sb-status-dot ${indicator.status || 'online'}${indicator.pulse ? ' pulse' : ''}"></span>`
      : '';
    const markEl = mark
      ? `<span class="sb-mark ${mark.status || 'info'}"></span>`
      : '';
    return `<div class="sb-info-cell${modCls}${stateCls}" onclick="sbSelectInfoCell(this)">
      ${markEl}${indicatorEl}
      <div class="sb-info-cell-text">
        <span class="sb-title-s-regular sb-info-cell-title">${title}</span>
        <span class="sb-caption sb-info-cell-sub">${subtitle}</span>
      </div>
    </div>`;
  }

  function mkProfileCell(opts = {}) {
    const {
      avatarType = 'user',      // 'user' | 'image' | 'company' | 'initials'
      initials,
      title = 'Jean Dubois',
      subtitle,
      right = '',               // HTML for right side
      state,                    // undefined | 'hover' | 'disabled'
    } = opts;
    const avatar = mkAv(avatarType, {}, initials);
    const subEl = subtitle ? `<span class="sb-sub">${subtitle}</span>` : '';
    const stateCls = state === 'hover' ? ' is-hover' : state === 'disabled' ? ' is-disabled' : '';
    return `<div class="sb-profile-cell${stateCls}">
      <div class="sb-profile-cell-left">
        ${avatar}
        <div class="sb-profile-cell-text">
          <span class="sb-title-s">${title}</span>
          ${subEl}
        </div>
      </div>
      ${right ? `<div class="sb-profile-cell-right">${right}</div>` : ''}
    </div>`;
  }

  function mkControlList(cells) {
    const inner = cells.map((c, i) => {
      let pos;
      if (cells.length === 1)             pos = 'single';
      else if (i === 0)                   pos = 'top';
      else if (i === cells.length - 1)    pos = 'bottom';
      else                                pos = 'inside';
      return mkControlCell(pos, c.label, { on: c.on, disabled: c.disabled });
    }).join('');
    return `<div class="sb-list">${inner}</div>`;
  }

  function mkCellWithTypeTag(pos, typeLabel, cellLabel, toggleOpts) {
    return `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-xs);width:100%;max-width:360px">
      <span class="sb-caption" style="color:var(--text-tertiary)">${typeLabel}</span>
      ${mkControlCell(pos, cellLabel, toggleOpts)}
    </div>`;
  }

  function buildProfileRight(type) {
    if (type === 'icon')   return sbIcon('arrow-right-s-line', 'L');
    if (type === 'icons2') return sbIcon('mail-line', 'L') + sbIcon('phone-line', 'L');
    if (type === 'button') return `<button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm">${sbIcon('add-line', 'S')}</button>`;
    return '';
  }

  const PROFILE_PEOPLE = [
    { avatarType: 'image',    title: 'Jean Dubois',    subtitle: 'Administrator' },
    { avatarType: 'initials', initials: 'AM', title: 'Anna Müller', subtitle: 'Network Engineer' },
    { avatarType: 'company',  title: 'Spacebridge HQ', subtitle: 'Paris, France' },
    { avatarType: 'user',     title: 'Unnamed User' },
  ];

  function mkProfileList(rightType) {
    return PROFILE_PEOPLE.map(p => mkProfileCell({
      ...p, right: buildProfileRight(rightType),
    })).join('');
  }

  sbRegister({
    name: 'list',
    title: 'List',
    description: 'Списки из ячеек 40px высотой. Standard List — ячейки с контентом на фоне --background. Profile Cell — с аватаром, hairline-разделители. Info Cell — для уведомлений/алармов, без разделителей, поддерживает Selected-состояние. Control List — ячейки с title + toggle на фоне --surface-1, 4 варианта по позиции.',
    playground: {
      title: 'Standard List Cell Playground',
      state: {
        cellType: 'profile',
        // Profile-specific
        avatarType: 'image',
        rightContent: 'icon',
        showSubtitle: true,
        // Info-specific
        infoSubtype: 'default',          // 'default' | 'indicator' | 'mark'
        indicatorStatus: 'online',
        indicatorPulse: false,
        markStatus: 'error',
        // Shared state
        cellState: 'default',
      },
      controls(pg) {
        return pg.select('cellType', [
          { value: 'profile', label: 'Profile' },
          { value: 'info',    label: 'Info' },
        ])
        + `<div data-pg-cell-type="profile">`
          + pg.select('avatarType', [
              { value: 'user',     label: 'User' },
              { value: 'initials', label: 'Initials' },
              { value: 'company',  label: 'Company' },
              { value: 'image',    label: 'Image' },
            ])
          + pg.select('rightContent', [
              { value: 'none',   label: 'None' },
              { value: 'icon',   label: '1 Icon' },
              { value: 'icons2', label: '2 Icons' },
              { value: 'button', label: 'Icon Button' },
            ])
          + `<div class="pg-toggles">${pg.toggle('showSubtitle', 'Subtitle')}</div>`
        + `</div>`
        + `<div data-pg-cell-type="info">`
          + pg.select('infoSubtype', [
              { value: 'default',   label: 'Default' },
              { value: 'indicator', label: 'Status Indicator' },
              { value: 'mark',      label: 'Status Mark' },
            ])
          + `<div data-pg-info-subtype="indicator">`
            + pg.select('indicatorStatus', [
                { value: 'online',      label: 'Online (green)' },
                { value: 'error',       label: 'Error (red)' },
                { value: 'warning',     label: 'Warning (yellow)' },
                { value: 'maintenance', label: 'Maintenance (orange)' },
                { value: 'info',        label: 'Info (blue)' },
                { value: 'connecting',  label: 'Connecting (primary)' },
                { value: 'offline',     label: 'Offline (gray)' },
              ])
            + `<div class="pg-toggles">${pg.toggle('indicatorPulse', 'Pulse')}</div>`
          + `</div>`
          + `<div data-pg-info-subtype="mark">`
            + pg.select('markStatus', [
                { value: 'success', label: 'Success (green)' },
                { value: 'error',   label: 'Error (red)' },
                { value: 'warning', label: 'Warning (yellow)' },
                { value: 'alert',   label: 'Alert (orange)' },
                { value: 'info',    label: 'Info (blue)' },
                { value: 'neutral', label: 'Neutral (gray)' },
              ])
          + `</div>`
        + `</div>`
        + pg.select('cellState', [
            { value: 'default',  label: 'Default' },
            { value: 'hover',    label: 'Hover' },
            { value: 'selected', label: 'Selected (Info only)' },
            { value: 'disabled', label: 'Disabled' },
          ]);
      },
      syncControls(s, container) {
        container.querySelectorAll('[data-pg-cell-type]').forEach(wrap => {
          // display: contents makes wrapper transparent to flex — children flow as direct
          // children of .pg-controls, inheriting its column gap.
          wrap.style.display = wrap.getAttribute('data-pg-cell-type') === s.cellType ? 'contents' : 'none';
        });
        container.querySelectorAll('[data-pg-info-subtype]').forEach(wrap => {
          wrap.style.display = wrap.getAttribute('data-pg-info-subtype') === s.infoSubtype ? 'contents' : 'none';
        });
      },
      render(s) {
        if (s.cellType === 'info') {
          const indicator = s.infoSubtype === 'indicator'
            ? { status: s.indicatorStatus, pulse: s.indicatorPulse }
            : undefined;
          const mark = s.infoSubtype === 'mark'
            ? { status: s.markStatus }
            : undefined;
          return `<div style="width:100%;max-width:360px">${mkInfoCell({
            state: s.cellState === 'default' ? undefined : s.cellState,
            indicator,
            mark,
          })}</div>`;
        }
        // Profile — 'selected' is not applicable; treat as default
        const profileState = (s.cellState === 'default' || s.cellState === 'selected') ? undefined : s.cellState;
        return `<div style="width:100%;max-width:360px">${mkProfileCell({
          avatarType: s.avatarType,
          initials: s.avatarType === 'initials' ? 'AM' : undefined,
          title: s.avatarType === 'company' ? 'Spacebridge HQ' : 'Jean Dubois',
          subtitle: s.showSubtitle
            ? (s.avatarType === 'company' ? 'Paris, France' : 'Administrator')
            : undefined,
          right: buildProfileRight(s.rightContent),
          state: profileState,
        })}</div>`;
      },
      genCode(s) {
        if (s.cellType === 'info') {
          const stateCls =
            s.cellState === 'hover'    ? ' is-hover'    :
            s.cellState === 'selected' ? ' is-selected' :
            s.cellState === 'disabled' ? ' is-disabled' : '';
          const hasInd  = s.infoSubtype === 'indicator';
          const hasMark = s.infoSubtype === 'mark';
          const modCls = (hasInd ? ' has-indicator' : '') + (hasMark ? ' has-mark' : '');
          const dotLine = hasInd
            ? `\n  <span class="sb-status-dot ${s.indicatorStatus}${s.indicatorPulse ? ' pulse' : ''}"></span>`
            : '';
          const markLine = hasMark
            ? `\n  <span class="sb-mark ${s.markStatus}"></span>`
            : '';
          const html = `<div class="sb-info-cell${modCls}${stateCls}">${markLine}${dotLine}
  <div class="sb-info-cell-text">
    <span class="sb-title-s-regular sb-info-cell-title">NMS: "Witness Terminal Name"</span>
    <span class="sb-caption sb-info-cell-sub">2025-03-01|08:12:21</span>
  </div>
</div>`;
          const css = (hasInd || hasMark)
            ? COMP_CSS.list + '\n' + COMP_CSS.status
            : COMP_CSS.list;
          return { html, css };
        }
        // Profile
        const isInitials = s.avatarType === 'initials';
        const isImage    = s.avatarType === 'image';
        const isCompany  = s.avatarType === 'company';
        const avatarInner =
          isInitials ? '<span class="sb-avatar-initials">AM</span>' :
          isImage    ? '<img class="sb-avatar-photo" src="./astronaut.png" alt="">' :
          isCompany  ? '<!-- building-2-line icon -->' :
                       '<!-- user-line icon -->';
        const title    = isCompany ? 'Spacebridge HQ' : 'Jean Dubois';
        const subtitle = isCompany ? 'Paris, France' : 'Administrator';
        const subLine  = s.showSubtitle ? `\n      <span class="sb-sub">${subtitle}</span>` : '';
        const rightComment =
          s.rightContent === 'icon'   ? '<!-- arrow-right-s-line -->' :
          s.rightContent === 'icons2' ? '<!-- mail-line --> <!-- phone-line -->' :
          s.rightContent === 'button' ? '<button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm"><!-- add-line S --></button>' :
                                        '';
        const rightBlock = rightComment
          ? `\n  <div class="sb-profile-cell-right">\n    ${rightComment}\n  </div>`
          : '';
        const profileStateCls =
          s.cellState === 'hover'    ? ' is-hover' :
          s.cellState === 'disabled' ? ' is-disabled' : '';
        const html = `<div class="sb-profile-cell${profileStateCls}">
  <div class="sb-profile-cell-left">
    <div class="sb-avatar"><div class="sb-avatar-circle">${avatarInner}</div></div>
    <div class="sb-profile-cell-text">
      <span class="sb-title-s">${title}</span>${subLine}
    </div>
  </div>${rightBlock}
</div>`;
        const css = COMP_CSS.list + '\n' + COMP_CSS.avatar
          + (s.rightContent === 'button' ? '\n' + COMP_CSS.buttons : '');
        return { html, css };
      },
    },
    sections: [
      {
        title: 'Standard List — Profile Cell',
        desc: 'Ячейка для списков профилей (люди/организации). Содержит аватар 32×32, title + опциональный subtitle слева, 1–2 иконки или small secondary icon button справа. Разделяются hairline-линией (border-bottom 1px --surface-2). Поддерживает состояния hover (фон --surface-1) и disabled (контент opacity 0.5). Ниже — три списка по 4 ячейки с разным правым контентом.',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-xl);width:100%;max-width:360px">
          <div style="display:flex;flex-direction:column;gap:var(--gap-vert-xs)">
            <span class="sb-caption" style="color:var(--text-tertiary)">1 Icon</span>
            <div>${mkProfileList('icon')}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--gap-vert-xs)">
            <span class="sb-caption" style="color:var(--text-tertiary)">2 Icons</span>
            <div>${mkProfileList('icons2')}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--gap-vert-xs)">
            <span class="sb-caption" style="color:var(--text-tertiary)">Icon Button</span>
            <div>${mkProfileList('button')}</div>
          </div>
        </div>`,
        html: `<!-- Profile cell: image avatar + title + subtitle + icon -->
<div class="sb-profile-cell">
  <div class="sb-profile-cell-left">
    <div class="sb-avatar"><div class="sb-avatar-circle"><img class="sb-avatar-photo" src="./astronaut.png" alt=""></div></div>
    <div class="sb-profile-cell-text">
      <span class="sb-title-s">Jean Dubois</span>
      <span class="sb-sub">Administrator</span>
    </div>
  </div>
  <div class="sb-profile-cell-right">
    <!-- arrow-right-s-line icon -->
  </div>
</div>

<!-- With 2 icons -->
<div class="sb-profile-cell">
  <div class="sb-profile-cell-left"> ... </div>
  <div class="sb-profile-cell-right">
    <!-- mail-line --> <!-- phone-line -->
  </div>
</div>

<!-- With small secondary icon button -->
<div class="sb-profile-cell">
  <div class="sb-profile-cell-left"> ... </div>
  <div class="sb-profile-cell-right">
    <button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm">
      <!-- add-line S -->
    </button>
  </div>
</div>

<!-- Without subtitle -->
<div class="sb-profile-cell">
  <div class="sb-profile-cell-left">
    <div class="sb-avatar">...</div>
    <div class="sb-profile-cell-text">
      <span class="sb-title-s">Unnamed User</span>
    </div>
  </div>
  <div class="sb-profile-cell-right"> ... </div>
</div>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.avatar + '\n' + COMP_CSS.buttons,
      },
      {
        title: 'Standard List — Info Cell (Default)',
        desc: 'Ячейка для списков уведомлений / событий / алармов. Содержит Title (Title S - Regular) и Caption (дата/время) под ним. Без hairline-разделителей. Состояния: Default, Hover, Selected (подсвечен --primary-hover), Disabled (opacity 0.5).',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-lg);width:100%;max-width:360px">
          ${['default', 'hover', 'selected', 'disabled'].map(st => `
            <div style="display:flex;flex-direction:column;gap:var(--gap-vert-xs)">
              <span class="sb-caption" style="color:var(--text-tertiary)">${st[0].toUpperCase() + st.slice(1)}</span>
              ${mkInfoCell({ state: st === 'default' ? undefined : st })}
            </div>
          `).join('')}
        </div>`,
        html: `<!-- Default -->
<div class="sb-info-cell">
  <div class="sb-info-cell-text">
    <span class="sb-title-s-regular sb-info-cell-title">NMS: "Witness Terminal Name"</span>
    <span class="sb-caption sb-info-cell-sub">2025-03-01|08:12:21</span>
  </div>
</div>

<!-- Hover -->
<div class="sb-info-cell is-hover"> ... </div>

<!-- Selected -->
<div class="sb-info-cell is-selected"> ... </div>

<!-- Disabled -->
<div class="sb-info-cell is-disabled"> ... </div>`,
        css: COMP_CSS.list,
      },
      {
        title: 'Standard List — Info Cell (Status Indicator)',
        desc: 'Info Cell с модификатором .has-indicator — добавляется точка статуса слева (.sb-status-dot). Поддерживает все цвета из status: online/offline/error/warning/maintenance/connecting/info. Опционально — анимация .pulse. Gap сужается до 8px. Кликни по любой ячейке — выберется через .is-selected.',
        preview: `<div style="width:100%;max-width:360px">
          ${mkInfoCell({ indicator: { status: 'online',      pulse: true } })}
          ${mkInfoCell({ indicator: { status: 'error',       pulse: true } })}
          ${mkInfoCell({ indicator: { status: 'warning' } })}
          ${mkInfoCell({ indicator: { status: 'maintenance' } })}
          ${mkInfoCell({ indicator: { status: 'info' } })}
          ${mkInfoCell({ indicator: { status: 'connecting' } })}
          ${mkInfoCell({ indicator: { status: 'online' } })}
          ${mkInfoCell({ indicator: { status: 'offline' } })}
        </div>`,
        html: `<!-- Default -->
<div class="sb-info-cell has-indicator">
  <span class="sb-status-dot online"></span>
  <div class="sb-info-cell-text">
    <span class="sb-title-s-regular sb-info-cell-title">NMS: "Witness Terminal Name"</span>
    <span class="sb-caption sb-info-cell-sub">2025-03-01|08:12:21</span>
  </div>
</div>

<!-- With pulse animation -->
<div class="sb-info-cell has-indicator">
  <span class="sb-status-dot online pulse"></span>
  ...
</div>

<!-- Other statuses -->
<span class="sb-status-dot error"></span>
<span class="sb-status-dot warning"></span>
<span class="sb-status-dot maintenance"></span>
<span class="sb-status-dot info"></span>
<span class="sb-status-dot connecting"></span>
<span class="sb-status-dot offline"></span>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.status,
      },
      {
        title: 'Standard List — Info Cell (Status Mark)',
        desc: 'Info Cell с модификатором .has-mark — 2×38px вертикальная цветная полоска прижата к левому краю (absolute, inset 1px top/bottom). Цвета из готового .sb-mark: success/error/warning/alert/info/neutral. Gap остаётся 16px (полоска не в потоке flex).',
        preview: `<div style="width:100%;max-width:360px">
          ${mkInfoCell({ mark: { status: 'error' } })}
          ${mkInfoCell({ mark: { status: 'warning' } })}
          ${mkInfoCell({ mark: { status: 'alert' } })}
          ${mkInfoCell({ mark: { status: 'success' } })}
          ${mkInfoCell({ mark: { status: 'info' } })}
          ${mkInfoCell({ mark: { status: 'success' } })}
          ${mkInfoCell({ mark: { status: 'neutral' } })}
          ${mkInfoCell({ mark: { status: 'info' } })}
        </div>`,
        html: `<div class="sb-info-cell has-mark">
  <span class="sb-mark error"></span>
  <div class="sb-info-cell-text">
    <span class="sb-title-s-regular sb-info-cell-title">NMS: "Witness Terminal Name"</span>
    <span class="sb-caption sb-info-cell-sub">2025-03-01|08:12:21</span>
  </div>
</div>

<!-- Other mark colors -->
<span class="sb-mark warning"></span>
<span class="sb-mark alert"></span>
<span class="sb-mark success"></span>
<span class="sb-mark info"></span>
<span class="sb-mark neutral"></span>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.status,
      },
      {
        title: 'Control List',
        desc: 'Объединяй до 5 ячеек в списке. Если контролов больше — выноси их в отдельные блоки (например, Single-ячейка сверху для самого важного, остальные в списке ниже).',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-lg);width:100%;max-width:360px">
          ${mkControlList([
            { label: 'DC Power', on: false },
          ])}
          ${mkControlList([
            { label: 'DC Power',                 on: false },
            { label: 'Low Power Mode',           on: true },
            { label: 'RL RF Spectral Inversion', on: true },
            { label: 'ODU Present Flag',         on: true },
            { label: 'BUC 10 MHz Reference',     on: true },
          ])}
        </div>`,
        html: `<!-- Standalone single cell -->
<div class="sb-list">
  <div class="sb-list-cell single">
    <span class="sb-list-cell-label sb-title-m">DC Power</span>
    <label class="sb-toggle-wrap"> ... toggle ... </label>
  </div>
</div>

<!-- 5-cell list -->
<div class="sb-list">
  <div class="sb-list-cell top">    ... DC Power + toggle ... </div>
  <div class="sb-list-cell inside"> ... Low Power Mode + toggle ON ... </div>
  <div class="sb-list-cell inside"> ... RL RF Spectral Inversion + toggle ON ... </div>
  <div class="sb-list-cell inside"> ... ODU Present Flag + toggle ON ... </div>
  <div class="sb-list-cell bottom"> ... BUC 10 MHz Reference + toggle ON ... </div>
</div>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.toggles,
      },
      {
        title: 'Control List — Cell Types',
        desc: 'Single — одиночная или самостоятельная ячейка. Top/Bottom замыкают список сверху/снизу. Inside — в середине списка, не может быть первой или последней.',
        preview: `<div style="display:flex;flex-direction:column;gap:var(--gap-vert-lg);width:100%;max-width:360px">
          ${mkCellWithTypeTag('single', 'Single', 'DC Power', { on: false })}
          ${mkCellWithTypeTag('top',    'Top',    'Low Power Mode', { on: true })}
          ${mkCellWithTypeTag('inside', 'Inside List', 'RL RF Spectral Inversion', { on: true })}
          ${mkCellWithTypeTag('bottom', 'Bottom', 'ODU Present Flag', { on: true })}
        </div>`,
        html: `<!-- Single -->
<div class="sb-list-cell single">
  <span class="sb-list-cell-label sb-title-m">DC Power</span>
  <label class="sb-toggle-wrap">
    <span class="sb-toggle">
      <input type="checkbox">
      <span class="sb-toggle-track"></span>
      <span class="sb-toggle-thumb"></span>
    </span>
  </label>
</div>

<!-- Top -->
<div class="sb-list-cell top"> ... </div>

<!-- Inside List -->
<div class="sb-list-cell inside"> ... </div>

<!-- Bottom -->
<div class="sb-list-cell bottom"> ... </div>`,
        css: COMP_CSS.list + '\n' + COMP_CSS.toggles,
      },
    ],
  });
})();
