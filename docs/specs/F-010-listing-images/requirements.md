---
id: F-010
title: "Project listing images"
type: requirements
status: verification
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
supersedes: null
---

# Requirements: Project listing images

Observable behavior only. Architecture goes in `system-architecture.md`, repository mapping in `design.md`.

## Problem

Only BookMate and Marketiv show a real image; every other project shows a generated poster, and BookMate's image is a single store frame. Visitors cannot see what the web projects look like, and the client apps hold data the site must never show (patients, money, customer names). The owner asked (2026-10-17) for Play Store style listing sets built from the real apps, with sample data that is clearly labelled.

## Goal

Each in-scope project shows a designed listing set built from its real UI with sample data, and no capture ever reads production or staging data.

- Every in-scope project has one cover and four slides (mobile: four or five).
- Every capture run's request log shows zero production or staging hosts.
- A visitor can tell from each slide and from the line under the strip that the data is sample data.

## Non-goals

- Marketiv: deferred while its landing page is being revamped (owner, 2026-10-17).
- Fluxa and Cartify: mobile apps outside the owner's listed set; they keep their posters.
- AI-generated UI or mockups, video, and any commit or push to a client repository.

## Actors

- ACTOR-001: visitor (client, recruiter, reviewer) reading a case study or a More work row.
- ACTOR-002: kit operator (the owner or an agent) capturing and composing images on this machine.

## Functional requirements

### FR-036 — Listing kit

The repository shall hold a local kit that captures screens from a running app with sample data and composes them into listing images.

- AC-061: Given an app on localhost and a project shot list, when the capture script runs, then it saves one PNG per shot at the listed viewport after fonts and network settle.
- AC-062: Given a capture run, when a request targets a host outside the run's allowlist, then the request is blocked and logged and the run exits with an error.
- AC-063: Given raw captures and captions, when the compose script runs, then it writes a 16:10 cover and 4:5 (web) or 9:16 (mobile) slides as WebP into `src/assets/images/listings/<slug>/`.

### FR-037 — Web project listings

- AC-064: Given Klinik Cikidang Medika, VisualKain Finance, InztaMoto ERP, ArtConnect, and Gunung Puyuh WebGIS, when their tasks finish, then each has one cover and four slides showing its real UI in a browser frame, each slide with a one-line caption.
- AC-065: Given a slide built from a screen that holds client data, when viewed, then it carries the tag "Sample data · client records replaced" and shows no real person name, patient detail, phone number, email address, or real amount.

### FR-038 — Mobile project listings

- AC-066: Given BookMate's existing screenshots, when composed, then it has one cover and four or five 9:16 slides in a phone frame, labelled "Full-stack".
- AC-067: Given the Welling and Ayah Hebat screenshots, when composed after A-004 is confirmed, then one shared set is labelled "UI slicing" and every real end-user name and photo is covered with a sample value.

### FR-039 — Site gallery

- AC-068: Given a project with a listing set, when its case study or More work panel renders, then the cover replaces the poster and the slides sit in a horizontal strip that scrolls by drag, touch swipe, wheel, and keyboard.
- AC-069: Given a strip with sample-data slides, when shown, then the line under it reads "Screens use sample data; the project is shown with the client's approval." for client work, and "Screens use sample data." for the owner's own projects (amended 2026-10-19: own projects have no client approval to cite).
- AC-070: Given reduced motion or no JavaScript, when the strip renders, then every slide stays reachable by native horizontal scroll.

## Business and validation rules

- BR-012: A client app never talks to production or staging. Firebase apps run against the local emulator under a `demo-` project id; Supabase apps run against Playwright route stubs on a fake host. Hardcoded production fallbacks are overridden before the first request.
- BR-013: Sample data is invented. It is never copied from production, staging, exports, or tracked fixtures that hold real people (VisualKain's `src/test/fixtures/seed-data.ts` is off limits).
- BR-014: A client repository is used only through a temporary git worktree from its production branch. Nothing is committed or pushed there, and the worktree is removed after capture. Repositories not on disk are cloned into `D:\Projects\<repo>` (owner request).
- BR-015: Slides show the real app UI. Frames, backgrounds, type, and ornaments come from the kit's templates; no AI-generated UI.
- BR-016: Captions follow the site's copy rules (English, no hype words, no em dashes) and double as alt text.

## Edge cases and failure states <!-- full-tier -->

- EC-001: An app cannot render without a production backend: the task becomes `blocked` and the owner is asked; real data is never used as a shortcut.
- EC-002: A page needs third-party tiles or CDNs (WebGIS maps, web fonts): those hosts join that run's allowlist and appear in the task's evidence.
- EC-003: A live capture still shows a real-looking name or amount: the stub is fixed and the shot retaken; live captures are never blurred afterwards. Covering values is only for the existing mobile screenshots (AC-067).
- EC-004: Fonts or map tiles have not loaded at capture time: wait for `document.fonts.ready` and network idle, then retry once before failing.
- EC-005: A login wall: the stub or emulator provides a signed-in session for a sample user with the role the screen needs.

## Non-functional requirements <!-- full-tier -->

- NFR-001 performance: a cover is at most 250 KB and a slide at most 200 KB as WebP; strips load lazily below the fold; home-page Lighthouse performance stays at 90 or above.
- NFR-002 security: every capture run writes its request hosts to a log; the task evidence shows zero production or staging hosts.
- NFR-003 accessibility: each slide's caption is its alt text; the strip is a focusable region with a label.
- NFR-004 reproducibility: one command per project re-creates its set from the shot list and stubs.

## Open questions

- A-004: Mangcoding's permission for the Welling and Ayah Hebat set. T-047 stays `blocked` until it is confirmed.
