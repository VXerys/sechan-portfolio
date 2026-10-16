---
id: F-002
title: "Visual refresh and testimonials"
type: tasks
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-006, FR-007, FR-008, FR-009]
supersedes: null
---

# Tasks: Visual refresh and testimonials

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

## Tasks

### T-007 — Type system
- status: done
- requirements: [FR-006]
- depends_on: []
- evidence: [EV-006, EV-007]

Host Grotesk body, serif statements, display tracking. Acceptance: AC-008.

### T-008 — Reference-inspired motion
- status: done
- requirements: [FR-007]
- depends_on: [T-007]
- evidence: [EV-006, EV-007]

Scramble labels, rotating glyph, velocity marquee, cursor label, year tags. Acceptance: AC-009, AC-010.

### T-009 — Testimonials and clinic naming
- status: done
- requirements: [FR-008, FR-009]
- depends_on: []
- evidence: [EV-005, EV-006]

Content type, section, tests, outreach templates in `docs/outreach/`. Acceptance: AC-011, AC-012, AC-013.

### T-010 — Verification
- status: in_progress
- requirements: [FR-006, FR-007, FR-008, FR-009]
- depends_on: [T-007, T-008, T-009]
- evidence: [EV-005, EV-006, EV-007]

Lint, typecheck, test, build, browser check.

## Deferred

None.
