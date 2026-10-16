---
id: F-004
title: "Freelance-first copy, greeting intro, contact CTA"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Freelance-first copy, greeting intro, contact CTA

## Problem

The owner will share the site with clients, recruiters, and other people, not only internship reviewers (owner decision in chat, 2026-10-16). The copy leads with internships, the intro shows his name before any greeting, and the contact button opens a bare `mailto:` that does nothing on machines without a mail app.

## Goal

A client reads "available for freelance" first, a recruiter still sees "open to work" and internships, the intro greets the visitor, and the contact path works with or without a mail app.

Non-goals: a contact form or message backend (see design, Alternatives).

## Functional requirements

### FR-014 — Availability copy

The site shall present freelance availability first, then full-time roles, then internships, in the hero, about, and contact sections.

- AC-023: Given the content file, when tests run, then `availability` and `intro` mention freelance before internships.

### FR-015 — Greeting intro

The intro shall greet the visitor ("HELLO,") and morph through who might be reading (client, recruiter, founder, friend) before resolving to "I'm Sehan."

- AC-024: Given a reload, when the intro plays, then the greeting is on screen from the first paint and resolves to "I'm Sehan."

### FR-016 — Contact CTA

The main CTA shall open an email draft with a prefilled subject and short brief, and a second control shall copy the address with visible confirmation.

- AC-025: Given a click on the CTA, when a mail app exists, then a draft opens addressed to the owner with subject and body filled.
- AC-026: Given a click on "Copy email", when the clipboard is available, then the address is copied and the control reads "Copied" for two seconds; otherwise the address is shown for manual copy.

## Business and validation rules

- BR-004: Job titles stay factual ("Intern" at PT Mangcoding); only availability and positioning copy changes.

## Open questions

- The `about-me` knowledge base still positions for internships only (02_CAREER_DIRECTION); the owner updates it, blocking: no.
