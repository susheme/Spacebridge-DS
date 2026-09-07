> Архитектура и решения по Nav Bar: container queries, slot-padding, hover-dropdown, search compact overlay, optical balance, scroll-preserve, Login/Avatar XOR, dogfood в index.html. Не путать с обычными navigation patterns.

# Nav Bar — что это и зачем

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-07), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/nav-bar.js` (1203 строк) + `css/components/nav-bar.css` (321 строк)
- Load order: 47/53 в `index.html`
- Deps: `buttons`, `avatar`, `search-bar`, `kbd`, `context-menu`, `overlay`, `counters` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbSelectNavBtn`, `sbNavBarDropdownOpen`, `sbNavBarDropdownClose`, `sbNavBarDropdownBridge`, `sbNavBarDropdownClick`, `sbNavBarOpenSearch`, `sbNavBarCloseSearch`, `sbMkNavBar`, `sbMkNavBtn`, `sbWireNavBarFloating`, `sbWireNavBarSmartCollapse`, `sbMkLangSwitcher`, `sbNavBarLangOpen`, `sbNavBarLangClose`, `sbNavBarLangBridge`, `sbNavBarLangPick`
- COMP_CSS: `nav-bar`
<!-- GEN:END -->

Header-полоса сверху приложения: левый слот (button + logo + extras), центральные nav-кнопки разделов, правый слот (action-кнопки + avatar + search).

- Высота 56px по дефолту, до 64px max (`--nav-bar-max-height`).
- min-width 320px.
- Dogfood'ится в самом DS — `index.html` использует `<header class="sb-nav-bar">` вместо старого `.topbar` (старые `.topbar*` стили в `css/layout.css` — dead code, можно почистить отдельным заходом).

# Файлы

- `css/components/nav-bar.css` — source of truth (SYNC block)
- `js/components/nav-bar.js` — компонент + playground + dropdown/overlay helpers
- `index.html` — dogfood usage (текстовый brand-логотип, SVG слот сохранён)

# Архитектура — slot-based + container queries

## Container query, не viewport

```css
.sb-nav-bar {
  container-type: inline-size;
  container-name: navbar;
}
@container navbar (max-width: 1024px) { /* compact mode */ }
@container navbar (max-width: 640px)  { /* мобильный floating */ }
```

Реагирует на свою ширину, а не на viewport. Чтобы это работало в playground — обёртываем preview в `<div style="overflow-x:auto"><div style="width:1200px">...</div></div>` (см. ниже).

## Slot-padding (важная гозча с @container)

`@container` НЕ умеет стилизовать сам container element — только descendants. Поэтому padding 24/16 живёт НЕ на `.sb-nav-bar`, а на слотах:

```css
.sb-nav-bar { padding: 0; }
.sb-nav-bar-left  { padding-left:  var(--pad-horiz-24); }
.sb-nav-bar-right { padding-right: var(--pad-horiz-24); }

@container navbar (max-width: 1024px) {
  .sb-nav-bar-left  { padding-left:  var(--pad-horiz-16); }
  .sb-nav-bar-right { padding-right: var(--pad-horiz-16); margin-left: auto; }
}
```

`margin-left: auto` на right-slot в compact — потому что center схлопывается (`display: none`), иначе right прижимается к left.

## Структурные слоты left

Чтобы responsive переключение работало, consumer передаёт **структурные пропсы** в `sbMkNavBar`:

```js
{ button, logo, logoCompact, logoTitle, badge }
```

а не raw `leftSlot`. Каждый рендерится в свой слот:

```html
<span class="sb-nav-bar-button">...</span>
<span class="sb-nav-bar-logo-full">...</span>
<span class="sb-nav-bar-logo-compact">...</span>
<span class="sb-nav-bar-logo-title">...</span>
<span class="sb-nav-bar-badge">...</span>
```

В compact: `logo-full / logo-title / badge` → `display: none`, `logo-compact` → visible.

## Button с swap иконок

`.sb-nav-bar-button` содержит ДВЕ иконки внутри одной кнопки, swap через container query:

- wide: `side-bar-line` (collapse sidebar action)
- compact: `menu-line` (burger / open side menu)

```html
<button class="sb-btn sb-btn-secondary sb-btn-icon">
  <span class="sb-nav-bar-button-icon-wide">${sbIcon('side-bar-line', 'L')}</span>
  <span class="sb-nav-bar-button-icon-compact">${BURGER}</span>
</button>
```

# Nav Button (`.sb-nav-btn`)

Эксклюзив Nav Bar, **не общий Button**. Юзер дал Figma-спеку (июль 2026) — прежние 28px/min-88/max-144 были отсебятиной:

- Height 40px = `var(--btn-primary-max-height)`, radius 100, `--text-secondary`, semibold (600), `font-variant-numeric: lining-nums tabular-nums`
- Padding 8×16 (`--pad-vert-8` / `--pad-horiz-16`); ширина hug-content, БЕЗ min/max-width — ellipsis у label срабатывает только при flex-сжатии в баре
- `.with-slot` (правый слот) → правый padding 8 + gap 4 (`--gap-horiz-xs`)
- Hover → фон `--background` + Shadow-S (`0 2px 8px 0 --shadow-overlay`) + текст/иконка `--primary` (юзер уточнил явно; chevron красится через color:inherit)
- Selected → `--surface-1` bg + Pressed-inset shadow + `--primary` text
- Disabled → `--border` text, no opacity change (паттерн Buttons/Input; в спеке не описан)
- Figma-квирк: в их экспорте padding-токены названы наоборот (pad-horiz-8 на вертикали) — транслировать по смыслу

## Line-height фикс для descender'ов

Кнопка — спековая `line-height: var(--button-line-height)` (12px), но на `.sb-nav-btn-label` — override `var(--body-line-height)` (20px): 12px меньше font-size 15px и режет descender'ы (g/p/y/q) при `overflow:hidden`. **Override на label не снимать.**

## Right slot — БЕЗ optical-balance ghost'ов

Ghost-spacer'ы (мой давний приём) УДАЛЕНЫ по Figma-спеке: центровка со слотом решается асимметричным padding'ом (`.with-slot`: left 16 / right 8 + gap 4). Не возвращать спейсеры.

Chevron используем `arrow-down-s-line` (Size **L**, 24px — по Figma-спеке, юзер явно попросил).

Right-slot mkNavBtn (взаимоисключающие, приоритет chevron > counter > indicator), любой из них добавляет класс `.with-slot`:
- `hasChevron: true` → `.sb-nav-btn-chevron`
- `counter: 5` → `.sb-nav-btn-slot > .sb-counter` (из Counters)
- `indicator: true|'error'` → `.sb-nav-btn-slot > .sb-status-dot.mini` (из Status)

## Single-select через .closest

`window.sbSelectNavBtn` использует `btn.closest('.sb-nav-bar-tabs')`, а **не** `parentElement` — потому что кнопка с dropdown'ом завёрнута в `.sb-overflow-menu` wrapper. `parentElement` ломается на dropdown-tab'ах.

# Hover Dropdown (контекстное меню по hover)

Nav-btn с `menuItems` оборачивается в `.sb-overflow-menu` и получает context-menu со списком subsection'ов.

- Без иконок (`{ label }` only, не `{ icon, label }`)
- mode `select` для подсветки активного пункта
- Hover-intent timings: open 100ms, close 200ms
- Cancel timer при re-enter (window глобальные helpers: `sbNavBarDropdownOpen / Close / Click`)

# Search в right-slot

## Wide

Полный `sbMkSearch` с `iconLeft: true`, `rightSlot` для KBD (cmd+K).

## Compact — overlay pattern (с июля 2026 — на примитиве Overlay)

В compact mode (`@container navbar (max-width: 1024px)`):
1. `.sb-nav-bar-search-wide { display: none }`
2. `.sb-nav-bar-search-compact-trigger { display: inline-flex }` — обычная secondary icon-only кнопка (search-line)
3. По клику — `sbMkOverlay({ cls: 'sb-nav-bar-search-overlay', placement: 'top', content: search+close })`: скрим `--shadow-overlay` БЕЗ блюра, Esc, backdrop-click, focus trap, portal в body — всё из примитива (js/components/overlay.js)
4. За nav-bar'ом остались только контентные стили строки (`.sb-nav-bar-search-overlay .sb-overlay-content`: flex, gap, max-width 600) и тонкие обёртки `sbNavBarOpenSearch/CloseSearch`
5. Своего глобального Esc-listener'а больше НЕТ (снесён при миграции)
6. Отдельная док-секция «Compact Search Overlay» на странице Nav Bar с живой демо-кнопкой

# Floating mode

`.sb-nav-bar.floating` — отрывается от краёв:
- margin 16 + radius 12 + Shadow-S, без border-bottom
- При скролле страницы → `.is-stuck`: margin 0, radius 0, тень глубже
- Под капотом: `position: sticky` + IntersectionObserver на sentinel'е перед баром (см. `sbWireNavBarFloating`)
- Transition 0.25s
- В `@container navbar (max-width: 640px)` — margin 8

**Тень при скролле через IntersectionObserver, НЕ плавное opacity через scroll listener.** Юзер откатывал scroll-based анимацию: «скачет, и так себе выглядит».

# Playground — что специфично

## Wide stage 1200px + horizontal scroll

Чтобы container query реально срабатывал, надо чтобы container реально был широкий. Playground card в DS ~848px — это меньше 1024 порога, бар всегда compact.

Фикс — wide stage **больше threshold'а** + outer wrap скроллится:

```html
<div data-pg-preserve-scroll style="width:100%;overflow-x:auto">
  <div style="width:1200px; padding:16px; border-radius:12px; border:...">
    ${navBar}
  </div>
</div>
```

## Scroll preservation через data-pg-preserve-scroll

Каждый тогл → `pg.render()` → `innerHTML = ...` → DOM пересоздаётся → скролл сбрасывается. Фикс в `SB_PG.render` (`js/core.js`): snapshot/restore `scrollLeft/scrollTop` по `[data-pg-preserve-scroll]` элементам вокруг replace'а.

**Opt-in:** Только элементы с атрибутом сохраняют scroll. Не глобально.

## Compact toggle + Floating toggle в одном ряду

В playground: тогл `Compact` (заменил селектор Stage width) лежит рядом с `Floating`, gap 16px.

## Login XOR Avatar

Mutually-exclusive toggles через `onControlChange`:

```js
onControlChange(key, value, state) {
  if (key === 'showPrimary' && value) state.showAvatar  = false;
  if (key === 'showAvatar'  && value) state.showPrimary = false;
}
```

## noToc flag

Nav Bar регистрируется с `noToc: true` — потому что playground wide, TOC сбоку ломал бы шире-вьюху. См. `renderComponentPage` в `js/core.js`.

# Dogfood в index.html

```html
<header class="sb-nav-bar" style="flex-shrink:0">
  <div class="sb-nav-bar-left">
    <span class="sb-nav-bar-logo-full">
      <span class="sb-brand" style="font-size:18px;color:var(--primary)">SPACEBRIDGE</span>
    </span>
    <span class="sb-nav-bar-logo-compact">
      <span class="sb-brand" style="font-size:18px;color:var(--primary)">SB</span>
    </span>
    <span class="sb-nav-bar-logo-title sb-caption" style="color:var(--text-secondary)">| Design System</span>
    <span class="sb-nav-bar-badge"><span class="sb-badge-status mini bs-blue">v1.0.0</span></span>
  </div>
  <div class="sb-nav-bar-center"></div>
  <div class="sb-nav-bar-right">
    <button class="sb-btn sb-btn-secondary sb-btn-icon" onclick="toggleTheme()" title="Toggle theme" id="themeBtn"></button>
  </div>
</header>
```

- Текстовый brand (SPACEBRIDGE / SB) вместо SVG — но SVG **слот сохранён**: чтобы вернуть SVG, заменяешь содержимое `.sb-nav-bar-logo-full` / `.sb-nav-bar-logo-compact` span'ов на `<svg>...</svg>`.
- `sb-caption` на logo-title (тот же стиль что в playground), не `sb-title-m`.
- `bs-blue` mini badge для версии.

# Иконки добавленные ради Nav Bar

В `ICON_PATHS` (core.js): `menu-line`, `search-line`, `side-bar-line`, `notification-3-fill`.

# Известные «не баги, а правила»

- **НЕ `overflow: hidden` на `.sb-nav-bar-center`** — клипает dropdown'ы (см. `feedback_no_cosmetic_overflow_hidden.md`). Overflow табов решается через More-button, не cosmetic clip.
- **НЕ `parentElement` для select** — используй `.closest('.sb-nav-bar-tabs')`, иначе ломается с dropdown-wrapper'ом.
- **НЕ `--button-line-height`** на nav-btn — descender'ы режутся.
- **НЕ padding на `.sb-nav-bar`** — @container не достанет. Padding на слотах.
- **min-width:0 на flex:1 children** — без него label не сокращается ellipsis'ом в узком слоте (см. `feedback_flex_min_width_zero.md`).

# TODO (если возвращаемся)

- Dead-code: `.topbar`, `.topbar-left`, `.topbar-right`, `.logo`, `.logo-full/-compact`, `.logo-label`, `.theme-toggle`, `.topbar::after` в `css/layout.css` — больше не используются, можно почистить.
- Mobile (`@container navbar (max-width: 640px)`) — content в слотах схлопывается, но настоящий mobile-overflow handling (Bottom Sheet для tabs / actions) — отдельный заход.
- More-button с overflow-menu для tabs когда их слишком много — architectural overflow pattern, не cosmetic clip.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
