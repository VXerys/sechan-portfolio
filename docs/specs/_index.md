---
id: FEATURE-REGISTRY
title: Feature Registry
status: template
owner: "M Sechan Alfarisi"
last_updated: "2026-10-16"
---

# Feature Registry

This file is the durable navigation registry for feature specifications.

Task status belongs in each feature's `tasks.md`; `docs/context/state.yaml` and the context views are rendered from it.

| Feature ID | Feature | Spec path | Product priority | Lifecycle gate | Related milestone |
|---|---|---|---|---|---|
| `F-001` | portfolio site | `docs/specs/F-001-portfolio-site/` | P0 | approved | M1 |
| `F-002` | visual refresh and testimonials | `docs/specs/F-002-visual-refresh-testimonials/` | P1 | approved | M1 |
| `F-003` | intro, cursor, scroll choreography | `docs/specs/F-003-intro-cursor-choreography/` | P1 | approved | M1 |
| `F-004` | freelance-first copy, greeting intro, contact CTA | `docs/specs/F-004-freelance-copy-contact/` | P1 | approved | M1 |

## Lifecycle gate meaning

- `draft`: specification is being written;
- `review`: awaiting product or architecture review;
- `approved`: contract is approved and may enter execution planning;
- `implemented`: accepted implementation exists;
- `superseded`: replaced by another feature contract.

Do not update this file for every task transition. The context system owns mutable progress.
