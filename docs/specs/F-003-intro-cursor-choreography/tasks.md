---
id: F-003
title: "Intro, cursor, and scroll choreography"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-010, FR-011, FR-012, FR-013]
supersedes: null
---

# Tasks: Intro, cursor, and scroll choreography

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-011 — Opening sequence
- status: done
- requirements: [FR-010]
- depends_on: []
- evidence: [EV-008, EV-009]

Intro overlay, intro state, scroll lock, hero waits. Acceptance: AC-014, AC-015, AC-016.

### T-012 — Pointer feedback
- status: done
- requirements: [FR-011]
- depends_on: []
- evidence: [EV-008, EV-010]

Cursor ring states, magnetic, roll text, floating preview with posters. Acceptance: AC-017.

### T-013 — Section choreography and layout fixes
- status: done
- requirements: [FR-012, FR-013]
- depends_on: [T-011]
- evidence: [EV-008, EV-010]

Per-section effects, case study stacking, header hide, mobile menu size. Acceptance: AC-018 to AC-021.

### T-014 — Verification
- status: in_progress
- requirements: [FR-010, FR-011, FR-012, FR-013]
- depends_on: [T-011, T-012, T-013]
- evidence: [EV-008, EV-009, EV-010]

Lint, typecheck, test, build, browser check at 1440 and 375 px.

### T-015 — Intro consistency
- status: done
- requirements: [FR-010]
- depends_on: [T-011]
- evidence: [EV-011]

Audit (2026-10-16): the session short mode looked like a missing intro; text only appeared after hydration; two `ScrollTrigger.refresh()` calls and `lagSmoothing(0)` made the curtain skip; the exit lip sat half on screen. Fixed per AC-015.

### T-016 — Section spacing
- status: done
- requirements: [FR-013]
- depends_on: [T-013]
- evidence: [EV-011]

Ink sections `py-16 md:py-24`; section headers `mb-16 md:mb-24`. Acceptance: AC-022.

## Deferred

None.
