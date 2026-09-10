// ═══════════════════════════════════════════════════════════════════════════
//  ГЕНЕРАТОР npm-ПАКЕТА СТИЛЕЙ (pkg/)
//
//  Запуск из корня репозитория:
//    mkdir -p pkg/css/components pkg/fonts     (однократно, jsc не умеет mkdir)
//    jsc tools/gen-pkg.js
//    cp -p fonts/*.woff2 pkg/fonts/            (бинарники, jsc копирует только текст)
//
//  ЧТО ДЕЛАЕТ. Собирает в pkg/ фреймворк-независимый CSS-пакет DS:
//    pkg/css/tokens.css      — копия css/tokens.css (шрифты + размерные токены)
//    pkg/css/colors.css      — цветовые токены из js/tokens.js (COLOR_TOKENS),
//                              светлая тема — дефолт (:root), тёмная — [data-theme="dark"]
//    pkg/css/base.css        — css/reset.css БЕЗ site-shell правил
//                              (overflow:hidden / height:100vh на body)
//    pkg/css/typography.css  — копия css/typography.css (sb-* классы)
//    pkg/css/components/*.css — копии всех компонентных CSS
//    pkg/css/spacebridge-ds.css — всё вышеперечисленное одним файлом,
//                              порядок компонентов — как в index.html
//    pkg/LICENSE, pkg/NOTICE — копии из корня
//
//  ЧЕГО НЕ ДЕЛАЕТ. pkg/package.json и pkg/README.md создаёт только если их нет
//  (имя пакета и версия — ручные решения, генератор их не перетирает).
//  Шрифты не копирует — см. cp выше; если pkg/fonts пуст, предупреждает.
//
//  Source of truth не меняется: цвета — js/tokens.js, размеры — Figma JSON
//  через gen-tokens.js. Пакет — производная, руками в pkg/css не правят.
// ═══════════════════════════════════════════════════════════════════════════

var ROOT = './';
var PKG = ROOT + 'pkg/';

function tryRead(path) {
  try { return read(path); } catch (e) { return null; }
}

var GEN_NOTE = '/* Файл собран tools/gen-pkg.js — руками не править. */\n\n';

// ── цвета из js/tokens.js ───────────────────────────────────────────────────
// tokens.js в конце инжектит <style> через document — подсовываем заглушку.
var window = {};
var document = {
  createElement: function () { return {}; },
  head: { appendChild: function () {} },
};
load(ROOT + 'js/tokens.js');

var light = '', dark = '';
window.COLOR_TOKENS.forEach(function (g) {
  light += '  /* ' + g.label + ' */\n';
  dark  += '  /* ' + g.label + ' */\n';
  g.tokens.forEach(function (t) {
    light += '  ' + t.name + ': ' + t.light + ';\n';
    dark  += '  ' + t.name + ': ' + t.dark + ';\n';
  });
});
var colorsCss =
  GEN_NOTE +
  '/* Цветовые токены Spacebridge DS. Источник — js/tokens.js (COLOR_TOKENS).\n' +
  '   Светлая тема — дефолт; тёмная включается атрибутом data-theme="dark"\n' +
  '   на <html> (или любом контейнере). */\n\n' +
  ':root,\n[data-theme="light"] {\n' + light + '}\n\n' +
  '[data-theme="dark"] {\n' + dark + '}\n';

// ── base.css: reset без site-shell правил ───────────────────────────────────
var reset = read(ROOT + 'css/reset.css');
var SHELL = '  overflow: hidden;\n  height: 100vh;\n';
if (reset.indexOf(SHELL) < 0) {
  print('ОШИБКА: в css/reset.css не найден site-shell блок (overflow/height на body).');
  print('Паттерн в gen-pkg.js разошёлся с reset.css — поправь SHELL и запусти снова.');
  quit(1);
}
var baseCss = GEN_NOTE + reset.replace(SHELL, '');

// ── порядок компонентов из index.html ───────────────────────────────────────
var indexHtml = read(ROOT + 'index.html');
var COMP_ORDER = [];
indexHtml.replace(/css\/components\/([\w-]+\.css)/g, function (_, f) {
  if (COMP_ORDER.indexOf(f) < 0) COMP_ORDER.push(f);
  return _;
});
if (!COMP_ORDER.length) { print('ОШИБКА: в index.html не найдены css/components/*.css'); quit(1); }

// ── сборка файлов ───────────────────────────────────────────────────────────
var written = 0;
function emit(path, content) { writeFile(path, content); written++; }

var tokensCss = GEN_NOTE + read(ROOT + 'css/tokens.css');
var typoCss = GEN_NOTE + read(ROOT + 'css/typography.css');

emit(PKG + 'css/tokens.css', tokensCss);
emit(PKG + 'css/colors.css', colorsCss);
emit(PKG + 'css/base.css', baseCss);
emit(PKG + 'css/typography.css', typoCss);

var bundle = GEN_NOTE +
  '/* Spacebridge DS — полный бандл стилей. Порядок повторяет index.html DS. */\n\n' +
  tokensCss + '\n' + colorsCss + '\n' + baseCss + '\n' + typoCss + '\n';

COMP_ORDER.forEach(function (f) {
  var css = read(ROOT + 'css/components/' + f);
  emit(PKG + 'css/components/' + f, GEN_NOTE + css);
  bundle += '\n/* ── components/' + f + ' ─────────────────────────────── */\n' + css + '\n';
});

emit(PKG + 'css/spacebridge-ds.css', bundle);

emit(PKG + 'LICENSE', read(ROOT + 'LICENSE'));
emit(PKG + 'NOTICE', read(ROOT + 'NOTICE'));

// ── package.json / README.md — только если нет ──────────────────────────────
if (tryRead(PKG + 'package.json') === null) {
  emit(PKG + 'package.json', JSON.stringify({
    name: '@spacebridge-ds/styles',
    version: '0.1.0',
    description: 'Spacebridge Design System — design tokens, typography and component styles. Framework-agnostic CSS.',
    license: 'Apache-2.0',
    style: 'css/spacebridge-ds.css',
    sideEffects: true,
    files: ['css', 'fonts', 'README.md', 'LICENSE', 'NOTICE'],
    keywords: ['design-system', 'css', 'design-tokens', 'spacebridge'],
    repository: { type: 'git', url: 'https://github.com/susheme/Spacebridge-DS.git' },
  }, null, 2) + '\n');
}

if (tryRead(PKG + 'README.md') === null) {
  emit(PKG + 'README.md', [
    '# @spacebridge-ds/styles',
    '',
    'Design tokens, typography and component styles of the [Spacebridge Design System](https://github.com/susheme/Spacebridge-DS). Framework-agnostic CSS — no JavaScript required.',
    '',
    '## Install',
    '',
    '```sh',
    'npm i @spacebridge-ds/styles',
    '```',
    '',
    '## Usage — Angular',
    '',
    '```json',
    '{',
    '  "projects": {',
    '    "my-project": {',
    '      "architect": {',
    '        "build": {',
    '          "options": {',
    '            "styles": [',
    '              "node_modules/@spacebridge-ds/styles/css/spacebridge-ds.css"',
    '            ]',
    '          }',
    '        }',
    '      }',
    '    }',
    '  }',
    '}',
    '```',
    '',
    '## Usage — plain HTML',
    '',
    '```html',
    '<link rel="stylesheet" href="node_modules/@spacebridge-ds/styles/css/spacebridge-ds.css">',
    '```',
    '',
    '## À la carte',
    '',
    'Instead of the full bundle, pick layers in this order: `css/tokens.css`, `css/colors.css`, `css/base.css`, `css/typography.css`, then any `css/components/*.css`.',
    '',
    '## Theming',
    '',
    'Light theme is the default. Dark theme: set `data-theme="dark"` on `<html>` (or any container).',
    '',
    '## Fonts',
    '',
    'Roboto and Roboto Mono (woff2, latin + cyrillic) ship in `fonts/` and are wired up by `css/tokens.css` via relative paths — no extra setup.',
    '',
  ].join('\n'));
}

// ── шрифты: только проверка ─────────────────────────────────────────────────
if (tryRead(PKG + 'fonts/roboto-latin.woff2') === null) {
  print('ВНИМАНИЕ: pkg/fonts пуст — скопируй шрифты: cp -p fonts/*.woff2 pkg/fonts/');
}

print('pkg/: записано файлов — ' + written + ' (компонентов: ' + COMP_ORDER.length + ')');
