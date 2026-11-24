// The card database as pages: an address for every card, the one order
// every ranked list uses, and the groups the hub pages are built from. Pure:
// the build (tools/build.mjs) and the browser both call it with the same
// cards, so a card's address can't differ between the page and the link.

import { statsFor, POSITIONS } from '../data/football.js';
import { rarity as rarityOf, isSpecial } from '../data/rarities.js';

export const slugPart = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// A card's address: the player, the club, then the special set it belongs to.
// The Collection Book prints surnames only, so the club is always part of it:
// "Test Striker" of Test FC, Team of the Week -> test-striker-test-fc-team-of-the-week.
// Two cards that would still share one take the OVR as well, then the position,
// then their slot in the club's book.
// A card the game shows with no name on it goes by "Unknown", and its address
// is a number instead: unknown-001, unknown-002, in a fixed order (league,
// club, OVR, position, stats) so a card keeps its address from build to build.
export const UNKNOWN = 'Unknown';
const unknownOrder = (c) => [c.league || '', c.club || '', String(100 - c.ovr).padStart(3, '0'), c.pos?.[0] || '', JSON.stringify(c.stats || {})].join('|');

export function cardSlugs(list) {
  const groups = {};
  const out = {};
  const unknown = (list || []).filter((c) => c.name === UNKNOWN).sort((a, b) => (unknownOrder(a) < unknownOrder(b) ? -1 : unknownOrder(a) > unknownOrder(b) ? 1 : 0));
  unknown.forEach((c, i) => { out[c.id] = 'unknown-' + String(i + 1).padStart(3, '0'); });
  for (const c of list || []) {
    if (c.name === UNKNOWN) continue;
    const key = [slugPart(c.name), slugPart(c.club), isSpecial(c.rarity) ? c.rarity : ''].filter(Boolean).join('-');
    (groups[key] = groups[key] || []).push(c);
  }
  for (const [key, group] of Object.entries(groups)) {
    for (const c of group) {
      let slug = key || 'card';
      if (group.length > 1) {
        slug += '-' + c.ovr;
        const same = group.filter((x) => x.ovr === c.ovr);
        if (same.length > 1) slug += '-' + slugPart(c.pos[0]);
        if (same.filter((x) => x.pos[0] === c.pos[0]).length > 1 && c.slot) slug += '-' + c.slot;
      }
      out[c.id] = slug;
    }
  }
  return out;
}

// The six sub-stats added up, the tie-break after OVR.
export const statTotal = (c) => statsFor(c.pos[0]).reduce((s, d) => s + (Number(c.stats?.[d.key]) || 0), 0);

// Best first: OVR, then the stat total, then by address so a tie always
// falls the same way. Every ranked list on the site uses this one order.
export function rankCards(list, slugs) {
  return [...list].sort((a, b) => b.ovr - a.ovr || statTotal(b) - statTotal(a)
    || ((slugs?.[a.id] || a.name) < (slugs?.[b.id] || b.name) ? -1 : 1));
}

// 1st 2nd 3rd 4th ... 11th 12th 13th ... 21st 22nd
export function ordinal(n) {
  const t = n % 100;
  if (t >= 11 && t <= 13) return n + 'th';
  return n + ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');
}

// Where a card stands among others: 1 + those strictly better, and how many
// are level with it on both OVR and stat total.
export function rankOf(card, among) {
  const total = statTotal(card);
  const better = among.filter((c) => c.ovr > card.ovr || (c.ovr === card.ovr && statTotal(c) > total)).length;
  const level = among.filter((c) => c !== card && c.id !== card.id && c.ovr === card.ovr && statTotal(c) === total).length;
  return { rank: better + 1, level, of: among.length };
}

// ---- the hubs: a page per special rarity, club and position ---------------
export const HUBS = {
  rarity: { path: 'ufm27/rarities/', of: (c) => (isSpecial(c.rarity) ? c.rarity : ''), name: (v) => rarityOf(v).name, slug: (v) => v },
  club: { path: 'ufm27/clubs/', of: (c) => c.club, name: (v) => v, slug: slugPart },
  position: { path: 'ufm27/positions/', of: (c) => c.pos[0], name: (v) => v, slug: (v) => v.toLowerCase() },
};

// { value -> cards } for one kind, only for values a card carries.
export function groupsOf(kind, list) {
  const out = new Map();
  for (const c of list) {
    const v = HUBS[kind].of(c);
    if (!v) continue;
    if (!out.has(v)) out.set(v, []);
    out.get(v).push(c);
  }
  return out;
}

export const hubHref = (kind, value) => (value ? `${HUBS[kind].path}${HUBS[kind].slug(value)}/` : '');

// The value a hub page's slug stands for, read back from the cards.
export function hubValue(kind, slug, list) {
  for (const v of groupsOf(kind, list).keys()) if (HUBS[kind].slug(v) === slug) return v;
  return kind === 'position' ? POSITIONS.find((p) => p.toLowerCase() === slug) || null : null;
}
