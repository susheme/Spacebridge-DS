# Figma-токены неприкосновенны

> Не менять токены в css/tokens.css / js/tokens.js под визуальные нужды playground'а. Source of truth — Figma JSON. Решение — обёртка с фикс-шириной.

Если в playground что-то «слишком широкое» или «слишком узкое» — НЕ трогай токен в `css/tokens.css` / `js/tokens.js`. Source of truth — Figma JSON в `Figma Tokens/*.json` и `deepseek_html_20260417_007c40.html`.

**Конкретные кейсы (зафиксированные дизайнером):**
- `--text-field-max-width` = 808px (Desktop spec). Не трогать.
- Inputs / Selectors / Search Bar / Password в playground обёрнуты в `<div style="width:100%;max-width:360px">${mkX(s)}</div>` *только в render(s)*, не в реальном CSS.

**Why:** прецедент — я начал sed'ом заменять токен на 360px по 8 файлам, юзер прервал: «Погоди а в фигме какая максимальная ширина?». Проверили JSON → 808px Desktop. Решение: оставить токен, обернуть только playground.

**How to apply:** перед правкой любого размерного токена — *проверяй Figma JSON*. Если в JSON значение отличается от того, что хочется — не правь токен, оборачивай вызов в playground/демо.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
