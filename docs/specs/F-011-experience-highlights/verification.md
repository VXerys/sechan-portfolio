---
id: F-011
title: "Experience highlights and clinic naming"
type: verification
status: verification
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
requirements: [FR-033, FR-034, FR-035]
supersedes: null
---

# Verification: Experience highlights and clinic naming

Evidence that acceptance criteria hold at a named commit. A claim without a command and an output excerpt is not evidence. Unrun checks are listed, never omitted.

## Evidence

### EV-029 — Tests, lint, typecheck, build, served HTML
- command: `npm test && npm run lint && npm run typecheck && npm run build`, then `next start -p 3006` and `grep -o` on the served page
- output:
  ```text
  tests 25/25 pass (clinic named as approved; program shows no capstone partner; education links only real projects; testimonials hold no phone numbers); eslint and tsc clean; build ○ / static
  served: program name 2, "Fellow" 2, "Aug 2026 - Jan 2027" 2, "In progress" 4, "S.Kom. Informatics Engineering" 2, "Sep 2023 - 2027 (expected)" 2, "Built while studying" 2, "Klinik Cikidang Medika" 7
  served: "primary care clinic" 0, "capstone" 0, "HOWL" 0; id="cartify" 1, id="webgis-gunung-puyuh" 1, aria-labelledby="education-projects" 1
  ```
- date: 2026-10-17
- commit: 5f272df
- covers: [AC-054, AC-055, AC-056, AC-057, AC-059, AC-060]

### EV-030 — Browser at 1280, 768, 375 px
- command: `next start -p 3006` + in-app browser; DOM queries and screenshots
- output:
  ```text
  1280: card "HIGHLIGHT / program / path · Fellow / AUG 2026 - JAN 2027 / IN PROGRESS"; education row with four chips; no overflow
  Cartify chip: slices "CARTIFY", case study top 96 px; ArtConnect open, then WebGIS chip: WebGIS open, ArtConnect closed, top 96 px
  768 and 375: card stacks or splits as designed; overflow 0
  ```
- date: 2026-10-17
- commit: d0877b9
- covers: [AC-054, AC-056, AC-057, AC-058]

### EV-031 — Final fix wave at 360 px and focus
- command: same server rebuilt at 5f272df; viewport 360x780
- output:
  ```text
  overflow 0; chips rounded 16 px below sm; textContent "Cartify Research Methodology and Mobile Programming"
  Fluxa chip: focus on BUTTON aria-expanded=true (fluxa-panel), row top 96 px; Cartify chip: focus on ARTICLE#cartify tabindex=-1, outline none, top 96 px
  ```
- date: 2026-10-17
- commit: 5f272df
- covers: [AC-057, AC-058]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-054, AC-056 | EV-029, EV-030 | pass |
| AC-055, AC-059, AC-060 | EV-029 | pass |
| AC-057, AC-058 | EV-029, EV-030, EV-031 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Reduced motion | the in-app browser cannot emulate it | chips fall back to native anchors; with another row open, a browser without scroll anchoring may land one panel height off |
| Screen reader | not available here | focus now moves to the target; announcements are unverified |
| Real phone | emulation only | chip tap targets are about 37 px tall |

## Result

`pass_with_limitations`: every criterion holds at 360, 375, 768, and 1280 px; reduced motion and a screen reader still need a manual check.
