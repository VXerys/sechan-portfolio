---
id: F-010
title: "Project listing images"
type: verification
status: verification
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-19
last_verified: 2026-10-19
requirements: [FR-036, FR-037, FR-038, FR-039]
supersedes: null
---

# Verification: Project listing images

Evidence that acceptance criteria hold at a named commit. A claim without a command and an output excerpt is not evidence. Unrun checks are listed, never omitted.

## Evidence

### EV-040 — Listing kit guard and compose
- command: `npm run listing:capture -- --selfcheck`; `npm run listing:capture -- _kit-demo`; `npm run listing:compose -- _kit-demo`; kit tests in `npm test`
- output:
  ```text
  selfcheck: exit 1, hosts.json {"allowed":{"127.0.0.1":1},"blocked":{"example.com":2}} (one browser-side, one Node-side request)
  Node-side context.request, page.request, route.fetch, request.newContext to an outside host: blocked, logged, run exits 1, no PNG kept
  uncaught blocked request in setup: exit 1, host under blocked, stale hosts.json and PNGs removed at run start
  _kit-demo compose: cover 1600x1000, slides 1080x1350, 45 to 51 KB at quality 82
  ```
- date: 2026-10-18
- commit: 8579063
- covers: [AC-061, AC-062, AC-063]

### EV-041 — Web sets captured with no outside host
- command: `npm run listing:capture -- <slug>` then `npm run listing:compose -- <slug>` for each web project; `hosts.json` per run
- output:
  ```text
  webgis-gunung-puyuh: allowed unpkg, jsdelivr, fonts, a/b/c OSM tiles; blocked {} (ORS and Groq refused in-page, never allowlisted)
  artconnect: allowed 127.0.0.1, artconnect-stub.test, fonts; blocked {}; no Supabase domain
  clinic-information-system: allowed clinic-stub.test 30, localhost 152; blocked {}; strict stub, 0 MISSING
  visualkain-finance: allowed 127.0.0.1, fonts; blocked {}; app verified on demo-visualkain emulator; production project name absent from the bundle
  inztamoto-erp: allowed 127.0.0.1 215; blocked {}; app verified on demo-inztamoto emulator
  every set: cover 1600x1000 and four 1080x1350 slides, 46 to 135 KB; controller viewed every image: real UI, invented names and amounts, sample tag on data sets
  ```
- date: 2026-10-19
- commit: f765b26
- covers: [AC-064, AC-065]

### EV-042 — Mobile sets with covered values
- command: `npm run listing:compose -- bookmate` and `-- welling-ayah-hebat`
- output:
  ```text
  bookmate: cover and four 1080x1920 slides, label "Full-stack"; chat slide with keyboard dropped; other readers' handles and avatars covered
  welling-ayah-hebat: cover and five slides, label "UI slicing"; real user names and photos covered (for example "Jiwoo Han" sample); app UI labels kept as built
  cover regions drawn by the template over source pixels; Chrome pixel test at two sizes passes
  ```
- date: 2026-10-19
- commit: 2fee395
- covers: [AC-066, AC-067]

### EV-043 — Site gallery
- command: `npm run lint && npm run typecheck && npm test && npm run build`; `next start` + in-app browser at 1280 and 375 px
- output:
  ```text
  eslint and tsc clean; tests 73/73 pass (listing-copy: real projects, 4 or 5 captions, copy rules, notice rule); build ○ / static
  served HTML: a region "<title> screens" per set; client sets show "...shown with the client's approval."; ArtConnect shows "Screens use sample data."
  1280: clinic strip 4 figures 333x416 in a 684 px track; 375: More work panel strip, overflow 0; covers in 16:10 frames, no crop of the title
  ```
- date: 2026-10-19
- commit: 9fd6752
- covers: [AC-068, AC-069, AC-070]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-061, AC-062, AC-063 | EV-040 | pass |
| AC-064, AC-065 | EV-041 | pass |
| AC-066, AC-067 | EV-042 | pass |
| AC-068, AC-069, AC-070 | EV-043 | pass |

## Manual scenarios <!-- full-tier -->

- Each web run's `hosts.json` was read and every output image viewed by the controller before the task closed (EV-041, EV-042).

## Architecture-sensitive evidence <!-- full-tier -->

- Route guard and Node-side guard: EV-040. Emulator isolation: demo- ids refused otherwise at the helper and checked inside the app at runtime (EV-041).

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Lighthouse on the home page | not run in this pass | images are lazy WebP under 135 KB each; recheck after deploy |
| Reduced motion | the in-app browser cannot emulate it | the strip uses native scroll only; no motion depends on it |
| Real phone | emulation only | swipe on the strip relies on native touch scroll |
| CI with Chrome-launching kit tests | runs on the pull request | `ubuntu-latest` must provide `/usr/bin/google-chrome` |

## Result

`pass_with_limitations`: every criterion holds at 1280 and 375 px; Lighthouse, reduced motion, a real phone, and CI with Chrome are still to check.
