---
id: F-007
title: "Stack marquee redesign"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-020, FR-021]
supersedes: null
---

# Verification: Stack marquee redesign

## Evidence

### EV-017 — Lint, typecheck, tests, build
- command: `npm run lint && npm run typecheck && npm test && npm run build`
- output:
  ```text
  eslint clean; Types generated successfully; tsc clean; tests 11, pass 11, fail 0
  ✓ Compiled successfully; ┌ ○ /
  ```
- date: 2026-10-16
- commit: dbdecf4 (uncommitted working tree on top, worktree `feat/F-007-marquee-redesign`)
- covers: [AC-030]

### EV-018 — Browser check at 1440 and 375 px
- command: `next dev -p 3001` in the worktree + in-app browser screenshots; `scrollWidth` vs `clientWidth`
- output:
  ```text
  1440: label column "Stack I ship with / 08 tools", one row: Applied AI (serif) * TYPESCRIPT * Appwrite * FLUTTER, faded edges
  375: label above the row, same alternation; scrollWidth 375 == clientWidth 375
  row moving between screenshots; no skew
  ```
- date: 2026-10-16
- commit: dbdecf4 (uncommitted working tree on top, worktree `feat/F-007-marquee-redesign`)
- covers: [AC-030, AC-031]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-030 | EV-017, EV-018 | pass |
| AC-031 | EV-018 | pass |
| AC-032 | none | not_run |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Reduced motion (AC-032) | the in-app browser cannot emulate it | both tweens sit inside `gsap.matchMedia(MOTION_OK)`; T-026 |
| Hover slow-down | not isolated in a screenshot | `timeScale` 0.25 while hovered; check by hovering the band |

## Result

`pass_with_limitations`: the new band renders at both widths and builds; reduced motion and hover pacing need a manual look.
