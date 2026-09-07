# Budapest Útvonaltervező

Valódi, interaktív térkép Budapestről: beírod, honnan hova mész (nem kell kattintgatni fix pontok közt), és az
app négy közlekedési módra — **autó, metró, busz, villamos** — kiszámolja és összehasonlítja az útvonalat,
megmutatva, melyik a **legrövidebb**, a **leggyorsabb** és a **legtakarékosabb**.

## Milyen adatforrásokat használ?

- **Térkép** — valódi OpenStreetMap csempék (`tile.openstreetmap.org`), Leaflet segítségével megjelenítve.
- **Helykeresés** — a beírt cím/helynév a Nominatim (OpenStreetMap) geokódoló szolgáltatáson keresztül
  fordul le koordinátára, Budapestre súlyozva a találatokat.
- **Autós útvonal** — a valódi utcahálózaton az OSRM (Open Source Routing Machine) hivatalos publikus
  demószervere számolja ki a tényleges útvonalat, valós táv- és időadattal.

Mindhárom fenti ingyenes, kulcs nélküli, publikus szolgáltatás — nincs backend, nincs regisztráció, de
**valódi internetkapcsolat kell a böngészőből**: helyi fejlesztés közben (`npm run dev`) ez a szokásos módon
működik. Ha az OSRM demószerver éppen túlterhelt vagy nem válaszol, az autó kártyán hibaüzenet jelenik meg
ahelyett, hogy az egész app elszállna.

## Miért csak becslés a metró/busz/villamos?

Nyilvános, kulcs nélküli, élő BKK menetrend-/útvonaltervező API nem létezik — a valódi vonalakkal, megállókkal
és menetrenddel dolgozó tervezéshez a BKK saját OpenData API-ja kellene, ami ingyenes, de regisztrációhoz (API
kulcshoz) kötött (`opendata.bkk.hu`). Emiatt a metró/busz/villamos időt és távot **légvonaltávolságból
(Haversine-képlet) és módonkénti átlagsebességből becsüljük** (`src/lib/routing.ts`) — ez nem valós vonal
szerinti útvonal, csak közelítés. A jegyár viszont a tényleges, egységes BKK-tarifa: egy vonaljegy 450 Ft,
függetlenül attól, hogy metróval, busszal vagy villamossal utazol.

Ha valaha valódi, vonal- és menetrend-pontos tömegközlekedési tervezés kell, egy ingyenes BKK OpenData API
kulccsal ez a réteg lecserélhető valódi routingra — a UI és az adatmodell már erre az elrendezésre épül.

## Hogyan működik?

- **Helykeresés** (`src/lib/geocode.ts`, `src/components/SearchBox.tsx`) — legördülő javaslatlista, ahogy
  gépelsz (debounce-olva, hogy ne terheljük feleslegesen a Nominatim szervert), kereső gombbal és Enterrel is
  elindítható.
- **Útvonalszámítás** (`src/lib/routing.ts`) — autóhoz élő OSRM-hívás, metró/busz/villamoshoz becslés; a
  költséget (`src/lib/modeParams.ts`) ennek megfelelően számolja (autó: ~55 Ft/km üzemanyagbecslés,
  tömegközlekedés: fix 450 Ft-os BKK-jegy).
- **Térkép** (`src/components/MapView.tsx`) — Leaflet térkép valódi OSM csempékkel, a kiválasztott két pont
  jelölővel, a négy útvonal módonként más színnel.
- **Összehasonlítás** (`src/components/RouteSummary.tsx`) — módonkénti kártyák táv/idő/becsült költség
  adatokkal, "Legrövidebb" / "Leggyorsabb" / "Legtakarékosabb" jelvényekkel a nyertes mód(ok)on.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver — élő internetkapcsolat kell a térkép/keresés/autós útvonal működéséhez
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
