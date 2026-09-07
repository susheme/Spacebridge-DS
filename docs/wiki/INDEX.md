# Spacebridge DS — Wiki агента

База знаний по подходу «LLM wiki» (Карпатый): plain-Markdown, одна страница — одна тема,
читается по потребности. Правила (жёсткие, короткие) живут в `CLAUDE.md`; здесь — знания:
архитектура, история решений, грабли.

## Протокол (для агента)

1. **Перед работой над компонентом** — открой его страницу в `components/` (если есть) и просмотри `patterns/`-заголовки ниже: вероятная грабля уже описана.
2. **После работы** — обнови затронутую страницу: новые решения, новые грабли, статус. Нет страницы — создай по образцу соседней.
3. Страницы — компактные: факты и решения, без пересказа кода. Ссылки между страницами — обычные относительные md-ссылки.
4. Обновление индекса: новая страница вне components/ = одна строка в списке ниже; components-список собирается генератором.
5. **Скелеты компонентов** — `jsc tools/gen-wiki.js` пересобирает GEN-блоки «фактов из кода» (файлы, load order, deps, API) во всех `components/*.md` и этот список. Ручной текст вне маркеров не трогает. Гонять после заметных правок компонентов.

## Components

<!-- GEN:COMPONENTS:BEGIN — список собирает `jsc tools/gen-wiki.js`, руками не править -->
- [chevron.md](components/chevron.md) — Chevron Button — скелет; заметки заполняются по ходу работы.
- [grid-system.md](components/grid-system.md) — Grid System — скелет; заметки заполняются по ходу работы.
- [buttons.md](components/buttons.md) — Button — фабрика sbMkButton СДЕЛАНА 04.08.2026, ~150 мест мигрированы; догма Клементия закрыта полностью
- [badge.md](components/badge.md) — Badge — скелет; заметки заполняются по ходу работы.
- [banners.md](components/banners.md) — Banners — скелет; заметки заполняются по ходу работы.
- [snackbar.md](components/snackbar.md) — Snackbar — скелет; заметки заполняются по ходу работы.
- [action-bar.md](components/action-bar.md) — Action Bar — скелет; заметки заполняются по ходу работы.
- [popover.md](components/popover.md) — Spacebridge DS — Popover (примитив якорного позиционирования) готов 28.07.2026; раздел Pop-Ups переименован;…
- [separators.md](components/separators.md) — Separators — скелет; заметки заполняются по ходу работы.
- [avatar.md](components/avatar.md) — Avatar — скелет; заметки заполняются по ходу работы.
- [toggles.md](components/toggles.md) — Toggles — скелет; заметки заполняются по ходу работы.
- [checkbox.md](components/checkbox.md) — Checkbox — скелет; заметки заполняются по ходу работы.
- [radio.md](components/radio.md) — Radio — скелет; заметки заполняются по ходу работы.
- [counters.md](components/counters.md) — Counters — скелет; заметки заполняются по ходу работы.
- [kbd.md](components/kbd.md) — Keyboard Shortcut — скелет; заметки заполняются по ходу работы.
- [search-bar.md](components/search-bar.md) — В Search Bar опции iconLeft и rightSlot взаимоисключают .sb-search-btn. Используется для глобального поиска с…
- [input.md](components/input.md) — Input — скелет; заметки заполняются по ходу работы.
- [textarea.md](components/textarea.md) — Textarea — скелет; заметки заполняются по ходу работы.
- [password.md](components/password.md) — Password Input — скелет; заметки заполняются по ходу работы.
- [header-xs.md](components/header-xs.md) — Header XS — скелет; заметки заполняются по ходу работы.
- [file-uploader.md](components/file-uploader.md) — File Uploader — ГОТОВ (done в NAV, июль 2026): дропзона, Upload Cell (Completed/Uploading/Failed), живой…
- [tags.md](components/tags.md) — Tags — скелет; заметки заполняются по ходу работы.
- [status.md](components/status.md) — Status — скелет; заметки заполняются по ходу работы.
- [tooltips.md](components/tooltips.md) — Tooltips — скелет; заметки заполняются по ходу работы.
- [chips.md](components/chips.md) — Chips — скелет; заметки заполняются по ходу работы.
- [toast.md](components/toast.md) — Toast — скелет; заметки заполняются по ходу работы.
- [info-footer.md](components/info-footer.md) — Info Footer — скелет; заметки заполняются по ходу работы.
- [list.md](components/list.md) — Standard List — скелет; заметки заполняются по ходу работы.
- [property-list.md](components/property-list.md) — Property List — скелет; заметки заполняются по ходу работы.
- [context-menu.md](components/context-menu.md) — Context Menu — скелет; заметки заполняются по ходу работы.
- [table.md](components/table.md) — Spacebridge DS — компонент Table (хедеры, ячейки, состояния, footer, tool bar, пагинация, kebab). Готов,…
- [section-header.md](components/section-header.md) — Header Section — скелет; заметки заполняются по ходу работы.
- [selectors.md](components/selectors.md) — Selectors / Dropdowns — скелет; заметки заполняются по ходу работы.
- [segment-menu.md](components/segment-menu.md) — Segment Menu — скелет; заметки заполняются по ходу работы.
- [tabs.md](components/tabs.md) — Tabs — скелет; заметки заполняются по ходу работы.
- [tab-bar.md](components/tab-bar.md) — Tab Bar — скелет; заметки заполняются по ходу работы.
- [toc.md](components/toc.md) — Sticky Table of Contents — скелет; заметки заполняются по ходу работы.
- [breadcrumbs.md](components/breadcrumbs.md) — Breadcrumbs — скелет; заметки заполняются по ходу работы.
- [pagination.md](components/pagination.md) — Pagination — скелет; заметки заполняются по ходу работы.
- [table-footer.md](components/table-footer.md) — Table Footer — скелет; заметки заполняются по ходу работы.
- [header-s.md](components/header-s.md) — Header S — скелет; заметки заполняются по ходу работы.
- [header-m.md](components/header-m.md) — Header M — скелет; заметки заполняются по ходу работы.
- [header-l.md](components/header-l.md) — Header L — скелет; заметки заполняются по ходу работы.
- [nav-bar.md](components/nav-bar.md) — Архитектура и решения по Nav Bar: container queries, slot-padding, hover-dropdown, search compact overlay,…
- [tool-bar.md](components/tool-bar.md) — Tool Bar — скелет; заметки заполняются по ходу работы.
- [led-panel.md](components/led-panel.md) — LED Panel — скелет; заметки заполняются по ходу работы.
- [sub-nav.md](components/sub-nav.md) — Sub Nav — скелет; заметки заполняются по ходу работы.
- [overlay.md](components/overlay.md) — Overlay — скелет; заметки заполняются по ходу работы.
- [side-navigation.md](components/side-navigation.md) — Side Navigation в Spacebridge DS = два типа (Side Menu / Side Bar) в одном компоненте через variant
- [placeholders.md](components/placeholders.md) — Placeholders — скелет; заметки заполняются по ходу работы.
- [cards.md](components/cards.md) — Spacebridge DS Cards — 5 типов закоммичены (aa2d028, 01.09.2026), статус Incomplete; механика слотов, гочи,…
- [side-panel.md](components/side-panel.md) — Side Panel — скелет; заметки заполняются по ходу работы.
- [dialogues.md](components/dialogues.md) — Dialogues — скелет; заметки заполняются по ходу работы.
- [getting-started.md](components/getting-started.md) — Getting Started — скелет; заметки заполняются по ходу работы.
<!-- GEN:COMPONENTS:END -->

Вне генератора (файлы не в `js/components/`):

- [updates.md](components/updates.md) — колокольчик обновлений (`js/updates.js` + `js/updates-ui.js`): лента + read/unread; панель ждёт Figma

## Infra

- [index-structure.md](infra/index-structure.md) — зоны index.html, SYNC-блоки, COMP_CSS, цветовые токены, гочи правок
- [tokens-generator.md](infra/tokens-generator.md) — `jsc tools/gen-tokens.js`, три режима Figma → mobile-first, брейкпоинты 320/768/1280
- [figma-tokens-immutable.md](infra/figma-tokens-immutable.md) — токены не правятся под нужды playground; обёртка вместо правки
- [tests.md](infra/tests.md) — `jsc tests/run.js`, что ловят 19 проверок и чего принципиально не ловят
- [docs-i18n.md](infra/docs-i18n.md) — sbT(en,ru), sbDocNote, стиль-критерии, статус 39/40, FR отложен
- [playground-wide-mode.md](infra/playground-wide-mode.md) — wide: true, фиксы ширины preview/controls
- [playground-pg-toggles.md](infra/playground-pg-toggles.md) — единый .pg-toggles, auto-fill сетки, грабли minmax
- [playground-pg-group.md](infra/playground-pg-group.md) — sbPgGroup(), план промоушна в Fieldset

## Conventions

- [dogma-klementiya.md](conventions/dogma-klementiya.md) — только свои компоненты; времянок не делать вообще
- [reuse-existing-styles.md](conventions/reuse-existing-styles.md) — перед новым font/color/class — grep по DS
- [new-component-audit.md](conventions/new-component-audit.md) — новый компонент: сначала аудит «что есть / чего нет»
- [writing-style.md](conventions/writing-style.md) — инфостиль текстов документации
- [title-case.md](conventions/title-case.md) — text-transform: capitalize на заголовочных классах

## Patterns (CSS/JS-грабли)

- [flex-min-width-zero.md](patterns/flex-min-width-zero.md) — слот клипается → min-width:0 на flex:1 ребёнке
- [overlay-portal.md](patterns/overlay-portal.md) — fullscreen-оверлеи только через portal в body
- [transparent-border-reserve.md](patterns/transparent-border-reserve.md) — border: transparent на базе, вариант красит цвет
- [lineheight-clipping.md](patterns/lineheight-clipping.md) — трункейт + плотный line-height режет descender'ы; padding/margin-block фикс
- [child-over-parent-radius.md](patterns/child-over-parent-radius.md) — непрозрачный ребёнок срезает радиус родителя
- [no-cosmetic-overflow-hidden.md](patterns/no-cosmetic-overflow-hidden.md) — overflow:hidden «для защиты» клипает popover'ы
- [horizontal-scroll-previews.md](patterns/horizontal-scroll-previews.md) — широкий контент в превью — в overflow-x:auto
- [script-load-order.md](patterns/script-load-order.md) — cross-component хелперы в демо и порядок загрузки
- [border-token.md](patterns/border-token.md) — границы только --border, не --surface-2
- [grid-icon-layout.md](patterns/grid-icon-layout.md) — сетки иконок: Grid auto-fill, не flex-wrap
- [toggle-short-labels.md](patterns/toggle-short-labels.md) — лейблы тогглов в playground — одно слово
- [export-svg-button.md](patterns/export-svg-button.md) — паттерн кнопки Export SVG / Download ZIP

## Plans

- [dogfood-headers.md](plans/dogfood-headers.md) — затащить Header L/M/Section в хром самой DS (отдельный заход)
