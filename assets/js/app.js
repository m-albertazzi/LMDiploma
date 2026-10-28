/* Diploma for Labour Migration Experts and Practitioners: page behaviour.
   No dependencies. Content comes from data/lm-diploma-data.js. */
(function () {
  'use strict';
  var D = window.LMD_DATA;
  if (!D) { return; }
  var courses = D.courses.slice().sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : 0; });
  var byId = {};
  courses.forEach(function (c) { byId[c.id] = c; });
  var clusterById = {};
  D.clusters.forEach(function (c) { clusterById[c.id] = c; });
  var academy = courses.filter(function (c) { return c.mandatory; })[0];
  var electives = courses.filter(function (c) { return !c.mandatory; });
  var MAX = D.programme.electivesRequired;
  var FORMATS = ['Online', 'Blended', 'Face-to-face'];
  var STORE = 'lmd-plan-v1';

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function d(iso) { var p = iso.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  var fLong = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  var fDM = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  var fShort = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  var fMonth = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  function range(a, b) {
    if (!b || a === b) { return fLong.format(d(a)); }
    var A = d(a), B = d(b);
    if (A.getUTCFullYear() === B.getUTCFullYear()) {
      if (A.getUTCMonth() === B.getUTCMonth()) { return A.getUTCDate() + ' to ' + fLong.format(B); }
      return fDM.format(A) + ' to ' + fLong.format(B);
    }
    return fLong.format(A) + ' to ' + fLong.format(B);
  }
  function shortRange(a, b) {
    var A = d(a), B = d(b);
    if (A.getUTCMonth() === B.getUTCMonth()) { return A.getUTCDate() + '–' + fShort.format(B); }
    return fShort.format(A) + ' – ' + fShort.format(B);
  }
  function list(items) { return '<ul>' + items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>'; }
  function langText(c) { return c.languagesVerified ? c.languages.join(' and ') : (c.languageNote || 'To be confirmed'); }
  function tryStore(get, val) {
    try { if (get) { return JSON.parse(window.localStorage.getItem(STORE) || '[]'); } window.localStorage.setItem(STORE, JSON.stringify(val)); } catch (e) { return get ? [] : undefined; }
  }
  var DATE_FIELDS = ['Face-to-face dates', 'Overall end date', '2027 edition'];
  function hasDateIssue(c) { return D.meta.showReviewFlags && (c.review || []).some(function (r) { return DATE_FIELDS.indexOf(r.field) > -1; }); }

  /* ---------- credits, checked date ---------- */
  var checked = $('#checked'); if (checked) { checked.textContent = fLong.format(d(D.meta.lastChecked)); }
  var credit = $('#credit'); if (credit) { if (D.credits.display) { credit.textContent = D.credits.display; } else { credit.hidden = true; } }

  /* ---------- generic tabs ---------- */
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root);
    function select(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) { p.hidden = !on; }
      });
      if (focus) { t.focus(); }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { n = tabs[(i + 1) % tabs.length]; }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { n = tabs[(i - 1 + tabs.length) % tabs.length]; }
        else if (e.key === 'Home') { n = tabs[0]; }
        else if (e.key === 'End') { n = tabs[tabs.length - 1]; }
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---------- navigation ---------- */
  var menuBtn = $('.menu-btn'), nav = $('#site-nav');
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) { closeMenu(); } });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuBtn.focus(); }
  });
  var spyMap = { overview: 'overview', pathway: 'pathway', courses: 'courses', planner: 'courses', practical: 'practical', faqs: 'faqs', contact: 'contact' };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var target = spyMap[en.target.id];
          $$('.site-nav a').forEach(function (a) {
            if (a.getAttribute('href') === '#' + target) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
          });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(spyMap).forEach(function (id) { var el = document.getElementById(id); if (el) { io.observe(el); } });
  }

  /* ---------- plan state ---------- */
  var plan = (tryStore(true) || []).filter(function (id) { return byId[id] && !byId[id].mandatory; }).slice(0, MAX);
  function savePlan() { tryStore(false, plan); }
  function inPlan(id) { return plan.indexOf(id) > -1; }
  function togglePlan(id) {
    var i = plan.indexOf(id);
    if (i > -1) { plan.splice(i, 1); }
    else if (plan.length < MAX) { plan.push(id); }
    else { return false; }
    savePlan(); renderList(); renderPlanner(); return true;
  }

  /* ---------- filters ---------- */
  var filt = { format: [], cluster: [] };
  var fFormat = $('#filter-format'), fCluster = $('#filter-cluster');
  function chip(group, value, label, color) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.setAttribute('aria-pressed', 'false');
    b.dataset.group = group; b.dataset.value = value;
    b.innerHTML = (color ? '<span class="dot" style="--c:' + color + '"></span>' : '') + esc(label);
    b.addEventListener('click', function () {
      var arr = filt[group], i = arr.indexOf(value);
      if (i > -1) { arr.splice(i, 1); } else { arr.push(value); }
      b.setAttribute('aria-pressed', i > -1 ? 'false' : 'true');
      renderList();
    });
    return b;
  }
  FORMATS.forEach(function (f) { fFormat.appendChild(chip('format', f, f)); });
  D.clusters.forEach(function (c) { fCluster.appendChild(chip('cluster', c.id, c.label, c.color)); });
  $('#filters').hidden = false;
  $('#filter-reset').addEventListener('click', function () {
    filt.format = []; filt.cluster = [];
    $$('.chip').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    renderList();
    $('#filter-format .chip').focus();
  });
  function passes(c) {
    var okF = !filt.format.length || filt.format.indexOf(c.format) > -1;
    var okC = !filt.cluster.length || c.mandatory || c.clusters.some(function (x) { return filt.cluster.indexOf(x) > -1; });
    return okF && okC;
  }

  /* ---------- course list ---------- */
  function coverHTML(c, big) {
    if (c.image) { return '<img src="' + esc(c.image) + '" alt="' + esc(c.imageAlt) + '" loading="lazy" decoding="async">'; }
    return '<span class="cover-fallback" aria-hidden="true"><span>' + esc(c.coverLabel || c.title) + '</span></span>';
  }
  function formatPill(c) { return '<span class="pill">' + esc(c.format) + '</span>'; }
  function clusterTags(c) {
    return c.clusters.map(function (id) { var k = clusterById[id]; return '<span class="tagc"><i style="--c:' + k.color + '"></i>' + esc(k.label) + '</span>'; }).join('');
  }
  var timetable = $('#timetable'), emptyMsg = $('#empty'), count = $('#result-count');
  function renderList() {
    var shown = courses.filter(passes);
    updatePlanBar();
    count.textContent = 'Showing ' + shown.length + ' of ' + courses.length + ' courses';
    emptyMsg.hidden = shown.length > 0;
    var months = [], cur = null;
    shown.forEach(function (c) {
      var key = c.start.slice(0, 7);
      if (!cur || cur.key !== key) { cur = { key: key, label: fMonth.format(d(c.start)), items: [] }; months.push(cur); }
      cur.items.push(c);
    });
    timetable.innerHTML = months.map(function (m) {
      return '<li class="month"><h3 class="month-name">' + esc(m.label) + '</h3><ol class="rows">' + m.items.map(function (c) {
        var f2f = c.f2f && c.format !== 'Face-to-face' ? '<span>Turin ' + esc(shortRange(c.f2f.start, c.f2f.end)) + '</span>' : (c.format === 'Face-to-face' ? '<span>Turin</span>' : '');
        return '<li><button type="button" class="row' + (c.mandatory ? ' is-mandatory' : '') + '" data-id="' + c.id + '" style="--acc:' + c.accent + '" aria-haspopup="dialog">' +
          '<span class="thumb">' + coverHTML(c) + '</span>' +
          '<span class="when">' + esc(shortRange(c.start, c.end)) + '<br><small>' + esc(fLong.format(d(c.start)).replace(/^\d+ \w+ /, '')) + '</small></span>' +
          '<span class="name">' + esc(c.title) + '</span>' +
          '<span class="meta">' +
            (c.mandatory ? '<span class="pill pill-mandatory">Mandatory</span>' : '<span class="pill pill-elective">Elective</span>') +
            formatPill(c) + f2f +
            '<span>' + (c.languagesVerified ? esc(c.languages.join(', ')) : 'Language to be confirmed') + '</span>' +
            clusterTags(c) +
            (!c.mandatory && inPlan(c.id) ? '<span class="pill pill-plan">In your plan</span>' : '') +
            (hasDateIssue(c) ? '<span class="pill pill-flag">Dates to confirm</span>' : '') +
          '</span>' +
          '<span class="go" aria-hidden="true"></span>' +
          '</button></li>';
      }).join('') + '</ol></li>';
    }).join('');
  }
  function updatePlanBar() {
    var bar = $('#planbar'); if (!bar) { return; }
    bar.hidden = plan.length === 0;
    $('#planbar-text').textContent = plan.length ? 'In your plan: the Academy and ' + plan.length + ' of ' + MAX + ' electives.' : '';
  }
  timetable.addEventListener('click', function (e) {
    var b = e.target.closest('.row'); if (b) { openDrawer(b.dataset.id, b); }
  });

  /* ---------- drawer ---------- */
  var drawer = $('#drawer'), body = $('#drawer-body'), lastTrigger = null, lastId = null;
  function drawerHTML(c) {
    var k = c.clusters.map(function (id) { return '<span class="tagc"><i style="--c:' + clusterById[id].color + '"></i>' + esc(clusterById[id].label) + '</span>'; }).join(' ');
    var facts = '<dl class="facts">' +
      '<div><dt>Dates</dt><dd>' + esc(range(c.start, c.end)) + (c.phases ? '<small>' + c.phases.map(esc).join('<br>') + '</small>' : '') + '</dd></div>' +
      (c.f2f ? '<div><dt>Face-to-face</dt><dd>' + esc(range(c.f2f.start, c.f2f.end)) + '<small>' + esc(c.f2f.place) + '</small></dd></div>' : '') +
      '<div><dt>Format and place</dt><dd>' + esc(c.format) + '<small>' + esc(c.location) + '</small></dd></div>' +
      '<div><dt>Language</dt><dd>' + esc(langText(c)) + '</dd></div>' +
      '<div><dt>Application deadline</dt><dd>' + (c.deadline ? esc(fLong.format(d(c.deadline))) : 'Not yet published on the official page') + '</dd></div>' +
      (c.courseCode ? '<div><dt>Course code</dt><dd>' + esc(c.courseCode) + '</dd></div>' : '') +
      '</dl>';
    var flags = '';
    if (D.meta.showReviewFlags && c.review && c.review.length) {
      flags = c.review.map(function (r) {
        return '<div class="review-flag"><strong>Preview note: ' + esc(r.field) + ' to confirm</strong><p>' + esc(r.note) + '</p></div>';
      }).join('');
    }
    var planBtn = c.mandatory
      ? '<p class="hint">The Academy is part of every plan.</p>'
      : '<button type="button" class="btn btn-secondary" id="d-plan" aria-pressed="' + inPlan(c.id) + '">' + (inPlan(c.id) ? 'Remove from my plan' : 'Add to my plan') + '</button>';
    return '<div class="d-cover" style="--acc:' + c.accent + '">' + coverHTML(c, true) + '</div>' +
      '<div class="d-body">' +
      '<div class="d-pills">' + (c.mandatory ? '<span class="pill pill-mandatory">Mandatory for the Diploma</span>' : '<span class="pill pill-elective">Elective</span>') + formatPill(c) +
      (!c.mandatory && inPlan(c.id) ? '<span class="pill pill-plan">In your plan</span>' : '') + '</div>' +
      '<h2 id="drawer-title" tabindex="-1">' + esc(c.title) + '</h2>' +
      '<p>' + esc(c.overview) + '</p>' + flags + facts +
      '<h3>Who it is for</h3>' + list(c.audience) +
      '<h3>Main topics</h3>' + list(c.topics) +
      '<h3>What you will be able to do</h3>' + list(c.outcomes) +
      '<h3>Thematic areas</h3><p>' + (k || 'Not tied to one area; it anchors the whole Diploma.') + '</p>' +
      '<div class="d-actions">' +
        '<a class="btn btn-primary" href="' + esc(c.officialUrl) + '" rel="noopener">View course on itcilo.org</a>' +
        (c.applyUrl ? '<a class="btn btn-secondary" href="' + esc(c.applyUrl) + '" rel="noopener">Apply for this course</a>' : '') +
        planBtn +
      '</div>' +
      (c.applyUrl ? '' : '<p class="hint">There is no application link for this course on its official page yet. Check the course page or <a class="textlink" href="mailto:' + D.programme.email + '?subject=' + encodeURIComponent(c.title) + '">contact us</a>.</p>') +
      '<p><a class="textlink" href="mailto:' + D.programme.email + '?subject=' + encodeURIComponent('Question about: ' + c.title) + '">Contact us about this course</a></p>' +
      '<p class="hint">Dates and deadlines are confirmed on the official course page, which is the reference when anything differs. Checked ' + esc(fLong.format(d(D.meta.lastChecked))) + '.</p>' +
      '</div>';
  }
  function renderDrawer(c, refocus) {
    body.innerHTML = drawerHTML(c);
    var pb = $('#d-plan');
    if (pb) {
      pb.addEventListener('click', function () {
        if (!togglePlan(c.id)) { pb.insertAdjacentHTML('afterend', '<p class="hint" role="alert">Your plan already has three electives. Remove one in the planner first.</p>'); return; }
        renderDrawer(c, true);
      });
      if (refocus) { pb.focus(); }
    }
  }
  function openDrawer(id, trigger) {
    var c = byId[id]; if (!c) { return; }
    lastTrigger = trigger || document.activeElement; lastId = id;
    renderDrawer(c, false);
    drawer.scrollTop = 0;
    drawer.showModal();
    try { history.replaceState(null, '', '#course-' + id); } catch (e) { /* ignore */ }
    $('#drawer-close').focus();
  }
  function closeDrawer() { if (drawer.open) { drawer.close(); } }
  $('#drawer-close').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', function (e) {
    var r = drawer.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { closeDrawer(); }
  });
  drawer.addEventListener('close', function () {
    if (location.hash.indexOf('#course-') === 0) { try { history.replaceState(null, '', location.pathname + location.search + '#courses'); } catch (e) { /* ignore */ } }
    var t = lastTrigger;
    if (!t || !document.contains(t)) { t = lastId ? document.querySelector('.row[data-id="' + lastId + '"]') : null; }
    if (t && t.focus) { t.focus(); }
  });
  $$('[data-open-course]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); openDrawer(a.getAttribute('data-open-course'), a); });
  });


  /* ---------- illustration map ---------- */
  (function () {
    var wrap = $('#map'), pins = $('#map-pins'); if (!wrap || !pins) { return; }
    var n = 0;
    courses.forEach(function (c) {
      var h = c.hotspot; if (!h) { return; }
      n++;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hotspot' + (c.mandatory ? ' is-academy' : '') + (h.y < 22 ? ' tip-below' : '') + (h.x < 22 ? ' tip-left' : '') + (h.x > 78 ? ' tip-right' : '');
      b.style.setProperty('--x', h.x + '%'); b.style.setProperty('--y', h.y + '%'); b.style.setProperty('--d', h.d + '%');
      b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('aria-label', c.title + ', ' + range(c.start, c.end) + '. Opens course details.');
      b.dataset.course = c.id;
      b.innerHTML = '<span class="tip" aria-hidden="true">' + esc(c.title) + '<small>' + esc(shortRange(c.start, c.end)) + ', ' + esc(c.format) + '</small></span>';
      b.addEventListener('click', function () { openDrawer(c.id, b); });
      pins.appendChild(b);
    });
    wrap.hidden = n === 0;
  })();

  /* ---------- planner ---------- */
  var pRoot = $('#planner-root');
  function overlaps(a, b) { return a.start <= b.end && b.start <= a.end; }
  function renderPlanner() {
    var full = plan.length >= MAX;
    $('#planner-academy').innerHTML = '<span class="tick" aria-hidden="true">✓</span><div><span class="p-title">' + esc(academy.title) + '</span><span class="p-meta">' + esc(range(academy.start, academy.end)) + '. ' + esc(academy.format) + ', face-to-face in Turin ' + esc(shortRange(academy.f2f.start, academy.f2f.end)) + '. Always included.</span></div>';
    $('#planner-academy').style.setProperty('--acc', academy.accent);
    $('#planner-count').textContent = '(' + plan.length + ' of ' + MAX + ' chosen)';
    $('#planner-list').innerHTML = electives.map(function (c) {
      var on = inPlan(c.id), dis = full && !on;
      return '<div class="pick' + (dis ? ' is-disabled' : '') + '" style="--acc:' + c.accent + '">' +
        '<input type="checkbox" id="pk-' + c.id + '" data-id="' + c.id + '"' + (on ? ' checked' : '') + (dis ? ' disabled' : '') + '>' +
        '<label for="pk-' + c.id + '"><span class="p-title">' + esc(c.title) + '</span><span class="p-meta">' + esc(range(c.start, c.end)) + '. ' + esc(c.format) + (c.f2f && c.format === 'Blended' ? ', face-to-face ' + esc(shortRange(c.f2f.start, c.f2f.end)) : '') + '</span></label></div>';
    }).join('');
    $('#planner-hint').textContent = full ? 'You have chosen three electives. Untick one to choose a different course.' : '';
    var chosen = plan.map(function (id) { return byId[id]; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    var all = [academy].concat(chosen).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
    var span = '';
    if (all.length) {
      var s = all[0].start, e = all.reduce(function (m, c) { return c.end > m ? c.end : m; }, all[0].end);
      var months = Math.max(1, Math.round((d(e) - d(s)) / (30.44 * 864e5)));
      span = fLong.format(d(s)) + ' to ' + fLong.format(d(e)) + ', about ' + months + ' month' + (months > 1 ? 's' : '');
    }
    function li(done, html) { return '<li class="' + (done ? 'done' : '') + '"><span class="st" aria-hidden="true">' + (done ? '✓' : '') + '</span><span>' + html + '</span></li>'; }
    $('#planner-ledger').innerHTML =
      li(true, '<strong>Academy on Labour Migration</strong> is in your plan.') +
      li(plan.length === MAX, '<strong>Three eligible courses:</strong> ' + plan.length + ' of ' + MAX + ' chosen.') +
      li(false, '<strong>Capstone project:</strong> not part of this planner. <a class="textlink" href="mailto:' + D.programme.email + '">Ask us</a> about format and timing.') +
      li(false, '<strong>Five-year period:</strong> your 2027 choices span ' + esc(span) + '. Ask us how the five years are counted for you.');
    $('#planner-plan').innerHTML = all.map(function (c) {
      return '<li style="--acc:' + c.accent + '"><span class="t">' + esc(c.title) + (c.mandatory ? ' (mandatory)' : '') + '</span><span class="d">' + esc(range(c.start, c.end)) + ', ' + esc(c.format) + (c.f2f ? '. Face-to-face ' + esc(range(c.f2f.start, c.f2f.end)) : '') + '</span></li>';
    }).join('');
    var ov = [];
    for (var i = 0; i < all.length; i++) { for (var j = i + 1; j < all.length; j++) { if (overlaps(all[i], all[j])) { ov.push(all[i].title + ' and ' + all[j].title); } } }
    var warn = $('#planner-warn');
    warn.hidden = !ov.length;
    warn.textContent = ov.length ? 'Some of these overlap in time: ' + ov.join('; ') + '. Overlapping courses mean a heavier workload. You can spread courses over more than one year.' : '';
    $('#planner-clear').disabled = !plan.length;
  }
  $('#planner-list').addEventListener('change', function (e) {
    var cb = e.target.closest('input[type="checkbox"]'); if (!cb) { return; }
    var id = cb.dataset.id;
    togglePlan(id);
    var again = document.getElementById('pk-' + id); if (again) { again.focus(); }
  });
  $('#planner-clear').addEventListener('click', function () { plan = []; savePlan(); renderList(); renderPlanner(); $('#planner-list input').focus(); });
  /* ---------- memo (print and PDF) ---------- */
  function memoRows() {
    return [academy].concat(plan.map(function (id) { return byId[id]; })).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  }
  function printMemo() {
    var rows = memoRows();
    var sheet = $('#print-sheet');
    sheet.innerHTML = '<img class="logo" src="assets/img/itc-logo-700.png" alt="">' +
      '<h1>My Diploma plan</h1><p>Diploma for Labour Migration Experts and Practitioners. Prepared on ' + esc(fLong.format(new Date())) + '.</p>' +
      '<table><thead><tr><th>Course</th><th>Status</th><th>Dates (2027)</th><th>Format</th></tr></thead><tbody>' +
      rows.map(function (c) { return '<tr><td>' + esc(c.title) + '<br><span class="small">' + esc(c.officialUrl) + '</span></td><td>' + (c.mandatory ? 'Mandatory' : 'Elective') + '</td><td>' + esc(range(c.start, c.end)) + (c.f2f ? '<br>Face-to-face: ' + esc(range(c.f2f.start, c.f2f.end)) : '') + (c.deadline ? '<br>Apply by: ' + esc(fLong.format(d(c.deadline))) : '') + '</td><td>' + esc(c.format) + '</td></tr>'; }).join('') +
      '</tbody></table>' +
      '<p>Elective courses chosen: ' + plan.length + ' of ' + MAX + '. The Diploma also requires an individual capstone project and completion of all requirements within five years.</p>' +
      '<p class="small"><strong>Planning aid only.</strong> This memo is not a registration, an admission, or a confirmation that a Diploma will be awarded. Confirm dates and deadlines on each official course page and register for each course separately. Questions: ' + D.programme.email + '.</p>';
    document.body.classList.add('print-plan');
    window.print();
  }

  /* A small PDF writer (A4, Helvetica, optional JPEG logo). No libraries. */
  function pdfText(s) { return String(s).replace(/[–—]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7E -ÿ]/g, '?'); }
  function pdfEsc(s) { return pdfText(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
  function bytes(s) { var a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) { a[i] = s.charCodeAt(i) & 255; } return a; }
  function loadLogo() {
    return new Promise(function (res) {
      var img = new Image();
      img.onload = function () {
        fetch('assets/img/itc-logo-memo.jpg').then(function (r) { return r.arrayBuffer(); }).then(function (b) { res({ data: new Uint8Array(b), w: img.naturalWidth, h: img.naturalHeight }); }).catch(function () { res(null); });
      };
      img.onerror = function () { res(null); };
      img.src = 'assets/img/itc-logo-memo.jpg';
    });
  }
  function buildPdf(logo) {
    var W = 595.28, H = 841.89, M = 54, LW = W - 2 * M;
    var cv = document.createElement('canvas').getContext('2d');
    function width(t, size, bold) { cv.font = (bold ? 'bold ' : '') + size + 'px Helvetica, Arial, sans-serif'; return cv.measureText(pdfText(t)).width; }
    function wrap(t, size, bold, maxW) {
      var words = pdfText(t).split(/\s+/), lines = [], cur = '';
      words.forEach(function (w) {
        var test = cur ? cur + ' ' + w : w;
        if (width(test, size, bold) <= maxW) { cur = test; return; }
        if (cur) { lines.push(cur); cur = ''; }
        while (width(w, size, bold) > maxW) { var k = w.length; while (k > 1 && width(w.slice(0, k), size, bold) > maxW) { k--; } lines.push(w.slice(0, k)); w = w.slice(k); }
        cur = w;
      });
      if (cur) { lines.push(cur); }
      return lines;
    }
    var pages = [], ops = [], y;
    function newPage() { if (ops.length) { pages.push(ops.join('\n')); } ops = []; y = H - M; }
    function ensure(h) { if (y - h < M) { newPage(); } }
    function text(t, size, o) {
      o = o || {}; var x = o.x || M, maxW = o.w || LW, lead = size * 1.4;
      wrap(t, size, o.bold, maxW).forEach(function (l) {
        ensure(lead); y -= lead;
        var col = o.color || '0.169 0.165 0.161';
        ops.push('BT /' + (o.bold ? 'F2' : 'F1') + ' ' + size + ' Tf ' + col + ' rg ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Td (' + pdfEsc(l) + ') Tj ET');
      });
    }
    function gap(h) { y -= h; }
    function rule(col) { ensure(8); ops.push(col + ' RG 1 w ' + M + ' ' + (y - 4).toFixed(2) + ' m ' + (W - M) + ' ' + (y - 4).toFixed(2) + ' l S'); y -= 10; }
    var BLUE = '0.157 0.294 0.588';
    newPage();
    if (logo) { var lh = 40, lw = lh * logo.w / logo.h; ops.push('q ' + lw.toFixed(2) + ' 0 0 ' + lh + ' ' + (W - M - lw).toFixed(2) + ' ' + (H - M - lh + 6).toFixed(2) + ' cm /Im1 Do Q'); }
    y = H - M - 4;
    text('My Diploma plan', 26, { bold: true, color: BLUE, w: LW - 150 });
    text('Diploma for Labour Migration Experts and Practitioners', 12, { color: BLUE, w: LW - 150 });
    text('Prepared on ' + fLong.format(new Date()), 10, { color: '0.357 0.357 0.357' });
    gap(8); y = Math.min(y, H - M - 56); rule(BLUE);
    memoRows().forEach(function (c) {
      ensure(90);
      gap(6);
      text(c.title, 13, { bold: true, color: BLUE });
      text((c.mandatory ? 'Mandatory for the Diploma' : 'Elective') + ', ' + c.format, 10.5);
      text('Dates: ' + range(c.start, c.end), 10.5);
      if (c.f2f) { text('Face-to-face: ' + range(c.f2f.start, c.f2f.end) + ', ' + c.f2f.place, 10.5); }
      text('Language: ' + langText(c), 10.5);
      text('Application deadline: ' + (c.deadline ? fLong.format(d(c.deadline)) : 'not yet published on the course page'), 10.5);
      text('Course page: ' + c.officialUrl, 9.5, { color: '0.357 0.357 0.357' });
      if (c.applyUrl) { text('Apply: ' + c.applyUrl, 9.5, { color: '0.357 0.357 0.357' }); }
      gap(4); rule('0.8 0.8 0.8');
    });
    gap(6);
    text('Electives chosen: ' + plan.length + ' of ' + MAX + '. The Diploma also requires an individual capstone project, and all requirements must be completed within five years.', 10.5);
    gap(6);
    text('Planning aid only. This memo is not a registration, an admission, or a confirmation that a Diploma will be awarded. Confirm dates and deadlines on each official course page and register for each course separately.', 9.5, { color: '0.357 0.357 0.357' });
    text('Questions: ' + D.programme.email + '   ' + D.programme.website, 9.5, { color: '0.357 0.357 0.357' });
    pages.push(ops.join('\n'));

    // assemble objects
    var objs = [], imgObj = logo ? 5 : 0, first = logo ? 6 : 5;
    objs[1] = [bytes('<< /Type /Catalog /Pages 2 0 R >>')];
    var kids = pages.map(function (_, i) { return (first + i * 2) + ' 0 R'; }).join(' ');
    objs[2] = [bytes('<< /Type /Pages /Kids [' + kids + '] /Count ' + pages.length + ' >>')];
    objs[3] = [bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')];
    objs[4] = [bytes('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')];
    if (logo) {
      objs[5] = [bytes('<< /Type /XObject /Subtype /Image /Width ' + logo.w + ' /Height ' + logo.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + logo.data.length + ' >>\nstream\n'), logo.data, bytes('\nendstream')];
    }
    pages.forEach(function (content, i) {
      var pn = first + i * 2, cn = pn + 1;
      objs[pn] = [bytes('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>' + (logo ? ' /XObject << /Im1 5 0 R >>' : '') + ' >> /Contents ' + cn + ' 0 R >>')];
      var cb = bytes(content);
      objs[cn] = [bytes('<< /Length ' + cb.length + ' >>\nstream\n'), cb, bytes('\nendstream')];
    });
    var parts = [bytes('%PDF-1.4\n')], offset = parts[0].length, offsets = [];
    for (var n = 1; n < objs.length; n++) {
      offsets[n] = offset;
      var chunk = [bytes(n + ' 0 obj\n')].concat(objs[n], [bytes('\nendobj\n')]);
      chunk.forEach(function (c) { parts.push(c); offset += c.length; });
    }
    var xref = 'xref\n0 ' + objs.length + '\n0000000000 65535 f \n';
    for (var k = 1; k < objs.length; k++) { xref += ('0000000000' + offsets[k]).slice(-10) + ' 00000 n \n'; }
    parts.push(bytes(xref + 'trailer\n<< /Size ' + objs.length + ' /Root 1 0 R >>\nstartxref\n' + offset + '\n%%EOF'));
    return new Blob(parts, { type: 'application/pdf' });
  }
  function downloadMemo() {
    loadLogo().then(function (logo) {
      var blob = buildPdf(logo), a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'my-diploma-plan.pdf';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    });
  }
  $('#planner-print').addEventListener('click', printMemo);
  $('#bar-print').addEventListener('click', printMemo);
  $('#planner-download').addEventListener('click', downloadMemo);
  $('#bar-download').addEventListener('click', downloadMemo);
  window.addEventListener('afterprint', function () { document.body.classList.remove('print-plan'); });

  /* ---------- review notes (preview only) ---------- */
  if (D.meta.showReviewFlags) {
    var sec = $('#review'); sec.hidden = false;
    var html = '';
    if (D.globalReview && D.globalReview.length) {
      html += '<details open><summary>General (' + D.globalReview.length + ')</summary>' + list(D.globalReview.map(function (r) { return r.title + ': ' + r.note; })) + '</details>';
    }
    courses.forEach(function (c) {
      if (!c.review || !c.review.length) { return; }
      html += '<details><summary>' + esc(c.title) + ' (' + c.review.length + ')</summary><ul>' + c.review.map(function (r) {
        return '<li><strong>' + esc(r.field) + ':</strong> ' + esc(r.note) + (r.supplied ? ' <em>Supplied: ' + esc(r.supplied) + '. Official: ' + esc(r.official) + '.</em>' : '') + '</li>';
      }).join('') + '</ul></details>';
    });
    $('#review-list').innerHTML = html;
  }

  /* ---------- go ---------- */
  renderList();
  renderPlanner();
  pRoot.hidden = false;
  if (location.hash.indexOf('#course-') === 0) {
    var hid = location.hash.slice(8);
    if (byId[hid]) { openDrawer(hid, document.querySelector('.row[data-id="' + hid + '"]')); }
  }
})();
