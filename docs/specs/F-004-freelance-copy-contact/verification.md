---
id: F-004
title: "Freelance-first copy, greeting intro, contact CTA"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-014, FR-015, FR-016]
supersedes: null
---

# Verification: Freelance-first copy, greeting intro, contact CTA

## Evidence

### EV-012 — Tests, lint, typecheck, build
- command: `npm test && npm run lint && npm run typecheck && npm run build`
- output:
  ```text
  ✔ availability leads with freelance, then internships (AC-023)
  ✔ mailto encodes subject and body (AC-025)
  ℹ tests 10  ℹ pass 10  ℹ fail 0; eslint and tsc clean; ┌ ○ / (Static)
  ```
- date: 2026-10-16
- commit: 156091c (uncommitted working tree on top)
- covers: [AC-023, AC-025]

### EV-013 — Browser check
- command: `npm run dev` + in-app browser reloads; `decodeURIComponent` of the CTA `href`
- output:
  ```text
  intro: "HELLO, client" at first screenshot, scrambles through recruiter, resolves "I'm Sehan.", curtain, hero
  hero badge: "Available for freelance"; ring: "Available for freelance · Open to work · 2026 · "
  CTA href: mailto:...?subject=Project inquiry from your portfolio&body=Hi Sehan, ... Budget range (optional) ...
  CTA data-cursor="hide"; Copy email button present
  ```
- date: 2026-10-16
- commit: 156091c (uncommitted working tree on top)
- covers: [AC-024, AC-025]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-023 | EV-012 | pass |
| AC-024 | EV-013 | pass |
| AC-025 | EV-012, EV-013 | pass |
| AC-026 | none | not_run |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Copy email click (AC-026) | clicking would overwrite the owner's clipboard during a review session | try it once; on failure the button shows the address for manual copy |
| Mail app opening the draft | depends on the visitor's machine | the copy button and LinkedIn link cover visitors without a mail app |

## Result

`pass_with_limitations`: copy, intro greeting, and CTA link are correct and build; the clipboard click needs one manual try.
