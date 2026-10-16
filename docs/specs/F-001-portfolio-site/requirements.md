---
id: F-001
title: "Portfolio site"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Portfolio site

## Problem

Sehan applies for 3 to 6 month internships but has no single page that shows his positioning, shipped work, and contact links. Reviewers spend under two minutes per candidate, so a CV PDF and scattered repositories lose them.

## Goal

A reviewer understands the role and availability from the hero, reads at least one project, and reaches a contact link, on phone or desktop.

Non-goals: CMS, blog, contact form, analytics, per-project detail pages.

## Actors

- ACTOR-001: Visitor (recruiter, engineering reviewer, prospective client), anonymous, read-only.

## Functional requirements

### FR-001 — Hero and positioning

The site shall show name, role, headline, intro, and availability above the fold.

- AC-001: Given a 360 px or 1280 px viewport, when the home page loads, then name, role, and headline are visible without scrolling.

### FR-002 — Selected work

The site shall list the projects from `src/content/portfolio.ts` with title, role, year, summary, stack, contribution, and verified outcomes.

- AC-002: Given the content file, when the page renders, then every project appears once, featured projects first.
- AC-003: Given a project without a screenshot, when it renders, then a labelled placeholder appears instead of a broken image.

### FR-003 — Experience, skills, achievements

The site shall render experience, skill groups, and achievements from the content file, with no skill bars or percentages.

- AC-004: Given the content file, when the page renders, then each experience entry, skill group, and achievement is shown.

### FR-004 — Contact

The site shall show email, GitHub, and LinkedIn links in the contact section and the footer.

- AC-005: Given any section, when the visitor opens the menu or scrolls to the end, then the contact links are reachable and open the right target.

### FR-005 — Motion with a reduced-motion path

The site shall use smooth scroll and scroll-linked reveals, and shall disable them under `prefers-reduced-motion: reduce`.

- AC-006: Given reduced motion, when the page loads, then all content is visible with no smooth scroll and no pinned or scrubbed animation.
- AC-007: Given JavaScript disabled, when the page loads, then all text content is readable.

## Business and validation rules

- BR-001: Every public claim traces to a VERIFIED fact in `D:\Projects\about-me`; an unverified metric is omitted, never softened.
- BR-002: No phone number, student ID, private email, patient or client financial data appears in content or images.

## Dependencies and constraints

- GSAP, `@gsap/react`, Lenis approved by the owner on 2026-10-16 (chat request "library nya juga sesuai rekomendasi kamu").

Out of scope: deployment and custom domain (moved to F-005).

## Open questions

- A-001: client names may be shown publicly, blocking: no (local), yes (deploy)
- A-002: BookMate and Marketiv screenshots may be shown publicly, blocking: no (local), yes (deploy)
