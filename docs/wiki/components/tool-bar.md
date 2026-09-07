# Tool Bar

> 3 слота, smart-collapse. ИЗВЕСТНЫЙ БАГ: compact-режим сломан в двух местах — детали в BACKLOG.md.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-07), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/tool-bar.js` (584 строк) + `css/components/tool-bar.css` (173 строк)
- Load order: 43/53 в `index.html`
- Deps: `buttons`, `popover`, `context-menu`, `search-bar`, `tab-bar` (см. `js/_index.js`)
- Используют его: `header-s`, `header-m`, `header-l`
- Public API: `sbMkToolBar`, `sbMkToolBarActions`, `sbToolBarSyncMenu`, `sbWireToolBarFloating`
- COMP_CSS: `tool-bar`
<!-- GEN:END -->

## Заметки

**Известный баг (28.07.2026, НЕ чинить без отмашки):** compact-режим сломан в двух местах — `@container` не может стилизовать сам `.sb-tool-bar` (self-query), и `compact-disabled` не гасит схлопывание действий. Полный разбор — `BACKLOG.md`, раздел «Tool Bar — compact-режим сломан».
