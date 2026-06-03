# Backlog

Отложенные задачи и идеи. Пополняется по мере появления, чистится по мере выполнения.

---

## Major: Dogfood DS chrome через собственные компоненты

Сейчас «обёртка» DS (заголовки страниц, секций, playground'ов) — самописная разметка в `core.js` + стили в `layout.css`/`playground.css`. Идея — заменить на наши же Header L / Header M / Header XS. Это автоматически решает кучу мелочей (truncation, hover-state'ы, консистентность) и заодно стресс-тестит сами компоненты.

### Маппинг

| Сейчас (homemade) | Заменить на | Где |
|---|---|---|
| `.page-title` + `.page-desc` | **Header L** (title-only mode) | `core.js` renderComponentPage |
| `.comp-title` + `.comp-desc` | **Header M** или **Header Section** | `core.js` (section render) |
| `.pg-title` | **Header XS** | `core.js` `SB_PG.buildHTML` |
| ExampleBox toolbar | возможно **Header XS** | `js/docs-helpers.js` |

### Скоп (protected файлы)

- `js/core.js` — HTML-генерация всех уровней + ExampleBox
- `js/docs-helpers.js` — sbMkPreviewStage / exampleBox
- `css/playground.css` — снести `.pg-title` / `.pg-header` rules
- `css/layout.css` — снести `.page-title` / `.comp-title` rules
- Возможно правки в Header L/M/XS — нужен chrome-режим (без back-button, без action-slot, без своего background'а)

### Зачем

- Header'ы уже с truncation, hover, ellipsis → бесплатно решает текущий баг с `.pg-title` который переносится на 2 строки в узких карточках.
- Каждое изменение в Header сразу видно на ВСЕХ страницах DS → отлавливаем регрессии моментально.
- Дизайнер открывает DS — видит компонент в живом контексте, не в стерильной коробке.

### Подход

1. Сначала разобрать каждый Header (L/M/XS) — какой нужен chrome-mode opt-in (`isChrome:true` или варианты slot'ов).
2. Затем по одному уровню за раз: pg-title → Header XS, comp-title → Header M, page-title → Header L. После каждого — проверка регрессий.
3. **Не мешать с багфиксами** — отдельная сессия.

---

## Major: Пробный GUI из DS-компонентов

Собрать **полностью реалистичную фейк-страницу** (например login flow, dashboard, settings page), используя только наши DS-компоненты. Цель — обкатать как они работают в композиции, найти missing'и и edge case'ы.

### Что должно вскрыться

- Какие комбинации компонентов ломаются (e.g. Header L + длинный Title в narrow контейнере)
- Какие patterns не покрыты (toast'ы, модалки, side-sheets, accordion'ы)
- Missing'и в Layout primitives (Grid System, Stack helpers)
- Цветовые баги (например status indicator в context где фон не --background)
- Z-index конфликты (overlay + dropdown + tooltip одновременно)

### Идеи для прототипа

- **Mission Control dashboard** — Nav Bar + Sub Nav + Side Nav + сетка карточек со Statuses
- **Settings flow** — Forms компонент-зоопарк (Input, Search Bar, Selectors, Textarea, Password, Toggles, Radio, Checkbox)
- **Data view** — Table + Pagination + Table Footer + filter row из Tags

### Где жить

Отдельная HTML-страница в проекте (например `examples/dashboard.html` или внутри DS как раздел "Examples / Demo" в навигации).

---

## Pending: мелкие вопросы

- **Antenna status export** — попросил разрешения добавить `window.sbAntenna = ANT;` в `status.js` чтобы переиспользовать в других компонентах (List Table нужен был). Ответа не было.
- **List Table** — была обещана спека ("ща скину"), не пришла. Компонент не создан.
- **Title-case naming review** — `.sb-title-m-bold` теперь = `.sb-title-m + .sb-fw-semibold` (вес 600). Слово "bold" из старого имени отжило. Если где-то остались упоминания в комментах/доках — почистить.
- **Auto-detect wide-mode threshold** — `cfg.minPreview` сейчас задаётся вручную для 5 компонентов. Если паттерн повторится в новых — может стоить вынести в общий helper или дефолт.

---

## Done / архив

Сюда переезжают завершённые крупные задачи для истории.

- ✅ **Typography weight decompose** — size классы (`.sb-h*`, `.sb-title-*`, etc.) больше не несут font-weight; вес через отдельные `.sb-fw-*` утилиты (2026-06-02).
- ✅ **Playground auto wide-mode** — `SB_PG._autoDetectWide` + ResizeObserver, `cfg.minPreview` opt-in для тонких случаев (2026-06-02).
- ✅ **Playground controls grid** — pg-group паттерн для семантической группировки контролов; 8 playground'ов перегруппированы (Nav Bar, Input, Search Bar, Password, Textarea, Selectors, Buttons, Context Menu) (2026-06-02/03).
