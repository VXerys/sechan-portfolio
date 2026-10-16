---
inclusion: always          # always | fileMatch | manual
---

# Product

Short, always-loaded product context. The full product requirements live in `docs/product/prd.md`; this file must agree with it and stays under 120 lines.

## Vision

Sechan Portfolio is a motion-led personal website that shows recruiters and clients M Sechan Alfarisi's mobile and applied-AI work, with verified project evidence and a direct contact path.

Sehan shares it with clients, recruiters, and anyone else he meets. Availability is freelance first, then full-time roles, then 3 to 6 month internships (owner decision, 2026-10-16), under the positioning "Full-Stack Mobile Software Engineer & Applied AI Engineer". "Working" means a visitor understands what he builds within the hero, opens at least one project, and can start a conversation without hunting. Project content (specs, product docs, UI copy) is written in English; the framework text stays English.

## Personas

- Prospective client: a business owner who wants proof of delivered apps and a quick way to start a project.
- Recruiter: screens many candidates, spends under two minutes, scans for role fit, shipped work, and a contact link.
- Engineering reviewer: opens projects to judge scope, stack, and what Sehan personally built.

## Core use cases

- UC-001: A recruiter lands on the home page and reads the positioning, role, and availability in the hero.
- UC-002: A reviewer scrolls the selected work and reads a project's problem, contribution, stack, and verified outcomes.
- UC-003: A visitor reaches the contact section and opens a prefilled email draft, copies the address, or opens LinkedIn or GitHub.

## Non-goals

- No CMS, blog, admin panel, or database in the first milestone.
- No contact form or message backend; email (prefilled draft plus copy) is the contact path. See F-004 design for when a form is worth it.
- No metrics or claims that are not labelled VERIFIED in the `about-me` knowledge base.

## Success signals

| Signal | What it tells us | Source |
|---|---|---|
| Lighthouse performance and accessibility at 90 or above on the home page | motion does not cost usability | Lighthouse run, recorded as evidence |
| Reviewer can name Sehan's role after the hero | positioning lands | manual review |

## Constraints that shape product decisions

- Content source of truth is `D:\Projects\about-me` (VERIFIED facts only); `src/content/` mirrors it and is updated from there, not invented.
- No private data: phone, student ID, private emails, client data, or client screenshots without permission.
- Every animation has a reduced-motion path; the site works at 360, 768, and 1280 px widths.
