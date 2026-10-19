---
id: F-012
title: "Narrative revamp: chapters, theme handoff, case-study beats"
type: tasks
status: verification
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-19
last_updated: 2026-10-19
last_verified: null
requirements: [FR-040, FR-041, FR-042, FR-043, FR-044]
supersedes: null
---

# Tasks: Narrative revamp

This file is the master for task status. `state.yaml`, `BRIEF.md`, and the progress views are rendered from it and never edited by hand.

Preview only: the branch `feat/F-012-narrative-revamp` is never merged into `main` without the owner's approval (BR-018).

## Tasks

### T-051 — Theme engine and tokens
- status: review
- requirements: [FR-040]
- depends_on: []
- evidence: [EV-044, EV-045, EV-046]

Theme map and interpolator with tests, `brand-*` tokens, scoped no-JS blocks, `html.theme-live`, `ThemeHandoff`. Acceptance: AC-071, AC-072, AC-073, AC-074.

### T-052 — Chapter navigation
- status: review
- requirements: [FR-041]
- depends_on: [T-051]
- evidence: [EV-045]

Header chapter label and progress percentage. Acceptance: AC-075, AC-076.

### T-053 — Story arc and copy
- status: review
- requirements: [FR-042, FR-044]
- depends_on: [T-051]
- evidence: [EV-045, EV-046]

New order and themes, `Thesis` chapter, semantic tokens in Toolkit and Proof, `Reveal` titles instead of `DriftTitle` and `Scramble`, inline stack line, cursor rule. Acceptance: AC-077, AC-078, AC-081, AC-082, AC-083.

### T-054 — Case-study beats
- status: review
- requirements: [FR-043]
- depends_on: [T-053]
- evidence: [EV-045, EV-046]

Featured case studies as themed sub-chapters with the Problem, Build, Proof rail. Acceptance: AC-079, AC-080.

### T-055 — Verification and preview
- status: review
- requirements: [FR-040, FR-041, FR-042, FR-043, FR-044]
- depends_on: [T-051, T-052, T-053, T-054]
- evidence: [EV-044, EV-045, EV-046]

Lint, typecheck, test, build; browser at 360, 768, 1280 px, reduced motion, JavaScript off; preview for the owner; EV blocks from EV-044.

## Deferred

None.
