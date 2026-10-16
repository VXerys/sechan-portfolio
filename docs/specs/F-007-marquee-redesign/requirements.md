---
id: F-007
title: "Stack marquee redesign"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Stack marquee redesign

## Problem

The owner finds the stack marquee under the hero ugly and out of place (2026-10-16): two rows of shouting display caps, an outline row, lime ampersands, and a skew on scroll read as a generic banner rather than part of the site.

## Goal

Keep the feature (the tools Sehan ships with, moving with scroll) and make it read as editorial typesetting that belongs to the site.

Non-goals: changing the tool list or its source; touching `page.tsx` (the props stay `items: string[]`).

## Functional requirements

### FR-020 — Editorial band

The band shall be one row with a fixed label ("Stack I ship with", tool count), alternating display caps and serif italics, the site mark as separator, and faded edges.

- AC-030: Given the home page, when the band renders, then it shows one moving row, the label, and the asterisk separators; no horizontal page overflow at 375 or 1440 px.

### FR-021 — Motion kept, skew removed

The row shall keep scroll-velocity speed and direction, spin the separators with it, slow down on hover, and never skew.

- AC-031: Given motion allowed, when the visitor scrolls or hovers, then the row speeds up, follows the scroll direction, and slows to a readable pace on hover.
- AC-032: Given reduced motion, when the page loads, then the row is static.

## Open questions

None.
