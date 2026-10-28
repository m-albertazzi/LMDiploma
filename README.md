# Diploma for Labour Migration Experts and Practitioners: landing page

A static, dependency-free landing page for the ITCILO Diploma for Labour Migration Experts and Practitioners. It explains the Diploma, lists the eligible 2027 courses with a detail drawer, and includes a planner for the Academy plus three electives.

- No build step, no frameworks, no external requests (fonts and images are self-hosted).
- All links are relative, so it works at `https://<user>.github.io/LMDiploma/` and from a local folder.
- Content lives in `data/lm-diploma-data.js`. Narrative copy (overview, pathway, FAQs) lives in `index.html`.

## Preview locally

Opening `index.html` directly works. For a closer match to hosting, serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

To test the `/LMDiploma/` subpath, serve the parent folder of a directory named `LMDiploma`.

## Update content

Everything about courses is in `data/lm-diploma-data.js`: dates, format, face-to-face block, language, deadline, descriptions, images, official and application links, and thematic clusters. After editing, run:

```bash
node scripts/validate-data.mjs
```

It catches missing fields, bad dates, face-to-face dates outside the course period, and missing images.

Rules built into the data model:

- The site does not show fees. There is no fee field in the data file.
- A course shows an **Apply** button only when `applyUrl` is set. Leave it `null` otherwise.
- `languagesVerified: false` makes the page show `languageNote` instead of a language.
- The `review` arrays hold open questions. They show only while `meta.showReviewFlags` is `true` (a review panel at the bottom and "Dates to confirm" tags). **Set it to `false` before launch.**

To add a course for a new year, add an entry to `courses` (the page sorts by start date and groups by month). The planner and filters pick it up automatically. The planner text says "2027"; search `index.html` and `assets/js/app.js` for `2027` when rolling the calendar forward.

## Replace assets

| What | Where | Notes |
| --- | --- | --- |
| Hero illustration | `assets/img/hero-{640,960,1280,1800}.webp`, `hero-1280.jpg` | Square. Keep the same file names, or update `index.html` (`srcset` and preload). |
| Illustration strips between sections | `assets/img/strip-*-{900,1800}.webp` | Slices of the same illustration (3:1). |
| Course images | `assets/img/courses/<id>.webp` | Set the path in the data file. Aim for 800 px wide or more. The digital transformation course has no image yet; add one and set `image` and `imageAlt`. |
| Logos | `assets/img/itc-logo*.png`, `ilo-logo.png`, `diploma-emblem.png` | Official files. Do not edit, recolour or redraw. |
| Flyer | `assets/docs/LM-Diploma-flyer.pdf` | Keep the file name, or change `programme.flyer` in the data file and the link in `index.html`. |
| Social sharing image | `assets/img/og-image.jpg` | 1200 x 630. |
| Artwork credit | `credits.display` in the data file | Shown in the footer when set. |

## Branding notes

- Colours: ITCILO Blue 100% `#284B96`, Cyan 100% `#00A3E0`, Black 100% `#2B2A29`, plus cream, sand, ochre, terracotta, teal and dusty blue sampled from the illustration. Cyan is used for accents and graphics, not for small text on light backgrounds, where it does not reach the contrast needed.
- Type: Noto Sans variable font with a width axis (`assets/fonts`, SIL Open Font License). Headings use the ExtraCondensed width, body text SemiCondensed. Text is left-aligned.
- Logo: official ITC logo, top right of the header and bottom right of the footer, on white, with clear space around it. The ILO logo and Diploma emblem sit to its left. The blue logo is only used on white grounds.

## Deploy on GitHub Pages

Nothing has been published. When you are ready:

1. Commit these files to the `main` branch of `m-albertazzi/LMDiploma`.
2. In the repository go to **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. The site appears at `https://m-albertazzi.github.io/LMDiploma/`. `.nojekyll` is included.
4. The canonical, `og:url` and `og:image` addresses in `index.html` already assume that address. Change them if the site is hosted elsewhere.

**Check before step 2:** at the time of writing the repository is **private** and owned by a personal account (`m-albertazzi`). GitHub Pages for a private repository on a personal account needs a paid GitHub plan; on the free plan Pages works only for public repositories. This could not be checked from the build environment (the Pages settings are not readable there). Repository visibility has not been changed. Making it public publishes the source and the ITCILO logo files, so decide that deliberately.

## Quality checks that were run

Automated (Playwright + axe-core) on desktop 1440 px and mobile 390 px, served under `/LMDiploma/`: no console errors or failed requests, no horizontal overflow, all images load, filters, drawer (focus, Escape, focus return, backdrop, deep link), planner (limit of three, overlap warning, persistence, print sheet), keyboard tabs and menu, reduced motion, no-JavaScript fallback, and zero axe violations for WCAG 2.1 A/AA and best practice. See `docs/VERIFICATION-LOG.md`.

## Files

```
index.html                 page structure and narrative copy
data/lm-diploma-data.js    programme facts, clusters, courses, review notes
assets/css/styles.css      styles
assets/js/app.js           explorer, drawer, planner, tabs, navigation
assets/img, fonts, docs    images, self-hosted fonts, flyer
scripts/validate-data.mjs  data checks
docs/VERIFICATION-LOG.md   sources, dates checked, discrepancies
```
