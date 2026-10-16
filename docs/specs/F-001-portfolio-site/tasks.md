---
id: F-001
title: "Portfolio site"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
supersedes: null
---

# Tasks: Portfolio site

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-001 — Scaffold, SDD v2 init, motion foundation
- status: done
- requirements: [FR-005]
- depends_on: []
- evidence: [EV-002]

Next.js 16 app, SDD v2.0.0 template applied with `--app nextjs --tier lite`, GSAP + `@gsap/react` + Lenis installed (owner approved 2026-10-16), `src/lib/motion/gsap.ts` and `SmoothScroll` provider. Acceptance: AC-006.

### T-002 — Typed content and invariants test
- status: done
- requirements: [FR-002, FR-003]
- depends_on: [T-001]
- evidence: [EV-001]

`src/content/portfolio.ts` from `about-me` VERIFIED facts; `portfolio.test.ts`. Acceptance: AC-002, AC-004.

### T-003 — Sections and motion
- status: done
- requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
- depends_on: [T-002]
- evidence: [EV-002, EV-003, EV-004]

Header, hero, about, work, experience, capabilities, contact, footer, cursor. Acceptance: AC-001 to AC-007.

### T-004 — Images and placeholders
- status: done
- requirements: [FR-002]
- depends_on: [T-003]
- evidence: [EV-004]

Portrait and cleared screenshots into `src/assets/images/` as WebP; placeholders elsewhere. Acceptance: AC-003. Blocked for deploy by A-002.

### T-005 — Verification and handoff
- status: in_progress
- requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
- depends_on: [T-003, T-004]
- evidence: [EV-001, EV-002, EV-003, EV-004]

Lint, typecheck, test, build, browser check at 360, 768, 1280 px and with reduced motion; `verification.md` and handoff updated.

### T-006 — Deploy to Vercel
- status: planned
- requirements: [FR-001]
- depends_on: [T-005]
- evidence: []

Needs owner go-ahead, A-001 and A-002 resolved, and a Vercel project. Out of scope for the first session.

## Deferred

None.
