# Banners

> 4 типа (info/success/warning/error), left-marker 4px; sbDocNote рендерит именно Banner.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-09), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/banners.js` (675 строк) + `css/components/banners.css` (165 строк)
- Load order: 5/53 в `index.html`
- Deps: `chevron`, `badge`, `buttons` (см. `js/_index.js`)
- Используют его: `snackbar`
- Public API: `sbMkBanner`, `sbBannerToggle`, `sbBannerSyncOverflow`, `sbMkNotifBar`
- COMP_CSS: `banners`
<!-- GEN:END -->

## Заметки

Типы по составу, тайтл-ссылка, генерик right-slot. `sbDocNote` (плашки Tech Info/Important в доках) рендерит наш Banner — разметка заинлайнена из-за load order. Подробная история — [infra/docs-i18n.md](../infra/docs-i18n.md).

**09.09.2026:** статус в NAV: Incomplete → Done (ready+done, решение юзера).
