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

## Грабли / хвосты

- Таблица без чекбокс-колонки собирается локальным `demoTable()` из ячеек `.sb-th/.sb-td`: `sbMkTableFull` всегда рисует select-колонку. Кандидат на опцию `selectable:false` в Table.
- Password-фабрика не экспортирована из password.js — разметка взята copy-paste из code panel. Кандидат на экспорт (как sbMkTextField).
- Пустой `sectionHeader('')` над NTP-колонкой держит вертикальное выравнивание с полосой Management — спорно, показать юзеру.
