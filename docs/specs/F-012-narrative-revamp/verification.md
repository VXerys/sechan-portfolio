---
id: F-012
title: "Narrative revamp: chapters, theme handoff, case-study beats"
type: verification
status: verification
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-19
last_updated: 2026-10-19
last_verified: 2026-10-19
requirements: [FR-040, FR-041, FR-042, FR-043, FR-044]
supersedes: null
---

# Verification: Narrative revamp

Evidence that acceptance criteria hold at a named commit. A claim without a command and an output excerpt is not evidence. Unrun checks are listed, never omitted.

## Evidence

### EV-044 — Checks
- command: `npm run lint && npm run typecheck && npm test && npm run build`
- output:
  ```text
  eslint and tsc clean; tests 81/81 pass, including themes.test.ts: every theme at 4.5:1 or more for body, muted, muted on raised, chip text;
  blend endpoints exact; text contrast never below 3:1 through ink>paper, paper>ink, paper>lime, ink>lime blends; build ○ / static
  ```
- date: 2026-10-19
- commit: feat/F-012-narrative-revamp, first commit
- covers: [AC-071, AC-074]

### EV-045 — Desktop chapters
- command: `next start -p 3009` + in-app browser at 1280 px
- output:
  ```text
  html.theme-live set; chapters: top ink, about paper, work ink, bookmate paper, marketiv ink, cartify paper, clinic ink, archive paper,
  experience ink, capabilities paper, contact lime; data-section 01 Why I build .. 06 Let's build
  mid-blend at the Work edge: grey surface with cream text (readable); after a jump from the bottom to Archive: --color-ink #efede6, active paper
  header "Ch. 03 · Archive 62%", nav Work marked current; BookMate rail "01 Problem / 02 Build / 03 Proof" with 02 active, labels in each block
  ```
- date: 2026-10-19
- commit: feat/F-012-narrative-revamp, first commit
- covers: [AC-071, AC-075, AC-076, AC-077, AC-078, AC-079, AC-081, AC-082]

### EV-046 — Phone and no-JS fallback
- command: in-app browser at 375 px; theme-live removed in the page to simulate no JavaScript
- output:
  ```text
  375: scrollWidth 375 = innerWidth, no element past the right edge; case-study rail display none; thesis and Cartify chapter readable
  without the engine: about, bookmate, archive, capabilities rgb(239,237,230)/rgb(12,12,11); work, marketiv, experience rgb(12,12,11)/rgb(239,237,230);
  contact rgb(212,255,58)/rgb(12,12,11)
  ```
- date: 2026-10-19
- commit: feat/F-012-narrative-revamp, first commit
- covers: [AC-073, AC-080]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-071 | EV-044, EV-045 | pass |
| AC-072 | none | not run: the in-app browser cannot emulate reduced motion; the code path is the same instant switch phones use |
| AC-073 | EV-046 | pass |
| AC-074 | EV-044 | pass |
| AC-075, AC-076 | EV-045 | pass |
| AC-077, AC-078 | EV-045 | pass |
| AC-079 | EV-045 | pass |
| AC-080 | EV-046 | pass (phone); reduced motion not run |
| AC-081, AC-082 | EV-045 | pass |
| AC-083 | none | not run in the browser: CSS rule hides [data-site-cursor] when data-active-theme is not ink |

## Not yet verified

- AC-072 and the reduced-motion half of AC-080, AC-083 in a real browser.
- NFR-005 Lighthouse on a deployed preview.
