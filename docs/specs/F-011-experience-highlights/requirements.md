---
id: F-011
title: "Experience highlights and clinic naming"
type: requirements
status: implementing
tier: lite
owner: "M Sechan Alfarisi"
created: 2026-10-17
last_updated: 2026-10-17
last_verified: 2026-10-17
supersedes: null
---

# Requirements: Experience highlights and clinic naming

## Problem

The Experience section lists only paid work. The owner's Asah program, the AI engineering fellowship he wants recruiters to notice first, appears only as one line in Proof, and his university and the projects he built there are missing. The clinic, which has now approved being shown by name, is still described anonymously.

## Goal

A recruiter scanning Experience sees the Asah fellowship first, then his work history, then his degree with the projects built while studying, and the clinic carries its real name.

Non-goals: a capstone line before about-me records it as VERIFIED; testimonials (held by the owner until all reviews arrive).

## Functional requirements

### FR-033 — Asah highlight

- AC-054: Given the Experience section, when it renders, then a highlight card above the rows shows "Asah 2026 led by Dicoding supported by GoTo", "Next-Gen AI Engineer path", the role "Fellow", "Aug 2026 - Jan 2027", and "In progress".
- AC-055: Given no capstone recorded as VERIFIED in about-me, when the card renders, then it names no capstone partner.

### FR-034 — Education and projects built while studying

- AC-056: Given the Experience section, when it renders, then a row labelled "Education" shows "Universitas Nusa Putra", "S.Kom. Informatics Engineering", "Sep 2023 - 2027 (expected)", and "GPA 3.73".
- AC-057: Given the education row, when it renders, then a "Built while studying" group lists Gunung Puyuh WebGIS, ArtConnect (Web Programming course), Cartify (Research Methodology and Mobile Programming), and Fluxa (independent).
- AC-058: Given one of those projects, when its chip is clicked, then the page moves to its case study, or to its More work row and opens it.

### FR-035 — Clinic naming

- AC-059: Given the clinic project and the freelance entry, when they render, then both name "Klinik Cikidang Medika".
- AC-060: Given `npm test`, when it runs, then the anonymity tests are replaced by one that checks the approved name, and testimonials are still checked for phone numbers.

## Business and validation rules

- BR-011: Experience shows only facts labelled VERIFIED in about-me (as BR-001). The capstone partner joins the card only after about-me records it.

## Open questions

None. A-001 is confirmed by the owner on 2026-10-17.
