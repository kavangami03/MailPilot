# MailPilot — Image Prompts (the website's story)

The website tells one story: **MailPilot writes your letters.** A busy professional, *Alex*, starts the day buried in email. MailPilot drafts every reply in Alex's voice, chases the follow-ups and keeps relationships warm, and Alex gets their day back.

The images carry that story section by section. Generate them, save each with the **exact filename** into:

```
src/assets/photos/
```

They appear on the page automatically: no code changes, any of `.jpg` `.png` `.webp`. Until an image exists, its slot shows a designed placeholder, so you can add them one at a time.

---

## 0. Style lock: use it for every image

Paste this block at the end of every prompt, or save it as a style preset:

> **Style:** cinematic editorial photography, shot on a 35mm or 50mm lens at f/1.8, shallow depth of field, soft natural window light with warm late-afternoon tones, subtle film grain, calm and premium, magazine quality. **Colour palette locked to the brand:** deep teal `#103C3D`, warm bronze / brass `#B38F6A`, ivory paper `#F6F0E6`, with walnut wood and cream linen neutrals. Teal shows up in clothing, walls or desk mats; bronze in lamps, watches, pens and coffee cups. Real, natural skin texture. No text, no logos, no watermarks, and no readable UI on screens (screens show a soft blurred glow).

**Negative prompt (every image):**
`text, letters, words, logo, watermark, readable screen, UI text, neon, purple, saturated blue, harsh flash, plastic skin, stock-photo grin, extra fingers, deformed hands, cluttered background, low resolution`

### The main character: keep Alex consistent

Alex appears in the images marked ★. Generate the **first ★ image**, then use it as the **character / face reference** for the rest so it's clearly the same person.

> **Alex:** a professional in their early 30s, warm and intelligent face, short tidy dark hair, deep-teal knit sweater or teal blazer over an ivory shirt, a slim bronze wristwatch.

*(Change Alex's gender, age or ethnicity to suit your audience. Just keep it the same person across all ★ images.)*

---

## 1. Hero: "The Letter" (1 image, the first thing people see)

The hero is a giant letter, the email MailPilot drafted, resting on a dark desk. This photo is the desk underneath it.

### `hero-desk.jpg` · 16:9 · 2400 × 1350
```
Top-down overhead photograph of a dark deep-teal leather desk surface at dusk, a single warm brass desk lamp casting a soft circular pool of golden light in the centre, the centre of the frame left empty and calm (space for a letter to be placed), around the edges: a closed laptop corner, a brass fountain pen, a ceramic coffee cup, a small stack of cream envelopes tied with twine, a sprig of dried olive leaves, a bronze wax-seal stamp. Moody, quiet, luxurious, lots of negative space in the middle. [style lock]
```

---

## 2. The problem: "The 3.1-hour day" (2 images, before / after with the same person)

The section shows Alex's workday filling with email, then MailPilot giving the hours back. A taped polaroid next to the dial develops from the before photo to the after photo as the day is handed back.

### `day-before.jpg` ★ · 4:5 portrait · 1200 × 1500
```
Alex sitting at an office desk at 6:40pm, golden-hour light fading to blue outside the window, rubbing their temples, laptop glow on their face, a cold half-finished coffee, sticky notes saying nothing readable stuck on the monitor edge, a second phone face-up lighting up with notifications, papers spread out. Tired, overwhelmed but sympathetic, not dramatic. Teal sweater, bronze watch. [style lock]
```

### `day-after.jpg` ★ · 4:5 portrait · 1200 × 1500
```
The same person, Alex, at 5:45pm leaving a bright modern office, laptop bag over the shoulder, holding a ceramic coffee cup, relaxed genuine smile, walking past a window full of warm golden-hour sun, calm and light. Teal sweater, bronze watch. Feeling of freedom and time back. [style lock]
```

---

## 3. Features: "The five folders" (5 images, one per folder)

Each feature is a paper folder you can pull forward. The photo sits behind a live product card, so keep the **left third of the image calm** (the card covers it).

### `persona-writer.jpg` ★ · 3:2 · 1800 × 1200 · Folder 01, "Learns your voice"
```
Alex in a sunlit café corner writing on a laptop, slight smile of recognition as if reading something that sounds exactly like them, a notebook with a fountain pen beside the laptop, warm window light from the right, the left third of the frame soft and uncluttered. [style lock]
```

### `client-coffee.jpg` · 3:2 · 1800 × 1200 · Folder 02, "Relationship intelligence"
```
Two professionals laughing warmly over coffee at a small walnut café table, one leaning in, a genuine client relationship moment, cups and a closed notebook on the table, warm afternoon light, the left third of the frame soft and uncluttered. [style lock]
```

### `sales-call.jpg` · 3:2 · 1800 × 1200 · Folder 03, "Automated follow-ups"
```
An energetic sales professional standing by a large window in a modern office, on a phone call with a confident smile, laptop open on a high table beside them, city softly blurred outside, golden light, the left third of the frame soft and uncluttered. [style lock]
```

### `exec-review.jpg` · 3:2 · 1800 × 1200 · Folder 04, "Inbox Performance Overview"
```
A composed founder in their 40s in a glass-walled office reviewing a laptop dashboard (screen a soft blurred glow, no readable UI), chin resting on hand, thoughtful and in control, teal blazer, warm evening light, the left third of the frame soft and uncluttered. [style lock]
```

### `notes-instructions.jpg` · 3:2 · 1800 × 1200 · Folder 05, "Per-email instructions"
```
Close-up of hands writing a short handwritten note on a cream index card with a brass fountain pen, next to a laptop and a cup of tea on a walnut desk, the note's handwriting blurred and unreadable, warm side light, shallow depth of field, the left third of the frame soft and uncluttered. [style lock]
```

---

## 4. Who it's for: "The people" (3 tall portraits)

Shown as large rows. The portrait follows the cursor on hover, and fills the card on mobile.

### `crew-sales.jpg` · 3:4 · 1200 × 1600
```
Environmental portrait of a sales professional in their late 20s in a modern office, headset around the neck, confident warm smile, teal shirt, looking at the camera, soft window light, blurred office behind. [style lock]
```

### `crew-exec.jpg` · 3:4 · 1200 × 1600
```
Environmental portrait of a company founder in their 40s standing in a calm executive office with dark teal panelled walls and a brass lamp, relaxed half-smile, tailored teal blazer over an ivory shirt, looking at the camera. [style lock]
```

### `crew-consult.jpg` · 3:4 · 1200 × 1600
```
Environmental portrait of an independent consultant in their late 30s in a sunlit home studio with ivory linen curtains, holding a ceramic coffee cup, camel-bronze sweater, thoughtful friendly expression, looking at the camera. [style lock]
```

*(Vary age, gender and ethnicity across the three.)*

---

## 5. You're in control: "The seal of approval" (1 image)

In this section visitors press a wax-seal stamp onto a draft to approve it. The photo sits in the Outbox tray as the real-world version of that gesture.

### `seal-hand.jpg` · 16:9 · 2000 × 1125
```
Macro close-up of a hand pressing a bronze wax-seal stamp onto a cream envelope, fresh warm-bronze wax just spreading, the seal emblem abstract and unreadable, a brass fountain pen and a second envelope softly blurred in the background on a dark teal desk mat, warm lamp light, shallow depth of field, tactile and satisfying. [style lock]
```

---

## 6. Brochure & closing: MIA, the SuperMIA fox (1 image)

Your MailPilot brochure cover already shows **MIA, the SuperMIA fox, as a pilot** (aviator cap and goggles). The same fox appears on StudyMate and JobHunter, so using it here ties the family together.

### `mia-pilot.png` · transparent PNG · about 1200 × 1400
**Best option:** export the fox from your brochure source file with a transparent background.
**Or generate it**, using the brochure cover as the reference image:
```
The same 3D cartoon fox mascot from the reference image, dressed as a friendly pilot with a brown leather aviator cap and goggles pushed up on the forehead, a teal scarf, holding a cream envelope sealed with a bronze wax seal, waving with the other paw, full body, Pixar-quality 3D render, soft studio lighting, isolated on a transparent background.
```

---

## 7. Avatars: the people in the emails (5 small headshots, optional)

They replace the initials in every product mock-up (Maya, Jon, Priya, Dev, Lena). Square, simple background, friendly.

| File | Prompt (add the style lock) |
|---|---|
| `avatar-maya.jpg` 1:1 · 600 | Headshot of a product lead in her early 30s, friendly smile, ivory blouse, soft neutral background |
| `avatar-jon.jpg` 1:1 · 600 | Headshot of an agency partner in his 40s, short beard, navy shirt, warm smile, soft neutral background |
| `avatar-priya.jpg` 1:1 · 600 | Headshot of a customer-success manager in her late 20s, bright smile, teal top, soft neutral background |
| `avatar-dev.jpg` 1:1 · 600 | Headshot of a startup founder in his 30s, thoughtful expression, camel sweater, soft neutral background |
| `avatar-lena.jpg` 1:1 · 600 | Headshot of an operations VP in her 40s, confident smile, cream blazer, soft neutral background |

---

## 8. Social share image (1 image)

Shown when the link is shared on LinkedIn, Slack, X or WhatsApp. Save this one to **`public/images/og-image.jpg`** (not `src/assets/photos`).

### `og-image.jpg` · 1200 × 630
```
A single cream letter half-tucked into an ivory envelope with teal-and-bronze airmail stripes, sealed with a glossy bronze wax seal, resting on a dark deep-teal desk under a warm brass lamp glow, generous empty space on the left half for a headline, photoreal still life, premium and calm. [style lock]
```

---

## Status: all images supplied (16 Oct 2026)

Every slot above is filled. The originals were optimised (JPG at about 80% quality, 100 to 200 KB each) and saved to `src/assets/photos/` under the slot names. One extra image, *Luxurious Teal Desk Letter Scene*, is used as `letter-sealed.jpg` on the final CTA stamp and, cropped to 1200 × 630, as `public/images/og-image.jpg`.

To replace an image later, drop a new file with the same name into `src/assets/photos/`. No code change is needed.

**Tips:** export JPG at about 80% quality and keep each under ~400 KB (squoosh.app works well). Wrong aspect ratios are fine, since every slot crops to fit, but do keep the subject where the prompt says.
