---
id: F-008
title: "Content corrections: name, Mangcoding, project list"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Content corrections

## Problem

The owner reviewed the live site on 2026-10-16 and found three errors: the intro and contact copy call him "Sehan" instead of "Sechan"; the company appears as "PT Mangcoding", but its brand is Mangcoding and its legal name is PT Nugraha Kreasi Digital; and MangKasir Ritel is listed as work although the project is on hold with no result to show.

## Goal

The site names the owner and his employer correctly and lists only work with a result, using projects already recorded as VERIFIED in `about-me`.

Non-goals: new screenshots; changing featured case studies.

## Functional requirements

### FR-022 — Name

- AC-033: Given the content file and the intro, when they render, then the name reads "Sechan" ("I'm Sechan.", "Hi Sechan,"), never "Sehan".

### FR-023 — Employer

- AC-034: Given the experience entry, when it renders, then the company reads "Mangcoding" with "PT Nugraha Kreasi Digital" in small type beneath; "PT Mangcoding" appears nowhere.

### FR-024 — Project list

- AC-035: Given the More work list, when it renders, then MangKasir Ritel is gone (from projects and from the Mangcoding experience points) and Fluxa, ArtConnect, and Gunung Puyuh WebGIS appear with repository links.

## Business and validation rules

- BR-006: New project copy uses only `VERIFIED` facts from `about-me/07_PROJECT_INVENTORY.md`; the inventory's unverified figures (Fluxa latency, WebGIS adoption and WCAG claims) stay out.
- BR-007: A demo link is added only if it resolves. The WebGIS GitHub Pages URL redirects to an unrelated domain (`intanagif.me`), so only its repository is linked.

## Open questions

- `about-me` still says "PT Mangcoding" and lists MangKasir as active; the owner updates it, blocking: no.
