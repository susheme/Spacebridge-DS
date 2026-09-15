# Header M

> Header M — скелет; заметки заполняются по ходу работы.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-15), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/header-m.js` (467 строк) + `css/components/header-m.css` (75 строк)
- Load order: 45/53 в `index.html`
- Deps: `buttons`, `popover`, `context-menu`, `tool-bar` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbMkHeaderM`, `sbMkHeaderMActions`, `sbHeaderMSyncMenu`
- COMP_CSS: `headerM`
<!-- GEN:END -->

## Заметки

—

**14.09.2026:** в доки добавлена заметка Placement: в скроллящемся контейнере хэдэр стоит вне зоны прокрутки (скроллбар не перекрывает его), верхние углы повторяют радиус контейнера. Конвенция — conventions/sticky-headers.md.
