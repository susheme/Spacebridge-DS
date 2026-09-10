# Tooltips

> Tooltips — скелет; заметки заполняются по ходу работы.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-10), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/tooltips.js` (257 строк) + `css/components/tooltips.css` (127 строк)
- Load order: 22/53 в `index.html`
- Deps: `status` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbMkTooltip`, `sbTipToggle`
- COMP_CSS: `tooltips`
<!-- GEN:END -->

## Заметки

**09.09.2026:** окно превью в playground — фикс-высота 256px (просьба юзера; было padding 160px сверху/снизу). Горизонтальный запас 200px под left/right-пузырь оставлен. Если paragraph-вариант top/bottom начнёт вылезать за окно — вопрос к юзеру, не к overflow:hidden.
