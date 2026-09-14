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
//  copy-paste блоки (password, section-header, table-footer-left).
// ═══════════════════════════════════════════════════════════════════════════

load('tests/lib/dom.js');
installDom();
var indexHtml = read('index.html');
var files = [];
indexHtml.replace(/src="(js\/[^"]+)"/g, function (_, f) { files.push(f); return _; });
eval(files.map(function (f) { return '\n//<<<' + f + '>>>\n' + read(f); }).join('\n'));

// ── общий каркас ────────────────────────────────────────────────────────────

var SHELL_CSS = [
  '.demo-app{min-height:100vh;display:flex;flex-direction:column;}',
  '.demo-main{flex:1;width:100%;max-width:1720px;margin:0 auto;box-sizing:border-box;',
  '  display:flex;flex-direction:column;gap:var(--gap-vert-lg);',
  '  padding:var(--pad-vert-24) var(--pad-horiz-24);}',
  '.demo-footer{padding:var(--pad-vert-8) 0;}',
  '.demo-page-card{width:100%;box-sizing:border-box;}',
  '.demo-stack{display:flex;flex-direction:column;gap:var(--gap-vert-m);min-width:0;}',
  '.demo-cols{display:flex;gap:var(--gap-horiz-lg);flex-wrap:wrap;align-items:stretch;}',
  '.demo-col-main{flex:2 1 480px;min-width:0;}',
  '.demo-col-side{flex:1 1 280px;min-width:0;}',
  '.demo-toolbar{display:flex;justify-content:space-between;align-items:flex-end;',
  '  gap:var(--gap-horiz-m);flex-wrap:wrap;}',
  '.demo-server-time{display:flex;align-items:center;justify-content:flex-end;',
  '  gap:var(--gap-horiz-m);flex-wrap:wrap;text-align:right;}',
  '.demo-table-scroll{overflow-x:auto;}',
  '.demo-login-wrap{flex:1;display:flex;align-items:center;justify-content:center;',
  '  padding:var(--pad-vert-24) var(--pad-horiz-16);}',
  '.demo-login-card{width:100%;max-width:400px;}',
  '.demo-login-card .sb-pw{width:100%;box-sizing:border-box;}',
  '.demo-btn-full{width:100%;}',
  '.demo-upload-zone{border:var(--border-width-1) solid var(--border);',
  '  border-radius:var(--radius-8);padding:var(--pad-vert-16) var(--pad-horiz-16);',
  '  display:flex;justify-content:center;}',
  '.demo-row-between{display:flex;justify-content:space-between;align-items:center;',
  '  gap:var(--gap-horiz-m);flex-wrap:wrap;}',
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

var LOGO = '<span class="sb-brand" style="font-size:18px;color:var(--primary)">APP HOST</span>';
var LOGO_COMPACT = '<span class="sb-brand" style="font-size:18px;color:var(--primary)">AH</span>';

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
// sbMkTableFull (у него первая колонка всегда select — App Host'у не нужна).
function demoTable(columns, rows) {
  var sep = '<span class="sb-sep sep-v sep-l"></span>';
  function w(col) {
    if (col.flex) return ' style="flex:1;width:auto;min-width:' + (col.min || 120) + 'px"';
    return ' style="width:' + col.width + 'px;min-width:' + col.width + 'px"';
  }
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
      sbMkButton({ label: 'Guest Mode', variant: 'link', attrs: ' onclick="location.href=\'events.html\'"' }),
    ],
  })
  + '<div class="demo-login-wrap">'
  + sbMkCard({
      cls: 'demo-login-card',
      body: '<div class="demo-stack">'
        + '<span class="sb-h6">Login</span>'
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
    { title: 'Date', sort: 'desc', width: 260 },
    { title: 'Severity / Type', width: 340 },
    { title: 'Parameters', flex: true, min: 160 },
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

var eventsBody =
  navBar({
    rightSlot: [
      THEME_BTN,
      BELL_BTN,
      sbMkButton({ label: 'Login', variant: 'link', attrs: ' onclick="location.href=\'login.html\'"' }),
    ],
  })
  + '<div class="demo-main">'
  + sbMkCard({
      cls: 'demo-page-card',
      body: '<div class="demo-stack">'
        + '<span class="sb-h6">Events</span>'
        + '<div class="demo-toolbar">'
        + sbMkButton({ label: 'Filter', icon: 'filter-line' })
        + '<div class="demo-server-time">'
        + '<span class="sb-caption">Server time: <span class="sb-title-s">Sep 14, 2026, 12:16 PM</span></span>'
        + sbMkButton({ label: 'Export', icon: 'download-2-line', variant: 'primary' })
        + '</div>'
        + '</div>'
        + '<div class="sb-table-wrap demo-page-card"><div class="demo-table-scroll">'
        + eventsTable
        + '</div><div class="sb-table-foot">' + eventsFooter + '</div></div>'
        + '</div>',
    })
  + '</div>'
  + infoFooter();

// ── management.html ─────────────────────────────────────────────────────────

var updateTable = demoTable(
  [
    { title: '#', width: 56 },
    { title: 'Version', flex: true, min: 240 },
    { title: 'Partition', width: 140 },
    { title: 'Status', width: 130 },
    { title: 'Actions', width: 160 },
  ],
  [
    [cellText('1'), cellText('application-host-1.0.1-b51 / application-host'), cellText('/dev/sda2'),
     sbMkBadgeStatus({ label: 'Alternate', color: 'grey' }),
     sbMkButton({ label: 'Update', variant: 'primary', size: 's' }) + ' '
       + sbMkButton({ icon: 'loop-left-line', iconSize: 'M', size: 's', attrs: ' aria-label="Reboot to slot"' })],
    [cellText('2'), cellText('application-host-1.0.1-b51 / application-host'), cellText('/dev/sda3'),
     sbMkBadgeStatus({ label: 'Active', color: 'green' }),
     sbMkButton({ icon: 'loop-left-line', iconSize: 'M', size: 's', attrs: ' aria-label="Reboot to slot"' })],
  ]
);

var backupCard = sbMkCard({
  header: sbMkCardHeader({ title: 'Backup' }),
  body: '<div class="demo-stack">'
    + '<div class="demo-upload-zone">'
    + sbMkButton({ label: 'Upload Backup', icon: 'upload-cloud-2-line' })
    + '</div>'
    + '<div class="demo-row-between">'
    + sbMkButton({ icon: 'arrow-go-back-line', attrs: ' aria-label="Restore backup"' })
    + sbMkButton({ icon: 'save-line', attrs: ' aria-label="Save backup"' })
    + '</div>'
    + '</div>',
});

var mgmtCard = sbMkCard({
  header: sbMkCardHeader({ title: 'MGMT' }),
  body: '<div class="demo-cols">'
    + sbMkCard({ border: true, cls: 'demo-col-side', body: '<div class="demo-stack">'
        + sbMkToggle({ label: 'DHCP', labelLeft: true })
        + sbMkField({ value: '10.10.140.211', showTitle: false }, { label: 'IP' })
        + sbMkField({ value: '24', showTitle: false }, { label: 'Prefix Length' })
        + sbMkField({ value: '10.10.140.1', showTitle: false }, { label: 'Gateway' })
        + sbMkField({ value: '192.168.30.21', showTitle: false }, { label: 'DNS' })
        + '</div>' })
    + sbMkCard({ border: true, cls: 'demo-col-side', body:
        sbMkToggle({ label: 'Link Auto negotiation', labelLeft: true, on: true }) })
    + sbMkCard({ border: true, cls: 'demo-col-side', body: '<div class="demo-stack">'
        + sbMkField({ value: '10.10.140.211', readOnly: true, lineView: true, showTitle: false }, { label: 'Current IP' })
        + sbMkField({ value: 'cc:48:3a:11:e3:21', readOnly: true, lineView: true, showTitle: false }, { label: 'MAC Address' })
        + '</div>' })
    + '</div>',
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
  + '<div class="demo-main">'
  + '<div class="demo-cols">'
  + '<div class="demo-col-main demo-stack">' + sectionHeader('Update')
  + '<div class="sb-table-wrap demo-page-card"><div class="demo-table-scroll">' + updateTable + '</div></div>'
  + '</div>'
  + '<div class="demo-col-side demo-stack">' + sectionHeader('Control') + backupCard + '</div>'
  + '</div>'
  + '<div class="demo-cols">'
  + '<div class="demo-col-main demo-stack">' + sectionHeader('Management') + mgmtCard + '</div>'
  + '<div class="demo-col-side demo-stack">' + sectionHeader('') + ntpCard + '</div>'
  + '</div>'
  + '</div>'
  + infoFooter();

// ── запись ──────────────────────────────────────────────────────────────────

writeFile('demo/app-host/login.html', page('App Host — Login', loginBody));
writeFile('demo/app-host/events.html', page('App Host — Events', eventsBody));
writeFile('demo/app-host/management.html', page('App Host — Management', mgmtBody));
print('demo/app-host: login.html, events.html, management.html записаны');
