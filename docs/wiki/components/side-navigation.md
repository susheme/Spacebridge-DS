# Side Navigation (Menu / Bar)

> Side Navigation в Spacebridge DS = два типа (Side Menu / Side Bar) в одном компоненте через variant

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-10), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/side-navigation.js` (996 строк) + `css/components/side-navigation.css` (447 строк)
- Load order: 48/53 в `index.html`
- Deps: `buttons`, `chevron`, `counters`, `context-menu`, `section-header` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbSideNavRow`, `sbMkSideNav`
- COMP_CSS: `sideNav`
<!-- GEN:END -->

Side Navigation в Spacebridge DS — это **два разных паттерна**, объединённые в один компонент `sbMkSideNav({ variant })` (решение пользователя; не путать их — была «чехарда»):

- **`variant: 'menu'`** (Side Menu) — замена меню Nav Bar в компактных режимах. **Read-only** (никаких edit/delete/reorder по ховеру). Роли ячеек: `item` (Single Item / Child), `parent` (= таб с дропдауном в Nav Bar, раскрывается **инлайн** — дети в surface-1 группе + непрерывная полоска слева 1.5px + синий заголовок). Шеврон раскрытия — наш Chevron Button (`.sb-chevron`, серый кружок). Панель — overlay со Shadow-L. **Спека есть, реализовано.**
- **`variant: 'bar'`** (Side Bar) — навигатор-дерево (как chrome нашей DS), **наполняется юзером** → появятся кнопки edit (pencil) / delete (delete-bin) по ховеру. Доп. роль `section` (Grand-Parent — UPPERCASE + синий accent-stroke + range-counter). Роли `group` (folder-иконка) + `section` пока WIP, ждут отдельной спеки по ячейкам.

Архитектура: один раздел NAV `side-navigation`, Playground с селектором Variant (Menu / Side Bar) + Content, секции доки на оба типа. Базовая ячейка (`.sb-side-nav-row`) общая. Reuse: Chevron Button (шеврон), Header M / Search Bar / Sub Nav (chrome). Vertical Separator НЕ подошёл (фикс 23px) → `border-left: var(--border-width-1-5)`.

Спека ячейки: 40px, padding 8/8/8/16, Title S (14/700). States: Default → Hover (Shadow-S `0 2px 8px shadow-overlay` + текст --primary) → Selected (surface-1 + Pressed-inset shadow + текст --primary) → Disabled (текст --border). Фон ячейки `transparent` (чтобы соседи не перекрывали hover-тень). См. [index-structure](../infra/index-structure.md), [reuse-existing-styles](../conventions/reuse-existing-styles.md).

---
*Перенесено из памяти агента 07.09.2026, дословно.*
