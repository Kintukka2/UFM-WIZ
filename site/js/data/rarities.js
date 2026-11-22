// The special rarities of build 27.4.0, with the two colours of each set's OVR
// hexagon: its fill and its rim, measured from the game's own chips (see the
// Visual System, Rarities). The game tells specials apart by illustrated art we
// can't use, so this pair is how we tell them apart instead: never recolour one.
// Names are what the player sees on the card ("Matchday", not the internal name).
// `art` marks a set the game's rarity filter lists (seen Nov 2026): those have a
// card face and a chip motif of our own drawing, in the set stylesheet.

import { CARD_QUALITY } from './game.js';

export const RARITIES = [
  { id: 'normal', name: 'Normal', fill: null, rim: null },
  { id: 'academics', name: 'Academics', fill: '#2A3F36', rim: '#8E5723' },
  { id: 'africa-cup', name: 'Africa Cup', fill: '#1E721D', rim: '#F6DF28' },
  { id: 'autumn', name: 'Autumn', fill: '#4A1A21', rim: '#E99A71' },
  { id: 'carnival', name: 'Carnival', fill: '#003322', rim: '#E0AC24' },
  { id: 'centurions', name: 'Centurions', fill: '#330209', rim: '#F6E4AA' },
  { id: 'champions', name: 'Champions', fill: '#0036B5', rim: '#F2CC00' },
  { id: 'champions-evolution', name: 'Champions Evolution', fill: '#0C2250', rim: '#F2C800' },
  { id: 'champions-finalists', name: 'Champions Finalists', fill: '#C1B3AA', rim: '#F6EAC8' },
  { id: 'christmas', name: 'Christmas', fill: '#CA0202', rim: '#F2C800' },
  { id: 'club-hoppers', name: 'Club Hoppers', fill: '#00427D', rim: '#EE2244' },
  { id: 'deal-makers', name: 'Deal Makers', fill: '#000000', rim: '#313131' },
  { id: 'england-2-stars', name: 'England 2 Stars', fill: '#FDECE0', rim: '#E84242' },
  { id: 'european-evolutions', name: 'European Evolutions', fill: '#004FD9', rim: '#BD51D9', art: true },
  { id: 'future-stars', name: 'Future Stars', fill: '#162D50', rim: '#86B7D7' },
  { id: 'game-changers', name: 'Game Changers', fill: '#1E4C33', rim: '#D0AF21', art: true },
  { id: 'golden-ball', name: 'Golden Ball', fill: '#45290E', rim: '#D9B974' },
  { id: 'harvest', name: 'Harvest', fill: '#341806', rim: '#DEB659', art: true },
  { id: 'hidden-gems', name: 'Hidden Gems', fill: '#401D5A', rim: '#FFE658' },
  { id: 'legacy', name: 'Legacy', fill: '#F0C796', rim: '#8E544D' },
  { id: 'matchday', name: 'Matchday', fill: '#1D252A', rim: '#F3A90B' },
  { id: 'mavericks', name: 'Mavericks', fill: '#191B1C', rim: '#9C9C9C', art: true },
  { id: 'missing-stars', name: 'Missing Stars', fill: '#23265D', rim: '#C96EED' },
  { id: 'most-wanted', name: 'Most Wanted', fill: '#121C1D', rim: '#DB748B', art: true },
  { id: 'neon', name: 'Neon', fill: '#270691', rim: '#CF1CE7' },
  { id: 'new-season', name: 'New Season', fill: '#1F1F1F', rim: '#D1BD9D', art: true },
  { id: 'new-year', name: 'New Year', fill: '#846CAC', rim: '#3F347F' },
  { id: 'platinum', name: 'Platinum', fill: '#111926', rim: '#DBFFFF' },
  { id: 'player-picks', name: 'Player Picks', fill: '#011911', rim: '#7BEFB2' },
  { id: 'player-of-the-month', name: 'Player of the Month', fill: '#121C1D', rim: '#B39EE9', short: 'POTM' },
  { id: 'ptc', name: 'PTC', fill: '#170E08', rim: '#CBAE66' },
  { id: 'record-breakers', name: 'Record Breakers', fill: '#2E1F28', rim: '#E94242' },
  { id: 'screamers', name: 'Screamers', fill: '#3B1A3A', rim: '#424169', art: true },
  { id: 'shapeshifters', name: 'Shapeshifters', fill: '#103E3B', rim: '#8BAABD', art: true },
  { id: 'spring', name: 'Spring', fill: '#37C1FE', rim: '#D6EF00' },
  { id: 'starter', name: 'Starter', fill: '#002233', rim: '#43B66E' },
  { id: 'summer-heat', name: 'Summer Heat', fill: '#B9E39E', rim: '#F7DF88' },
  { id: 'super-heroes', name: 'Super Heroes', fill: '#0B2040', rim: '#9F9F9F', art: true },
  { id: 'team-of-the-season', name: 'Team of the Season', fill: '#011612', rim: '#E7D17F', short: 'TOTS' },
  { id: 'team-of-the-week', name: 'Team of the Week', fill: '#121C1D', rim: '#E9CF33', short: 'TOTW', art: true },
  { id: 'team-of-the-year', name: 'Team of the Year', fill: '#232B3F', rim: '#EED32C', short: 'TOTY' },
  { id: 'toty-nominees', name: 'TOTY Nominees', fill: '#1A416D', rim: '#E7C879' },
  { id: 'transfer-stars', name: 'Transfer Stars', fill: '#011529', rim: '#4DEDD8', art: true },
  { id: 'veterans', name: 'Veterans', fill: '#584022', rim: '#C89F6E', art: true },
  { id: 'weekend-league', name: 'Weekend League', fill: '#121C1D', rim: '#ABC96B', short: 'WL', art: true },
  { id: 'world-26', name: 'World 26', fill: '#507695', rim: '#E8E8E8' },
  { id: 'world-champions', name: 'World Champions', fill: '#2A170B', rim: '#EEE874' },
  { id: 'world-evolutions', name: 'World Evolutions', fill: '#34548E', rim: '#EEEEBB' },
  { id: 'world-weekly', name: 'World Weekly', fill: '#0A0A08', rim: '#2E6EBB' },
];

// A base card's quality is set by its OVR. The game prints the four bands on
// the market's rating filter (see CARD_QUALITY in game.js), and nothing else
// decides it: every base card from 83 up is Gold Rare.
export const QUALITIES = [
  { id: 'bronze', name: 'Bronze', fill: '#DCA981', rim: '#C68C63', metal: 'bronze' },
  { id: 'silver', name: 'Silver', fill: '#BBCCD5', rim: '#9EB2BB', metal: 'silver' },
  { id: 'gold', name: 'Gold', fill: '#E6D687', rim: '#D8BA68', metal: 'gold' },
  { id: 'rare', name: 'Gold Rare', fill: '#E8C975', rim: '#BE9959', metal: 'rare' },
].map((q) => ({ ...q, from: CARD_QUALITY[q.id][0], to: CARD_QUALITY[q.id][1] }));

export const rarity = (id) => RARITIES.find((r) => r.id === id) || RARITIES[0];
export const quality = (id) => QUALITIES.find((q) => q.id === id) || QUALITIES[2];
// The quality an OVR puts a card in. Below the lowest band counts as Bronze.
export const qualityFor = (ovr) => (QUALITIES.find((q) => ovr >= q.from && ovr <= q.to) || QUALITIES[ovr > 99 ? 3 : 0]).id;
// "Normal" and the two system sets don't count as a special for Chemistry.
export const isSpecial = (id) => !!id && !['normal', 'starter', 'ptc'].includes(id);
