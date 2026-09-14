# Header S

> Header S — скелет; заметки заполняются по ходу работы.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-14), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/header-s.js` (460 строк) + `css/components/header-s.css` (169 строк)
- Load order: 44/53 в `index.html`
- Deps: `buttons`, `popover`, `context-menu`, `tool-bar` (см. `js/_index.js`)
- Используют его: `side-panel`
- Public API: `sbMkHeaderS`, `sbMkHeaderSActions`, `sbHeaderSSyncMenu`
- COMP_CSS: `headerS`
<!-- GEN:END -->

## Заметки

—

**14.09.2026:** в доки добавлена заметка Placement: в скроллящемся контейнере хэдэр стоит вне зоны прокрутки (скроллбар не перекрывает его), верхние углы повторяют радиус контейнера. Конвенция — conventions/sticky-headers.md.
