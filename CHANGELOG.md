# Changelog

All notable changes to **MailPilot AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [5.0.0] - 2026-10-16

### Changed
- New concept, **"Correspondence"**: MailPilot writes your letters. Every section has its own device (folding hero letter, 3.1-hour day timeline, product player, feature folders, wax-seal approval, fanned brochure pages, postage-stamp CTA, envelope footer).
- Fonts now match the logo: Poppins, Inter and Caveat.
- Real brochure pages rendered from the official PDF; existing workspace photos optimised; image slots auto-detect files in `src/assets/photos`.
- IMAGE_PROMPTS.md rewritten as a story-led image brief; all requested images supplied, optimised and wired in (hero desk, before/after polaroid, five folders, crew, seal photo, MIA the fox, avatars, OG image).
- Control redesigned as an approval desk: in-tray, desk mat with a draggable brass-and-walnut seal stamp, outbox with postmarked sent items, and a sliding Draft / Semi-auto switch.
- The 3.1-hour day is now a diary page with a dial; chores are struck through and stamped "Handled by MailPilot".
- Brochure rebuilt as a 3D book, modelled on the JobHunter brochure: pinned on scroll, the cover opens and pages turn spread by spread while the chapter list tracks the open pages. It uses the new brochure PDF, hosted locally, and swipeable pages on small screens.
- SuperMIA and Botfinity links point to supermia.ai and botfinity.ai.
- Mobile pass down to 320px: removed horizontal overflow (DayStrip stamp, step cards), tighter section spacing, swipeable "How it works" cards, compact FAQ, and fixes to Who it's for, Final CTA, Footer, Brochure and Control.
- New animated header: burger morphs to a cross, a full-screen menu grows out of it with staggered links, and a reading-progress line runs along the pill.
- New pages: `/privacy/` and `/terms/`, plain-language versions of the official SuperMIA documents, linking to the binding versions.
- Every link and button shows a pointer cursor.
- Cleanup: removed old design backups, scratch files, unused images, Tailwind (installed but unused), stale docs (ARCHITECTURE, ROADMAP, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY), unused data, hooks and CSS. Build tools moved to devDependencies.
- Footer: envelope flap and seal no longer overlap the columns; a cleaner Office column; real platform icons (also in the hero).

## [4.0.0] - 2026-10-15

### Changed
- **Award-level pass**, modelled on current Awwwards Sites of the Day (Heron AI, Moto, Butter) and Superlist: concept-driven technical labels, kinetic display type and a hands-on product demo.
- **Fonts:** Clash Display + Satoshi (Indian Type Foundry, ITF Free Font License), self-hosted in `public/fonts`. Removed Bricolage, Instrument Serif, JetBrains Mono and Inter.
- **Lenis smooth scroll restored**, driven by GSAP's ticker (one shared frame loop).
- **Designed for 1920px:** max width 1720px, fluid gutters up to 96px, larger type scale.
- New sections and effects: dark hero with a letter-by-letter headline, live sync clock, 3D product window and floating notifications; bronze marquee (paused off-screen); scroll-lit manifesto with inline pills; drag-to-compare before/after inbox; stacking feature cards; horizontal-scroll "How it works"; cursor-following audience previews; curtain-edged dark sections; magnetic CTA; giant footer wordmark; nav scroll-progress bar.
- The previous version is preserved in `legacy-v3/`.

## [3.0.0] - 2026-10-15

### Changed
- **Refined to an editorial, award-standard layout** after studying Superhuman, Linear and Daylight: the product UI is the hero, there is one idea per section, and feature chapters share one template.
- **Performance:** removed Lenis smooth scroll, the preloader, the grain overlay, the altimeter, the marquee, all three pinned scroll scenes and every infinite animation. Reveals are now CSS transitions driven by a single IntersectionObserver. Measured result: 59.8 fps while scrolling the full page, no frames over 50 ms. JS dropped from 486 KB to 390 KB and CSS from 70 KB to 44 KB.
- New light hero with a realistic MailPilot workspace window, a scroll-lit manifesto, four feature chapters (Voice, Relationships, Follow-ups, Overview), the Control section with a live outbox, How it works, Who it's for, Pricing, FAQ and a final CTA.
- The previous version is preserved in `legacy-v2/`.

## [2.0.0] - 2026-10-15

### Changed
- Complete redesign: the **"Flight Deck"** concept (aviation and airmail), new information architecture and new copy sourced from supermia.ai/ai-mailpilot. Palette is now derived strictly from the logo's teal (`#103C3D`) and bronze (`#B38F6A`).
- New sections: pre-flight preloader, airmail route hero with split-flap stats, scroll-pinned "pile to plan" scene, instrument panel, voice studio (rotary tone dial), relationship radar, horizontal flight plan, captain controls (live outbox), crew envelopes, postage-stamp pricing and brochure, flight-log FAQ, and an envelope-to-plane final CTA.
- The previous version is preserved in `legacy-v1/`.

## [1.0.0] - 2026-10-14

### 🚀 Highlights & Major Launch
Initial stable release of the **MailPilot AI** award-level web experience, introducing an editorial design system, synchronized GSAP motion architecture, and interactive product theater.

### Added
- **Core Platform Architecture**:
  - Upgraded to **React 19** and **TypeScript 7** with **Vite 8** tooling.
  - Integrated `@fontsource` packages for Inter, Manrope, Outfit, and Plus Jakarta Sans.
  - Google Web Font integration for editorial serifs (*Newsreader*, *Playfair Display*).
- **Advanced Motion Design**:
  - Integrated **GSAP 3.15** with `@gsap/react` and `ScrollTrigger`.
  - Added **Lenis 1.3** smooth momentum scrolling bound directly to `gsap.ticker`.
  - Editorial headline word mask reveal animations (`headline-word` with `yPercent: 110` to `0`).
  - Interactive magnetic physics on footer back-to-top button via `gsap.quickTo`.
  - Scroll-scrubbed SVG timeline line fill on `#process` section.
  - Universal `prefers-reduced-motion` detection and zero-motion accessibility fallback.
- **Editorial Design System**:
  - Created cohesive brand palette (`--teal`, `--ink`, `--bronze`, `--ivory`, `--sage`).
  - 120px geometric background grid styling with warm paper aesthetic.
  - Fluid typography scale with `clamp()` and 1920px container padding calculations.
- **Interactive UI Components**:
  - **Site Navigation (`Nav.tsx`)**: Floating glassmorphic pill with dynamic elevation on scroll and responsive fullscreen mobile overlay drawer.
  - **Hero Stage (`Hero.tsx`)**: Asymmetrical editorial split-stage with live email console and AI draft preview.
  - **Product Showcase (`App.tsx`)**: 3-view interactive theater (*AI Drafts*, *Relationships*, *Inbox Health*) with live tone switching.
  - **Process Pipeline (`App.tsx`)**: 4-step workflow with staggered node scale spring animations.
  - **Final CTA Experience (`FinalCta.tsx`)**: Interactive tone testing console with animated voice match meter and keyboard shortcut actions.
  - **Telemetry Footer (`Footer.tsx`)**: CASA Tier 2 security badges and system status indicators.
- **Testing & Verification**:
  - Added Playwright visual regression and viewport test suite (`scripts/visual-check.mjs`).
  - Automated detection of mobile and desktop horizontal layout overflow.

---

## [0.2.0-beta] - 2026-10-12

### Added
- Prototype tone switching logic with `warm` and `precise` personas.
- Mock stakeholder contact dataset (`Maya Chen`, `Jon Bell`, `Priya Shah`).
- Base Tailwind CSS v4 styling rules.

### Changed
- Refactored layout from dark mode prototype to warm tactile ivory editorial theme.

---

## [0.1.0-alpha] - 2026-10-09

### Added
- Initial project scaffolding using Vite and React.
- Basic static HTML structure and hero section mockup.
