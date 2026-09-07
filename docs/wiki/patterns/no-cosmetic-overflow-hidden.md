> В навигационных / шапочных / контейнерных компонентах НЕ ставить overflow:hidden «для защиты от спила». Клипает popover'ы / tooltips / dropdown'ы. Разрешено только когда строго нужно (text-overflow: ellipsis, border-radius clipping и т.п.).

# Правило

В контейнерах, особенно **flex-слотах**, **header-секциях**, **playground stage-wrapper'ах**, **navigation областях** — **НЕ ставь `overflow: hidden`** как «защиту» от того, что контент может вылезти за границы.

# Why

Это клипает popover'ы / tooltips / dropdown'ы / любые `position: absolute` штуки, которые компонент внутри захочет открыть. Особенно болезненно с tabs / nav-buttons / icon-only кнопками, у которых часто есть chevron-меню или tooltip.

`position: fixed` ВЫХОДИТ из overflow-clip (если нет transform-ancestor'а), а вот `position: absolute` — клипается. Не закладывай зависимость от того, что разраб обязательно сделает fixed.

**Конкретный кейс (2026-05-12 и ранее в dogfood headers):** я ставил `overflow: hidden` на `.sb-nav-bar-center` «чтобы tabs не вылезли в right-slot». Это «за каким-то фигом» — настоящее решение для overflow табов это More-button (architectural), а не cosmetic clip. Юзер дважды напоминал.

# Когда overflow:hidden ОК

- **`text-overflow: ellipsis`** — оно НЕ работает без `overflow: hidden`. Это legitimate.
- **`border-radius` clipping на img/video** — когда внутри картинка, которая должна обрезаться по rounded краю карточки.
- **Sticky positioning масок** — редкие случаи, обосновывай в комментарии.

# Как применять (для агента)

1. Прежде чем поставить `overflow: hidden` — спроси себя: «А если внутри откроется dropdown / tooltip / popover — будет клипать?». Если да — НЕ ставь.
2. Если переживаешь, что контент «вылезет» — это **архитектурная** проблема, не cosmetic. Решай через:
   - Auto-fit grid + min-width
   - flex-shrink + min-width: 0 (см. memory: `feedback_flex_min_width_zero.md`)
   - More-button с overflow-menu (см. context-menu component)
3. На stage-wrapper'ах playground (`<div style="...">` обёртка вокруг preview) — `overflow: hidden` ЗАПРЕЩЁН, потому что клипает Shadow-S у `.floating` вариантов и dropdown'ы у avatar/kebab.

# Связанная память

- `feedback_flex_min_width_zero.md` — правильный фикс адаптивности через min-width:0
- `spacebridge_ds_dogfood_headers.md` — упоминает «как было с overflow:hidden клиппингом dropdown'а»

---
*Перенесено из памяти агента 07.09.2026, дословно.*
