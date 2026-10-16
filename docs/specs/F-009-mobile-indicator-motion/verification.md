---
id: F-009
title: "Mobile polish, section indicator, motion set 2"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-027, FR-028, FR-029]
supersedes: null
---

# Verification: Mobile polish, section indicator, motion set 2

## Evidence

### EV-022 — Tests, lint, typecheck, build
- command: `npm test && npm run lint && npm run typecheck && npm run build`
- output:
  ```text
  tests 23/23 pass; eslint and tsc clean; build ○ / static; rerun without the liquid hover: same, 0 "liquid" matches
  ```
- date: 2026-10-16
- commit: fa7a7cf (uncommitted working tree on top)
- covers: [AC-049]

### EV-023 — Browser at 1440 px
- command: `npx next dev -p 3002` + in-app browser at 1440x900; DOM queries and screenshots
- output:
  ```text
  hero pill fill from the entry point + trail; slices "WORK" land on #work; header "(02) WORK", nav "• Work"; Contact label 127 px, sheet 96 px
  Proof pinned at top 0, track x -1324 = -(2685 - 1361), progress scaleX 1; footer title scale 0.92 mid-way, 1 at the end
  ```
- date: 2026-10-16
- commit: fa7a7cf (uncommitted working tree on top)
- covers: [AC-041, AC-044, AC-045, AC-047, AC-048]

### EV-024 — Browser at 375 px
- command: same server; viewport narrowed live from 1440, then reloaded as a mobile device (375x812)
- output:
  ```text
  live narrow: Proof track transform identity, grid layout, no pin spacer, no horizontal overflow
  indicator hidden; pills use the CSS fill; Fluxa poster 343x258, overflow 0; Menu > Contact: label 176 px, sheet 64 px
  ```
- date: 2026-10-16
- commit: fa7a7cf (uncommitted working tree on top)
- covers: [AC-041, AC-042, AC-043, AC-044, AC-047, AC-050]

### EV-028 — Mobile menu reveal after the BUG-001 fix
- command: `npm run build && npx next start -p 3004` + in-app browser at 375x812; same probe on production
- output:
  ```text
  production: links transition "transform, ..." and a set transform lags (0 vs 40 px); fix: "scale" only (pills "scale, border-color"), it applies at once, 4/4 lines end at offset 0
  ```
- date: 2026-10-16
- commit: d1713ef (uncommitted working tree on top)
- covers: [AC-043, AC-044]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-041, AC-045, AC-047, AC-048 | EV-023 (AC-041, AC-047 also EV-024) | pass |
| AC-042, AC-043, AC-044, AC-050 | EV-024 (AC-043 also EV-028; AC-044 also EV-023, EV-028) | pass, touch emulated |
| AC-049 | EV-022 + code review | partial |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Reduced motion | the in-app browser cannot emulate it | every effect is added inside `gsap.matchMedia(MOTION_OK)`; the slice runner is absent, so links fall back to native anchors |
| Real touch device after BUG-001 | emulation only | the owner's phone found BUG-001; recheck the menu, tap feedback, and inline visuals there |
| 768 to 1023 px, Lighthouse | not measured | Proof stays a grid there and footer parallax starts at 768 px; the pin and pill trail add work on scroll and hover only |

## Result

`pass_with_limitations`: every effect works at 1440 and 375 px and the menu reveal completes again; reduced motion, a real phone, and the tablet range still need a check.
