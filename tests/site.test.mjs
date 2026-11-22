// The generated site: every route has its page, every page points home from
// its depth, every internal link lands on a file, and the site's tokens are
// the Brand's tokens.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROUTES } from '../site/js/data/routes.js';
import { POSTS } from '../site/js/data/posts.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');
const exists = (f) => access(f).then(() => true, () => false);

const pages = [
  ...ROUTES.filter((r) => r.path != null && !r.path.includes(':')).map((r) => ({ path: r.path, title: r.title })),
  ...POSTS.map((p) => ({ path: `blog/${p.slug}/`, title: `${p.title} | UFMWiz` })),
];

test('every route has a page with its own title and a base back to the root', async () => {
  for (const p of pages) {
    const html = await readFile(join(SITE, p.path, 'index.html'), 'utf8');
    const depth = p.path.split('/').filter(Boolean).length;
    assert.match(html, new RegExp(`<base href="${depth ? '(\\.\\./){' + depth + '}' : '\\./'}">`), p.path);
    assert.ok(html.includes(`<title>${p.title.replace(/&/g, '&amp;')}</title>`), `${p.path} title`);
    assert.ok(html.includes('UFMWiz is an independent fan project.'), `${p.path} disclaimer`);
  }
});

test('internal links resolve to files that exist', async () => {
  for (const p of pages) {
    // Links resolve against the <base>, which is the site root, so drop the base itself.
    const html = (await readFile(join(SITE, p.path, 'index.html'), 'utf8')).replace(/<base [^>]+>/, '');
    const hrefs = [...html.matchAll(/\s(?:href|src)="([^"#]+)"/g)].map((m) => m[1])
      .filter((h) => !/^(https?:|data:|mailto:)/.test(h) && h !== p.path);
    for (const h of hrefs) {
      const clean = h.split('?')[0];
      const target = join(SITE, clean.endsWith('/') || clean === './' ? join(clean, 'index.html') : clean);
      assert.ok(await exists(target), `${p.path} links to missing ${h}`);
    }
  }
});

test('the site runs on the Brand tokens', async () => {
  const brand = (await readFile(join(ROOT, 'brand/ufmwiz-tokens.css'), 'utf8')).split('\n').filter((l) => !l.startsWith('@import')).join('\n');
  const site = await readFile(join(SITE, 'css/tokens.css'), 'utf8');
  assert.equal(site, brand, 'site/css/tokens.css has drifted from brand/ufmwiz-tokens.css');
});

test('no page uses a game screenshot or game art', async () => {
  for (const p of pages) {
    const html = await readFile(join(SITE, p.path, 'index.html'), 'utf8');
    assert.doesNotMatch(html, /screenshots\/|\.jpe?g"/, p.path);
  }
});

// The built pages are committed and CI rebuilds them, so a page that read the
// clock would turn CI red on the first day an event ended. Build twice, five
// years apart, and the output has to be the same.
test('the build writes the same pages whatever day it runs', async () => {
  const { buildFiles, loadCards } = await import('../tools/build.mjs');
  const cards = await loadCards();
  const now = Date.now;
  let early, late;
  try {
    Date.now = () => Date.parse('2026-01-01T09:00:00Z');
    early = buildFiles({ cards });
    Date.now = () => Date.parse('2031-06-15T21:00:00Z');
    late = buildFiles({ cards });
  } finally {
    Date.now = now;
  }
  assert.equal(late.length, early.length);
  early.forEach((f, i) => assert.equal(late[i].content, f.content, `${f.rel} depends on the day it was built`));
});

test('the set stylesheet is what the drawing tool writes, on the site and in the brand folder', async () => {
  const { stylesheet, SETS } = await import('../tools/make-sets.mjs');
  const css = stylesheet();
  assert.equal(await readFile(join(SITE, 'css/sets.css'), 'utf8'), css, 'site/css/sets.css is stale: run node tools/make-sets.mjs');
  assert.equal(await readFile(join(ROOT, 'brand/ufmwiz-sets.css'), 'utf8'), css, 'brand/ufmwiz-sets.css is stale: run node tools/make-sets.mjs');
  // every set the data marks as drawn has a chip motif, and a face unless it keeps its own card
  const { RARITIES } = await import('../site/js/data/rarities.js');
  assert.deepEqual(RARITIES.filter((r) => r.art).map((r) => r.id).sort(), SETS.map((s) => s.id).sort());
  for (const s of SETS) {
    assert.ok(css.includes(`.hexchip--set-${s.id}, .rchip--set-${s.id} {`), `${s.id} has no chip motif`);
    assert.equal(css.includes(`.ucard--set-${s.id} {`), !s.chipOnly, `${s.id} card face`);
  }
  // drawn here, never taken: no picture file and nothing fetched (a drawing may point at its own gradient)
  assert.doesNotMatch(css, /url\((?!"data:image\/svg\+xml,|%23)/);
  assert.doesNotMatch(css, /https?:\/\/(?!www\.w3\.org\/2000\/svg)/);
});

test('a card of a drawn set wears the set, and its chip keeps the measured pair', async () => {
  const { shirtCard, hexchip, rarityChip } = await import('../site/js/ui/card.js');
  const card = { name: 'Test Striker', ovr: 88, pos: ['ST'], quality: 'rare', rarity: 'team-of-the-week', stats: {} };
  assert.match(shirtCard(card), /class="ucard ucard--set ucard--set-team-of-the-week"/);
  assert.match(hexchip(88, card), /hexchip--set-team-of-the-week" style="--fill:#121C1D;--rim:#E9CF33;/);
  assert.match(rarityChip('team-of-the-week'), /rchip--set-team-of-the-week" style="--fill:#121C1D;--rim:#E9CF33;/);
  // a set with no drawing yet falls back to its chip pair, and New Season keeps its own card
  assert.match(shirtCard({ ...card, rarity: 'christmas' }), /ucard--special/);
  assert.doesNotMatch(hexchip(88, { ...card, rarity: 'christmas' }), /--set-/);
  assert.match(shirtCard({ ...card, rarity: 'new-season' }), /ucard--season/);
  assert.match(hexchip(88, { ...card, rarity: 'new-season' }), /hexchip--set-new-season/);
});

test('every card carries the player figure, drawn inline and never fetched', async () => {
  const { shirtCard } = await import('../site/js/ui/card.js');
  const card = { name: 'Test Striker', ovr: 80, pos: ['ST'], quality: 'gold', rarity: 'normal', stats: {} };
  for (const rarity of ['normal', 'team-of-the-week', 'new-season', 'christmas']) assert.match(shirtCard({ ...card, rarity }), /<i class="ucard__plyr" aria-hidden="true"><\/i>/, rarity);
  assert.doesNotMatch(shirtCard(null), /ucard__plyr/, 'an empty slot keeps its own outline');
  const css = await readFile(join(SITE, 'css/ufm.css'), 'utf8');
  assert.match(css, /--tex-player: url\("data:image\/svg\+xml,/);
});
