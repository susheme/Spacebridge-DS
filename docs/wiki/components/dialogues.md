# Dialogues

> Два типа с одной разметкой: alert информирует (OK, alertdialog, Esc выключен), confirm просит решение (OK/Cancel, dialog, Esc = Cancel → false). Хелперы sbShowAlert/sbShowConfirm/sbShowPrompt — промисы (prompt: string|null).

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-09), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/dialogues.js` (498 строк) + `css/components/dialogues.css` (68 строк)
- Load order: 52/53 в `index.html`
- Deps: `badge`, `action-bar`, `overlay`, `checkbox`, `buttons`, `input` (см. `js/_index.js`)
- Используют его: никто
- Public API: `sbMkDialogue`, `sbShowAlert`, `sbShowConfirm`, `sbShowPrompt`
- COMP_CSS: `dialogues`
<!-- GEN:END -->

## Заметки

**09.09.2026 — типы alert/confirm (решение юзера, по семантике window.alert/confirm):**
- `sbMkDialogue({ type: 'alert' | 'confirm' })` — разметка общая; различия: роль (alertdialog/dialog), дефолт-кнопки (OK / OK+Cancel).
- `sbShowAlert(opts) → Promise<undefined>`, `sbShowConfirm(opts) → Promise<boolean>` (true=OK, false=Cancel или Esc). Браузерные alert/confirm блокируют поток, наши — только интерфейс: «возвращаемое значение» через промис.
- Esc-политика живёт в хелперах, НЕ в Overlay: closeOnEsc у оверлея выключен, Esc confirm'а ловится своим keydown (capture) → resolve(false). Причина: Overlay не эмитит close-событие, а чужой компонент не правим.
- Дефолтный фокус confirm — на Cancel (безопасный выбор), перебивает автофокус Overlay на первый focusable.
- Кнопки хелперов: [0] = подтверждение, [1] = отмена — порядок контракта.
- Критическое правило прежнее: critical-кнопка без variant → Secondary.
- Critical-алерт: единственная кнопка OK — Secondary, не Primary (правило юзера 09.09.2026).
- Демо Modal-секции зовёт sbShowSnackbar при клике (lazy, load order не задет).
- Гоча sbMkFlex: gap-ключи только 0/xs/s/m/lg/xl/xxl — 'md' молча игнорится.

**09.09.2026 — form (prompt):**
- `type: 'form'`: поле под message (слот `field: { label?, placeholder?, value?, critical? }`), кнопки OK/Cancel, role dialog. `sbShowPrompt() → Promise<string|null>`: строка при OK/Enter, null при Cancel/Esc — контракт window.prompt; фокус стартует в поле.
- Поле собирают фабрики Input — ЭКСПОРТИРОВАНЫ для этого из input.js: `sbMkTextField` (mkTf) и `sbMkField` (mkField); + mkTf научен строке-placeholder (был только флаг с хардкодом 'Placeholder').
- Гоча mkTf: без `fieldMode: true` поле получает `sec-narrow` с min-width шире карточки 320. И дефолт `value: 'Input'` — при пустом поле передавать placeholder.
- `.sb-dialogue-field { align-self: stretch }` — flex-column карточки центрирует детей, без stretch поле схлопывается (правка в CSS и COMP_CSS, SYNC).
- Critical-form — паттерн «введите имя, чтобы подтвердить удаление» (Delete critical + Cancel).
- Полная многопольная форма — BACKLOG «Компонент Form Dialogue» (вопросы дизайнеру: ширина, лейаут/Fieldset, контракт значений, валидация).
