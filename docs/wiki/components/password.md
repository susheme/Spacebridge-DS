# Password Input

> Password Input — скелет; заметки заполняются по ходу работы.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-15), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/password.js` (201 строк) + `css/components/password.css` (53 строк)
- Load order: 19/53 в `index.html`
- Deps: `input` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbPwToggle`, `sbMkPassword`, `sbMkPasswordField`
- COMP_CSS: `password`
<!-- GEN:END -->

## Заметки

—

**15.09.2026:** фабрики экспортированы — `sbMkPassword` / `sbMkPasswordField` (симметрично sbMkTextField/sbMkField); copy-paste разметки потребителями больше не нужен.
