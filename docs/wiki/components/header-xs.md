# Header XS

> Header XS — скелет; заметки заполняются по ходу работы.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-15), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/header-xs.js` (314 строк) + `css/components/header-xs.css` (58 строк)
- Load order: 36/53 в `index.html`
- Deps: `buttons`, `badge` (см. `js/_index.js`)
- Используют его: `file-uploader`, `toast`
- Public API: `sbMkHeaderXS`
- COMP_CSS: `headerXs`
<!-- GEN:END -->

## Заметки

—

**14.09.2026:** в доки добавлена заметка Placement: в скроллящемся контейнере хэдэр стоит вне зоны прокрутки (скроллбар не перекрывает его), верхние углы повторяют радиус контейнера. Конвенция — conventions/sticky-headers.md.
