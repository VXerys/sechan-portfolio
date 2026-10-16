---
id: F-008
title: "Content corrections: name, Mangcoding, project list"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-022, FR-023, FR-024]
supersedes: null
---

# Design: Content corrections

## Component changes

| Path | Change |
|---|---|
| `src/content/portfolio.ts` | `shortName` Sechan; mail body "Hi Sechan,"; `Experience.legalName`; Mangcoding brand in experience, about, and project clients; MangKasir project and experience point removed; Fluxa, ArtConnect, Gunung Puyuh WebGIS added |
| `src/components/motion/intro.tsx` | final word "I'm Sechan." |
| `src/components/sections/experience.tsx` | renders `legalName` as a label under the company |
| `src/components/sections/project-poster.tsx` | poster tones for the three new slugs |
| `src/content/portfolio.test.ts` | AC-033 to AC-035 |
| `docs/outreach/client-testimonial-templates.md` | "Saya Sechan" |

## Sources

| Project | Source | Links used |
|---|---|---|
| Fluxa | `07_PROJECT_INVENTORY.md` section 8 (VERIFIED) | `fluxa_app`, `fluxa-model`, `fluxa-ml` repositories (public) |
| ArtConnect | section 2 (VERIFIED) | live demo (HTTP 200 on 2026-10-16), frontend and backend repositories |
| Gunung Puyuh WebGIS | section 3 (VERIFIED) | repository only (see BR-007) |

More work order: Fluxa, ArtConnect, Welling and Ayah Hebat, VisualKain Finance, InztaMoto ERP, Gunung Puyuh WebGIS.

## Testing

| Requirement | Check | Layer |
|---|---|---|
| AC-033 to AC-035 | `portfolio.test.ts` | unit |
| AC-033 to AC-035 | browser: intro end frame, Experience, More work | manual |
