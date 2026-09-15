# Header L

> Header L — скелет; заметки заполняются по ходу работы.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-15), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/header-l.js` (562 строк) + `css/components/header-l.css` (95 строк)
- Load order: 46/53 в `index.html`
- Deps: `buttons`, `popover`, `context-menu`, `tool-bar` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbMkHeaderL`, `sbMkHeaderLActions`, `sbHeaderLSyncMenu`
- COMP_CSS: `headerL`
<!-- GEN:END -->

## Заметки

—

**14.09.2026:** в доки добавлена заметка Placement: в скроллящемся контейнере хэдэр стоит вне зоны прокрутки (скроллбар не перекрывает его), верхние углы повторяют радиус контейнера. Конвенция — conventions/sticky-headers.md.

**15.09.2026:** More-триггер без menu-only пунктов получает `is-menu-only`: на широком контейнере скрыт (открывал пустое меню), появляется вместе с зеркалами inline-действий на узком. То же — Header M/S и Section Header.
