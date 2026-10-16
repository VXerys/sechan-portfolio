---
id: F-006
title: "Testimonials with consent-aware attribution"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-022, FR-023, FR-024, FR-025, FR-026]
supersedes: null
---

# Verification: Testimonials with consent-aware attribution

## Evidence

### EV-019 — Unit tests for view logic and content invariants
- command: `npm test`
- output:
  ```text
  ✔ entries without a valid consent date are hidden (AC-033)
  ✔ a named person shows name, role, and organization (AC-035)  ✔ an unnamed person shows only the anonymous label (AC-035)
  ✔ a translated quote leads with English and keeps the original (AC-036)  ✔ an untranslated quote keeps its own language (AC-037)
  ✔ a project shows the first approved quote that has an excerpt (AC-038)
  ✔ every testimonial is complete, approved or pending, and tied to a real project (AC-039)  ✔ no client component imports the testimonials content (AC-040)
  ℹ tests 20  ℹ pass 20  ℹ fail 0
  ```
- date: 2026-10-16
- commit: 09a1d9a (F-006 changes on top, rerun after rebasing onto main)
- covers: [AC-033, AC-035, AC-036, AC-037, AC-038, AC-039, AC-040]

### EV-020 — Lint, typecheck, build, and built HTML with the committed (empty) list
- command: `npm run lint && npm run typecheck && npm run build`, then `grep` on `.next/server/app/index.html`
- output:
  ```text
  eslint: no findings; ✓ Types generated successfully; tsc: no errors
  ┌ ○ /  (Static) prerendered as static content
  id="testimonials": 0 matches; "(05) Recognition" present; "(06) Contact"
  ```
- date: 2026-10-16
- commit: 09a1d9a (F-006 changes on top, rerun after rebasing onto main)
- covers: [AC-033]

### EV-021 — Browser check with temporary local entries (removed afterwards, never committed)
- command: `npm run dev` (port 3000) + in-app browser at 360, 768, 1024, 1280 px; DOM queries and screenshots
- output:
  ```text
  three approved entries + one pending: section order work, experience, capabilities, testimonials, contact
  label "(06) Kind words · 03 quotes"; Contact "(07) Contact"; pending text absent from HTML and inline scripts
  row 1 label only, lang=en + original lang=id under "Translated from Indonesian"; row 2 name + "Role, Org"; row 3 lang=id
  excerpts render in the clinic case study and the open VisualKain "More work" panel; "Read in full" lands on #testimonials
  quote size 30.4 / 30.4 / 34.2 / 38.8 px at 360 / 768 / 1024 / 1280; no element wider than the viewport; no console errors
  after removing the entries: no #testimonials, "(06) Contact", no case-study quote
  ```
- date: 2026-10-16
- commit: 1a5753f (uncommitted working tree on top)
- covers: [AC-033, AC-034, AC-035, AC-036, AC-037, AC-038]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-033, AC-034 | EV-019, EV-020, EV-021 | pass |
| AC-035, AC-036, AC-037, AC-038 | EV-019, EV-021 | pass |
| AC-039, AC-040 | EV-019 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Reduced motion | the in-app browser cannot emulate it | rows use `LineRows` and `DriftTitle`, whose hidden states are set only inside `gsap.matchMedia(MOTION_OK)` |
| Real testimonials | none approved yet (A-003) | wording length differs from placeholders; re-check the layout when the first entry lands |
| Clean screenshots at every width | the browser pane was hidden, so several captures were stale or blank | widths were checked with DOM measurements; screenshots exist for 1280 and parts of 768 and 360 |

## Result

`pass_with_limitations`: the section stays hidden with no approved entry and renders each attribution and language case correctly when entries exist; reduced motion and real quotes still need a check.
