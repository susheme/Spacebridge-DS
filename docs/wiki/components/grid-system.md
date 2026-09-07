# Grid System

> Примитивы раскладки: Flex, Flex Item, Grid (auto-fit + minmax), Page. 12-колоночной сетки нет намеренно.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-07), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/grid-system.js` (455 строк) + `css/components/grid-system.css` (142 строк)
- Load order: 2/53 в `index.html`
- Deps: нет (см. `js/_index.js`)
- Используют его: `cards`, `side-panel`
- Public API: `sbMkFlex`, `sbMkFlexItem`, `sbMkGrid`, `sbMkPage`
- COMP_CSS: `grid-system`
<!-- GEN:END -->

## Заметки

Релиз 1.14.0 (04.08.2026). Колоночной сетки на 12 долей нет сознательно: в приложении важна ширина блока, а не доля макета.

- `91bbc49` — 44 inline flex-декларации мигрированы на `sbMkFlex`; `7c63cdd` — gapX/gapY, `.sec-col`/`.sec-row` сняты с docs CSS.
- `b4a08b2` — фикс слипания кнопок тулбара; `2096ebc` — доки про то, что реально делает stretch.
- Статус Incomplete — ждёт взгляда дизайнера.
