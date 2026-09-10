# Toast

> Тосты + стек с Clear-чипсой.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-10), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/toast.js` (774 строк) + `css/components/toast.css` (257 строк)
- Load order: 40/53 в `index.html`
- Deps: `header-xs`, `badge`, `buttons`, `action-bar`, `list`, `chips`, `chevron` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbMkToast`, `sbToastDetailsToggle`, `sbMkToastStack`, `sbToastStackOpen`, `sbToastStackFold`, `sbToastStackDismiss`, `sbToastStackClear`, `SB_TOAST`, `sbToastShow`, `sbToastHide`, `sbToastClearAll`, `sbToastPgShow`
- COMP_CSS: `toast`
<!-- GEN:END -->

## Заметки

`0c3b515` — фикс стекинга: отдельно остаётся только самый свежий action-тост, остальные складываются.
