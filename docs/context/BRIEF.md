<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 1e1cb7329bf7383b348cc6fce9e5654db84d14fbe1935a900eed77eb9033440c -->

# Brief

Sechan Portfolio is a motion-led personal website that shows recruiters and clients M Sechan Alfarisi's mobile and applied-AI work, with verified project evidence and a direct contact path.

Project `Sechan Portfolio`, tier `lite`. Rendered from sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.

## Active
Feature F-001 — Portfolio site (`implementing`, docs/specs/F-001-portfolio-site/)
Task T-005 — Verification and handoff (`in_progress`); requirements: FR-001, FR-002, FR-003, FR-004, FR-005; depends on: T-003, T-004

Lint, typecheck, test, build, browser check at 360, 768, 1280 px and with reduced motion; `verification.md` and handoff updated.

Acceptance criteria:
- AC-001: Given a 360 px or 1280 px viewport, when the home page loads, then name, role, and headline are visible without scrolling.
- AC-002: Given the content file, when the page renders, then every project appears once, featured projects first.
- AC-003: Given a project without a screenshot, when it renders, then a labelled placeholder appears instead of a broken image.
- AC-004: Given the content file, when the page renders, then each experience entry, skill group, and achievement is shown.
- AC-005: Given any section, when the visitor opens the menu or scrolls to the end, then the contact links are reachable and open the right target.
- AC-006: Given reduced motion, when the page loads, then all content is visible with no smooth scroll and no pinned or scrubbed animation.
- AC-007: Given JavaScript disabled, when the page loads, then all text content is readable.

## Rules
Stop conditions:

Stop and report, instead of implementing, when the task would require any prohibited action above, when two sources of truth conflict, when a blocking assumption is open, or when a required command is unavailable.

Prohibited without explicit owner approval:

- Changing a public API, event, or data contract.
- Destructive data operations: drop, mass delete, reset, backfill with unknown impact, editing an applied migration.
- Replacing a major framework, provider, or dependency; adding a dependency outside the policy in `tech.md`.
- Breaking an architecture boundary or dependency direction.
- Changing production infrastructure, credentials, or configuration.
- Bypassing authentication or authorization.
- Force push, history rewrite, or any git operation that can destroy work.
- Editing a generated or frozen path.
- Publishing, deploying, or sending messages on the owner's behalf.

## Read-only paths
Generated: `docs/context/state.yaml`, `docs/context/PROJECT_STATE.md`, `docs/context/PROGRESS.md`, `docs/context/BRIEF.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, `.github/instructions/`, `.kiro/steering/`
Frozen: none

## Open assumptions
- A-001 — Client names may appear on the public site (F-001)

## Handoff
Next step:

Owner merges the BUG-001 pull request and opens the menu on a phone. The F-008 id renumbering runs in its own session on `chore/F-008-renumber-ids`; whichever merges second re-runs `npm run context:render`. Then T-024's production favicon check.

## Other open tasks
None.

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Portfolio site | implementing | in_progress | 4/6 |
| F-002 Visual refresh and testimonials | implementing | in_progress | 3/4 |
| F-003 Intro, cursor, and scroll choreography | implementing | in_progress | 5/6 |
| F-004 Freelance-first copy, greeting intro, contact CTA | implementing | in_progress | 3/4 |
| F-005 Site identity and production deploy | implementing | in_progress | 3/4 |
| F-006 Testimonials with consent-aware attribution | implementing | in_progress | 0/3 |
| F-007 Stack marquee redesign | implementing | in_progress | 1/2 |
| F-008 Content corrections: name, Mangcoding, project list | implementing | complete | 2/2 |
| F-009 Mobile polish, section indicator, motion set 2 | implementing | in_progress | 4/5 |
