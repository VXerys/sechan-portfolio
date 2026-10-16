---
inclusion: always          # always | fileMatch | manual
---

# Structure

Where things live and which direction dependencies point. Document only what an agent cannot infer by listing the tree.

## Directory responsibilities

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

## Generated paths

Never hand-edit. Listed in `sdd.config.json` under `generated`:

- `docs/context/state.yaml`
- `docs/context/PROJECT_STATE.md`
- `docs/context/PROGRESS.md`
- `docs/context/BRIEF.md`
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, `.github/instructions/`, `.kiro/steering/` (only the tools in `sdd.config.json` are written)
- Project-specific generated code (example: `*.g.dart`, `*.freezed.dart`, generated API clients): none

## Frozen paths

Listed in `sdd.config.json` under `frozen`. Edits need explicit owner approval and an ADR when the freeze is architectural.

- none

## Dependency direction

```text
ui -> application -> domain <- data
```

- Inner layers never import outer layers.
- Framework and provider SDKs stay behind a project-owned boundary.
- Project-specific rule: none

## Naming

- Features: `F-001-short-name`. Tasks: `T-001`. Evidence: `EV-001`. Assumptions: `A-001`. ADRs: `ADR-0001-short-name.md`.
- Code naming follows the language's standard style guide unless `docs/steering/rules.md` says otherwise.
