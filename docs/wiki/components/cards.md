# Cards

> Spacebridge DS Cards — 5 типов закоммичены (aa2d028, 01.09.2026), статус Incomplete; механика слотов, гочи, хвосты

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-07), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/cards.js` (663 строк) + `css/components/cards.css` (241 строк)
- Load order: 50/53 в `index.html`
- Deps: `buttons`, `badge`, `status`, `counters`, `avatar`, `checkbox`, `tags`, `list`, `popover`, `context-menu`, `action-bar`, `grid-system`, `placeholders` (см. `js/_index.js`)
- Используют его: `side-panel`
- Public API: `sbMkCard`, `sbMkCardHeader`
- COMP_CSS: `cards`
<!-- GEN:END -->

Cards закоммичены 01.09.2026 (aa2d028), NAV-статус Incomplete. Страница: Card Header (витрина слотов) + 5 типов: Default Content (текст/медиа, с AB/без), Stat and Metrics, Alert, Selectable, List. Типы = композиции слотов, не классы.

04.09.2026 (4): радиус карточек 16 → 8 везде (решение юзера): контейнер --radius-8, шапка 8/8/0/0, Action Bar last-child 0/0/8/8, Tech Info обновлён. Упоминания «radius 16» ниже устарели.

Механика (`cards.js`/`cards.css`): `sbMkCard({ header, media, title, subtitle, body, footer, actionBar, bodyCls, interactive, selected, disabled })`; `sbMkCardHeader({ lead, title(H8), subtitle, content, right })`. Карточка: radius 16, Shadow-S, border transparent-резерв, gap 0, `align-self: start` (высота от контента, грид не растягивает). Низ: без AB — карточка pb 16; с AB — слот pb 8 (у `is-list` — 16); `is-stat` слот 0/16/16. Слот контента 8/16/0, первым ребёнком — top 16. Action Bar — прямой ребёнок, `:last-child` повторяет радиус 0/0/16/16. Selected/hover: рамка primary + тень Hover-blue (3 слоя primary-hover), БЕЗ заливки; disabled: тексты `--border`, без opacity.

04.09.2026 (3): ховер bordered по спеке = ШТАТНЫЙ Selectable (рамка primary + тень Hover-blue) — подавление тени на ховере снято, в покое тени нет; демо Notification стало interactive. «Color» в Figma-экспорте рамки ховера не зарезолвился — принят --primary, юзер не возразил.

04.09.2026 (2): тип «Notification Card» по Figma-спеке — bordered + `sbMkCardHeader({titleCls:'sb-title-m'})` (новая опция titleCls, дефолт sb-h8) + Subscription-дата + `sbMkBadgeText({variant:'success'})` + is-alert слот + ряд ссылок `sb-link-m`. ВАЖНО: `sb-title-m` перекрашен в semibold 600 по Figma (был medium 500 — моя ошибка переноса; задето 43 места по DS). Фикс-ширину 342 из спеки не переносим.

04.09.2026: слот Alert Card → `bodyCls: 'is-alert'` (padding 0/16, align-items flex-start; в Figma-экспорте имена pad-horiz/pad-vert перепутаны местами — переводить в конвенцию DS); рамка bordered перекрашена в `--border-soft` (решение юзера).

03.09.2026 добавлен модификатор `border: true` → `.sb-card.bordered`: рамка `--border-soft` вместо тени, тень погашена во всех состояниях, hover/selected красят рамку в `--primary` штатным правилом is-interactive (блок в CSS стоит ПОСЛЕ is-interactive — подавление тени порядком файла). Секция «Bordered Card» на странице + Tech Info. Придуман для стопки карточек в панели обновлений ([updates](updates.md)); юзеру заведён как свойство Border в Figma.

Рядом сделано: компонент Placeholders (day/night SVG в токенах, `sbMkPlaceholder({shape})`, переключение [data-theme]); Property List `framed` (рама 16/radius 8/surface-1, ячейки в раме перекрашены каскадом); `sbMkBadgeText` фабрика; иконка `time-line` в ICON_PATHS.

Хвосты: Status Bar в BACKLOG.md (для второго варианта метрики), фабрика Symbol Badges, в Figma перепривязать gap фреймов Content/Alert с gap-horiz-xs на 0. Гочи: юзер шлёт Figma-спеки кусками и правит на ходу — не обобщать сверх присланного, «не выдумывай»; фикс-ширины фреймов (342/310/400) не переносить.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
