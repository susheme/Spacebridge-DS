// ═══════════════════════════════════════════════════════════════════════════
//  ГЕНЕРАТОР СКЕЛЕТОВ docs/wiki/components/*.md
//
//  Запуск из корня репозитория:
//    jsc tools/gen-wiki.js
//
//  ЧТО ДЕЛАЕТ. Для каждого компонента из js/_index.js (SB_COMPONENTS) собирает
//  «факты из кода»: файлы и их размер, место в load order, deps и обратные
//  зависимости, public API (window.sb*), ключи COMP_CSS, title из sbRegister.
//  Пишет их в docs/wiki/components/<name>.md между маркерами GEN:BEGIN/GEN:END.
//
//  ЧЕГО НЕ ДЕЛАЕТ. Ручной текст страниц не трогает: всё вне маркеров
//  сохраняется как есть. Нет страницы — создаёт скелет с пустыми «Заметками».
//  Секция Components в docs/wiki/INDEX.md пересобирается между маркерами
//  GEN:COMPONENTS — хук строки берётся из первой «> …» цитаты страницы.
//
//  Факты устаревают → перегоняй после заметных правок компонентов.
// ═══════════════════════════════════════════════════════════════════════════

var ROOT = './';
var WIKI = ROOT + 'docs/wiki/';
var TODAY = new Date().toISOString().slice(0, 10);

var window = {};
load(ROOT + 'js/_index.js');
var COMPONENTS = window.SB_COMPONENTS;

function tryRead(path) {
  try { return read(path); } catch (e) { return null; }
}
function lineCount(s) { return s.split('\n').length; }

// ── load order из index.html ────────────────────────────────────────────────
var indexHtml = read(ROOT + 'index.html');
var ORDER = [];
indexHtml.replace(/js\/components\/([\w-]+\.js)/g, function (_, f) {
  if (ORDER.indexOf(f) < 0) ORDER.push(f);
  return _;
});

// ── обратные зависимости ────────────────────────────────────────────────────
var USED_BY = {};
COMPONENTS.forEach(function (c) {
  (c.deps || []).forEach(function (d) {
    (USED_BY[d] = USED_BY[d] || []).push(c.name);
  });
});

// ── факты по каждому js-файлу (кэш: list.js делят два компонента) ──────────
var FILE_FACTS = {};
function fileFacts(file) {
  if (FILE_FACTS[file]) return FILE_FACTS[file];
  var js = read(ROOT + 'js/components/' + file);
  var cssPath = 'css/components/' + file.replace('.js', '.css');
  var css = tryRead(ROOT + cssPath);

  var api = [], seen = {};
  js.replace(/window\.([A-Za-z$][\w$]*)\s*=/g, function (_, n) {
    if (n.charAt(0) !== '_' && n !== 'COMP_CSS' && !seen[n]) { seen[n] = 1; api.push(n); }
    return _;
  });
  var compCss = [], seenK = {};
  js.replace(/window\.COMP_CSS(?:\.([\w$]+)|\[['"]([\w$-]+)['"]\])/g, function (_, dot, br) {
    var k = dot || br;
    if (!seenK[k]) { seenK[k] = 1; compCss.push(k); }
    return _;
  });
  var titles = {}; // name из sbRegister → title
  js.replace(/sbRegister\(\{\s*\n\s*name:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)'/g,
    function (_, n, t) { titles[n] = t; return _; });

  return (FILE_FACTS[file] = {
    jsLines: lineCount(js), cssPath: cssPath,
    cssLines: css === null ? null : lineCount(css),
    api: api, compCss: compCss, titles: titles,
  });
}

// ── сборка GEN-блока ────────────────────────────────────────────────────────
function humanize(name) {
  return name.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
}
function code(list) { return list.map(function (x) { return '`' + x + '`'; }).join(', '); }

function genBlock(c) {
  var f = fileFacts(c.file);
  var pos = ORDER.indexOf(c.file);
  var shared = COMPONENTS.filter(function (o) { return o.file === c.file && o.name !== c.name; });
  var L = [];
  L.push('<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (' + TODAY + '), между маркерами руками не править -->');
  L.push('**Факты из кода:**');
  L.push('- Файлы: `js/components/' + c.file + '` (' + f.jsLines + ' строк)' +
    (f.cssLines !== null ? ' + `' + f.cssPath + '` (' + f.cssLines + ' строк)' : ' — CSS-файла нет'));
  if (shared.length) L.push('- Файл общий с: ' + code(shared.map(function (o) { return o.name; })));
  L.push('- Load order: ' + (pos < 0 ? 'НЕ НАЙДЕН в index.html!' : (pos + 1) + '/' + ORDER.length + ' в `index.html`'));
  L.push('- Deps: ' + ((c.deps || []).length ? code(c.deps) : 'нет') + ' (см. `js/_index.js`)');
  L.push('- Используют его: ' + (USED_BY[c.name] ? code(USED_BY[c.name]) : 'никто'));
  L.push('- Public API: ' + (f.api.length ? code(f.api) : 'нет window-экспортов'));
  L.push('- COMP_CSS: ' + (f.compCss.length ? code(f.compCss) : 'нет'));
  L.push('<!-- GEN:END -->');
  return L.join('\n');
}

// ── запись страниц ──────────────────────────────────────────────────────────
var created = 0, updated = 0;
COMPONENTS.forEach(function (c) {
  var path = WIKI + 'components/' + c.name + '.md';
  var block = genBlock(c);
  var page = tryRead(path);
  var title = fileFacts(c.file).titles[c.name] || humanize(c.name);

  if (page === null) {
    page = '# ' + title + '\n\n' +
      '> ' + title + ' — скелет; заметки заполняются по ходу работы.\n\n' +
      block + '\n\n## Заметки\n\n—\n';
    created++;
  } else if (page.indexOf('<!-- GEN:BEGIN') >= 0) {
    page = page.replace(/<!-- GEN:BEGIN[\s\S]*?<!-- GEN:END -->/, block);
    updated++;
  } else {
    // вставить после первого заголовка и (если есть) его "> …" цитаты
    var lines = page.split('\n');
    var at = 0;
    while (at < lines.length && lines[at].indexOf('# ') !== 0) at++;
    at++;
    while (at < lines.length && (lines[at].trim() === '' || lines[at].indexOf('> ') === 0)) at++;
    lines.splice(at, 0, block, '');
    page = lines.join('\n');
    updated++;
  }
  writeFile(path, page);
});

// ── секция Components в INDEX.md ────────────────────────────────────────────
function hook(name, fallback) {
  var page = tryRead(WIKI + 'components/' + name + '.md') || '';
  var m = page.match(/^> (.+)$/m);
  var h = m ? m[1].trim() : fallback;
  if (h.length > 110) h = h.slice(0, 110).replace(/\s+\S*$/, '') + '…';
  return h;
}
var rows = COMPONENTS.map(function (c) {
  var title = fileFacts(c.file).titles[c.name] || humanize(c.name);
  return '- [' + c.name + '.md](components/' + c.name + '.md) — ' + hook(c.name, title);
});
var idx = read(WIKI + 'INDEX.md');
var GEN_RE = /<!-- GEN:COMPONENTS:BEGIN[^>]*-->[\s\S]*?<!-- GEN:COMPONENTS:END -->/;
if (!GEN_RE.test(idx)) {
  print('ОШИБКА: в INDEX.md нет маркеров GEN:COMPONENTS:BEGIN/END — секция не обновлена.');
} else {
  idx = idx.replace(GEN_RE,
    '<!-- GEN:COMPONENTS:BEGIN — список собирает `jsc tools/gen-wiki.js`, руками не править -->\n' +
    rows.join('\n') +
    '\n<!-- GEN:COMPONENTS:END -->');
  writeFile(WIKI + 'INDEX.md', idx);
}

print('docs/wiki/components: создано ' + created + ', обновлено ' + updated +
  ' (всего компонентов: ' + COMPONENTS.length + ')');
