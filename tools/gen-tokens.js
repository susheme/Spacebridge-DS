// ═══════════════════════════════════════════════════════════════════════════
//  ГЕНЕРАТОР css/tokens.css ИЗ FIGMA
//
//  Запуск из корня репозитория:
//    jsc tools/gen-tokens.js              — перезаписать css/tokens.css
//    jsc tools/gen-tokens.js -- --check    — только проверить расхождение
//
//  (полный путь к jsc: /System/Library/Frameworks/JavaScriptCore.framework/
//   Versions/A/Helpers/jsc — он идёт с macOS, ставить ничего не нужно)
//
//  Двойной дефис обязателен: без него jsc примет --check за свою опцию.
//  В режиме --check ничего не пишется, только сообщается, разошёлся ли CSS
//  с Figma — так его дёргают тесты.
//
//  ЗАЧЕМ. `Figma Tokens/*.json` — источник правды, `css/tokens.css` до сих пор
//  был написанным руками зеркалом. У переменных Figma ТРИ режима — Desktop,
//  Tablet, Mobile — и 36 из них имеют разные значения по режимам, но в CSS
//  переносили только Desktop. Вся заложенная дизайнером адаптивность в код не
//  доезжала: отступы на телефоне оставались десктопными.
//
//  ЧТО ДЕЛАЕТ. Раскладывает значения mobile-first: базовое объявление в :root
//  берёт мобильное значение, а планшет и десктоп добавляются @media-запросами.
//  Компоненты при этом не трогаются вообще — они как писали var(--gap-horiz-m),
//  так и пишут, значение подставляется по ширине экрана.
//
//  ЧЕГО НЕ ДЕЛАЕТ. Не трогает цвета: они живут в js/tokens.js (COLOR_TOKENS) и
//  переключаются через data-theme, у них своя механика. И не трогает то, что
//  Figma не описывает, — такие токены перечислены в EXTRA ниже.
// ═══════════════════════════════════════════════════════════════════════════

var ROOT = './';
var CHECK_ONLY = false;
if (typeof arguments !== 'undefined') {
  for (var i = 0; i < arguments.length; i++) if (String(arguments[i]) === '--check') CHECK_ONLY = true;
}

var MAP = JSON.parse(read(ROOT + 'tools/token-map.json'));
var TOKENS_CSS = ROOT + 'css/tokens.css';

// Порядок брейкпоинтов: значения берутся из Screens/min-screen-width по режимам
// (Mobile 320 / Tablet 768 / Desktop 1280) — то есть их задаёт Figma, а не код.
var MODE_ORDER = ['Mobile', 'Tablet', 'Desktop'];

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Имя CSS-токена для переменной Figma: сначала явная карта, потом точное
// совпадение нормализованного имени. Угадывать по значению нельзя — молча
// разъехавшийся токен хуже упавшей сборки.
function cssName(file, figmaName, declared) {
  var mapped = MAP[file] && MAP[file][figmaName];
  if (mapped) return mapped;
  var parts = figmaName.split('/');
  var candidates = [
    norm(parts.join('-')),
    norm(parts[parts.length - 1]),
    norm(parts.slice(-2).join('-')),
  ];
  for (var i = 0; i < candidates.length; i++) {
    if (declared['--' + candidates[i]]) return '--' + candidates[i];
  }
  return null;
}

function isSkipped(figmaName) {
  return Object.prototype.hasOwnProperty.call(MAP.skip, figmaName);
}

// Единицы: всё, что не безразмерное, — в px. font-weight, line-height-множители
// и прочие числа без единиц перечислены явно.
var UNITLESS = {
  '--font-weight-light': 1, '--font-weight-regular': 1, '--font-weight-medium': 1,
  '--font-weight-semibold': 1, '--font-weight-bold': 1, '--font-weight-black': 1,
  '--letter-spacing': 1,
};
function fmt(token, value) {
  if (typeof value !== 'number') return String(value);
  if (UNITLESS[token]) return String(value);
  if (value === 0) return '0';
  return value + 'px';
}

// ── Чтение Figma ───────────────────────────────────────────────────────────
function collect(declared) {
  var out = {};            // token -> { Mobile, Tablet, Desktop }
  var problems = [];
  ['Dimensions-DS', 'Typography-DS'].forEach(function (file) {
    var data = JSON.parse(read(ROOT + 'Figma Tokens/' + file + '.json'));
    var modeName = data.modes;                       // id -> 'Desktop' | …
    data.variables.forEach(function (v) {
      if (isSkipped(v.name)) return;
      var byMode = v.valuesByMode || {};
      var sample = byMode[Object.keys(byMode)[0]];
      if (typeof sample === 'string') return;        // строки-примеры из макетов
      var token = cssName(file, v.name, declared);
      if (!token) {
        problems.push(file + ': «' + v.name + '» = ' + sample + ' — нет ни в карте, ни среди объявленных токенов');
        return;
      }
      var vals = {};
      Object.keys(byMode).forEach(function (id) { vals[modeName[id]] = byMode[id] });
      if (out[token]) {
        problems.push('на «' + token + '» претендуют две переменные Figma — уточни tools/token-map.json');
        return;
      }
      out[token] = vals;
    });
  });
  return { tokens: out, problems: problems };
}

// ── Разбор текущего tokens.css ─────────────────────────────────────────────
// Файл держит не только Figma-токены: там радиусы, тени, transition и прочее,
// чего в Figma нет. Такие строки сохраняются как есть.
function parseCss(src) {
  var declared = {}, order = [];
  var re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/g, m;
  while ((m = re.exec(src)) !== null) {
    if (!declared[m[1]]) order.push(m[1]);
    declared[m[1]] = m[2].trim();
  }
  return { declared: declared, order: order };
}

// ── Сборка ─────────────────────────────────────────────────────────────────
function build(src, tokens) {
  var START = '/* ═══ АВТОГЕНЕРАЦИЯ: адаптивные значения (tools/gen-tokens.js) ═══ */';
  var END = '/* ═══ КОНЕЦ АВТОГЕНЕРАЦИИ ═══ */';

  // Ранее сгенерированный блок отрезаем СРАЗУ: иначе цикл ниже пройдётся и по
  // его строкам, и отчёт об изменениях наполнится записями о значениях, которые
  // всё равно будут переписаны заново.
  var cutAt = src.indexOf(START);
  if (cutAt !== -1) src = src.slice(0, cutAt).replace(/\s*$/, '\n');

  var lines = src.split('\n');
  var out = [], changed = [], added = [];

  // Объявлен ли токен среди уже собранных строк.
  function declaredIn(arr, token) {
    for (var k = 0; k < arr.length; k++) {
      if (arr[k].indexOf(token + ':') !== -1) return true;
    }
    return false;
  }

  // 1. Переписываем значения в :root на МОБИЛЬНЫЕ (mobile-first база).
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var m = line.match(/^(\s*)(--[a-z0-9-]+)\s*:\s*([^;]+);(.*)$/);
    if (!m) { out.push(line); continue; }
    var indent = m[1], token = m[2], current = m[3].trim(), tail = m[4];
    var vals = tokens[token];
    if (!vals) { out.push(line); continue; }
    var base = fmt(token, vals[MODE_ORDER[0]] !== undefined ? vals[MODE_ORDER[0]] : vals.Desktop);
    if (base !== current) changed.push(token + ': ' + current + ' → ' + base);
    out.push(indent + token + ': ' + base + ';' + tail);
  }

  // 2. Токены, которых в CSS ещё нет: появились в Figma после прошлой сборки.
  //    Дописываем их в конец :root отдельной секцией — иначе дизайнеру пришлось
  //    бы лезть в CSS руками, а весь смысл в том, чтобы не приходилось.
  var fresh = Object.keys(tokens).filter(function (t) { return !declaredIn(out, t) }).sort();
  if (fresh.length) {
    var rootEnd = -1;
    for (var j = out.length - 1; j >= 0; j--) {
      if (out[j].replace(/\s/g, '') === '}') { rootEnd = j; break; }
    }
    if (rootEnd !== -1) {
      var block = ['', '  /* ───────── НОВОЕ ИЗ FIGMA ─────────',
        '     Появилось в экспорте и добавлено генератором. Перенеси в подходящую',
        '     секцию выше — расположение строк он не трогает. */'];
      fresh.forEach(function (t) {
        var v = tokens[t];
        var base = v[MODE_ORDER[0]] !== undefined ? v[MODE_ORDER[0]] : v.Desktop;
        block.push('  ' + t + ': ' + fmt(t, base) + ';');
        added.push(t + ' = ' + fmt(t, base));
      });
      out = out.slice(0, rootEnd).concat(block, out.slice(rootEnd));
    }
  }

  // 3. Дописываем блок media-запросов для токенов, зависящих от режима.
  var body = out.join('\n');

  var responsive = {};
  Object.keys(tokens).forEach(function (t) {
    var v = tokens[t];
    var uniq = {};
    MODE_ORDER.forEach(function (mode) { if (v[mode] !== undefined) uniq[String(v[mode])] = 1 });
    if (Object.keys(uniq).length > 1) responsive[t] = v;
  });

  var bp = tokens['--screen-min-width'] || {};
  var block = [
    '',
    START,
    '/* База в :root — мобильные значения. Планшет и десктоп добавляются здесь.',
    '   Пороги взяты из Screens/min-screen-width: Tablet ' + (bp.Tablet || 768) +
      ', Desktop ' + (bp.Desktop || 1280) + '.',
    '   Правится НЕ здесь, а в Figma: `jsc tools/gen-tokens.js` перепишет блок. */',
  ];
  [['Tablet', bp.Tablet || 768], ['Desktop', bp.Desktop || 1280]].forEach(function (pair) {
    var mode = pair[0], min = pair[1];
    var rows = Object.keys(responsive).filter(function (t) {
      var v = responsive[t];
      var prev = mode === 'Tablet' ? v.Mobile : v.Tablet;
      return v[mode] !== undefined && v[mode] !== prev;
    }).sort();
    if (!rows.length) return;
    block.push('');
    block.push('@media (min-width: ' + min + 'px) {');
    block.push('  :root {');
    rows.forEach(function (t) { block.push('    ' + t + ': ' + fmt(t, responsive[t][mode]) + ';') });
    block.push('  }');
    block.push('}');
  });
  block.push(END);
  block.push('');

  return { css: body + block.join('\n'), changed: changed, added: added, responsiveCount: Object.keys(responsive).length };
}

// ── Точка входа ────────────────────────────────────────────────────────────
// Тесты подключают этот файл через load() и зовут sbTokensCheck() напрямую —
// запускать процесс jsc из jsc нельзя. Поэтому «main» отделён от библиотеки:
// при выставленном GEN_TOKENS_LIB файл только объявляет функции.

// Возвращает { ok, changed[] } — расходится ли css/tokens.css с Figma.
function sbTokensCheck() {
  var s = read(TOKENS_CSS);
  var p = parseCss(s);
  var c = collect(p.declared);
  if (c.problems.length) return { ok: false, changed: c.problems };
  var b = build(s, c.tokens);
  return { ok: b.css === s, changed: b.changed };
}
globalThis.sbTokensCheck = sbTokensCheck;

if (typeof GEN_TOKENS_LIB !== 'undefined') { /* подключено как библиотека */ } else {
var src = read(TOKENS_CSS);
var parsed = parseCss(src);
var collected = collect(parsed.declared);

if (collected.problems.length) {
  print('НЕ СОПОСТАВЛЕНО — генератор остановлен:');
  collected.problems.forEach(function (p) { print('  ' + p) });
  print('');
  print('Добавь переменную в tools/token-map.json (или в его секцию skip) и запусти снова.');
  throw new Error('карта токенов неполна');
}

var built = build(src, collected.tokens);

if (CHECK_ONLY) {
  if (built.css === src) {
    print('OK — css/tokens.css совпадает с Figma');
  } else {
    print('РАСХОЖДЕНИЕ — css/tokens.css отличается от того, что даёт Figma.');
    built.changed.slice(0, 20).forEach(function (c) { print('  ' + c) });
    if (built.changed.length > 20) print('  … и ещё ' + (built.changed.length - 20));
    print('');
    print('Почини так: jsc tools/gen-tokens.js');
    throw new Error('tokens.css разошёлся с Figma');
  }
} else {
  writeFile(TOKENS_CSS, built.css);
  print('css/tokens.css перезаписан.');
  print('  токенов из Figma: ' + Object.keys(collected.tokens).length);
  print('  зависят от режима: ' + built.responsiveCount);
  if (built.added.length) {
    print('  ДОБАВЛЕНО новых: ' + built.added.length);
    built.added.forEach(function (a) { print('    ' + a) });
  }
  if (built.changed.length) {
    print('  изменено значений: ' + built.changed.length);
    built.changed.slice(0, 15).forEach(function (c) { print('    ' + c) });
    if (built.changed.length > 15) print('    … и ещё ' + (built.changed.length - 15));
  } else {
    print('  значения не изменились');
  }
}
}
