# Changelog

All notable changes to UFMWiz are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Version numbers follow [VERSIONING.md](VERSIONING.md); read that before cutting
a release.

## [Unreleased]

## [0.11.0] - Unreleased

### Added

- **France 1 in the card database, and the start of France 2.** All
  eighteen France 1 club books (474 cards) and three of France 2's (82) bring
  the database to 6,063. Twenty-two of the new cards carry their full stats,
  and three of those show no name, so they are in as Unknown with the next
  three Unknown addresses.

## [0.10.0] - Unreleased

### Added

- **England 3 complete in the card database.** The twelve England 3 club books
  still to read, Bradford's second spread to Wigan, and the last spreads of
  Wimbledon and Bromley add 363 cards and bring the database to 5,507. One of
  them carries its full stats.

## [0.9.0] - Unreleased

### Added

- **Denmark 1 and England 1, 2 and 4 in the card database, and half of
  England 3.** All twelve Denmark 1 club books (321 cards), all twenty of
  England 1's (549), all twenty-four of England 2's (682), all twenty-four of
  England 4's (643) and twelve of England 3's (290) bring the database to
  5,144. Fifty-six of the new cards carry their full stats.

## [0.8.0] - Unreleased

### Added

- **Brazil 1 in the card database.** All twenty of the league's club books,
  SC Internacional to Chapecoense, add 652 cards and bring the database to
  2,659. Twenty-six of them carry their full stats.
- **A card the game shows with no name is Unknown.** One owned SK Beveren card
  shows in full with no name on it. It is in the database as Unknown, at
  unknown-001, until its name is read off the player's profile.

## [0.7.0] - Unreleased

### Added

- **Australia 1, Austria 1 and Belgium 1 in the card database.** Every club
  book of all three, 301, 330 and 511 cards, brings the database to 2,006.
  Thirty-five of the new cards carry their full stats.

## [0.6.0] - Unreleased

### Added

- **All of Argentina 1 is in the card database.** Córdoba Navies to Río
  Cuarto Blue bring it to 864 cards, every player in the league's 30 club
  books. Fourteen of them carry their full stats.

### Changed

- **Río Cuarto Blue goes by the name the game shows.** The club was listed
  under its real name, AA Estudiantes (Río Cuarto); its Collection Book calls
  it Río Cuarto Blue, so its page has moved to that name.

## [0.5.1] - Unreleased

### Fixed

- **The offline copy no longer grows with the card database.** It used to
  download every card's page the first time the site opened, which would have
  meant tens of thousands of pages once every club is in. Now it keeps a card
  page the first time you open it, and with no connection the site draws any
  other card from the card data, so every card still opens offline. Nothing
  you have saved is affected.

## [0.5.0] - Unreleased

### Added

- **The card database has its first 12 clubs.** Every player in the
  Argentina 1 books from Avellaneda Blue to Córdoba Blue is in, 341 cards,
  each with its OVR and position, read from a player's Collection Book. Six of
  them carry their full stats too. They can go straight into the PTC Solver,
  the Squad Builder and Compare.
- **A stat nobody has read yet prints as ??.** A Collection Book outline shows
  a player's OVR and position but not the six sub-stats, so those wait until
  someone reads the card itself. Compare prints it the same way.

### Changed

- **The card is laid out the way the game lays it out.** The stats sit as a
  small label with its number right beside it, in two columns a third of the
  way in, and the OVR, the position and the name are set at the game's sizes. The
  position starts on the same line as the OVR above it. White numbers carry
  a soft shadow so they hold over a busy face.
- **Every card shows a player.** A faceless head and shoulders sits behind the
  name, in the place and the greys the game uses, on base and special cards
  alike. It is drawn for the site, not taken from the game.
- **A card prints the whole name it carries.** "Martínez Quarta" stays
  "Martínez Quarta" instead of being cut to "Quarta", and a long name steps
  down a size to fit.
- **A card's address now carries its club.** The game's books print surnames
  only, so the club is what keeps two players with one name apart.

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
