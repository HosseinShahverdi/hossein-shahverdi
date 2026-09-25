# Hossein Shahverdi — portfolio

Two worlds, one site: **Engineering** (`/engineering`) and **Research** (`/research`), entered from a split-screen index (`/`). Worlds switch through a full-screen curtain transition.

**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion. Fonts are self-hosted (Geist, Syne, Instrument Serif), so builds work offline.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploy: push to GitHub and import the repo on Vercel (zero config).

## Edit content

Everything lives in **`lib/data.ts`**: profile, links, projects, publications, experiments, timelines, skills.

- Replace the `TODO` links (GitHub, LinkedIn, Google Scholar).
- Project `status` drives the badge: `Shipped`, `Building`, `Concept`, `Published`, `Preprint`, `Planned`.
- Links set to `"#"` are hidden and replaced with a "coming soon" note, so no dead buttons ship.
- `featured: true` makes a card span two columns.
- `art` picks the generated cover: `radar`, `hex`, `nodes`, `orbit`, `wave`, `grid`.

## Where things live

```
app/                      routes: index, /engineering, /research
components/core/          curtain transition, intro loader, cursor, magnetic, tilt, reveal
components/layout/        world shell, adaptive nav, footer, section headings
components/showcase/      project cards + shared-element modal, timeline, cover art
components/engineering/   hero + terminal, toolkit, contact
components/research/      neural canvas, hero, publications, flip-card lab, methods
components/gateway/       split-screen index
```

World colours are CSS variables in `app/globals.css` (`[data-world="research"]` etc.), so every component re-themes automatically.

## Accessibility and performance

Reduced-motion users get no loader, cursor, curtain or canvas animation. Custom cursor is mouse-only. Keyboard focus rings everywhere, Escape closes dialogs and the mobile menu, and the neural canvas pauses when the tab is hidden. All pages are statically prerendered.
