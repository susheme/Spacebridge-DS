# Инструкции для агента

## Контекст

Spacebridge UI — single-page design system без фреймворка и бандлера. Загружается из `file://` — **не добавляй ESM импорты, type="module", бандлеры**. Только `<link>` и `<script src="…">` в `index.html`.

Человеческая документация для дизайнера — `CONTRIBUTING.md`. Этот файл — для тебя, агента.

## Правила (жёсткие, не нарушать)

### Границы редактирования
- Работай **только в файлах компонента, над которым работаешь**: `js/components/<name>.js` + `css/components/<name>.css`.
- **Не редактируй** чужие `components/*`. Если нужно — проси у пользователя подтверждения.
- Файлы `js/core.js`, `js/docs-helpers.js`, `js/init.js`, `css/tokens.css`, `css/typography.css`, `css/layout.css`, `css/playground.css` — не трогай без явной просьбы.

### Цвета
- Только через `var(--token)` из `js/tokens.js` (массив `COLOR_TOKENS`) или `css/tokens.css` (не-цветовые токены — радиусы, border-width, transition).
- **Запрещено:** `#hex`, `rgb(...)`, `rgba(...)` в компонентах.
- Если нужен новый цвет — предложи добавление в `js/tokens.js`, не решай сам.

### Источник токенов
- Source of truth для цветов: `deepseek_html_20260417_007c40.html` (и `Figma Tokens/Color-DS.json`).
- Source of truth для размеров: `Figma Tokens/Dimensions-DS.json`.
- Source of truth для типографики: `Figma Tokens/Typography-DS.json`.
- **Правило:** токен добавляется в `css/tokens.css` / `js/tokens.js` тогда и только тогда, когда он есть в Figma JSON. Не придумывай токены сам. Не пропускай JSON-токены с формулировкой «не используется».

### Шрифты
- В разметке (HTML) — только `sb-*` классы: `.sb-h1`–`.sb-h8`, `.sb-title-l/m/s`, `.sb-body-l/m/s`, `.sb-sub`, `.sb-caption`, `.sb-mono`, `.sb-brand`.
- В CSS-компонентов — font-size/weight/line-height через токены (см. ниже).
- **Запрещено:** inline `font-size`, `font-weight`, `font-family` в `style="..."`.
- Если в `sb-*` нет нужного — спрашивай, не придумывай.

### Иконки
- Только через `sbIcon(name, size)` или `sbIconRaw(name, size)` с именами из `ICON_PATHS` (в `js/core.js`).
- `sbIcon` — с `<span class="sb-icon-wrap">` обёрткой (для UI).
- `sbIconRaw` — голый `<svg>` (для copyable примеров в `genCode`).
- **Запрещено:** инлайнить `<svg>` в компонентах.
- Нужна новая иконка — предложи добавить path в `ICON_PATHS`, не инлайнь.

### Размеры / отступы
- **Радиусы** — только токены `--radius-0/1/2/4/6/8/10/12/14/16/18/20/22/24/28/100`.
- **Border-width** — только `--border-width-1/1-5/2/4`.
- **Gap** — `--gap-horiz-0/xxs/xs/s/m/lg/xl/xxl` и `--gap-vert-0/xxs/xs/s/m/lg/xl`.
- **Padding** — `--pad-horiz-0/2/4/8/16/24/28/32/40/42/44/48` и `--pad-vert-*` (тот же набор).
- **Font-size** — `--headline-font-size-h1…h8`, `--title-font-size-l/m/s/caption`, `--body-font-size-l/m/s`, `--link-font-size-l/m/s`, `--button-font-size`, `--badge-font-size`, `--subscription-font-size`.
- **Font-weight** — `--font-weight-light/regular/medium/semibold/bold/black`.
- **Line-height** — `--headline-line-height-*`, `--title-line-height-*`, `--body-line-height`, `--link-line-height`, `--button-line-height`, `--subscription-line-height`.
- **Letter-spacing** — `--letter-spacing` (0), `--letter-spacing-l` (2px).
- **Компонентные размеры** (height/width) — `--btn-*`, `--text-field-*`, `--textarea-*`, `--status-text-*`, `--side-nav-*`, `--tabs-*`, `--header-*` и т.д. (см. `css/tokens.css`).
- Если значения нет в Figma JSON — **НЕ изобретай токен**. Оставляй hardcoded и согласуй с дизайнером.

## Структура компонента

```js
// js/components/<name>.js
window.COMP_CSS.<key> = `...`;  // зеркало CSS-файла для code panel

(() => {
  // локальные хелперы
  sbRegister({
    name: '<id-в-NAV>',
    title: '...',
    description: '...',
    playground: { state, controls, render, genCode },
    // ИЛИ sections: [...]
  });
})();
```

```css
/* css/components/<name>.css */
/* --- [SYNC:<key>] ... --- */
.sb-<name> { ... }
/* --- [/SYNC:<key>] --- */
```

**SYNC-маркеры обязательны.** Они помечают границу копируемого в code panel CSS. Если правишь CSS — обновляй ОБА места (`window.COMP_CSS.<key>` в JS-файле и блок в CSS-файле).

## Что делать, если не уверен

1. Читай соседний компонент, например `js/components/buttons.js` + `css/components/buttons.css` — это эталон.
2. Читай `CONTRIBUTING.md` в корне.
3. Спрашивай у пользователя. **Лучше задать вопрос, чем сделать не так.**
4. Новый компонент — копируй `js/_template.js`, не пиши с нуля.

## file:// constraint

- Никаких `fetch()` из локальных файлов — CORS блокирует.
- Никакого `import`/`export`.
- Все глобалы доступны между `<script>` тегами через общий scope.
- Load order управляется порядком `<script>` тегов в `index.html`. Порядок компонентов описан в `js/_index.js`.
