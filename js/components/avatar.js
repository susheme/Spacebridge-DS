// ═══════════════════════════════════════════════════════════════════════════
//  AVATAR
//  CSS в css/components/avatar.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.avatar = `.sb-avatar { position: relative; display: inline-flex; flex-shrink: 0; }
.sb-avatar-circle {
  width: 32px; height: 32px; border-radius: var(--radius-100);
  background: var(--surface-2);
  /* outside white ring 1.5px + shadow */
  box-shadow: 0 0 0 1.5px var(--background), 0 -1px 4px 0 var(--background), 0 2px 8px 0 var(--shadow-sm);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0; color: var(--text-secondary);
}
.sb-avatar-circle:hover,
.sb-avatar[data-hover="true"] .sb-avatar-circle {
  /* white ring 1.5px + blue hover ring 2px outside */
  box-shadow: 0 0 0 1.5px var(--background), 0 0 0 3.5px var(--primary), 0 -1px 4px 0 var(--background), 0 2px 8px 0 var(--shadow-sm);
}
.sb-avatar .sb-status-dot.mini { position: absolute; bottom: 0; right: 0; pointer-events: none; }
.sb-avatar[data-badge="true"] .sb-status-dot.mini { bottom: auto; top: 0; }
.sb-avatar .sb-pin { position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); pointer-events: none; }
.sb-avatar-initials { font-size: var(--body-font-size-s); font-weight: var(--font-weight-bold); color: var(--text-secondary); }
.sb-avatar-photo { width: 100%; height: 100%; object-fit: cover; display: block; }`;

// --- AVATAR ---
function _avContent(type, initials) {
  if (type === 'initials') return `<span class="sb-avatar-initials">${initials || 'NS'}</span>`;
  if (type === 'image')    return `<img class="sb-avatar-photo" src="./astronaut.png" alt="">`;
  if (type === 'company')  return sbIcon('building-2-line', 'L');
  return sbIcon('user-line', 'L');
}
function mkAv(type, opts, initials) {
  const o = opts || {};
  return `<div class="sb-avatar"${o.hover ? ' data-hover="true"' : ''}${o.badge ? ' data-badge="true"' : ''}>`
    + `<div class="sb-avatar-circle">${_avContent(type, initials)}</div>`
    + (o.status ? '<span class="sb-status-dot mini online"></span>' : '')
    + (o.badge  ? '<span class="sb-pin">ADMIN ★</span>' : '')
    + `</div>`;
}
function avStateRow(type, initials) {
  const states = [
    { label: 'Default',   opts: {} },
    { label: 'Hover',     opts: { hover: true } },
    { label: '+Status',   opts: { status: true } },
    { label: 'H+Status',  opts: { hover: true, status: true } },
    { label: '+Badge',    opts: { badge: true } },
    { label: 'H+Badge',   opts: { hover: true, badge: true } },
    { label: 'B+Status',  opts: { badge: true, status: true } },
    { label: 'H+B+S',     opts: { hover: true, badge: true, status: true } },
  ];
  return `<div style="display:flex;gap: var(--gap-horiz-lg);padding-bottom: var(--pad-vert-24);flex-wrap:wrap">`
    + states.map(st =>
        `<div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s)">`
        + mkAv(type, st.opts, initials)
        + `<span class="sb-sub" style="color:var(--text-muted);white-space:nowrap">${st.label}</span>`
        + `</div>`
      ).join('')
    + `</div>`;
}

sbRegister({
  name: 'avatar',
  title: 'Avatar',
  description: 'Визуальное представление пользователя, организации или объекта. Поддерживает четыре типа содержимого и три состояния: hover, статус-индикатор, бейдж.',
  playground: {
    title: 'Avatar Playground',
    state: { type: 'user', hover: false, status: false, badge: false },
    controls(pg) {
      return pg.select('type', [
        { value: 'user',     label: 'User' },
        { value: 'initials', label: 'Initials' },
        { value: 'company',  label: 'Company' },
        { value: 'image',    label: 'Image' },
      ]) + `<div class="pg-toggles">${pg.toggle('hover','Hover')}${pg.toggle('status','Status')}${pg.toggle('badge','Badge')}</div>`;
    },
    render(s) {
      return `<div style="padding: var(--pad-vert-24) 0">${mkAv(s.type, s, 'NS')}</div>`;
    },
    genCode(s) {
      const initials = s.type === 'initials' ? '\n  <span class="sb-avatar-initials">NS</span>' : '';
      const icon     = s.type === 'user'    ? '\n  <!-- user-line icon -->' :
                       s.type === 'company' ? '\n  <!-- building-line icon -->' :
                       s.type === 'image'   ? '\n  <div class="sb-avatar-img-bg"></div>' : initials;
      const attrs    = [s.hover ? 'data-hover="true"' : '', s.badge ? 'data-badge="true"' : ''].filter(Boolean);
      const attrStr  = attrs.length ? ' ' + attrs.join(' ') : '';
      const lines    = [`<div class="sb-avatar"${attrStr}>`, `  <div class="sb-avatar-circle">${icon}`, `  </div>`];
      if (s.status) lines.push(`  <span class="sb-status-dot mini online"></span>`);
      if (s.badge)  lines.push(`  <span class="sb-pin">ADMIN ★</span>`);
      lines.push(`</div>`);
      return { html: lines.join('\n'), css: COMP_CSS.avatar };
    },
  },
  sections: [
    {
      title: 'Types',
      desc: 'Четыре типа аватаров: User (иконка пользователя), Initials (инициалы), Company (организация), Image (фото).',
      preview: `<div style="display:flex;gap: var(--gap-horiz-xl);align-items:flex-end">
        ${['user','initials','company','image'].map(t =>
          `<div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s)">`
          + mkAv(t, {}, 'NS')
          + `<span class="sb-body-s" style="color:var(--text-tertiary)">${t.charAt(0).toUpperCase()+t.slice(1)}</span>`
          + `</div>`
        ).join('')}
      </div>`,
      html: `<!-- User -->
<div class="sb-avatar">
  <div class="sb-avatar-circle">
    <!-- user-line icon (24px) -->
  </div>
</div>

<!-- Initials -->
<div class="sb-avatar">
  <div class="sb-avatar-circle">
    <span class="sb-avatar-initials">NS</span>
  </div>
</div>

<!-- Company -->
<div class="sb-avatar">
  <div class="sb-avatar-circle">
    <!-- building-line icon (24px) -->
  </div>
</div>

<!-- Image -->
<div class="sb-avatar">
  <div class="sb-avatar-circle">
    <div class="sb-avatar-img-bg"></div>
  </div>
</div>`,
      css: COMP_CSS.avatar,
    },
    {
      title: 'User — All States',
      desc: 'Все состояния: Default, Hover (синее кольцо), Status (зелёная точка), Badge (пилюля). При наличии Badge точка перемещается в верхний правый угол.',
      preview: avStateRow('user'),
      html: `<!-- Default -->
<div class="sb-avatar">
  <div class="sb-avatar-circle"><!-- icon --></div>
</div>

<!-- Hover -->
<div class="sb-avatar" data-hover="true">
  <div class="sb-avatar-circle"><!-- icon --></div>
</div>

<!-- Status -->
<div class="sb-avatar">
  <div class="sb-avatar-circle"><!-- icon --></div>
  <span class="sb-status-dot mini online"></span>
</div>

<!-- Badge -->
<div class="sb-avatar" data-badge="true">
  <div class="sb-avatar-circle"><!-- icon --></div>
  <span class="sb-pin">ADMIN ★</span>
</div>

<!-- Badge + Status -->
<div class="sb-avatar" data-badge="true">
  <div class="sb-avatar-circle"><!-- icon --></div>
  <span class="sb-status-dot mini online"></span>
  <span class="sb-pin">ADMIN ★</span>
</div>`,
      css: COMP_CSS.avatar,
    },
    {
      title: 'Initials — All States',
      desc: 'Тип Initials — инициалы пользователя. Те же состояния.',
      preview: avStateRow('initials', 'NS'),
      html: `<div class="sb-avatar">
  <div class="sb-avatar-circle">
    <span class="sb-avatar-initials">NS</span>
  </div>
</div>`,
      css: COMP_CSS.avatar,
    },
    {
      title: 'Company — All States',
      desc: 'Тип Company — иконка организации.',
      preview: avStateRow('company'),
      html: `<div class="sb-avatar">
  <div class="sb-avatar-circle">
    <!-- building-line icon -->
  </div>
</div>`,
      css: COMP_CSS.avatar,
    },
    {
      title: 'Image — All States',
      desc: 'Тип Image — фотография. Вставьте img внутрь .sb-avatar-circle; object-fit: cover обрезает по кругу.',
      preview: avStateRow('image'),
      html: `<div class="sb-avatar">
  <div class="sb-avatar-circle">
    <img class="sb-avatar-photo" src="./astronaut.png" alt="User">
  </div>
</div>`,
      css: COMP_CSS.avatar,
    },
  ],
});
