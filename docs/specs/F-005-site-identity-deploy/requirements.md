---
id: F-005
title: "Site identity and production deploy"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Requirements: Site identity and production deploy

## Problem

The site is live on Vercel at the owner's domain, but the browser tab still shows the default Next.js icon, metadata URLs resolve against no origin, and the Next.js dev badge sits over the page while the owner reviews it locally.

## Goal

Visitors see the site's own mark in the tab and on a home screen; shared links resolve to the canonical domain.

Non-goals: an Open Graph image (later), analytics.

## Functional requirements

### FR-017 — Production deploy

The site shall be served from Vercel at https://www.sechanalfarisi.dev, with the apex redirecting to it.

- AC-027: Given `https://sechanalfarisi.dev`, when requested, then it answers 308 to `https://www.sechanalfarisi.dev/`, which answers 200 from Vercel.

### FR-018 — Site icon

The site shall use its own mark: the six-spoke asterisk (the glyph behind the manifesto) in ink on a lime disc.

- AC-028: Given the built site, when the head is rendered, then it links `icon.svg`, `apple-icon.png`, and `favicon.ico`, none of which is the Next.js default.

### FR-019 — Canonical metadata

- AC-029: Given the content file, when tests run, then `siteUrl` is `https://www.sechanalfarisi.dev`; the layout uses it as `metadataBase` and canonical.

## Business and validation rules

- BR-005: The icon is an authored brand mark (simple geometry), not an illustration or a third-party logo.

## Open questions

None.
