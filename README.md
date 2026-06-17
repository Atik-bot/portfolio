# Atik Shahrier Rakir — Portfolio

Personal portfolio website. Pure HTML5 + CSS3 + vanilla JavaScript — no frameworks, no build step. Deployable anywhere as static files.

**Design concept: "Deep Graph"** — deep ink navy + electric teal + warm amber, with an animated node-graph hero background (a nod to GCN research). Space Grotesk / Inter / JetBrains Mono.

## Run locally

Any static server works. From the project root:

```bash
# Option A — Python (pre-installed on most systems)
python -m http.server 8000
# then open http://localhost:8000

# Option B — Node
npx serve .

# Option C — Vite dev server with hot reload
npm create vite@latest . -- --template vanilla   # or just: npx vite .
npx vite
```

Opening `index.html` directly via `file://` also works, but use a server for accurate font/asset behavior.

## Project structure

```
portfolio/
├── index.html              # single-page site, all sections
├── css/
│   ├── reset.css           # minimal modern reset
│   ├── variables.css       # design tokens (colors, type, spacing) + light theme
│   ├── main.css            # layout, buttons, badges, reveal animations, footer
│   └── components/         # one file per section component
├── js/
│   ├── theme.js            # dark/light toggle (dark default, persisted)
│   ├── navbar.js           # sticky blur, mobile menu, scroll spy
│   ├── graph-canvas.js     # animated node-graph hero (Canvas 2D)
│   ├── scroll-animations.js# IntersectionObserver reveals
│   ├── typing.js           # rotating typewriter line in the hero
│   ├── project-gallery.js  # screenshot carousel in project cards
│   └── main.js             # contact form + utilities
├── assets/
│   ├── images/             # portrait + projects/<name>/N.webp galleries
│   ├── icons/favicon.svg
│   └── cv/atik-cv.pdf      # served by the "Download CV" button
├── robots.txt
├── sitemap.xml
└── README.md
```

## Things to update before going live

- [ ] **LinkedIn URL** — `index.html` currently links to `linkedin.com/in/atik-shahrier-rakir`. Search for that string and replace with your exact profile URL.
- [ ] **Contact form** — create a free form at [formspree.io](https://formspree.io), then replace `YOUR_FORM_ID` in the `<form action="...">` in `index.html`. Until then, the form falls back to opening the visitor's email app (mailto).
- [ ] **Domain** — `robots.txt`, `sitemap.xml`, and the `og:url` meta tag use `https://atikshahrier.dev/` as a placeholder. Replace with your real domain after deploying.
- [ ] **CV** — drop an updated PDF at `assets/cv/atik-cv.pdf` whenever your CV changes.

## Deploy checklist

1. Update the items above.
2. Pick a host:

### Vercel (recommended)
```bash
npm i -g vercel
vercel          # from the project root; accept defaults (static site)
vercel --prod
```
Or connect the GitHub repo at vercel.com → "Add New Project" → framework preset: **Other** → deploy.

### Netlify
Drag-and-drop the folder at app.netlify.com/drop, or connect the repo (build command: none, publish directory: `/`).

### GitHub Pages
```bash
git init && git add . && git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/Atik-bot/portfolio.git
git push -u origin main
```
Then repo → Settings → Pages → Source: `main` branch, `/ (root)`.

3. After deploy: run Lighthouse (Chrome DevTools → Lighthouse) and verify 90+ across Performance / Accessibility / Best Practices / SEO.

## Performance & accessibility notes

- Images are lazy-loaded (except the hero portrait, which is `fetchpriority="high"`) and served as WebP with PNG fallback.
- Dark mode is the default; the toggle persists via `localStorage`.
- `prefers-reduced-motion` is respected — the graph canvas renders a static frame and reveals appear without animating.
- Semantic landmarks, skip link, ARIA labels, keyboard-navigable menu and filters, visible focus rings.
- Responsive from 320px up.
