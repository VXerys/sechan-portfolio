---
id: F-007
title: "Stack marquee redesign"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-020, FR-021]
supersedes: null
---

# Tasks: Stack marquee redesign

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-025 — Editorial band and motion
- status: done
- requirements: [FR-020, FR-021]
- depends_on: []
- evidence: [EV-017, EV-018]

Rewrite `marquee.tsx` per the design table. Acceptance: AC-030, AC-031.

### T-026 — Reduced-motion check
- status: planned
- requirements: [FR-021]
- depends_on: [T-025]
- evidence: []

DevTools > Rendering > `prefers-reduced-motion: reduce`; the row must be static. Acceptance: AC-032.

## Deferred

None.
