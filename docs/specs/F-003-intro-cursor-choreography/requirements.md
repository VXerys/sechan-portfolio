---
id: F-003
title: "Intro, cursor, and scroll choreography"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Intro, cursor, and scroll choreography

## Problem

The site has no opening, hover states are a single dot, sections feel flat on scroll, case studies leave a large gap under a short "problem" paragraph, the header text collides with content, and the mobile menu clips "EXPERIENCE". The owner asked for an opening in the spirit of auge-xp.com (text morph, curtain wipe).

## Goal

The first visit opens with an authored sequence, every interactive element answers the pointer, and each section has its own scroll moment, without blocking content for reduced motion or failed JavaScript.

Non-goals: copying auge-xp.com assets, layout, or code; page transitions between routes.

## Functional requirements

### FR-010 — Opening sequence

The site shall show an intro on first load: name, a serif word that morphs through roles, a counter, then a curved curtain that wipes up to reveal the hero.

- AC-014: Given a first visit with motion allowed, when the page loads, then the intro plays once and the hero animates after it.
- AC-015: Given any reload, when the page loads, then the full intro plays again, its text is on screen from the first paint, and the curtain waits for fonts and images (at most 4.5 s of loading).
- AC-016: Given reduced motion or no JavaScript, when the page loads, then no overlay is shown.

### FR-011 — Pointer feedback

The site shall give hover feedback: a lagging ring cursor with states, magnetic links and buttons, rolling link text, and a floating preview over "More work" rows.

- AC-017: Given a fine pointer, when it enters a link, labelled visual, or "More work" row, then the cursor or preview changes state; touch devices see none of it.

### FR-012 — Section choreography

Each section shall have a distinct scroll effect: hero pinned under the next sheet, velocity marquee, manifesto fill, split title drift, clip-expanding media and capability sheet, line-drawn rows, parallax footer reveal.

- AC-018: Given motion allowed, when the visitor scrolls the page, then each listed effect runs and ends in a readable state.

### FR-013 — Layout fixes

- AC-019: Given a desktop case study, when it renders, then "The problem" and "What I built" stack full width with no column gap under a short paragraph.
- AC-020: Given the header over content, when the visitor scrolls down, then the header hides; scrolling up shows it.
- AC-021: Given a 375 px viewport, when the menu opens, then every item fits on screen.
- AC-022: Given consecutive ink sections, when they render, then the gap between them matches the gap between case studies (128 px mobile, 192 px desktop, within one label row).

## Open questions

None. Screenshots for "More work" projects are posters until the owner supplies cleared images.
