# Table Footer

> Pagination (центр) + «Selected: N» (право); page-size селектора нет — см. BACKLOG.md.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-10), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/table-footer.js` (171 строк) + `css/components/table-footer.css` (37 строк)
- Load order: 35/53 в `index.html`
- Deps: `pagination` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbMkTableFooter`
- COMP_CSS: `table-footer`
<!-- GEN:END -->

## Заметки

Временный компактный селектор «10 ▾» убран как уродский; нормальный page-size селектор (10/25/50/100) — отложен, см. `BACKLOG.md`.

**09.09.2026:** статус в NAV: inProgress → Incomplete (решение юзера).
