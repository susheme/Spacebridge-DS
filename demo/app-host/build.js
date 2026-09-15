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
  // App-shell: nav и footer прибиты, скроллится только средняя зона.
  'body{height:100vh;overflow:hidden;display:flex;flex-direction:column;}',
  '.demo-app{flex:1;display:flex;flex-direction:column;min-height:0;}',
  '.demo-scroll{flex:1;min-height:0;display:flex;flex-direction:column;}',
  // App Host: боковой гаттер страницы 24 на всех ширинах (решение юзера);
  // в DS --page-gutter адаптивный (16/24/32) — здесь локальный override.
  '.demo-main{--page-gutter:var(--pad-horiz-24);}',
  '.demo-main{flex:1;min-height:0;display:flex;flex-direction:column;gap:var(--gap-vert-lg);',
  '  padding-top:var(--pad-vert-24);padding-bottom:var(--pad-vert-24);}',
  '.demo-footer{flex-shrink:0;overflow-x:auto;}',
  '.demo-panel{width:100%;box-sizing:border-box;flex:1;min-height:0;',
  '  display:flex;flex-direction:column;}',
  // Sticky-хэдэр (догма sticky-headers.md): у скролл-зоны паддинг сверху 0,
  // хэдэр full-bleed перекрывает боковые паддинги плоскости своим фоном.
  // Хэдэр панели ВНЕ скролл-зоны (паттерн 2 из доков Nav Bar): скроллбар
  // упирается в низ хэдэра, а не едет за ним. Специфичность против
  // pkg-правила .sb-card>.sb-card-body:first-child{padding:16}.
  '.sb-card.demo-panel>.sb-card-body:first-child{flex:1;min-height:0;padding:0;',
  '  display:flex;flex-direction:column;gap:0;}',
  // Компонентные значения не подменяются: только снятие max-width:1024
  // (full-width панели шире) и верхние углы панели (radius-8, как .sb-card;
  // в 0 уходит только Nav Bar — он упирается в углы окна).
  '.demo-panel .sb-header-l{max-width:none;',
  '  border-radius:var(--radius-8) var(--radius-8) var(--radius-0) var(--radius-0);}',
  // Скролл-зона под хэдэром; паддинги — те же, что были у тела панели.
  '.demo-panel-scroll{flex:1;min-height:0;overflow-y:auto;padding:var(--pad-vert-16);',
  '  display:flex;flex-direction:column;gap:var(--gap-vert-m);}',
  '.demo-stack{display:flex;flex-direction:column;gap:var(--gap-vert-m);min-width:0;}',
  // Скролл — у самой рамки: overflow:hidden здесь резал таблицу
  // (паттерн no-cosmetic-overflow-hidden).
  '.demo-table-frame{display:flex;width:100%;box-sizing:border-box;border:var(--border-width-1) solid var(--border);',
  '  border-radius:var(--radius-8);overflow-x:auto;background:var(--background);}',
  '.demo-table-frame .sb-table{width:100%;}',
  '.demo-table-frame .sb-thead-row,.demo-table-frame .sb-trow{display:flex;width:100%;}',
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
  '// Floating nav: is-stuck при скролле — код DS (sbWireNavBarFloating).',
  'var sbWireNavBarFloating = ' + sbWireNavBarFloating.toString() + ';',
  "document.addEventListener('DOMContentLoaded',function(){",
  "  var bar=document.querySelector('.sb-nav-bar.floating');",
  "  var scroll=document.querySelector('.demo-panel-scroll')",
  "    ||document.querySelector('.demo-scroll');",
  '  if(bar&&scroll)sbWireNavBarFloating(scroll,bar);',
  '});',
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

// Логотип — фирменный шрифт (sb-brand), как у хрома самой DS; размер и цвет —
// canon логотипа из index.html DS.
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
    floating: true,
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

// ── login.html ──────────────────────────────────────────────────────────────

var loginBody =
  navBar({
    rightSlot: [
      THEME_BTN,
      sbMkButton({ label: 'Guest Mode', attrs: ' onclick="location.href=\'events.html\'"' }),
    ],
  })
  + '<div class="demo-scroll"><div class="demo-login-wrap">'
  + sbMkCard({
      border: true,
      cls: 'demo-login-card',
      body: '<div class="demo-stack">'
        + sbMkHeaderM({ title: 'Login' })
        + sbMkField({ value: '', showTitle: false }, { label: 'Username' })
        + sbMkPasswordField({ value: '' }, { label: 'Password' })
        + sbMkButton({ label: 'Sign In', variant: 'primary', cls: 'demo-btn-full',
            attrs: ' onclick="location.href=\'management.html\'"' })
        + '</div>',
    })
  + '</div></div>'
  + infoFooter();

// ── events.html ─────────────────────────────────────────────────────────────

var eventsTable = sbMkTableFull({
  selectable: false,
  footer: true,
  columns: [
    { title: 'Date', sort: 'desc', width: 240 },
    { title: 'Severity / Type', width: 340, type: 'status-circle-text' },
    { title: 'Parameters', flex: 160 },
  ],
  rows: [
    ['2026-09-04 16:11:23', { text: 'firmware-update-success', dot: 'online' }, '—'],
    ['2026-09-04 16:10:32', { text: 'firmware-update-script-started', dot: 'online' }, '—'],
    ['2026-09-04 16:07:42', { text: 'system-reboot-requested', dot: 'maintenance' }, '—'],
  ],
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
  + '<div class="demo-scroll">'
  + sbMkPage({ cls: 'demo-main', content:
      sbMkCard({
        border: true,
        cls: 'demo-panel',
        body: eventsHeader
          + '<div class="demo-panel-scroll">'
          + sbMkButtonWithLabel({ icon: 'filter-line', text: 'Filter', side: 'right' })
          + '<div class="demo-table-frame">' + eventsTable + '</div>'
          + '</div>',
      }) })
  + '</div>'
  + infoFooter();

// ── management.html ─────────────────────────────────────────────────────────

var updateTable = sbMkTableFull({
  selectable: false,
  columns: [
    { title: '#', width: 56 },
    { title: 'Version', flex: 260 },
    { title: 'Partition', width: 130 },
    { title: 'Status', width: 120, type: 'status-text' },
    { title: 'Actions', width: 160, type: 'html' },
  ],
  rows: [
    ['1', 'application-host-1.0.1-b51 / application-host', '/dev/sda2',
     { label: 'Alternate', color: 'grey' },
     sbMkButton({ label: 'Update', variant: 'primary', size: 's' }) + ' '
       + sbMkButton({ icon: 'loop-left-line', iconSize: 'M', size: 's', attrs: ' aria-label="Reboot to slot"' })],
    ['2', 'application-host-1.0.1-b51 / application-host', '/dev/sda3',
     { label: 'Active', color: 'green' },
     sbMkButton({ icon: 'loop-left-line', iconSize: 'M', size: 's', attrs: ' aria-label="Reboot to slot"' })],
  ],
});

// Backup — дропзона File Uploader (наш компонент) + restore/save действия.
var backupCard = sbMkCard({
  border: true,
  header: sbMkCardHeader({ title: 'Backup' }),
  body: '<div class="demo-stack">'
    + sbMkUploaderArea({ title: 'Upload Backup', hint: 'TAR archive, single file', multiple: false, wide: true })
    + sbMkFlex({ justify: 'between', full: true, content:
        sbMkButton({ icon: 'arrow-go-back-line', attrs: ' aria-label="Restore backup"' })
        + sbMkButton({ icon: 'save-line', attrs: ' aria-label="Save backup"' }) })
    + '</div>',
});

var mgmtCard = sbMkCard({
  border: true,
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
      + sbMkFlexItem({ grow: 1, basis: '260px', content: '<div class="demo-stack">'
        + sbMkCard({ border: true, body:
            sbMkToggle({ label: 'Link Auto negotiation', labelLeft: true, on: true }) })
        + sbMkCard({ border: true, body: '<div class="demo-stack">'
            + sbMkField({ value: '10.10.140.211', readOnly: true, lineView: true, showTitle: false }, { label: 'Current IP' })
            + sbMkField({ value: 'cc:48:3a:11:e3:21', readOnly: true, lineView: true, showTitle: false }, { label: 'MAC Address' })
            + '</div>' })
        + '</div>' }) }),
});

var ntpCard = sbMkCard({
  border: true,
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
  + '<div class="demo-scroll">'
  + sbMkPage({ cls: 'demo-main', content:
      sbMkCard({
        border: true,
        cls: 'demo-panel',
        body: sbMkHeaderL({ title: 'Management' })
        + '<div class="demo-panel-scroll">'
        + sbMkFlex({ gap: 'lg', wrap: true, full: true, content:
            sbMkFlexItem({ grow: 2, basis: '480px', content: '<div class="demo-stack">'
              + sectionHeader('Update')
              + '<div class="demo-table-frame">' + updateTable + '</div>'
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
  + '</div>'
  + infoFooter();

// ── запись ──────────────────────────────────────────────────────────────────

writeFile('demo/app-host/login.html', page('App Host — Login', loginBody));
writeFile('demo/app-host/events.html', page('App Host — Events', eventsBody));
writeFile('demo/app-host/management.html', page('App Host — Management', mgmtBody));
print('demo/app-host: login.html, events.html, management.html записаны');
