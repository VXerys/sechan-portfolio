---
id: F-006
title: "Testimonials with consent-aware attribution"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-022, FR-023, FR-024, FR-025, FR-026]
supersedes: null
---

# Design: Testimonials with consent-aware attribution

## Summary

The content entry records what the person approved; a pure function in `src/lib/` turns approved entries into display-ready views; Server Components render those views. The section switches from F-002's two-column cards to the hairline rows used by Experience and Recognition, so one quote or five read the same and no empty grid cell appears.

## Current state

`portfolio.ts` holds a flat `Testimonial` (name, role, organization, project slug, consent date) and an empty list. `contact.tsx` is a client component that imports `portfolio.ts`, so anything in that module can be bundled for the browser. `page.tsx` numbers Contact from the raw list length.

## Component changes

| Path | Change |
|---|---|
| `src/content/testimonials.ts` | new home of `Testimonial` and the empty list, kept out of `portfolio.ts` so no client import reaches pending entries (BR-008) |
| `src/content/portfolio.ts` | drop `Testimonial` and `testimonials` |
| `src/lib/testimonials.ts` | `showTestimonials()` keeps entries with a valid consent date and resolves attribution, shown text, and language name; `quoteForProject()` |
| `src/components/sections/testimonials.tsx` | (06) label with count, `DriftTitle` "In their / words", `LineRows` rows; returns `null` for an empty list |
| `src/components/sections/project-quote.tsx` | new; excerpt plus attribution, no hooks so the client "More work" panel can render it |
| `work.tsx`, `project-index.tsx` | optional `quotes` prop, rendered under Stack or in the open panel |
| `src/app/page.tsx` | builds views once; section and Contact numbering use the approved count |
| `docs/outreach/client-testimonial-templates.md` | "Setelah disetujui" steps follow the new fields |

## Data and state

```ts
type Testimonial = {
  quote: string; language: string; translation: string | null;
  attribution: { showName: true; name: string; role: string; organization: string | null }
             | { showName: false; label: string };
  projectSlug: string | null; excerpt: string | null; consentDate: string | null;
};
```

- Shown text is `translation ?? quote`; its `lang` is `en` when translated, else `language`. The excerpt must be a substring of the shown text.
- The union means an unnamed entry has no field for a name, so one cannot be stored by mistake (BR-006).
- `projectSlug: null` covers work outside the project list, such as the wedding invitation site.
- No storage change; the list stays empty in the repository until a real approval.

## Error handling and security

- A malformed or missing consent date hides the entry rather than throwing at build time; the content test fails on it.
- Only views (already filtered) cross into `ProjectIndex`, a client component. A source-scan test rejects any `"use client"` file importing `content/testimonials`.
- Quotes render as text, never as HTML.

## Motion and layout

Rows reuse `LineRows` (hairline draw, content rise) and `DriftTitle`; under reduced motion and without JavaScript the rows render in their final state. Quote size: serif, `clamp(1.9rem, 1rem + 1.8vw, 2.8rem)`, so it grows steadily from phone to desktop instead of stepping at breakpoints.

## Testing

| Requirement | Test | Layer |
|---|---|---|
| AC-033, AC-035, AC-036, AC-037, AC-038 | `src/lib/testimonials.test.ts` | unit |
| AC-039, AC-040 | `src/content/testimonials.test.ts` | unit |
| AC-033, AC-034 | built HTML without entries; local temporary entries in the browser | manual |
| Layout at 360, 768, 1280 px | in-app browser with temporary entries, never committed | manual |
