# Slot-coverage + metadata report

- Model: stardust/reskin/content-model/about-us-facilities-and-resources/content-model.json
- Rendered: stardust/migrated/about-us/facilities-and-resources/index.html (scope: `main`)
- Generated: 2026-11-05T07:08:40.596Z

## slot-coverage — 25/26 pass

- [x] s01 text present — HomeAbout usFacilities and resources
- [x] s01 CTA "Home" -> https://fortstreet-h.schools.nsw.gov.au/
- [x] s01 CTA "About us" -> https://fortstreet-h.schools.nsw.gov.au/about-us
- [ ] s01 CTA "Facilities and resources" -> 
- [x] s02 text present — Facilities and resources Our school offers a range
- [x] s03 text present — Our school facilities We offer a range of learning
- [x] s03 images (count+alt+width) — 3 image(s): count, alt and width agree
- [x] s04 text present — Hiring our facilities You may apply to use our sch
- [x] s04 CTA "Using school facilities" -> https://education.nsw.gov.au/about-us/using-school-facilitie
- [x] s04 CTA "contact us" -> https://fortstreet-h.schools.nsw.gov.au/contact-us.html
- [x] s04 images (count+alt+width) — 1 image(s): count, alt and width agree
- [x] s05 text present — Learning Discover what students learn in our class
- [x] s05 CTA "Learning" -> https://fortstreet-h.schools.nsw.gov.au/learning-and-support
- [x] s05 CTA "Student opportunities and acti" -> https://fortstreet-h.schools.nsw.gov.au/school-life/student-
- [x] s06 text present — Section navigation About us Enrol Facilities and r
- [x] s06 CTA "About us" -> https://fortstreet-h.schools.nsw.gov.au/about-us
- [x] s06 CTA "Enrol" -> https://fortstreet-h.schools.nsw.gov.au/about-us/enrol
- [x] s06 CTA "Facilities and resources" -> https://fortstreet-h.schools.nsw.gov.au/about-us/facilities-
- [x] s06 CTA "HSC Results" -> https://fortstreet-h.schools.nsw.gov.au/about-us/hsc-results
- [x] s06 CTA "Our principal and staff" -> https://fortstreet-h.schools.nsw.gov.au/about-us/our-princip
- [x] s06 CTA "Policies and reports" -> https://fortstreet-h.schools.nsw.gov.au/about-us/policies-an
- [x] s06 CTA "School history and archives" -> https://fortstreet-h.schools.nsw.gov.au/about-us/school-hist
- [x] s06 CTA "Stories and highlights" -> https://fortstreet-h.schools.nsw.gov.au/about-us/stories-and
- [x] s06 CTA "Transition to high school" -> https://fortstreet-h.schools.nsw.gov.au/about-us/transition-
- [x] s06 CTA "Why choose us?" -> https://fortstreet-h.schools.nsw.gov.au/about-us/why-choose-
- [x] images total (count+alt+width) — 4 image(s): count, alt and width agree

## paint — 4/4 pass

- [x] s03 image "Students" painted
- [x] s03 image "Students at Memorial Hall" painted
- [x] s03 image "students at the library" painted
- [x] s04 image "outdoor facilities" painted

## metadata — 9/9 pass

- [x] title — Facilities and resources
- [x] description
- [x] og og:title
- [x] og og:description
- [x] og og:image:alt
- [x] tw twitter:card
- [x] tw twitter:title
- [x] tw twitter:description
- [x] jsonLd block count — 0/0

**Overall: FAIL**

## Declared deltas

- File: `stardust/reskin/deltas/about-us-facilities-and-resources.json`
- Blocking: `true` (a failed check fails the run)
- Images: count+alt+width over the visible images in scope (as the model capture counts them): per slot, positional by cumulative count (slot s takes the next k), plus one total over every image. An image moved across a slot boundary with the document order kept, or replaced by one with the same alt, is not detected
- Links: localize not applied (the rendered target is not an http(s) origin)
- JSON-LD: count-only (the block count is compared, not the content)
- Applied: none
- Ignored by delta: canonical, og:url, og:image, og:image:secure_url, twitter:image

