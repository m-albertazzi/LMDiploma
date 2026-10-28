# Diploma for Labour Migration Experts and Practitioners

Static, dependency-free-at-runtime ITCILO programme guide, course explorer and Diploma planner. There is no framework or build step. Fonts, images and scripts are self-hosted; course links take visitors to ITCILO.

## Local preview

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. To check the GitHub Pages subpath, serve the parent directory of a folder called `LMDiploma` and open `/LMDiploma/`.

## Updating content

`data/lm-diploma-data.js` holds programme requirements, the calendar year, course descriptions, dates, languages, face-to-face periods, application deadlines and links. Course rows, planner choices, Academy dates, repeated requirement labels and memo exports read these values. Update the readable no-JavaScript fallback copy in `index.html` too when rolling over a year or changing programme requirements. Keep social metadata and branding consistent if the site address or programme name changes.

- Exactly one course is the mandatory Academy. Courses are sorted by start date.
- Leave `applyUrl` null when no application link is available; the site must not invent one.
- `languagesVerified: false` displays `languageNote`. The current Social protection edition is English only, following the coordinator's instruction.
- `deadlineTime` uses 24-hour `HH:MM`; include an IANA `deadlineTimeZone`. Climate mobility closes on **10 October 2027, 23:59, Europe/Rome**, following the coordinator's instruction. `deadlineSource` records provenance.
- `publicNotes: [{ label, text }]` can flag participant-relevant uncertainty. They appear in the course list, course details, planner and memo exports even when internal review notes are hidden. There are no pending public notices after the coordinator's decisions on 28 October 2026.
- `deadlineVerified: false` explicitly qualifies a deadline. It must not look definitive in a saved memo.
- `review` and `globalReview` are historical/internal editorial notes. `meta.showReviewFlags` controls their visibility only; it never hides public notices. Leave it false in production.
- Fees remain omitted, as requested for this site.

Programme decisions and the distinction between official-page checks and coordinator updates are recorded in `docs/VERIFICATION-LOG.md` and `docs/CHANGES-2026-10-28.md`.

## Planner and exports

The planner saves only course IDs in this browser's local storage; nothing is submitted. Restored selections are validated, deduplicated and limited to the required number of courses. Storage failure does not prevent planning and is explained to the visitor.

- **Print / save PDF** opens the browser's print window for a memo made from semantic HTML. Choose Save as PDF there. PDF accessibility varies with the browser; this is not a claim of PDF/UA conformance.
- **Download memo (HTML)** saves a standalone UTF-8 document with headings, definition lists, clickable course/application links and any public notices. It preserves non-Latin text, needs no scripts, and can be opened offline. Course and contact links naturally need a connection.

The handwritten PDF serializer has been removed. Both memo routes share the same content builder in `assets/js/planner-utils.js`.

## Checks

Node 22 or newer is recommended. Development tools are not loaded by the published page.

```sh
npm ci
npx playwright install --with-deps chromium
npm run check
```

- `npm run validate`: dates, course identifiers, required fields, face-to-face ranges, assets, deadline times/timezones and notices.
- `npm test`: malformed/duplicate saved plans, Unicode and escaped memo content, public notices, programme data and coordinator decisions.
- `npm run test:browser`: a temporary local server under `/LMDiploma/`, desktop/mobile Chromium, filters, tabs, menu, modal focus, planner limits/overlaps/persistence, disabled/corrupt storage, HTML download, print layout, no-JavaScript fallback and axe accessibility checks.

Screenshots and memo samples are written to ignored `test-results/`; set `ARTIFACT_DIR` to choose another location. GitHub Actions repeats `npm run check` on main-branch pushes and pull requests. Automated accessibility checks supplement manual review; they are not full WCAG certification. Screen-reader and Safari/Firefox testing are still separate checks.

## Design and assets

The blue/cream palette, Noto Sans display headings, original illustration and official logos are retained. Body text uses normal width. On mobile the title and introduction precede the illustration. The interactive illustration is visible above the filters and course list. Its accompanying text explains how individual courses connect into a wider Diploma pathway.

Keep official logos unchanged. Course cover paths and descriptions live in the data file; hero images use responsive WebP sources in `index.html`. The flyer is `assets/docs/LM-Diploma-flyer.pdf`. Image credit is `credits.display`.

## GitHub Pages

The public site is `https://m-albertazzi.github.io/LMDiploma/`. It uses the `main` branch, root folder and `.nojekyll`. No build output or bundled dependencies are needed. Pushing to the published branch triggers Pages; verify the resulting Pages workflow and live page after a release.

## Files

```
index.html                    page structure and fallback narrative
assets/css/styles.css         responsive layout and print styles
assets/js/app.js              navigation, filters, dialogs and planner
assets/js/planner-utils.js    saved-plan rules and memo content
data/lm-diploma-data.js       programme and course data
scripts/validate-data.mjs      content checks
tests/                        repeatable unit and browser checks
.github/workflows/checks.yml   automated checks
assets/img, fonts, docs        self-hosted assets
```
