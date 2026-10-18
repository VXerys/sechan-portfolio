<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 0bb977dae142545c56b1ae99ae452056feeaff095fff1b20f1d0bd8c8e2243b0 -->

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

## F-006 — Testimonials with consent-aware attribution (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-027 Testimonial content model and view logic | review | FR-022, FR-023, FR-024, FR-026 |  | EV-019, EV-020 |
| T-028 Section and project quote | review | FR-022, FR-023, FR-024, FR-025 | T-027 | EV-020, EV-021 |
| T-029 Verification | review | FR-022, FR-023, FR-024, FR-025, FR-026 | T-027, T-028 | EV-019, EV-020, EV-021 |

## F-007 — Stack marquee redesign (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-025 Editorial band and motion | done | FR-020, FR-021 |  | EV-017, EV-018 |
| T-026 Reduced-motion check | planned | FR-021 | T-025 |  |

## F-008 — Content corrections: name, Mangcoding, project list (`implementing`, complete)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-027 Name and employer | done | FR-022, FR-023 |  | EV-019, EV-020 |
| T-028 Project list | done | FR-024 |  | EV-019, EV-020 |

## F-009 — Mobile polish, section indicator, motion set 2 (`implementing`, in_progress)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-030 Section indicator | done | FR-027 |  | EV-023, EV-024 |
| T-031 Touch experience | done | FR-028 |  | EV-024, EV-028 |
| T-032 Slice transition and pill buttons | done | FR-029 | T-030 | EV-023, EV-024 |
| T-033 Horizontal Proof, footer scale | done | FR-029 |  | EV-023, EV-024 |
| T-034 Verification | review | FR-027, FR-028, FR-029 | T-030, T-031, T-032, T-033 | EV-022, EV-023, EV-024, EV-028 |

## F-010 — Project listing images (`implementing`, blocked)

| Task | Status | Requirements | Depends on | Evidence |
|---|---|---|---|---|
| T-040 Listing kit | planned | FR-036 |  |  |
| T-041 Gunung Puyuh WebGIS listing | planned | FR-037 | T-040 |  |
| T-042 ArtConnect listing | planned | FR-037 | T-040 |  |
| T-043 Klinik Cikidang Medika listing | planned | FR-037 | T-040 |  |
| T-044 VisualKain Finance listing | planned | FR-037 | T-040 |  |
| T-045 InztaMoto ERP listing | planned | FR-037 | T-044 |  |
| T-046 BookMate listing | planned | FR-038 | T-040 |  |
| T-047 Welling and Ayah Hebat listing | blocked | FR-038 | T-040 |  |
| T-048 Site gallery and notice | planned | FR-039 | T-041 |  |
| T-049 Verification | planned | FR-036, FR-037, FR-038, FR-039 | T-042, T-043, T-045, T-046, T-048 |  |
| T-050 Marketiv listing | deferred | FR-037 | T-040 |  |
