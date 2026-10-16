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
  ℹ tests 23  ℹ pass 23  ℹ fail 0; eslint: no findings; ✓ Types generated successfully; tsc: no errors
  ✓ Compiled successfully; ┌ ○ /  (Static) prerendered as static content
  rerun after removing the liquid hover: same results; "liquid" in src and built index.html: 0 matches
  ```
- date: 2026-10-16
- commit: fa7a7cf (uncommitted working tree on top)
- covers: [AC-049]

### EV-023 — Browser at 1440 px
- command: `npx next dev -p 3002` + in-app browser at 1440x900; DOM queries and screenshots
- output:
  ```text
  hero "Selected work": lime fill from the entry point, three-dot trail; slices show "WORK" and land on #work
  header "SECHAN/ALFARISI (02) WORK", nav "• Work" active; Contact link: label at 127 px, sheet ends at 96 px
  BookMate visual: cursor label "Open ↗" on hover
  Proof pinned at top 0; track x -1324 = -(2685 - 1361); last card right edge 1393; progress scaleX 1
  footer title scale 0.92 mid-way, 1 at the end
  ```
- date: 2026-10-16
- commit: fa7a7cf (uncommitted working tree on top)
- covers: [AC-041, AC-044, AC-045, AC-047, AC-048]

### EV-024 — Browser at 375 px
- command: same server; viewport narrowed live from 1440, then reloaded as a mobile device (375x812)
- output:
  ```text
  live narrow: Proof track transform identity, grid layout, no pin spacer, no horizontal overflow
  header indicator display none; pills have no data-animated (CSS fill only); rows and pills carry active:scale
  Fluxa row open: poster visual 343x258 inside the panel; overflow 0
  Menu > Contact: slices show "CONTACT"; label at 176 px, title at 217 px, sheet ends at 64 px, footer not shifted
  before the footer fix the label sat under the sheet at every scroll position
  ```
- date: 2026-10-16
- commit: fa7a7cf (uncommitted working tree on top)
- covers: [AC-041, AC-042, AC-043, AC-044, AC-047, AC-050]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-041, AC-044, AC-047 | EV-023, EV-024 | pass |
| AC-042, AC-043, AC-050 | EV-024 | pass (emulated touch) |
| AC-045, AC-048 | EV-023 | pass |
| AC-049 | EV-022 + code review | partial |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Reduced motion | the in-app browser cannot emulate it | every effect is added inside `gsap.matchMedia(MOTION_OK)`; the slice runner is absent, so links fall back to native anchors |
| Real touch device | emulation only | `active:` feedback and the inline visual need a check on a phone |
| 768 to 1023 px | not measured | Proof stays a grid there; footer parallax is on from 768 px |
| Lighthouse | not run for this change | the Proof pin and the pill trail add work on scroll and hover only |

## Result

`pass_with_limitations`: every effect works at 1440 and 375 px; reduced motion, a real phone, and the tablet range still need a check.
