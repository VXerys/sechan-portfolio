---
id: ASSUMPTIONS
title: Assumptions Log
status: active
owner: "M Sechan Alfarisi"
last_updated: "2026-10-16"
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
- resolution:

The project list names Klinik Cikidang Medika, VisualKain, InztaMoto, and PT Mangcoding client apps (Welling, Ayah Hebat). The `about-me` sources record the work but not explicit permission to name each client publicly. If any client objects, replace the name with a generic description ("a primary care clinic in Sukabumi") before deploy.

### A-002 — Product screenshots may appear on the public site
- status: open
- feature: F-001
- raised: 2026-10-16
- resolution:

`src/assets/images/` uses the BookMate Google Play listing frame (Mangcoding property, already public on the store) and Marketiv screenshots with demo data. The clinic dashboard design was not used because it shows a staff name and figures that may be real. Every other project uses a placeholder. If a screenshot is not cleared, swap it for the placeholder before deploy.
