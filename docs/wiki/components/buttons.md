# Buttons (sbMkButton)

> Button — фабрика sbMkButton СДЕЛАНА 04.08.2026, ~150 мест мигрированы; догма Клементия закрыта полностью

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-09), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/buttons.js` (318 строк) + `css/components/buttons.css` (253 строк)
- Load order: 3/53 в `index.html`
- Deps: нет (см. `js/_index.js`)
- Используют его: `badge`, `banners`, `snackbar`, `action-bar`, `popover`, `header-xs`, `file-uploader`, `status`, `toast`, `list`, `property-list`, `table`, `section-header`, `pagination`, `header-s`, `header-m`, `header-l`, `nav-bar`, `tool-bar`, `overlay`, `side-navigation`, `cards`, `side-panel`, `dialogues`, `getting-started`
- Public API: `sbMkButton`, `sbMkButtonWithLabel`
- COMP_CSS: `buttons`
<!-- GEN:END -->

**ЗАКРЫТО 04.08.2026.** Последний долг [dogma-klementiya](../conventions/dogma-klementiya.md) погашен: фабрика
`sbMkButton` написана, ~150 рукописных мест в 22 файлах мигрированы, три
дубль-фабрики (`btnClass` в buttons.js, `actionBtn` в action-bar.js, `_toolBtn`
в table.js) снесены. Расхождение порядка классов (39 vs 12) канонизировано.
Секция из BACKLOG.md удалена.

**API:** `sbMkButton({ label, variant, size, critical, icon, iconRight, iconSize,
iconOnly, disabled, loading, href, cls, attrs, content })` + `sbMkButtonWithLabel({
...btnProps, text, side })`. Канон классов: `sb-btn` → variant → critical → size →
icon → loading → cls. Иконка без лейбла → icon-only автоматически; две иконки на
icon-only → `.sb-btn-icon-2` (68px).

**Три грабли захода:**
1. `iconSize` НЕ выводится из `size` — S-иконки рисуются своим path'ом из
   `ICON_PATHS_S`, подмена меняет геометрию глифа, а не масштаб. В бою sm-кнопки
   миксуют 'L' и 'S'; при миграции сохранял как было.
2. `buttons.js` пришлось двигать в `index.html` на позицию 2 (после chevron):
   badge и snackbar зовут `sbMkButton` при РЕГИСТРАЦИИ, а `sbRegister` трогает
   `config.sections` сразу — геттер `get sections()` не спасает, в отличие от
   кейса popover. Плашки самого buttons ушли на bootstrap-фолбэк `sbDocNote`.
3. `critical` у Primary ЗАМЕЩАЕТ класс варианта (`.sb-btn-critical` = primary
   flavor), у Secondary/Text — добавляется к нему. Легко сломать при рефакторе.

**Проверка без node** (его в системе нет): харнесс на `jsc`
(`/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc`),
`read()` вместо fs, все файлы одним `eval` — иначе top-level `const` из core.js
не виден компонентам. См. [script-load-order](../patterns/script-load-order.md).

**Хвостов НЕТ — закрыто до нуля** (юзер потребовал доделать сразу, а не оставлять
на потом): хром DS (`core.js`, `docs-helpers.js`), все ~68 code-samples в доках,
`genCode` плейграунда и статическая theme-кнопка в `index.html` (инжектится
IIFE-скриптом, как lang switcher). `grep '<button.*class="sb-btn'` по репо = 0.

**Урок:** доки в этой DS генерируются фабрикой (`html: mkChip(...)`), а не
пишутся руками — значит захардкоженный code-sample такой же долг, как боевая
разметка. Не выделять «хвост на отмашку» там, где конвенция очевидна.

---
*Перенесено из памяти агента 07.09.2026, дословно.*

**После миграции памяти:** `ca6e6ab` — добавлен вариант Link.
