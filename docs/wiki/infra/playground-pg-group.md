> Группировка контролов в playground через .pg-group / .pg-group-title / .pg-group-body. Временно живёт в css/playground.css; план — промоушн в полноценный DS-компонент Fieldset.

# Контекст

В playground'е сложных компонентов (Nav Bar, формы с множеством slot'ов) контролы делятся на логические группы (Left Slot / Right Slot / Tabs / ...). Для визуальной разбивки используется обёртка с лейблом сверху и border'ом вокруг тела.

# ВАЖНО (2026-07-10): единый хелпер sbPgGroup()

Разметку групп руками больше НЕ писать. В `js/core.js` есть глобальный
`sbPgGroup(title, body, opts)` (`opts: { fullRow, attrs }`) — единственная
точка правды на разметку. Все 51 использование в 24 компонентах мигрированы
на него скриптом; `grep '<div class="pg-group"' js/` должен возвращать 0
(кроме самого core.js). При промоушне в Fieldset — менять один хелпер.

# Текущая реализация (2026-05-12)

Утилитарные классы в `css/playground.css`:

```html
<!-- Несколько групп бок о бок (3-4 группы в одном ряду) -->
<div class="pg-groups-row">
  <div class="pg-group">
    <div class="pg-group-title">Left Slot</div>
    <div class="pg-group-body">
      <div class="pg-toggles">…</div>
    </div>
  </div>
  <div class="pg-group">…</div>
  <div class="pg-group">…</div>
</div>

<!-- Одиночные контролы вне групп — снаружи -->
<div class="pg-toggles">${pg.toggle('floating', 'Floating')}</div>
```

- `.pg-groups-row` — flex row, gap `--gap-horiz-m`, wrap; группы внутри `flex: 1 1 240px` → равная ширина, на узких панелях переносятся в столбик
- `.pg-group` — flex column, gap `--gap-vert-xs` между title и body
- `.pg-group-title` — `--title-font-size-s`, `--font-weight-semibold`, `--text-tertiary`
- `.pg-group-body` — border `--border-width-1-5` `--border`, radius `--radius-12`, padding `--pad-vert-16`, flex column, gap `--gap-vert-m`

Когда нужно использовать: контролов > 5-6, естественно разбиваются на ≥2 подгруппы. **Без `.pg-groups-row` группы стекаются вертикально на всю ширину панели (некрасиво в wide-mode).**

# План промоушна (когда у юзера дойдут руки)

Сделать полноценный DS-компонент **Fieldset** (или Group / Field Group):

1. `css/components/fieldset.css` + `js/components/fieldset.js` — стандартная структура компонента
2. Class-names мигрируют: `.pg-group` → `.sb-fieldset`, `-title` → `-title`, `-body` → `-body`
3. NAV: новая запись в Layout или Forms категории
4. API helper: `sbMkFieldset({ title, children, variant? })`
5. Варианты: `default` (border + padding), `compact` (только title, без border), `inline` (горизонтальная компоновка)
6. В playground.css оставить `.pg-group { @extend .sb-fieldset }` или просто переписать использования

**Use cases вне playground'а:**
- Forms — группы полей с заголовками («Personal info», «Address», «Preferences»)
- Settings — секции настроек
- Detail-view карточки

**Источник правды:** дизайнер согласует в Figma. Сейчас visual-параметры взяты из общего паттерна DS (radius-12, --border, --text-tertiary для заголовков) — при формализации сверить с Figma JSON.

# Триггер для возврата

«Давай делать Fieldset», «Group компонент», «формализуем pg-group в DS». Тогда выполнить план выше.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
