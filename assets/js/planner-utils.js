/* Shared planner rules and accessible memo export. No runtime dependencies. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.LMD_UTILS = api; }
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function normalizePlan(saved, courses, maximum) {
    if (!Array.isArray(saved)) { return []; }
    var allowed = courses.filter(function (c) { return !c.mandatory; }).map(function (c) { return c.id; });
    return saved.filter(function (id, i) {
      return typeof id === 'string' && allowed.indexOf(id) !== -1 && saved.indexOf(id) === i;
    }).slice(0, maximum);
  }
  function longDate(iso) {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z'));
  }
  function deadlineText(course) {
    if (!course.deadline) { return 'Not yet published on the official page'; }
    if (course.deadlineVerified === false) { return 'Awaiting confirmation (official page lists ' + longDate(course.deadline) + ')'; }
    var time = course.deadlineTime ? ', ' + course.deadlineTime + (course.deadlineTimeZone === 'Europe/Rome' ? ' (Rome time)' : ' (' + course.deadlineTimeZone + ')') : '';
    return longDate(course.deadline) + time;
  }
  function publicNotes(course) { return course.publicNotes || []; }
  function notesHTML(course) {
    var notes = publicNotes(course);
    return notes.length ? '<ul class="course-notes">' + notes.map(function (note) {
      return '<li><strong>' + escapeHTML(note.label) + '.</strong> ' + escapeHTML(note.text) + '</li>';
    }).join('') + '</ul>' : '';
  }
  function memoBody(data, rows, prepared) {
    var p = data.programme, electiveCount = rows.filter(function (c) { return !c.mandatory; }).length;
    return '<header><p>ITCILO · International Training Centre of the ILO</p><h1>My Diploma plan</h1>' +
      '<p>' + escapeHTML(p.title) + '</p><p>Prepared on ' + escapeHTML(prepared) + '. Course information checked on ' + longDate(data.meta.lastChecked) + '.</p></header>' +
      '<main><h2>Requirements</h2><ul><li>Academy on Labour Migration: included in this plan.</li>' +
      '<li>Courses of your choice: ' + electiveCount + ' of ' + p.electivesRequired + ' selected.</li>' +
      '<li>Individual capstone project: arrange the topic, assessment and timing with the team.</li>' +
      '<li>Complete all requirements within ' + p.years + ' years. Ask the team how your period is counted.</li></ul>' +
      '<p>About ' + p.learningHours + ' learning hours in total. Courses can be taken in different years.</p><h2>Selected courses</h2>' +
      rows.map(function (c) {
        return '<section><h3>' + escapeHTML(c.title) + '</h3><p>' + (c.mandatory ? 'Mandatory Academy' : 'Course of your choice') + '</p>' + notesHTML(c) +
          '<dl><dt>Dates</dt><dd>' + longDate(c.start) + ' to ' + longDate(c.end) + '</dd>' +
          '<dt>Format and place</dt><dd>' + escapeHTML(c.format + ' · ' + c.location) + '</dd>' +
          (c.f2f ? '<dt>Face-to-face dates</dt><dd>' + longDate(c.f2f.start) + ' to ' + longDate(c.f2f.end) + '</dd>' : '') +
          '<dt>Language</dt><dd>' + escapeHTML(c.languagesVerified ? c.languages.join(' and ') : c.languageNote || 'To be confirmed') + '</dd>' +
          '<dt>Application deadline</dt><dd>' + escapeHTML(deadlineText(c)) + '</dd></dl>' +
          '<p><a href="' + escapeHTML(c.officialUrl) + '">Official course page: ' + escapeHTML(c.title) + '</a>' +
          (c.applyUrl ? ' · <a href="' + escapeHTML(c.applyUrl) + '">Apply for this course</a>' : '') + '</p></section>';
      }).join('') + '</main><footer><p><strong>Planning aid only.</strong> This memo is not a registration, admission or confirmation of a Diploma award. ' +
      'Confirm dates, deadlines and workload with the team or on each official course page, and register for each course separately. Contact the team if an official page differs from a programme-team update in this memo. Overlapping dates can mean a heavier workload.</p>' +
      '<p>Questions: <a href="mailto:' + escapeHTML(p.email) + '">' + escapeHTML(p.email) + '</a></p></footer>';
  }
  function memoDocument(data, rows, prepared) {
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>My Diploma plan | ITCILO</title><style>body{font:17px/1.6 system-ui,sans-serif;color:#2b2a29;max-width:760px;margin:32px auto;padding:0 24px}' +
      'h1,h2,h3,a{color:#284b96}a{overflow-wrap:anywhere}section{border-top:1px solid #aaa;padding:12px 0}dt{font-weight:700}dd{margin:0 0 8px}' +
      '.course-notes{background:#fff1c9;padding:12px 12px 12px 32px}footer{border-top:2px solid #284b96;font-size:.94em}' +
      '@media print{body{font-size:11pt;margin:0}h3{break-after:avoid}dl{break-inside:avoid}a{color:#000}@page{margin:18mm}}</style></head><body>' +
      memoBody(data, rows, prepared) + '</body></html>';
  }
  return { normalizePlan: normalizePlan, deadlineText: deadlineText, publicNotes: publicNotes, notesHTML: notesHTML, memoBody: memoBody, memoDocument: memoDocument };
});
