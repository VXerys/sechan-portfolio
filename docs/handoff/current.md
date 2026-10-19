---
status: active
owner: "M Sechan Alfarisi"
session_date: "2026-10-19"
branch: "feat/F-011-experience-highlights"
base_commit: "8b24980"
current_commit: "8b24980"
feature_id: "F-011"
task_id: "T-039"
expires_after: "2026-10-26"
---

# Session Handoff

## Session objective

Land F-011 (Asah highlight, Universitas Nusa Putra row with projects built while studying, Klinik Cikidang Medika named) on top of F-010, which merged first (PR #12).

## Completed

- F-010 merged into `main` (8b24980): listing kit, eight listing sets, site gallery; EV-040 to EV-043.
- F-011: T-037 to T-039 `done` with EV-029 to EV-031; `main` merged into the branch and the conflicts resolved (rendered views re-rendered, both `_index.md` rows kept, `project-index.tsx` keeps the F-011 chip listener and anchors plus the F-010 strip and preview guard).
- A-001 and A-004 confirmed.

## Changed files

Merge resolution only: `docs/context/ASSUMPTIONS.md`, `docs/specs/_index.md`, `docs/handoff/current.md`, `src/components/sections/project-index.tsx`, rendered `docs/context/*`.

## Commands executed

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run context:render`, `npm run context:validate -- --strict` on the merged branch.

## Uncommitted work

None after the merge commit.

## Blockers

- A-003 (testimonials) stays open; the owner holds the reviews.

## Exact next step

Owner merges PR #11. Owner follow-ups: rotate the clinic's old staging keys (history commit e703484 in the clinic repo); update about-me 07:534 (clinic permission) and 07:132 (ArtConnect course name); push or close `chore/F-008-renumber-ids` (unpushed, ids FR-030..032, AC-051..053, T-035..036, EV-025..027).

## Do not do next

- Never run a client app with its real env, its `predev`, or `dev:prod`; never use VisualKain's `seed-data.ts`.
- Do not put a Tailwind `transition-transform` on an element GSAP animates.
- Do not add the Asah capstone partner before about-me records it as VERIFIED.
- Do not commit placeholder testimonials.

## Validity

Valid until 2026-10-26 or the next commit.
