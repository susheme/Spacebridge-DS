# Context Menu

> Контекстное меню (sbMkContextCard/Cell); нет danger-варианта ячейки — см. BACKLOG.md.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-10), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/context-menu.js` (347 строк) + `css/components/context-menu.css` (129 строк)
- Load order: 25/53 в `index.html`
- Deps: нет (см. `js/_index.js`)
- Используют его: `table`, `section-header`, `selectors`, `header-s`, `header-m`, `header-l`, `nav-bar`, `tool-bar`, `side-navigation`, `cards`
- Public API: `sbSelectContextCell`, `sbActionContextCell`, `SB_DEMO_MORE_ITEMS`, `sbMkContextCell`, `sbMkContextCard`
- COMP_CSS: `contextMenu`
<!-- GEN:END -->

## Заметки

Нет danger/critical-ячейки для деструктивных действий: красный Delete в таблице пока красится скоуп-стилем «последний = Delete». План `mode:'danger'` — в `BACKLOG.md`.
