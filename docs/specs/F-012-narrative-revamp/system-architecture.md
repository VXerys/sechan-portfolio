---
id: F-012
title: "Narrative revamp: chapters, theme handoff, case-study beats"
type: system-architecture
status: verification
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-19
last_updated: 2026-10-19
last_verified: null
requirements: [FR-040, FR-041, FR-042, FR-043, FR-044]
supersedes: null
---

# System architecture: Narrative revamp

## Architecture drivers

- The palette has to change per chapter without WebGL or a new dependency (NFR-006), and without rewriting every component's colour classes.
- The page must stay readable with JavaScript off and under reduced motion (AC-072, AC-073).
- Lighthouse stays at 90 or above (NFR-005), so per-frame work during scroll has to stay small.

## Context and boundaries

```text
 sections (server components)            client motion layer
 ┌──────────────────────────────┐        ┌───────────────────────────────────────────┐
 │ <section data-chapter="02"     │──DOM──▶│ ThemeHandoff: one ScrollTrigger per chapter │
 │          data-theme="paper"    │        │  -> blends palette vars on <html>          │
 │          data-section-label>   │        │ useCurrentSection -> header chapter label  │
 └──────────────────────────────┘        │ CaseBeats: rail per featured case study    │
                                          └───────────────────────────────────────────┘
```

The colour tokens that components already use semantically (`ink` background, `paper` text, `muted`, `line`, `accent`, `ink-2` raised surface) become the theme's variables. Brand colours that must never change (intro, posters) move to `brand-*` tokens.

## Data and consistency

- Themes are a fixed map in `src/lib/motion/themes.ts`: ink, paper, lime, each with the six variables. There is no stored state; the palette is a pure function of scroll position.
- Without JavaScript, CSS scopes each theme to its chapter, so the page shows colour blocks. When the motion layer starts, it adds `html.theme-live`, which makes chapters transparent and lets the root variables carry the palette.

## Communication

DOM attributes only: `data-theme`, `data-chapter`, `data-section-label`, and `data-beat`. No context provider, no events beyond the existing `project:open`.

## Security

No new inputs, network calls, or secrets. The copy comes from the typed content files.

## Resilience

- If the motion layer fails, `theme-live` is never added and the CSS colour blocks remain.
- Jumps and accordion toggles call `ScrollTrigger.refresh()`, which already exists, so the blend recomputes from the new positions.

## Cost

The palette is written to six root custom properties, only while a blend window is active. Style recalculation runs on those frames only. There is no layout work.

## Alternatives and trade-offs

- A WebGL pixel shader, as Lama Lama uses: rejected for NFR-005 and NFR-006. Lama Lama itself falls back to a non-WebGL path.
- Renaming every colour class to new semantic tokens: rejected as churn. The existing tokens already carry the semantic meaning.
- CSS `@property` transitions on a class swap: rejected because they blend over time, not with scroll, which loses the cinematic link.
