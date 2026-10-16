---
id: F-007
title: "Stack marquee redesign"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-020, FR-021]
supersedes: null
---

# Design: Stack marquee redesign

## Summary

Only `src/components/sections/marquee.tsx` changes, so this lands without touching files another session is editing in parallel (F-006: `page.tsx`, `work.tsx`, `project-index.tsx`, content, testimonials).

| Before | After |
|---|---|
| two rows (solid + outline), 9vw / 5.5vw caps | one row, 9vw mobile / 3.6vw desktop |
| lime serif `&` separators | lime six-spoke asterisk (the favicon mark) |
| every item in display caps | alternating display caps and Instrument Serif italics |
| skew on scroll velocity | no skew; separators spin with the scroll instead |
| hard viewport cut | `mask-image` fade at both edges |
| no label | fixed label column: "Stack I ship with", tool count |
| hover pauses CSS animation | hover slows GSAP `timeScale` to 0.25; hovered word turns lime |

## Motion

One GSAP loop (`xPercent` 0 to -50 over a duplicated row) and one spin tween for the marks share `timeScale`: scroll velocity boosts both up to 5x in the scroll direction, then they ease back to 1x (0.25x while hovered). Everything sits inside `gsap.matchMedia(MOTION_OK)`, so reduced motion leaves a static row.

## Testing

| Requirement | Check | Layer |
|---|---|---|
| AC-030 | browser at 1440 and 375 px, `scrollWidth == clientWidth` | manual |
| AC-031 | browser scroll and hover | manual |
| AC-032 | DevTools reduced-motion emulation | manual |
| regressions | lint, typecheck, test, build | automated |
