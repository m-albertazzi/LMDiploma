import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = '/LMDiploma/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const name = pathname.startsWith(base) ? pathname.slice(base.length) || 'index.html' : '';
  const filename = path.resolve(root, name);
  if (!name || !filename.startsWith(root + path.sep)) { res.writeHead(404).end(); return; }
  try { res.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream'); res.end(await readFile(filename)); }
  catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}${base}`;
const browser = await chromium.launch({ headless: true, channel: 'chromium', executablePath: process.env.CHROMIUM_EXECUTABLE_PATH });
const artifactDir = process.env.ARTIFACT_DIR || path.join(root, 'test-results');
await mkdir(artifactDir, { recursive: true });
let count = 0;
function ok(condition, message) { assert.ok(condition, message); count++; }
async function axe(page) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations);
  assert.deepEqual(violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
  count++;
}
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', acceptDownloads: true });
    const page = await context.newPage();
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', req => failed.push(req.url()));
    await page.goto(url);
    await page.locator('#timetable .row').last().waitFor();
    ok(await page.locator('#timetable .row').count() === 9, 'all nine courses render');
    ok(await page.locator('#site-nav a[href="#planner"]').count() === 1, 'planner has a navigation link');
    ok(!await page.locator('#map').getAttribute('open'), 'map begins collapsed');
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
    if (viewport.width < 1000) {
      ok(await page.evaluate(() => document.querySelector('.hero-copy').getBoundingClientRect().top < document.querySelector('.hero-art').getBoundingClientRect().top), 'mobile title comes before illustration');
      await page.locator('.menu-btn').click();
      ok(await page.locator('.menu-btn').getAttribute('aria-expanded') === 'true', 'mobile menu opens');
      await page.keyboard.press('Escape');
      ok(await page.locator('.menu-btn').getAttribute('aria-expanded') === 'false', 'mobile menu closes with Escape');
    }
    await page.locator('#tab-pro').focus();
    await page.keyboard.press('ArrowRight');
    ok(await page.locator('#panel-inst').isVisible(), 'keyboard selects next benefits panel');
    await page.locator('#tab-pro').click();
    await page.locator('#filter-cluster button[data-value="protection"]').click();
    ok(await page.locator('#timetable .row').count() === 3, 'thematic filter includes mandatory Academy');
    await page.locator('#filter-format button[data-value="Online"]').click();
    ok(await page.locator('#empty').isVisible(), 'combined filters support an empty result');
    await page.locator('#filter-reset').click();
    ok(await page.locator('#timetable .row').count() === 9, 'reset restores full list');
    await page.locator('.row[data-id="measuring"]').click();
    ok(await page.locator('#drawer .facts').innerText().then(t => t.includes('11 October to 19 November 2027')), 'coordinator retains the 2027 Measuring edition');
    ok(await page.locator('#drawer .course-notes').count() === 0, 'resolved course has no pending notice');
    ok(await page.locator('#drawer a').filter({ hasText: 'Apply for this course' }).count() === 0, 'unpublished course has no fabricated application link');
    await axe(page);
    await page.keyboard.press('Escape');
    ok(await page.locator('.row[data-id="measuring"]').evaluate(el => el === document.activeElement), 'dialog returns focus');
    for (const id of ['bilateral', 'access', 'skills']) { await page.locator(`#pk-${id}`).check(); }
    ok(await page.locator('#planner-list input:disabled').count() === 5, 'planner disables fourth choice');
    ok(await page.locator('#planner-warn').isVisible(), 'planner warns about overlapping dates');
    await page.reload();
    ok(await page.locator('#planner-count').innerText() === '(3 of 3 chosen)', 'plan persists across reload');
    await page.locator('.row[data-id="climate"]').click();
    await page.locator('#d-plan').click();
    await page.locator('#d-plan').click();
    ok(await page.locator('#d-plan-alert').count() === 1, 'full-plan feedback does not duplicate');
    ok(await page.locator('#drawer .facts').innerText().then(t => t.includes('10 October 2027, 23:59 (Rome time)')), 'coordinator deadline and timezone are shown');
    await page.keyboard.press('Escape');
    await page.locator('#planner-clear').click();
    await page.locator('.row[data-id="social-protection"]').click();
    const socialText = await page.locator('#drawer').innerText();
    ok(socialText.includes('English') && !socialText.includes('French'), 'Social protection is English only');
    await page.keyboard.press('Escape');
    await page.locator('.row[data-id="digital"]').click();
    ok(await page.locator('#drawer .facts').innerText().then(t => t.includes('Face-to-face') && t.includes('21 to 25 June 2027')), 'Digital transformation listing is unchanged');
    await page.keyboard.press('Escape');
    await page.locator('#pk-measuring').check();
    await page.locator('#pk-climate').check();
    const downloadEvent = page.waitForEvent('download');
    await page.locator('#planner-download').click();
    const download = await downloadEvent;
    const memoPath = path.join(artifactDir, `memo-${viewport.width}.html`);
    await download.saveAs(memoPath);
    ok(download.suggestedFilename() === 'my-diploma-plan.html', 'accessible HTML memo downloads');
    const memo = await context.newPage();
    await memo.goto('file://' + memoPath);
    ok(await memo.locator('h3').count() === 3, 'memo includes Academy and selected courses');
    ok(await memo.locator('body').innerText().then(t => t.includes('10 October 2027, 23:59 (Rome time)') && !t.includes('awaiting confirmation')), 'memo carries coordinator updates without pending labels');
    await axe(memo);
    await memo.close();
    await page.evaluate(() => { window.print = () => {}; });
    await page.locator('#planner-print').click();
    await page.emulateMedia({ media: 'print' });
    ok(await page.locator('#print-sheet').isVisible() && !await page.locator('#main').isVisible(), 'print view shows memo only');
    await page.pdf({ path: path.join(artifactDir, `memo-${viewport.width}.pdf`), format: 'A4', tagged: true });
    await page.emulateMedia({ media: 'screen' });
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    await page.locator('#planner-clear').click();
    await page.locator('#map > summary').click();
    ok(await page.locator('#map .hotspot').count() === 9, 'optional map retains all courses');
    ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'expanded map has no overflow');
    await page.locator('#map > summary').click();
    await axe(page);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(artifactDir, `home-${viewport.width}.png`), fullPage: false });
    await page.evaluate(() => document.querySelector('#courses').scrollIntoView({ block: 'start' }));
    await page.screenshot({ path: path.join(artifactDir, `courses-${viewport.width}.png`), fullPage: false });
    ok(errors.length === 0, `no script errors: ${errors}`);
    ok(failed.length === 0, `no failed requests: ${failed}`);
    await context.close();
  }
  for (const saved of ['{}', '"skills"', 'null', '{bad', '["skills","skills","academy","missing","access"]']) {
    const context = await browser.newContext();
    await context.addInitScript(value => localStorage.setItem('lmd-plan-v1', value), saved);
    const page = await context.newPage();
    await page.goto(url);
    ok(await page.locator('#timetable .row').count() === 9, 'corrupt saved plan does not break course list');
    ok(await page.locator('#planner-count').innerText() === (saved.startsWith('[') ? '(2 of 3 chosen)' : '(0 of 3 chosen)'), 'stored plan is normalized');
    await context.close();
  }
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage disabled'); } }));
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(url);
  ok(await blockedPage.locator('#planner-storage').isVisible(), 'unavailable storage is explained');
  await blockedPage.locator('#pk-skills').check();
  ok(await blockedPage.locator('#planner-count').innerText() === '(1 of 3 chosen)', 'planner still works without storage');
  await blocked.close();
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const fallback = await noJS.newPage();
  await fallback.goto(url);
  ok(await fallback.locator('#courses noscript a').first().isVisible(), 'no-JavaScript catalogue fallback is available');
  await noJS.close();
  console.log(`${count} browser checks passed (desktop, mobile, exports, accessibility and storage recovery).`);
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
