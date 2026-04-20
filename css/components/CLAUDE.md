# CSS Components — правила для агента

## Границы

Один файл `<name>.css` = один компонент. Не редактируй чужие.

Общие стили (reset, layout, typography, playground, docs) — в `css/*.css` на уровне выше. Туда не лезь.

## Структура файла

Обязательны SYNC-маркеры — они помечают границы блока, зеркально копируемого в `window.COMP_CSS.<key>` (JS-файл компонента).

```css
/* --- [SYNC:<key>] <Название> --- */
.sb-<name> {
  /* цвета — только через var(--token) */
  background: var(--surface-1);
  color: var(--text-primary);
  border: var(--border-width-1-5) solid var(--border);
  border-radius: var(--radius-2);
  /* transition — через var(--transition) если нужен стандартный */
  transition: var(--transition);
}

.sb-<name>.selected { border-color: var(--primary); }
.sb-<name>.disabled { opacity: 0.5; pointer-events: none; }
/* --- [/SYNC:<key>] --- */
```

## Правила

### Цвета
- Только `var(--token)`. Список в `css/tokens.css` + `COLOR_TOKENS` (index.html).
- Никаких `#hex`/`rgb()`/`rgba()`.

### Радиусы
- `--radius-0, -1, -2, -4, -6, -8, -10, -12, -14, -16, -18, -20, -22, -24, -28, -100` — зеркало Figma Dimensions/Radius.
- Типичные: `--radius-2` (поля ввода), `--radius-4` (мелкие пилюли), `--radius-6` (бейджи mini), `--radius-8` (кнопки, карточки), `--radius-12` (крупные контейнеры), `--radius-100` (pills, chevron-buttons, dots).
- Никаких магических `8px`, `100px` в коде.

### Шрифты
- В CSS компонента разрешены `font-size`/`font-weight`/`line-height` с жёсткими значениями ТОЛЬКО если они следуют Figma-спеке компонента (не могут быть заменены на sb-* класс — например, специфические кнопочные размеры).
- По умолчанию — не ставь font-size. Ожидай что текст уже будет обёрнут в sb-* класс (например `.sb-body-m`).

### Transitions / shadows
- `transition: var(--transition)` или перечисление конкретных свойств с 0.15s.
- Shadows — через `var(--shadow-sm/md/lg/overlay)`.

## Sync with JS

CSS-файл = source of truth. JS `window.COMP_CSS.<key>` — копия для code panel.
При правке CSS — обнови JS-копию в `js/components/<name>.js`.

SYNC-маркеры парные. `[SYNC:<key>]` и `[/SYNC:<key>]` должны совпадать. Несбалансированность ломает доверие к системе.

## Запреты

- ❌ Хардкод цветов (`#fff`, `rgba(0,0,0,.5)`)
- ❌ Магические радиусы (`border-radius: 8px`) — используй токен `var(--radius-8)`
- ❌ Правки в чужих `components/*.css`
- ❌ `!important` — если очень надо, объясни в комментарии рядом
