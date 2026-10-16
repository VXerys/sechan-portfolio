---
id: F-001
title: "Portfolio site"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-001, FR-002, FR-003, FR-004, FR-005]
supersedes: null
---

# Design: Portfolio site

## Summary

One statically rendered route (`/`). `src/app/page.tsx` is a Server Component that reads typed content from `src/content/portfolio.ts` and passes it to section components. Sections that animate are leaf client components using `useGSAP`; Lenis runs once in a client provider and drives ScrollTrigger through the GSAP ticker.

Art direction: editorial dark. Ink `#0c0c0b`, paper `#efede6`, one accent lime `#d4ff3a` taken from Sehan's existing LinkedIn banner. Display type Archivo at a condensed width axis in caps, Instrument Serif italic for accents, JetBrains Mono for labels.

## Current state

Fresh `create-next-app` (Next.js 16.4, React 19.3, Tailwind v4) with the SDD v2.0.0 template applied. No existing UI.

## Component changes

| Component or path | Change | Responsibility after change |
|---|---|---|
| `src/content/portfolio.ts` | add | typed content mirrored from `about-me` |
| `src/content/portfolio.test.ts` | add | content invariants (BR-001, BR-002, AC-002) |
| `src/lib/motion/gsap.ts` | add | registers ScrollTrigger, SplitText, `useGSAP` once |
| `src/components/motion/smooth-scroll.tsx` | add | Lenis + ticker; skipped under reduced motion |
| `src/components/site/*` | add | header, cursor, footer |
| `src/components/sections/*` | add | hero, about, work, experience, capabilities, contact |
| `src/app/layout.tsx`, `globals.css` | replace | fonts, tokens, metadata |
| `src/assets/images/`, `src/content/media.ts` | add | portrait and project screenshots as static imports (see A-002) |

## Flow

```text
page.tsx (server) -> content/portfolio.ts -> sections (client leaves) -> useGSAP timelines -> ScrollTrigger <- Lenis scroll
```

## Data and state

- No store. Content is a compile-time constant. Image paths are optional per project; missing ones render `ProjectPlaceholder`.
- Motion state lives in GSAP contexts scoped to each section ref and is reverted on unmount.

## Error handling and security

| Failure | Detection | Handling | User or system result |
|---|---|---|---|
| JavaScript disabled | no hydration | initial CSS keeps content visible; reveal states are set by JS only | full text readable (AC-007) |
| Reduced motion | `gsap.matchMedia()` | animations not created; Lenis not started | static page (AC-006) |
| Missing screenshot | `image` undefined | placeholder | no broken image (AC-003) |

No user input, no secrets, no route handlers. External links use `rel="noopener noreferrer"`.

## Testing

| Requirement or risk | Test | Layer |
|---|---|---|
| AC-002, BR-001, BR-002 | `portfolio.test.ts`: unique slugs, featured first, no phone pattern, no banned hype words | unit |
| AC-001, AC-004, AC-005 | browser check at 360, 768, 1280 px | manual |
| AC-006 | browser check with reduced motion emulated | manual |

## Out of scope

- Project detail routes, i18n, dark/light toggle (site is dark by design).
