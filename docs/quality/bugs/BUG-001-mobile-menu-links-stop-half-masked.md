---
id: BUG-001
title: "Mobile menu links stop half-masked"
type: bug-investigation
status: verification
tier: lite
owner: "VXerys"
created: 2026-10-16
last_updated: 2026-10-16
last_verified: 2026-10-16
supersedes: null
---

# Bug: BUG-001 Mobile menu links stop half-masked

Evidence before fixes. Separate what was observed from what is suspected. No secrets in this file.

## Symptom

- Expected: opening the mobile menu reveals all four links (About, Work, Experience, Contact) in full.
- Actual: the links stop part-way up their masks; "ABOUT" shows its top half, "WORK" a sliver, the rest nothing.
- Severity: major
- Impact: every phone visitor who opens the menu since F-009 (PR #9) shipped; navigation by menu is hard to read.
- Environment: production https://www.sechanalfarisi.dev at d1713ef, owner's Android phone (Chrome); reproduced in the in-app browser at 375x812.

## Reproduction

1. Open the site under 768 px wide and wait for the intro.
2. Tap "Menu".
3. The link lines settle half-masked. Reproducible in the in-app browser when frames run; depends on frame timing.

## Evidence

- Owner's phone screenshot (2026-10-16): "01 ABOUT" cut through the middle, the next line barely visible.
- In-app browser on production: link transforms settled at 25.5, 43.3, 54.9, 55.8 px instead of 0 (line height 51 px, start 110% = 56 px).
- Localization: `src/components/site/header.tsx`, the `[data-menu-item]` links. F-009 added `transition-transform active:scale-[0.97]` to the same element that GSAP reveals with `gsap.from(..., { yPercent: 110 })`.

## Hypotheses

### H-001 — A CSS transform transition fights the GSAP transform tween

- Prediction if true: a transform set on the link lags behind (a running CSS transition); without the transition it applies at once and the reveal ends at 0.
- Evidence for: production computed transform stayed 0 right after setting 40 px, with one running `transform` transition.
- Evidence against: none found.
- Status: supported

## Experiments

### EXP-001 — Limit the transition to `scale`

- Tests: H-001
- Procedure: change the links to `transition-[scale]` (Tailwind v4 `active:scale-*` sets the `scale` property, not `transform`); build; open the menu at 375x812; set a transform and read it back.
- Expected if the hypothesis holds: the set transform applies at once; all four lines end at offset 0.
- Result and conclusion: as expected (EV-028). Hypothesis holds.

## Root cause

Tailwind v4's `transition-transform` transitions `transform, translate, scale, rotate`. GSAP writes `transform` inline on every tick, so each write started a 200 ms CSS transition, and the reveal tween read a mid-transition position as its end value, leaving each line where the transition happened to be. Not caught at review: the 375 px check (EV-024) captured the half-masked menu, read it as a mid-animation frame, and then clicked links by reference, which works whether or not they are visible.

## Fix

- Plan: transition only `scale` on the menu links and the More work row buttons, and `scale, border-color` on pills, so GSAP alone owns `transform`. A comment on the menu link records why.
- Spec or architecture change required: no.
- Implementation reference: branch `fix/F-009-mobile-menu`.
- Temporary mitigation used: none.

## Regression verification

- Original reproduction no longer fails: EV-028
- Regression test added: none; the repo has no browser test runner (see `tech.md`)
- Static, test, and build checks: lint, typecheck, `npm test` 23/23, build (recorded with EV-028's run)
- Neighboring flow checked: pill and row transitions read back as `scale, border-color` and `scale` (EV-028)

## Residual risk and follow-up

Any new GSAP-animated element with a Tailwind `transition-transform` class repeats this; keep CSS transitions off properties GSAP animates. Postmortem required: no.
