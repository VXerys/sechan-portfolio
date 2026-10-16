---
id: F-003
title: "Intro, cursor, and scroll choreography"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-010, FR-011, FR-012, FR-013]
supersedes: null
---

# Design: Intro, cursor, and scroll choreography

## Summary

Reference (auge-xp.com, observed 2026-10-16): light screen, wordmark, an italic word that scrambles before resolving, a small counter, a dark curtain with a curved edge rising, then lifting to the page. Ours: paper screen, "SECHAN" in the display face, an Instrument Serif word that morphs Mobile, Applied AI, Full-stack, then resolves to Alfarisi; a lime curtain with a curved lip rises, then the overlay lifts with a curved trailing edge onto the dark hero.

## Component changes

| Path | Change |
|---|---|
| `src/lib/motion/intro-state.ts` | `whenIntroDone`, `finishIntro`; hero waits on it |
| `src/components/motion/intro.tsx` | overlay on every load; name and labels animate in CSS from first paint; JS loading phase (morph, counter to 90) until fonts, `load`, and an idle callback settle, then wipe and lift |
| `src/components/motion/smooth-scroll.tsx` | `setScrollLocked` for the intro |
| `src/components/motion/magnetic.tsx`, `roll-text.tsx` | magnetic pull (GSAP), rolling label (CSS) |
| `src/components/site/cursor.tsx` | dot plus lagging ring; states: link, label, hidden |
| `src/components/site/header.tsx` | hide on scroll down; solid ink text when menu open; menu `text-[17vw]` |
| `src/components/sections/project-poster.tsx` | typographic poster for projects without a cleared screenshot |
| `src/components/sections/project-index.tsx` | floating preview that follows the pointer, tilts with velocity |
| `src/components/sections/*` | per-section effects listed in FR-012 |
| `src/app/page.tsx` | hero sticky; everything after it on one rounded ink sheet |

## Flow

```text
CSS name rise -> Intro mounts -> lock scroll -> loading morph until settled -> Alfarisi + 100 -> curtain -> lift -> finishIntro -> hero timeline -> unlock, lag smoothing off, refresh triggers
```

## Error handling

| Failure | Handling |
|---|---|
| Intro throws or stalls | 10 s safety timer hides the overlay and calls `finishIntro` |
| JS never runs | overlay is `display: none` unless `html.js`; boot script removes `js` after 6 s if the intro never started |
| Reduced motion | overlay hidden by CSS; `finishIntro` runs at mount |

## Testing

| Requirement | Check | Layer |
|---|---|---|
| AC-014 to AC-016 | browser: first load, reload, reduced motion | manual |
| AC-017, AC-018 | browser at 1440 px | manual |
| AC-019 to AC-021 | browser at 1440 and 375 px | manual |
| regressions | `npm test`, lint, typecheck, build | automated |
