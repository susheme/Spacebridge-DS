# Getting Started

> Getting Started — скелет; заметки заполняются по ходу работы.

<!-- GEN:BEGIN — собрано `jsc tools/gen-wiki.js` (2026-09-30), между маркерами руками не править -->
**Факты из кода:**
- Файлы: `js/components/getting-started.js` (245 строк) — CSS-файла нет
- Load order: 53/53 в `index.html`
- Deps: `buttons` (см. `js/_index.js`)
- Используют его: никто
- Public API: нет window-экспортов
- COMP_CSS: нет
<!-- GEN:END -->

## Заметки

**Шкала типографики — не хардкодить значения (30.09.2026).** Meta-колонка и
copy-кнопки дважды расходились с Figma (Title M/S weight, line-height H6 и
Body L, Sub на десктопе). Причина: токены mobile-first и меняются по
брейкпоинтам, а px были вписаны руками. Теперь строки таблицы несут имена
токенов (fs/fw/lh — зеркало `css/typography.css`, Badge — `badge.css`),
значения для meta читаются `getComputedStyle` при рендере, копия отдаёт CSS
на `var(--…)`. Известное ограничение: meta показывает значения брейкпоинта
на момент рендера; при ресайзе окна обновится только после перехода на
страницу заново.

**Тема.** MutationObserver на `data-theme` обновляет свотчи и фразу
`.gs-theme-note` на месте, без ре-рендера — скролл не сбрасывается.
Стилей у `.gs-theme-note` нет, класс — только якорь для observer.

**CSS.** Своего CSS-файла у страницы нет — вся вёрстка на docs-стилях
(`css/docs.css`: `.color-grid`, `.color-swatch`, `.typo-scale`).
