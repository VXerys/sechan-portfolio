---
id: F-009
title: "Mobile polish, section indicator, motion set 2"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-027, FR-028, FR-029]
supersedes: null
---

# Tasks: Mobile polish, section indicator, motion set 2

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-030 — Section indicator
- status: done
- requirements: [FR-027]
- depends_on: []
- evidence: [EV-023, EV-024]

`data-section` and `data-section-label` on every section; header shows the scrambled "(02) Work" label from `sm` up and marks the active nav link; nav in page order. Acceptance: AC-041.

### T-031 — Touch experience
- status: done
- requirements: [FR-028]
- depends_on: []
- evidence: [EV-024, EV-028]

Inline visual in an open More work row under 768 px; `active:` scale on rows, pills, and menu links, transitioning `scale` only (BUG-001); no tap highlight; footer parallax limited to 768 px and up. Acceptance: AC-042, AC-043, AC-050.

### T-032 — Slice transition and pill buttons
- status: done
- requirements: [FR-029]
- depends_on: [T-030]
- evidence: [EV-023, EV-024]

`SliceTransition` with `jumpTo` for header, menu, hero, and back-to-top links; `PillLink` and `PillButton` for hero CTAs, copy email, and LinkedIn. Acceptance: AC-044, AC-045, AC-049.

### T-033 — Horizontal Proof, footer scale
- status: done
- requirements: [FR-029]
- depends_on: []
- evidence: [EV-023, EV-024]

`ProofTrack` pinned sideways at 1024 px and up; "Let's build" scales with the scroll. The liquid hover built here was removed at the owner's request (see requirements non-goals). Acceptance: AC-047, AC-048, AC-049.

### T-034 — Verification
- status: review
- requirements: [FR-027, FR-028, FR-029]
- depends_on: [T-030, T-031, T-032, T-033]
- evidence: [EV-022, EV-023, EV-024, EV-028]

Lint, typecheck, test, build; browser checks at 1440 and 375 px, including the live narrow-screen revert of the Proof pin.

## Deferred

None.
