---
id: F-005
title: "Site identity and production deploy"
type: verification
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-017, FR-018, FR-019]
supersedes: null
---

# Verification: Site identity and production deploy

## Evidence

### EV-014 — Live domain and redirect
- command: `curl -sSI https://sechanalfarisi.dev` and `curl -sSI https://www.sechanalfarisi.dev`
- output:
  ```text
  HTTP/1.1 308 Permanent Redirect / Location: https://www.sechanalfarisi.dev/
  HTTP/1.1 200 OK / Server: Vercel
  ```
- date: 2026-10-16
- commit: 3799a57
- covers: [AC-027]

### EV-015 — Tests, lint, typecheck, build
- command: `npm test && npm run lint && npm run typecheck && npm run build`
- output:
  ```text
  ✔ canonical site URL is the live https www origin (AC-029); tests 11, pass 11, fail 0
  eslint clean; Types generated successfully; tsc clean
  ┌ ○ /  ├ ○ /apple-icon.png  └ ○ /icon.svg
  ```
- date: 2026-10-16
- commit: 3799a57 (uncommitted working tree on top)
- covers: [AC-028, AC-029]

### EV-016 — Built HTML head
- command: `grep` on `.next/server/app/index.html` after `npm run build`
- output:
  ```text
  <link rel="canonical" href="https://www.sechanalfarisi.dev"/>  og:url https://www.sechanalfarisi.dev
  <link rel="icon" href="/favicon.ico?..." sizes="48x48">  <link rel="icon" href="/icon.svg?..." sizes="any">
  <link rel="apple-touch-icon" href="/apple-icon.png?..." sizes="180x180">
  ```
- date: 2026-10-16
- commit: 3799a57 (uncommitted working tree on top)
- covers: [AC-028, AC-029]

## Coverage

| Criterion | Evidence | Result |
|---|---|---|
| AC-027 | EV-014 | pass |
| AC-028, AC-029 | EV-015, EV-016 | pass |

## Not run

| Check | Reason | Residual risk |
|---|---|---|
| Icons and canonical on the live site | needs this branch merged and redeployed | T-024 checks it after merge |

## Result

`pass_with_limitations`: the domain is live and the build carries the new icons and canonical metadata; production confirmation follows the merge.
