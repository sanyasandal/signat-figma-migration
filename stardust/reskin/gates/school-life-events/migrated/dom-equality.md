# Content gate — DOM equality report (reskin profile)

- Source: https://fortstreet-h.schools.nsw.gov.au/school-life/events (scopes: `nav.nsw-breadcrumbs!,main,aside.nsw-layout__sidebar--desktop!`, normalize: `/Users/ssandal/repos/dummy_repos/signat-figma-migration/stardust/reskin/normalize/school-life-events.mjs`)
- Rendered: stardust/migrated/school-life/events/index.html (scope: `main`)
- Generated: 2026-11-05T20:29:51.066Z

## Primary checks (gating)

| Check | Source | Rendered | Status |
|---|---|---|---|
| Visible text (normalized chars) | 5063 | 5131 | FAIL |
| Visible images (count+alt+width) | 18 | 18 | PASS |
| Disclosures collapsed at rest | 0 (0 open) | 0 (0 open) | PASS |

**Overall: FAIL**

### Text divergence

First divergent char at 3817 (source 5063 / rendered 5131 chars).

Source:

> …ver more events Follow us on Facebook. That's a wrap, Class of 2026! 🎬 HSC exams are officially done and dusted, and 13…

Rendered:

> …ver more events Follow us on Facebook. Today we celebrate World Teachers Day! 🍎 👩‍🏫 🏫 ⭐️ We have an amazing team of …

## Informational (non-gating — a reskin re-structures markup by design)

- Element count: source=440 rendered=273 (delta -167)
- Tag+class sequence: diverges at position 0 of 273

## Declared deltas

- File: `stardust/reskin/deltas/school-life-events.json`
- Blocking: `true` (a failed check fails the run)
- The source text above is the text after the declared deltas
- Images: count+alt+width — the 18 visible rendered image(s) against the 18 on the source
- Applied: none

