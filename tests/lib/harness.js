// ═══════════════════════════════════════════════════════════════════════════
//  ХАРНЕСС ТЕСТОВ
//  Мини-раннер и DOM-заглушка. Node в системе нет, всё крутится на jsc
//  (JavaScriptCore) — у него есть read(), print() и никакого DOM.
// ═══════════════════════════════════════════════════════════════════════════

var ROOT = '';                       // ставится из run.js
var SUITES = [];                     // [{ title, checks: [{name, fn}] }]
var CURRENT = null;

function suite(title, body) {
  CURRENT = { title: title, checks: [] };
  SUITES.push(CURRENT);
  body();
  CURRENT = null;
}

// fn возвращает: строку-описание при успехе, либо бросает Fail со списком мест.
function check(name, fn) {
  CURRENT.checks.push({ name: name, fn: fn });
}

function Fail(message, places) {
  this.message = message;
  this.places = places || [];
  this.isFail = true;
}

// Основной способ отчитаться о нарушениях: список мест «файл:строка — что».
function expectNone(places, message) {
  if (places && places.length) throw new Fail(message + ' — нарушений: ' + places.length, places);
  return 'чисто';
}

// ── Файловые утилиты ───────────────────────────────────────────────────────
var _cache = {};
function readFile(rel) {
  if (!(rel in _cache)) {
    try { _cache[rel] = read(ROOT + rel) } catch (e) { _cache[rel] = null }
  }
  return _cache[rel];
}

// Список файлов проекта берём из index.html (единственный источник правды о
// составе и порядке — автозагрузчика в проекте нет).
function scriptFiles() {
  var html = readFile('index.html');
  var out = [], re = /<script src="(js\/[^"]+)"><\/script>/g, m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}
function cssFiles() {
  var html = readFile('index.html');
  var out = [], re = /<link[^>]+href="(css\/[^"]+)"/g, m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}
function componentJs() { return scriptFiles().filter(function (f) { return f.indexOf('js/components/') === 0 }) }
function componentCss() { return cssFiles().filter(function (f) { return f.indexOf('css/components/') === 0 }) }

// Обходит файл построчно — почти все статические правила формулируются так.
function eachLine(rel, fn) {
  var src = readFile(rel);
  if (src === null) return;
  var lines = src.split('\n');
  for (var i = 0; i < lines.length; i++) fn(lines[i], i + 1, lines);
}

function place(file, line, what) { return file + ':' + line + ' — ' + what }

// Вырезает /* … */ и // … — правила про цвета и типографику не должны
// срабатывать на пояснениях в комментариях.
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

// ── Запуск ─────────────────────────────────────────────────────────────────
var GREEN = '[32m', RED = '[31m', DIM = '[2m', BOLD = '[1m', OFF = '[0m';

function runAll() {
  var passed = 0, failed = 0, failures = [];
  print('');
  print(BOLD + 'Spacebridge DS — тесты' + OFF);
  for (var i = 0; i < SUITES.length; i++) {
    var s = SUITES[i];
    print('');
    print('  ' + BOLD + s.title + OFF);
    for (var j = 0; j < s.checks.length; j++) {
      var c = s.checks[j], note = '', err = null;
      try { note = c.fn() || '' } catch (e) { err = e }
      if (err) {
        failed++;
        var msg = err.isFail ? err.message : String(err);
        print('    ' + RED + '✗' + OFF + ' ' + c.name + '  ' + RED + msg + OFF);
        var places = err.isFail ? err.places : [];
        for (var k = 0; k < places.length && k < 12; k++) print('        ' + DIM + places[k] + OFF);
        if (places.length > 12) print('        ' + DIM + '… и ещё ' + (places.length - 12) + OFF);
        if (!err.isFail && err.stack) print('        ' + DIM + err.stack.split('\n')[0] + OFF);
        failures.push(s.title + ' / ' + c.name);
      } else {
        passed++;
        print('    ' + GREEN + '✓' + OFF + ' ' + c.name + (note ? '  ' + DIM + note + OFF : ''));
      }
    }
  }
  print('');
  if (failed) {
    print(RED + BOLD + failed + ' провалено' + OFF + ', ' + passed + ' прошло');
    print('');
    return 1;
  }
  print(GREEN + BOLD + 'всё зелено' + OFF + ' — ' + passed + ' проверок');
  print('');
  return 0;
}
