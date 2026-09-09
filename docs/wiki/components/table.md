# Table

> Spacebridge DS — компонент Table (хедеры, ячейки, состояния, footer, tool bar, пагинация, kebab). Статус: Incomplete (09.09.2026, решение юзера; был inProgress).

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-09), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/table.js` (829 строк) + `css/components/table.css` (202 строк)
- Load order: 26/53 в `index.html`
- Deps: `checkbox`, `chevron`, `avatar`, `toggles`, `context-menu`, `buttons` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbMkTable`, `sbMkTableSecondary`, `sbMkTableCell`, `sbMkTableToolBar`, `sbMkTableFull`, `sbTablePage`, `sbTableSort`, `sbTableSelectAll`, `sbTableRowSelect`
- COMP_CSS: `table`
<!-- GEN:END -->

Компонент **Table** в Spacebridge DS (`js/components/table.js` + `css/components/table.css`, SYNC-зеркало обязательно). Собран за сессию, **закоммичен** (см. низ). Кастомный `renderPage()` (не `sections`).

## Хедеры
- **Header Primary** — чекбокс-ячейка (`.sb-th-check` 40×40) + CAPTION-ячейки (`.sb-th`, 12/500 uppercase --text-secondary) с sort-иконкой. Sort-стрелка прижата вправо (`.sb-th-sort{margin-left:auto}`, паддинг ячейки 8/8). `sbMkTable({columns:[{title,sort?}], selectable})`.
- **Header Secondary** — ячейки Title M (16/600 --text-tertiary) `.sb-th-secondary` + иконка-слот слева/справа (антенна-статус из Status или sbIcon). `sbMkTableSecondary({columns:[{title,antenna?,icon?,iconSide?}], selectable})`.
- Оба: верх скруглён (TL/TR), border-bottom --border, вертикальный separator ВНУТРИ ячейки (`.sb-th>.sb-sep.sep-v` absolute, `translateY(-50%)`, БЕЗ выноса — иначе фон соседа резал пополам).

## Body-ячейка (Table Cell-40)
`.sb-td` (flex, width 200/min 80, padding 8/8, space-between, border-bottom **--border-soft**, --text-tertiary) + слоты `.sb-td-l`(flex:1,min-width:0,ellipsis)/`.sb-td-r`(shrink:0,margin-left:auto), gap 8, `.sb-td-ic` 24px. `.sb-td-text` = **Title S 14/600** + ellipsis + `text-transform:none` (данные как есть, opt-out title-case [title-case](../conventions/title-case.md)).
Билдер **`sbMkTableCell({type,value,state,width})`** инлайнит DS-классы (билдеров у слот-компонентов нет; чужие компоненты не трогаем [new-component-audit](../conventions/new-component-audit.md)). Типы: text, link (Link S), date (`.sb-caption` DD.MM.YYYY, `.sb-td-date` --text-secondary), status-text (**Badge-Status Mini** `.sb-badge-status.mini`), checkbox, chevron (**Chevron Button** `.sb-chevron`, стрелка **ВНИЗ**), icon-button, drawer (drag-handle, иконка **draggable** добавлена в ICON_PATHS core.js), toggle, icon, input, + композиты (icon-text, link-icon, text-icon, avatar-*, status-circle-text, mark-text `.sb-mark.sm` горизонтальный).
**Width-варианты** (`.sb-td-ctrl` центр, padding-x 0): Checkbox **40** (`.sb-td-w40`; 32 `.sb-td-w32` — компакт на будущее), Chevron/Icon-Button/Drawer **32** (`.sb-td-w32`), Toggle `.sb-td-auto`.
**Состояния** (`state:'is-hover'|'is-selected'`, цвета как Context Cell): hover→--surface-1, selected→--primary-hover+текст --primary. На уровне РЯДА: `.sb-trow:hover:not(.is-selected) .sb-td` и `.sb-trow.is-selected .sb-td`.

## Сборка: `sbMkTableFull({columns, rows, checkW=40, toolbar, footer, rowMenu, pageSize})`
Header Primary + ряды `.sb-trow`(display:flex). С toolbar/footer → обёртка `.sb-table-wrap` (**без border**, без overflow:hidden, radius-8, футер снизу скруглён). Колонки выровнены явной width (border-box) на хедере и body. Демо «Full Table»: 5 колонок + 15 рядов.
- **Selection:** `sbTableSelectAll` (пусто→все, часть/все→снять), `sbTableRowSelect` (тоггл ряда), `_syncHead` (0→пусто/все→checked/часть→**indeterminate=minus=Unselect All**), `_setCb`, `_syncSelUI` (счётчик + морфинг футер-слота + видимость тул-бара). Выбор persists между страницами.
- **Сортировка:** `sbTableSort` реально переставляет `.sb-trow` по значению колонки (числа/знак численно, IP/текст — localeCompare numeric); 1-й клик → desc.
- **Tool Bar** (table-scoped, floating островок `.sb-table-toolbar`): `position:absolute; left:50%; bottom:calc(100%+gap-vert-s)` над футером — НЕ меняет высоту таблицы, всплывает при выборе (`translate+opacity`, `.is-visible`). radius-8, Shadow-S, кнопки **Secondary S** (высоты→32). Data-driven `sbMkTableToolBar({actions:[{icon?,label?,variant?,critical?,onclick?,ariaLabel?}], visible})`, дефолт Download/Apply/Delete, max-width cap.
- **Footer** = переиспользуем компонент `sbMkTableFooter` (3 слота): **left** = «Rows: X of N» (`_footInfo`, `[data-row-info]`) + скрытый «Selected: N» (`[data-sel-count]`, --primary); **right** = `sbMkPagination`. При выборе `_syncSelUI` морфит left (row-info⇄selected). Футер БЕЗ тени, сепаратор border-top → --border-soft.
- **Пагинация (рабочая):** `pageSize>0` → ряды режутся (не-1-я `display:none`), `data-page-size` на wrap, `onPage:'sbTablePage(this,{N})'`. `sbTablePage(btn,page)` показывает ряды, обновляет «Rows: X of N», перерисовывает контролы. **Высота фикс по лейауту:** inline `min-height:(pageSize+1)*40px`; хвост-пустота = **--background**. Демо: 15 рядов, pageSize 10 (10+5), 440px обе стр.
- **Row kebab** (`rowMenu:true|[items]`): kebab-колонка 48px в конце, кнопка `more-2-line` **Secondary icon S** + `.sb-overflow-menu` + `.sb-ctx-card` из Context Menu (`sbMkContextCell` action, `sbOverflowMenuToggle`, глобальные close-listeners). Items Copy/Rename/Download/**Delete** (Delete красный: скоуп `.sb-td .sb-ctx-card>.sb-ctx-cell:last-child{color:--error}`). Хедер `.sb-th-kebab`.
- **Sticky ToC** на странице Table: кастомный renderPage минует авто-ToC core → вручную обернул в `.page-shell`+`.page-toc` (`sbMkToc`), секции с id.

## Правки чужих компонентов (с ОК юзера)
- `core.js`: добавлен `draggable` в ICON_PATHS.
- `status.js`: `window.sbAntenna = ANT` (экспорт антенны).
- `table-footer.js`: обновлены демо-секции (Row Count + Pagination / Selected mode / Center Pagination all-3-slots / Right-only) — CSS-блок не трогал.

## Git / гочи
- **`spacebridge-ds/` — ВЛОЖЕННЫЙ git-репо** (своя история релизов 1.13.x). Коммитить ТУДА (`git -C spacebridge-ds`), НЕ во внешний `Desktop/Claude` (тот добавит gitlink, не файлы). Наш коммит: **78663a4** «Table: composable headers, cells, footer, tool bar, pagination & row menu». В него попали и ранее незакоммиченные НЕ-наши изменения (`css/playground.css` Tab Bar playground, новый `descriptions.json`) — отмечены отдельной строкой.
- Preview-сервер (`ds-preview`, порт 3457, статик python) **кешит статику** — для живой проверки нужен hard refresh (Cmd+Shift+R); в тестах отключал старый link + инжектил свежий CSS.

## BACKLOG (в `spacebridge-ds/BACKLOG.md`)
Avatar 24px-вариант для ячейки; Context Menu danger/critical вариант (чтобы Delete был красным без скоуп-хака); нормальный page-size селектор; Tool Bar overflow-«⋯» меню при 5+ кнопках; select-all indeterminate — сделан. Открытый вопрос: body-чекбокс 40 (взял для выравнивания) vs спека 32.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
