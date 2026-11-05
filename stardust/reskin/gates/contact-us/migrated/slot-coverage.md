# Slot-coverage + metadata report

- Model: stardust/reskin/content-model/contact-us/content-model.json
- Rendered: stardust/migrated/contact-us/index.html (scope: `main`)
- Generated: 2026-11-05T06:34:45.612Z

## slot-coverage — 25/26 pass

- [x] s01 text present — HomeContact us
- [x] s01 CTA "Home" -> https://fortstreet-h.schools.nsw.gov.au/
- [ ] s01 CTA "Contact us" -> 
- [x] s02 text present — Contact us Want to learn more about our school, sp
- [x] s03 text present — Call, email or visit us Our office is open Monday 
- [x] s03 CTA "fortstreet-h.school@det.nsw.ed" -> mailto:fortstreet-h.school@det.nsw.edu.au
- [x] s03 CTA "8585 1600 (opens in new window" -> tel:9569%204355
- [x] s03 images (count+alt+width) — 1 image(s): count, alt and width agree
- [x] s04 text present — Location map We are located at 620 PARRAMATTA ROAD
- [x] s04 CTA "Skip Google Map" -> https://fortstreet-h.schools.nsw.gov.au/contact-us#after-map
- [x] s05 text present — Check if you're in our local intake area Many NSW 
- [x] s05 CTA "School Finder" -> https://schoolfinder.education.nsw.gov.au/
- [x] s06 text present — Need an interpreter? The Telephone Interpreting Se
- [x] s06 CTA "Telephone Interpreting Service" -> https://education.nsw.gov.au/schooling/translated-documents/
- [x] s07 text present — Have a concern or feedback? We’re here to help. If
- [x] s07 CTA "fortstreet-h.school@det.nsw.ed" -> mailto:fortstreet-h.school@det.nsw.edu.au
- [x] s08 text present — Travel to school Learn about local transport optio
- [x] s08 CTA "Travel to school" -> https://fortstreet-h.schools.nsw.gov.au/school-life/travel-t
- [x] s08 CTA "Our community" -> https://fortstreet-h.schools.nsw.gov.au/our-community/pandc
- [x] s09 text present — Section navigation About us Contact us Learning an
- [x] s09 CTA "About us" -> https://fortstreet-h.schools.nsw.gov.au/about-us
- [x] s09 CTA "Contact us" -> https://fortstreet-h.schools.nsw.gov.au/contact-us
- [x] s09 CTA "Learning and support" -> https://fortstreet-h.schools.nsw.gov.au/learning-and-support
- [x] s09 CTA "Our community" -> https://fortstreet-h.schools.nsw.gov.au/our-community
- [x] s09 CTA "School life" -> https://fortstreet-h.schools.nsw.gov.au/school-life
- [x] images total (count+alt+width) — 1 image(s): count, alt and width agree

## paint — 1/1 pass

- [x] s03 image #1 painted

## metadata — 8/8 pass

- [x] title — Contact us
- [x] description
- [x] og og:title
- [x] og og:description
- [x] tw twitter:card
- [x] tw twitter:title
- [x] tw twitter:description
- [x] jsonLd block count — 0/0

**Overall: FAIL**

## Declared deltas

- File: `stardust/reskin/deltas/contact-us.json`
- Blocking: `true` (a failed check fails the run)
- Images: count+alt+width over the visible images in scope (as the model capture counts them): per slot, positional by cumulative count (slot s takes the next k), plus one total over every image. An image moved across a slot boundary with the document order kept, or replaced by one with the same alt, is not detected
- Links: localize not applied (the rendered target is not an http(s) origin)
- JSON-LD: count-only (the block count is compared, not the content)
- Applied: none
- Ignored by delta: canonical, og:url, og:image, og:image:secure_url, twitter:image

