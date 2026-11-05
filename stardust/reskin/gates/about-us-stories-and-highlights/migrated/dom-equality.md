# Content gate — DOM equality report (reskin profile)

- Source: https://fortstreet-h.schools.nsw.gov.au/about-us/stories-and-highlights (scopes: `nav.nsw-breadcrumbs!,main,aside.nsw-layout__sidebar--desktop!`, normalize: `/Users/ssandal/repos/dummy_repos/signat-figma-migration/stardust/reskin/normalize/about-us-stories-and-highlights.mjs`)
- Rendered: stardust/migrated/about-us/stories-and-highlights/index.html (scope: `main`)
- Generated: 2026-11-05T20:34:04.896Z

## Primary checks (gating)

| Check | Source | Rendered | Status |
|---|---|---|---|
| Visible text (normalized chars) | 5053 | 5121 | FAIL |
| Visible images (count+alt+width) | 9 | 9 | PASS |
| Disclosures collapsed at rest | 0 (0 open) | 0 (0 open) | PASS |

**Overall: FAIL**

### Text divergence

First divergent char at 3769 (source 5053 / rendered 5121 chars).

Source:

> …s, events and updates from our school. That's a wrap, Class of 2026! 🎬 HSC exams are officially done and dusted, and 13…

Rendered:

> …s, events and updates from our school. Today we celebrate World Teachers Day! 🍎 👩‍🏫 🏫 ⭐️ We have an amazing team of …

## Informational (non-gating — a reskin re-structures markup by design)

- Element count: source=328 rendered=116 (delta -212)
- Tag+class sequence: diverges at position 0 of 116

## Declared deltas

- File: `stardust/reskin/deltas/about-us-stories-and-highlights.json`
- Blocking: `true` (a failed check fails the run)
- The source text above is the text after the declared deltas
- Images: count+alt+width — the 9 visible rendered image(s) against the 9 on the source
- Applied: none

