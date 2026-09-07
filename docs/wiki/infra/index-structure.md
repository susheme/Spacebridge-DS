> Многофайловая структура DS, правила токенов, компонентов, иконок, типографики

# Spacebridge DS — архитектура (актуально после рефакторинга)

## Структура файлов

```
index.html                    ← ~102 строки, тонкая оболочка (<link>/<script>), file:// совместим
js/
  tokens.js                   ← window.COLOR_TOKENS — единственный источник цветов
  core.js                     ← NAV, ICON_PATHS, SB_PG, sbRegister, sbIcon, sbIconRaw, etc.
  docs-helpers.js             ← copy/code helpers
  init.js                     ← renderPage, init()
  _template.js                ← болванка нового компонента
  _index.js                   ← задокументированный порядок загрузки
  components/<name>.js        ← один JS-файл на компонент
css/
  tokens.css                  ← НЕ-цветовые токены: радиусы, border-width, transitions, gap, padding, font-*
  reset.css / layout.css / typography.css / playground.css / docs.css / animations.css
  components/<name>.css       ← один CSS-файл на компонент
```

**file:// constraint:** никаких `fetch()`, `import`/`export`, ESM, бандлеров. Только `<link>`/`<script src>` в index.html.

---

## ══ ЦВЕТОВЫЕ ТОКЕНЫ — ЗАМОРОЖЕНЫ ══

Источник: `js/tokens.js` (`window.COLOR_TOKENS`) + `deepseek_html_20260417_007c40.html` (эталон имён)

| Токен | Light | Dark |
|---|---|---|
| `--primary` | `#017BFF` | `#0A84FF` |
| `--secondary` | `#295AA3` | `#4A9EFF` |
| `--tertiary` | `#13273F` | `#1C3A5C` |
| `--background` | `#FFFFFF` | `#0D1117` |
| `--surface-1` | `#F5F6F7` | `#141C29` |
| `--surface-2` | `#E7EAEF` | `#0F151E` |
| `--border` | `#BFC5D2` | `#2A3545` |
| `--text-primary` | `#1F222C` | `#F0F2F5` |
| `--text-secondary` | `#8798AD` | `#8899AA` |
| `--text-muted` | `#556579` | `#5A6B7F` |
| `--text-tertiary` | `#313D53` | `#6885AA` |
| `--error` | `#EF0C0F` | `#E5484D` |
| `--warning` | `#FFC107` | `#FFC107` |
| `--alert` | `#FF7300` | `#FF8B3E` |
| `--success` | `#04C40C` | `#3FC241` |
| `--info` | `#017BFF` | `#2B8FFF` |
| `--primary-hover` | `rgba(1,123,255,0.1)` | `rgba(10,132,255,0.1)` |
| `--error-hover` | `rgba(239,12,15,0.1)` | `rgba(229,72,77,0.05)` |
| `--success-hover` | `rgba(4,196,12,0.1)` | `rgba(63,194,65,0.25)` |
| `--alert-hover` | `rgba(255,115,0,0.1)` | `rgba(255,139,62,0.1)` |
| `--warning-hover` | `rgba(255,193,7,0.1)` | `rgba(255,193,7,0.1)` |
| `--shadow-sm` | `rgba(0,0,0,0.08)` | `rgba(0,0,0,0.2)` |
| `--shadow-md` | `rgba(0,0,0,0.16)` | `rgba(0,0,0,0.35)` |
| `--shadow-lg` | `rgba(255,255,255,0.55)` | `rgba(20,28,41,0.25)` |
| `--shadow-overlay` | `rgba(135,152,173,0.3)` | `rgba(20,28,41,0.5)` |

**НИКОГДА:** не придумывать токены, не переименовывать, не хардкодить `#hex`/`rgb()`/`rgba()` в компонентах.

---

## ══ НЕ-ЦВЕТОВЫЕ ТОКЕНЫ (css/tokens.css) ══

- **Радиусы:** `--radius-0/1/2/4/6/8/10/12/14/16/18/20/22/24/28/100`
  - `--radius-2` = поля ввода, `--radius-8` = кнопки/карточки, `--radius-100` = pills
  - ❌ `border-radius: 8px` — только `var(--radius-8)`
- **Border-width:** `--border-width-1/1-5/2/4`
- **Gap:** `--gap-horiz-0/xxs/xs/s/m/lg/xl/xxl`, `--gap-vert-0/xxs/xs/s/m/lg/xl`
- **Padding:** `--pad-horiz-0/2/4/8/16/24/28/32/40/42/44/48`, `--pad-vert-*`
- **Font-size:** `--headline-font-size-h1…h8`, `--title-font-size-l/m/s/caption`, `--body-font-size-l/m/s`, `--button-font-size`, `--badge-font-size`
- **Font-weight:** `--font-weight-light/regular/medium/semibold/bold/black`
- **Transitions/Shadows:** `var(--transition)`, `var(--shadow-sm/md/lg/overlay)`

---

## ══ СТРУКТУРА КОМПОНЕНТА ══

### JS (`js/components/<name>.js`)
```js
// ═══════════════════════════════════════════════════════════
//  NAME
//  CSS в css/components/<name>.css — SYNC-маркеры обязательны.
// ═══════════════════════════════════════════════════════════

window.COMP_CSS.<key> = `...`;  // зеркало CSS-файла для code panel

(() => {
  function mkFoo(opts = {}) { ... }

  sbRegister({
    name: '<nav-id>',
    title: '...',
    description: '...',
    playground: { state, controls, render, genCode },
    // ИЛИ sections: [...]
  });
})();
```

**Запреты:** `const`/`let` на top-level, `import`/`export`, инлайн `<svg>`, `#hex`/`rgba()`, inline font-styles.

### CSS (`css/components/<name>.css`)
```css
/* --- [SYNC:<key>] Название --- */
.sb-<name> {
  background: var(--surface-1);
  border: var(--border-width-1-5) solid var(--border);
  border-radius: var(--radius-2);
  transition: var(--transition);
}
/* --- [/SYNC:<key>] --- */
```

**SYNC-маркеры обязательны.** CSS = source of truth. `window.COMP_CSS.<key>` = копия. При правке CSS — обновляй оба.

---

## ══ ТИПОГРАФИКА ══

Только `sb-*` классы в HTML: `.sb-h1`–`.sb-h8`, `.sb-title-l/m/s`, `.sb-body-l/m/s`, `.sb-sub`, `.sb-caption`, `.sb-mono`, `.sb-brand`.
❌ inline `font-size`/`font-weight`/`font-family` в `style="..."`

---

## ══ ИКОНКИ ══

- `sbIcon(name, size)` — с `<span class="sb-icon-wrap">` (для UI)
- `sbIconRaw(name, size)` — голый `<svg>` (для `genCode`)
- Имена из `ICON_PATHS` в `js/core.js`. Размеры: `'S'` = 16px, `'L'` = 24px
- Нужна новая — предложи добавить path в `ICON_PATHS`, не инлайнь `<svg>`

---

## ══ ДОБАВЛЕНИЕ НОВОГО КОМПОНЕНТА ══

1. `cp js/_template.js js/components/<name>.js`
2. Создать `css/components/<name>.css`
3. Подключить в `index.html`: `<link>` + `<script>`
4. Добавить в NAV (`js/core.js`): `{ id: 'name', label: 'Name', inProgress: true }`
5. Добавить строку в `js/_index.js`

### NAV статусы
- `inProgress: true` — оранжевая точка "In Progress"
- `ready: true` — зелёная точка (после приёмки дизайнером)
- без флага — серая точка "Coming Soon"

---

## ══ PLAYGROUND RULES ══
- `state:` (НЕ `init:`)
- `controls(pg)`, `render(s)`, `genCode(s)` → `{ html, css }`
- `syncControls(s, container)` — cross-toggle зависимости
- `onControlChange(key, value, s)` — сброс состояний

## ══ PREVIEW BACKGROUNDS ══
- `.pg-card` → `var(--surface-1)`, `.pg-preview` → `var(--background)`
- `.example-box` → `var(--surface-1)`, `.example-preview` → `var(--background)`

---

## ══ ЗАФИКСИРОВАННЫЕ ОШИБКИ ══

1. Придумывал имена токенов: `--bg-elevated`, `--text-disabled`, `--status-error`, `--primary-alpha`
2. Хардкодил `rgba()` в CSS компонентов
3. Путал порядок: text-secondary (#8798AD) → text-muted (#556579) → text-tertiary (#313D53)
4. Редактировал монолитный index.html вместо файлов компонентов (архитектура изменена!)
5. Придумывал имена вместо использования эталонной таблицы DeepSeek

---
*Перенесено из памяти агента 07.09.2026, дословно.*
