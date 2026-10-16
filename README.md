# MailPilot

Marketing site for **MailPilot AI**, the email agent by [SuperMIA](https://supermia.ai/ai-mailpilot/). It drafts replies in your voice, runs your follow-ups and keeps important relationships warm.

## Stack

- React 19, TypeScript and Vite (multi-page: home, `/privacy/`, `/terms/`)
- GSAP 3 (ScrollTrigger, SplitText, DrawSVG) with Lenis smooth scroll on GSAP's ticker
- three.js for the 3D seal stamp (loaded only when the Control section comes near)
- Plain CSS with design tokens (`src/styles/tokens.css`)
- Fonts via Fontsource: Poppins, Inter and Caveat

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check, production build and pre-render into dist/
npm run preview  # serve the production build
npm run check    # Playwright smoke test (needs the dev server running)
```

## Project structure

```
index.html             home page
privacy/, terms/       legal pages (entry: src/legal.tsx)
src/
  App.tsx              home page composition
  components/          one component (+ CSS) per section; ui.tsx holds shared pieces
  data/content.ts      copy, links and sample data
  data/legal.ts        plain-language legal content
  lib/motion.ts        Lenis, reveals, headline splits
  lib/photos.ts        picks up any image dropped into src/assets/photos
  styles/              tokens and base styles
public/
  brochure/            brochure PDF and page renders
  images/og-image.jpg  social share image
scripts/
  visual-check.mjs     Playwright smoke test
```

## Home page sections

Hero (folding letter) → The 3.1-hour day → Product player → Five folders → How it works → Who it's for → Control (approval desk) → Brochure (3D book) → FAQ → Final CTA → Footer

## SEO

`npm run build` type-checks, builds the client, then pre-renders every page to static HTML (`src/entry-server.tsx` and `scripts/prerender.mjs`), so search engines and link previews see the full content without running JavaScript. The same step writes the structured data, `sitemap.xml` and `robots.txt`.

The public address lives in one place, `SITE_URL` in `vite.config.ts` (currently `https://mail-pilot-nu.vercel.app`). When the site moves to its own domain, set a `SITE_URL` environment variable on the host (for Vercel: Project Settings, Environment Variables) and redeploy; canonical links, social cards, structured data and the sitemap all follow.

After each domain change, submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Docs

- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): colour, type, layout and motion rules
- [IMAGE_PROMPTS.md](IMAGE_PROMPTS.md): the image brief and which file fills which slot
- [CHANGELOG.md](CHANGELOG.md): version history

## Content notes

Product facts come from the MailPilot product page and brochure. Names inside product mock-ups (Maya Chen, Jon Bell and so on) are illustrative sample data. The legal pages summarise the official SuperMIA documents and link to them as the binding versions.
