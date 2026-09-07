# Budapest Útvonaltervező

Kattintható térkép Budapestről: kiválasztasz egy indulási és egy célpontot a valós nevezetességek/csomópontok
közül, és az app egyszerre mutatja a **legrövidebb** (táv), **leggyorsabb** (idő) és **legtakarékosabb**
(költség) útvonalat — mindhármat valódi legrövidebb-út kereséssel kiszámolva, nem csak egyet.

## Miért sematikus a térkép?

Nincs valódi GPS-koordináta vagy térképszolgáltatás mögötte (az nem ingyenes/kulcs nélküli útvonaltervezésre
nem igazán elérhető) — helyette egy kézzel megrajzolt gráf van 27 valós budapesti csomóponttal (Széll Kálmán
tér, Nyugati/Keleti pályaudvar, Deák Ferenc tér, hidak stb.), amelyeket kb. 50 valósághű távolságú él köt
össze, Buda és Pest oldalán elrendezve, a Dunával középen. A hangsúly az útvonalválasztás logikáján van, nem
egy pixelpontos térképen.

## Hogyan működik?

- **Gráf** (`src/data/graph.ts`) — csomópontok (`NODES`) és élek (`EDGES`), minden élhez tartozik egy közlekedési
  mód (`walk` / `transit` / `car`) és egy valós becslésen alapuló távolság (km). A hidak (Margit híd, Lánchíd,
  Erzsébet híd, Szabadság híd, Petőfi híd) külön élként kötik össze a két oldalt.
- **Mód-paraméterek** (`src/lib/modeParams.ts`) — módonként egy átlagsebesség (km/h) és egy díjszámítás
  (gyaloglás ingyenes, tömegközlekedés fix viteldíj, autó km-alapú üzemanyagköltség), ebből számolódik minden
  élre az idő és a költség.
- **Útvonalkeresés** (`src/lib/routing.ts`) — Dijkstra-algoritmus, külön lefuttatva mindhárom kritériumra
  (távolság/idő/költség súlyozással), így a három javasolt útvonal ténylegesen a saját szempontja szerint
  optimális — és ez tud különbözni is (pl. a leggyorsabb út hídon át tömegközlekedéssel, a legtakarékosabb
  gyalogosan egy hosszabb, de ingyenes útvonalon).
- **Térkép** (`src/components/MapView.tsx`) — kattintható SVG: első kattintás = indulás, második = cél,
  harmadik kattintás új keresést kezd. A kiválasztott útvonalak külön színnel jelennek meg, ki-be kapcsolható
  módon.
- Nincs backend, nincs élő adat, nincs fiók — minden számítás a böngészőben fut.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
