<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run context:render`.
Source: sdd.config.json, docs/steering/, docs/specs/F-*/, docs/context/ASSUMPTIONS.md, docs/handoff/current.md.
source_hash: 1c58c169a7a8b7eac9637f9bf42ec9f17b5e0eba9ec9fc6ac2d1f500fbe01940 -->

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

Check reduced motion and desktop hover effects in Chrome DevTools (Rendering > `prefers-reduced-motion: reduce`, width 1440), record EV-008 for AC-006 and AC-010, then set T-005 and T-010 to done.

## Other open tasks
- T-006 — Deploy to Vercel (`planned`)

## Features
| Feature | Status | Phase | Done/Total |
|---|---|---|---|
| F-001 Portfolio site | implementing | in_progress | 4/6 |
| F-002 Visual refresh and testimonials | implementing | in_progress | 3/4 |
