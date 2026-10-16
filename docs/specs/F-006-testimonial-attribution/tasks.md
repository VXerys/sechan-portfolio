---
id: F-006
title: "Testimonials with consent-aware attribution"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-022, FR-023, FR-024, FR-025, FR-026]
supersedes: null
---

# Tasks: Testimonials with consent-aware attribution

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-027 — Testimonial content model and view logic
- status: review
- requirements: [FR-022, FR-023, FR-024, FR-026]
- depends_on: []
- evidence: [EV-019, EV-020]

`src/content/testimonials.ts`, `src/lib/testimonials.ts`, both test files, outreach steps. Acceptance: AC-033, AC-035, AC-036, AC-037, AC-039, AC-040.

### T-028 — Section and project quote
- status: review
- requirements: [FR-022, FR-023, FR-024, FR-025]
- depends_on: [T-027]
- evidence: [EV-020, EV-021]

Rows layout, numbering, `ProjectQuote` in case studies and the "More work" panel. Acceptance: AC-033, AC-034, AC-038.

### T-029 — Verification
- status: review
- requirements: [FR-022, FR-023, FR-024, FR-025, FR-026]
- depends_on: [T-027, T-028]
- evidence: [EV-019, EV-020, EV-021]

Lint, typecheck, test, build; built HTML without entries; browser check at 360, 768, 1280 px with temporary local entries that are removed before any commit.

## Deferred

None.
