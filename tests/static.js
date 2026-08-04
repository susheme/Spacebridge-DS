// ═══════════════════════════════════════════════════════════════════════════
//  СТАТИЧЕСКИЕ ПРОВЕРКИ
//  Правила из CLAUDE.md, за которыми до сих пор следила только внимательность.
//  Ничего не исполняют — читают исходники как текст.
// ═══════════════════════════════════════════════════════════════════════════

suite('Догма Клементия', function () {

  check('разметка кнопок только через фабрику', function () {
    var bad = [];
    var files = scriptFiles().concat(['index.html']);
    files.forEach(function (f) {
      eachLine(f, function (line, n) {
        if (/<button[^>]*class="sb-btn/.test(line) || /<a[^>]*class="sb-btn/.test(line)) {
          bad.push(place(f, n, 'рукописная кнопка — нужен sbMkButton()'));
        }
      });
    });
    return expectNone(bad, 'кнопки верстаются руками в обход sbMkButton');
  });

  check('цвета только через var(--token)', function () {
    var bad = [];
    componentCss().forEach(function (f) {
      var src = stripComments(readFile(f) || '');
      src.split('\n').forEach(function (line, i) {
        if (/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(line)) bad.push(place(f, i + 1, 'хардкод цвета: ' + line.trim().slice(0, 60)));
      });
    });
    componentJs().forEach(function (f) {
      var src = stripComments(readFile(f) || '');
      src.split('\n').forEach(function (line, i) {
        if (!/#[0-9a-fA-F]{3,6}['"\s;)]|rgba?\(/.test(line)) return;
        if (colorAllowed(f, line)) return;
        bad.push(place(f, i + 1, 'хардкод цвета: ' + line.trim().slice(0, 60)));
      });
    });
    return expectNone(bad, 'цвет задан мимо токена');
  });

  check('иконки только через sbIcon/sbIconRaw', function () {
    var bad = [];
    componentJs().forEach(function (f) {
      if (svgAllowed(f)) return;
      eachLine(f, function (line, n) {
        var code = stripComments(line);
        if (/<svg/.test(code)) bad.push(place(f, n, 'инлайновый <svg> — нужен sbIcon()'));
      });
    });
    return expectNone(bad, 'svg инлайнится в обход sbIcon');
  });

  check('раскладка только через Grid System', function () {
    // Инлайновый flex, состоящий ТОЛЬКО из раскладочных свойств, — это
    // sbMkFlex, написанный руками. Стиль, который вдобавок несёт оформление
    // (фон, паддинги, рамку), не в счёт: фабрика раскладки такого не принимает
    // и принимать не должна.
    var LAYOUT = {
      'display': 1, 'flex-direction': 1, 'gap': 1, 'align-items': 1,
      'justify-content': 1, 'flex-wrap': 1, 'width': 1, 'max-width': 1,
    };
    var bad = [];
    componentJs().forEach(function (f) {
      eachLine(f, function (line, n) {
        var m = line.match(/style="([^"]*display:\s*flex[^"]*)"/);
        if (!m) return;
        var decls = m[1].split(';');
        var onlyLayout = true;
        for (var i = 0; i < decls.length; i++) {
          var d = decls[i].trim();
          if (!d) continue;
          if (!LAYOUT[d.split(':')[0].trim()]) { onlyLayout = false; break; }
        }
        if (onlyLayout) bad.push(place(f, n, 'инлайновая раскладка — нужен sbMkFlex(): ' + m[1].slice(0, 50)));
      });
    });
    return expectNone(bad, 'flex верстается инлайном в обход Grid System');
  });

  check('типографика только через sb-* классы', function () {
    var bad = [];
    componentJs().forEach(function (f) {
      eachLine(f, function (line, n) {
        var m = line.match(/style="[^"]*font-(size|weight|family)[^"]*"/);
        if (!m || typoKnown(f, line)) return;
        bad.push(place(f, n, 'инлайновая типографика: ' + m[0].slice(0, 60)));
      });
    });
    return expectNone(bad, 'font-* задан инлайном вместо sb-* класса');
  });
});

suite('SYNC: CSS-файл ↔ копия в JS', function () {

  // Раскладывает правила ПО КАЖДОМУ селектору группы: в CSS часто пишут
  // «.x.selected, .x:focus-within { … }», а копия для доков оставляет один
  // селектор из группы — это норма. Сверяем не селекторы, а ТЕЛА.
  function bodiesBySelector(css) {
    var map = {}, all = rules(css);
    Object.keys(all).forEach(function (r) {
      var i = r.indexOf('{');
      var sel = r.slice(0, i), body = r.slice(i + 1, -1);
      if (sel.charAt(0) === '@') return;
      sel.split(',').forEach(function (one) {
        var k = one.replace(/\s+/g, ' ').trim();
        if (!k) return;
        // Селектор может объявляться в CSS несколько раз (базовое правило +
        // доборы ниже по файлу). Держим все тела — копия вправе повторять любое.
        (map[k] = map[k] || []).push(body);
      });
    });
    return map;
  }

  // Разбирает CSS на нормализованные правила «селектор{тело}». Достаточно
  // грубо, но одинаково с обеих сторон — сравниваются множества.
  function rules(css) {
    var out = {}, depth = 0, buf = '', sel = '';
    var noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    for (var i = 0; i < noComments.length; i++) {
      var ch = noComments[i];
      if (ch === '{') {
        depth++;
        if (depth === 1) { sel = buf.trim(); buf = ''; continue }
      } else if (ch === '}') {
        depth--;
        if (depth === 0) {
          var key = sel.replace(/\s+/g, ' ');
          var body = buf.replace(/\s+/g, ' ').trim();
          // @media/@container — тело содержит вложенные правила, кладём целиком
          out[key + '{' + body + '}'] = true;
          buf = ''; sel = '';
          continue;
        }
      }
      buf += ch;
    }
    return out;
  }

  check('маркеры парны', function () {
    var bad = [];
    componentCss().forEach(function (f) {
      var src = readFile(f) || '';
      var open = (src.match(/\[SYNC:[^\]]+\]/g) || []).filter(function (t) { return t.indexOf('[/') !== 0 });
      var close = src.match(/\[\/SYNC:[^\]]+\]/g) || [];
      var names = open.map(function (t) { return t.slice(6, -1) }).sort().join(',');
      var cnames = close.map(function (t) { return t.slice(7, -1) }).sort().join(',');
      if (!open.length) bad.push(place(f, 1, 'нет SYNC-маркеров'));
      else if (names !== cnames) bad.push(place(f, 1, 'маркеры не совпадают: [' + names + '] против [' + cnames + ']'));
    });
    return expectNone(bad, 'SYNC-маркеры разъехались') + ': ' + componentCss().length + ' файлов';
  });

  check('копия COMP_CSS не отстала от CSS-файла', function () {
    var bad = [], checked = 0;
    // Имя CSS-файла не всегда совпадает с именем JS (counters.js → counter.css,
    // separators.js → separator.css), поэтому ищем правило во всех
    // компонентных стилях сразу.
    var cssBodies = {};
    componentCss().forEach(function (f) {
      var m = bodiesBySelector(readFile(f) || '');
      Object.keys(m).forEach(function (k) {
        cssBodies[k] = (cssBodies[k] || []).concat(m[k]);
      });
    });
    componentJs().forEach(function (jsFile) {
      var js = readFile(jsFile);
      if (js === null) return;
      // Все шаблонные строки, присвоенные в COMP_CSS (в т.ч. вложенные ключи).
      var re = /COMP_CSS(?:\.[A-Za-z0-9_]+|\[['"][^'"]+['"]\])?\s*=\s*([\s\S]*?);\n(?=\n|\/\/|window|\()/g;
      var m;
      while ((m = re.exec(js)) !== null) {
        var blob = m[1];
        var tpl = blob.match(/`[\s\S]*?`/g) || [];
        tpl.forEach(function (t) {
          var copy = t.slice(1, -1);
          if (copy.indexOf('{') === -1) return;
          var copyRules = rules(copy);
          Object.keys(copyRules).forEach(function (r) {
            // ${...} внутри копии сравнивать нечем — пропускаем такие правила.
            if (r.indexOf('${') !== -1) return;
            var i = r.indexOf('{');
            var sel = r.slice(0, i), body = r.slice(i + 1, -1);
            if (sel.charAt(0) === '@') return;   // @media/@container — вложенные, сверяются целиком
            checked++;
            // Группы разбираем с обеих сторон: и копия, и CSS вправе писать
            // «.a, .b { … }» — важно, чтобы тело каждого селектора совпадало.
            var parts = sel.split(',').map(function (x) { return x.replace(/\s+/g, ' ').trim() }).filter(Boolean);
            var missing = [], stale = [];
            parts.forEach(function (one) {
              if (docOnlyRule(one)) return;      // сниппет для потребителя, в DS не применяется
              var variants = cssBodies[one];
              if (!variants) missing.push(one);
              else if (variants.indexOf(body) === -1) stale.push(one);
            });
            if (missing.length) bad.push(place(jsFile, 1, 'селектора нет ни в одном css/components: ' + missing.join(', ')));
            else if (stale.length === parts.length) bad.push(place(jsFile, 1, 'копия отстала от CSS: ' + sel));
          });
        });
      }
    });
    return expectNone(bad, 'JS-копия CSS разошлась с файлом') + ': ' + checked + ' правил';
  });
});

suite('Токены ↔ Figma', function () {

  check('css/tokens.css собран из Figma', function () {
    // Токены — единственное место, где источник правды лежит ВНЕ репозитория.
    // Пока перенос был ручным, из трёх режимов Figma в CSS доезжал только
    // Desktop, и адаптивность, заложенная в макетах, в коде не существовала.
    // Проверка гоняет генератор в режиме --check: расхождение = кто-то правил
    // tokens.css руками либо забыл перегенерировать после обновления JSON.
    GEN_TOKENS_LIB = true;                 // грузим генератор как библиотеку
    load('tools/gen-tokens.js');
    var res = sbTokensCheck();
    if (res.ok) return 'совпадает';
    throw new Fail('tokens.css разошёлся с Figma — почини `jsc tools/gen-tokens.js`', res.changed);
  });
});

suite('Ссылочная целостность', function () {

  check('все var(--token) объявлены', function () {
    var declared = {};
    ['css/tokens.css', 'css/typography.css', 'css/layout.css', 'css/playground.css'].forEach(function (f) {
      var src = readFile(f);
      if (!src) return;
      (src.match(/--[A-Za-z0-9-]+\s*:/g) || []).forEach(function (d) {
        declared[d.replace(/\s*:$/, '')] = true;
      });
    });
    componentCss().forEach(function (f) {
      (readFile(f).match(/--[A-Za-z0-9-]+\s*:/g) || []).forEach(function (d) {
        declared[d.replace(/\s*:$/, '')] = true;
      });
    });
    // Цветовые токены объявлены не в CSS, а в js/tokens.js (COLOR_TOKENS) —
    // оттуда их раскладывает по :root рантайм, см. init.
    (readFile('js/tokens.js') || '').match(/name:\s*'(--[A-Za-z0-9-]+)'/g, '').forEach(function (d) {
      declared[d.match(/'(--[A-Za-z0-9-]+)'/)[1]] = true;
    });
    var bad = [], seen = {};
    componentCss().forEach(function (f) {
      eachLine(f, function (line, n) {
        // var(--x, fallback) — осознанная точка расширения: значение задаёт
        // хост (JS или родительский компонент), объявления в токенах быть не
        // должно. Ошибка — только var(--x) без запасного значения.
        var used = line.match(/var\(\s*--[A-Za-z0-9-]+\s*[,)]/g) || [];
        used.forEach(function (u) {
          if (u.charAt(u.length - 1) === ',') return;
          var name = u.replace(/var\(\s*/, '').replace(/\s*\)$/, '');
          if (declared[name] || runtimeVar(name) || seen[name + f]) return;
          seen[name + f] = true;
          bad.push(place(f, n, 'токен не объявлен и без фолбэка: ' + name));
        });
      });
    });
    return expectNone(bad, 'ссылка на несуществующий токен') + ': ' + Object.keys(declared).length + ' токенов';
  });

  check('все имена иконок есть в ICON_PATHS', function () {
    var core = readFile('js/core.js');
    var known = {};
    ['ICON_PATHS', 'ICON_PATHS_S'].forEach(function (dict) {
      var i = core.indexOf('const ' + dict + ' = {');
      if (i === -1) return;
      var chunk = core.slice(i, core.indexOf('\n};', i));
      (chunk.match(/^\s*'[^']+'\s*:/gm) || []).forEach(function (k) {
        known[k.trim().replace(/'/g, '').replace(/:$/, '')] = true;
      });
    });
    var bad = [], seen = {};
    scriptFiles().forEach(function (f) {
      eachLine(f, function (line, n) {
        var calls = line.match(/sbIconRaw?\(\s*'([^']+)'/g) || [];
        calls.forEach(function (c) {
          var name = c.match(/'([^']+)'/)[1];
          if (known[name] || seen[name]) return;
          seen[name] = true;
          bad.push(place(f, n, 'иконки нет в ICON_PATHS: ' + name));
        });
      });
    });
    return expectNone(bad, 'вызов несуществующей иконки') + ': ' + Object.keys(known).length + ' иконок';
  });
});

suite('Порядок загрузки', function () {

  function indexEntries() {
    var src = readFile('js/_index.js');
    var out = [], re = /\{\s*name:\s*'([^']+)',\s*file:\s*'([^']+)',\s*deps:\s*\[([^\]]*)\]/g, m;
    while ((m = re.exec(src)) !== null) {
      out.push({
        name: m[1],
        file: 'js/components/' + m[2],
        deps: (m[3].match(/'[^']+'/g) || []).map(function (d) { return d.replace(/'/g, '') }),
      });
    }
    return out;
  }

  check('_index.js описывает все загружаемые компоненты', function () {
    var described = {};
    indexEntries().forEach(function (e) { described[e.file] = true });
    var bad = componentJs().filter(function (f) { return !described[f] })
      .map(function (f) { return place('js/_index.js', 1, 'компонент грузится, но не описан: ' + f) });
    return expectNone(bad, '_index.js отстал от index.html') + ': ' + Object.keys(described).length + ' записей';
  });

  check('зависимости грузятся раньше зависимых', function () {
    var order = {}, files = scriptFiles();
    files.forEach(function (f, i) { order[f] = i });
    var byName = {};
    indexEntries().forEach(function (e) { byName[e.name] = e.file });
    var bad = [];
    indexEntries().forEach(function (e) {
      if (!(e.file in order)) { bad.push(place('js/_index.js', 1, e.name + ': файл не подключён в index.html')); return }
      e.deps.forEach(function (d) {
        var depFile = byName[d];
        if (!depFile) { bad.push(place('js/_index.js', 1, e.name + ': зависимость "' + d + '" не описана')); return }
        if (!(depFile in order)) { bad.push(place('js/_index.js', 1, d + ': файл не подключён в index.html')); return }
        if (order[depFile] > order[e.file]) {
          bad.push(place('index.html', 1, e.name + ' грузится раньше своей зависимости ' + d));
        }
      });
    });
    return expectNone(bad, 'порядок <script> нарушает deps');
  });
});
