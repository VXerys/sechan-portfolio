---
id: F-009
title: "Mobile polish, section indicator, motion set 2"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Mobile polish, section indicator, motion set 2

## Problem

Hover-only effects (floating preview, cursor, magnetic) leave touch visitors with plain rows and no feedback; a long single page gives no sense of where the visitor is; and the owner asked (2026-10-16) for more signature motion: screen slice, cursor-led buttons, liquid hover, horizontal scroll, scroll-linked scale.

## Goal

Touch visitors see each project's visual and get tap feedback; every visitor knows the current section; the new effects add character without new dependencies and with a reduced-motion path.

Non-goals: WebGL or Three.js; new content claims; a liquid (SVG displacement) hover on case-study visuals, built and then dropped by the owner after trying it (2026-10-16).

## Functional requirements

### FR-027 — Section indicator

- AC-041: Given scrolling past About, Work, Experience, Toolkit, Kind words (when shown), or Contact, when a section crosses the viewport middle, then the header shows its number and name, and the desktop nav marks the matching link.

### FR-028 — Touch experience

- AC-042: Given a viewport under 768 px, when a More work row opens, then the project's visual (screenshot or poster) shows inside the panel.
- AC-043: Given a touch press on a row, link, or button, when pressed, then it visibly responds (scale or tint) before navigation.
- AC-050: Given a viewport under 768 px, when the footer is reached by scroll or by the Contact link, then its "(06) Contact" label and "Let's build" title are not hidden under the section above.

### FR-029 — Motion set 2

- AC-044: Given a nav or menu link, when clicked with motion allowed, then five lime slices cover the screen, the page jumps behind them, and the slices leave from the target.
- AC-045: Given a pill button and a fine pointer, when hovered, then lime fills it from the side the pointer entered and a short dot trail follows the pointer inside it.
- AC-047: Given a desktop width, when scrolling Proof, then its cards move sideways while the section is pinned; on mobile they stack.
- AC-048: Given the footer entering, when scrolling, then "Let's build" scales up with the scroll.
- AC-049: Given reduced motion, when any of the above would run, then content shows in its final state with no slices, pill trail, pin, or scale.

## Open questions

None.
