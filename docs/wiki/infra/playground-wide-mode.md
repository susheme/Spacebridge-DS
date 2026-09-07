> Playground wide-mode фиксы (preview width, controls width, toggles minmax) + единая обёртка тогглов pg-toggles / pg-toggles-3 на весь проект, без дубля pg-grid

# Spacebridge DS — Playground wide-mode полная ширина

## Контекст
В Spacebridge DS playground (`js/core.js`, `SB_PG`) рендерит результат `cfg.render()` внутрь обёртки:

```html
<div class="pg-preview">
  <div class="pg-preview-box">
    <div id="pg-<name>-preview">${cfg.render(s, api)}</div>
  </div>
</div>
```

`.pg-preview-box` в wide-режиме (`.pg-card.wide`) имеет `align-items: flex-start; justify-content: flex-start;` — это flex-column. **Items в column-flex'е НЕ растягиваются по cross-axis (горизонтали)**, если у них нет явного `width`. И этот промежуточный `<div id="pg-<name>-preview">` width не имеет.

## Симптом
Делаешь wide playground (например, Header L) → ставишь в render() `<div style="width:100%">…</div>` → визуально превью узкое, схлопнуто до ширины контента. `width: 100%` считается от id-wrapper'а, который сам схлопнут.

## Фикс
В `css/playground.css` (рядом со строкой `.pg-card.wide .pg-preview-box`):

```css
.pg-card.wide .pg-preview-box > [id$="-preview"] { width: 100%; }
```

Селектор бьёт только по wide-плейграундам и только по тому самому core.js'ному id-wrapper'у (`pg-<name>-preview`). После этого `width: 100%` внутри `render()` действительно считается от полной ширины preview-окна.

## Аналогичный фикс для контролов
В том же `playground.css` для `.pg-card.wide .pg-controls` нужны все три:
```css
.pg-card.wide .pg-controls { min-width: unset; max-width: unset; width: 100%; }
```
(До фикса было только `min-width: unset` — оставался `max-width: 280px`, и контролы не разъезжались.)

## Когда применять wide-режим
- Компонент шире ~480px (Header L/M/S, Selectors, Input, Textarea, Tags, Password, **Nav Bar / Top Bar**, Tab Bar, Side Navigation, любой full-width header/footer) — `playground.wide: true`.
- **Эвристика:** если компонент натурально тянется в 100% ширины контейнера (нав/тулбары/хедеры/футеры) — `wide: true` ВСЕГДА, не жди feedback'а от юзера. Это не оптимизация, это базовый паттерн.
- Контролы выкладывать сеткой `grid-template-columns: repeat(auto-fit, minmax(180-360px, 1fr))` — селекты + тоглы. Делить контролы на «половины» (селекты | тоглы) когда их много.
- Стейдж в render: `<div style="background:var(--surface-1);padding:var(--pad-vert-16);border-radius:var(--radius-12);width:100%;box-sizing:border-box">` — серая подложка, чтобы белый компонент на белом preview-фоне был видимым.

## Единая обёртка тогглов: `.pg-toggles` (и `.pg-toggles-3`)

**Why:** раньше было два конкурирующих класса — `.pg-toggles` (стили в `css/playground.css`, 8 компонентов) и `.pg-grid` / `.pg-grid-3` (стили лежали в `css/components/toggles.css` внутри SYNC-блока, 9 компонентов). Из-за этого фикс лейблов в одном месте отлетал в половине проекта. 2026-05-06 унифицировано: всё на `.pg-toggles` / `.pg-toggles-3`, дубли удалены.

**How to apply:** для тогглов в playground'е использовать ТОЛЬКО:
```html
<div class="pg-toggles">${pg.toggle(...)}${pg.toggle(...)}</div>
<!-- или для длинных списков (10+ items): -->
<div class="pg-toggles-3">…</div>
```
Не вводить новых обёрток. Стили живут в `css/playground.css`. Если нужна правка поведения тогглов в playground — править там, а не в `toggles.css`.

## Тогглы в wide-mode — minmax override

**Why:** auto-fit `minmax(130px, 1fr)` оптимизирован под узкую панель (320px → 2 кол ≈ 130). В wide-mode панель тянется на 100% карточки, auto-fit стряпает 7-10 колонок по 130, и `nowrap`-лейбл «Placeholder» / «Subscription» вылезает за свою ячейку, накрывая соседний тоггл.

**How to apply:** в wide-mode — поднимать min-ширину ячейки:
```css
.pg-card.wide .pg-toggles   { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.pg-card.wide .pg-toggles-3 { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
```
Если появятся ещё более длинные лейблы — поднимать первый параметр minmax (180→200…) точечно, не для узкого режима.

## Defensive `nowrap` на лейблах

```css
.pg-toggles .sb-toggle-label-text,
.pg-toggles-3 .sb-toggle-label-text { white-space: nowrap; }
```
Лейбл тоггла никогда не должен ломаться на 2 строки. Если контент шире ячейки — auto-fit grid должен схлопнуть в 1 колонку (для этого нужен правильный `minmax`, см. выше).

## Панель .pg-controls 320px

`.pg-controls` width: 280 → **320** (2026-05-06). Дополнительные 40px воздуха для лейблов в узком режиме.

## Дата
2026-05-04 (Header L playground), обновлено 2026-05-06 (унификация pg-toggles + wide-mode minmax)

---
*Перенесено из памяти агента 07.09.2026, дословно.*
