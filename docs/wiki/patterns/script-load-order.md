> Если компонент A в своих sections/preview юзает helper из компонента B (sbMkLedPanel, sbMkSegmentMenu, sbMkSectionHeader и т.п.) — B ДОЛЖЕН грузиться в index.html ДО A. Иначе IIFE падает на ReferenceError при template-литерал eval'е, sbRegister не вызывается, компонент A показывает Coming Soon. Юзер каждый раз пишет «Усё пропало».

# Правило

Когда добавляешь в компонент `<name>.js` любые **cross-component вызовы** в `preview`/`render`/`description` (например `sbMkLedPanel(...)`, `sbMkSegmentMenu(...)`, `sbMkSectionHeader(...)`) — **сразу проверь и поправь порядок `<script>` в `index.html`**. Зависимый компонент должен идти ДО.

И параллельно — обнови `deps: [...]` в `js/_index.js` для документации.

# Почему это критично

Template literals в `sbRegister({...})` eval'ятся **в момент IIFE execution**, не лениво. Если функция-зависимость ещё не определена — `ReferenceError` рушит IIFE → `sbRegister` не отрабатывает → `SB_REGISTRY[id]` пустой → клик в NAV показывает `Coming Soon`.

Это **не syntax error** (osascript -l JavaScript проходит OK), а **runtime ReferenceError**. Поэтому my standard syntax check НЕ ловит. Лови sanity-check'ом через grep cross-component calls + сверку с порядком в index.html.

# Кейсы из истории

- **2026-05-14:** Tab Bar (теперь Segment Menu) юзал `sbMkSectionHeader` в States — section-header.js грузился ПОСЛЕ. → Coming Soon. См. `spacebridge_nav_bar_component.md` (комментарий в `index.html`).
- **2026-05-20:** Sub Nav начал юзать `sbMkLedPanel` в demo-секциях — led-panel.js был ПОСЛЕ sub-nav.js. → Coming Soon. Юзер: «ШЕФ, Усё пропало. Запомни ты наконец в чем проблема!»

# Как применять — чеклист

При добавлении в `<name>.js` cross-component вызова:

1. `grep "sbMk[A-Z]" js/components/<name>.js` — найди все вызовы builder'ов чужих компонентов
2. Для каждого `sbMkFoo` — найди файл-источник (обычно `<foo>.js` или близкое имя)
3. Проверь порядок в `index.html`: source-файл должен идти **ВЫШЕ** твоего
4. Если порядок неверный — переставь `<script>` теги
5. Добавь комментарий рядом в index.html, объясняющий зависимость
6. Обнови `deps: [...]` в `js/_index.js` для документации

# Связанная память

- `feedback_no_coauthor_in_commits.md` — другая категория, но про регулярные правила
- `spacebridge_nav_bar_component.md` — упоминает порядок load для section-header

---
*Перенесено из памяти агента 07.09.2026, дословно.*
