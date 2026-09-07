> В .pg-toggles (auto-fit grid) ячейка ~130px (wide-mode 180px). Внутри toggle-widget ~40px + gap → label получает ~80-120px. Любая фраза длиннее одного слова режется многоточием (\"With Indica\"). Юзера это бесит каждый раз.

# Правило

`pg.toggle('stateKey', 'Label')` — `Label` должен быть **одним словом** (или максимум 6-8 символов). НЕ многословные фразы.

# Why

`.pg-toggles` — auto-fit grid `repeat(auto-fit, minmax(130px, 1fr))` (см. `spacebridge_playground_pg_toggles.md`). На ячейку ~130px:
- toggle-widget ~40px
- gap ~8px
- label получает ~80px

В wide-mode (`.pg-card.wide`) ячейки растут до minmax(180px,1fr), label ~130px. Всё равно мало для многословных.

При label > доступной ширины — текст режется. «With indicator» → «With Indica», «Disable last» → «Disable La». Юзер реагирует на это каждый раз как на критический баг — потому что это его UX-боль:
- 2026-05-20: «опять этот треш. Ну переименуй в одно слово - это раз, во-вторых неужели ты не помнишь эту сраную проблему??»

# Как применять

❌ Плохо | ✓ Хорошо
---|---
`'With indicator'` | `'Indicator'`
`'Disable last'` | `'Disable'`
`'Show subtitle'` | `'Subtitle'`
`'Full width'` | `'Full'` (или `'Wide'`)
`'Has chevron'` | `'Chevron'`

Если контекст ОБЯЗАТЕЛЬНО нужен (нельзя одним словом) — поднимай контрол в `pg.select` с `{ label: '...' }`, у select есть отдельный label сверху, не страдает от grid-ячейки.

# Связанная память

- `spacebridge_playground_pg_toggles.md` — про сам auto-fit grid с minmax 130/180

---
*Перенесено из памяти агента 07.09.2026, дословно.*
