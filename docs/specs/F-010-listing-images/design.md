---
id: F-010
title: "Project listing images"
type: design
status: implementing
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
requirements: [FR-036, FR-037, FR-038, FR-039]
supersedes: null
---

# Design: Project listing images

## Summary

A small kit in `scripts/listing/*` (new) captures each app on localhost through `playwright-core` driving the installed Chrome, with a route guard and invented fixtures, then composes the captures into WebP sets with HTML templates that reuse the site's tokens and fonts. The site reads the sets from `src/content/listings.ts`: the cover replaces the poster through `projectMedia`, and a new `ListingStrip` shows the slides. Projects run one task at a time; the kit lands first.

## Current state

- `src/content/media.ts` maps two slugs (bookmate, marketiv) to one image each; other projects render `ProjectPoster`.
- `ProjectMedia` (case studies) and the open panel in `project-index.tsx` (More work) are the two places a project image appears.
- `sharp` is installed; no headless browser library is. Chrome is at `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`.

## Component changes

| Path | Change | Responsibility after change |
|---|---|---|
| `package.json` | dev dependency `playwright-core` (owner approved, 2026-10-17); scripts `listing:capture <slug>`, `listing:compose <slug>` | entry points |
| `.gitignore` | `.listing-cache/` | raw captures never committed |
| scripts/listing/capture.mjs (new) | launch Chrome (`CHROME_PATH` or the default path), apply guard and stubs, run the shot list, write PNGs and `hosts.json` | AC-061, AC-062 |
| scripts/listing/compose.mjs (new) | fill templates, screenshot at device scale 2, convert with sharp, fail when a file exceeds NFR-001 | AC-063 |
| scripts/listing/templates/ (new) | `cover.html`, `slide-web.html` (browser frame, 4:5), `slide-mobile.html` (phone frame, 9:16); site tokens and fonts; sample-data tag slot; label chip ("Full-stack", "UI slicing") | BR-015 |
| `scripts/listing/projects/<slug>.mjs` | shot list (path, viewport, actions, wait), allowlist extras, fixtures, captions, label, `sampleData` flag | one file per project |
| `src/content/listings.ts` | per slug: cover and slides as static imports, caption per slide, label, `sampleData` | site data |
| `src/content/listings.test.ts` | captions obey copy rules; 4 or 5 slides; every set with `sampleData` renders the notice; slugs exist in `projects` | BR-016 |
| `src/content/media.ts` | cover from `listings` for each slug that has a set | poster fallback stays |
| `src/components/sections/listing-strip.tsx` | client component: scroll-snap row, `data-lenis-prevent`, drag to scroll for fine pointers, focusable `role="region"` with `aria-label`, lazy `next/image` | AC-068, AC-070 |
| `src/components/sections/project-media.tsx`, `project-index.tsx` | render the strip and the notice under the cover | AC-069 |

## Projects

| Task | Slug | Source and branch | Run | Data | Shots (cover first) |
|---|---|---|---|---|---|
| T-041 | `webgis-gunung-puyuh` | clone `VXerys/accessibility-gap-analysis-webgis` to `D:\Projects\`; `master` | copy `js/env.sample.js` to `js/env.js` (keys empty); `python -m http.server` | repo GeoJSON; allow unpkg, jsdelivr, fonts, OSM and Esri tiles | map with isochrones, splash, analysis panel, facility layer |
| T-042 | `artconnect` | clone `VXerys/artconnect-crm` to `D:\Projects\`; default branch | `npm ci`, `npm run dev` with `VITE_SUPABASE_URL` set to the stub host | Supabase stubs | pipeline kanban, landing, artworks, analytics |
| T-043 | `clinic-information-system` | `D:\Projects\klinik-cikidang-medika`; temp worktree from `main` | `npx next dev` directly (never `npm run dev`: its `predev` copies staging env) with stub env inline | Supabase stubs; owner role session | dashboard, buku kas, pendaftaran, rekam medis detail, laporan |
| T-044 | `visualkain-finance` | `D:\Projects\visualkain-financial-analytics`; temp worktree from the production branch | `next dev` with `demo-visualkain` env and a temporary emulator hook | Firebase emulator, invented seed | real-cash dashboard, cash in and out, vendor HPP and margin split, cost-profit |
| T-045 | `inztamoto-erp` | `D:\Projects\inztamoto-erp-dashboard`; temp worktree from the branch the live site deploys (ruling recorded) | `next dev` with `demo-inztamoto` env and `useEmulator` calls | Firebase emulator, invented seed | dashboard, penjualan, produksi, laporan (`data-page`) |
| T-046 | `bookmate` | `C:\Users\PLN\Downloads\listing-bookmate\` raw screens and store frames | compose only | existing screenshots | home, reading activity, community, borrowing, chat |
| T-047 | `welling-ayah-hebat` | `D:\Projects\about-me\assets\mangcoding\welling_*.jpg`, `Downloads\ranking-ayahhebat.jpg` | compose only, with masks | sample names and avatars over real ones | Welling community, scan, Ayah Hebat ranking |

A subagent may swap one shot for a better screen and records why in the task evidence. A temporary emulator hook or env file lives only in the temp worktree.

## Flow

```text
projects/<slug>.mjs -> capture.mjs (guard + stubs or emulator) -> .listing-cache/<slug>/*.png + hosts.json
  -> compose.mjs (templates, captions) -> src/assets/images/listings/<slug>/{cover,01..05}.webp
  -> listings.ts -> media.ts cover + ListingStrip in ProjectMedia and the More work panel
```

## UI behavior

- The strip sits under the cover in the case study and under the panel image in More work, cards at about 72 vw on phones and 26 vw on desktop, 16 px gap, snap to start.
- Drag uses pointer events with a 6 px threshold so clicks still work; wheel and touch scroll natively; arrow keys scroll the focused region.
- Reduced motion: no drag momentum or reveal; native scroll only (AC-070).
- The notice line uses the `label` style in `text-muted`.

## Data and state

- No runtime data. `listings.ts` is static and imported by server components; the strip receives image data as props.
- Storage change: additive (new image files and content module).

## Performance and observability <!-- full-tier -->

- Covers use `sizes` for the case-study column; slides are lazy with explicit width and height, so no layout shift.
- `compose.mjs` prints each file's size and fails over the NFR-001 budget; Lighthouse runs once in T-049.

## Testing

| Requirement | Check | Layer |
|---|---|---|
| AC-061, AC-062 | kit self-check on the WebGIS run; a forced request to a non-allowed host fails the run | script, T-040/T-041 |
| AC-063 | compose output sizes and dimensions printed | script |
| AC-064 to AC-067 | per-task evidence: shot list, `hosts.json` summary, contact sheet review | manual, per task |
| AC-068 to AC-070, BR-016 | `npm test` (listings.test.ts), browser at 360, 768, 1280 px | unit and manual |

## Alternatives considered <!-- full-tier -->

- One combined montage per project (the current BookMate style): rejected by the owner; it reads as a screenshot dump.
- Storing raw captures in the repo for review: rejected; they add weight and are rebuilt by one command.
