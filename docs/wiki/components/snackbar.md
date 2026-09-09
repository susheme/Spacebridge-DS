# Snackbar

> Инверс-плашка БЕЗ inverse-токенов: фон --text-tertiary + контент --surface-1 (трюк юзера).

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-09), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/snackbar.js` (237 строк) + `css/components/snackbar.css` (86 строк)
- Load order: 6/53 в `index.html`
- Deps: `badge`, `banners`, `buttons` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbMkSnackbar`, `sbSnackbarDismiss`, `sbShowSnackbar`
- COMP_CSS: `snackbar`
<!-- GEN:END -->

## Заметки

Сделан без inverse-токенов: пара «фон `--text-tertiary` + контент `--surface-1`» инвертируется темой сама (трюк юзера; хрупкий контракт — см. `BACKLOG.md`, «Inverse-цвета»). `sbShowSnackbar`: низ-центр, слайд, 5с кольцо-countdown, вытеснение; догфуд на всех копи-кнопках. НЕ сделаны: очередь и hover-пауза таймера. Подробная история — [infra/docs-i18n.md](../infra/docs-i18n.md).
