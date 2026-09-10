# @spacebridge-ds/styles

Design tokens, typography and component styles of the [Spacebridge Design System](https://github.com/susheme/Spacebridge-DS). Framework-agnostic CSS — no JavaScript required.

## Install

```sh
npm i @spacebridge-ds/styles
```

## Usage — Angular

```json
{
  "projects": {
    "my-project": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/@spacebridge-ds/styles/css/spacebridge-ds.css"
            ]
          }
        }
      }
    }
  }
}
```

## Usage — plain HTML

```html
<link rel="stylesheet" href="node_modules/@spacebridge-ds/styles/css/spacebridge-ds.css">
```

## À la carte

Instead of the full bundle, pick layers in this order: `css/tokens.css`, `css/colors.css`, `css/base.css`, `css/typography.css`, then any `css/components/*.css`.

## Theming

Light theme is the default. Dark theme: set `data-theme="dark"` on `<html>` (or any container).

## Fonts

Roboto and Roboto Mono (woff2, latin + cyrillic) ship in `fonts/` and are wired up by `css/tokens.css` via relative paths — no extra setup.
