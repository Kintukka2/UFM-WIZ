# Changelog

All notable changes to UFMWiz are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Version numbers follow [VERSIONING.md](VERSIONING.md); read that before cutting
a release.

## [Unreleased]

## [0.4.0] - Unreleased

### Added

- **Every special set the game lists now has its own card.** European
  Evolutions, Game Changers, Harvest, Mavericks, Most Wanted, Screamers,
  Shapeshifters, Super Heroes, Team of the Week, Transfer Stars, Veterans and
  Weekend League each get a card face drawn for the site, in colours measured
  from the set's card in the game. None of the game's art is used.
- **Their chips match.** Each of those sets, and New Season, carries a mark
  from its card on its chip, over the same chip colours as before.

### Changed

- **A card's quality now follows its OVR, the way the game sets it.** Bronze
  is 45 to 64, Silver 65 to 74, Gold 75 to 82 and Gold Rare 83 to 99, as the
  market's rating filter prints them. The Quality choice is gone from the card
  form, and a quality column in a CSV is ignored.
- **Saved cards:** nothing is lost. A card in My cards that was saved with a
  different quality shows the one its OVR sets the next time the site opens.

### Removed

- **Elite and Premium are no longer card qualities.** They belong to packs. A
  PTC requirement saved with either one no longer matches any card.

## [0.3.0] - Unreleased

### Changed

- **Gold Rare cards are brushed, the way the game draws them.** Fine gold
  streaks cross the left shoulder and the right hem, inside the foil border.
  Nothing you have saved is affected.

## [0.2.1] - Unreleased

### Fixed

- **The event calendar no longer changes the built pages from one day to the
  next.** Home and Events are written as of the day the calendar was checked,
  and your browser still shows today's status the moment the page opens.

## [0.2.0] - Unreleased

### Added

- **Works offline, and installs to a home screen.** A service worker keeps the
  whole site, every tool, post and icon, for the release you have. A new
  release replaces it the next time you open the site, and the last one's copy
  is deleted, so nobody is left on old code.
- **Help on every tool page.** A "?" in the corner answers the questions each
  page raises, in the game's own words, and "Show me around" walks through the
  page one piece at a time.
- **No paragraph ends on one word alone**, on any page, at any width.

### Changed

- **Saved data has a schema version.** Everything the site keeps in your
  browser is now recorded with the shape it was saved in, so a later release
  can move it forward instead of losing it. Nothing you saved under 0.1.0
  changes or has to be re-entered.

## [0.1.0] - 2026-10-30

### Added

- **The UFMWiz site**: Home, the PTC Solver, Players (the card database and
  My cards, with CSV import and export), the Squad Builder (the 19 formations,
  Chemistry per starter, team OVR, four lineups), Packs (sizes and an odds
  calculator), the Weekend League planner, Events, the Blog with three guides,
  and About.
- Everything you enter is kept in your browser and nowhere else.
