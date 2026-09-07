# Budapest Útvonaltervező

Valódi, interaktív térkép Budapestről: beírod, honnan hova mész (nem kell kattintgatni fix pontok közt), és az
app három közlekedési módra — autó, kerékpár, gyaloglás — valódi útvonalat számol a tényleges utcahálózaton,
majd megmutatja, melyik a **legrövidebb**, a **leggyorsabb** és a **legtakarékosabb**.

## Milyen adatforrásokat használ?

Mindhárom ingyenes, kulcs nélküli, publikus szolgáltatás — nincs backend, nincs regisztráció:

- **Térkép** — valódi OpenStreetMap csempék (`tile.openstreetmap.org`), Leaflet segítségével megjelenítve.
- **Helykeresés** — a beírt cím/helynév a Nominatim (OpenStreetMap) geokódoló szolgáltatáson keresztül
  fordul le koordinátára, Budapestre súlyozva a találatokat.
- **Útvonalszámítás** — a valódi utcahálózaton az OSRM (Open Source Routing Machine) számolja ki az
  útvonalat. Az autós profilhoz az OSRM hivatalos publikus demószervere, a kerékpáros és gyalogos profilhoz a
  FOSSGIS/OpenStreetMap.de közösségi tükre válaszol.

Mivel mindhárom külső, élő hálózati szolgáltatás, ezekhez **valódi internetkapcsolat kell a böngészőből** —
helyi fejlesztés közben (`npm run dev`) ez a szokásos módon működik. Ha valamelyik demószerver éppen túlterhelt
vagy nem válaszol, az adott közlekedési mód kártyáján hibaüzenet jelenik meg ahelyett, hogy az egész app
elszállna.

## Miért nincs valódi tömegközlekedési (BKK) útvonal?

Nyilvános, kulcs nélküli, élő magyar tömegközlekedési routing API nem létezik — a BKK saját API-ja
regisztrációt/kulcsot igényel. Emiatt a harmadik összehasonlított mód a kerékpár lett, amit az OSRM ugyanúgy
valós útvonalon, valós idő- és távolságadattal tud számolni, mint az autót vagy a gyaloglást.

## Hogyan működik?

- **Helykeresés** (`src/lib/geocode.ts`, `src/components/SearchBox.tsx`) — legördülő javaslatlista, ahogy
  gépelsz (debounce-olva, hogy ne terheljük feleslegesen a Nominatim szervert).
- **Útvonalszámítás** (`src/lib/routing.ts`) — a kiválasztott két pont közt egyszerre kér útvonalat mindhárom
  módra; a becsült költséget (`src/lib/modeParams.ts`) az OSRM-től kapott valós távolságból számolja (autó:
  ~55 Ft/km üzemanyagbecslés, kerékpár/gyaloglás: ingyenes).
- **Térkép** (`src/components/MapView.tsx`) — Leaflet térkép valódi OSM csempékkel, a kiválasztott két pont
  jelölővel, a három útvonal pedig a tényleges utcavonalon, módonként más színnel.
- **Összehasonlítás** (`src/components/RouteSummary.tsx`) — módonkénti kártyák táv/idő/becsült költség
  adatokkal, "Legrövidebb" / "Leggyorsabb" / "Legtakarékosabb" jelvényekkel a nyertes mód(ok)on.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver — élő internetkapcsolat kell a térkép/keresés/útvonal működéséhez
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
