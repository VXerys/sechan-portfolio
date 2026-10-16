---
id: F-001
title: "Portfolio site"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
supersedes: null
---

# Verification: Portfolio site

## Evidence

### EV-001 — Content invariants
- command: `npm test`
- output:
  ```text
  ✔ slugs, ordering, sections, no phone, https links, no hype words (tests 6, pass 6, fail 0)
  ```
- date: 2026-10-16
- commit: b3ab30f (uncommitted working tree on top)
- covers: [AC-002, AC-004, AC-005]

### EV-002 — Lint, typecheck, production build
- command: `npm run lint && npm run typecheck && npm run build`
- output:
  ```text
  eslint: no findings; tsc --noEmit: no errors
  ✓ Compiled successfully in 9.4s; ┌ ○ /  (Static) prerendered as static content
  ```
- date: 2026-10-16
- commit: b3ab30f (uncommitted working tree on top)
- covers: [AC-001, AC-002, AC-003, AC-004, AC-005]

### EV-003 — Server HTML carries all content without JavaScript
- command: `curl -s http://localhost:3000 | grep -c "<string>"`
- output:
  ```text
  hero, all 8 project titles, achievements, email, GitHub, LinkedIn: 1 match each; "+62": 0
  ```
- date: 2026-10-16
- commit: b3ab30f (uncommitted working tree on top)
- covers: [AC-007, AC-005]

### EV-004 — Browser check, desktop and phone width
- command: `npm run dev` + in-app browser at 1440x900 and 375x812, `document.documentElement.scrollWidth`
- output:
  ```text
  1440 and 375: hero text visible, no console errors, scrollWidth == innerWidth
  ```
- date: 2026-10-16
- commit: b3ab30f (uncommitted working tree on top)
- covers: [AC-001, AC-003]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-001, AC-003 | EV-002, EV-004 | pass |
| AC-002, AC-004, AC-005 | EV-001, EV-002, EV-003 | pass |
| AC-006 | none | not_run |
| AC-007 | EV-003 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Reduced motion (AC-006) | the in-app browser cannot emulate `prefers-reduced-motion` | code path is `gsap.matchMedia` guarded; verify in Chrome DevTools > Rendering |
| 768 px layout, mobile menu, Lighthouse | pane width kept changing; not reached this session | tablet layout, Escape/focus return, and scores unverified |

## Result

`pass_with_limitations`: build, lint, typecheck, and content tests pass; reduced motion, tablet width, and Lighthouse still need a manual run.
