// ═══════════════════════════════════════════════════════════════════════════
//  РАНТАЙМ-ПРОВЕРКИ
//  Загружаем DS целиком в порядке index.html и дёргаем то, что она отдаёт.
//  Всё исполняется ОДНИМ eval: top-level `const` из core.js (ICON_PATHS,
//  SB_REGISTRY, SB_PG) иначе останутся в чужом лексическом скоупе и файлы
//  посыплются на ровном месте.
// ═══════════════════════════════════════════════════════════════════════════

load('tests/lib/dom.js');

// Аргументы для фабрик, которым пустого объекта мало. Ключ — имя фабрики,
// значение — набор вызовов (каждый прогоняется отдельно).
var FACTORY_ARGS = {
  sbMkSideNav:      [{ variant: 'menu', embedded: true, tree: [{ role: 'item', label: 'Item' }] }],
  sbMkActionBar:    [{ buttons: [{ label: 'OK', variant: 'primary' }, { label: 'Delete', critical: true }] }],
  sbMkButton:       [{ label: 'Button' }, { icon: 'add-line' }, { label: 'X', variant: 'primary', size: 's', critical: true }],
  sbMkButtonWithLabel: [{ icon: 'add-line', text: 'Label', side: 'left' }],
  sbMkPagination:   [{ total: 40, pageSize: 10, currentPage: 2 }],
  sbMkTabBar:       [['Tab', 'Tab']],
  sbMkToc:          [[{ id: 'one', label: 'One' }, { id: 'two', label: 'Two' }]],
  sbMkTab:          [{ label: 'Tab' }],
  sbMkChip:         [{ label: 'Chip' }],
  sbMkContextCell:  [{ label: 'Cell', iconLeft: 'add-line' }],
  sbMkContextCard:  ['<div></div>'],
  sbMkPopover:      [{ trigger: '<span>t</span>', content: '<div>c</div>' }],
  sbMkHeaderL:      [{ title: 'Headline' }],
  sbMkHeaderM:      [{ title: 'Headline' }],
  sbMkHeaderS:      [{ title: 'Headline' }],
  sbMkHeaderXS:     [{ title: 'Headline' }],
  sbMkHeaderLActions: [{ inline: [{ type: 'icon', icon: 'add-line', label: 'Add' }] }],
  sbMkHeaderMActions: [{ inline: [{ type: 'icon', icon: 'add-line', label: 'Add' }] }],
  sbMkHeaderSActions: [{ inline: [{ type: 'icon', icon: 'add-line', label: 'Add' }] }],
  sbMkSectionHeaderActions: [{ inline: [{ type: 'icon', icon: 'add-line', label: 'Add' }] }],
  sbMkToolBarActions: [{ inline: [{ icon: 'add-line', label: 'Add' }] }],
  sbMkBanner:       [{ type: 'info', title: 'Title', text: 'Text' }],
  sbMkKbd:          ['K'],
  sbMkKbdGroup:     [['⌘', 'K']],
  sbMkBreadcrumbs:  [{ items: [{ label: 'Home' }, { label: 'Page' }] }],
  sbMkSegmentMenu:  [['One', 'Two']],
  sbMkLedPanel:     [{ name: 'NODE', status: 'online' }],
  sbMkInfoFooter:   [{ version: '1.0.0' }],
  sbMkLangSwitcher: [{ selected: 'EN' }],
  sbMkTableToolBar: [{}],
  sbMkOverlay:      [{ id: 'x', content: '<div></div>' }],
  sbMkSnackbar:     [{ text: 'Message' }],
};

// Фабрики, которым нечего вернуть без данных — пустая строка законна.
var MAY_BE_EMPTY = {
  sbMkToolBarActions: 'без inline и more группы действий нет',
  sbMkHeaderLActions: 'то же самое для Header L',
  sbMkHeaderMActions: 'то же самое для Header M',
  sbMkHeaderSActions: 'то же самое для Header S',
  sbMkSectionHeaderActions: 'то же самое для Section Header',
};

var DS = null;          // результат загрузки: { registry, pg, factories }

function loadDS() {
  if (DS) return DS;
  installDom();
  var files = scriptFiles();
  var probe = '\n;globalThis.__DS = { registry: SB_REGISTRY, pg: SB_PG, icons: ICON_PATHS };';
  var bundle = files.map(function (f) {
    return '\n//<<<' + f + '>>>\n' + readFile(f);
  }).join('\n') + probe;
  eval(bundle);
  DS = globalThis.__DS;
  DS.files = files;
  return DS;
}

// Собирает весь HTML, который DS порождает: фабрики, секции доков, genCode.
function allGeneratedHtml() {
  var ds = loadDS(), out = [];
  Object.keys(ds.registry).forEach(function (name) {
    var cfg = ds.registry[name], secs = null;
    try { secs = cfg && cfg.sections } catch (e) { return }
    if (!Array.isArray(secs)) return;
    secs.forEach(function (s, i) {
      if (s && typeof s.html === 'string') out.push({ where: 'section:' + name + '[' + i + ']', html: s.html });
      if (s && typeof s.preview === 'string') out.push({ where: 'preview:' + name + '[' + i + ']', html: s.preview });
    });
  });
  Object.keys(ds.pg._configs || {}).forEach(function (name) {
    var cfg = ds.pg._configs[name];
    if (!cfg) return;
    var state = JSON.parse(JSON.stringify(cfg.state || {}));
    if (typeof cfg.render === 'function') {
      try { out.push({ where: 'render:' + name, html: String(cfg.render(state, ds.pg)) }) } catch (e) {}
    }
    if (typeof cfg.genCode === 'function') {
      try {
        var r = cfg.genCode(state);
        if (r && typeof r.html === 'string') out.push({ where: 'genCode:' + name, html: r.html });
      } catch (e) {}
    }
  });
  return out;
}

suite('Загрузка', function () {

  check('все файлы грузятся и регистрируются', function () {
    var ds = loadDS();
    var n = Object.keys(ds.registry).length;
    if (!n) throw new Fail('ни один компонент не зарегистрировался', []);
    return ds.files.length + ' файлов, ' + n + ' компонентов';
  });

  check('каждый компонент отдаёт документацию', function () {
    var ds = loadDS(), bad = [];
    Object.keys(ds.registry).forEach(function (name) {
      var cfg = ds.registry[name], secs = null;
      try { secs = cfg.sections } catch (e) { bad.push(name + ': геттер sections упал — ' + e); return }
      var hasPg = !!(ds.pg._configs && ds.pg._configs[name]);
      if (!Array.isArray(secs) && !hasPg && !cfg.renderPage) { bad.push(name + ': ни sections, ни playground'); return }
      if (!Array.isArray(secs)) return;
      secs.forEach(function (s, i) {
        // Тайтл может быть sbT(en, ru) — сверяем с allowlist по EN-части.
        var plain = String(s.title || '')
          .replace(/<span class="i18n-ru">[\s\S]*?<\/span>/g, '')
          .replace(/<[^>]+>/g, '');
        if (placeholderSection(name, plain)) return;
        if (!s.html) bad.push(name + '[' + i + '] «' + (s.title || '?') + '»: нет html');
        if (!s.css)  bad.push(name + '[' + i + '] «' + (s.title || '?') + '»: нет css');
      });
    });
    return expectNone(bad, 'документация неполна');
  });
});

suite('Порядок загрузки: скрытые зависимости', function () {

  // Идея: демо-секции вычисляются в момент регистрации компонента. Если чужая
  // фабрика к этому моменту ещё не загружена, guard `typeof sbMkX === 'function'`
  // отдаёт пустую строку — и кусок документации молча пропадает. Ловим,
  // прогоняя бандл ВТОРОЙ раз: там все фабрики уже на месте, и секция, которая
  // в первый раз недосчиталась содержимого, станет длиннее.
  function snapshot(registry) {
    var snap = {};
    Object.keys(registry).forEach(function (name) {
      var cfg = registry[name], secs = null;
      try { secs = cfg.sections } catch (e) { return }
      if (!Array.isArray(secs)) return;
      secs.forEach(function (s, i) {
        var key = name + '[' + i + '] «' + (s.title || '?') + '»';
        snap[key] = ((s.preview || '') + (s.html || '')).length;
      });
    });
    return snap;
  }

  check('демо-секции не теряют содержимое при регистрации', function () {
    var first = snapshot(loadDS().registry);
    // Повторный прогон в уже прогретом окружении.
    var bundle = scriptFiles().map(function (f) { return readFile(f) }).join('\n')
      + '\n;globalThis.__DS2 = { registry: SB_REGISTRY };';
    eval(bundle);
    var second = snapshot(globalThis.__DS2.registry);

    var bad = [];
    Object.keys(second).forEach(function (k) {
      var a = first[k], b = second[k];
      if (a === undefined) return;
      if (b > a) bad.push(k + ': при регистрации ' + a + ' символов, при полной загрузке ' + b
        + ' — не хватило ' + (b - a) + ' (чужая фабрика ещё не была загружена)');
    });
    return expectNone(bad, 'секция документации собирается неполной') + ': ' + Object.keys(second).length + ' секций';
  });
});

suite('Фабрики', function () {

  function factoryNames() {
    var ds = loadDS();
    return Object.keys(globalThis).filter(function (k) {
      return k.indexOf('sbMk') === 0 && typeof globalThis[k] === 'function';
    }).sort();
  }

  check('ни одна фабрика не падает', function () {
    var names = factoryNames(), bad = [];
    names.forEach(function (n) {
      var argsets = FACTORY_ARGS[n] || [{}];
      argsets.forEach(function (a, i) {
        try {
          var out = globalThis[n](a);
          if (typeof out !== 'string') bad.push(n + '#' + i + ': вернула ' + typeof out + ', ожидалась строка');
        } catch (e) {
          bad.push(n + '#' + i + ': ' + e);
        }
      });
    });
    return expectNone(bad, 'фабрика падает или отдаёт не строку') + ': ' + names.length + ' фабрик';
  });

  check('фабрики отдают непустую разметку', function () {
    var names = factoryNames(), bad = [];
    names.forEach(function (n) {
      if (MAY_BE_EMPTY[n]) return;
      var argsets = FACTORY_ARGS[n] || [{}];
      var got = '';
      argsets.forEach(function (a) {
        try { got += String(globalThis[n](a) || '') } catch (e) {}
      });
      if (!got.trim()) bad.push(n + ': пустой результат на всех наборах аргументов');
    });
    return expectNone(bad, 'фабрика ничего не вернула');
  });
});

suite('Переключение языка документации', function () {

  // Ячейка выбора языка живёт в панели Popover, а та уносится порталом в
  // <body>. Значит опознать «это switcher топбара, а не демо на странице»
  // через closest() ОТ ЯЧЕЙКИ нельзя — только через обратную ссылку на якорь.
  // Промах здесь тихий: меню закрывается, буквы в кнопке меняются, а язык
  // документации не переключается и в localStorage ничего не ложится.
  function pickLang(code, insideChrome) {
    var chrome = { closest: function (sel) { return sel === '#dsNavRight' ? chrome : null } };
    var outside = { closest: function () { return null } };
    var anchor = insideChrome ? chrome : outside;
    anchor.querySelector = function () { return { textContent: '' } };
    anchor.classList = { add: function () {}, remove: function () {}, contains: function () { return false } };

    var pop = { _sbAnchor: anchor, classList: anchor.classList, querySelectorAll: function () { return [] } };
    var cell = {
      parentElement: { querySelectorAll: function () { return [] } },
      classList: { add: function () {}, remove: function () {} },
      closest: function (sel) { return sel === '.sb-popover' ? pop : null },
    };
    globalThis.sbNavBarLangPick(cell, code);
  }

  check('выбор языка в топбаре применяется и сохраняется', function () {
    loadDS();
    globalThis.__fireReady();                    // навешивает обёртку из docs-i18n.js
    if (typeof globalThis.sbNavBarLangPick !== 'function') throw new Fail('sbNavBarLangPick не определён', []);

    localStorage.clear();
    pickLang('RU', true);
    var attr = document.documentElement.getAttribute('data-lang');
    var saved = localStorage.getItem('sb-lang');
    var bad = [];
    if (attr !== 'ru') bad.push('после выбора RU html[data-lang] = ' + attr + ', ожидалось ru');
    if (saved !== 'ru') bad.push('в localStorage[sb-lang] легло ' + saved + ', ожидалось ru — язык не переживёт перезагрузку');

    pickLang('EN', true);
    if (document.documentElement.getAttribute('data-lang') !== 'en') bad.push('обратное переключение на EN не сработало');
    return expectNone(bad, 'переключение языка не доезжает');
  });

  check('switcher в демо Nav Bar не трогает язык документации', function () {
    loadDS();
    globalThis.__fireReady();
    localStorage.clear();
    // sbSetDocLang — top-level функция внутри бандла, снаружи не видна;
    // выставляем исходное состояние напрямую.
    document.documentElement.setAttribute('data-lang', 'en');
    pickLang('RU', false);                       // тот же клик, но вне топбара
    var bad = [];
    if (document.documentElement.getAttribute('data-lang') !== 'en') {
      bad.push('демо-switcher на странице Nav Bar переключил язык всей документации');
    }
    return expectNone(bad, 'демо-компонент влияет на хром DS');
  });
});

suite('Целостность разметки', function () {

  check('в выводе нет undefined / [object Object] / NaN', function () {
    var bad = [];
    allGeneratedHtml().forEach(function (b) {
      ['undefined', '[object Object]', 'NaN'].forEach(function (junk) {
        if (b.html.indexOf(junk) !== -1) {
          var i = b.html.indexOf(junk);
          bad.push(b.where + ': «' + junk + '» в ' + b.html.slice(Math.max(0, i - 40), i + 20).replace(/\s+/g, ' ') + '»');
        }
      });
    });
    return expectNone(bad, 'в разметку протёк мусор');
  });

  check('нет пустых кнопок', function () {
    var bad = [];
    allGeneratedHtml().forEach(function (b) {
      var hits = b.html.match(/<button[^>]*><\/button>|<a[^>]*class="sb-btn[^"]*"[^>]*><\/a>/g);
      if (hits) bad.push(b.where + ': ' + hits.length + ' шт — ' + hits[0].slice(0, 80));
    });
    return expectNone(bad, 'кнопка без содержимого — потерян лейбл или иконка');
  });

  check('классы кнопок в каноническом порядке', function () {
    // Канон: sb-btn → вариант → critical → размер → icon → loading → cls.
    var RANK = {
      'sb-btn': 0,
      'sb-btn-primary': 1, 'sb-btn-secondary': 1, 'sb-btn-text': 1, 'sb-btn-link': 1,
      'sb-btn-critical': 2,
      'sb-btn-sm': 3, 'sb-btn-mini': 3,
      'sb-btn-icon': 4, 'sb-btn-icon-2': 4,
      'sb-btn-loading': 5,
    };
    var bad = [], checked = 0, seen = {};
    allGeneratedHtml().forEach(function (b) {
      var btns = b.html.match(/class="sb-btn[^"]*"/g) || [];
      btns.forEach(function (c) {
        var parts = c.slice(7, -1).split(/\s+/).filter(Boolean);
        var last = -1, ok = true;
        parts.forEach(function (p) {
          var r = (p in RANK) ? RANK[p] : 6;      // потребительский класс — всегда последним
          if (r < last) ok = false;
          last = r;
        });
        checked++;
        if (!ok && !seen[c]) { seen[c] = true; bad.push(b.where + ': ' + c) }
      });
    });
    return expectNone(bad, 'порядок классов кнопки нарушен') + ': ' + checked + ' кнопок';
  });

  check('теги в сгенерированной разметке сбалансированы', function () {
    var VOID = { br: 1, hr: 1, img: 1, input: 1, meta: 1, link: 1, path: 1, circle: 1, rect: 1, use: 1, source: 1, col: 1 };
    var bad = [];
    allGeneratedHtml().forEach(function (b) {
      var html = b.html.replace(/<!--[\s\S]*?-->/g, '');
      var stack = [], re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g, m, broke = null;
      while ((m = re.exec(html)) !== null) {
        var closing = m[1] === '/', tag = m[2].toLowerCase(), self = /\/\s*$/.test(m[3]);
        if (VOID[tag] || self) continue;
        if (!closing) stack.push(tag);
        else {
          var top = stack.pop();
          if (top !== tag) { broke = 'ожидался </' + top + '>, встретился </' + tag + '>'; break }
        }
      }
      if (broke) bad.push(b.where + ': ' + broke);
      else if (stack.length) bad.push(b.where + ': не закрыт <' + stack[stack.length - 1] + '>');
    });
    return expectNone(bad, 'разметка не сбалансирована');
  });
});
