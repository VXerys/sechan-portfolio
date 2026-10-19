---
id: F-012
title: "Narrative revamp: chapters, theme handoff, case-study beats"
type: requirements
status: verification
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-19
last_updated: 2026-10-19
last_verified: null
supersedes: null
---

# Requirements: Narrative revamp

## Problem

The page reads like a résumé in order (about, work, experience, skills) on one dark palette. Nothing ties the sections into a story, long stretches look the same, and several effects (scramble, drifting titles, a standalone marquee) move without saying anything. The owner asked for cinematic scroll storytelling that is not only dark mode, using Awwwards references (Lama Lama primary, Rauno for restraint, Wildy Riftian for the archive).

## Goal

A visitor scrolls through a story in chapters: why Sehan builds, the work as chapters that unfold problem, build, proof, the wider archive, his path, and a closing call. The palette hands over between ink, paper, and lime as chapters change, and the header always says which chapter they are in.

## Non-goals

- New content or claims beyond what `src/content/` already holds (BR-001).
- WebGL, Three.js, or a page-transition router.
- Merging into `main` (BR-018).

## Actors

- Prospective client, recruiter, engineering reviewer (unchanged from the PRD).

## Functional requirements

### FR-040 — Chapter theme handoff

- AC-071: Given chapters marked `data-theme` ink, paper, or lime, when a chapter's top travels from 85% to 35% of the viewport, then the page palette blends from the previous chapter's theme to its own, following the scroll.
- AC-072: Given reduced motion, when a chapter crosses the middle of the viewport, then the palette switches at once with no blend.
- AC-073: Given JavaScript is off, when the page renders, then each chapter shows its own palette as a solid block.
- AC-074: Given any theme, when text renders, then body and muted text meet 4.5:1 against the background.

### FR-041 — Chapter navigation

- AC-075: Given the page is scrolled past the hero, when a chapter is active, then the header shows its number and name, for example "Ch. 02 · Selected work", and announces the change once.
- AC-076: Given scrolling, when the position changes, then the header shows reading progress as a percentage without announcing it.

### FR-042 — Story arc

- AC-077: Given the home page, when it renders, then chapters follow: hero, 01 Why I build, 02 Selected work (one sub-chapter per featured project), 03 Archive, 04 Path, 05 Toolkit, 06 Kind words (only with approved testimonials), then Let's build.
- AC-078: Given chapter 01, when it renders, then it opens with a thesis line and proof line drawn only from VERIFIED project facts, then the manifesto, the three fact cards, and the stack line.

### FR-043 — Case-study beats

- AC-079: Given a featured case study on a screen 1024 px or wider, when it scrolls, then its sticky column shows a rail of three beats, Problem, Build, Proof, the beat whose block crosses the middle is highlighted, and the rail fills with progress.
- AC-080: Given a narrower screen or reduced motion, when the case study renders, then the beats show as static labels above each block and nothing is pinned.

### FR-044 — Effect cleanup

- AC-081: Given the page, when it renders, then section labels no longer scramble and section titles no longer drift; titles reveal once.
- AC-082: Given the stack line, when it renders, then it sits inside chapter 01 instead of as its own band.
- AC-083: Given a chapter whose theme is not ink, when a fine pointer moves, then the custom cursor is hidden and the native cursor remains.

## Business and validation rules

- BR-017: Chapter and thesis copy restate VERIFIED facts from `src/content/`; no new metrics or claims.
- BR-018: Work stays on `feat/F-012-narrative-revamp` as a preview; nothing merges to `main` without the owner's explicit approval (owner instruction, 2026-10-19).

## Edge cases and failure states <!-- full-tier -->

- A jump from the header or a project chip lands mid-blend: the palette resolves to the target chapter after the jump.
- Resizing or opening a More work row changes chapter positions: triggers refresh and the palette recomputes.
- No testimonials approved: chapter 06 is absent and numbering does not skip.

## Non-functional requirements <!-- full-tier -->

- NFR-005: Home-page Lighthouse performance and accessibility stay at 90 or above.
- NFR-006: No new runtime dependency; no WebGL.
- NFR-007: Layout holds at 360, 768, and 1280 px with no horizontal scroll.

## Open questions

None. Q1 to Q9 approved by the owner on 2026-10-19.
