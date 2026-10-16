# Contributing

The first part applies to every project built from this template; `npm run init` fills the commands from the chosen presets. The second part applies to the template repository itself and is removed by `init`.

## Working in a project

### Pick the surface

Use conversational AI for product and documentation planning. Use a repository-integrated coding agent for repository inspection, context tooling, implementation, and verification. See `docs/documentation/AI_COLLABORATION_MODEL.md`.

### Delivery path

| Change | Required artifacts |
|---|---|
| New project | PRD, constitution, architecture baseline, roadmap, first feature spec |
| Feature | Requirements, design, tasks, verification (`full` tier adds system architecture) |
| Complex bug | Bug investigation from `docs/_templates/bug-investigation.md`, task, regression evidence |
| Internal refactor | Design-first specification and safety tests |
| Architecture change | ADR, architecture update, feature-design impact |
| Production hotfix | Minimal approved scope, regression evidence, documentation after stabilization |

### Before implementation

1. Read `docs/context/BRIEF.md`; choose one feature and task id.
2. Confirm requirements and design are approved.
3. Verify branch and worktree against `docs/handoff/current.md`; create a purpose-specific branch.
4. Run `npm run context:validate`.

### During implementation

- Keep the diff inside the selected task; discovered work becomes a new task in `tasks.md`.
- Add tests with behavior changes.
- Stop when an unapproved product, contract, security, or architecture decision appears; log unknowns in `docs/context/ASSUMPTIONS.md`.
- Record architecture decisions as ADRs; use versioned migrations for data store changes.
- Update task status in `tasks.md`, never in rendered views.

### Before a pull request

Run the project commands (from `docs/steering/tech.md`) and the context commands:

```bash
npx prettier --check .
npm run lint
npm test
npm run build
npm run context:render
npm run context:validate
```

Then update: evidence in the feature's `verification.md`; `tasks.md` status and evidence ids; `docs/handoff/current.md`; architecture or ADR artifacts when a contract changed. After a steering or `sdd.config.json` change, `npm run adapters:sync`.

### Pull request

The PR template asks for feature, task, and requirement ids; intended behavior and out-of-scope work; changed boundaries; verification evidence; migration and compatibility impact; context and documentation impact; remaining risks. Keep it a draft until the deterministic checks pass. A documentation change is reviewed against `docs/quality/review-checklist.md`.

### After merge

1. Update task status against the merged commit; run `npm run context:render`.
2. Archive the handoff with `npm run context:archive-handoff` when work continues later.
3. Update the roadmap or release state; never delete accepted specifications or ADRs.

