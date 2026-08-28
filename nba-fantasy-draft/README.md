# Fantasy NBA Draft

Egy fantasy football-stílusú, de NBA-s draft-játék: snake draftban választasz 5 kosárlabdázót egy 4 csapatos
mezőnyben (te + 3 bot csapat), majd megnézed, hogy a csapatod hogyan áll a fantasy pontok alapján — plusz
szimulálhatsz egy hetet, hogy lásd, ki nyerne egy adott meccsnapon.

## Miért nincs élő NBA-adat?

A kriptós RoboTrade-hez hasonlóan itt is kerestem egy ingyenes, kulcs nélküli adatforrást — de az NBA-nak
nincs ilyen nyilvános API-ja (a stats.nba.com böngészőből nem hívható CORS miatt, a legtöbb ingyenes
harmadik feles API pedig regisztrációt/kulcsot kér). Ezért ez a verzió **statikus, realisztikus, de nem élő**
szezon-átlagokkal dolgozik kb. 50 ismert NBA-játékosra — a hangsúly a draft-élményen és a fantasy-pontozáson
van, nem egy pontos statisztikai adatbázison.

## Hogyan működik?

- **Draft** (`src/lib/draft.ts`) — 4 csapat, 5 kör, snake sorrend (1-2-3-4, majd 4-3-2-1, …). Te mindig az 1.
  csapat vagy. Amikor egy bot csapatra kerül a sor, azonnal (automatikusan) választ — jellemzően a legjobb
  elérhető játékost, kis véletlenszerűséggel a top 3 közül, hogy ne legyen minden draft egyforma.
- **Fantasy pontozás** (`src/lib/scoring.ts`) — egy szokásos "points league" formula: PTS + REB×1,2 + AST×1,5
  + STL×3 + BLK×3 + 3PM×0,5 − TOV.
- **Eredmények** — a 4 csapat rangsorolva a becsült meccsenkénti fantasy pontátlag alapján.
- **Hét szimulálása** (`src/lib/weekSim.ts`) — minden játékosnál az átlaga körül ~22%-os szórású véletlen
  ingadozást generál (egy "meccsest" szimulálva), és összesíti csapatonként — így minden kattintásra más
  csapat is nyerhet, akkor is, ha összességében gyengébb a kerete.
- Minden adat (a folyamatban lévő draft) a böngésző `localStorage`-ában tárolódik — nincs backend, nincs fiók.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
