---
id: F-009
title: "Mobile polish, section indicator, motion set 2"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-027, FR-028, FR-029]
supersedes: null
---

# Design: Mobile polish, section indicator, motion set 2

## Component changes

| Path | Change |
|---|---|
| `src/components/site/header.tsx` | nav in page order (About, Work, Experience, Contact); `SectionIndicator`; links go through `jumpTo` |
| `src/components/site/section-indicator.tsx` | ScrollTrigger per `[data-section]`; scrambled "02 Work" label; active nav state |
| `src/components/motion/slice-transition.tsx` | fixed overlay of five bars; `jumpTo(target)` covers, jumps with Lenis `immediate`, uncovers |
| `src/components/motion/pill.tsx` | `PillLink` and `PillButton`: lime fill clipped from the entry point and drained toward the exit point, plus a three-dot trail (GSAP quickTo); touch and keyboard get a CSS fill instead |
| `src/components/sections/project-index.tsx` | panel shows `ProjectMedia`-style visual below 768 px; `active:` feedback |
| `src/components/sections/proof-track.tsx` | Proof becomes a pinned horizontal track at 1024 px and up; `matchMedia` revert restores the grid when the screen narrows |
| `src/components/sections/contact.tsx` | scroll-linked scale on the title; copy email and LinkedIn as pills; the footer parallax runs only at 768 px and up (on phones the tall footer kept its title under the sheet) |
| `src/components/sections/hero.tsx` | hero CTAs as pill buttons |
| sections | `data-section` and `data-section-label` attributes; Capabilities gets `id="capabilities"` |

## Performance guards

- The horizontal Proof pin uses one ScrollTrigger with `invalidateOnRefresh`; under 1024 px no pin is created.
- Slice bars animate `transform` only.

## Testing

| Requirement | Check | Layer |
|---|---|---|
| AC-041 to AC-045, AC-047, AC-048, AC-050 | browser at 1440 and 375 px | manual |
| AC-049 | every effect inside `gsap.matchMedia(MOTION_OK)`; code review plus DevTools emulation | manual |
| regressions | lint, typecheck, test, build | automated |
