# Contributing to Spacebridge DS

## Запуск

Просто открой `index.html` в браузере:

```
open index.html
```

`file://` работает — никаких серверов не нужно. Загрузка идёт через обычные `<link>` и `<script>` теги.

## Структура

```
.
├── index.html                     ← тонкая оболочка с <link>/<script>
├── css/
│   ├── tokens.css                 ← радиусы, transitions, sidebar width
│   ├── reset.css                  ← reset, body, scrollbar
│   ├── layout.css                 ← topbar, sidebar, content grid
│   ├── typography.css             ← .sb-h*, .sb-body-*, .sb-mono, .sb-brand
│   ├── playground.css             ← .pg-*, .sec-*
│   ├── docs.css                   ← color-grid, typo-scale, sb-sb-grid
│   ├── animations.css             ← @keyframes
│   └── components/
│       └── <name>.css             ← один файл на компонент
└── js/
    ├── core.js                    ← NAV, ICON_PATHS, SB_PG, sbRegister, etc
    ├── docs-helpers.js            ← copy/code helpers
    ├── init.js                    ← renderPage, init()
    ├── _template.js               ← болванка для нового компонента
    ├── _index.js                  ← документированный список компонентов
    └── components/
        └── <name>.js              ← один файл на компонент
```

## Как добавить компонент (пошагово)

### 1. Скопируй `_template.js`

```
cp js/_template.js js/components/dropdown.js
```

### 2. Создай CSS-файл

```
touch css/components/dropdown.css
```

Формат (обязательны SYNC-маркеры):

```css
/* --- [SYNC:dropdown] Dropdown --- */
.sb-dropdown {
  /* цвета только через var(--token) */
  background: var(--surface-1);
  color: var(--text-primary);
  border-radius: var(--radius-2);
}
/* --- [/SYNC:dropdown] --- */
```

### 3. Заполни `dropdown.js`

Замени `myComponent` на имя ключа (в camelCase). Замени `my-component` на id (kebab-case, совпадает с NAV id).

```js
window.COMP_CSS.dropdown = `.sb-dropdown { ... }`;  // зеркало CSS-файла

(() => {
  sbRegister({
    name: 'dropdown',
    title: 'Dropdown',
    description: '...',
    playground: {
      state: { open: false },
      controls(pg) { return pg.toggle('open', 'Open'); },
      render(s) { return `<div class="sb-dropdown ${s.open ? 'open' : ''}"></div>`; },
      genCode(s) { return { html: '...', css: COMP_CSS.dropdown }; },
    },
  });
})();
```

### 4. Подключи в `index.html`

```html
<link rel="stylesheet" href="css/components/dropdown.css">
...
<script src="js/components/dropdown.js"></script>
```

### 5. Добавь в NAV (`js/core.js`)

```js
{ id: 'dropdown', label: 'Dropdown', inProgress: true },
```

Статусы NAV:
- `inProgress: true` — оранжевая точка + бейдж "In Progress". Ставь при создании.
- `ready: true` — зелёная точка. Ставится только после приёмки дизайнером.
- без флага — серая точка, "Coming Soon".

### 6. Добавь строку в `js/_index.js`

Для документации порядка загрузки.

### 7. Проверь локально

```
open index.html
```

Перейди на страницу компонента в сайдбаре. Проверь playground, тему dark/light, код в панели.

## Правила

### Цвета
Только через `var(--token)` из `css/tokens.css` или из `COLOR_TOKENS` (index.html `<head>`).
Запрещено: `#hex`, `rgba(...)` в компонентах.

### Шрифты
Только через `sb-*` классы:
- Заголовки: `.sb-h1` — `.sb-h8`
- Заголовки контролов: `.sb-title-l`, `.sb-title-m`, `.sb-title-s`
- Текст: `.sb-body-l`, `.sb-body-m`, `.sb-body-s`, `.sb-sub`
- Метки: `.sb-caption`
- Моноширинный: `.sb-mono`
- Брендовый: `.sb-brand`

Запрещено: inline `font-size`, `font-weight`, `font-family`.

### Иконки
Только через `sbIcon(name, size)` (с `sb-icon-wrap` обёрткой) или `sbIconRaw(name, size)` (голый `<svg>` для копируемых примеров). Имена — из `ICON_PATHS` в `js/core.js`.

Нужна новая иконка? Добавь path в `ICON_PATHS` (js/core.js). Не инлайнь `<svg>` в компонент.

### Размеры и отступы
Радиусы — через токены `--radius-N` (N в px): `--radius-0`, `-1`, `-2`, `-4`, `-6`, `-8`, `-10`, `-12`, `-14`, `-16`, `-18`, `-20`, `-22`, `-24`, `-28`, `-100`. Имена совпадают с Figma Dimensions/Radius.

Отступы, высоты, ширины — пока inline, это OK (семантически специфично для компонента).

## Редактирование существующего компонента

Работай только в двух файлах: `js/components/<name>.js` + `css/components/<name>.css`. Не трогай чужие компоненты.

Если нужен общий хелпер — обсуди с автором. Не лезь сам в `js/core.js`, `js/docs-helpers.js`.

## Токены цвета

Редактируются в одном месте: `js/tokens.js` (массив `window.COLOR_TOKENS`). CSS-переменные (`--primary`, `--background` и т.д.) генерируются автоматически при загрузке для `[data-theme="dark"]` и `[data-theme="light"]`.

## Типографика

Редактируется в `css/typography.css`. Менять значения — только с согласия дизайнера.

## Версионирование

Semver `MAJOR.MINOR.PATCH`:

- **MAJOR** — ломающее изменение: переработка токенов / сетки / типографики или
  несовместимое изменение API компонента (что-то существующее перестаёт работать
  как раньше). Пример: `2.0.0`.
- **MINOR** — релиз с **новым компонентом** (или крупной новой фичей). Пример:
  добавили Avatar → `1.1.0`. Считаем **по релизам**: один релиз с новыми
  компонентами = один MINOR bump, даже если компонентов несколько.
- **PATCH** — фикс или твик существующего: тени, цвета, отступы, баги. Пример:
  поправили error-цвет → `1.1.1`.

PATCH сбрасывается в 0 при каждом MINOR, MINOR — при каждом MAJOR.

**Источник версии — один:** бейдж в Nav Bar (`index.html`, `.sb-nav-bar-badge`).
Его автоматически читает Info Footer в подвале DS. Бампнул релиз → обнови бейдж
и добавь запись в `CHANGELOG.md` (newest first).
