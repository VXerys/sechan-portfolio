---
id: F-003
title: "Intro, cursor, and scroll choreography"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-010, FR-011, FR-012, FR-013]
supersedes: null
---

# Verification: Intro, cursor, and scroll choreography

## Evidence

### EV-008 — Lint, typecheck, tests, production build
- command: `npm run lint && npm run typecheck && npm test && npm run build`
- output:
  ```text
  eslint: no findings; tsc --noEmit: no errors; tests 8, pass 8, fail 0
  ✓ Compiled successfully in 6.0s; ┌ ○ /  (Static) prerendered as static content
  ```
- date: 2026-10-16
- commit: 4e41b7f (uncommitted working tree on top)
- covers: [AC-018, AC-019]

### EV-009 — Intro in the browser, first visit and repeat
- command: `npm run dev` + in-app browser, `sessionStorage.removeItem('intro-seen')`, reload, screenshots every 0.5 s
- output:
  ```text
  SECHAN rises, word morphs to Alfarisi, counter 000 -> 100, lime curtain rises, curved lift, hero after
  ```
- date: 2026-10-16
- commit: 4e41b7f (uncommitted working tree on top)
- covers: [AC-014, AC-015]

### EV-010 — Pointer, scroll, and layout checks
- command: in-app browser at 772 px and 375 px, wheel scroll, hover, `scrollWidth == clientWidth`
- output:
  ```text
  sheet over pinned hero; marquee skews; case study stacks full width; floating poster follows and tilts;
  footer reveal; 375 px menu: Experience right edge 311 < 375; no horizontal overflow
  ```
- date: 2026-10-16
- commit: 4e41b7f (uncommitted working tree on top)
- covers: [AC-017, AC-018, AC-019, AC-021]

### EV-011 — Intro on repeated reloads and section gaps
- command: in-app browser, two plain reloads with screenshots at 0.4 to 3 s; gap measurement with `getBoundingClientRect`
- output:
  ```text
  two reloads: "SECHAN Mobile" at first screenshot, counter -> 100, Alfarisi, curtain, lift; no early lime edge
  393 px gaps: More work -> Experience 152, About -> Work 152, between case studies 128
  ```
- date: 2026-10-16
- commit: 4e41b7f (uncommitted working tree on top)
- covers: [AC-015, AC-022]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-014, AC-015, AC-022 | EV-009, EV-011 | pass |
| AC-016, AC-020 | none | not_run |
| AC-017, AC-018, AC-019, AC-021 | EV-008, EV-010 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Reduced motion and no-JS intro (AC-016) | in-app browser cannot emulate them | overlay is `display: none` unless `html.js` under `no-preference`; check in DevTools |
| Header hide on scroll (AC-020) | not isolated in a screenshot | ScrollTrigger direction logic; check by scrolling down then up |

## Result

`pass_with_limitations`: intro, pointer states, and section effects render and build; reduced motion and header hide need a manual check.
