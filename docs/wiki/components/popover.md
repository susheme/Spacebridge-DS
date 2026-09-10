# Popover (примитив)

> Spacebridge DS — Popover (примитив якорного позиционирования) готов 28.07.2026; раздел Pop-Ups переименован; долг — миграция sbOverflowMenuToggle

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-10), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/popover.js` (461 строк) + `css/components/popover.css` (92 строк)
- Load order: 10/53 в `index.html`
- Deps: `buttons` (см. `js/_index.js`)
- Используют его: `section-header`, `selectors`, `header-s`, `header-m`, `header-l`, `tool-bar`, `cards`
- Public API: `sbMkPopover`, `sbMkPopoverPanel`, `sbPopoverOpen`, `sbPopoverClose`, `sbPopoverCloseAll`, `sbPopoverToggle`
- COMP_CSS: `popover`
<!-- GEN:END -->

Popover сделан 28.07.2026: `js/components/popover.js` + `css/components/popover.css`,
раздел `pop-ups` в core.js переименован в `popover` (ready).

**Архитектура — два примитива-близнеца, не «виды всплывашек»:**
- `Overlay` — «поверх всей страницы, со скримом» (модальность).
- `Popover` — «возле вот этого элемента, без скрима» (якорность).
Своего вида у Popover нет: в слот кладут готовый контейнер (обычно `.sb-ctx-card`).
Dropdown / Menu / Info Pop-up / Picker — это **потребители**, а не виды. Отдельных
компонентов под них не заводить. См. [dogma-klementiya](../conventions/dogma-klementiya.md).

**API:** `sbMkPopover({trigger, content, placement, arrow, matchWidth, closeOnSelect, id, cls})`,
`sbPopoverOpen/Close/CloseAll/Toggle`. 12 placements (side-align), flip + shift, offset 8px.

**Гочи:**
- Portal в `<body>` обязателен — `position: fixed` НЕ спасает: предок с
  `transform/filter/contain` становится containing block'ом. См. [overlay-portal](../patterns/overlay-portal.md).
- Якорь внутри `.sb-overlay` → класс `.above-overlay` (z 10000), иначе меню уедет под скрим (9999).
- Замер до показа: `visibility:hidden` даёт layout, `scale()` не влияет на offsetWidth —
  pre-measure хак из `sbOverflowMenuToggle` не нужен.
- Плейграунд: при re-render снимать сироту `#sb-pop-pg` из `<body>` (портал переживает перерисовку).

**🐞 ОТКРЫТЫЙ БАГ в overlay.js (не мой файл, не чинил — сообщил юзеру):**
тот же race в возврате из портала, что был в popover. Быстрый open/close в пределах
фейда (200ms) копит таймеры; опоздавший видит уже обнулённый `_sbHome` → уходит в
`else` и делает `ov.remove()`. Воспроизведено 28.07.2026: 20 циклов → оверлей исчез
из DOM. Фикс тот же — `clearTimeout(_sbReturnT)` + ранний выход `if (!home) return;`.

**Миграция ЗАВЕРШЕНА 28.07.2026** (коммиты b5141b7, 03a0a40): все 30 мест из 8 файлов
(Table, Header L/M/S, Section Header, Tool Bar, Nav Bar) переехали, времянка
`sbOverflowMenuToggle` и CSS-блок `.sb-overflow-menu` удалены.

**Что портал ломает — проверять в КАЖДОМ новом потребителе:**
1. **`@container` не достаёт панель.** Она в `<body>`, а запрос смотрит на ширину
   потребителя. У хедеров/Tool Bar из-за этого пропадали зеркала inline-действий на
   узкой ширине. Решение — хук `onOpen`: потребитель меряет себя на месте
   (`getComputedStyle(inlineBtn).display === 'none'`) и стемпит на панель класс `*-narrow`.
2. **Ховер-меню рвётся.** Переход мыши с триггера на панель = `mouseleave` обёртки.
   Решение — тот же `onOpen` вешает intent-таймеры на саму панель (ховер-мост).
3. **`closest()` вверх от ячейки не находит обёртку.** Идти через `pop._sbAnchor`.
4. **`.is-open` на обёртке** (у Nav Bar по нему крутится шеврон) — примитив зеркалит сам.

**API примитива итогово:** `trigger, content, placement, arrow, matchWidth,
closeOnSelect, id, cls, wrapCls, wrapAttrs, onOpen`. `stopPropagation` и
`flex-shrink: 0` на якоре — поведение по умолчанию.

**03.08.2026 — `sbMkContextCard` + живой Selector.** У карточки меню фабрики не было,
`<div class="sb-ctx-card">` верстался руками в 9 живых местах. Написана
`sbMkContextCard(cells, { tip, cls, attrs })` (context-menu.js), ВСЕ живые места
переведены (header-l/m/s, section-header, tool-bar, nav-bar ×3, table, popover-демо,
свои превью context-menu); в `html:`-примерах доков разметка осталась литералом
намеренно. Selector посажен на Popover: `sbMkSel({ options })` → живая выпадашка
(`bottom-start` + `matchWidth`), связь «панель ↔ поле» через общий uid (`data-sel` на
обёртке + id панели), выбор пишет делегированный слушатель — во внутренности
примитива (`_sbAnchor`) не лезем. Экспортированы `sbMkSel/sbMkSelRow/sbMkSelField`.
Load order: **table.js и selectors.js обязаны идти ПОСЛЕ context-menu.js** (фабрики
зовутся на этапе регистрации); typeof-guard в table снят.
Грабля обёртки Popover'а: у неё нет своих габаритов, поэтому потребителю с
собственным min/max-width надо ПОВТОРИТЬ их на `wrapCls` — иначе в тесном
контейнере обёртка схлопывается в ноль, поле выпирает, а `matchWidth` и позиция
считаются по нулевому якорю.

**Тестировать геометрию можно headless:** Browser pane отдаёт viewport 0×0, поэтому
подменять `document.documentElement.clientWidth/Height` через `Object.defineProperty`
и стабить `getBoundingClientRect` фейкового якоря.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
