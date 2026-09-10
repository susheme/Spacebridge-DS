# Changelog

Версионирование — semver (см. «Версионирование» в `CONTRIBUTING.md`):
**MAJOR** — ломающее изменение токенов/API; **MINOR** — релиз с новым компонентом;
**PATCH** — фиксы/твики существующего. Счёт — по релизам (один релиз с новыми
компонентами = один MINOR, даже если их несколько).

Источник версии — бейдж в Nav Bar (`index.html`), его читает Info Footer в подвале.

## [1.15.0] — 2026-09-10

- **Cards** — пять типов карточек, компонент Placeholder, Notification Card
  (bordered-вариант, is-alert слот). Статус — Incomplete.
- **Property List** — отдельная страница; живёт в `list.js` вместе со Standard
  List. Тексты документации — образец нового инфостиля DS.
- **Лента обновлений** — колокольчик в Nav Bar, Side Panel с фидом, read/unread.
- **Dialogues** — alert и confirm разделены: alert информирует (OK, Esc
  выключен), confirm просит решение; добавлен тип form (`sbShowPrompt`).
- **Button** — вариант Link. **Tags** — clickable-режим.
- **npm-пакет стилей `pkg/`** — фреймворк-независимый CSS для Angular-команд:
  токены, цвета (светлая — дефолт, тёмная — `data-theme="dark"`), база без
  site-shell правил, типографика, все компоненты, шрифты. Собирается
  `tools/gen-pkg.js`; версия пакета наследуется от бейджа DS.
- **Вики агента** (`docs/wiki`) — 54 компонентные страницы, страницы
  инфраструктуры и паттернов, генератор скелетов `tools/gen-wiki.js`.

### Фиксы

- Toast: в стеке отдельно держится только свежайший action-тост.
- Tooltips: высота превью плейграунда зафиксирована (256px).
- NAV: Banners — Done; Table и Table Footer — Incomplete.

## [1.14.0] — 2026-08-04

- **Grid System** — примитивы раскладки: Flex, Flex Item, Grid (карточная сетка
  на auto-fit + minmax) и Page (контейнер экрана). Колоночной сетки на двенадцать
  долей нет намеренно: в приложении важна ширина блока, а не доля от макета.
  Статус — Incomplete, ждёт взгляда дизайнера.
- **Button: фабрика `sbMkButton`** — у самого используемого компонента её не было,
  и 150 мест в 22 файлах верстали разметку руками, уже разойдясь на два разных
  порядка классов. Плюс `sbMkButtonWithLabel`. Разметка кнопок в репозитории
  больше не пишется руками нигде, включая хром DS и code-samples документации.
- **Токены стали адаптивными.** У переменных Figma три режима — Desktop, Tablet,
  Mobile — и 57 из них имеют разные значения, но в код годами переносили только
  Desktop. Теперь `css/tokens.css` собирается из Figma генератором
  (`tools/gen-tokens.js`) и раскладывает значения mobile-first.
  **Внешний вид на телефоне и планшете заметно изменится**: отступы, кегли и
  предельные ширины наконец такие, как задуманы в макетах. Десктоп не тронут —
  все 201 токен выше 1280px резолвятся в прежние значения.
- **Тесты** — 23 проверки на JavaScriptCore (`jsc tests/run.js`): догма как
  линтер, синхронность `COMP_CSS` с CSS, целостность токенов и иконок, порядок
  загрузки, смоук всех фабрик. Layout они не покрывают.

### Фиксы

- Сайдбар: пустоты при поиске — залипающие заголовки категорий оставались
  прозрачными, но занимали место.
- Документация: не переключался язык и сбрасывался на английский при
  перезагрузке — ячейка выбора живёт в портированной панели Popover, и топбар
  по ней не опознавался.
- Header S и Header M: демо-композиции с Tool Bar не рендерились — фабрика
  загружалась позже, чем собиралась секция.
- `COMP_CSS` у 11 компонентов отстали от своих `.css`; у Button не хватало
  `min-width`, `font-family`, `line-height` — копирование стилей из code panel
  давало сломанную кнопку.
- `_index.js` дополнен семью компонентами, которые грузились, но описаны не были.

## [1.13.1] — 2026-06-26
- Info Footer: slot-текст → Badge-типографика (10px) + `--text-muted`; статус → Incomplete.

## [1.13.0] — 2026-06-26
- **Info Footer** — системная инфа по слотам (текст / status-индикатор), лейауты
  Long (full-width strip) и Compact (блок для Side Menu), popup-якорь. Догфуд в
  подвал DS (версия + copyright).

## [1.12.0]
- **Action Bar** — 1–2 кнопки внизу карточки/модалки/алерта (divider / floating,
  align left/right/center/between).

## [1.11.0]
- **Side Navigation** — Side Menu / Side Bar, роли (item/parent/group/section/
  section-header), слоты ячеек, embedded-режим. Догфуд в сайдбар DS.

## [1.10.0]
- **Tool Bar** (Top) — со smart-collapse через container query.

## [1.9.0]
- **Pagination** + **Table Footer**.

## [1.8.0]
- **Breadcrumbs** + site-wide page breadcrumbs.

## [1.7.0]
- **Tabs / Segment Menu / Sub Nav / LED Panel**.

## [1.6.0]
- **Nav Bar** (Top Bar) со smart-collapse.

## [1.5.0]
- **Sticky Table of Contents**.

## [1.4.0]
- **Keyboard Shortcut (KBD)**.

## [1.3.0]
- **Header M / Header L / Header S**.

## [1.2.0]
- **Header Section / Header XS / Tab Bar**.

## [1.1.0]
- **List / Context Menu**.

## [1.0.0]
- Первый релиз. Стартовый набор: Buttons, Input, Badge, Avatar, Status, Table,
  Selectors, Toggles, Checkbox, Radio, Separators, Chevron Button, Counters,
  Tags, Search Bar, Password Input, Textarea, Notifications.
