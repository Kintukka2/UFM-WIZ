# Sending in a card (internal)

How a card a player can see in Ultimate Football Manager 27 becomes a card in
the UFMWiz database, with its own page at `/ufm27/players/<slug>/`.

**This is not the in-app import.** The CSV import on the Players page writes
into one browser's own storage and reaches nobody else. This is how a card
becomes part of the site for everyone.

## The rules

- **Read it off the card.** Every field is what the card prints, in the game's
  own spelling, capitals included. Nothing is worked out, remembered or
  guessed. A field you can't see stays blank.
- **Never invent a rating.** Not an OVR, not a stat, not a price. A card with
  no OVR still goes in the sheet; it waits in `docs/data/pending-cards.md`
  until someone reads its OVR off a screen.
- **Never anything about a real player beyond the card.** No ages from the
  internet, no clubs from the news. If the card doesn't print it, we don't
  have it.
- **Base ratings only.** On the lineup screen the game adds Chemistry (up to
  +3) and Focus (−2 to +2) to a card's OVR *and* to every sub-stat. Read the
  card from the Collection Book, the market or the player's profile outside a
  lineup. If the card shows Chemistry pips or a Focus arrow, its numbers are
  boosted: don't send them.
- **Credit by handle.** Every row names who sent it, spelled their way:
  `tester_two`, not `Tester Two`. That is the name the site credits.
- **No game files.** Nothing from the app's files, its servers or a datamine.
  A screenshot a player took of their own screen is the source; the screenshot
  itself stays with us and never goes on the site.

## Where it goes

`data/ufm27-extraction.csv`, one card per row. Then:

```
node tools/build-cards.mjs   # the sheet -> site/data/cards.json and pending-cards.md
node tools/build.mjs         # every card, rarity, club and position page
npm test
```

`node tools/build-cards.mjs --check` and `node tools/build.mjs --check` fail
if either output is stale, so a sheet edit without a rebuild can't ship.

## The columns

| Column | Needed | What to put |
|---|---|---|
| `name` | yes | The name the card prints, accents and all: `Ünïcode Ñame` keeps its marks. The page address drops them. |
| `ovr` | for the database | The big number top left, 1 to 99. Blank if you can't see it: the row waits in pending. |
| `position` | for the database | The code under the OVR, first. Other positions the profile shows follow, separated by spaces: `CM CAM`. |
| `quality` | no | Leave it blank. The OVR sets it, as the market's rating filter prints: Bronze 45 to 64, Silver 65 to 74, Gold 75 to 82, Gold Rare 83 to 99. Anything written here is ignored. |
| `rarity` | no | The special set's name as the card shows it, for example `Team of the Week`, `Screamers`, `Most Wanted`. Blank for a base card. The Halloween set shows as `Matchday`, and `Kick-Off` shows as `European Evolutions`: write what the card says. |
| `nation`, `league`, `club` | no | As printed. A club the game gives a stand-in name ("Manchester Red") keeps that name. |
| `age` | no | Only if the profile shows it. |
| `pac` … `phy` | no | An outfield card's six sub-stats, as the card prints them in two columns: PAC DRB / SHO DEF / PAS PHY. |
| `div` `han` `kck` `ref` `spd` `gkp` | no | A keeper's six instead: Diving, Handling, Kicking, Reflexes, Speed (the card prints it as PAC) and Positioning (POS). |
| `sellable` | no | `no` for a card marked Unsellable; blank or `yes` otherwise. |
| `slot` | no | The number a club's Collection Book prints beside the player, `12` for `#12`. Blank for a card the book shows in full, which prints no number. |
| `contributor` | yes | Their handle, their spelling. |
| `source` | yes | Where it came from: `Discord #cards`, `email`, `own account`. |
| `captured` | yes | The day the screenshot was taken, `YYYY-MM-DD`, or the day it reached us if nobody recorded that. Ratings change when the game pushes new ones, so the date matters. |
| `notes` | no | Anything a reviewer should know. Never shown on the site. |

### From a Collection Book page

A club's Collection Book shows every player the club has, and that is the
quickest way to fill the database: one screenshot of a spread is up to 24
cards. A card the player doesn't own prints as an outline with four things on
it, and those are all a row from a book page carries:

- `ovr` and `position`, top left of the outline;
- `slot`, the `#` number in the middle;
- `name`, the surname under it.

`club` is the book's title and `league` is printed top right. The sub-stats,
the nationality and the age are not on an outline, so they stay blank and the
site prints `??` for each stat until someone reads the card itself. A card the
player owns shows in full: take its stats and its nation flag too, and leave
`slot` blank, because a full card prints no number.

The book prints surnames only, so one club can hold two players with the same
name. The slot is what tells them apart, and a card's address carries the club.

The first row of the sheet names the columns. A column can be left out
entirely; a row can leave any optional field blank.

### Example rows

Made-up cards, to show the shape only:

```
name,ovr,position,quality,rarity,nation,league,club,age,pac,sho,pas,drb,def,phy,div,han,kck,ref,spd,gkp,sellable,slot,contributor,source,captured,notes
Test Striker,86,ST,Gold Rare,,Testland,Test League 1,Test FC,27,88,87,72,80,40,79,,,,,,,yes,TesterOne,Discord #cards,2026-10-29,
Demo Keeper,81,GK,Gold,,Testland,Test League 2,Demo City,,,,,,,,82,79,70,84,48,80,yes,tester_two,own account,2026-10-30,
Waiting Winger,,LW,Gold,Team of the Week,,,Sample United,,,,,,,,,,,,,,,TesterOne,Discord #cards,2026-10-30,OVR hidden behind a badge
```

The third row has no OVR, so it lands in `docs/data/pending-cards.md`, not on
the site.

## What the build does with a row

| The row | Where it goes |
|---|---|
| A name, an OVR and a position the game has | The database, and a page of its own |
| A name, but no OVR or no position | Pending, listed with what it is missing |
| An OVR outside 1–99, a position the game doesn't have (`LWB`, `CF`), an unknown rarity, or the same card twice | "Needs a human" in pending, with the reason |

A card's address is the player and its special set: `test-striker` for a base
card, `test-striker-team-of-the-week` for the TOTW version. When a second
version would share an address, both take the OVR (`test-striker-86`), and
then the position. So the first time a player gets a second base card, the
first card's address changes; the old one stops working, which is why the
build removes stale pages rather than leaving them up.
