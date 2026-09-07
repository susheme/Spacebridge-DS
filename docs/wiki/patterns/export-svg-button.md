# Кнопка Export SVG / ZIP

> Pattern for adding a footer action button (e.g. "Copy SVG") inside an exampleBox toolbar with ZIP download of multi-theme SVG files

Add a footer button to a DS component section that downloads a ZIP of assets (e.g. SVG icons for both dark and light themes).

**Why:** User confirmed this is the correct pattern and wants to reuse it for other components with exportable assets.

**How to apply:**

### 1. Load JSZip CDN in `<head>` (once, already done)
```html
<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
```

### 2. Add `opts.footer` support to `exampleBox()` (already patched)
Put footer content as first child of `.example-toolbar` — the existing CSS rule
`.example-toolbar:has(.sb-btn + .sb-btn) { justify-content: space-between }`
automatically pushes it left and the code-toggle button right.

```javascript
// In exampleBox():
<div class="example-toolbar">
  ${opts.footer || ''}      // ← LEFT side
  ${resetBtn}
  <button ...code toggle>   // ← RIGHT side
</div>
```

### 3. Add `footer` to a section config in `sbRegister()`
```javascript
{
  title: 'My Component',
  preview: `...`,
  html: `...`,
  css: COMP_CSS.xxx,
  footer: `<button class="sb-btn sb-btn-secondary" onclick="downloadXxxZip()">${sbIcon('file-copy-line','L')} Copy SVG</button>`,
}
```

### 4. Define the download function as `window.downloadXxxZip` inside the component's IIFE
```javascript
window.downloadXxxZip = async function() {
  if (typeof JSZip === 'undefined') { alert('JSZip not loaded'); return; }
  const p = (d, f) => `  <path d="${d}" fill="${f}"/>`;
  const svg = (...paths) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n${paths.join('\n')}\n</svg>`;
  const makeSet = (COLOR1, COLOR2) => ({
    'Component-Variant-A.svg': svg(p(PATH_A, COLOR1)),
    'Component-Variant-B.svg': svg(p(PATH_B, COLOR2)),
  });
  const themes = {
    'dark':  makeSet('#darkColor1', '#darkColor2'),
    'light': makeSet('#lightColor1', '#lightColor2'),
  };
  const zip = new JSZip();
  Object.entries(themes).forEach(([folder, files]) =>
    Object.entries(files).forEach(([name, content]) => zip.file(`${folder}/${name}`, content))
  );
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'component-icons.zip'; a.click();
  URL.revokeObjectURL(url);
};
```

### ZIP structure output
```
component-icons.zip
├── dark/
│   ├── Component-VariantA.svg
│   └── Component-VariantB.svg
└── light/
    ├── Component-VariantA.svg
    └── Component-VariantB.svg
```

### Key rules
- SVG files use hardcoded hex colors (no CSS vars) — standalone files work outside the DS
- Always export both dark + light themes regardless of current page theme
- Button label: "Copy SVG" with `file-copy-line` icon
- Colors to use from tokens: `--status-success`, `--border-strong`, `--status-error`, `--text-disabled` for dark/light

---
*Перенесено из памяти агента 07.09.2026, дословно.*
