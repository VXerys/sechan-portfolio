<!-- GENERATED FILE — DO NOT EDIT. Rendered by `npm run adapters:sync`.
Source: docs/steering/, sdd.config.json.
source_hash: bd654077804f380be3dbb8266e7775cafb9020a16f847125c857a0c31aa6ec74 -->

# Repository contract: Sechan Portfolio

Sechan Portfolio is a motion-led personal website that shows recruiters and clients M Sechan Alfarisi's mobile and applied-AI work, with verified project evidence and a direct contact path.

Rendered from `docs/steering/` and `sdd.config.json` for humans and coding agents. Edit the steering files, then run `npm run adapters:sync`.

## Read first

1. `docs/context/BRIEF.md` (single entry point; rendered, never hand-edited)
2. `docs/steering/rules.md`, `docs/steering/tech.md`, `docs/steering/structure.md`, `docs/steering/workflow.md`, `docs/steering/product.md`
3. The active feature under `docs/specs/`: `tasks.md`, then the sections it references

Fallback when `BRIEF.md` is absent: `docs/context/NEW_CHAT_PROTOCOL.md`.

## Source of truth

| Question | Source |
|---|---|
| Product intent | `docs/steering/product.md`, `docs/product/prd.md` |
| Stack and commands | `docs/steering/tech.md` |
| Directory and dependency rules | `docs/steering/structure.md` |
| Engineering and security rules | `docs/steering/rules.md` |
| Lifecycle and status vocabulary | `docs/steering/workflow.md` |
| Shared architecture | `docs/architecture/` |
| Decisions | `docs/adr/` |
| Feature behavior, design, tasks, evidence | `docs/specs/F-XXX-name/` |
| Task status | `docs/specs/F-XXX-name/tasks.md` (master) |
| Unknowns | `docs/context/ASSUMPTIONS.md` |
| Session delta | `docs/handoff/current.md` |
| Current behavior | code, tests, schema, configuration |

Chat history and provider memory are never a source of truth.

## Read-only paths

Generated (edit the sources, then run `npm run context:render` or `npm run adapters:sync`): `docs/context/state.yaml`, `docs/context/PROJECT_STATE.md`, `docs/context/PROGRESS.md`, `docs/context/BRIEF.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, `.github/instructions/`, `.kiro/steering/`

Frozen (explicit owner approval required): none

## Rules

Engineering rules every agent and contributor applies. The principles behind them are in the project constitution; the lifecycle is in `workflow.md`.

### Engineering

- Follow existing project patterns before introducing a new abstraction.
- Keep the change inside the selected task. Discovered work becomes a new task in `tasks.md`, not a silent extension.
- Inspect the repository before asserting a path, API, schema field, command, or framework behavior. Never invent one.
- Preserve existing behavior and contracts unless the referenced spec changes them.
- Add or update tests for changed behavior. Never weaken or disable a test to make a check pass.
- Comments explain why, not what. No decorative banners or separator comments.
- Treat generated and frozen paths from `sdd.config.json` as read-only.

### Evidence before claims

- "Done" means: analyze, typecheck, test, and build commands from `tech.md` ran, and their output is recorded as EV blocks in the feature's `verification.md`.
- A check that could not run is reported with the reason and residual risk. It is never reported as passed.
- A task reaches `done` only with at least one evidence id. A feature reaches `implemented` only with every task `done` or `deferred` and no `open` assumption.

### Unknowns

Log an unknown in `docs/context/ASSUMPTIONS.md` as `A-XXX` with `status: open` instead of guessing. Continue only on work the assumption does not affect; mark the affected task `blocked`.

### Prohibited without explicit owner approval

- Changing a public API, event, or data contract.
- Destructive data operations: drop, mass delete, reset, backfill with unknown impact, editing an applied migration.
- Replacing a major framework, provider, or dependency; adding a dependency outside the policy in `tech.md`.
- Breaking an architecture boundary or dependency direction.
- Changing production infrastructure, credentials, or configuration.
- Bypassing authentication or authorization.
- Force push, history rewrite, or any git operation that can destroy work.
- Editing a generated or frozen path.
- Publishing, deploying, or sending messages on the owner's behalf.

### Stop conditions

Stop and report, instead of implementing, when the task would require any prohibited action above, when two sources of truth conflict, when a blocking assumption is open, or when a required command is unavailable.

### Data and security

- No secrets in the repository. Never read, print, or commit `.env*`, key files, keystores, or store credentials.
- Authorization is enforced at a trusted boundary; hiding UI is not authorization.
- Validate untrusted input at the boundary. Do not log secrets, tokens, auth headers, or unnecessary personal data.
- Data store changes are versioned, append-only, reviewed, and reversible or explicitly accepted as forward-only.
- Project-specific rule: none

### Source of truth and conflicts

Requirements own behavior, system architecture owns module decisions, design owns the repository mapping, `tasks.md` owns task status, code and tests own current behavior, `tech.md` owns commands. Chat history and provider memory are never a source of truth.

When sources conflict: stop the affected work, name both sources, inspect code and git, propose the smallest correction, get approval for product, architecture, security, or data changes, update the canonical source, then continue.

## Tech

Stack and commands. `npm run init` fills every `PRESET_` placeholder from the chosen app and database presets (`scripts/init/presets/`); everything else is filled from the real repository. A command listed here must exist and run.

### Stack

| Concern | Technology | Reason or constraint |
|---|---|---|
| Language and runtime | TypeScript 5 on Node 22+ (developed on Node 24) | |
| Application framework | Next.js 16.4 (App Router, Turbopack), React 19.3 | static content site; no route handlers |
| Styling | Tailwind CSS v4 (`@tailwindcss/turbopack`) | design tokens in `src/app/globals.css` |
| Motion | GSAP 3 + `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText | one animation engine; no Framer Motion alongside it |
| Smooth scroll | Lenis, driven by the GSAP ticker | one scroll engine; disabled under `prefers-reduced-motion` |
| Data store | none | portfolio content is typed data in `src/content/` |
| Test framework | Node test runner with type stripping (`node --test`) | content invariants; no browser test runner yet |
| Deployment target | Vercel (not yet configured) | |
| Source and test paths | `src/**`, `public/**` | globs used by `fileMatch` steering rules |

### Commands

Run these before claiming any task done. Report a command that cannot run; never claim its success. `none` means the preset has no command for that purpose; replace it when the project gains one.

| Purpose | Command |
|---|---|
| Install | `npm ci` |
| Analyze or lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Format check | `none` |
| Test | `npm test` |
| Build | `npm run build` |
| Run locally | `npm run dev` |
| Data store change check | `none` |
| Context validation | `npm run context:validate` |

### Stack rules

- Server Components by default; client components opt in with `'use client'` and stay leaf-sized.
- Secrets are read in server code only; a variable reaches the browser only with the `NEXT_PUBLIC_` prefix.
- Route handlers validate every request body at the boundary and return typed errors.
- `npm run typecheck` at 0 errors and `npm run lint` clean before a task is done.
- Next.js 16 differs from older versions; read the matching guide in `node_modules/next/dist/docs/` before using an unfamiliar API. `agentRules: false` in `next.config.ts` stops `next dev` from appending its own block to the rendered `AGENTS.md`.
- Every GSAP animation lives in a client component inside `useGSAP` (scoped, auto-reverted). Register plugins once in `src/lib/motion/`.
- Every animation has a `prefers-reduced-motion` path built with `gsap.matchMedia()`; content is readable with JavaScript disabled.
- Animate `transform` and `opacity` only; no layout properties in scroll-linked tweens.

### Environment and secrets

- Secrets come from the environment or a secret manager; `.env*`, key files, and store credentials are never read, printed, or committed by an agent.
- Example-config files (`.env.example` or equivalent) document required variables without values.

### Dependency policy

Before adding or replacing a dependency, state the problem it solves, the native alternative considered, maintenance health, runtime or bundle impact, and license. Approval rule: the owner approves every new or replaced dependency; record the approval in the task that adds it.

### Data store changes

Schema, rules, index, or migration changes are versioned files in the repository, reviewed like code. Append-only; destructive changes need explicit approval. The store's own rules are in the `database.md` steering file when a database preset was chosen.

## Structure

Where things live and which direction dependencies point. Document only what an agent cannot infer by listing the tree.

### Directory responsibilities

| Path | Responsibility | Rule |
|---|---|---|
| `docs/steering/` | canonical project rules, product, stack, structure, workflow | edit by hand; `AGENTS.md` and tool adapters are rendered from it by `npm run adapters:sync` |
| `docs/specs/F-XXX-name/` | one feature: requirements, system-architecture, design, tasks, verification | `tasks.md` is the master for task status |
| `docs/adr/` | one decision per record | approved ADRs are never rewritten |
| `docs/architecture/` | cross-feature boundaries and invariants | module reasoning stays in the feature |
| `docs/context/` | rendered state, brief, assumptions log | only `ASSUMPTIONS.md` is hand-edited |
| `docs/handoff/current.md` | session delta | updated at the end of every implementation session |
| `src/app/` | routes, layouts, route handlers | Server Components by default; `'use client'` only where state or browser APIs are needed |
| `src/components/` | shared UI components | no data fetching; props in, markup out |
| `src/lib/` | domain logic, data access, service facades | framework-free; the only place that talks to the data store |
| `public/` | static assets | no generated files committed |
| `src/**/*.test.ts` | tests next to the code they cover | mirrors the source layout |

### Generated paths

Never hand-edit. Listed in `sdd.config.json` under `generated`:

- `docs/context/state.yaml`
- `docs/context/PROJECT_STATE.md`
- `docs/context/PROGRESS.md`
- `docs/context/BRIEF.md`
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, `.github/instructions/`, `.kiro/steering/` (only the tools in `sdd.config.json` are written)
- Project-specific generated code (example: `*.g.dart`, `*.freezed.dart`, generated API clients): none

### Frozen paths

Listed in `sdd.config.json` under `frozen`. Edits need explicit owner approval and an ADR when the freeze is architectural.

- none

### Dependency direction

```text
ui -> application -> domain <- data
```

- Inner layers never import outer layers.
- Framework and provider SDKs stay behind a project-owned boundary.
- Project-specific rule: none

### Naming

- Features: `F-001-short-name`. Tasks: `T-001`. Evidence: `EV-001`. Assumptions: `A-001`. ADRs: `ADR-0001-short-name.md`.
- Code naming follows the language's standard style guide unless `docs/steering/rules.md` says otherwise.

## Workflow

The spec-driven lifecycle from session start to handoff.

### Start a session

1. Read `docs/context/BRIEF.md`. It is the single entry point: active feature and task, open assumptions, blockers, next action.
2. If `BRIEF.md` is absent or stale, read in this order: `docs/steering/*.md`, `docs/handoff/current.md`, the active feature's `tasks.md`, then its `requirements.md` and `design.md`.
3. Confirm branch and worktree match the handoff before editing anything.

### Pick a task

- Take the task the brief names, or the first `planned` task whose `depends_on` are all `done`.
- Read only the FR ids, design sections, and architecture sections the task references, plus the code it touches.
- Set `status: in_progress` in `tasks.md`. One task in progress per session. In Claude Code, `/sdd:task T-XXX` builds the task prompt from the brief and the spec and follows it.

### Status transitions

```text
planned -> in_progress -> review -> done
                |            |
                v            v
             blocked      deferred
```

- `blocked`: an unresolved decision or assumption; log it in `ASSUMPTIONS.md` and stop the task.
- `review`: implementation complete, evidence recorded, awaiting review.
- `done`: reviewed, with at least one `EV-XXX` id in `evidence`.
- `deferred`: removed from current scope with a reason; never deleted.

Feature status in frontmatter: `draft -> review -> approved -> implementing -> verification -> implemented`, or `superseded`. A feature becomes `implemented` only when every task is `done` or `deferred` and no assumption is `open`.

### Evidence

Every check runs through the commands in `tech.md` and is recorded as an EV block in `verification.md` with command, output excerpt, date, commit, and the AC ids it covers. Claims without evidence are not accepted at review.

### Close a session

1. Review `git diff` and `git status`.
2. Run the commands in `tech.md`; record evidence.
3. Update task status in `tasks.md`; run `npm run context:render`, then `npm run context:validate`. After a steering or `sdd.config.json` change, also `npm run adapters:sync`.
4. Update `docs/handoff/current.md`: objective, changed files, commands and results, uncommitted work, blockers, exact next step. In Claude Code, `/sdd:handoff` writes it and runs render and validate; `/sdd:review`, `/sdd:bug`, and `/sdd:render` fill the review template, open a bug file, and run the three context commands.
5. Report the next task.

### When to write an ADR

Write one in `docs/adr/` from `docs/_templates/adr.md` when a decision is expensive to reverse, changes a boundary or trust model, introduces or replaces a framework, provider, store, or major dependency, changes a public contract, or will be questioned later. One decision per ADR; supersede, never rewrite.

### Tiers

`lite` is the default: requirements, design, tasks, verification, each within 80 lines. `full` adds `system-architecture.md` and the sections marked `<!-- full-tier -->`, within 200 lines (300 for system architecture). Choose `full` when the feature has shared state, realtime or async communication, external integration, a security boundary, or material scale or cost.

## Product

Short, always-loaded product context. The full product requirements live in `docs/product/prd.md`; this file must agree with it and stays under 120 lines.

### Vision

Sechan Portfolio is a motion-led personal website that shows recruiters and clients M Sechan Alfarisi's mobile and applied-AI work, with verified project evidence and a direct contact path.

Sehan shares it with clients, recruiters, and anyone else he meets. Availability is freelance first, then full-time roles, then 3 to 6 month internships (owner decision, 2026-10-16), under the positioning "Full-Stack Mobile Software Engineer & Applied AI Engineer". "Working" means a visitor understands what he builds within the hero, opens at least one project, and can start a conversation without hunting. Project content (specs, product docs, UI copy) is written in English; the framework text stays English.

### Personas

- Prospective client: a business owner who wants proof of delivered apps and a quick way to start a project.
- Recruiter: screens many candidates, spends under two minutes, scans for role fit, shipped work, and a contact link.
- Engineering reviewer: opens projects to judge scope, stack, and what Sehan personally built.

### Core use cases

- UC-001: A recruiter lands on the home page and reads the positioning, role, and availability in the hero.
- UC-002: A reviewer scrolls the selected work and reads a project's problem, contribution, stack, and verified outcomes.
- UC-003: A visitor reaches the contact section and opens a prefilled email draft, copies the address, or opens LinkedIn or GitHub.

### Non-goals

- No CMS, blog, admin panel, or database in the first milestone.
- No contact form or message backend; email (prefilled draft plus copy) is the contact path. See F-004 design for when a form is worth it.
- No metrics or claims that are not labelled VERIFIED in the `about-me` knowledge base.

### Success signals

| Signal | What it tells us | Source |
|---|---|---|
| Lighthouse performance and accessibility at 90 or above on the home page | motion does not cost usability | Lighthouse run, recorded as evidence |
| Reviewer can name Sehan's role after the hero | positioning lands | manual review |

### Constraints that shape product decisions

- Content source of truth is `D:\Projects\about-me` (VERIFIED facts only); `src/content/` mirrors it and is updated from there, not invented.
- No private data: phone, student ID, private emails, client data, or client screenshots without permission.
- Every animation has a reduced-motion path; the site works at 360, 768, and 1280 px widths.

## Commands

Project commands: the Commands table in `docs/steering/tech.md` (the Tech section above). Context: `npm run context:render`, then `npm run context:validate`. Adapters: `npm run adapters:sync`.
