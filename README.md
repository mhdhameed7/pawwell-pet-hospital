# Pawwell — React pet hospital UI

Pawwell is a responsive pet hospital website concept rebuilt with React, Vite, and Motion for React. The visual system uses deep navy, teal, soft white, and muted mint, with local fonts and locally hosted imagery.

## Run locally

Requires a recent Node.js release supported by Vite (Node 22.12+ or 24 recommended).

```sh
npm ci
npm run dev
```

Open the address printed by Vite. The development configuration uses port 4173.

```sh
npm test
npm run build
npm run preview
```

The production build is generated in `dist/`. See `START-HERE.md` for a step-by-step local setup guide.

## Experience and motion

- Masked headline reveals, staggered section entrances, image reveals, and scroll-linked hero parallax.
- Spring hover feedback and gently magnetic primary buttons for mouse input.
- A scroll progress indicator, animated care tabs, staggered service cards, and a first-visit progress line.
- Animated FAQs, native accessible dialogs, sliding booking steps, and a completion animation.
- `MotionConfig reducedMotion="user"` plus `useReducedMotion` and CSS media rules for visitor preferences.
- Dog, cat, and small-pet service menus; service details; first-visit checklist; and local demo visit management.

## Source structure

- `src/App.jsx`: page sections and application state.
- `src/components/Motion.jsx`: reusable reveal, title, and button animation components.
- `src/components/Booking.jsx`: controlled three-step booking form.
- `src/components/Modal.jsx`: native dialog lifecycle, dismissal, and focus restoration.
- `src/components/Icons.jsx`: SVG symbols and reusable icon component.
- `src/lib/booking.js`: date, validation, storage, and privacy-preserving visit helpers.
- `src/data.js`: pet-specific service content.
- `src/styles.css`: professional palette, responsive layouts, and component styles.
- `tests/app.test.jsx`: model and component interaction tests with Node Test Runner and JSDOM.
- `public/assets/`: original custom photos, local font files, licenses, and favicon.

## Demo scope

This is a frontend UI demonstration for a fictional brand. It does not book real appointments, send emails, take payments, or connect to a medical backend. Dates and example time slots use Asia/Colombo time. The original `pawwell-demo-visits-v1` storage format is preserved so existing sample visits remain usable. Only pet name, pet type, service, date, and time are saved locally; contact information and notes are never persisted. A session-only fallback is used if browser storage cannot be written.

## Verification

The production build and automated component tests check the React migration, service selection, booking validation, step navigation, date limits, storage compatibility, FAQ behaviour, and checklist interaction. JSDOM tests do not verify actual browser rendering, animation smoothness, or responsive visual layout.

## Visual assets

The built-in image generation tool created both project images. Images were converted to WebP for web delivery without changing their composition.

### Hero photo — `public/assets/pet-portrait.webp`

Prompt: Photorealistic studio portrait for a premium pet hospital website: a healthy happy golden retriever with a burnt-orange collar sitting next to a fluffy cream and ginger cat. Both full bodies visible, looking at the camera, golden retriever slightly right and cat lower left, muted sage green seamless studio backdrop with pale sage platform, soft natural daylight and detailed realistic fur. Portrait 4:5 framing, friendly modern editorial photography. No text, logos, watermarks, or medical equipment.

### Care photo — `public/assets/gentle-care.webp`

Prompt: Candid editorial photograph in a minimal veterinary consulting room with pale peach walls and cream cabinetry. A fictional female South Asian veterinarian in muted deep sage scrubs gently scratches a relaxed fluffy ginger cat under the chin on an offwhite examination table. They look toward each other warmly. Portrait 4:5 framing, natural sunlight from the left, realistic skin and hands, small softly blurred plant. No text, logos, watermarks, needles, or medical procedures.

Typefaces: DM Sans and Manrope, distributed by Google Fonts under the SIL Open Font License. Original font distribution and licensing references: https://fonts.google.com/specimen/DM+Sans and https://fonts.google.com/specimen/Manrope .
