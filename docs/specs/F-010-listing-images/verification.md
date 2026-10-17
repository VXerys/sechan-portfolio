---
id: F-010
title: "Project listing images"
type: verification
status: implementing
tier: full
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
requirements: [FR-036, FR-037, FR-038, FR-039]
supersedes: null
---

# Verification: Project listing images

Evidence that acceptance criteria hold at a named commit. A claim without a command and an output excerpt is not evidence. Unrun checks are listed, never omitted.

## Evidence

None yet. Evidence ids for this feature start at EV-040, so they cannot collide with F-011 (EV-029 onward) while both are open.

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-061, AC-062, AC-063 | | not_run |
| AC-064, AC-065 | | not_run |
| AC-066, AC-067 | | not_run |
| AC-068, AC-069, AC-070 | | not_run |

## Manual scenarios <!-- full-tier -->

- Per web project: run the capture, open `hosts.json`, confirm only allowlisted hosts; review the contact sheet for any real-looking name, number, or amount (EC-003).
- Site: open each case study and More work row at 360, 768, and 1280 px; drag, swipe, wheel, and tab through the strip.

## Architecture-sensitive evidence <!-- full-tier -->

- Route guard: one deliberate request to a non-allowlisted host per kit release must abort and fail the run (AC-062).
- Emulator isolation: the Firebase runs use `demo-` project ids; the request log shows only `localhost` emulator ports for Firebase traffic.

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Everything above | plan stage; no task has started | none yet |

## Result

`not_run`
