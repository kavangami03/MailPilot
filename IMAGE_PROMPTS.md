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

The section shows the same Tuesday twice, side by side: Alex's day without MailPilot (still at the desk at 6:40 pm), then with it (leaving at 5:45 pm).

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

Each folder shows its photo as a taped polaroid at the top right. A product card overlaps the photo's lower-left corner and a sticky note its lower-right, so keep both corners plain and the face in the upper half.

The five scenes are deliberately different (setting, activity, outfit, time of day, camera angle and expression) so the folders don't look alike, and none of them uses a laptop. Her face is described word for word the same in every prompt. Paste each prompt as it is, with this negative prompt for all five:

`airbrushed skin, plastic or waxy skin, doll-like face, uncanny eyes, distorted face, heavy makeup, cheesy grin, looking at the camera, posing, laptop, extra fingers, deformed hands, text, letters, logo, watermark, readable screen, neon, oversaturated colours, orange skin, harsh flash, cluttered background, low resolution, child, teenager`

**Keeping her the same person:** generate `persona-writer.jpg` first. Make several versions and keep the one with the most natural face, then use it as the **character / face reference** for the other four.

### `persona-writer.jpg` · 3:2 · 1800 × 1200 · Folder 01, "Your voice" · reading, home, morning
```
Photo of a white American woman in her early 30s with a natural, approachable face, light freckles across her nose and cheeks, hazel-green eyes, soft natural brows, shoulder-length wavy chestnut-brown hair, small gold hoop earrings and minimal makeup, wearing a cream cable-knit sweater, curled up in a worn leather armchair by a tall window on a quiet morning, reading a printed letter in her hands with a small, knowing smile, as if the words sound exactly like her. A cup of coffee on the side table, a deep-teal wall and a brass reading lamp behind her, soft morning light. Medium close-up from a slight angle. Composition: 3:2 landscape; her face in the upper half, slightly right of centre; keep the bottom-left and bottom-right corners plain. Candid editorial photograph, not posed: she is not looking at the camera. Full-frame camera, 50mm lens at f/2, natural light, true-to-life colours with gentle warmth, real skin texture with visible pores, subtle film grain like Kodak Portra 400. Muted natural palette with touches of deep teal and warm brass in the surroundings. No text, no logos; any screen shows only a soft blurred glow.
```

### `client-coffee.jpg` · 3:2 · 1800 × 1200 · Folder 02, "Relationships" · laughing with a client, café, lunchtime
```
Photo of a white American woman in her early 30s with a natural, approachable face, light freckles across her nose and cheeks, hazel-green eyes, soft natural brows, shoulder-length wavy chestnut-brown hair, small gold hoop earrings and minimal makeup, wearing a chocolate-brown blazer over a plain white T-shirt, laughing genuinely with a client across a small marble café table at lunchtime, leaning forward, one hand around a cappuccino. The client is seen from behind, over the shoulder and softly out of focus. A busy but blurred café with green plants and bright daylight. Over-the-shoulder medium shot with her face clearly visible. Composition: 3:2 landscape; her face in the upper half, slightly right of centre; keep the bottom-left and bottom-right corners plain. Candid editorial photograph, not posed: she is not looking at the camera. Full-frame camera, 50mm lens at f/2, natural light, true-to-life colours with gentle warmth, real skin texture with visible pores, subtle film grain like Kodak Portra 400. Muted natural palette with touches of deep teal and warm brass in the surroundings. No text, no logos; any screen shows only a soft blurred glow.
```

### `sales-call.jpg` · 3:2 · 1800 × 1200 · Folder 03, "Follow-ups" · on the move, city street, golden hour
```
Photo of a white American woman in her early 30s with a natural, approachable face, light freckles across her nose and cheeks, hazel-green eyes, soft natural brows, shoulder-length wavy chestnut-brown hair, small gold hoop earrings and minimal makeup, wearing a long camel trench coat over a black turtleneck, a brown leather tote on her shoulder, walking along a city street at golden hour and glancing at her phone with a calm, confident half-smile, mid-stride. Brick and glass buildings and passers-by softly blurred behind her, low sun from the side. Three-quarter-length shot from slightly ahead of her. Composition: 3:2 landscape; her face in the upper half, slightly right of centre; keep the bottom-left and bottom-right corners plain. Candid editorial photograph, not posed: she is not looking at the camera. Full-frame camera, 50mm lens at f/2, natural light, true-to-life colours with gentle warmth, real skin texture with visible pores, subtle film grain like Kodak Portra 400. Muted natural palette with touches of deep teal and warm brass in the surroundings. No text, no logos; any screen shows only a soft blurred glow.
```

### `exec-review.jpg` · 3:2 · 1800 × 1200 · Folder 04, "Overview" · reviewing a tablet, high-rise office, blue hour
```
Photo of a white American woman in her early 30s with a natural, approachable face, light freckles across her nose and cheeks, hazel-green eyes, soft natural brows, shoulder-length wavy chestnut-brown hair, small gold hoop earrings and minimal makeup, hair tucked behind one ear, wearing a tailored navy suit with an ivory silk blouse, standing by a floor-to-ceiling window in a high-rise office at blue hour, reviewing a tablet with a calm, composed, thoughtful expression and no smile, the city lights glowing below. A warm brass desk lamp behind her and cool evening light from the window. Medium shot in near profile. Composition: 3:2 landscape; her face in the upper half, slightly right of centre; keep the bottom-left and bottom-right corners plain. Candid editorial photograph, not posed: she is not looking at the camera. Full-frame camera, 50mm lens at f/2, natural light, true-to-life colours with gentle warmth, real skin texture with visible pores, subtle film grain like Kodak Portra 400. Muted natural palette with touches of deep teal and warm brass in the surroundings. No text, no logos; any screen shows only a soft blurred glow.
```

### `notes-instructions.jpg` · 3:2 · 1800 × 1200 · Folder 05, "Instructions" · writing sticky notes, studio desk, afternoon
```
Photo of a white American woman in her early 30s with a natural, approachable face, light freckles across her nose and cheeks, hazel-green eyes, soft natural brows, shoulder-length wavy chestnut-brown hair, small gold hoop earrings and minimal makeup, hair loosely tied back, wearing an oversized white linen shirt with rolled sleeves, sitting at a wooden desk in a sunlit studio in the afternoon and writing a short instruction on a yellow sticky note, focused and concentrating, pen pressed to the paper, with a few more notes stuck along the edge of a closed notebook. Paper documents and a ceramic mug nearby, plants in the background. Close-medium shot from slightly above. The handwriting is blurred and unreadable. Composition: 3:2 landscape; her face in the upper half, slightly right of centre; keep the bottom-left and bottom-right corners plain. Candid editorial photograph, not posed: she is not looking at the camera. Full-frame camera, 50mm lens at f/2, natural light, true-to-life colours with gentle warmth, real skin texture with visible pores, subtle film grain like Kodak Portra 400. Muted natural palette with touches of deep teal and warm brass in the surroundings. No text, no logos; any screen shows only a soft blurred glow.
```

---

## 4. Who it's for: "The people" (3 tall portraits)

Three full-height portrait panels sit side by side; the open one shows the portrait large with a letter beside it, and the closed ones show a narrow vertical slice through the middle of the photo. So keep each woman centred left to right, with her face in the upper third, and keep the bottom third simple because the title is laid over it.

Three different American women, each with her own look, outfit and setting. Generate them in the same session with the same settings so they look like one photo series. Negative prompt for all three:

`airbrushed skin, plastic or waxy skin, doll-like face, uncanny eyes, distorted face, heavy makeup, cheesy grin, stiff pose, laptop, extra fingers, deformed hands, text, letters, logo, watermark, readable screen, neon, oversaturated colours, orange skin, harsh flash, cluttered background, low resolution, child, teenager`

### `crew-sales.jpg` · 3:4 · 1200 × 1600 · Sales professionals
```
Photo of an energetic Black American woman in her late 20s with natural curly hair in a voluminous puff, warm brown eyes and small gold hoop earrings, wearing a rust-orange ribbed knit top under a light denim jacket, one hand in her jacket pocket. She stands on a bright, modern sales floor with colleagues and desks softly blurred behind her, laughing mid-conversation with a warm, confident smile, looking just past the camera. Bright midday window light. Composition: 3:4 vertical portrait, waist-up, her face centred left to right and in the upper third; keep the bottom third simple (a title is laid over it) and the background softly blurred. Editorial portrait photograph, full-frame camera, 85mm lens at f/2, natural light, true-to-life colours, real skin texture with visible pores, subtle film grain like Kodak Portra 400. Muted natural palette with touches of deep teal and warm brass in the surroundings. No text, no logos; any screen shows only a soft blurred glow.
```

### `crew-exec.jpg` · 3:4 · 1200 × 1600 · Executives & founders
```
Photo of a composed white American woman in her early 40s with a sleek shoulder-length blonde bob, light blue eyes and a thin gold necklace, wearing a tailored ivory blazer over a black silk top. She stands in a glass-walled corner office at dusk, arms loosely crossed, with a calm, self-assured half-smile, looking at the camera. The city glows softly through the window behind her and a brass desk lamp adds warm light. Composition: 3:4 vertical portrait, waist-up, her face centred left to right and in the upper third; keep the bottom third simple (a title is laid over it) and the background softly blurred. Editorial portrait photograph, full-frame camera, 85mm lens at f/2, natural light, true-to-life colours, real skin texture with visible pores, subtle film grain like Kodak Portra 400. Muted natural palette with touches of deep teal and warm brass in the surroundings. No text, no logos; any screen shows only a soft blurred glow.
```

### `crew-consult.jpg` · 3:4 · 1200 × 1600 · Consultants & freelancers
```
Photo of a friendly Latina American woman in her mid 30s with long dark-brown wavy hair, warm brown eyes and small gold stud earrings, wearing an oversized olive-green knit cardigan over a plain white T-shirt. She sits on the edge of a wooden desk in a cosy, sunlit home studio with bookshelves and plants, holding a ceramic coffee mug in both hands, relaxed and smiling naturally, looking slightly off-camera. Soft afternoon daylight. Composition: 3:4 vertical portrait, waist-up, her face centred left to right and in the upper third; keep the bottom third simple (a title is laid over it) and the background softly blurred. Editorial portrait photograph, full-frame camera, 85mm lens at f/2, natural light, true-to-life colours, real skin texture with visible pores, subtle film grain like Kodak Portra 400. Muted natural palette with touches of deep teal and warm brass in the surroundings. No text, no logos; any screen shows only a soft blurred glow.
```

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

**Update, 16 Oct 2026:** the five folder prompts (section 3) were rewritten to feature a woman, then revised so each folder has its own scene and her face looks natural. The new images were supplied and are in place. The section 4 portraits (three different women) were also replaced and are in place.

**Tips:** export JPG at about 80% quality and keep each under ~400 KB (squoosh.app works well). Wrong aspect ratios are fine, since every slot crops to fit, but do keep the subject where the prompt says.
