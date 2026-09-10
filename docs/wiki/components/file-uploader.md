> File Uploader — ГОТОВ (done в NAV, июль 2026): дропзона, Upload Cell (Completed/Uploading/Failed), живой композит sbMkUploader; гочи и незакрытые хвосты

# File Uploader — done (24.07.2026)

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-10), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/file-uploader.js` (477 строк) + `css/components/file-uploader.css` (216 строк)
- Load order: 37/53 в `index.html`
- Deps: `badge`, `header-xs`, `counters`, `toggles`, `buttons` (см. `js/_index.js`)
- Используют его: `overlay`
- Public API: `sbMkUploaderArea`, `sbMkUploadCell`, `sbUploaderSyncCounter`, `sbUploaderCellRemove`, `sbUploaderDemoStyle`, `sbUploaderRetry`, `sbUploaderDragOver`, `sbUploaderDragLeave`, `sbUploaderDrop`, `sbUploaderPick`, `sbUploaderFiles`, `sbMkUploader`
- COMP_CSS: `file-uploader`
<!-- GEN:END -->

Файлы: `js/components/file-uploader.js` + `css/components/file-uploader.css`. NAV: `ready: true, done: true`.

## API
- `sbMkUploaderArea({ title, hint, accept, multiple, dragover, wide })` — дропзона (328px, min 320 / max 1024, dashed --border; hover/dragover → dashed --primary + --primary-hover).
- `sbMkUploadCell({ name, size, status, loaded, progress })` — ячейка 50px фикс; status: completed | uploading | failed; тип файла из расширения.
- `sbMkUploader({ title, files, counter, framed, areaTitle, hint, accept, multiple })` — композит-карточка (radius 18, Shadow-S, padding 16/16/24). `framed: true` = бордер 1px --border вместо тени — ДЛЯ ВСТРАИВАНИЯ в формы, модалки и лейауты страниц (Card со своей тенью — standalone). На базе всегда прозрачный border (резерв места, см. [transparent-border-reserve](../patterns/transparent-border-reserve.md)): area + Header XS с `.sb-counter.range` + список ДВУМЯ группами: `.sb-uploader-list-done` сверху / `.sb-uploader-list-active` снизу, gap 16, `:empty → display:none`. Докачавшийся файл переезжает в done-группу.
- Живой пайплайн: `sb-uploader:files` (bubbles, detail.files = File[]) → в композите `simulate()` гонит прогресс до Completed; Retry перезапускает; `sbUploaderSyncCounter` держит счётчик.

## Гочи
- Script load order: file-uploader.js ПОСЛЕ badge.js (SB_SVG) и header-xs.js (sbMkHeaderXS) — template-eval при регистрации.
- Цвет глифов SB_SVG задан инлайновым `fill:var(--токен)` — красим локальным ремапом переменной (`.uploading .badge { --info: var(--primary) }`, `.failed { --alert: var(--error) }`), НЕ !important.
- В core.js добавлен `ICON_PATHS_S` — S-иконки (16 viewBox) с собственной отрисовкой: add-line, close-line, upload-cloud-2-line; sbIcon/sbIconRaw подхватывают автоматически.
- Разделитель ячеек: спека давала --surface-2 → транслирован в --border-soft (правило границ). Прогресс-бар лежит на bottom:-1px ПО строуку, трека нет.
- Имя файла: `text-transform:none` (Title-Case enforcement) + `line-height: var(--body-line-height)` (анти-клипинг descender'ов).

## Незакрытое
- Спека типографики заглушки File Icon (квадрат JSON/PDF) так и не пришла — сделано по скриншоту (badge 10px medium uppercase --text-secondary). Спросить при случае.
- «Пример структуры аплоудера» юзер упоминал — частично закрыт композитом; уточнить, всё ли.
- max-height/min-height 50px и высота 40px Nav Button — токенов в Figma JSON нет, hardcoded с комментами.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
