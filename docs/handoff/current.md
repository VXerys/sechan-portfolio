---
status: active
owner: "M Sechan Alfarisi"
session_date: "2026-10-19"
branch: "feat/F-010-listing-images"
base_commit: "0733e02"
current_commit: "9fd6752"
feature_id: "F-010"
task_id: "T-049"
expires_after: "2026-10-26"
---

# Session Handoff

## Session objective

F-010: Play Store style listing sets for every in-scope project, built from the real apps with invented data and never touching production or staging, plus a gallery on the site.

## Completed

- Listing kit in `scripts/listing/`: host allowlist guard (browser and Node side), strict Supabase stub, Firebase emulator helper (`demo-` ids only), compose templates with cover regions for sensitive values.
- Eight sets in `src/assets/images/listings/`: Klinik Cikidang Medika, VisualKain Finance, InztaMoto ERP, ArtConnect, Gunung Puyuh WebGIS, BookMate, Welling and Ayah Hebat. Marketiv deferred (landing page revamp).
- Gallery: covers replace posters (frames now 16:10), a screen strip in each case study and More work panel, sample-data notice.
- T-040 to T-049 `done` with EV-040 to EV-043; A-004 confirmed 2026-10-18. Repos cloned for the owner: `D:\Projects\accessibility-gap-analysis-webgis`, `D:\Projects\artconnect-crm`. Temporary client worktrees removed.

## Changed files

`scripts/listing/**`, `src/assets/images/listings/**`, `src/content/{listing-copy,listing-copy.test,listings,media}.ts`, `src/components/sections/{listing-strip,project-media,project-index}.tsx`, `package.json` (playwright-core dev dependency, kit scripts, kit tests in `npm test`), `.gitignore`, F-010 spec, `docs/context/ASSUMPTIONS.md`.

## Commands executed

`npm run lint`, `npm run typecheck`, `npm test` (73 pass), `npm run build`, every `listing:capture` and `listing:compose` run, `next start` with the in-app browser at 1280 and 375 px, `npm run context:render`, `npm run context:validate -- --strict`.

## Uncommitted work

None after the closing docs commit; not pushed.

## Blockers

- A-003 (testimonials) stays open; the owner holds the reviews.

## Exact next step

Owner approves pushing F-011 and F-010. Merge order: F-011 first (names the clinic), then F-010; F-008's renumber branch (`chore/F-008-renumber-ids`, unpushed) can go before or after. Each later merge re-runs `npm run context:render` and resolves the `_index.md` and rendered-view conflicts. Owner follow-ups: rotate the clinic's old staging keys (history commit e703484 in the clinic repo), update about-me 07:534 and 07:132.

## Do not do next

- Never run a client app with its real env, its `predev`, or `dev:prod`; never use VisualKain's `seed-data.ts`.
- Do not put a Tailwind `transition-transform` on an element GSAP animates.
- Do not commit placeholder testimonials.

## Validity

Valid until 2026-10-26 or the next commit.
