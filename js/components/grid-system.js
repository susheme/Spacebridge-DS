// ═══════════════════════════════════════════════════════════════════════════
//  GRID SYSTEM
//  CSS в css/components/grid-system.css — SYNC-маркеры обязательны.
//
//  Четыре примитива раскладки:
//    sbMkFlex     — ряд или колонка
//    sbMkFlexItem — ребёнок, у которого своё поведение при сжатии
//    sbMkGrid     — карточная сетка, перестраивается сама
//    sbMkPage     — контейнер продуктового экрана
//
//  Колоночной сетки (12 колонок, col-6 и т.п.) здесь СОЗНАТЕЛЬНО нет. В
//  приложении «шесть из двенадцати» ничего не значит, а «этот блок ужался до
//  400px» значит всё — поэтому раскладка держится на flex и container queries
//  самих компонентов. Тем же путём в своё время пошёл Elastic UI.
//
//  И ни одного @media: вся адаптивность приезжает через токены, которые
//  tokens.css раскладывает по режимам Figma (см. tools/gen-tokens.js).
// ═══════════════════════════════════════════════════════════════════════════

window.COMP_CSS['grid-system'] = `/* ── Flex ───────────────────────────────────────────────────────────────── */
.sb-flex {
  display: flex;
  gap: var(--gap-vert-m);
  min-width: 0;   /* иначе flex-ребёнок не даёт родителю ужиматься и ломает ellipsis */
}
.sb-flex.dir-col { flex-direction: column; }
.sb-flex.is-wrap { flex-wrap: wrap; }

/* Gap — по шкале токенов. Вертикальная и горизонтальная оси в Figma заданы
   раздельно, поэтому колонка берёт --gap-vert-*, ряд — --gap-horiz-*. */
.sb-flex.gap-xs  { gap: var(--gap-horiz-xs); }
.sb-flex.gap-s   { gap: var(--gap-horiz-s); }
.sb-flex.gap-m   { gap: var(--gap-horiz-m); }
.sb-flex.gap-lg  { gap: var(--gap-horiz-lg); }
.sb-flex.gap-xl  { gap: var(--gap-horiz-xl); }
.sb-flex.gap-xxl { gap: var(--gap-horiz-xxl); }
.sb-flex.dir-col.gap-xs  { gap: var(--gap-vert-xs); }
.sb-flex.dir-col.gap-s   { gap: var(--gap-vert-s); }
.sb-flex.dir-col.gap-m   { gap: var(--gap-vert-m); }
.sb-flex.dir-col.gap-lg  { gap: var(--gap-vert-lg); }
.sb-flex.dir-col.gap-xl  { gap: var(--gap-vert-xl); }
.sb-flex.dir-col.gap-xxl { gap: var(--gap-vert-xxl); }
.sb-flex.gap-0 { gap: var(--gap-horiz-0); }

/* Раздельные оси. Нужны переносящимся рядам: между строками зазор должен быть
   меньше, чем между соседями в строке, иначе список вариантов расползается.
   Значения приходят инлайновыми переменными — пар «ось × шаг» слишком много,
   чтобы заводить под них классы. */
.sb-flex.gap-split {
  column-gap: var(--sb-gap-x, var(--gap-horiz-m));
  row-gap: var(--sb-gap-y, var(--gap-vert-m));
}

.sb-flex.align-start   { align-items: flex-start; }
.sb-flex.align-center  { align-items: center; }
.sb-flex.align-end     { align-items: flex-end; }
.sb-flex.align-stretch { align-items: stretch; }

.sb-flex.justify-start   { justify-content: flex-start; }
.sb-flex.justify-center  { justify-content: center; }
.sb-flex.justify-end     { justify-content: flex-end; }
.sb-flex.justify-between { justify-content: space-between; }

/* Полная ширина — для колонок форм и любых блоков, тянущихся по контейнеру. */
.sb-flex.is-full { width: 100%; }

/* ── Flex Item ──────────────────────────────────────────────────────────── */
/* Обёртка нужна только тем детям, у кого своё поведение при сжатии. */
.sb-flex-item { min-width: 0; }
/* flex-basis 0 — доли считаются от свободного места, а не от содержимого:
   иначе длинный текст в одном из детей растащил бы колонки. */
.sb-flex-item.is-grow    { flex: 1 1 0; }
.sb-flex-item.no-shrink  { flex-shrink: 0; }

/* ── Grid ───────────────────────────────────────────────────────────────── */
/* auto-fit + minmax: ряд перестраивается сам по ширине контейнера, без единой
   контрольной точки. Минимум задаётся токеном — плитка или карточка. */
.sb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--sb-grid-min), 1fr));
  gap: var(--gap-vert-m) var(--gap-horiz-m);
  width: 100%;
  --sb-grid-min: var(--card-min-width);
}
.sb-grid.min-tile { --sb-grid-min: var(--tile-min-width); }
.sb-grid.gap-xs  { gap: var(--gap-vert-xs) var(--gap-horiz-xs); }
.sb-grid.gap-s   { gap: var(--gap-vert-s) var(--gap-horiz-s); }
.sb-grid.gap-m   { gap: var(--gap-vert-m) var(--gap-horiz-m); }
.sb-grid.gap-lg  { gap: var(--gap-vert-lg) var(--gap-horiz-lg); }
.sb-grid.gap-xl  { gap: var(--gap-vert-xl) var(--gap-horiz-xl); }
.sb-grid.gap-xxl { gap: var(--gap-vert-xxl) var(--gap-horiz-xxl); }

/* Узкий контейнер и минимум шире него — minmax() упёрся бы в переполнение,
   поэтому на этот случай колонка одна. Правило работает и без @media: 1fr
   никогда не заставит трек вылезти за контейнер. */
.sb-grid > * { min-width: 0; }

/* ── Page ───────────────────────────────────────────────────────────────── */
/* Контейнер продуктового экрана: тянется до предела, дальше центрируется.
   Боковые поля — --page-gutter (32 / 24 / 16 по режимам). */
.sb-page {
  width: 100%;
  max-width: var(--screens-max-screen-width);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
  box-sizing: border-box;
}
/* Текстовый предел: на пяти тысячах пикселей строка нечитаема — глаз теряет
   начало следующей. Для статей, настроек, документации. */
.sb-page.width-text { max-width: var(--content-max-width-text); }`;

// --- GRID SYSTEM ---
(() => {

  var GAPS = { 0: 'gap-0', xs: 'gap-xs', s: 'gap-s', m: 'gap-m', lg: 'gap-lg', xl: 'gap-xl', xxl: 'gap-xxl' };

  // Шаг шкалы + ось → токен. Шкала одна, но горизонталь и вертикаль в Figma
  // заданы раздельно и на мобильном расходятся.
  function gapToken(step, axis) {
    if (step === undefined || step === null) step = 'm';
    return 'var(--gap-' + axis + '-' + step + ')';
  }

  /**
   * sbMkFlex({ dir, gap, align, justify, wrap, full, items, content, cls, attrs })
   *
   *   dir     — 'row' (default) | 'col'
   *   gap     — 0 | 'xs' | 's' | 'm' (default) | 'lg' | 'xl' | 'xxl'
   *   gapX    — отступ ПО ГОРИЗОНТАЛИ, если он должен отличаться от gapY
   *   gapY    — отступ ПО ВЕРТИКАЛИ. Пара нужна переносящимся рядам: между
   *             строками зазор обычно меньше, чем между соседями в строке
   *   align   — 'start' | 'center' | 'end' | 'stretch'
   *   justify — 'start' | 'center' | 'end' | 'between'
   *   wrap    — переносить ли детей на новую строку
   *   full    — растянуть контейнер на всю ширину родителя
   *   width   — конкретная ширина ('360px'), если full не подходит
   *   maxWidth— предел ширины ('360px'); частый спутник колонок форм
   *   items   — массив детей. Строка = как есть; объект = props для
   *             sbMkFlexItem, то есть { content, grow, shrink }. Удобно, когда
   *             тянуться должен один ребёнок из трёх — оборачивать вручную не надо.
   *   content — сырой HTML, если items не нужны
   */
  function mkFlex(o) {
    var s = o || {};
    var cls = 'sb-flex';
    if (s.dir === 'col')  cls += ' dir-col';
    if (s.wrap)           cls += ' is-wrap';
    if (s.full)           cls += ' is-full';
    var split = (s.gapX !== undefined || s.gapY !== undefined);
    if (split) {
      cls += ' gap-split';
    } else {
      var gapKey = (s.gap === undefined || s.gap === null) ? 'm' : s.gap;
      if (GAPS[gapKey]) cls += ' ' + GAPS[gapKey];
    }
    if (s.align)          cls += ' align-' + s.align;
    if (s.justify)        cls += ' justify-' + s.justify;
    if (s.cls)            cls += ' ' + s.cls;

    // width / maxWidth — раскладочные свойства, но значений у них бесконечно
    // много, поэтому не классы, а стиль. Оформление (фон, паддинги, рамки)
    // фабрика не принимает намеренно: это не её забота.
    var style = '';
    if (split) {
      style += '--sb-gap-x:' + gapToken(s.gapX, 'horiz') + ';';
      style += '--sb-gap-y:' + gapToken(s.gapY, 'vert') + ';';
    }
    if (s.width)    style += 'width:' + s.width + ';';
    if (s.maxWidth) style += 'max-width:' + s.maxWidth + ';';
    style = style ? ' style="' + style.replace(/;$/, '') + '"' : '';

    var inner = '';
    if (Array.isArray(s.items)) {
      inner = s.items.map(function (it) {
        return (typeof it === 'string') ? it : mkFlexItem(it);
      }).join('');
    } else {
      inner = s.content || '';
    }
    return '<div class="' + cls + '"' + style + (s.attrs || '') + '>' + inner + '</div>';
  }

  /**
   * sbMkFlexItem({ content, grow, shrink, basis, cls, attrs })
   *
   *   grow   — тянуться, занимая свободное место (flex: 1 1 0)
   *   shrink — false запрещает сжиматься; для иконок и кнопок, которые
   *            не должны схлопываться в узком ряду
   *   basis  — стартовая ширина, если нужна конкретная (например '240px')
   *
   * Обёртка опциональная: ребёнку без особого поведения она не нужна.
   */
  function mkFlexItem(o) {
    var s = o || {};
    var cls = 'sb-flex-item';
    if (s.grow)            cls += ' is-grow';
    if (s.shrink === false) cls += ' no-shrink';
    if (s.cls)             cls += ' ' + s.cls;
    var style = s.basis ? ' style="flex-basis:' + s.basis + '"' : '';
    return '<div class="' + cls + '"' + style + (s.attrs || '') + '>' + (s.content || '') + '</div>';
  }

  /**
   * sbMkGrid({ min, gap, content, items, cls, attrs })
   *
   *   min — 'card' (default, 280px) | 'tile' (96px) | своё значение '200px'
   *
   * Ряд перестраивается сам: auto-fit + minmax. Контрольных точек нет — сетка
   * реагирует на ширину КОНТЕЙНЕРА, а не экрана, поэтому одинаково работает и
   * на телефоне, и в узкой колонке на большом мониторе.
   */
  function mkGrid(o) {
    var s = o || {};
    var cls = 'sb-grid';
    if (s.min === 'tile') cls += ' min-tile';
    if (s.gap !== undefined && GAPS[s.gap]) cls += ' ' + GAPS[s.gap];
    if (s.cls) cls += ' ' + s.cls;
    // Произвольный минимум — через переменную, а не отдельный класс: значений
    // может быть сколько угодно, плодить под них классы бессмысленно.
    var custom = (s.min && s.min !== 'tile' && s.min !== 'card')
      ? ' style="--sb-grid-min:' + s.min + '"' : '';
    var inner = Array.isArray(s.items) ? s.items.join('') : (s.content || '');
    return '<div class="' + cls + '"' + custom + (s.attrs || '') + '>' + inner + '</div>';
  }

  /**
   * sbMkPage({ content, width, cls, attrs })
   *
   *   width — 'default' (тянется до --screens-max-screen-width, дальше
   *           центрируется) | 'text' (до --content-max-width-text)
   *
   * Боковые поля — --page-gutter, он же меняется по режимам сам.
   */
  function mkPage(o) {
    var s = o || {};
    var cls = 'sb-page';
    if (s.width === 'text') cls += ' width-text';
    if (s.cls) cls += ' ' + s.cls;
    return '<div class="' + cls + '"' + (s.attrs || '') + '>' + (s.content || '') + '</div>';
  }

  window.sbMkFlex = mkFlex;
  window.sbMkFlexItem = mkFlexItem;
  window.sbMkGrid = mkGrid;
  window.sbMkPage = mkPage;

  // ── Демо ─────────────────────────────────────────────────────────────────
  var cell = function (label, mod) {
    return '<div class="sb-gs-demo' + (mod ? ' ' + mod : '') + '"><span class="sb-body-m">' + label + '</span></div>';
  };
  var frame = function (content) { return '<div class="sb-gs-frame">' + content + '</div>'; };

  sbRegister({
    name: 'grid-system',
    title: 'Grid System',
    description: sbT(
      'Four layout primitives: Flex (a row or a column), Flex Item (a child with its own behaviour when space runs out), Grid (a card grid that reflows on its own) and Page (the screen container). There is no twelve-column grid on purpose — in an application “six of twelve” means nothing, while “this block is down to 400px” means everything.',
      'Четыре примитива раскладки: Flex (ряд или колонка), Flex Item (ребёнок со своим поведением при нехватке места), Grid (карточная сетка, перестраивается сама) и Page (контейнер экрана). Колоночной сетки на двенадцать долей здесь нет намеренно — в приложении «шесть из двенадцати» ничего не значит, а «этот блок ужался до 400px» значит всё.'
    ) + sbDocNote('Tech Info', sbT(
      '<b>API:</b>'
      + '<ul><li><code>sbMkFlex({ dir, gap, align, justify, wrap, full, width, maxWidth, items | content })</code>;</li>'
      + '<li><code>sbMkFlexItem({ content, grow, shrink, basis })</code>;</li>'
      + '<li><code>sbMkGrid({ min, gap, items | content })</code> — min: <code>card</code> (280) / <code>tile</code> (96) / своё значение;</li>'
      + '<li><code>sbMkPage({ content, width })</code> — width: <code>default</code> / <code>text</code>.</li></ul>'
      + '<b>Adaptivity:</b>'
      + '<ul><li>Not a single media query lives in this component;</li>'
      + '<li>Spacing and gutters come from tokens, which tokens.css lays out per Figma mode;</li>'
      + '<li>The grid reflows by CONTAINER width, so it behaves the same on a phone and in a narrow column on a large monitor.</li></ul>',
      '<b>API:</b>'
      + '<ul><li><code>sbMkFlex({ dir, gap, align, justify, wrap, full, width, maxWidth, items | content })</code>;</li>'
      + '<li><code>sbMkFlexItem({ content, grow, shrink, basis })</code>;</li>'
      + '<li><code>sbMkGrid({ min, gap, items | content })</code> — min: <code>card</code> (280) / <code>tile</code> (96) / своё значение;</li>'
      + '<li><code>sbMkPage({ content, width })</code> — width: <code>default</code> / <code>text</code>.</li></ul>'
      + '<b>Адаптивность:</b>'
      + '<ul><li>В компоненте нет ни одного media-запроса;</li>'
      + '<li>Отступы и поля приходят из токенов, которые tokens.css раскладывает по режимам Figma;</li>'
      + '<li>Сетка перестраивается по ширине КОНТЕЙНЕРА — одинаково и на телефоне, и в узкой колонке большого монитора.</li></ul>'
    )),
    playground: {
      title: 'Flex',
      state: { dir: 'row', gap: 'm', align: 'stretch', justify: 'start', wrap: false, grow: false },
      controls(pg) {
        return `${sbPgGroup('Direction & Gap', `
            ${pg.select('dir', [
              { value: 'row', label: 'Row' },
              { value: 'col', label: 'Column' },
            ], { label: 'Direction' })}
            ${pg.select('gap', [
              { value: 'xs',  label: 'XS' },
              { value: 's',   label: 'S' },
              { value: 'm',   label: 'M' },
              { value: 'lg',  label: 'LG' },
              { value: 'xl',  label: 'XL' },
              { value: 'xxl', label: 'XXL' },
            ], { label: 'Gap' })}
          `)}
          ${sbPgGroup('Alignment', `
            ${pg.select('align', [
              { value: 'stretch', label: 'Stretch' },
              { value: 'start',   label: 'Start' },
              { value: 'center',  label: 'Center' },
              { value: 'end',     label: 'End' },
            ], { label: 'Align' })}
            ${pg.select('justify', [
              { value: 'start',   label: 'Start' },
              { value: 'center',  label: 'Center' },
              { value: 'end',     label: 'End' },
              { value: 'between', label: 'Between' },
            ], { label: 'Justify' })}
          `)}
          <div class="pg-toggles">
            ${pg.toggle('wrap', 'Wrap')}
            ${pg.toggle('grow', 'Grow')}
          </div>`;
      },
      render(s) {
        // Третья ячейка с grow показывает, как один ребёнок забирает остаток.
        var items = [
          cell('One'),
          cell('Two'),
          s.grow ? { content: cell('Grow'), grow: true } : cell('Three'),
        ];
        return `<div style="width:100%">${mkFlex({
          dir: s.dir, gap: s.gap, align: s.align, justify: s.justify,
          wrap: s.wrap, full: true, items: items,
        })}</div>`;
      },
      genCode(s) {
        var items = s.grow
          ? "[cellOne, cellTwo, { content: cellThree, grow: true }]"
          : "[cellOne, cellTwo, cellThree]";
        return {
          html: `<!-- sbMkFlex({\n`
            + `  dir: '${s.dir}',\n`
            + `  gap: '${s.gap}',\n`
            + `  align: '${s.align}',\n`
            + `  justify: '${s.justify}',\n`
            + (s.wrap ? `  wrap: true,\n` : '')
            + `  full: true,\n`
            + `  items: ${items},\n`
            + `}) -->`,
          css: COMP_CSS['grid-system'],
        };
      },
    },
    sections: [
      {
        title: sbT('Grid — card and tile', 'Grid — карточки и плитки'),
        desc: sbT(
          'The grid reflows itself: auto-fit plus minmax, no breakpoints involved. Two minimums come from tokens — a card (280px) for content and a tile (96px) for statuses and metrics. Both stretch upwards, so a row is always filled edge to edge. Narrow the window: the columns rearrange on their own.',
          'Сетка перестраивается сама: auto-fit плюс minmax, никаких контрольных точек. Два минимума приходят из токенов — карточка (280px) для содержимого и плитка (96px) для статусов и метрик. Оба тянутся вверх, поэтому ряд всегда заполнен от края до края. Сузь окно — колонки перестроятся сами.'
        ),
        preview: mkFlex({
          dir: 'col', gap: 'lg', full: true,
          items: [
            mkGrid({ items: [cell('Card'), cell('Card'), cell('Card'), cell('Card')] }),
            mkGrid({ min: 'tile', gap: 's', items: [
              cell('96', 'accent'), cell('96'), cell('96'), cell('96'),
              cell('96'), cell('96'), cell('96'), cell('96'),
            ] }),
          ],
        }),
        html: `<!-- sbMkGrid({ items: [card, card, card, card] })\n`
          + `     sbMkGrid({ min: 'tile', gap: 's', items: [tile, tile, …] }) -->`,
        css: COMP_CSS['grid-system'],
      },
      {
        title: sbT('Flex Item — who gives way', 'Flex Item — кто уступает'),
        desc: sbT(
          'A child needs the wrapper only when its behaviour differs from the rest. Grow takes the remaining space — that is how a search field fills a toolbar. Shrink: false forbids shrinking, which is what keeps icons and buttons from collapsing in a tight row. Everything else can be passed as a plain string.',
          'Обёртка нужна ребёнку только там, где его поведение отличается от остальных. Grow забирает остаток свободного места — так поле поиска заполняет тулбар. Shrink: false запрещает сжиматься, и именно это не даёт иконкам и кнопкам схлопнуться в тесном ряду. Всё остальное передаётся обычной строкой.'
        ),
        preview: mkFlex({
          dir: 'col', gap: 'lg', full: true,
          items: [
            mkFlex({ full: true, items: [
              cell('fixed'),
              { content: cell('grow', 'accent'), grow: true },
              cell('fixed'),
            ] }),
            mkFlex({ full: true, items: [
              { content: cell('grow', 'accent'), grow: true },
              { content: cell('no-shrink'), shrink: false },
            ] }),
          ],
        }),
        html: `<!-- sbMkFlex({ full: true, items: [\n`
          + `  left,\n`
          + `  { content: middle, grow: true },\n`
          + `  { content: right, shrink: false },\n`
          + `] }) -->`,
        css: COMP_CSS['grid-system'],
      },
      {
        title: sbT('Page — the screen container', 'Page — контейнер экрана'),
        desc: sbT(
          'Content stretches to the limit and is centred beyond it; side gutters follow --page-gutter (32 / 24 / 16 by mode). The text width is separate: on five thousand pixels a line becomes unreadable — the eye loses the start of the next one — so articles, settings and documentation take the narrower limit.',
          'Контент тянется до предела, дальше центрируется; боковые поля берутся из --page-gutter (32 / 24 / 16 по режимам). Текстовая ширина — отдельно: на пяти тысячах пикселей строка нечитаема, глаз теряет начало следующей, поэтому статьи, настройки и документация берут более узкий предел.'
        ),
        preview: mkFlex({
          dir: 'col', gap: 'lg', full: true,
          items: [
            frame(mkPage({ content: cell('sb-page — default') })),
            frame(mkPage({ width: 'text', content: cell('sb-page — width: text') })),
          ],
        }),
        html: `<!-- sbMkPage({ content })                 — до 5000, дальше по центру\n`
          + `     sbMkPage({ width: 'text', content })   — читаемая ширина текста -->`,
        css: COMP_CSS['grid-system'],
      },
    ],
  });
})();
