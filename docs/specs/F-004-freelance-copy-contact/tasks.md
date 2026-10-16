---
id: F-004
title: "Freelance-first copy, greeting intro, contact CTA"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-014, FR-015, FR-016]
supersedes: null
---

# Tasks: Freelance-first copy, greeting intro, contact CTA

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-017 — Freelance-first copy
- status: done
- requirements: [FR-014]
- depends_on: []
- evidence: [EV-012]

Content, hero badge, ring text, product steering. Acceptance: AC-023.

### T-018 — Greeting intro
- status: done
- requirements: [FR-015]
- depends_on: []
- evidence: [EV-013]

Acceptance: AC-024.

### T-019 — Contact CTA
- status: done
- requirements: [FR-016]
- depends_on: [T-017]
- evidence: [EV-012, EV-013]

Prefilled `mailto:`, copy button, cursor hidden over the CTA. Acceptance: AC-025, AC-026.

### T-020 — Verification
- status: in_progress
- requirements: [FR-014, FR-015, FR-016]
- depends_on: [T-017, T-018, T-019]
- evidence: [EV-012, EV-013]

Lint, typecheck, test, build, browser check.

## Deferred

None.
