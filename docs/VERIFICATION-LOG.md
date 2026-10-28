# Source and verification log

Checked on **28 October 2026** by reading the official ITCILO pages through the build environment's web tools. Direct downloads from itcilo.org were not possible from the shell, so official cover images and live application pages could not be fetched or opened.

## Supplied materials used

| Material | Used for |
| --- | --- |
| Diploma presentation (.pptx) and its PDF export | Programme structure, 300 hours, five years, clusters, practicalities, hero illustration (3000 px), course illustrations, logos and Diploma emblem |
| Diploma flyer (PDF) | Requirements summary, downloadable flyer |
| Review of landing page text (.docx) | Plain-English programme description, audience, design, assessment |
| 2027 course calendar (image) | Course dates, formats, face-to-face weeks. Its QR code points to the labour migration catalogue |
| ITCILO Brand Guidelines, April 2026 | Colours, Noto Sans, logo rules, official ITC logo (cropped at high resolution from page 4 of the PDF, unmodified) |

## Sources that could not be used

| Source | Result |
| --- | --- |
| https://macielte-collab.github.io/online-mier-2026-2027/#home | Not reachable from the build environment (not on the fetch allowlist). Not used. |
| Catalogue with topic filter `field_topics[167]=167` | The filtered URL was not fetchable. The unfiltered catalogue (205 courses) was read and the labour migration entries extracted. The QR code on the calendar decodes to this filtered URL, which is linked in the page. |
| `oarf2.itcilo.org` application pages | Not reachable. Application links are copied from the "Apply now" buttons on the official course pages and are not live-tested. |
| LinkedIn address | The presentation gives only the handle `@itcilomigration`. |
| Repository settings | Visibility (private) read; Pages settings not readable. |

## Official pages checked (2027 editions)

| Course | Official page | Calendar match | Notes |
| --- | --- | --- | --- |
| Skills dimensions of labour migration and mobility | https://www.itcilo.org/courses/skills-dimensions-labour-migration-and-mobility | Dates match. Deadline 1 Mar 2027. Code A9720103. English | Page text on course structure still describes 2024 |
| Developing, Negotiating and Implementing Bilateral Labour Migration Agreements | https://www.itcilo.org/courses/developing-and-implementing-bilateral-labour-agreements | Dates and face-to-face match. Deadline 12 Mar 2027. Code A9719827. English | Catalogue uses a different path for the same course (node 2103) |
| Access to decent work for refugees and other forcibly displaced persons | https://www.itcilo.org/courses/access-decent-work-refugees-and-other-forcibly-displaced-persons | Match. Deadline 30 Apr 2027. Code A9720020. English | |
| Digital transformation for inclusive labour migration governance | https://www.itcilo.org/courses/digital-transformation-inclusive-labour-migration-governance | Dates match. Deadline 7 May 2027. Code A9020021. English | Format ambiguity (see below) |
| Academy on Labour Migration | https://www.itcilo.org/courses/academy-labour-migration | Match (online 28 Jun to 16 Jul, Turin 19 to 23 Jul, online 26 to 30 Jul). Deadline 4 Jun 2027. Code A9720022. English and French | |
| Establishing Fair Recruitment Processes | https://www.itcilo.org/courses/establishing-fair-recruitment-processes | Calendar differed on face-to-face; **site now follows the official page** (11 to 15 Oct 2027). Deadline 27 Aug 2027. Code A9720027. English | See D1 |
| Measuring and analysing labour migration | https://www.itcilo.org/courses/measuring-analysing-labour-migration | **No 2027 edition published.** Official page shows 12 Oct to 13 Nov 2026 only | See D3 |
| Extending Social Protection to Migrant Workers, Refugees and their Families | https://www.itcilo.org/courses/extending-social-protection-migrant-workers-refugees-and-their-families | Calendar differed on the end date; **site now follows the official page** (18 Oct to 12 Nov 2027). Deadline 18 Sep 2027. Code A9720028 | See D2 |
| Exploring the labour dimensions of climate change and human mobility | https://www.itcilo.org/courses/exploring-labour-dimensions-climate-change-and-human-mobility | Dates match. Deadline 3 Dec 2027. Code A9720023. English | See D5 |

Diploma page: https://www.itcilo.org/diplomas/diploma-labour-migration-experts-and-practitioners (checked the same day).

## Discrepancies and open items

| # | Item | Supplied | Official | What the page does |
| --- | --- | --- | --- | --- |
| D1 | Fair recruitment face-to-face dates | 12 to 16 Oct 2027 (Tue to Sat) | 11 to 15 Oct 2027 (Mon to Fri); online 20 Sep to 8 Oct and 18 to 22 Oct | **Resolved at the client's request: the site now shows the official page dates** (face-to-face 11 to 15 Oct 2027). Tell the calendar owner to correct the calendar |
| D2 | Social protection overall end date | 18 Oct to 19 Nov 2027 | 18 Oct to 12 Nov 2027 (online to 5 Nov, Turin 8 to 12 Nov). Catalogue agrees | **Resolved: the site now shows the official page dates** (end 12 Nov 2027). The calendar needs correcting |
| D3 | Measuring and analysing, 2027 edition | 11 Oct to 19 Nov 2027, online | Not listed. No deadline, code or application link | Shows the calendar value with a flag. No Apply button |
| D4 | Digital transformation format | Face-to-face, Turin | Labelled face-to-face but describes a 15-hour online phase; 2026 edition was blended with online weeks | Shows face-to-face, with a flag asking for confirmation |
| D5 | Climate course | n/a | Application deadline equals the end date (3 Dec 2027); "Apply now" button has no link | Shows the deadline as published; no Apply button; flag |
| D6 | Social protection language | n/a | Header says English; body says English and French | Shows "language to be confirmed" |
| D7 | Diploma languages | Presentation: courses in English, Academy in English and French, others on request | Diploma page: Diploma available in English, French and Spanish | Page follows the presentation and does not imply every course is in every language |
| D8 | Eligible list on the official Diploma page | Calendar lists nine courses | Page also lists the Digital Governance Academy (7 to 11 Dec 2026) and two courses with 2026 dates | Digital Governance Academy not shown. Needs a decision |
| D9 | Courses in clusters without a 2027 edition | Protecting the rights of migrants in the labour force; Reintegration of return migrants and former refugees | Not checked on official pages | Mentioned in a note only |
| D10 | Fees | n/a | n/a | **Removed from the site at the client's request.** No fee information appears anywhere on the page or in the data file |
| D11 | Course images | Deck illustrations | Official cover images (e.g. A9720022.png) not downloadable | Deck illustrations used. Digital transformation has a designed placeholder |
| D12 | Artwork credits | none | Brand guidelines require credits | `credits.display` is empty. Add the artist credit |
| D13 | Capstone and five-year rules | Not specified how submission works or when the five years start | n/a | FAQ points to migration@itcilo.org |

Other facts used and where they come from: 300 hours, five years, three electives, Academy mandatory but not necessarily first, no separate Diploma intake, nominations by email (presentation, flyer, docx, Diploma page); address (official course pages); Academy languages and "simultaneous translation for plenary" (Academy page).

## Test results (28 October 2026)

Playwright (Chromium) against the site served at `/LMDiploma/`, desktop 1440x900 and mobile 390x844, plus axe-core 4 (WCAG 2.0/2.1 A and AA, best practice): 101 of 101 checks passed. Covered: console and network errors, overflow, image loading, hero priority, lazy course images, chronological order, every filter combination and reset, drawer open/close/focus/trap/backdrop/deep link, Apply button only where a link exists, fee labelling, planner limit/overlap/persistence/print sheet/print media, tab and menu keyboard behaviour, reduced motion, no-JavaScript fallback, local asset paths.

Fees were removed and dates aligned on 28 October 2026 (afternoon); the suite was re-run after those changes.

Not tested: real printing to paper or PDF in other browsers, Safari and Firefox, screen readers, live application and external links.
