# Grid Icon Layout (flex-wrap → CSS Grid fix)

## Problem
`display:flex; flex-wrap:wrap` for icon grids (e.g. Symbol Badges, avatar types) produces chaotic wrapping — items "dance" at different viewport widths because flex distributes remaining space unevenly across rows.

## Solution
Use CSS Grid with `auto-fill` + `minmax`:
```html
<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(96px,1fr)); gap:20px 8px; width:100%">
```

### Key rules:
1. **`width:100%`** — mandatory, otherwise grid doesn't stretch to container width and collapses to 1 column
2. **`minmax(Npx, 1fr)`** — min should be ≥ widest label text (~96px for 2-word labels)
3. **No `white-space:nowrap`** on labels — let them wrap naturally within their cell
4. **`text-align:center`** on label span
5. Each item div: `display:flex; flex-direction:column; align-items:center; gap:6px; width:100%`

### Result
- Auto-fills columns evenly at any viewport
- At 800px → 6 cols, at 500px → 4 cols, at 300px → 2 cols
- Labels never overflow or overlap

## Applied in
- Symbol Badges grid (Badge component page)

---
*Перенесено из памяти агента 07.09.2026, дословно.*
