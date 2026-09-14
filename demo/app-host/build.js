// ═══════════════════════════════════════════════════════════════════════════
//  ГЕНЕРАТОР demo/app-host — экраны App Host на языке Spacebridge DS
//
//  Запуск из корня репозитория:
//    jsc demo/app-host/build.js
//
//  ЧТО ДЕЛАЕТ. Загружает DS под DOM-заглушкой (как tests/runtime.js) и собирает
//  фабриками DS три страницы: login.html, events.html, management.html.
//  Стили — ТОЛЬКО пакет pkg/css/spacebridge-ds.css (догфуд npm-пакета);
//  свой CSS страниц — раскладочный клей на токенах, без цветов и шрифтов.
//
//  ЧЕГО НЕ ДЕЛАЕТ. Не тянет JS DS в браузер: страницы статические, интерактив
//  (тема, навигация, глазок пароля) — минимальный inline-скрипт SHELL_JS.
//  Разметка руками не пишется — только вызовы sbMk* и документированные
//  copy-paste блоки (password, section-header, table-footer-left, таблица
//  без select-колонки — см. demoTable ниже).
// ═══════════════════════════════════════════════════════════════════════════

load('tests/lib/dom.js');
installDom();
var indexHtml = read('index.html');
var files = [];
indexHtml.replace(/src="(js\/[^"]+)"/g, function (_, f) { files.push(f); return _; });
eval(files.map(function (f) { return '\n//<<<' + f + '>>>\n' + read(f); }).join('\n'));

// ── общий каркас ────────────────────────────────────────────────────────────

var SHELL_CSS = [
  'body{min-height:100vh;display:flex;flex-direction:column;}',
  '.demo-app{flex:1;display:flex;flex-direction:column;}',
  '.demo-main{flex:1;display:flex;flex-direction:column;gap:var(--gap-vert-lg);',
  '  padding-top:var(--pad-vert-24);padding-bottom:var(--pad-vert-24);}',
  '.demo-footer{padding:var(--pad-vert-8) 0;}',
  '.demo-panel{width:100%;box-sizing:border-box;}',
  '.demo-stack{display:flex;flex-direction:column;gap:var(--gap-vert-m);min-width:0;}',
  '.demo-table-scroll{overflow-x:auto;}',
  '.demo-table-frame{display:inline-flex;max-width:100%;border:var(--border-width-1) solid var(--border);',
  '  border-radius:var(--radius-8);overflow:hidden;background:var(--background);}',
  '.demo-login-wrap{flex:1;display:flex;align-items:center;justify-content:center;',
  '  padding:var(--pad-vert-24) var(--pad-horiz-16);}',
  '.demo-login-card{width:100%;max-width:400px;}',
  '.demo-login-card .sb-pw{width:100%;box-sizing:border-box;}',
  '.demo-btn-full{width:100%;}',
  '[data-theme="dark"] .demo-ico-sun{display:none;}',
  'html:not([data-theme="dark"]) .demo-ico-moon{display:none;}',
].join('\n');

var SHELL_JS = [
  'function demoToggleTheme(){var h=document.documentElement;',
  "  var d=h.getAttribute('data-theme')==='dark'?'light':'dark';",
  "  h.setAttribute('data-theme',d);",
  "  try{localStorage.setItem('demo-theme',d)}catch(e){}}",
  "var DEMO_NAV={'Management':'management.html','Events':'events.html'};",
  'function sbSelectNavBtn(btn){var l=btn.textContent.trim();',
  '  if(DEMO_NAV[l])location.href=DEMO_NAV[l];}',
  'function sbNavBarDropdownClick(btn){sbSelectNavBtn(btn);}',
  'function sbTableSort(){}',
  'function sbPwToggle(btn){',
  "  var i=btn.closest('.sb-pw').querySelector('input');",
  "  i.type=i.type==='password'?'text':'password';}",
  '// Дропзона в демо статическая: обработчики File Uploader — заглушки.',
  'function sbUploaderDragOver(){}',
  'function sbUploaderDragLeave(){}',
  'function sbUploaderDrop(){}',
  'function sbUploaderPick(){}',
].join('\n');

var THEME_BOOT = "(function(){try{var t=localStorage.getItem('demo-theme');"
  + "if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})();";

function page(title, bodyHtml) {
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
    + '<meta charset="UTF-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    + '<title>' + title + '</title>\n'
    + '<script>' + THEME_BOOT + '</script>\n'
    + '<link rel="stylesheet" href="../../pkg/css/spacebridge-ds.css">\n'
    + '<style>\n' + SHELL_CSS + '\n</style>\n'
    + '</head>\n<body>\n<div class="demo-app">\n' + bodyHtml
    + '\n</div>\n<script>\n' + SHELL_JS + '\n</script>\n</body>\n</html>\n';
}

// ── общие элементы ──────────────────────────────────────────────────────────

// App Host — сторонний продукт, фирменный шрифт Spacebridge (sb-brand) ему
// не полагается: обычная типографика DS.
var LOGO = '<span class="sb-title-l sb-fw-bold" style="color:var(--primary)">APP HOST</span>';
var LOGO_COMPACT = '<span class="sb-title-l sb-fw-bold" style="color:var(--primary)">AH</span>';

var THEME_BTN = '<button type="button" class="sb-btn sb-btn-secondary sb-btn-icon"'
  + ' onclick="demoToggleTheme()" aria-label="Toggle theme">'
  + '<span class="demo-ico-sun">' + sbIcon('sun-line', 'L') + '</span>'
  + '<span class="demo-ico-moon">' + sbIcon('moon-fill', 'L') + '</span>'
  + '</button>';

var BELL_BTN = sbMkButton({ icon: 'notification-3-line', attrs: ' aria-label="Notifications"' });

function navBar(opts) {
  return sbMkNavBar({
    logo: LOGO,
    logoCompact: LOGO_COMPACT,
    tabs: opts.tabs || [],
    rightSlot: opts.rightSlot || [],
  });
}

function infoFooter() {
  return '<div class="demo-footer">' + sbMkInfoFooter({
    variant: 'long', align: 'center',
    slots: [
      { text: 'P/N: XXX-NO-PARTNUMBER' },
      { text: 'S/N: 12345' },
      { text: 'FW Version: application-host-1.0.1-b51' },
    ],
  }) + '</div>';
}

function sectionHeader(title) {
  return '<div class="sb-section-header" data-slot-left="true" data-slot-right="false">'
    + '<div class="sb-section-header-left"><span class="sb-caption">' + title + '</span></div>'
    + '</div>';
}

// Таблица без чекбокс-колонки: те же .sb-th/.sb-td ячейки, что собирает
// sbMkTableFull (у него первая колонка всегда select — App Host'у не нужна;
// кандидат на опцию selectable:false — см. wiki demo-app-host.md).
// Ширины фиксированные, как в mkTableFull; рамка — .demo-table-frame
// (canon обёртки из доков Table Footer).
function demoTable(columns, rows) {
  var sep = '<span class="sb-sep sep-v sep-l"></span>';
  function w(col) { return ' style="width:' + col.width + 'px;min-width:' + col.width + 'px"'; }
  var h = columns.map(function (c, i) {
    var dir = c.sort ? ' data-sort="' + c.sort + '"' : '';
    var last = i === columns.length - 1;
    return '<div class="sb-th' + (c.sort ? ' is-sorted' : '') + '" role="columnheader"' + w(c) + dir
      + ' onclick="sbTableSort(this)"><span class="sb-caption sb-fw-medium">' + c.title + '</span>'
      + '<span class="sb-th-sort">' + sbIconRaw('arrow-up-s-fill', 'L') + '</span>'
      + (last ? '' : sep) + '</div>';
  }).join('');
  var body = rows.map(function (row) {
    var cells = row.map(function (cell, i) {
      return '<div class="sb-td" role="cell"' + w(columns[i]) + '>'
        + '<span class="sb-td-l">' + cell + '</span></div>';
    }).join('');
    return '<div class="sb-trow" role="row">' + cells + '</div>';
  }).join('');
  return '<div class="sb-table" role="table">'
    + '<div class="sb-thead-row" role="row">' + h + '</div>' + body + '</div>';
}

function cellText(t) { return '<span class="sb-body-m">' + t + '</span>'; }
function cellDotText(dot, t) {
  return '<span class="sb-status-dot ' + dot + '"></span>' + cellText(t);
}
// Бейдж в ячейке таблицы — canon mkCell: Badge-Status Mini.
function cellBadge(color, label) {
  return sbMkBadgeStatus({ label: label, color: color, mini: true });
}

// ── login.html ──────────────────────────────────────────────────────────────

// Password — copy-paste разметка со страницы Password Input (фабрика не
// экспортирована; блок в точности из code panel, value пуст).
var PW_FIELD = '<div class="sb-field"><span class="sb-field-label">Password</span>'
  + '<div class="sb-pw">'
  + '<div class="sb-pw-left">'
  + '<span class="sb-pw-lock">' + sbIcon('lock-2-line', 'M') + '</span>'
  + '<input class="sb-pw-input" type="password" value="" placeholder="">'
  + '</div>'
  + '<div class="sb-pw-right">'
  + '<button class="sb-pw-toggle" onclick="sbPwToggle(this)" title="Show/hide password">'
  + sbIconRaw('eye-line', 'L') + '</button>'
  + '</div></div></div>';

var loginBody =
  navBar({
    rightSlot: [
      THEME_BTN,
      sbMkButton({ label: 'Guest Mode', attrs: ' onclick="location.href=\'events.html\'"' }),
    ],
  })
  + '<div class="demo-login-wrap">'
  + sbMkCard({
      cls: 'demo-login-card',
      body: '<div class="demo-stack">'
        + sbMkHeaderM({ title: 'Login' })
        + sbMkField({ value: '', showTitle: false }, { label: 'Username' })
        + PW_FIELD
        + sbMkButton({ label: 'Sign In', variant: 'primary', cls: 'demo-btn-full',
            attrs: ' onclick="location.href=\'management.html\'"' })
        + '</div>',
    })
  + '</div>'
  + infoFooter();

// ── events.html ─────────────────────────────────────────────────────────────

var eventsTable = demoTable(
  [
    { title: 'Date', sort: 'desc', width: 240 },
    { title: 'Severity / Type', width: 340 },
    { title: 'Parameters', width: 240 },
  ],
  [
    [cellText('2026-09-04 16:11:23'), cellDotText('online', 'firmware-update-success'), cellText('—')],
    [cellText('2026-09-04 16:10:32'), cellDotText('online', 'firmware-update-script-started'), cellText('—')],
    [cellText('2026-09-04 16:07:42'), cellDotText('maintenance', 'system-reboot-requested'), cellText('—')],
  ]
);

var eventsFooter = sbMkTableFooter({
  left: '<span class="sb-body-s" style="color:var(--text-tertiary)">Rows: 3 of 3</span>',
  right: sbMkPagination({ total: 3, pageSize: 10, currentPage: 1 }),
});

var eventsHeader = sbMkHeaderL({
  title: 'Events',
  slotRight: sbMkFlex({ align: 'center', gap: 'm', content:
      '<span class="sb-caption">Server time: <span class="sb-title-s">Sep 14, 2026, 12:16 PM</span></span>'
      + sbMkButton({ label: 'Export', icon: 'download-2-line', variant: 'primary' }) }),
});

var eventsBody =
  navBar({
    rightSlot: [
      THEME_BTN,
      BELL_BTN,
      sbMkButton({ label: 'Login', attrs: ' onclick="location.href=\'login.html\'"' }),
    ],
  })
  + sbMkPage({ cls: 'demo-main', content:
      sbMkCard({
        cls: 'demo-panel',
        body: '<div class="demo-stack">'
          + eventsHeader
          + sbMkButtonWithLabel({ icon: 'filter-line', text: 'Filter', side: 'right' })
          + '<div class="demo-table-scroll"><div class="demo-table-frame"><div class="sb-table-wrap">'
          + eventsTable
          + '<div class="sb-table-foot">' + eventsFooter + '</div></div></div></div>'
          + '</div>',
      }) })
  + infoFooter();

// ── management.html ─────────────────────────────────────────────────────────

var updateTable = demoTable(
  [
    { title: '#', width: 56 },
    { title: 'Version', width: 360 },
    { title: 'Partition', width: 130 },
    { title: 'Status', width: 120 },
    { title: 'Actions', width: 160 },
  ],
  [
    [cellText('1'), cellText('application-host-1.0.1-b51 / application-host'), cellText('/dev/sda2'),
     cellBadge('grey', 'Alternate'),
     sbMkButton({ label: 'Update', variant: 'primary', size: 's' }) + ' '
       + sbMkButton({ icon: 'loop-left-line', iconSize: 'M', size: 's', attrs: ' aria-label="Reboot to slot"' })],
    [cellText('2'), cellText('application-host-1.0.1-b51 / application-host'), cellText('/dev/sda3'),
     cellBadge('green', 'Active'),
     sbMkButton({ icon: 'loop-left-line', iconSize: 'M', size: 's', attrs: ' aria-label="Reboot to slot"' })],
  ]
);

// Backup — дропзона File Uploader (наш компонент) + restore/save действия.
var backupCard = sbMkCard({
  header: sbMkCardHeader({ title: 'Backup' }),
  body: '<div class="demo-stack">'
    + sbMkUploaderArea({ title: 'Upload Backup', hint: 'TAR archive, single file', multiple: false, wide: true })
    + sbMkFlex({ justify: 'between', full: true, content:
        sbMkButton({ icon: 'arrow-go-back-line', attrs: ' aria-label="Restore backup"' })
        + sbMkButton({ icon: 'save-line', attrs: ' aria-label="Save backup"' }) })
    + '</div>',
});

var mgmtCard = sbMkCard({
  header: sbMkCardHeader({ title: 'MGMT' }),
  body: sbMkFlex({ gap: 'lg', wrap: true, full: true, align: 'stretch', content:
      sbMkFlexItem({ grow: 1, basis: '260px', content:
        sbMkCard({ border: true, body: '<div class="demo-stack">'
          + sbMkToggle({ label: 'DHCP', labelLeft: true })
          + sbMkField({ value: '10.10.140.211', showTitle: false }, { label: 'IP' })
          + sbMkField({ value: '24', showTitle: false }, { label: 'Prefix Length' })
          + sbMkField({ value: '10.10.140.1', showTitle: false }, { label: 'Gateway' })
          + sbMkField({ value: '192.168.30.21', showTitle: false }, { label: 'DNS' })
          + '</div>' }) })
      + sbMkFlexItem({ grow: 1, basis: '260px', content:
        sbMkCard({ border: true, body:
          sbMkToggle({ label: 'Link Auto negotiation', labelLeft: true, on: true }) }) })
      + sbMkFlexItem({ grow: 1, basis: '260px', content:
        sbMkCard({ border: true, body: '<div class="demo-stack">'
          + sbMkField({ value: '10.10.140.211', readOnly: true, lineView: true, showTitle: false }, { label: 'Current IP' })
          + sbMkField({ value: 'cc:48:3a:11:e3:21', readOnly: true, lineView: true, showTitle: false }, { label: 'MAC Address' })
          + '</div>' }) }) }),
});

var ntpCard = sbMkCard({
  header: sbMkCardHeader({ title: 'NTP' }),
  body: sbMkCard({ border: true, body: sbMkToggle({ label: 'Ntp server enabled', labelLeft: true }) }),
});

var mgmtBody =
  navBar({
    tabs: [
      { label: 'Management', selected: true },
      { label: 'Events' },
      { label: 'Containers' },
      { label: 'Plugins' },
      { label: 'Integrity check', hasChevron: true },
    ],
    rightSlot: [
      THEME_BTN,
      BELL_BTN,
      sbMkAvatar({ type: 'initials', initials: 'D' }),
    ],
  })
  + sbMkPage({ cls: 'demo-main', content:
      sbMkCard({
        cls: 'demo-panel',
        body: '<div class="demo-stack">'
        + sbMkHeaderL({ title: 'Management' })
        + sbMkFlex({ gap: 'lg', wrap: true, full: true, content:
            sbMkFlexItem({ grow: 2, basis: '480px', content: '<div class="demo-stack">'
              + sectionHeader('Update')
              + '<div class="demo-table-scroll"><div class="demo-table-frame">' + updateTable + '</div></div>'
              + '</div>' })
            + sbMkFlexItem({ grow: 1, basis: '280px', content: '<div class="demo-stack">'
              + sectionHeader('Control') + backupCard + '</div>' }) })
        + sbMkFlex({ gap: 'lg', wrap: true, full: true, content:
            sbMkFlexItem({ grow: 2, basis: '480px', content: '<div class="demo-stack">'
              + sectionHeader('Management') + mgmtCard + '</div>' })
            + sbMkFlexItem({ grow: 1, basis: '280px', content: '<div class="demo-stack">'
              + sectionHeader('NTP') + ntpCard + '</div>' }) })
        + '</div>',
      }) })
  + infoFooter();

// ── запись ──────────────────────────────────────────────────────────────────

writeFile('demo/app-host/login.html', page('App Host — Login', loginBody));
writeFile('demo/app-host/events.html', page('App Host — Events', eventsBody));
writeFile('demo/app-host/management.html', page('App Host — Management', mgmtBody));
print('demo/app-host: login.html, events.html, management.html записаны');
