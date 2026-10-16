---
id: F-008
title: "Content corrections: name, Mangcoding, project list"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-022, FR-023, FR-024]
supersedes: null
---

# Verification: Content corrections

## Evidence

### EV-019 — Content tests and build
- command: `npm test && npm run build`
- output:
  ```text
  ✔ public copy uses the name Sechan (AC-033)
  ✔ Mangcoding is named by brand, with its legal entity alongside (AC-034)
  ✔ on-hold projects are not presented as work (AC-035)
  ℹ tests 23  ℹ pass 23  ℹ fail 0; ✓ Compiled successfully; ┌ ○ /
  ```
- date: 2026-10-16
- commit: 8b06c5b (uncommitted working tree on top, worktree `feat/F-008-content-corrections`)
- covers: [AC-033, AC-034, AC-035]

### EV-020 — Rendered page, dev and production builds
- command: `curl` on `next dev -p 3002`; in-app browser on `next start -p 3003` (production build) at 483 px
- output:
  ```text
  HTML: Fluxa, ArtConnect, Gunung Puyuh WebGIS, PT Nugraha Kreasi Digital present; MangKasir, PT Mangcoding, Sehan absent
  Experience: MANGCODING / PT NUGRAHA KREASI DIGITAL label / Mobile Software Engineer Intern
  production intro: "HELLO, client" at first frame (comma intact) -> "I'm Sechan." -> lime curtain
  ```
- date: 2026-10-16
- commit: 8b06c5b (uncommitted working tree on top, worktree `feat/F-008-content-corrections`)
- covers: [AC-033, AC-034, AC-035]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-033, AC-034, AC-035 | EV-019, EV-020 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Fluxa and WebGIS screenshots | none cleared yet | they show posters in More work |

## Result

`pass`: the name, employer, and project list are corrected and verified in tests and on a production build. Note: under `next dev` the intro text can stay hidden for a few seconds while dev hydration blocks the main thread; the production build does not.
