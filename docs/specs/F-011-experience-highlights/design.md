---
id: F-011
title: "Experience highlights and clinic naming"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
requirements: [FR-033, FR-034, FR-035]
supersedes: null
---

# Design: Experience highlights and clinic naming

## Summary

Two new typed content blocks (`program`, `education`) render around the existing Experience rows: the Asah card above them, the education row after them. Project chips are small client links that reuse `jumpTo` and ask More work to open a row through a window event, so neither section imports the other's state.

## Current state

- `Experience = { company; legalName?; role; period; points }` in `src/content/portfolio.ts`; three entries (Marketiv, Mangcoding, Freelance). `experience.tsx` renders them as `LineRows` with a hover fill.
- Asah is an `achievements` entry shown in Proof; it stays there as the certificate line.
- Case-study articles and More work rows have no element ids; `project-index.tsx` keeps `openSlug` in state.
- `portfolio.test.ts` and `testimonials.test.ts` both assert the text never contains "cikidang".

## Component changes

| Path | Change |
|---|---|
| `src/content/portfolio.ts` | `Program` type and `program` (Asah); `Education` type and `education` (Nusa Putra, GPA, project slugs with context); clinic `client` and the freelance point use "Klinik Cikidang Medika" |
| `src/content/portfolio.test.ts` | replace the anonymity test with "clinic is named as approved (A-001)"; education slugs exist in `projects`; program fields are filled |
| `src/content/testimonials.test.ts` | drop the "cikidang" assertion, keep the phone-number check |
| `src/components/sections/experience.tsx` | highlight card before `LineRows` (lime "Highlight" label, display type, period and status); education row after the work rows, same anatomy as a work row |
| `src/components/site/project-chip.tsx` (new) | client link: dispatches `project:open` with the slug first, so the row is open before the slices uncover it, then calls `jumpTo('#<slug>')` |
| `src/components/sections/work.tsx` | `id={project.slug}` on each case-study article |
| `src/components/sections/project-index.tsx` | `id={project.slug}` on each row; listens for `project:open` and sets `openSlug` |
| `docs/context/ASSUMPTIONS.md` | A-001 confirmed (owner, 2026-10-17) |

## UI behavior

- The card spans the full width with the `bg-ink-2` surface and a lime label; on phones it stacks: label, program, path and role, period and status.
- Chips use the `label` style with a border, wrap on small screens, and show the context in `text-muted` after the name.
- Reduced motion: chips jump without the slice transition (existing `jumpTo` fallback); the card uses the existing clip `Reveal` (as the About facts do), which is skipped under reduced motion.

## Testing

| Requirement | Check | Layer |
|---|---|---|
| AC-054 to AC-057, AC-059, AC-060 | `npm test` plus built HTML grep | unit |
| AC-058 | browser at 360, 768, 1280 px: each chip lands on the right project, More work rows open | manual |
| regressions | lint, typecheck, build; no horizontal overflow at 360 px | automated and manual |
