# Demo: App Host — demo/app-host/

Три экрана продукта App Host (login / events / management), переведённые на язык
Spacebridge DS по скриншотам юзера (14.09.2026). Цель — догфуд npm-пакета и
живое демо к созвону ([../plans/angular-adoption.md](../plans/angular-adoption.md)).

## Механика

- Страницы генерятся: `jsc demo/app-host/build.js` (из корня). Руками html не правится.
- Билдер грузит DS под DOM-заглушкой (как tests/runtime.js) и собирает разметку фабриками `sbMk*`.
- Стили — только `pkg/css/spacebridge-ds.css` + раскладочный клей на токенах в `<style>` страницы.
- Интерактив минимальный (SHELL_JS): тема (data-theme + localStorage), переходы по табам, глазок пароля. JS DS в браузер не тянется.

## Решения перевода (не пиксельная копия — язык DS)

- Круглые severity-иконки чужой DS → наши `sb-status-dot` (online / maintenance).
- Их статусы Active/Alternate → `sbMkBadgeStatus` green/grey.
- Пагинация «|← →|» и page-size селектор → наш Table Footer + Pagination (селектора в DS нет — BACKLOG).
- Кнопка Events в нав-баре гостевого экрана убрана (решение юзера).
- Иконка БД в нав-баре не переносится — она только для dev-режима App Host.
- Иконки filter-line / arrow-go-back-line / save-line добавлены дизайнером в Icons/ и в `ICON_PATHS`+`ICON_PATHS_S` (core.js, с явного разрешения).

## Ревью юзера 14.09.2026 — исправления

10 пунктов + «у страниц свой хэдэр с хэдлайном». Итог:

- Хэдлайны страниц — sbMkHeaderL (Events, Management), в Login-карточке — sbMkHeaderM. Голый `sb-h6` вместо Header-компонентов — ошибка.
- Filter — `sbMkButtonWithLabel` (иконка + подпись), не secondary с лейблом.
- Login / Guest Mode — secondary кнопки, НЕ link (консистентность нав-бара).
- Логотип App Host — обычная типографика: `sb-brand` (фирменный шрифт Spacebridge) стороннему продукту не полагается. Плюс шрифта в pkg вообще не было — см. [pkg-generator.md](pkg-generator.md).
- Бейджи в ячейках таблиц — ТОЛЬКО mini (canon mkCell `_badge`); полноразмерные упираются в 40px ряд.
- Backup-дропзона — наш `sbMkUploaderArea`, не самодельная зона с кнопкой.
- Контейнер страницы — примитив `sbMkPage` (max-width + центр), раскладка колонок — `sbMkFlex`/`sbMkFlexItem`; контент не растягивается на всю ширину.
- Section Headers (фон --surface-2) кладутся на белую панель, не на фон страницы того же цвета.
- Центрирование Login: flex-цепочка от `body{min-height:100vh}`, а не от вложенного контейнера с min-height.

## Sticky-хэдэр панели: три грабли (найдены computed-проверкой 14.09.2026)

1. `padding-top:0` скролл-зоны перебивало pkg-правило `.sb-card>.sb-card-body:first-child{padding:var(--pad-vert-16)}` — специфичность (0,2,1) выше класс-пары. Селектор демо усилен.
2. То же правило задаёт БОКОВЫЕ паддинги вертикальным токеном `--pad-vert-16` — full-bleed надо тянуть этим токеном, не `--pad-horiz-16`. Кандидат на разбор с дизайнером: боковой паддинг вертикальным токеном выглядит ошибкой.
3. `.sb-header-l` несёт `width:100%; max-width:1024` — full-bleed требует `width:calc(100% + 2*pad); max-width:none`.

Плюс: `.sb-uploader-area{min-width:320px}` распирает панель на телефоне — в демо погашено `min-width:0`; кандидат на адаптивный фикс в компоненте File Uploader.

## Грабли / хвосты

- Таблица без чекбокс-колонки собирается локальным `demoTable()` из ячеек `.sb-th/.sb-td`: `sbMkTableFull` всегда рисует select-колонку. Кандидат на опцию `selectable:false` в Table.
- Password-фабрика не экспортирована из password.js — разметка взята copy-paste из code panel. Кандидат на экспорт (как sbMkTextField).
- Пустой `sectionHeader('')` над NTP-колонкой держит вертикальное выравнивание с полосой Management — спорно, показать юзеру.
