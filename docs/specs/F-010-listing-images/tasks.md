---
id: F-010
title: "Project listing images"
type: tasks
status: implementing
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
requirements: [FR-036, FR-037, FR-038, FR-039]
supersedes: null
---

# Tasks: Project listing images

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Execution

Run with subagent-driven development: one implementer subagent per task, a task review (spec and quality) after each, one task at a time in the order below, and a whole-branch review at the end. Every brief carries BR-012 to BR-016 verbatim, the never-read `.env*` rule, and "no commit or push in any client repository".

## Tasks

### T-040 — Listing kit
- status: planned
- requirements: [FR-036]
- depends_on: []
- evidence: []

Add `playwright-core` (owner approved the dependency on 2026-10-17; record it here when added), `scripts/listing/*` (new: capture, compose, templates), `.listing-cache/` in `.gitignore`, and the npm scripts. Templates use the site's tokens and fonts, a browser frame, a phone frame, the sample-data tag, and the label chip. Acceptance: AC-061, AC-062, AC-063. Stop if the installed Chrome cannot be driven.

### T-041 — Gunung Puyuh WebGIS listing
- status: planned
- requirements: [FR-037]
- depends_on: [T-040]
- evidence: []

Clone into `D:\Projects\accessibility-gap-analysis-webgis`, serve statically, capture the four shots in `design.md`. Public data, so no sample-data tag. First real run of the kit: prove the guard by forcing one blocked host. Acceptance: AC-062, AC-064.

### T-042 — ArtConnect listing
- status: planned
- requirements: [FR-037]
- depends_on: [T-040]
- evidence: []

Clone into `D:\Projects\artconnect-crm`, run Vite against the stub host, stub auth and the tables the four screens read with invented artists, artworks, contacts, and deals. Acceptance: AC-064, AC-065.

### T-043 — Klinik Cikidang Medika listing
- status: planned
- requirements: [FR-037]
- depends_on: [T-040]
- evidence: []

Temp worktree from `main`; start `next dev` directly so `predev` never copies staging env; stub Supabase auth (owner role) and every table the five screens read with invented patients, doctors, visits, and cash entries. The clinic name may show (A-001 confirmed 2026-10-17 in F-011); every person and amount is sample data. Acceptance: AC-064, AC-065.

### T-044 — VisualKain Finance listing
- status: planned
- requirements: [FR-037]
- depends_on: [T-040]
- evidence: []

Temp worktree from the production branch; Firebase auth and firestore emulators under `demo-visualkain` (`JAVA_HOME` set to the Android Studio JBR for the run); temporary emulator hook in the worktree only; invented customers, orders, payments, and vendor costs that respect the 70% DP rule and the proportional HPP split. Never use `seed-data.ts`. Acceptance: AC-064, AC-065.

### T-045 — InztaMoto ERP listing
- status: planned
- requirements: [FR-037]
- depends_on: [T-044]
- evidence: []

Temp worktree from the branch the live site deploys (record the ruling); emulators under `demo-inztamoto`; `useEmulator` on the compat SDK in the worktree only; invented products, stock, sales, and production orders. Do not run `D:\Projects\inztamoto-erp-dashboard\scripts\import-products-only.js` (it writes to Firestore with service accounts). Acceptance: AC-064, AC-065.

### T-046 — BookMate listing
- status: planned
- requirements: [FR-038]
- depends_on: [T-040]
- evidence: []

Compose from the existing raw screens in `Downloads\listing-bookmate\` into a cover and four or five phone-frame slides labelled "Full-stack"; replaces `bookmate-listing.webp`. Acceptance: AC-066.

### T-047 — Welling and Ayah Hebat listing
- status: blocked
- requirements: [FR-038]
- depends_on: [T-040]
- evidence: []

Blocked by A-004. Then compose one shared set labelled "UI slicing"; cover every real end-user name and photo in the Welling screens with sample values, crop Korean dev traces; Ayah Hebat names are test data. Acceptance: AC-067.

### T-048 — Site gallery and notice
- status: planned
- requirements: [FR-039]
- depends_on: [T-041]
- evidence: []

`listings.ts` and its test, covers through `media.ts`, `ListingStrip`, the notice line, wired into `ProjectMedia` and the More work panel for every finished set. Acceptance: AC-068, AC-069, AC-070.

### T-049 — Verification
- status: planned
- requirements: [FR-036, FR-037, FR-038, FR-039]
- depends_on: [T-042, T-043, T-045, T-046, T-048]
- evidence: []

Lint, typecheck, test, build; browser at 360, 768, 1280 px; image sizes against NFR-001; Lighthouse on the home page; the `hosts.json` summary for every web run (NFR-002). Removes leftover temp worktrees.

## Deferred

### T-050 — Marketiv listing
- status: deferred
- requirements: [FR-037]
- depends_on: [T-040]
- evidence: []

Deferred by the owner on 2026-10-17 while the Marketiv landing page is revamped; the current dashboard image stays.
