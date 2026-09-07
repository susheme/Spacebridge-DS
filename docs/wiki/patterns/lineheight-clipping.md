# Трункейт и клипинг descender-ов

> Трункейт + плотный line-height режет descender'ы; фикс — padding-block + отрицательный margin-block, НЕ поднятие line-height

Элемент с `overflow: hidden` + `text-overflow: ellipsis` и line-height плотнее кегля (например H8: 16px при шрифте 20) срезает нижние хвосты букв (р, у, д, g, y, p) — обрезка идёт по коробке высотой в line-height.

**Why:** overflow клипает по padding-box; глифы, выходящие за line box, срезаются. Юзер требует спековые line-height из Figma (H8 16, Subscription 12/14) — поднимать line-height до body больше нельзя (старый костыль, отменён 01.09.2026 на Cards).

**How to apply:** на трункейт-элемент добавить `padding-block: 4px; margin-block: -4px;` — паддинг даёт глифам место (обрезка по padding-box их не трогает), отрицательный маргин возвращает строке исходные метрики. Соседи не сдвигаются, ellipsis работает. НЕ годится, если у элемента свой фон или рамка (паддинг их растянет). Применено: `.sb-card-title`, `.sb-card-subtitle` в cards.css. Кандидат на общее правило для всех трункейтов DS — юзер одобрил идею раскатки. Чекать при вёрстке каждого нового трункейта. Связано: [figma-tokens-immutable](../infra/figma-tokens-immutable.md).

---
*Перенесено из памяти агента 07.09.2026, дословно.*
