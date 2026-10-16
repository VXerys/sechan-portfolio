---
id: F-002
title: "Visual refresh and testimonials"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-006, FR-007, FR-008, FR-009]
supersedes: null
---

# Verification: Visual refresh and testimonials

## Evidence

### EV-005 — Content tests including testimonials and clinic naming
- command: `npm test`
- output:
  ```text
  ✔ clinic stays unnamed until it approves (AC-013)
  ✔ every testimonial is attributed, approved, and tied to a real project (AC-012)
  ℹ tests 8  ℹ pass 8  ℹ fail 0
  ```
- date: 2026-10-16
- commit: 46bf411 (uncommitted working tree on top)
- covers: [AC-012, AC-013]

### EV-006 — Lint, typecheck, production build
- command: `npm run lint && npm run typecheck && npm run build`
- output:
  ```text
  eslint: no findings; tsc --noEmit: no errors
  ✓ Compiled successfully in 4.9s; ┌ ○ /  (Static) prerendered as static content
  ```
- date: 2026-10-16
- commit: 46bf411 (uncommitted working tree on top)
- covers: [AC-008, AC-011]

### EV-007 — Browser check at 456 px pane width
- command: `npm run dev` + in-app browser, `getComputedStyle(document.body).fontFamily`
- output:
  ```text
  body font: "Host Grotesk"; manifesto in Instrument Serif with lime italic tail;
  ✳ glyph rotates behind it; "(01) How I work" label decodes; marquee runs with "&" separators;
  no testimonials section rendered (list empty); no console errors
  ```
- date: 2026-10-16
- commit: 46bf411 (uncommitted working tree on top)
- covers: [AC-008, AC-009, AC-011]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-008 | EV-006, EV-007 | pass |
| AC-009 | EV-007 | pass |
| AC-010 | none | not_run |
| AC-011 | EV-006, EV-007 | pass |
| AC-012, AC-013 | EV-005 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Reduced motion (AC-010) | in-app browser cannot emulate it | scramble, glyph, and marquee are inside `gsap.matchMedia`; check in DevTools |
| Cursor label and nav scramble at desktop width | pane stayed at 456 px | both need a fine pointer and `md` width |

## Result

`pass_with_limitations`: type and motion changes render and build; reduced motion and desktop-only hover effects need a manual check.
