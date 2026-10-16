---
id: F-005
title: "Site identity and production deploy"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-017, FR-018, FR-019]
supersedes: null
---

# Design: Site identity and production deploy

## Deploy (done 2026-10-16, through the owner's Vercel and name.com accounts)

| Where | Setting |
|---|---|
| Vercel project `sechan-portfolio` (Hobby) | production branch `main`; domains `sechanalfarisi.dev` (308 to www) and `www.sechanalfarisi.dev` (Production) |
| name.com DNS | A, host blank, `216.198.79.1`; CNAME `www`, `dbeda961534d2faa.vercel-dns-017.com` (values from Vercel's Domains page) |
| TLS | issued by Vercel; `.dev` is HSTS-preloaded, so HTTPS is mandatory |

## Component changes

| Path | Change |
|---|---|
| `src/app/icon.svg` | 64 px viewBox: lime disc, three rounded ink bars at 0, 60, 120 degrees |
| `src/app/apple-icon.png` | 180 px, full-bleed lime square (iOS applies its own mask) |
| `src/app/favicon.ico` | replaces the Next.js default; PNG frames at 16, 32, 48 px |
| `src/content/portfolio.ts` | `siteUrl` |
| `src/app/layout.tsx` | `metadataBase`, `alternates.canonical`, Open Graph `url` and `siteName` |
| `next.config.ts` | `devIndicators: false` (errors still surface in development) |

Variant choice: six spokes over eight, because eight blur into a dot at 16 px (previewed on dark and light tab bars).

## Testing

| Requirement | Check | Layer |
|---|---|---|
| AC-027 | `curl -sI` on apex and www | manual |
| AC-028 | built HTML head links | manual |
| AC-029 | `portfolio.test.ts` | unit |
