# Header Section

> Заголовок секции со слотами; sticky-вариант сознательно НЕ вынесен в компонент — см. BACKLOG.md.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-09), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/section-header.js` (293 строк) + `css/components/section-header.css` (61 строк)
- Load order: 28/53 в `index.html`
- Deps: `buttons`, `popover`, `context-menu` (см. `js/_index.js`)
- Используют его: `side-navigation`
- Public API: `sbMkSectionHeader`, `sbMkSectionHeaderActions`, `sbSectionHeaderSyncMenu`
- COMP_CSS: `sectionHeader`
<!-- GEN:END -->

## Заметки

Sticky-плашка с подложкой живёт скоуп-стилем в рейке доков (`css/layout.css`): цвет подложки и `top` зависят от хоста. Выносить в компонент — только при втором потребителе (кандидат — sticky-хедеры Table), API уже продуман в `BACKLOG.md`.
