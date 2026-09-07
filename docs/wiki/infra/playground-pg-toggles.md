# Playground: .pg-toggles

В `css/playground.css` живёт **один** класс для контролов: `.pg-toggles` (auto-fit `repeat(auto-fit, minmax(130px, 1fr))`) и опциональный `.pg-toggles-3` (minmax 110px, 3-кол). Класса `.pg-grid` больше нет — он был ошибочно размазан по компонентным CSS-файлам.

Wide-mode override: `.pg-card.wide .pg-toggles { minmax(180px, 1fr) }`, `.pg-card.wide .pg-toggles-3 { minmax(160px, 1fr) }` — иначе при широкой панели лейблы с `nowrap` залезают в соседей.

**Тогглы внутри `.pg-group-body` (wide) — ФИНАЛЬНАЯ схема юзера (вайрфрейм + адаптивность):** резиновая сетка `repeat(auto-fill, minmax(min(160px, 100%), 1fr))` — именно **auto-fill, НЕ auto-fit**: auto-fit схлопывает пустые треки, и при 2-3 элементах в full-row группе оставшиеся раздуваются на весь ряд (огромные расстояния, жирные селекты); auto-fill держит пустые треки → стабильный шаг колонок ~176px на любой ширине + `gap: 16px` — равные колонки на всю ширину группы, число колонок адаптивное (узко → столбик); toggle-wrap `display:flex; min-width:0`, трек `flex-shrink:0`, лейбл — truncate (`overflow:hidden; text-overflow:ellipsis`). Сетка ГРУПП (`.pg-controls:has(> .pg-group)`) — тоже резиновая: `repeat(auto-fit, minmax(min(320px, 100%), 1fr))`, НЕ жёсткий `repeat(2)`. Тело группы `.pg-group-body` (селекты/поля) — та же резина: `repeat(auto-fill, minmax(min(160px, 100%), 1fr))` (тоже auto-fill!); одиночный селект в широкой группе капится своим `--text-field-max-width`. Сетка самих ГРУПП остаётся auto-fit (рамки ДОЛЖНЫ заполнять ряд — там схлопывание пустых треков желательно). Грабли (НЕ повторять): `minmax(110px,1fr)` — min мал; фикс-кап `130px` — лейблы под соседним тогглом; flex-wrap natural width — рваные колонки; фикс `180px` — не заполняет группу; жёсткий `repeat(2,1fr)` — не адаптивен; min `180px` — в типовую группу (~350-400 CSS-px) влезал 1 раз → столбик на нормальном экране. **Ретина-урок:** скриншоты юзера — 2x, реальные CSS-px = половина; минимумы колонок проверять в CSS-px, не по скрину. `min(Xpx, 100%)` в minmax обязателен — голый min переполняет узкий контейнер. Отдельного scoped-правила для nav-bar нет.

**Группировка контролов:** radio-группы и toggle-группы — в *отдельных* `<div class="pg-toggles">`. Нельзя мешать в одном гриде, иначе UI выглядит «всё одинаковое».

**Пример (counters/checkbox):**
```js
controls(pg) {
  return `<div class="pg-toggles">
    ${pg.toggle('empty', 'Empty')}
  </div>
  <div class="pg-toggles">
    <div class="sb-radio selected" data-...>Single</div>
    <div class="sb-radio"          data-...>Range</div>
  </div>`;
}
```

**Why:** старые два класса (`.pg-toggles` + `.pg-grid`) в разных местах привели к багу с переносами лейблов в Inputs. Юзер: «нужен один единый компонент. Если мы что-то в нем меняем, то он должен меняться на всех страницах».

**How to apply:** новый компонент → используй только `.pg-toggles`/`.pg-toggles-3`. Никаких локальных гридов в `css/components/<name>.css` для playground-контролов.

---
*Перенесено из памяти агента 07.09.2026, дословно.*
