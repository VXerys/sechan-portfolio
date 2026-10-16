---
id: F-006
title: "Testimonials with consent-aware attribution"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Testimonials with consent-aware attribution

## Problem

F-002 (FR-008) added a hidden testimonials section whose entries need a name, role, and organization. The owner is now asking clients and co-workers (Mangcoding, Marketiv) for quotes. Some will answer in Indonesian, some may approve a quote but not their name, the clinic stays unnamed (A-001), and the wedding invitation site is not a listed project. The F-002 type cannot hold any of that, and its heading says "From clients" although co-workers will be quoted.

## Goal

An approved quote is added by editing one content file and appears with exactly the attribution the person agreed to; nothing appears before approval.

Non-goals: a CMS or a form for collecting quotes, ratings, logos, a carousel.

## Functional requirements

### FR-022 — Consent-gated section

The site shall show a testimonials section, between (05) Recognition and Contact, built only from entries with a consent date.

- AC-033: Given no entry with a consent date (including an empty list), when the page renders, then the section is absent and Contact is numbered (06).
- AC-034: Given at least one approved entry, when the page renders, then the section is numbered (06), sits after Recognition, and Contact becomes (07).

### FR-023 — Attribution by consent

- AC-035: Given an entry whose person agreed to be named, when it renders, then name, role, and organization (when given) show. Given an entry without that consent, then only its anonymous label shows, and the content file holds no name for it.

### FR-024 — Original language and translation

- AC-036: Given a non-English quote with an approved English translation, when it renders, then the translation is the main quote, a note names the source language, and the original text shows with its `lang` attribute.
- AC-037: Given a quote without a translation, when it renders, then it shows as written with its `lang` attribute.

### FR-025 — Quote on the related project

- AC-038: Given an approved entry with an excerpt, when its project renders as a case study or in the "More work" panel, then the excerpt and attribution show there.

### FR-026 — Content invariants

- AC-039: Given the content file, when tests run, then every entry has a valid language tag, a `YYYY-MM-DD` consent date or null, non-empty attribution fields, a project slug that exists or null, and an excerpt that appears verbatim in the shown text.
- AC-040: Given the source tree, when tests run, then no client component imports the testimonials content module.

## Business and validation rules

- BR-006: A name is stored only after the person agrees to be named. Without that consent the entry keeps only an anonymous label, for example "Owner of a primary care clinic in Sukabumi".
- BR-007: A translation or excerpt is shown as the person's words only after they approved it; BR-003 applies to both.
- BR-008: Unapproved entries never reach the browser. Testimonials are read in Server Components and filtered before any prop crosses into a client component.

## Open questions

- A-001: clinic naming permission, blocking: no (the clinic uses an anonymous label until it agrees)
- A-003: no quote collected yet, blocking: no for the code; visual checks with real entries wait for the first approval
