# Документация EN/RU (sbT, sbDocNote)

> Переписывание всех описаний DS на EN/RU с плашками Tech Info/Important — 39/40 готово, осталось notifications; FR отложен (клиенты в Канаде реальны)

Юзер поручил мне переписать ВСЕ тексты описаний в Spacebridge DS (2026-07-02). Пилот (5 хедеров) юзер ОДОБРИЛ. Сделаны (39/40): хедеры (5) + навигация/бары (11: separators, tool-bar, action-bar, breadcrumbs, nav-bar, pagination, segment-menu, side-navigation, toc, sub-nav, tab-bar) + Data Display (11: avatar, badge, context-menu, counters, info-footer, led-panel, list, status, table (вкл. кастомный renderPage — тексты инлайном в template literal через ${sbT(...)}), table-footer, tags) + Forms (10) + kbd + getting-started (кастомный renderPage; вычесал скрытые русские Effect Styles). Закоммичено: f7c2158 (Forms+kbd), d161f96 (Data Display+хедеры). **getting-started НЕ закоммичен** — жду отмашки. Осталось ТОЛЬКО notifications (1/40) — тексты EN старого образца, без примеров/плашек.

**Snackbar + Button Mini (2026-07-03):** Snackbar — 4-й саб-компонент notifications (типы по СОСТАВУ: Feedback / Action Undo·Refresh; инверс-плашка = фон --text-tertiary + контент --surface-1, БЕЗ inverse-токенов — трюк юзера; sbMkSnackbar + sbSnackbarDismiss; msg = sb-title-s sb-fw-regular, clamp 1). Button Mini: токены --button-mini-font-size/line-height (12/10) в tokens.css, класс .sb-btn-mini (24px, width 40–68, вес 500) в buttons.css+выжимка COMP_CSS (там НЕ 1:1 зеркало!), чекбокс Mini в extras текстовой кнопки. sbShowSnackbar СДЕЛАН (низ-центр host, слайд, 5с кольцо-countdown — анимация только на .is-live, вытеснение; дефолт без аргументов = success + sbT('Copied','Скопировано') + timer + close). Dogfood-копирование: copyCodeSection/copyColor (локальный тост заменён)/copyTypo (docs-helpers.js), SB_PG.copySection (core.js), effect-styles inline (getting-started). Кольцо — инлайн-svg circle (компонентная графика, не иконка). API дружелюбный: action строкой, timer числом секунд (инлайн animation-duration + host-таймаут синхронно). Очередь и hover-пауза таймера — не деланы (бэклог). Доковые плашки: длинные Tech Info (>180 симв/язык) сворачиваются по умолчанию — шеврон (Chevron mini dogfood) в правом слоте, sbDocNoteToggle; Important никогда не сворачивается; финал — переезд длинноты в Dialogues/Modals, когда появятся.

**Banners (notifications) — ПЕРЕДЕЛАН по спеке юзера (2026-07-03):** 4 типа (info/success/warning=--alert/error), left-marker 4px, контент 80/20, Title M, gap 4px, тайтл-ссылка, генерик right-slot (Badge-Status Mini / close / кнопки), `sbMkBanner`. sbDocNote теперь рендерит НАШ баннер (Tech Info→info, Important→warning; разметка заинлайнена — load-order!), обёртки desc `<p>`→`<div>` в core.js/table/getting-started. Playground: type/lead/right + toggles Title/Link/Text, per-type PG_DEMO, живой dismissBanner. НЕ ЗАКОММИЧЕНО (вместе с getting-started).

**FR-локализация — ОТЛОЖЕНА (решение юзера 2026-07-03).** Французские клиенты РЕАЛЬНЫ (Канада), значит FR не балласт, а будущая работа. Делать ПОСЛЕ того как добьём все компоненты текущей версии. Тех.путь готов: `sbT(en, ru)` → `sbT(en, ru, fr)` + CSS-правило `data-lang="fr"` + FR уже есть в свитчере (`LANG_OPTIONS` в nav-bar.js: EN/RU/FR/ES). Сейчас FR/ES в свитчере молча фолбэчатся на EN — юзер знает, оставили как есть (не выпиливал свитчер). Мой французский НИКТО в команде не отревьюит — предупредить юзера при переводе.

**Доп. критерии юзера с 3-й партии:** примеры использования в описаниях («Пример: статус деплоя в таблице устройств»), короткие предложения, не грузить читателя.

**Стиль текстов (критерии юзера):**
- Формальный, но простой; БЕЗ фамильярности и обращений на «ты» («добавь», «попробуй» — запрещены; безличные формулировки)
- Кратко. EN — первичный язык, RU — перевод
- Тех-параметры (размеры, отступы, breakpoints, анатомия) — НЕ в основном тексте, а в плашке `sbDocNote('Tech Info', ...)` — это placeholder до будущего pop-up/модалки
- Критичное для разрабов/дизайнеров — `sbDocNote('Important', ...)`
- Юзер пришлёт спеку плашек позже; пока интерим-стиль по скриншоту (светлая карточка, синий левый борт 4px, иконка info solid)

**Инфраструктура (сделано):**
- `js/docs-i18n.js` — `sbT(en, ru)` (пара спанов, CSS-переключение по `html[data-lang]`), `sbDocNote(title, body)`, регистрация `ICON_PATHS['information-fill']` (перенести в core.js при случае). Грузится после docs-helpers.js, ДО components
- CSS в конце `css/docs.css`: `.sb-doc-note*` + правила видимости `.i18n-en/.i18n-ru`. Default EN
- Переключение — существующий lang switcher в топбаре (`sbMkLangSwitcher`, dogfood): обёрнут `sbNavBarLangPick`, реагирует только на `#dsNavRight`; RU→ru, остальное→en; localStorage `sb-lang`
- ВАЖНО: desc/description вставляются в `<p>` — в плашках/sbT только `<span>` (div разорвёт параграф)
- Паттерн: description = проза без цифр (+ Important если критично); секция Anatomy несёт Tech Info плашку со всеми параметрами

**Гочи:** старые описания могут врать про токены/цифры — сверять с CSS компонента (header-l: surface-2 → реально `--border-soft`; nav-bar: табы прячутся на 1024px, не 640; sub-nav: высота фикс 58px, padding 0/24, divider `--border-soft` — доки были совсем стухшие; комментарий в шапке css/components/sub-nav.css про surface-2 тоже стухший — юзеру зарепорчено). Стухшие «будет добавлено позже» дропать, если фича уже есть (tool-bar .bottom). Названия секций остаются EN в обоих языках. Верификация — jsc-харнесс в scratchpad (extract.js), не браузер (правило «без превью» — CLAUDE.md).

**Раздел разделён (2026-07-31):** «Notifications & Banners» → два раздела. `banners` (Banners: Banner / Notification Bar / Doc Note, `js|css/components/banners.js|css`, COMP_CSS.banners) и `snackbar` (Snackbar, свои файлы + COMP_CSS.snackbar). Файлы `notifications.js|css` удалены. Load order: chevron → badge → **banners** (первая тройка, sbDocNote зависит от sbMkBanner) → **snackbar** (зовёт sbDocNote в секции + success-fill из SB_BADGE_SPECS). NAV: Banners = Incomplete, Snackbar = ready.

Связано: [Структура index.html](index-structure.md), [Figma-токены неприкосновенны](figma-tokens-immutable.md)

---
*Перенесено из памяти агента 07.09.2026, дословно.*
