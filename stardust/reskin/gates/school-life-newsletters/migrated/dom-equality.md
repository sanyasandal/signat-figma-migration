# Content gate — DOM equality report (reskin profile)

- Source: https://fortstreet-h.schools.nsw.gov.au/school-life/newsletters (scopes: `nav.nsw-breadcrumbs!,main,aside.nsw-layout__sidebar--desktop!`, normalize: `/Users/ssandal/repos/dummy_repos/signat-figma-migration/stardust/reskin/normalize/school-life-newsletters.mjs`)
- Rendered: stardust/migrated/school-life/newsletters/index.html (scope: `main`)
- Generated: 2026-11-05T20:30:15.115Z

## Primary checks (gating)

| Check | Source | Rendered | Status |
|---|---|---|---|
| Visible text (normalized chars) | 3537 | 3605 | FAIL |
| Visible images (count+alt+width) | 4 | 3 | FAIL |
| Disclosures collapsed at rest | 14 (0 open) | 14 (0 open) | PASS |

**Overall: FAIL**

### Text divergence

First divergent char at 2317 (source 3537 / rendered 3605 chars).

Source:

> …s, events and updates from our school. That's a wrap, Class of 2026! 🎬 HSC exams are officially done and dusted, and 13…

Rendered:

> …s, events and updates from our school. Today we celebrate World Teachers Day! 🍎 👩‍🏫 🏫 ⭐️ We have an amazing team of …

### Image divergences

- count: source 4, rendered 3
- [0] alt: source "", rendered "Facebook post image"

## Informational (non-gating — a reskin re-structures markup by design)

- Element count: source=315 rendered=200 (delta -115)
- Tag+class sequence: diverges at position 0 of 200

## Declared deltas

- File: `stardust/reskin/deltas/school-life-newsletters.json`
- Blocking: `true` (a failed check fails the run)
- The source text above is the text after the declared deltas
- Images: count+alt+width — the 3 visible rendered image(s) against the 4 on the source
- Applied: none

