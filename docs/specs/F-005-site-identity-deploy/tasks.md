---
id: F-005
title: "Site identity and production deploy"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-017, FR-018, FR-019]
supersedes: null
---

# Tasks: Site identity and production deploy

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-021 — Deploy to Vercel on sechanalfarisi.dev
- status: done
- requirements: [FR-017]
- depends_on: []
- evidence: [EV-014]

Takes over F-001 T-006. Acceptance: AC-027.

### T-022 — Site icon and dev badge
- status: done
- requirements: [FR-018]
- depends_on: []
- evidence: [EV-015, EV-016]

Acceptance: AC-028.

### T-023 — Canonical metadata
- status: done
- requirements: [FR-019]
- depends_on: [T-021]
- evidence: [EV-015, EV-016]

Acceptance: AC-029.

### T-024 — Verify on production after merge
- status: planned
- requirements: [FR-017, FR-018, FR-019]
- depends_on: [T-022, T-023]
- evidence: []

After this branch merges and Vercel redeploys, confirm the live head links the new icons and the canonical URL.

## Deferred

None.
