---
id: F-002
title: "Visual refresh and testimonials"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-006, FR-007, FR-008, FR-009]
supersedes: null
---

# Design: Visual refresh and testimonials

## Summary

Reference study (2026-10-16, in-app browser): ownitt.fr pairs a heavy condensed caps face with a high-contrast display serif and fills manifesto text on scroll under a large rotating glyph; auge-xp.com scrambles labels and runs project media with scroll; jlern.com tags each project cell with its year in a corner; shelbykho.com labels hovered objects like stickers. We keep F-001's dark editorial identity and adapt those ideas with our own type, copy, and code.

## Type

| Role | Face | Notes |
|---|---|---|
| Display | Archivo, `wdth` 62, weight 800 | tracking -0.02em |
| Body and UI | Host Grotesk | replaces Archivo normal width for paragraphs |
| Statement and accent | Instrument Serif | upright at display size, italic accents in lime |
| Labels | JetBrains Mono | unchanged |

## Component changes

| Component or path | Change |
|---|---|
| `src/app/layout.tsx`, `globals.css` | load Host Grotesk; tokens `--font-sans`, `--font-display`, `.statement` |
| `src/lib/motion/gsap.ts` | register ScrambleTextPlugin |
| `src/components/motion/scramble.tsx` | label that scrambles in on view and on hover |
| `src/components/sections/about.tsx` | serif manifesto with lime italic tail, scroll-rotated ✳ glyph |
| `src/components/sections/marquee.tsx` | GSAP loop whose speed and direction follow scroll velocity |
| `src/components/site/cursor.tsx` | text label from `data-cursor-label` |
| `src/components/sections/project-media.tsx` | year tag in the corner, cursor label |
| `src/components/sections/testimonials.tsx` | new; returns `null` when list is empty |
| `src/content/portfolio.ts` | `Testimonial` type, empty list, clinic unnamed |

## Error handling and security

Scrambled text keeps the real string in the DOM and `aria-label`; reduced motion skips scramble, rotation, and velocity. No user input is added.

## Testing

| Requirement | Test | Layer |
|---|---|---|
| AC-012, AC-013 | `portfolio.test.ts` | unit |
| AC-008, AC-009 | browser check | manual |
| AC-010 | DevTools reduced-motion emulation | manual |
