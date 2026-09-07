# Budapest Útvonaltervező

Valódi, interaktív térkép Budapestről: beírod, honnan hova mész — akár közbeeső megállókkal is (+ Megálló
hozzáadása) —, és kiválasztod (jelölőnégyzetekkel), melyik autós útvonalat szeretnéd látni a térképen:
**legrövidebb**, **leggyorsabb** vagy **legenergiatakarékosabb** — akár mindhármat egyszerre, összehasonlításképp.

## Milyen adatforrásokat használ?

- **Térkép** — valódi OpenStreetMap csempék (`tile.openstreetmap.org`), Leaflet segítségével megjelenítve.
- **Helykeresés** — a beírt cím/helynév a Nominatim (OpenStreetMap) geokódoló szolgáltatáson keresztül
  fordul le koordinátára, Budapestre súlyozva a találatokat.
- **Útvonal** — a valódi utcahálózaton az OSRM (Open Source Routing Machine) hivatalos publikus demószervere
  számolja ki az útvonalat, `alternatives=true` paraméterrel több útvonal-jelöltet is lekérve.

Mind ingyenes, kulcs nélküli, publikus szolgáltatás — nincs backend, nincs regisztráció, de **valódi
internetkapcsolat kell a böngészőből**: helyi fejlesztés közben (`npm run dev`) ez a szokásos módon működik.
Ha az OSRM demószerver éppen túlterhelt vagy nem válaszol, hibaüzenet jelenik meg ahelyett, hogy az egész app
elszállna.

## Hogyan lesz három különböző útvonal egyetlen autós módból?

Az OSRM egy kéréssel több útvonal-jelöltet (alternatívát) is visszaadhat ugyanarra a két pontra — pl. egy
gyorsabb, forgalmasabb főúti és egy rövidebb, kisebb utcákon vezető változatot. Ezek közül választja ki az app
külön-külön a legkisebb távolságút (**legrövidebb**), a legrövidebb menetidejűt (**leggyorsabb**), és egy
becsült üzemanyagköltség alapján legkedvezőbbet (**legenergiatakarékosabb**) — utóbbihoz azt is figyelembe
veszi, hogy alacsony átlagsebességű (sokat álló-induló) útvonalon jellemzően többet fogyaszt az autó
kilométerenként (`src/lib/modeParams.ts`). Ha az OSRM csak egyetlen útvonalat ad vissza két pont közt, mindhárom
kategória ugyanazt az egy útvonalat mutatja. Megállók hozzáadásakor (3+ pont) az OSRM valódi alternatívákat már
nem ad, ilyenkor a pontok sorrendjét betartó egyetlen útvonalat mutatja mindhárom kártya.

## Hogyan működik?

- **Helykeresés** (`src/lib/geocode.ts`, `src/components/SearchBox.tsx`) — legördülő javaslatlista, ahogy
  gépelsz (debounce-olva, hogy ne terheljük feleslegesen a Nominatim szervert), kereső gombbal és Enterrel is
  elindítható.
- **Útvonalszámítás** (`src/lib/routing.ts`) — egy OSRM-hívás `alternatives=true`-val, ebből választja ki a
  három kritérium szerinti legjobb jelöltet.
- **Térkép** (`src/components/MapView.tsx`) — Leaflet térkép valódi OSM csempékkel, a kiválasztott két pont
  jelölővel; a jelölőnégyzetekkel bekapcsolt kritériumok külön színnel jelennek meg.
- **Összehasonlítás** (`src/components/RouteSummary.tsx`) — kritériumonkénti kártyák táv/idő/becsült
  energiaköltség adatokkal.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver — élő internetkapcsolat kell a térkép/keresés/útvonal működéséhez
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
