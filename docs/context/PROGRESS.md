<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 39f9b93f2423386ef3313e5379984df2d0215d259dd78ec2b050365ae046353f -->

# Project Progress

## F-001 — Portfolio site (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-001 Scaffold, SDD v2 init, motion foundation | done | FR-005 |  | EV-002 |
| T-002 Typed content and invariants test | done | FR-002, FR-003 | T-001 | EV-001 |
| T-003 Sections and motion | done | FR-001, FR-002, FR-003, FR-004, FR-005 | T-002 | EV-002, EV-003, EV-004 |
| T-004 Images and placeholders | done | FR-002 | T-003 | EV-004 |
| T-005 Verification and handoff | in_progress | FR-001, FR-002, FR-003, FR-004, FR-005 | T-003, T-004 | EV-001, EV-002, EV-003, EV-004 |
| T-006 Deploy to Vercel | deferred | FR-001 | T-005 |  |

## F-002 — Visual refresh and testimonials (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-007 Type system | done | FR-006 |  | EV-006, EV-007 |
| T-008 Reference-inspired motion | done | FR-007 | T-007 | EV-006, EV-007 |
| T-009 Testimonials and clinic naming | done | FR-008, FR-009 |  | EV-005, EV-006 |
| T-010 Verification | in_progress | FR-006, FR-007, FR-008, FR-009 | T-007, T-008, T-009 | EV-005, EV-006, EV-007 |

## F-003 — Intro, cursor, and scroll choreography (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-011 Opening sequence | done | FR-010 |  | EV-008, EV-009 |
| T-012 Pointer feedback | done | FR-011 |  | EV-008, EV-010 |
| T-013 Section choreography and layout fixes | done | FR-012, FR-013 | T-011 | EV-008, EV-010 |
| T-014 Verification | in_progress | FR-010, FR-011, FR-012, FR-013 | T-011, T-012, T-013 | EV-008, EV-009, EV-010 |
| T-015 Intro consistency | done | FR-010 | T-011 | EV-011 |
| T-016 Section spacing | done | FR-013 | T-013 | EV-011 |

## F-004 — Freelance-first copy, greeting intro, contact CTA (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-017 Freelance-first copy | done | FR-014 |  | EV-012 |
| T-018 Greeting intro | done | FR-015 |  | EV-013 |
| T-019 Contact CTA | done | FR-016 | T-017 | EV-012, EV-013 |
| T-020 Verification | in_progress | FR-014, FR-015, FR-016 | T-017, T-018, T-019 | EV-012, EV-013 |

## F-005 — Site identity and production deploy (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-021 Deploy to Vercel on sechanalfarisi.dev | done | FR-017 |  | EV-014 |
| T-022 Site icon and dev badge | done | FR-018 |  | EV-015, EV-016 |
| T-023 Canonical metadata | done | FR-019 | T-021 | EV-015, EV-016 |
| T-024 Verify on production after merge | planned | FR-017, FR-018, FR-019 | T-022, T-023 |  |

## F-007 — Stack marquee redesign (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-025 Editorial band and motion | done | FR-020, FR-021 |  | EV-017, EV-018 |
| T-026 Reduced-motion check | planned | FR-021 | T-025 |  |
