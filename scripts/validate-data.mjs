#!/usr/bin/env node
// Checks data/lm-diploma-data.js for common editing mistakes. No dependencies.
// Usage: node scripts/validate-data.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'data/lm-diploma-data.js'), 'utf8'), ctx);
const D = ctx.window.LMD_DATA;

const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const iso = /^\d{4}-\d{2}-\d{2}$/;
const day = (s) => new Date(s + 'T00:00:00Z');
const validDate = (s) => iso.test(s) && !Number.isNaN(day(s).getTime()) && day(s).toISOString().slice(0, 10) === s;
const clusterIds = new Set(D.clusters.map((c) => c.id));
const ids = new Set();

if (D.courses.filter((c) => c.mandatory).length !== 1) err('Exactly one course must have mandatory: true (the Academy).');
for (const c of D.courses) {
  const where = `[${c.id}]`;
  if (ids.has(c.id)) err(`${where} duplicate id`); ids.add(c.id);
  for (const k of ['title', 'start', 'end', 'format', 'location', 'languages', 'officialUrl', 'overview', 'audience', 'topics', 'outcomes', 'accent'])
    if (c[k] === undefined || c[k] === '' ) err(`${where} missing ${k}`);
  for (const k of ['start', 'end', 'deadline']) if (c[k] && !validDate(c[k])) err(`${where} ${k} must be a real YYYY-MM-DD date`);
  if (!/^[a-z][a-z0-9-]*$/.test(c.id)) err(`${where} id must contain lowercase letters, digits or hyphens`);
  if (c.deadlineTime && (!/^([01]\d|2[0-3]):[0-5]\d$/.test(c.deadlineTime) || !c.deadline || !c.deadlineTimeZone)) err(`${where} deadlineTime needs HH:MM, a deadline date and a timezone`);
  if (c.deadlineTimeZone) { try { new Intl.DateTimeFormat('en', { timeZone: c.deadlineTimeZone }); } catch { err(`${where} invalid deadlineTimeZone`); } }
  if (c.publicNotes && (!Array.isArray(c.publicNotes) || c.publicNotes.some(n => !n.label || !n.text))) err(`${where} publicNotes need label and text`);
  if (c.start > c.end) err(`${where} start is after end`);
  if (!['Online', 'Blended', 'Face-to-face'].includes(c.format)) err(`${where} format must be Online, Blended or Face-to-face`);
  if (c.format === 'Blended' && !c.f2f) err(`${where} blended courses need an f2f block`);
  if (c.format === 'Online' && c.f2f) warn(`${where} online course has an f2f block`);
  if (c.f2f) {
    if (!validDate(c.f2f.start) || !validDate(c.f2f.end) || c.f2f.start > c.f2f.end) err(`${where} invalid face-to-face dates`);
    if (c.f2f.start < c.start || c.f2f.end > c.end) err(`${where} face-to-face dates fall outside the course dates`);
    for (const k of ['start', 'end']) { const w = day(c.f2f[k]).getUTCDay(); if (w === 0 || w === 6) warn(`${where} face-to-face ${k} (${c.f2f[k]}) is a weekend day`); }
  }
  if (c.deadline && c.deadline >= c.start) warn(`${where} deadline is on or after the start date`);
  for (const cl of c.clusters) if (!clusterIds.has(cl)) err(`${where} unknown cluster ${cl}`);
  if (c.image && !fs.existsSync(path.join(root, c.image))) err(`${where} image not found: ${c.image}`);
  if (c.image && !c.imageAlt) err(`${where} image needs imageAlt`);
  if (!c.image && !c.coverLabel) warn(`${where} no image and no coverLabel`);
  if (!/^https:\/\/www\.itcilo\.org\//.test(c.officialUrl)) warn(`${where} officialUrl is not on www.itcilo.org`);
  if (c.applyUrl && !/^https:\/\/oarf2\.itcilo\.org\//.test(c.applyUrl)) warn(`${where} applyUrl is not an oarf2.itcilo.org link`);
  if (!c.languagesVerified && !c.languageNote) warn(`${where} unverified language needs languageNote`);
}
if (!fs.existsSync(path.join(root, D.programme.flyer.path))) err('Flyer PDF not found at ' + D.programme.flyer.path);
if (D.meta.showReviewFlags) warn('meta.showReviewFlags is true: internal review notes are visible. Set to false before launch.');

warnings.forEach((w) => console.log('warning: ' + w));
errors.forEach((e) => console.log('ERROR: ' + e));
console.log(`\n${D.courses.length} courses checked: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
