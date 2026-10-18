---
id: F-010
title: "Project listing images"
type: system-architecture
status: implementing
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
requirements: [FR-036, FR-037, FR-038, FR-039]
supersedes: null
---

# System architecture: Project listing images

## Architecture drivers

- Client apps hold personal and financial data; two of them fall back to production when misconfigured (VisualKain's hardcoded Firebase config, the clinic's `predev` that copies staging env). Isolation from real data is the main driver (BR-012, NFR-002).
- The output must be honest: real UI, invented data, labelled (BR-013, BR-015).
- Sets must be reproducible from the repository, not from a one-off session (NFR-004).
- The site ships static images only; nothing in this feature runs in production.

## Context and boundaries

```text
 client repo (temp worktree, never committed)        portfolio repo
 ┌───────────────────────────────┐                   ┌─────────────────────────────────────┐
 │ app dev server on localhost    │◀── HTTP ────────▶│ scripts/listing/capture.mjs          │
 │  Supabase SDK -> stub host     │                   │  playwright-core + system Chrome     │
 │  Firebase SDK -> local emulator│                   │  route guard: allowlist or abort     │
 └───────────────────────────────┘                   │  stubs from projects/<slug>.mjs      │
 ┌───────────────────────────────┐                   │        │ raw PNG + hosts.json         │
 │ Firebase emulator (demo-*)     │◀── seed (REST) ──│        ▼ .listing-cache/ (gitignored) │
 └───────────────────────────────┘                   │ scripts/listing/compose.mjs          │
                                                     │  HTML templates -> PNG -> sharp WebP │
 existing mobile screenshots (read only) ──────────▶ │        ▼ src/assets/images/listings/ │
                                                     │ site: listings.ts -> strip + cover   │
                                                     └─────────────────────────────────────┘
```

- Trust boundary 1: the browser context. Every request passes the route guard. Allowed: `localhost`, `127.0.0.1`, the emulator ports, the fake stub host, and the hosts a project lists for fonts, CDNs, or map tiles. Anything else is aborted and fails the run.
- Trust boundary 2: the client worktree. The app sees only placeholder env values (stub URL, `demo-` project id, dummy keys). Real env files are never read or copied; the clinic's `predev` script is bypassed by starting `next dev` directly.
- Trust boundary 3: the portfolio repository. Only composed WebP files, templates, shot lists, invented fixtures, and captions are committed. Raw captures stay in `.listing-cache/`.

## Data and consistency

- Sample data lives in `scripts/listing/projects/<slug>.mjs`: names from a fixed fictional list, amounts generated in plausible ranges, dates relative to the capture day. One file per project, so a reviewer reads all data that can appear on a slide.
- Supabase apps: context routes registered in the project's `setup` (behind the guard, never `page.route` in `before`) fulfil `/auth/v1/*` with a sample session and `/rest/v1/<table>` with fixture rows filtered by the query's `select` and `eq` params where the screen needs it. Unknown tables return `[]` and are logged, so a missing stub is visible instead of silent.
- Firebase apps: the emulator suite (auth, firestore) runs under `demo-<slug>`. Demo project ids cannot reach a real project, so a missed override still fails closed. Fixtures are written through the emulator REST API before capture.
- Static apps (WebGIS): the repository's own GeoJSON is public data; no stub is needed.
- Output is deterministic for a given shot list, fixtures, and app commit; the commit is recorded in each task's evidence.

## Communication

- Capture and compose are separate commands with a file hand-off (`.listing-cache/<slug>/`), so composition can be redone without restarting the app or the emulator.
- Compose renders each template in the same headless Chrome at a fixed device scale, then sharp converts to WebP with a size check against NFR-001.

## Security

- No secret is needed or read. Placeholder keys are literal strings in the shot list.
- `hosts.json` from each run is the evidence for NFR-002; a run with a blocked host does not produce images.
- Existing mobile screenshots are read from their folders and never copied into the repository unprocessed; only the composed, masked output is committed.

## Resilience

- Each project is independent; one blocked app (EC-001) does not stop the others.
- Retry once on font or tile timeouts (EC-004), then fail with the pending requests listed.

## Cost

- One new dev dependency (`playwright-core`, no bundled browser download; uses the installed Chrome). Firebase emulator needs a JDK; the Android Studio JBR is used through `JAVA_HOME` for the run only.
- Images add about 1.2 MB per project to the repository; the site loads them lazily.

## Alternatives and trade-offs

| Option | Why not chosen |
|---|---|
| Screenshot staging with a demo account | staging is likely to hold real patient rows (clinic) and shares a project with production (VisualKain) |
| Blur real data after capture | leaks shapes and lengths, and one missed field publishes personal data |
| AI-generated mockups | shows UI that was never built (BR-015) |
| Built-in browser pane only | cannot intercept requests, and a hidden pane throttles animation frames, which made captures unreliable in F-009 |
| Puppeteer | equal capability; Playwright's `route` and request logging are simpler to read and review |
