# Input

> Однострочное поле; фабрики sbMkTextField/sbMkField экспортированы (потребитель — Dialogues form).

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-09), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/input.js` (249 строк) + `css/components/input.css` (79 строк)
- Load order: 17/53 в `index.html`
- Deps: нет (см. `js/_index.js`)
- Используют его: `textarea`, `password`, `selectors`, `pagination`, `dialogues`
- Public API: `sbMkTextField`, `sbMkField`
- COMP_CSS: `input-field`, `input-field-wrap`
<!-- GEN:END -->

## Заметки

**09.09.2026:** `mkTf`/`mkField` экспортированы наружу как `sbMkTextField`/`sbMkField` (для Dialogues type='form'). `placeholder` теперь принимает строку (свой текст), `true` — демо-'Placeholder'. Гочи для потребителей: `fieldMode: true` обязателен вне форм-лейаута (иначе sec-narrow c min-width), дефолт `value: 'Input'`.
