---
id: ASSUMPTIONS
title: Assumptions Log
status: active
owner: "M Sechan Alfarisi"
last_updated: "2026-10-18"
---

# Assumptions

Agents and contributors log unknowns here instead of guessing. An `open` assumption blocks the tasks it affects, and a feature cannot become `implemented` while it has an `open` assumption. The owner resolves entries to `confirmed` or `rejected` and records the resolution; rejected assumptions stay in the log.

## Block format

Every entry uses exactly this shape; the key-value lines are parsed.

```markdown
### A-001 — title
- status: open          # open | confirmed | rejected
- feature: F-001
- raised: YYYY-MM-DD
- resolution:

What was assumed, why it could not be verified, and what changes if it is wrong.
```

## Entries

### A-001 — Client names may appear on the public site
- status: open
- feature: F-001
- raised: 2026-10-16
- resolution: 2026-10-16, owner in chat: every client may be named except Klinik Cikidang Medika, whose permission is being requested. The site shows "a primary care clinic in Sukabumi" until the clinic agrees; then this entry becomes confirmed.

The project list names Klinik Cikidang Medika, VisualKain, InztaMoto, and PT Mangcoding client apps (Welling, Ayah Hebat). The `about-me` sources record the work but not explicit permission to name each client publicly. If any client objects, replace the name with a generic description ("a primary care clinic in Sukabumi") before deploy.

### A-002 — Product screenshots may appear on the public site
- status: confirmed
- feature: F-001
- raised: 2026-10-16
- resolution: 2026-10-16, owner in chat ("untuk seluruh client itu diperbolehkan"). Welling and Ayah Hebat screenshots stay out anyway: they show real end users' names and photos.

`src/assets/images/` uses the BookMate Google Play listing frame (Mangcoding property, already public on the store) and Marketiv screenshots with demo data. The clinic dashboard design was not used because it shows a staff name and figures that may be real. Every other project uses a placeholder. If a screenshot is not cleared, swap it for the placeholder before deploy.

### A-003 — Testimonials are real, attributed, and approved
- status: open
- feature: F-002
- raised: 2026-10-16
- resolution:

The testimonials section renders only entries with a recorded consent date. No quote exists yet; the owner is requesting them with `docs/outreach/client-testimonial-templates.md`. A quote is never written or edited by the agent beyond typo fixes the client approves.

### A-004 — Mangcoding allows Welling and Ayah Hebat listing images
- status: confirmed
- feature: F-010
- raised: 2026-10-17
- resolution: 2026-10-18, owner in chat: Mangcoding has given permission. Real end-user names and photos in the Welling screens are still covered with sample values (BR-013).

The owner asked (2026-10-17) for a "UI slicing" listing set for Welling and Ayah Hebat, built from existing screenshots. A-002 kept those screenshots off the site because Welling's show real end users' names and photos. The plan covers every real name and photo with sample values; what is not recorded is whether Mangcoding, which owns the client relationship, allows the set. T-047 stays blocked until the owner confirms. If Mangcoding declines, the project keeps its poster.
