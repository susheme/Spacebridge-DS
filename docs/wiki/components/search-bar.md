# Search Bar

> В Search Bar опции iconLeft и rightSlot взаимоисключают .sb-search-btn. Используется для глобального поиска с KBS-подсказкой (NAV cmd+K).

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-07), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/search-bar.js` (184 строк) + `css/components/search-bar.css` (85 строк)
- Load order: 16/53 в `index.html`
- Deps: `kbd` (см. `js/_index.js`)
- Используют его: `nav-bar`, `tool-bar`, `side-panel`
- Public API: `sbMkSearch`
- COMP_CSS: `search-bar`
<!-- GEN:END -->

`window.sbMkSearch(opts)` — публичный helper из `js/components/search-bar.js`. Опции:
- `iconLeft: bool` — лупа в overlay слева; при этом **не** рендерится `.sb-search-btn`.
- `rightSlot: html` — произвольный HTML справа (KBS-подсказка, clear-кнопка). Работает только в паре с `iconLeft`. Без `iconLeft` справа всегда стоит `.sb-search-btn` с лупой.
- `inputId: string` — id для `<input>` (нужен NAV-search'у, чтобы цепляться `getElementById`).
- `selected/lineView/disabled/critical/placeholder` — старые опции, без изменений.

**Канонический паттерн глобального поиска (NAV / Spotlight / Linear):**
```js
sbMkSearch({
  iconLeft: true,
  inputId: 'navSearchInput',
  placeholder: 'Search components',
  rightSlot: sbMkKbdGroup(['⌘','K']),
})
```

**Зависимость:** `search-bar` теперь зависит от `kbd` (см. `js/_index.js` deps). В `index.html` `kbd.css`/`kbd.js` загружаются ДО `search-bar.*` — иначе `sbMkKbd*` undefined в момент `sbRegister`.

**Why:** до рефактора `mkSearch` всегда рендерил правую кнопку `.sb-search-btn`, даже при `iconLeft: true` — получалось две лупы и нельзя было всунуть KBS-подсказку. Юзер: «Search bar Icon Left — в нём не нужна .sb-search-btn».

**How to apply:** для любого глобального поиска (NAV, command palette, etc.) — `iconLeft: true` + `rightSlot: sbMkKbdGroup([...])`. Не лепи KBS вручную в шаблон.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
