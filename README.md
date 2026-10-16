# Sechan Portfolio

Personal portfolio of M Sechan Alfarisi, Full-Stack Mobile Software Engineer and Applied AI Engineer. One static page built with Next.js 16, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText) and Lenis.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

| Purpose | Command |
|---|---|
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Content tests | `npm test` |
| Build | `npm run build` |
| SDD context | `npm run context:render`, then `npm run context:validate` |

## Where things are

- Content: `src/content/portfolio.ts`. It mirrors VERIFIED facts from the `about-me` knowledge base, so update that first.
- Screenshots: `src/assets/images/`, mapped per project in `src/content/media.ts`. A project without an entry shows a placeholder.
- Motion: `src/lib/motion/gsap.ts` (plugin registration) and `src/components/motion/` (Lenis, reveals). Every animation has a reduced-motion path.
- Spec-driven docs: start at `docs/context/BRIEF.md`. The active feature is `docs/specs/F-001-portfolio-site/`. This project uses the AI-Assisted SDD template v2.0.0.
