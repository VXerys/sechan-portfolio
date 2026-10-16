---
id: F-004
title: "Freelance-first copy, greeting intro, contact CTA"
type: design
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
requirements: [FR-014, FR-015, FR-016]
supersedes: null
---

# Design: Freelance-first copy, greeting intro, contact CTA

## Component changes

| Path | Change |
|---|---|
| `src/content/portfolio.ts` | `intro`, `availability` freelance-first; new `contact` block: CTA label, mail subject, mail body |
| `src/content/portfolio.test.ts` | AC-023 ordering test; `mailto` encoding test |
| `src/components/motion/intro.tsx` | display line "HELLO,"; words client, recruiter, founder, friend; final "I'm Sehan." |
| `src/components/sections/hero.tsx` | badge "Available for freelance" |
| `src/components/sections/contact.tsx` | `mailto:` with encoded subject and body; ring text; cursor hidden over the CTA so the ring never covers its label |
| `src/components/site/copy-email.tsx` | client button using `navigator.clipboard`, `aria-live` status |
| `docs/steering/product.md` | positioning and personas follow the owner decision |

## Alternatives considered

| Option | Cost | Decision |
|---|---|---|
| `mailto:` with prefilled subject and body, plus copy button | none; works offline; depends on a mail app or copy | chosen |
| Form via a Next.js Server Action and an email API (Resend) | one dependency, an API key in env, spam protection | later, if inquiries grow |
| Form stored in Supabase | table, insert-only RLS, rate limiting or captcha, and still a notification to the owner | not now: a stored message nobody is notified about is worse than an email |
| WhatsApp link | exposes the phone number, which BR-002 keeps private | rejected |

## Testing

| Requirement | Check | Layer |
|---|---|---|
| AC-023 | `portfolio.test.ts` | unit |
| AC-024 | browser reload | manual |
| AC-025, AC-026 | `href` inspection; click Copy email in browser | manual |
