---
id: F-002
title: "Visual refresh and testimonials"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Visual refresh and testimonials

## Problem

The owner liked the first version but wants stronger typography and motion closer to four references (ownitt.fr, jlern.com, auge-xp.com, shelbykho.com). Clients agreed to be named, except the clinic, and the owner wants client quotes on the site.

## Goal

Body and statement type read as authored, not default; motion borrows the references' ideas (not their assets or code); real client quotes can be added without code changes.

Non-goals: copying any reference layout, asset, or copy; a CMS for quotes.

## Functional requirements

### FR-006 — Type system

The site shall use a condensed display face, a grotesk body face, and a display serif for statements and accents.

- AC-008: Given any section, when it renders, then body copy uses the grotesk face and statements use the serif face at display size.

### FR-007 — Reference-inspired motion

The site shall add: scrambled text on labels and nav hover, a scroll-rotated glyph behind the manifesto, a scroll-velocity marquee, and a cursor label over project visuals.

- AC-009: Given motion allowed, when the visitor scrolls or hovers, then each effect runs and settles on the readable final text.
- AC-010: Given reduced motion, when the page loads, then none of these effects run and the final text shows.

### FR-008 — Testimonials

The site shall show a testimonials section built from `src/content/portfolio.ts` that renders only approved entries.

- AC-011: Given no approved testimonial, when the page renders, then the section is absent.
- AC-012: Given an entry, when tests run, then it has a consent date, a name, and a project slug that exists.

### FR-009 — Client naming

The clinic shall appear without its name until it approves (A-001).

- AC-013: Given the content file, when tests run, then "Cikidang" does not appear.

## Business and validation rules

- BR-003: Quotes are the client's own words, approved by them; the agent never drafts a quote that is published as theirs.

## Open questions

- A-001: clinic naming permission, blocking: no
- A-003: testimonials not yet collected, blocking: no
