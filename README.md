# Utils Playground

Landing page and interactive playground for [`@ashwinthomas/utils`](https://www.npmjs.com/package/@ashwinthomas/utils). Plain HTML, CSS and ES classes, bundled and minified by webpack. Every demo calls the published package.

```bash
npm install
npm run dev      # dev server on http://localhost:8080
npm run build    # production build in dist/
```

## Build settings

| Variable   | Default                | Used for                                                 |
| ---------- | ---------------------- | -------------------------------------------------------- |
| `SITE_URL` | `https://example.com/` | Canonical URL, Open Graph, JSON-LD, robots.txt, sitemap. Keep the trailing slash. |
| `OG_IMAGE` | _(empty)_              | Absolute URL of a 1200×630 share image. Image tags are omitted while empty. |

```bash
SITE_URL=https://utils.example.dev/ OG_IMAGE=https://utils.example.dev/og.png npm run build
```

## Customizing

- **Theme:** every color, font, size, radius and timing is a CSS custom property in `src/styles/tokens.css`. The SVG plots read the same tokens.
- **Copy and SEO:** page text lives in `src/index.html`. Meta tags (title, description, social title/description, keywords, `theme-color`) and the FAQ live in `src/content/site.js`, which also builds the JSON-LD; the visible FAQ and the `FAQPage` data come from the same list. Function and module counts are read from the installed package at build time. When you change `--color-accent`, update `meta.themeColor` and `src/static/favicon.svg` to match.
- **Hero animation:** set `data-easing` (any easing export) and `data-speed` (seconds per sweep) on the `[data-demo="hero"]` element.
- **Demos:** each `[data-demo]` element maps to a class in `src/js/demos/` (see `src/js/App.js`). Initial values come from the markup, so the HTML is the single source of default state.
