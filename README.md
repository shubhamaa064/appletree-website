# Appletree — website

Marketing site for Appletree Building Maintenance Pvt. Ltd. — façade access, façade cleaning and work at height.

## Run

```bash
npm install
npm run dev
```

`npm run build` type-checks and writes a static site to `dist/` (relative asset paths, so it can be hosted from any folder).

## How it is built

- **Vite + React + TypeScript**, plain CSS in `src/styles.css`.
- **`src/scene/Scene.ts`** — the Three.js night-city flight. Everything is procedural (tower, skyline, eight access-system rigs, workers), so there are no 3D model downloads. Camera stops live in the `KEYS` array; each rig is added with `addRig([stage], …)`.
- **`src/components/Journey.tsx`** — pins the 3D scene and maps scroll to camera stops and the system panel.
- **`src/components/AppleStory.tsx`** — the scroll-scrubbed logo story (design → build → install → maintain → clean).
- **`src/components/Sections.tsx`** — services, manufacturing, aerial platforms, service, certifications, projects, contact.
- **`src/data.ts`** — all copy and figures in one place.
- GSAP ScrollTrigger drives scroll animation; Lenis smooths scrolling. Both are skipped for visitors who prefer reduced motion.

## Content to confirm

- The four photos inside the apple (`PHOTOS` in `AppleStory.tsx`) are project photos standing in for design / factory / install / maintenance shots.
- Phone number and stats in `src/data.ts`.

Fonts: Bricolage Grotesque and Jost (SIL Open Font License).
