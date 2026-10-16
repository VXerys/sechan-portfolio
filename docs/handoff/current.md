---
status: active
owner: "M Sechan Alfarisi"
session_date: "2026-10-16"
branch: "fix/F-009-mobile-menu"
base_commit: "d1713ef"
current_commit: "d1713ef"
feature_id: "F-009"
task_id: "T-034"
expires_after: "2026-10-23"
---

# Session Handoff

## Session objective

BUG-001: on phones the menu links stopped half-masked after F-009 shipped (PR #9, merged). Fix it and record the evidence against F-009.

## Completed

- Root cause in `docs/quality/bugs/BUG-001-mobile-menu-links-stop-half-masked.md`: `transition-transform` on the menu links made GSAP's reveal read a mid-transition position as its end.
- Menu links and More work rows now transition `scale` only, pills `scale, border-color`. EV-028 in F-009 `verification.md`; T-031 and T-034 cite it.
- F-009 itself: T-030 to T-033 `done`, T-034 in `review`, EV-022 to EV-024 and EV-028. EV-025 to EV-027 are taken by F-008 on `chore/F-008-renumber-ids` (commit d91ca59, not pushed).

## Changed files

`src/components/site/header.tsx`, `src/components/motion/pill.tsx`, `src/components/sections/project-index.tsx`, F-009 `tasks.md` and `verification.md`, `docs/quality/bugs/BUG-001-*.md` (new), rendered context views.

## Commands executed

`npm run lint`, `npm run typecheck`, `npm test` (23 pass), `npm run build`, `npx next start -p 3004` + in-app browser at 375x812 against the fix and against production, `npm run context:render`, `npm run context:validate -- --strict`.

## Uncommitted work

None after the BUG-001 commit on `fix/F-009-mobile-menu`.

## Blockers

- A-001 (clinic naming) and A-003 (no quote collected yet) stay open; neither blocks the code.

## Exact next step

Owner merges the BUG-001 pull request and opens the menu on a phone. The F-008 id renumbering runs in its own session on `chore/F-008-renumber-ids`; whichever merges second re-runs `npm run context:render`. Then T-024's production favicon check.

## Do not do next

- Do not put a Tailwind `transition-transform` (or `transition-all`) on an element GSAP animates; transition the specific property instead.
- Do not kill tweens inside a `gsap.matchMedia` cleanup; `mm.revert()` restores the start values only for tweens it still owns.
- Do not commit placeholder or sample testimonials; the list stays empty until a real approval.
- Do not change DNS at name.com without reading the current records on Vercel's Domains page first.

## Validity

Valid until 2026-10-23 or the next commit.
