> Когда контент компонента может быть шире preview area (Sub Nav min-width 780, Nav Bar с лонг табами, Segment Menu с 7 segments и т.п.) — wrap в `overflow-x:auto` контейнер. Vertical scroll НЕ нужен (height адаптируется к контенту). Применять ко ВСЕМ компонентам.

# Правило

В **section previews** и **playground render()** обернуть демо-контент в horizontal scroll wrapper если контент может быть шире preview area.

# Why

Юзер 2026-05-20: «Почему опять не сделал горизонтальный скролл как мы это делали в Nav Bar?? Распространи ты это на всю DS!»

Без скролла контент либо обрезается, либо вылезает за границы preview area в .example-preview / pg-preview, ломая layout. С scroll юзер может оценить полный размер на узких экранах.

# Паттерн

Section preview:
```js
preview: `<div style="width:100%;overflow-x:auto;padding-bottom:var(--pad-vert-16)">${mkComponent(...)}</div>`
```

Playground render():
```js
render(s) {
  return `<div data-pg-preserve-scroll style="width:100%;overflow-x:auto;padding-bottom:var(--pad-vert-16)">${mkComponent(...)}</div>`;
}
```

**`padding-bottom: 16` ОБЯЗАТЕЛЕН** (см. ниже), иначе появляется вертикальный scrollbar.

`data-pg-preserve-scroll` сохраняет `scrollLeft` между state-toggle re-renders (обрабатывается в `SB_PG.render` в `js/core.js`). В section preview не нужно (сектионы не re-render'ятся).

# Vertical scroll — почему НЕЛЬЗЯ без padding-bottom

Юзер 2026-05-20: «не нужен вертикальный скрол в превью достаточно просто по высоте окно адаптировать», позже: «опять ты все урезал перерезал. Вернул вертикальный скролл за каким то хером».

## Корень проблемы

Per CSS spec, `overflow-x: auto` коэрсит `overflow-y` в `auto` (computed). Когда **горизонтальный** scrollbar появляется (контент шире wrapper), он резервирует **~15px ВНУТРИ wrapper'а** (внизу). Effective content area уменьшается на эти 15px.

Если контент wrapper'а по высоте **точно равен** wrapper.height (auto-height = content-sized), то после резервации scrollbar'а: content (например 64px) > effective area (64−15=49px) → vertical overflow → появляется ВЕРТИКАЛЬНЫЙ scrollbar тоже. Chicken-egg.

## Решение — `padding-bottom: var(--pad-vert-16)` на wrapper

16px padding-bottom создаёт буфер: wrapper.height = content + 16. Когда scrollbar забирает 15px из этих 16, остаётся 1px + content fits → НЕТ vertical overflow → НЕТ vertical scrollbar.

Это паттерн **nav-bar.js** где он юзает inner wrapper с `padding: var(--pad-vert-16)` на все стороны как «stage». У Sub Nav проще — padding-bottom на outer scroll-wrapper.

## Если ВСЁ ЕЩЁ появляется vertical scroll

Debug:
- В parent chain есть fixed height? (overflow-x: auto + fixed height = высокий риск)
- Position:sticky на содержимом вносит вертикальное смещение?
- padding-bottom меньше scrollbar width (Windows ~17px > 16px → не хватит)
- Content высокий (>64px) — может надо padding-bottom больше

# Прецеденты

- **Nav Bar playground** (2026-05-14) — первый кейс. Юзер просил добавить горизонтальный скролл потому что бар (1200px stage) не влезал в preview.
- **Segment Menu playground** — добавили `data-pg-preserve-scroll` чтобы скролл не сбрасывался при toggle tabCount/iconPosition.
- **Sub Nav sections** (2026-05-20) — текущий кейс. Я забыл паттерн → юзер раздражился.

# Распространить на DS — TODO checklist

Применить ко всем компонентам где это релевантно:
- ☐ Tab Bar — playground + sections (если контент > preview)
- ☐ Header L/M/S/XS — sections с длинным контентом
- ☐ Table — sections
- ☐ List — sections если ширина может быть > preview
- ☐ Selectors — playground
- ☐ Inputs / Textarea / Search Bar — playground с длинными плейсхолдерами
- ☐ Notifications — banner может быть длинным
- ☐ Side Navigation — если будем делать

Не нужно где контент гарантированно меньше preview area (Buttons, Toggles, Checkboxes, Radio, Badges, Avatars, Status, Counters, Tags, Pin, KBD, Chevron, Separators).

# Связанная память

- `spacebridge_playground_wide_mode.md` — про wide mode у playground
- `spacebridge_playground_pg_toggles.md` — про auto-fit grid контролов
- `feedback_no_cosmetic_overflow_hidden.md` — НЕ overflow:hidden, ИМЕННО overflow-x:auto

---
*Перенесено из памяти агента 07.09.2026, дословно.*
