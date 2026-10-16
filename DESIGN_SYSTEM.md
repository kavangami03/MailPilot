# MailPilot — Design System (v5, "Correspondence")

**Concept:** *MailPilot writes your letters.* Every section uses one tangible piece of correspondence (letter, envelope, wax seal, postmark, folder, stamp) as its interaction. It belongs to the SuperMIA family (StudyMate, JobHunter) in quality and structure, but has its own language.

## Colour (from the logo only)
- Teal `#103C3D` with ramp `--teal-*` for dark panels and ink
- Bronze `#B38F6A` with ramp `--bronze-*`, plus `--gold #DCB27E` for accents on dark
- Paper `#F6F0E6` / `#EFE6D7` with a faint 64px grid
- `--alert #B5523B` only for "overdue / cooling" states

## Type
- **Poppins** 600–800: headings (the logo is set in Poppins)
- **Inter Variable**: UI and body
- **Caveat** 700: the handwritten accent (signatures, margin notes, one phrase per headline)

## Section devices
| Section | Device |
|---|---|
| Hero | A giant letter; on scroll it folds in thirds, slips into an envelope, is sealed and flies off |
| The problem | "The 3.1-hour day": a 9–6 timeline that fills with email, then collapses into one review |
| See it work | A scripted 24-second product player with chapters and a cursor |
| Features | Five stacked manila folders with tabs; the front folder shows a live product card |
| How it works | A sticky product screen whose scene changes per step |
| Who it's for | Big typographic rows with a cursor-following portrait |
| Control | Drag the wax seal onto the draft to approve it (semi-auto seals follow-ups itself) |
| Brochure | The real eight brochure pages fanned like cards |
| FAQ | Index cards |
| Closing CTA | A giant perforated postage stamp; its Send button is the sign-up |
| Footer | An envelope flap with a wax-seal "back to top" and a postmark address |

## Motion
- Lenis on GSAP's ticker; ScrollTrigger pins only the hero and the day timeline
- Transform/opacity only; loops pause off-screen; `prefers-reduced-motion` shows final states

## Images
Generated photos go in `src/assets/photos/` (see IMAGE_PROMPTS.md). Missing images render designed placeholders.
