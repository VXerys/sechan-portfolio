---
inclusion: always          # always | fileMatch | manual
---

# Tech

Stack and commands. `npm run init` fills every `PRESET_` placeholder from the chosen app and database presets (`scripts/init/presets/`); everything else is filled from the real repository. A command listed here must exist and run.

## Stack

| Concern | Technology | Reason or constraint |
|---|---|---|
| Language and runtime | TypeScript 5 on Node 22+ (developed on Node 24) | |
| Application framework | Next.js 16.4 (App Router, Turbopack), React 19.3 | static content site; no route handlers |
| Styling | Tailwind CSS v4 (`@tailwindcss/turbopack`) | design tokens in `src/app/globals.css` |
| Motion | GSAP 3 + `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText | one animation engine; no Framer Motion alongside it |
| Smooth scroll | Lenis, driven by the GSAP ticker | one scroll engine; disabled under `prefers-reduced-motion` |
| Data store | none | portfolio content is typed data in `src/content/` |
| Test framework | Node test runner with type stripping (`node --test`) | content invariants; no browser test runner yet |
| Deployment target | Vercel (not yet configured) | |
| Source and test paths | `src/**`, `public/**` | globs used by `fileMatch` steering rules |

## Commands

Run these before claiming any task done. Report a command that cannot run; never claim its success. `none` means the preset has no command for that purpose; replace it when the project gains one.

| Purpose | Command |
|---|---|
| Install | `npm ci` |
| Analyze or lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Format check | `none` |
| Test | `npm test` |
| Build | `npm run build` |
| Run locally | `npm run dev` |
| Data store change check | `none` |
| Context validation | `npm run context:validate` |

## Stack rules

- Server Components by default; client components opt in with `'use client'` and stay leaf-sized.
- Secrets are read in server code only; a variable reaches the browser only with the `NEXT_PUBLIC_` prefix.
- Route handlers validate every request body at the boundary and return typed errors.
- `npm run typecheck` at 0 errors and `npm run lint` clean before a task is done.
- `npm run typecheck` runs `next typegen` first: `next-env.d.ts` and `.next/types` (route props such as `LayoutProps`, static image modules) are generated, not committed, so a clean checkout has to create them before `tsc`.
- Next.js 16 differs from older versions; read the matching guide in `node_modules/next/dist/docs/` before using an unfamiliar API. `agentRules: false` in `next.config.ts` stops `next dev` from appending its own block to the rendered `AGENTS.md`.
- Every GSAP animation lives in a client component inside `useGSAP` (scoped, auto-reverted). Register plugins once in `src/lib/motion/`.
- Every animation has a `prefers-reduced-motion` path built with `gsap.matchMedia()`; content is readable with JavaScript disabled.
- Animate `transform` and `opacity` only; no layout properties in scroll-linked tweens.

## Environment and secrets

- Secrets come from the environment or a secret manager; `.env*`, key files, and store credentials are never read, printed, or committed by an agent.
- Example-config files (`.env.example` or equivalent) document required variables without values.

## Dependency policy

Before adding or replacing a dependency, state the problem it solves, the native alternative considered, maintenance health, runtime or bundle impact, and license. Approval rule: the owner approves every new or replaced dependency; record the approval in the task that adds it.

## Data store changes

Schema, rules, index, or migration changes are versioned files in the repository, reviewed like code. Append-only; destructive changes need explicit approval. The store's own rules are in the `database.md` steering file when a database preset was chosen.
