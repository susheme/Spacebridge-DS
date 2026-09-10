# Генератор npm-пакета стилей — tools/gen-pkg.js

Собирает `pkg/` — фреймворк-независимый CSS-пакет DS для Angular-команды
(контекст и стратегия — [plans/angular-adoption.md](../plans/angular-adoption.md)).

## Запуск

```
mkdir -p pkg/css/components pkg/fonts      # однократно
jsc tools/gen-pkg.js
cp -p fonts/*.woff2 pkg/fonts/             # бинарники jsc не копирует
```

## Состав pkg/

- `css/tokens.css`, `css/typography.css` — копии из `css/`.
- `css/colors.css` — генерится из `js/tokens.js` (COLOR_TOKENS): светлая тема в `:root` (дефолт для потребителей без theme-скрипта), тёмная — `[data-theme="dark"]`. Правки цветов в js/tokens.js доезжают перегенерацией.
- `css/base.css` — `reset.css` минус site-shell (`overflow:hidden`/`height:100vh` на body — потребителям нельзя). Если паттерн в reset.css изменится, генератор падает с ошибкой, а не молчит.
- `css/spacebridge-ds.css` — полный бандл; порядок компонентов парсится из `index.html`.
- `package.json`, `README.md` — создаются только если отсутствуют (имя/версия — ручные решения).
- `LICENSE`, `NOTICE`, `fonts/` — Apache-2.0 обязывает возить с собой.

## Решения / грабли

- Имя `@spacebridge-ds/styles` и версия 0.1.0 — плейсхолдеры до созвона с разработчиком (registry, scope).
- `@font-face` в tokens.css ссылается на `url('../fonts/...')` — структура pkg/css + pkg/fonts повторяет корень, пути работают без правок.
- jsc `tryRead` несуществующего файла печатает «Could not open file» в stdout — это не ошибка, подавить нельзя.
- Перегенерация pkg НЕ автоматическая: после правок цветов/токенов/компонентных CSS гонять руками. Проверки синхронности pkg в tests/ пока нет.
