// ═══════════════════════════════════════════════════════════════════════════
//  BADGE
//  CSS в css/components/badge.css — SYNC-маркеры обязательны.
//  При правке стилей — обновить ОБА места (window.COMP_CSS и CSS-файл).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS.badge = {
  text: `.sb-badge-text { font-size: var(--badge-font-size); font-weight: var(--font-weight-medium); line-height: var(--button-line-height); font-family: var(--font-family); }

.sb-badge {
  display: inline-flex;
  height: 24px;
  padding: var(--pad-vert-2) var(--pad-horiz-8);
  align-items: center;
  border-radius: var(--radius-20);
  font-size: var(--badge-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--button-line-height);
  font-family: var(--font-family);
  white-space: nowrap;
}
.sb-badge-primary { background: var(--primary-hover);  color: var(--primary); }
.sb-badge-success { background: var(--success-hover);  color: var(--success); }
.sb-badge-error   { background: var(--error-hover);    color: var(--error); }
.sb-badge-pending { background: var(--shadow-overlay);  color: var(--text-secondary); }
.sb-badge-alert   { background: var(--alert-hover);    color: var(--alert); }`,
  symbol: `.sb-symbol-badge { display: inline-flex; width: 24px; height: 24px; flex-shrink: 0; }`,
  pin: `.sb-pin {
  display: inline-flex; align-items: center; justify-content: space-between; gap: var(--gap-horiz-xs);
  padding: var(--pad-horiz-4); border-radius: var(--radius-20);
  font-size: var(--badge-font-size); font-weight: var(--font-weight-bold); line-height: 1;
  color: var(--background); background: var(--text-primary);
  white-space: nowrap; border: var(--border-width-1) solid var(--background);
  box-shadow: 0 2px 8px 0 var(--shadow-overlay);
}
.sb-pin-primary { background: var(--primary); }
.sb-pin-success { background: var(--success); }
.sb-pin-error   { background: var(--error); }
.sb-pin-alert   { background: var(--alert); }`,
  count: `.sb-badge-count {
  min-width: 20px;
  height: 20px;
  padding: 0 var(--pad-horiz-8);
  border-radius: var(--radius-10);
  font-size: var(--badge-font-size);
  font-weight: var(--font-weight-bold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.sb-badge-count.red   { background: var(--error);   color: var(--background); }
.sb-badge-count.blue  { background: var(--primary);        color: var(--background); }
.sb-badge-count.green { background: var(--success); color: var(--background); }`,
  dot: `.sb-badge-dot {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-horiz-s);
}
.sb-badge-dot::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sb-badge-dot.active::before   { background: var(--success); }
.sb-badge-dot.inactive::before { background: var(--text-secondary); }
.sb-badge-dot.error::before    { background: var(--error); }`
};

// --- SYMBOL BADGES DATA ---
// Пути + цвет-токен + имя файла для ZIP. Цвет задаётся токеном ДС
// и резолвится в хекс при скачивании SVG.
const SB_BADGE_SPECS = {
  infoPop:    { d: 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z', token: '--border',  file: 'Info-pop-up' },
  infoLine:   { d: 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z', token: '--info', file: 'Info-dialogue-line' },
  infoFilled: { d: 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z', token: '--info', file: 'Info-dialogue-filled' },
  time:       { d: 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z', token: '--info', file: 'Time' },
  timeFilled: { d: 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 12V7H11V14H17V12H13Z', token: '--info', file: 'Time-filled' },
  warnLine:   { d: 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z', token: '--alert', file: 'Warning-dialogue-line' },
  warnFilled: { d: 'M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z', token: '--alert', file: 'Warning-dialogue-filled' },
  critLine:   { d: 'M12.8659 3.00017L22.3922 19.5002C22.6684 19.9785 22.5045 20.5901 22.0262 20.8662C21.8742 20.954 21.7017 21.0002 21.5262 21.0002H2.47363C1.92135 21.0002 1.47363 20.5525 1.47363 20.0002C1.47363 19.8246 1.51984 19.6522 1.60761 19.5002L11.1339 3.00017C11.41 2.52187 12.0216 2.358 12.4999 2.63414C12.6519 2.72191 12.7782 2.84815 12.8659 3.00017ZM4.20568 19.0002H19.7941L11.9999 5.50017L4.20568 19.0002ZM10.9999 16.0002H12.9999V18.0002H10.9999V16.0002ZM10.9999 9.00017H12.9999V14.0002H10.9999V9.00017Z', token: '--error', file: 'Critical-dialogue-line' },
  critFilled: { d: 'M12.8659 3.50017L22.3922 20.0002C22.6684 20.4785 22.5045 21.0901 22.0262 21.3662C21.8742 21.454 21.7017 21.5002 21.5262 21.5002H2.47363C1.92135 21.5002 1.47363 21.0525 1.47363 20.5002C1.47363 20.3246 1.51984 20.1522 1.60761 20.0002L11.1339 3.50017C11.41 3.02187 12.0216 2.858 12.4999 3.13414C12.6519 3.22191 12.7782 3.34815 12.8659 3.50017ZM10.9999 16.5002V18.5002H12.9999V16.5002H10.9999ZM10.9999 9.50017V14.5002H12.9999V9.50017H10.9999Z', token: '--error', file: 'Critical-dialogue-filled' },
  checkCircle:{ d: 'M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z', token: '--success', file: 'Check-circle' },
  checkSingle:{ d: 'M7 11.2308L10.85 15L18 8', token: '--info', file: 'Check-single', stroke: true },
};

// In-page версии через CSS-токены — адаптируются к теме автоматически
const SB_SVG = Object.fromEntries(Object.entries(SB_BADGE_SPECS).map(([k, s]) => {
  const paint = s.stroke
    ? `style="stroke:var(${s.token});stroke-width:2"`
    : `style="fill:var(${s.token})"`;
  return [k, `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${s.d}" ${paint}/></svg>`];
}));

window.downloadSymbolBadgeZip = async function() {
  if (typeof JSZip === 'undefined') { alert('JSZip not loaded'); return; }
  // Резолвим токены из текущей темы — скачанный SVG соответствует тому, что на экране
  const cs = getComputedStyle(document.documentElement);
  const mkFile = (s) => {
    const hex = cs.getPropertyValue(s.token).trim() || '#000';
    const paint = s.stroke ? `stroke="${hex}" stroke-width="2"` : `fill="${hex}"`;
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="${s.d}" ${paint}/>\n</svg>`;
  };
  const zip = new JSZip();
  Object.values(SB_BADGE_SPECS).forEach(s => zip.file(`${s.file}.svg`, mkFile(s)));
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'symbol-badges.zip'; a.click();
  URL.revokeObjectURL(url);
};

// --- BADGE ---
sbRegister({
  name: 'badge',
  title: 'Badge',
  description: 'Text-badges для отображения статуса, категории или состояния объекта. Высота 24px, border-radius 20px, типографика Badge (10px / 500 / 12px).',
  sections: [
    {
      title: 'Text Badges',
      desc: 'Пять вариантов: Default, Active, Failed, Pending, Warning. Используют alpha-цвета из токенов темы.',
      preview: `
        <span class="sb-badge sb-badge-primary">Default</span>
        <span class="sb-badge sb-badge-success">Active</span>
        <span class="sb-badge sb-badge-error">Failed</span>
        <span class="sb-badge sb-badge-pending">Pending</span>
        <span class="sb-badge sb-badge-alert">Warning</span>`,
      html: `<span class="sb-badge sb-badge-primary">Default</span>
<span class="sb-badge sb-badge-success">Active</span>
<span class="sb-badge sb-badge-error">Failed</span>
<span class="sb-badge sb-badge-pending">Pending</span>
<span class="sb-badge sb-badge-alert">Warning</span>`,
      css: COMP_CSS.badge.text,
    },
    {
      title: 'Symbol Badges',
      desc: '11 иконочных бейджей для разных статусов: Info, Time, Warning, Critical, Check.',
      preview: (() => {
        const LABELS = {
          infoPop: 'Info Pop-up', infoLine: 'Info Line', infoFilled: 'Info Filled',
          time: 'Time', timeFilled: 'Time Filled',
          warnLine: 'Warning Line', warnFilled: 'Warning Filled',
          critLine: 'Critical Line', critFilled: 'Critical Filled',
          checkCircle: 'Check Circle', checkSingle: 'Check Single',
        };
        const items = Object.keys(SB_BADGE_SPECS).map(k =>
          `<div class="sb-sb-item">${SB_SVG[k]}<span class="sb-body-s">${LABELS[k]}</span></div>`
        ).join('');
        return `<div class="sb-sb-grid">${items}</div>`;
      })(),
      html: `<!-- Use SVG directly as an img (рекомендуется) -->
<img src="./Symbol-Badges/Type=check-circle.svg" width="24" height="24" alt="Check">`,
      css: COMP_CSS.badge.symbol,
      footer: `<button class="sb-btn sb-btn-secondary sb-btn-icon sb-btn-sm" onclick="downloadSymbolBadgeZip()" title="Download SVGs">${sbIcon('download-2-line','L')}</button>`,
    },
    {
      title: 'Pin',
      desc: 'Плашка поверх объекта — роль, метка или статус. Поддерживает текст, иконку и цветовые варианты.',
      preview: `
        <span class="sb-pin">ADMIN ★</span>
        <span class="sb-pin sb-pin-primary">PRIMARY ★</span>
        <span class="sb-pin sb-pin-success">SUCCESS ★</span>
        <span class="sb-pin sb-pin-error">ERROR ★</span>
        <span class="sb-pin sb-pin-alert">ALERT ★</span>`,
      html: `<!-- default (dark) -->
<span class="sb-pin">ADMIN ★</span>

<!-- color variants -->
<span class="sb-pin sb-pin-primary">PRIMARY ★</span>
<span class="sb-pin sb-pin-success">SUCCESS ★</span>
<span class="sb-pin sb-pin-error">ERROR ★</span>
<span class="sb-pin sb-pin-alert">ALERT ★</span>`,
      css: COMP_CSS.badge.pin,
    },
  ],
});

