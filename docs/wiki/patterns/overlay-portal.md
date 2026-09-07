# Overlay: portal в body

> Fullscreen-оверлеи в Spacebridge DS обязаны portal'иться в <body> при открытии — z-index 9999 бесполезен внутри stacking-context'ов контентной зоны

Любой fullscreen-оверлей (scrim, модалка, будущие Drawers/лайтбоксы), отрендеренный внутри контентной зоны DS, НЕ перекроет sticky-хром (search бар сайдбара z-index:9, tool-bar z-index:10, section-header'ы) — какой бы огромный z-index у него ни был.

**Why:** предки контентной зоны создают stacking-context'ы; z-index 9999 оверлея сравнивается только внутри своего контекста, а на корневом уровне конкурирует контекст-родитель. Юзер поймал это на первом же демо Overlay.

**How to apply:** portal-паттерн уже встроен в примитив `sbOverlayOpen` (js/components/overlay.js): при открытии элемент переезжает в `document.body` (с запоминанием родного места `_sbHome`), при закрытии возвращается после close-фейда (200ms; если родителя снесло перерендером — `remove()`, не сиротеть). НОВЫЕ оверлейные штуки строить ПОВЕРХ `sbMkOverlay`/`sbOverlayOpen`, а не своим `position:fixed` — иначе баг вернётся. См. [file-uploader](../components/file-uploader.md) (первый жилец модалки).

---
*Перенесено из памяти агента 07.09.2026, дословно.*
