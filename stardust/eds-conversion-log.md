# EDS conversion log — Fort Street High School × Signet (Kay) reskin

Prototypes: `stardust/reskin/pages/<slug>.html` (gated reskin pages). Content generated from their `<main>` by
`stardust/reskin/renderers/eds-content.mjs` (strings/hrefs/images read from the DOM, never retyped).
Isolation: `--namespace reskin` — every written path starts with `/reskin/` (pages, `/reskin/nav`, `/reskin/footer`).

## Step 2 — locked names (D1 / D11)

| Module | EDS | Tier | Used by |
|---|---|---|---|
| M1 Full-bleed photo hero | `hero` | template-slotted | home s01 |
| M9 Photo banner | `hero (banner)` | template-slotted | home s05, content s07 (quote band, no image) |
| M2 Split grid banner | `cards` | reconstructive | home s02 |
| M11 Value-props band | `cards (value)` (+ `tinted` band) | reconstructive | home s06, content s03 / s08 |
| M10 Social stories strip | `cards (social)` | reconstructive | home s09 (static snapshot of the Facebook feed) |
| M6 Editorial stagger | `columns (editorial)` (+ `tinted` → h2 role on the greige band) | reconstructive | home s03, s08 |
| M7 Split feature | `columns (split)` | reconstructive | home s04 |
| new-module Accordion | `accordion` (Block Collection, D11) | reconstructive | content s04 |
| M5 Centered statement band | default content, style `statement` | — | home s07 |
| M5 (prose) | default content | — | content s02, s05, s06 |
| M3 Category tile rail (tab row) | default content, style `breadcrumb` / `section-nav` | — | content s01, s09 |
| M13 / M12 | `header` / `footer` (authored `/reskin/nav`, `/reskin/footer`) | template-slotted | chrome |

Section `style` values (closed set): `statement`, `breadcrumb`, `section-nav`.

## Lint advisories (🟡 D1) — justified

- `hero` blocks (home s01, s05; content s07): bespoke media-band composition — the image is a cover layer behind a panel; prose alone cannot express it.
- `cards (value)` on content s08 (2 rows): a repeating unit (link card), same block as s03.

## Encode decisions

- Home's hero heading is authored `<h1>` (the source authors it `<h1>`; its block JS re-tags it h4). One h1 per page.
- Card titles: the reskin page's title link → `<h3><a>`; text unchanged.
- CTAs rendered as `.btn` on the reskin page → `<strong><a>` (primary); paragraph links stay plain links (mirrors the reskin page).
- Runtime decoration (allowlisted generated text, `reference/ai-readability.md`): the Material Icons ligature words the source
  carries — `east` (card arrow, cards block), `keyboard_arrow_down` (accordion), and the sr-only `(opens in new window)`
  suffix on external non-button links (scripts.js `decorateExternalLinks`, the source site's own behaviour).
- Facebook feed: the source block fetches posts client-side; carried as a static snapshot (images rehosted to DA media —
  fbcdn URLs are signed and 403 when hotlinked). Dynamic dependency — see `stardust/dynamic-features.md`.

## Fonts

Apercu Pro (licensed, Figma supplies no files): declared as the token string; `Helvetica Neue` / Helvetica / Arial render.
No `@font-face` shipped. `font.unserved` residual recorded.

## Links (localize after every generation)

`eds-content.mjs` writes each captured href as the source URL (`https://fortstreet-h.schools.nsw.gov.au/…`).
Before every `deploy-batch` — and after ANY regeneration of a page — localize the whole tree, then assert:

```bash
node stardust/scripts/deploy/localize-links.mjs --source-host fortstreet-h.schools.nsw.gov.au --content content --prefix /reskin
node stardust/scripts/deploy/localize-links.mjs --source-host fortstreet-h.schools.nsw.gov.au --content content --prefix /reskin --check
```

2026-11-06: 1013 links localized onto `/reskin/…` (nav, footer, 51 pages, home, 3 library samples) — they had shipped
pointing at the old site. Kept absolute (not in the migration): `/enrol`, `/about-our-school/exit-profile`, and the
source's malformed `/learning-and-support/www.primaryethics.com.au`. `deployed-gate inherited` (`internal links`)
fails a page, nav or footer that links back to the old site.
