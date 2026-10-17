---
id: F-011
title: "Experience highlights and clinic naming"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
requirements: [FR-033, FR-034, FR-035]
supersedes: null
---

# Tasks: Experience highlights and clinic naming

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

Run with subagent-driven development: one implementer per task, a task review after each, then a whole-branch review. Ships before F-010.

## Tasks

### T-037 — Content and tests
- status: planned
- requirements: [FR-033, FR-034, FR-035]
- depends_on: []
- evidence: []

`program` and `education` with their types, the clinic name in the project and the freelance entry, the updated tests, and A-001 confirmed. Facts come from about-me 03, 09, 16 (VERIFIED only). Acceptance: AC-055, AC-057, AC-059, AC-060.

### T-038 — Experience UI and project chips
- status: planned
- requirements: [FR-033, FR-034]
- depends_on: [T-037]
- evidence: []

Highlight card, education row, `ProjectChip`, ids on case studies and More work rows, and the `project:open` listener. Acceptance: AC-054, AC-056, AC-058.

### T-039 — Verification
- status: planned
- requirements: [FR-033, FR-034, FR-035]
- depends_on: [T-037, T-038]
- evidence: []

Lint, typecheck, test, build; browser at 360, 768, 1280 px including every chip; record EV blocks from EV-029.

## Deferred

None.
