# Design-adoption gate — donor token probe

- Tokens: stardust/reskin/donor-tokens.json
- Rendered: stardust/migrated/our-community/foundation-tertiary-bursaries/index.html
- Spec: default (rendered-page conventions)
- Generated: 2026-11-05T10:30:50.518Z

## Assertions — 9/9 pass (6 skipped)

- [x] page bg = rgb(242, 240, 239) — rgb(242, 240, 239)
- [x] body fg = rgb(40, 40, 40) — rgb(40, 40, 40)
- [x] font-family token string = "Apercu Pro", "Helvetica Neue", Helvetica, Arial, sans-serif — "Apercu Pro", "Helvetica Neue", Helvetica, Arial, sans-serif
- [x] body font size = 13px — 13px
- [x] display weight = 400 — 400
- [x] heading color = rgb(0, 0, 0) — rgb(0, 0, 0)
- [ ] (SKIP) primary button bg — the page's content (stardust/reskin/content-model/our-community-foundation-tertiary-bursaries/content-model.json) has no button
- [ ] (SKIP) primary button fg — the page's content (stardust/reskin/content-model/our-community-foundation-tertiary-bursaries/content-model.json) has no button
- [ ] (SKIP) primary button radius — the page's content (stardust/reskin/content-model/our-community-foundation-tertiary-bursaries/content-model.json) has no button
- [ ] (SKIP) primary button padding (±2px) — the page's content (stardust/reskin/content-model/our-community-foundation-tertiary-bursaries/content-model.json) has no button
- [ ] (SKIP) primary button font size — the page's content (stardust/reskin/content-model/our-community-foundation-tertiary-bursaries/content-model.json) has no button
- [ ] (SKIP) container max-width (±20px) — all 5 match(es) declare an override (.inset > .container)
- [x] section rhythm (±16px) = 80px — 80px
- [x] no horizontal overflow @1440 — overflow=0px
- [x] no horizontal overflow @360 — overflow=0px

**Overall: PASS**

> The probe proves tokens; it does not prove the page READS as the donor.
> Complete the gate with the side-by-side eyeball vs the donor screenshots
> (stardust/canon-source/assets/screenshots/) per reference/gates.md.
