# Backlog

Отложенные задачи и идеи. Пополняется по мере появления, чистится по мере выполнения.

---

## Major: Dogfood DS chrome через собственные компоненты

Сейчас «обёртка» DS (заголовки страниц, секций, playground'ов) — самописная разметка в `core.js` + стили в `layout.css`/`playground.css`. Идея — заменить на наши же Header L / Header M / Header XS. Это автоматически решает кучу мелочей (truncation, hover-state'ы, консистентность) и заодно стресс-тестит сами компоненты.

### Маппинг

| Сейчас (homemade) | Заменить на | Где |
|---|---|---|
| `.page-title` + `.page-desc` | **Header L** (title-only mode) | `core.js` renderComponentPage |
| `.comp-title` + `.comp-desc` | **Header M** или **Header Section** | `core.js` (section render) |
| `.pg-title` | **Header XS** | `core.js` `SB_PG.buildHTML` |
| ExampleBox toolbar | возможно **Header XS** | `js/docs-helpers.js` |

### Скоп (protected файлы)

- `js/core.js` — HTML-генерация всех уровней + ExampleBox
- `js/docs-helpers.js` — sbMkPreviewStage / exampleBox
- `css/playground.css` — снести `.pg-title` / `.pg-header` rules
- `css/layout.css` — снести `.page-title` / `.comp-title` rules
- Возможно правки в Header L/M/XS — нужен chrome-режим (без back-button, без action-slot, без своего background'а)

### Зачем

- Header'ы уже с truncation, hover, ellipsis → бесплатно решает текущий баг с `.pg-title` который переносится на 2 строки в узких карточках.
- Каждое изменение в Header сразу видно на ВСЕХ страницах DS → отлавливаем регрессии моментально.
- Дизайнер открывает DS — видит компонент в живом контексте, не в стерильной коробке.

### Подход

1. Сначала разобрать каждый Header (L/M/XS) — какой нужен chrome-mode opt-in (`isChrome:true` или варианты slot'ов).
2. Затем по одному уровню за раз: pg-title → Header XS, comp-title → Header M, page-title → Header L. После каждого — проверка регрессий.
3. **Не мешать с багфиксами** — отдельная сессия.

---

## Major: Fieldset — промоушн pg-group в DS-компонент

Группировка контролов playground'а (`.pg-group` / `-title` / `-body` + резиновая сетка) доказала себя (51 использование в 24 playground'ах, вся разметка уже через единый хелпер `sbPgGroup()` в `core.js`) — формализовать в полноценный компонент **Fieldset**.

### Блокер

В Figma компонента нет. Текущий визуал собран из общих паттернов DS (radius-12, `--border`, `--text-tertiary` тайтл) — **перед стартом дизайнер рисует/согласует в Figma**: размеры, отступы, варианты (default / compact / inline?), состояния. Правило «токены только из Figma JSON» действует.

### План (детали в памяти агента)

1. `js/components/fieldset.js` + `css/components/fieldset.css` (SYNC-маркеры), API `sbMkFieldset({ title, children, variant })`.
2. Класс-нейминг: `.pg-group*` → `.sb-fieldset*`; `sbPgGroup()` становится тонкой обёрткой над `sbMkFieldset` — playground'ы не трогаем, мигрируют автоматически.
3. NAV: запись в Forms (или Layout), docs EN/RU, playground.
4. Use cases вне playground'а: группы полей форм, секции настроек, detail-карточки.

Триггер: «старт Fieldset» + Figma-параметры (или отмашка «бери как есть»).

---

## Major: Пробный GUI из DS-компонентов

Собрать **полностью реалистичную фейк-страницу** (например login flow, dashboard, settings page), используя только наши DS-компоненты. Цель — обкатать как они работают в композиции, найти missing'и и edge case'ы.

### Что должно вскрыться

- Какие комбинации компонентов ломаются (e.g. Header L + длинный Title в narrow контейнере)
- Какие patterns не покрыты (toast'ы, модалки, side-sheets, accordion'ы)
- Missing'и в Layout primitives (Grid System, Stack helpers)
- Цветовые баги (например status indicator в context где фон не --background)
- Z-index конфликты (overlay + dropdown + tooltip одновременно)

### Идеи для прототипа

- **Mission Control dashboard** — Nav Bar + Sub Nav + Side Nav + сетка карточек со Statuses
- **Settings flow** — Forms компонент-зоопарк (Input, Search Bar, Selectors, Textarea, Password, Toggles, Radio, Checkbox)
- **Data view** — Table + Pagination + Table Footer + filter row из Tags

### Где жить

Отдельная HTML-страница в проекте (например `examples/dashboard.html` или внутри DS как раздел "Examples / Demo" в навигации).

---

## Major: Сплошная вычитка текстов DS под новый стиль

Правила стиля приняты 12.08.2026 и записаны в `CLAUDE.md`, раздел «Стиль текстов». Образец — Property List: и `description`, и Tech Info переписаны под них. После слияния семейство живёт в `js/components/list.js` — секция «Property List — Cell» и описание компонента List.

Остальные компоненты написаны в прежнем регистре: разговорная лексика («жмётся», «набили», «врёт», «хвосты букв», «скачут»), оценки и усилители («сознательно», «просто», «ровно», «честно»), длинные предложения с двумя-тремя тире, обоснования и история правок внутри Tech Info вместо комментариев кода.

### Договорённость

Правим **по мере того, как трогаем компонент** — отдельный сплошной заход не начинаем без отмашки. Эта запись нужна, чтобы задача не потерялась и чтобы в какой-то момент можно было добить хвост одним подходом.

### Объём

- 48 компонентов, у каждого `description` + `sbDocNote('Tech Info', …)`, оба языка.
- Плюс подписи секций и плейграундов.

### Порядок при сплошном заходе

1. Сначала Tech Info: он формализован сильнее всего («параметр: значение», параллельные пункты) и правится механически.
2. Затем `description` — там нужна редактура по смыслу, не замена слов.
3. EN и RU править парой: расхождение регистров между языками хуже, чем старый стиль в обоих.
4. После каждой пачки — `jsc tests/run.js` (проверка целостности разметки ловит порванные теги в HTML-строках).

---

## Компонент Form Dialogue (полная многопольная форма)

Однопольный prompt сделан (09.09.2026): `sbMkDialogue({ type: 'form', field })` +
`sbShowPrompt() → Promise<string|null>` — контракт window.prompt. Полная форма
(несколько полей: Input + Selectors + Checkbox…) отложена до спеки.

Вопросы дизайнеру:
- Ширина form-диалога: 320 формам мала — нужен свой размер (токен?).
- Лейаут полей: лейблы, вертикальный ритм, группы — нужен ли сначала Fieldset
  (см. «Fieldset — промоушн pg-group»)?
- Контракт сбора значений: `sbShowForm() → Promise<object|null>` — как поля
  именуются (name-атрибуты? ключи слота?).
- Валидация: disabled OK при невалидной форме, где живут правила.

---

## Компонент Status Bar (прогресс-полоса)

Нужен для второго варианта Stat and Metrics Card (Cards): вместо строки
Subscription под значением метрики — цветная полоса состояния (референс
дизайнера от 01.09.2026: оранжевая полоса при бейдже Warning).

- Generic-примитив, не деталь карточки: пригодится в таблицах, File Uploader,
  тостах. Времянкой внутри Cards не делать (Догма Клементия).
- Ждёт спеку в Figma: высота, радиус, цвета состояний (info/success/warning/
  error?), режимы (determinate / полоса-статус), токены.
- После появления: добавить вариант в секцию Stat and Metrics Card
  (`js/components/cards.js`, хелпер `statCard`).

Рядом же мелочь: у Symbol Badges (badge.js, SB_SVG) нет фабрики `sbMk*` —
лид-значок «i» из референса метрики сейчас собрать нечем.

---

## Оставшиеся группировки NAV

Механика родитель-дети готова и описана в `CLAUDE.md`, раздел «NAV: родители и дети».

Сделаны: Headers, Selection Controls, Text Fields и List.

Открытый вопрос по Text Fields: Search Bar и Selectors собраны из того же примитива `inputFieldWrap`, но самостоятельны по назначению и пока лежат отдельно. Заводить их внутрь — решение дизайнера.

| Родитель | Дети | Тип | Оценка |
|---|---|---|---|
| Buttons | Button, Chevron, Chips | группировка | Спорно: Chips по роли ближе к действию поверх контента |
| Status | Status, LED Panel | группировка | Спорно |
| Table | Table, Footer | группировка | Рано — оба компонента inProgress |

Не группировать: категорию Feedback целиком (Overlay, Popover, Dialogues, Toast, Snackbar, Banners) — это уже делает сама категория. И Segment Menu / Tab Bar / Sub Nav: они не сиблинги, Sub Nav вмещает первые два.

---

## Pending: мелкие вопросы

- **Context Menu — danger/critical вариант ячейки** — у `sbMkContextCell` нет красного (danger) варианта для деструктивных действий (Delete). Сейчас в row-меню таблицы Delete красится скоуп-стилем `.sb-td .sb-ctx-card > .sb-ctx-cell:last-child { color: --error }` (завязано на «последний = Delete»). Правильнее — добавить `mode:'danger'` или `.is-danger` в сам Context Menu (правка компонента, с ОК юзера), тогда красный Delete переиспользуется везде.

- **Table Tool Bar — overflow «⋯» меню** — островок bulk-действий теперь data-driven (`sbMkTableToolBar({actions:[…]})`) + `max-width` cap. Но при МНОГИХ кнопках (5+) он и накрывает больше центра ряда, и может упереться в max-width. Нужна стратегия переполнения: лишние действия сворачивать под «⋯» (overflow-меню). **Блокер снят 28.07.2026** — примитив Popover готов (`sbMkPopover`), портал решает и проблему клипа: `overflow:hidden` на островке панель больше не режет, потому что она уезжает в `<body>`.

- **Tool Bar — compact-режим сломан в двух местах** (найдено 28.07.2026 при миграции на Popover, не чинил — правка меняет вид компонента, нужна отмашка). Оба бага в `css/components/tool-bar.css`, блок `@container tool-bar (max-width: 600px)` со строки 138:
  1. **Компактные стили самого бара не применяются НИКОГДА.** `container-type/name` объявлены на `.sb-tool-bar` (строки 24–25), а внутри запроса правила адресованы ему же — `.sb-tool-bar:not(.compact-disabled) { padding … }` (строки 139, 143, 147, 158). Элемент не может запрашивать собственный контейнер, поэтому компактные padding, gap и уменьшённые иконки мертвы. Живут только правила для потомков. Проверено: на ширине 420px `padding` остаётся `8px 16px` вместо `4px 8px`. Чинится либо обёрткой-контейнером вокруг бара, либо переносом `container-type` на родителя.
  2. **`compact-disabled` не отключает схлопывание действий.** Строки 161–162 — `.sb-tool-bar-action { display: none }` и `.sb-tool-bar-menu-extra { display: flex }` — единственные в блоке без `:not(.compact-disabled)`, в отличие от соседей. То есть флаг гасит (точнее, должен был гасить — см. пункт 1) косметику, но кнопки всё равно уезжают в меню. Фикс — дописать `:not(.compact-disabled)` на оба, но он проявится только вместе с пунктом 1.

  Хук `sbToolBarSyncMenu` тут ни при чём: он меряет реальный `computed display` кнопки и честно отражает текущее поведение CSS, каким бы оно ни было. После починки подстроится сам.

- **Table Footer — нормальный page-size селектор** — временный компактный `.sb-sel` («10 ▾») в футере таблицы выглядел уродски, убрал. Нужен аккуратный селектор «строк на странице» (10/25/50/100) — отдельным заходом. Пока футер = Pagination (центр) + «Selected: N» (право).

- **Avatar 24px-вариант для Table Cell** — Avatar сейчас единственный размер 32px, в 40px-ряду тесновато (~4px сверху/снизу). Возможно нужен компактный 24px-вариант в avatar-компоненте. Юзер: «посмотрим позже» — не трогать без отмашки.

- **Inverse-цвета (токены) — на будущее** — Snackbar СДЕЛАН без них: юзерский трюк «фон `--text-tertiary` + контент `--surface-1`» — пара инвертируется темой сама. Полноценные `--surface-inverse` / `--text-inverse` (+ hover) всё же желательны для чистоты семантики (text-токен в роли фона — рабочий, но хрупкий контракт: смена оттенка text-tertiary красит и снэкбар). Путь: Figma `Color-DS.json` → `js/tokens.js` → `css/tokens.css`. `sbShowSnackbar` (низ по центру, слайд, 5с кольцо-таймер, вытеснение) и dogfood на всех копи-кнопках — ✅ сделаны; из поведенческого не делали только очередь (стек нескольких) и hover-паузу таймера.

- ~~**Table — select-all indeterminate («Unselect All»)**~~ — ✅ Сделано: с появлением рядов (`sbMkTableFull`) подключены `sbTableSelectAll` (пусто→выбрать все, часть/все→снять) + `sbTableRowSelect` (row-select) + `_syncHead` (хедер: 0→пусто, все→checked, часть→indeterminate/minus). Выбор — на уровне ряда (`.sb-trow.is-selected`).
- ~~**Antenna status export**~~ — ✅ Сделано: `window.sbAntenna = ANT;` добавлен в `status.js` (ключи full/high/mid/low/off). Переиспользуется в Table Header Secondary.
- **Section Header — sticky-вариант с подложкой** — паттерн уже живёт в рейке доков (`css/layout.css`, блок `.sidebar .sb-side-nav-body > .sb-section-header`): залипающая плашка категории несёт `box-shadow: 0 0 0 8px var(--background)` — подложку цвета поверхности, под которую уезжает список, чтобы строки не подходили вплотную к краю плашки. Spread, а не offset: у плашки скруглённые углы, сдвинутая копия оставляла бы в них щели. В компонент СОЗНАТЕЛЬНО не вынесено (03.08.2026): цвет подложки обязан совпадать с поверхностью хоста (здесь рейка `--background`, на странице был бы `--surface-1`), а `position: sticky` + `top` считаются из высоты чужой шапки — компонент об этом ничего не знает. Если выносить, то как opt-in: `sbMkSectionHeader({ sticky: true })` → `.is-sticky`, размер подложки из токена, цвет через переменную хоста (`--sb-sticky-surface`, дефолт `--background`); `top` остаётся на потребителе. **Триггер — второй потребитель:** у Table свои залипающие хедеры; когда дойдут руки, сверить поведение и выносить сразу с правильным API, а не подгонять задним числом.

- **List Table** — была обещана спека ("ща скину"), не пришла. Компонент не создан.
- **Title-case naming review** — `.sb-title-m-bold` теперь = `.sb-title-m + .sb-fw-semibold` (вес 600). Слово "bold" из старого имени отжило. Если где-то остались упоминания в комментах/доках — почистить.
- **Auto-detect wide-mode threshold** — `cfg.minPreview` сейчас задаётся вручную для 5 компонентов. Если паттерн повторится в новых — может стоить вынести в общий helper или дефолт.

---

## Done / архив

- **Popover: миграция завершена (28.07.2026)** — все 30 мест из 8 файлов
  уехали с времянки `sbOverflowMenuToggle` на примитив: Table, Header L/M/S,
  Section Header, Tool Bar, Nav Bar (табы, аватар, переключатель языка).
  Времянка и её CSS-блок `.sb-overflow-menu` удалены. По дороге в примитив
  добавлены `wrapCls`, `wrapAttrs`, `onOpen`, зеркало `is-open` на обёртку
  и `stopPropagation` по умолчанию.

Сюда переезжают завершённые крупные задачи для истории.

- ✅ **Typography weight decompose** — size классы (`.sb-h*`, `.sb-title-*`, etc.) больше не несут font-weight; вес через отдельные `.sb-fw-*` утилиты (2026-06-02).
- ✅ **Playground auto wide-mode** — `SB_PG._autoDetectWide` + ResizeObserver, `cfg.minPreview` opt-in для тонких случаев (2026-06-02).
- ✅ **Playground controls grid** — pg-group паттерн для семантической группировки контролов; 8 playground'ов перегруппированы (Nav Bar, Input, Search Bar, Password, Textarea, Selectors, Buttons, Context Menu) (2026-06-02/03).
