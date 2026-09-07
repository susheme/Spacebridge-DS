# Standard List

> Standard List (Profile/Info/Control); Property List — отдельная NAV-страница, но живёт в этом же файле.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-07), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/list.js` (1073 строк) + `css/components/list.css` (261 строк)
- Файл общий с: `property-list`
- Load order: 24/53 в `index.html`
- Deps: `toggles`, `buttons` (см. `js/_index.js`)
- Используют его: `toast`, `cards`
- Public API: `sbSelectInfoCell`, `sbMkInfoCell`, `sbMkPropertyCell`, `sbMkPropertyList`
- COMP_CSS: `list`, `propertyList`
<!-- GEN:END -->

## Заметки

`33f5bba` — List и Property List разделены на две NAV-страницы (файл общий). `df51bab` — тексты Property List переписаны как образец нового стиля документации.
