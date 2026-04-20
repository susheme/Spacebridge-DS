# JS Components — правила для агента

## Границы

Работай **только в `<name>.js`** того компонента, над которым работаешь. Чужие компоненты не редактируй.

Если видишь баг или dead code в соседнем файле — **не чини сам**, сообщи пользователю.

## Структура файла

```js
// Обязательный заголовок
// ═══════════════════════════════════════════════════════════════════════════
//  <NAME>
//  CSS в css/components/<name>.css — SYNC-маркеры обязательны.
// ═══════════════════════════════════════════════════════════════════════════

// 1. CSS-snippet для code panel (зеркало CSS-файла)
window.COMP_CSS.<key> = `...`;

// 2. IIFE с регистрацией
(() => {
  // Локальные хелперы (buildClass, mk* и т.п.)
  function myClass(s) { ... }

  sbRegister({
    name: '<nav-id>',
    title: '...',
    description: '...',
    playground: { state, controls, render, genCode },
    // или sections: [...]
  });
})();
```

## Что можно использовать

Глобалы из `core.js`:
- `sbRegister(config)` — регистрация
- `SB_PG` — playground runtime (через `pg.toggle/pg.select`)
- `COMP_CSS` — словарь CSS-snippets
- `sbIcon(name, size)`, `sbIconRaw(name, size)` — иконки
- `boolAttr(name, cond)`, `mlBoolAttr(name, cond)` — булевые атрибуты
- `ICON_PATHS`, `SB_GLYPHS`, `PG_CHEVRON`
- `esc(str)` — экранирование `<`/`>`

## Запреты

- ❌ Не объявляй `const` на top-level — только внутри IIFE. Top-level переменные из разных файлов конфликтуют.
- ❌ Не инлайнь `<svg>` — используй `sbIcon()`/`sbIconRaw()`.
- ❌ Не используй `#hex`/`rgba()` — только `var(--token)`.
- ❌ Не используй inline `font-size`/`font-weight`/`font-family` — только `sb-*` классы.
- ❌ Не добавляй `import`/`export` — ломает `file://`.
- ❌ Не редактируй другие `components/*`.

## Если нужен новый хелпер

Обсуди с пользователем. Общие хелперы живут в `core.js`, но менять его ты не можешь без согласия.

## Добавление компонента

Копируй `js/_template.js` → `js/components/<name>.js`. Заполняй по шагам из `CONTRIBUTING.md` в корне.
