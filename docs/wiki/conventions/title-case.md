> Все хедлайны / тайтлы / секционные лейблы / кнопочный текст рендерятся в Title Case через text-transform: capitalize в typography.css. Источник в JS может быть lowercase — рендер всё равно правильный.

# Правило (2026-05-12)

В Spacebridge DS все заголовочные стили автоматически рендерятся в **Title Case** (первая буква каждого слова — заглавная). Реализовано в `css/typography.css` через `text-transform: capitalize`:

```css
.sb-h1, .sb-h2, .sb-h3, .sb-h4, .sb-h5, .sb-h6, .sb-h7, .sb-h8,
.sb-title-l, .sb-title-l-regular,
.sb-title-m, .sb-title-m-bold, .sb-title-m-regular,
.sb-title-s, .sb-title-s-regular,
.sb-field-label,
.sb-btn-text,
.sb-toggle-label-text,
.sb-radio-label,
.sb-checkbox-label,
.sb-nav-btn-label {
  text-transform: capitalize;
}
```

**Form-control label-classes** (`sb-toggle-label-text`, `sb-radio-label`, `sb-checkbox-label`, `sb-nav-btn-label`) **тоже в списке** — лейблы тогглов / радио / чекбоксов / nav-кнопок капитализируются.

**Data-display label-classes** (`sb-list-cell-label`, `sb-ctx-cell-label`, `sb-tag-label`) — **намеренно НЕ в списке**, т.к. там часто пользовательский контент (имена, теги), который не должен принудительно капитализироваться. Если потребуется — добавим точечно.

# Что это значит на практике

- Источник в JS / разметке может быть **lowercase** — браузер сам капитализирует.
- `'alignment'` → "Alignment", `'left slot'` → "Left Slot", `'tabs alignment'` → "Tabs Alignment".
- Акронимы (KBS, URL, API, KBD) **сохраняются** — `capitalize` не трогает уже заглавные буквы.

# Что НЕ включено

- `.sb-caption` — намеренно `text-transform: uppercase` (для категорий в NAV: «NAVIGATION», «LAYOUT»).
- `.sb-body-*`, `.sb-sub`, ссылки, mono, brand — это sentence text, капитализация ломала бы предложения.
- `.sb-btn-text` ВКЛЮЧЁН — кнопочный текст всегда в Title Case.

# Опт-аут

Если в конкретном месте нужно lowercase / без capitalize — override через `text-transform: none` на элементе. Использовать редко и осознанно.

# Why

Юзер 2026-05-12: единая капитализация во всех заголовках. Заметил несоответствия (мои `'alignment'`, `'chevron'`, `'disabled'` в playground'е nav-bar были lowercase). Чтобы не править source в десятках мест и не следить за каждой новой строкой — CSS-правило раз и навсегда.

# How to apply (для агента)

1. Новые лейблы / тайтлы / button-text в коде — можешь писать **как удобнее**, lowercase или Title Case. Рендер будет в Title Case.
2. Если **намеренно** хочешь сохранить нестандартный регистр (например бренд "iPhone", технический термин "px") — добавь `style="text-transform: none"` на элементе. Согласуй с юзером.
3. При добавлении новых `.sb-*` типографических классов — реши, попадают ли они в title-case enforcement, и добавь в селектор в `typography.css`.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
