const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const U = require('../assets/js/planner-utils.js');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('../data/lm-diploma-data.js', `file://${__filename}`), 'utf8'), ctx);
const D = JSON.parse(JSON.stringify(ctx.window.LMD_DATA));
const academy = D.courses.find(c => c.mandatory);
const course = id => D.courses.find(c => c.id === id);

test('unexpected stored shapes never become a plan', () => {
  for (const value of [null, undefined, {}, 'skills', 23, true]) {
    assert.deepEqual(U.normalizePlan(value, D.courses, 3), []);
  }
});
test('plan restoration removes duplicates, unknown and mandatory ids before enforcing the limit', () => {
  assert.deepEqual(U.normalizePlan(['skills', 'skills', 'academy', '__proto__', null, {}, 'bilateral', 'access', 'climate'], D.courses, 3), ['skills', 'bilateral', 'access']);
});
test('unconfirmed deadline is explicitly qualified; a missing deadline is never invented', () => {
  assert.match(U.deadlineText({ ...course('climate'), deadline: '2027-12-03', deadlineVerified: false }), /^Awaiting confirmation/);
  assert.match(U.deadlineText({ ...course('climate'), deadline: '2027-12-03', deadlineVerified: false }), /3 December 2027/);
  assert.equal(U.deadlineText(course('measuring')), 'Not yet published on the official page');
  assert.equal(U.deadlineText(course('skills')), '1 March 2027');
});
test('public notices remain in memos when internal review flags are off', () => {
  D.meta.showReviewFlags = false;
  const pending = { ...course('measuring'), publicNotes: [{ label: '2027 dates awaiting confirmation', text: 'Check with the team.' }] };
  const climate = { ...course('climate'), publicNotes: [{ label: 'Application deadline awaiting confirmation', text: 'Check with the team.' }] };
  const html = U.memoDocument(D, [academy, pending, climate], '28 October 2026');
  assert.match(html, /2027 dates awaiting confirmation/);
  assert.match(html, /Application deadline awaiting confirmation/);
  assert.doesNotMatch(html, /Preview note/);
});
test('memo preserves Unicode, semantic structure, working links and escapes inserted content', () => {
  const c = { ...course('skills'), title: 'Égalité – العمل <script>alert("x")</script>' };
  const html = U.memoDocument(D, [academy, c], '28 October 2026');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta charset="utf-8">/);
  assert.match(html, /Égalité – العمل &lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /<main>/);
  assert.match(html, /<h3>/);
  assert.match(html, /<dt>Application deadline<\/dt>/);
  assert.ok(html.includes(`href="${c.officialUrl}"`));
});
test('memo requirements come from programme data', () => {
  const data = { ...D, programme: { ...D.programme, electivesRequired: 4, years: 6, learningHours: 350 } };
  const html = U.memoBody(data, [academy, course('skills')], '28 October 2026');
  assert.match(html, /1 of 4 selected/);
  assert.match(html, /within 6 years/);
  assert.match(html, /350 learning hours/);
});

test('coordinator decisions are reflected without pending labels', () => {
  assert.equal(course('measuring').start, '2027-10-11');
  assert.equal(course('measuring').end, '2027-11-19');
  assert.equal(course('digital').format, 'Face-to-face');
  assert.deepEqual(course('social-protection').languages, ['English']);
  assert.equal(course('social-protection').languagesVerified, true);
  assert.equal(U.deadlineText(course('climate')), '10 October 2027, 23:59 (Rome time)');
  assert.equal(new Date(course('climate').deadline + 'T00:00:00Z').getUTCDay(), 0);
  assert.equal((new Date(course('climate').start) - new Date(course('climate').deadline)) / 86400000, 15);
  for (const c of D.courses) assert.deepEqual(U.publicNotes(c), []);
});
