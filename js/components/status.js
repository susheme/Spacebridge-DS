// ═══════════════════════════════════════════════════════════════════════════
//  STATUS
//  CSS в css/components/status.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.status = {
  indicator: `.sb-status { display: inline-flex; align-items: center; gap: var(--gap-horiz-s); font-size: var(--body-font-size-s); font-weight: var(--font-weight-medium); }
.sb-status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; display: inline-block; }
.sb-status-dot.online      { background: var(--success); box-shadow: 0 0 6px var(--success); }
.sb-status-dot.connecting  { background: var(--primary); }
.sb-status-dot.info        { background: var(--info); }
.sb-status-dot.warning     { background: var(--warning); }
.sb-status-dot.maintenance { background: var(--alert); }
.sb-status-dot.error       { background: var(--error); box-shadow: 0 0 6px var(--error); }
.sb-status-dot.offline     { background: var(--text-secondary); }`,
  pulse: `.sb-status-dot.pulse { animation: sb-dot-pulse 1.8s ease-in-out infinite; }
@keyframes sb-dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.35; transform: scale(0.75); }
}`,
  mini: `.sb-status-dot.mini { width: 6px; height: 6px; border: var(--border-width-2) solid var(--background); box-sizing: content-box; box-shadow: none !important; }
.sb-icon-badge-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: var(--background); border-radius: var(--radius-6); color: var(--text-tertiary); }
.sb-icon-badge-wrap .sb-status-dot.mini { position: absolute; top: 4px; right: 4px; }`,
  badgeStatus: `.sb-badge-status { display: inline-flex; align-items: center; justify-content: center; height: var(--status-text-max-height); padding: 0 var(--pad-horiz-16); border-radius: var(--radius-8); gap: var(--gap-horiz-s); font-size: var(--body-font-size-m); font-weight: var(--font-weight-semibold); line-height: 1; white-space: nowrap; }
.sb-badge-status.bs-grey   { background: var(--shadow-overlay);  color: var(--text-secondary); }
.sb-badge-status.bs-green  { background: var(--success-hover);  color: var(--success); }
.sb-badge-status.bs-blue   { background: var(--primary-hover);     color: var(--info); }
.sb-badge-status.bs-red    { background: var(--error-hover);    color: var(--error); }
.sb-badge-status.bs-orange { background: var(--alert-hover);    color: var(--alert); }
.sb-badge-status.bs-yellow { background: var(--warning-hover);  color: var(--warning); }`,
  badgeStatusMini: `.sb-badge-status.mini { height: var(--status-text-mini-max-height); padding: 0 var(--pad-horiz-8); border-radius: var(--radius-6); font-size: var(--body-font-size-s); }`,
  antenna: `.sb-antenna-icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }`,
  mark: `.sb-mark { display: inline-block; width: 3px; height: var(--status-text-max-height); border-radius: var(--radius-2); flex-shrink: 0; }
.sb-mark.success { background: var(--success); }
.sb-mark.error   { background: var(--error); }
.sb-mark.warning { background: var(--warning); }
.sb-mark.alert   { background: var(--alert); }
.sb-mark.info    { background: var(--info); }
.sb-mark.neutral { background: var(--text-secondary); }`,
  markSm: `.sb-mark.sm { width: 10px; height: 3px; border-radius: var(--radius-2); }`
};

// --- STATUS ---
(() => {
const ANT = (() => {
  const _P_OUTER = `M6 6C7.57569 6 9.13602 6.31016 10.5918 6.91309C12.0477 7.51614 13.371 8.40035 14.4854 9.51465C15.5997 10.629 16.4839 11.9523 17.0869 13.4082C17.6898 14.864 18 16.4243 18 18H16C16 16.6868 15.7418 15.3861 15.2393 14.1729C14.7367 12.9596 13.9998 11.8573 13.0713 10.9287C12.1427 10.0002 11.0404 9.26329 9.82715 8.76074C8.61389 8.2582 7.31322 8 6 8V6Z`;
  const _P_MID   = `M6 10C7.05058 10 8.09092 10.2073 9.06152 10.6094C10.0321 11.0114 10.9144 11.6 11.6572 12.3428C12.4 13.0856 12.9886 13.9679 13.3906 14.9385C13.7927 15.9091 14 16.9494 14 18H12C12 17.2121 11.8445 16.432 11.543 15.7041C11.2414 14.9761 10.7993 14.315 10.2422 13.7578C9.68504 13.2007 9.02385 12.7586 8.2959 12.457C7.56796 12.1555 6.78791 12 6 12V10Z`;
  const _P_INNER = `M10 18C10 17.4747 9.89654 16.9546 9.69552 16.4693C9.4945 15.984 9.19986 15.543 8.82843 15.1716C8.45699 14.8001 8.01604 14.5055 7.53073 14.3045C7.04543 14.1035 6.52529 14 6 14L6 18H10Z`;
  const _P_OUTER_ERR = `M6 6C7.57569 6 9.13602 6.31016 10.5918 6.91309C11.8421 7.43098 12.9937 8.15735 14 9.05762V12C13.7167 11.6223 13.4066 11.2641 13.0713 10.9287C12.1427 10.0002 11.0404 9.26329 9.82715 8.76074C8.61389 8.2582 7.31322 8 6 8V6Z`;

  const C = { on: 'var(--success)', dim: 'var(--border)', err: 'var(--error)', edim: 'var(--text-secondary)' };
  const SVG = (body) => `<svg class="sb-antenna-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const mk = (inner, mid, outer) => SVG(
    `<path d="${_P_OUTER}" fill="${outer}"/><path d="${_P_MID}" fill="${mid}"/><path d="${_P_INNER}" fill="${inner}"/>`
  );
  const mkErr = () => SVG(
    `<path d="${_P_OUTER_ERR}" fill="${C.edim}"/><path d="${_P_MID}" fill="${C.edim}"/><path d="${_P_INNER}" fill="${C.edim}"/>` +
    `<path d="M16 9H18V15H16V9Z" fill="${C.err}"/><rect x="16" y="16" width="2" height="2" rx="1" fill="${C.err}"/>`
  );
  return {
    full: mk(C.on, C.on, C.on),
    high: mk(C.on, C.on, C.dim),
    mid:  mk(C.on, C.dim, C.dim),
    low:  mk(C.dim, C.dim, C.dim),
    off:  mkErr(),
  };
})();

// Status data dictionary
const SD = {
  dots: [
    { cls: 'online', label: 'Online' }, { cls: 'connecting', label: 'Connecting' },
    { cls: 'info', label: 'Info' }, { cls: 'warning', label: 'Warning' },
    { cls: 'maintenance', label: 'Alert' }, { cls: 'error', label: 'Error' },
    { cls: 'offline', label: 'Offline' },
  ],
  pulse: [
    { cls: 'online', label: 'Transmitting' }, { cls: 'connecting', label: 'Acquiring Link' },
    { cls: 'error', label: 'Link Down' }, { cls: 'warning', label: 'High Latency' },
  ],
  badges: [
    { cls: 'bs-grey', label: 'Offline' }, { cls: 'bs-green', label: 'Online' },
    { cls: 'bs-blue', label: 'Info' }, { cls: 'bs-red', label: 'Critical' },
    { cls: 'bs-orange', label: 'Alert' }, { cls: 'bs-yellow', label: 'Warning' },
  ],
  marks: [
    { cls: 'success', label: 'Online' }, { cls: 'error', label: 'Error' },
    { cls: 'warning', label: 'Warning' }, { cls: 'alert', label: 'Alert' },
    { cls: 'info', label: 'Info' }, { cls: 'neutral', label: 'Offline' },
  ],
  colorMap: {
    online: 'var(--success)', connecting: 'var(--primary)', info: 'var(--info)',
    warning: 'var(--warning)', maintenance: 'var(--alert)',
    error: 'var(--error)', offline: 'var(--text-secondary)',
  },
};
const bellIcon = sbIconRaw('notification-3-line', 18);

// Status sections derived previews
const dotPreview = SD.dots.map(d =>
  `<span class="sb-status"><span class="sb-status-dot ${d.cls}"></span>${d.label}</span>`
).join('\n        ');
const dotCode = SD.dots.map(d =>
  `<span class="sb-status">\n  <span class="sb-status-dot ${d.cls}"></span>${d.label}\n</span>`
).join('\n');
const pulsePreview = SD.pulse.map(d =>
  `<span class="sb-status"><span class="sb-status-dot ${d.cls} pulse"></span>${d.label}</span>`
).join('\n        ');
const miniIconPreview = SD.dots.filter(d => d.cls !== 'info').map(d =>
  `<div style="display:inline-flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-s);">
        <div class="sb-icon-badge-wrap">${bellIcon}<span class="sb-status-dot mini ${d.cls}"></span></div>
        <span class="sb-body-s" style="color:var(--text-tertiary)">${d.label}</span>
      </div>`
).join('\n        ');
const bsRegular = SD.badges.map(d => `<span class="sb-badge-status ${d.cls}">${d.label}</span>`).join('\n        ');
const bsMini = SD.badges.map(d => `<span class="sb-badge-status mini ${d.cls}">${d.label}</span>`).join('\n        ');
const markDemo = SD.marks.map(d =>
  `<div style="display:inline-flex;align-items:center;gap: var(--gap-horiz-s);padding: var(--pad-vert-8) var(--pad-horiz-16);background:var(--background);border-radius:var(--radius-6);">
        <span class="sb-mark ${d.cls}"></span>
        <span class="sb-body-m" style="color:var(--text-tertiary)">${d.label}</span>
      </div>`
).join('\n        ');

function dotClass(s) {
  let cls = `sb-status-dot ${s.variant}`;
  if (s.pulse) cls += ' pulse';
  if (s.mini) cls += ' mini';
  return cls;
}

window.downloadAntennaZip = async function() {
  if (typeof JSZip === 'undefined') { alert('JSZip not loaded'); return; }
  const P_OUTER = `M6 6C7.57569 6 9.13602 6.31016 10.5918 6.91309C12.0477 7.51614 13.371 8.40035 14.4854 9.51465C15.5997 10.629 16.4839 11.9523 17.0869 13.4082C17.6898 14.864 18 16.4243 18 18H16C16 16.6868 15.7418 15.3861 15.2393 14.1729C14.7367 12.9596 13.9998 11.8573 13.0713 10.9287C12.1427 10.0002 11.0404 9.26329 9.82715 8.76074C8.61389 8.2582 7.31322 8 6 8V6Z`;
  const P_MID   = `M6 10C7.05058 10 8.09092 10.2073 9.06152 10.6094C10.0321 11.0114 10.9144 11.6 11.6572 12.3428C12.4 13.0856 12.9886 13.9679 13.3906 14.9385C13.7927 15.9091 14 16.9494 14 18H12C12 17.2121 11.8445 16.432 11.543 15.7041C11.2414 14.9761 10.7993 14.315 10.2422 13.7578C9.68504 13.2007 9.02385 12.7586 8.2959 12.457C7.56796 12.1555 6.78791 12 6 12V10Z`;
  const P_INNER = `M10 18C10 17.4747 9.89654 16.9546 9.69552 16.4693C9.4945 15.984 9.19986 15.543 8.82843 15.1716C8.45699 14.8001 8.01604 14.5055 7.53073 14.3045C7.04543 14.1035 6.52529 14 6 14L6 18H10Z`;
  const P_OUTER_ERR = `M6 6C7.57569 6 9.13602 6.31016 10.5918 6.91309C11.8421 7.43098 12.9937 8.15735 14 9.05762V12C13.7167 11.6223 13.4066 11.2641 13.0713 10.9287C12.1427 10.0002 11.0404 9.26329 9.82715 8.76074C8.61389 8.2582 7.31322 8 6 8V6Z`;
  const p = (d, f) => `  <path d="${d}" fill="${f}"/>`;
  const svg = (...paths) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n${paths.join('\n')}\n</svg>`;
  const makeSet = (ON, DIM, ERR, EDIM) => ({
    'Antenna-Strong.svg': svg(p(P_OUTER, ON),   p(P_MID, ON),   p(P_INNER, ON)),
    'Antenna-Middle.svg': svg(p(P_OUTER, DIM),  p(P_MID, ON),   p(P_INNER, ON)),
    'Antenna-Weak.svg':   svg(p(P_OUTER, DIM),  p(P_MID, DIM),  p(P_INNER, ON)),
    'Antenna-Zero.svg':   svg(p(P_OUTER, DIM),  p(P_MID, DIM),  p(P_INNER, DIM)),
    'Antenna-Error.svg':  svg(p(P_OUTER_ERR, EDIM), p(P_MID, EDIM), p(P_INNER, EDIM),
                              `  <path d="M16 9H18V15H16V9Z" fill="${ERR}"/>`,
                              `  <rect x="16" y="16" width="2" height="2" rx="1" fill="${ERR}"/>`),
  });
  // Берём hex из COLOR_TOKENS — source of truth (не хардкодим).
  const pick = (name, mode) => {
    for (const g of window.COLOR_TOKENS) {
      for (const t of g.tokens) if (t.name === name) return t[mode];
    }
    return '#000';
  };
  const themes = {
    'dark':  makeSet(pick('--success','dark'),  pick('--border','dark'),  pick('--error','dark'),  pick('--text-secondary','dark')),
    'light': makeSet(pick('--success','light'), pick('--border','light'), pick('--error','light'), pick('--text-secondary','light')),
  };
  const zip = new JSZip();
  Object.entries(themes).forEach(([folder, files]) =>
    Object.entries(files).forEach(([name, content]) => zip.file(`${folder}/${name}`, content))
  );
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'antenna-icons.zip'; a.click();
  URL.revokeObjectURL(url);
};

sbRegister({
  name: 'status',
  title: 'Status',
  description: 'Четыре типа статусных компонентов: Indicator (точки), Badge-Status (пилюли), Antenna (сигнал) и Mark (полосы для таблиц).',
  playground: {
    title: 'Indicator Playground',
    state: { variant: 'online', pulse: false, mini: false },
    controls(pg) {
      return pg.select('variant', [
        { value: 'online', label: 'Online' }, { value: 'connecting', label: 'Connecting' },
        { value: 'info', label: 'Info' }, { value: 'warning', label: 'Warning' },
        { value: 'maintenance', label: 'Alert' }, { value: 'error', label: 'Error' },
        { value: 'offline', label: 'Offline' },
      ]) + `<div class="pg-toggles">${pg.toggle('pulse','Pulsing')}${pg.toggle('mini','Mini')}</div>`;
    },
    render(s) {
      const cls = dotClass(s);
      if (s.mini) {
        return `<div style="display:flex;flex-direction:column;align-items:center;gap: var(--gap-horiz-m);">
          <span class="${cls}"></span>
          <div class="sb-icon-badge-wrap">
            ${bellIcon}
            <span class="${cls}"></span>
          </div>
        </div>`;
      }
      return `<span class="${cls}"></span>`;
    },
    genCode(s) {
      const cls = dotClass(s);
      const color = SD.colorMap[s.variant] || 'var(--text-secondary)';
      const html = s.mini
        ? `<!-- Standalone mini dot -->\n<span class="${cls}"></span>\n\n<!-- Badge on icon -->\n<div class="sb-icon-badge-wrap">\n  <!-- your icon here -->\n  <span class="${cls}"></span>\n</div>`
        : `<span class="${cls}"></span>`;
      let css = `.sb-status-dot {\n  width: ${s.mini?'6px':'10px'};\n  height: ${s.mini?'6px':'10px'};\n  border-radius: 50%;\n  display: inline-block;\n}`;
      if (s.mini) css += `\n.sb-status-dot.mini {\n  border: var(--border-width-2) solid var(--background);\n  box-sizing: content-box;\n}`;
      css += `\n.sb-status-dot.${s.variant} {\n  background: ${color};\n}`;
      if (s.pulse) css += `\n.sb-status-dot.pulse {\n  animation: sb-dot-pulse 1.8s ease-in-out infinite;\n}\n@keyframes sb-dot-pulse {\n  0%, 100% { opacity: 1; transform: scale(1); }\n  50%       { opacity: 0.35; transform: scale(0.75); }\n}`;
      return { html, css };
    },
  },
  sections: [
    {
      title: 'Indicator — Regular',
      desc: 'Regular (10×10px) — цветная точка статуса объекта. Все цветовые варианты:',
      preview: dotPreview,
      html: dotCode,
      css: COMP_CSS.status.indicator,
    },
    {
      title: 'Indicator — Pulse',
      desc: 'Regular с пульсацией — для активных состояний реального времени:',
      preview: pulsePreview,
      html: `<span class="sb-status">\n  <span class="sb-status-dot online pulse"></span>Transmitting\n</span>\n<span class="sb-status">\n  <span class="sb-status-dot error pulse"></span>Link Down\n</span>`,
      css: COMP_CSS.status.pulse,
    },
    {
      title: 'Indicator — Mini',
      desc: 'Mini (6×6px + 2px border) — бейдж поверх иконки с отделяющей рамкой цвета фона:',
      preview: miniIconPreview,
      html: `<!-- Online badge on icon -->\n<div class="sb-icon-badge-wrap">\n  ${bellIcon}\n  <span class="sb-status-dot mini online"></span>\n</div>`,
      css: COMP_CSS.status.mini,
    },
    {
      title: 'Badge-Status — Regular',
      desc: 'Пилюля с текстом. Regular (40px). Использует семантические цветовые токены темы.',
      preview: bsRegular,
      html: `<span class="sb-badge-status bs-green">Online</span>\n<span class="sb-badge-status bs-red">Critical</span>\n<span class="sb-badge-status bs-grey">Offline</span>`,
      css: COMP_CSS.status.badgeStatus,
    },
    {
      title: 'Badge-Status — Mini',
      desc: 'Mini-вариант (28px) — для плотных интерфейсов, таблиц, списков.',
      preview: bsMini,
      html: `<span class="sb-badge-status mini bs-green">Online</span>\n<span class="sb-badge-status mini bs-red">Critical</span>\n<span class="sb-badge-status mini bs-grey">Offline</span>`,
      css: COMP_CSS.status.badgeStatusMini,
    },
    {
      title: 'Antenna',
      desc: 'Уровень сигнала антенны: 4 уровня мощности + состояние ошибки/нет сигнала.',
      preview: `<span class="sb-status" style="gap: var(--gap-horiz-s)">${ANT.full}<span>Full Signal</span></span>
        <span class="sb-status" style="gap: var(--gap-horiz-s)">${ANT.high}<span>High</span></span>
        <span class="sb-status" style="gap: var(--gap-horiz-s)">${ANT.mid}<span>Medium</span></span>
        <span class="sb-status" style="gap: var(--gap-horiz-s)">${ANT.low}<span>Low</span></span>
        <span class="sb-status" style="gap: var(--gap-horiz-s)">${ANT.off}<span>No Signal</span></span>`,
      html: `<!-- Full signal -->\n<svg width="22" height="18" viewBox="0 0 22 18" fill="none">\n  <circle cx="11" cy="16" r="2" fill="var(--success)"/>\n  <path d="M7 12.5A5.657 5.657 0 0 1 15 12.5" stroke="var(--success)" stroke-width="2" stroke-linecap="round"/>\n  <path d="M3.5 9A10.607 10.607 0 0 1 18.5 9" stroke="var(--success)" stroke-width="2" stroke-linecap="round"/>\n  <path d="M0 5.5A15.556 15.556 0 0 1 22 5.5" stroke="var(--success)" stroke-width="2" stroke-linecap="round"/>\n</svg>`,
      css: COMP_CSS.status.antenna,
      footer: `<button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm" onclick="downloadAntennaZip()" title="Download SVGs">${sbIcon('download-2-line','L')}</button>`,
    },
    {
      title: 'Mark — Regular',
      desc: 'Вертикальная полоса 3×40px — маркировка строк в таблицах и списках.',
      preview: markDemo,
      html: `<!-- Mark in table row -->\n<td style="padding:0; width:3px">\n  <span class="sb-mark success"></span>\n</td>`,
      css: COMP_CSS.status.mark,
    },
    {
      title: 'Mark — Small',
      desc: 'Small (горизонтальный штрих) — для компактных строк и инлайн-меток.',
      preview: SD.marks.map(d => `<span class="sb-status" style="gap: var(--gap-horiz-s)"><span class="sb-mark sm ${d.cls}"></span><span class="sb-body-m" style="color:var(--text-tertiary)">${d.label}</span></span>`).join('\n        '),
      html: `<span class="sb-mark sm success"></span>\n<span class="sb-mark sm error"></span>`,
      css: COMP_CSS.status.markSm,
    },
  ],
});
})();
