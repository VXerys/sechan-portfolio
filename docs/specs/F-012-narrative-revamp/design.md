---
id: F-012
title: "Narrative revamp: chapters, theme handoff, case-study beats"
type: design
status: verification
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-19
last_updated: 2026-10-19
last_verified: null
requirements: [FR-040, FR-041, FR-042, FR-043, FR-044]
supersedes: null
---

# Design: Narrative revamp

## Summary

Chapters declare a theme, and one client component blends the root colour variables between themes as chapter edges scroll past (the Lama Lama pattern, observed with REA in its `colorTheme` and `backdrop_theme` modules, rebuilt without WebGL). The header's section indicator becomes a chapter label with reading progress. The page is reordered into an arc, case studies gain a Problem, Build, Proof rail, and effects that carried no meaning are removed.

## Current state

- One palette (ink with lime) everywhere except the Toolkit sheet, which hardcodes `bg-paper text-ink`.
- Order: hero, marquee band, About, Work, Experience, Capabilities, Testimonials, Contact.
- `Scramble` on labels, `DriftTitle` on section titles, and a custom cursor tuned for dark backgrounds.

## Component changes

| Path | Change | Covers |
|---|---|---|
| `src/app/globals.css` | `brand-*` tokens; scoped theme blocks for no-JS; `html.theme-live` makes chapters transparent | AC-073, AC-074 |
| `src/lib/motion/themes.ts` (new) | theme map (ink, paper, lime) and an interpolator | AC-071 |
| `src/components/motion/theme-handoff.tsx` (new) | ScrollTriggers per chapter edge, scrubbed blend, instant switch under reduced motion | AC-071, AC-072 |
| `src/components/site/section-indicator.tsx`, `header.tsx` | chapter label "Ch. NN · Name" and a progress percentage outside the live region | AC-075, AC-076 |
| `src/app/page.tsx` | new order and theme per chapter; the marquee band is removed from the sheet | AC-077 |
| `src/components/sections/thesis.tsx` (new, replaces `about.tsx`) | thesis line, proof line, manifesto, fact cards, inline stack line | AC-078, AC-082 |
| `src/components/sections/work.tsx` | each featured case study is its own themed sub-chapter; beat labels and the `CaseBeats` rail | AC-079, AC-080 |
| `src/components/motion/case-beats.tsx` (new) | sticky rail; beat highlight and fill driven by ScrollTrigger | AC-079 |
| `src/components/sections/experience.tsx`, `capabilities.tsx`, `proof-track.tsx`, `testimonials.tsx`, `contact.tsx` | chapter numbers, semantic tokens instead of hardcoded paper and ink, `Reveal` titles | AC-077, AC-081 |
| `src/components/site/cursor.tsx` | hidden while the active theme is not ink | AC-083 |

## Chapter map

| No. | Label | Theme | Content |
|---|---|---|---|
| hero | (none) | ink | unchanged hero |
| 01 | Why I build | paper | thesis, manifesto, facts, stack line |
| 02 | Selected work | ink, then each case study alternates paper and ink | BookMate, Marketiv, Cartify, Klinik Cikidang Medika |
| 03 | Archive | paper | More work index, files metaphor in its heading |
| 04 | Path | ink | Experience |
| 05 | Toolkit | paper | skills and proof |
| 06 | Kind words | ink | only when testimonials are approved |
| last | Let's build | lime | contact footer |

## Copy (BR-017)

- Thesis: "Small teams run on spreadsheets and group chats. I build the software that takes over." Spreadsheets come from the clinic and InztaMoto problems; chat apps come from ArtConnect.
- Proof line: "A clinic and a riding-gear brand moved off spreadsheets, a garment maker now sees its real cash, and a reading community runs on an app I helped ship to Google Play."

## UI behavior

- Blend window: a chapter's top moves from 85% to 35% of the viewport; there is one ScrollTrigger per edge, with `scrub: true`.
- Surfaces (`ink`, `ink-2`) blend with the scroll. Text tokens flip at once, at the point where the incoming text colour beats the outgoing one against the surface of that moment. Blending text too passed it through the surface's grey; a test keeps the worst contrast at 3:1 or above.
- The handoff reads progress from each edge's range and the live scroll position, so a long jump never leaves the palette one chapter behind.
- Rail: three beats with dots and labels; the fill height equals progress through the case study, and the active beat is the block crossing 50%.
- Mobile and reduced motion: the palette switches at 50% with no blend, and the rail is hidden.

## Data and state

There are no data changes. `profile.manifesto`, `about`, and the project facts are reused as they are.

## Performance and observability <!-- full-tier -->

The blend writes six custom properties on `<html>` per scrubbed frame, and only inside a window. All other motion uses transform and opacity. Lighthouse runs on the preview.

## Testing

- `npm test` covers `src/lib/motion/themes.test.ts`: the interpolator's endpoints, and the contrast of every theme pair at 4.5:1 or above.
- Lint, typecheck and build run as usual; the browser is checked at 360, 768 and 1280 px, with reduced motion and with JavaScript off.

## Alternatives considered <!-- full-tier -->

See `system-architecture.md`. In short: no WebGL, no class renaming, no time-based transitions.
