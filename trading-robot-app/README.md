# RoboTrade — kereskedő robot demó (játékpénzzel)

Egy webalkalmazás, ahol a felhasználó **játékpénzzel** vásárolhat "kereskedő robotokat", amelyek automatikusan
kereskednek egy szimulált piacon. A cél egy tisztességes, kockázatokat is bemutató demó a "vegyél egy robotot,
ami kereskedik helyetted" ötletről — valós pénz és valós pénzügyi kockázat nélkül.

## Miért csak játékpénz?

Egy olyan alkalmazás, ami valós pénzt fogad be és *garantált* hozamot ígér, a legtöbb országban (Magyarországon
is) engedélyköteles pénzügyi szolgáltatásnak minősül, és a "mindig visszahozza az árát" típusú ígéret a
befektetési csalások (Ponzi-séma) klasszikus jellemzője — kereskedési robot ugyanis sosem tud garantáltan
nyereséges lenni, mert a piaci kockázat mindig valós. Ezért ez a verzió:

- **nem fogad el valós befizetést** — a "Valós befizetés" gomb szándékosan le van tiltva,
- **sosem ígér garantált hozamot** — a robotok szimulált, véletlen árfolyamon kereskednek, és veszíthetnek is,
- mindenhol jelzi, hogy játékpénzről és szimulált adatokról van szó.

## Funkciók

- **Piactér** — 6 robot, 4 különböző stratégiával (trendkövető, átlaghoz visszahúzó, momentum, rácsstratégia)
  4 különböző szimulált eszközön. Minden robotnál látható egy visszatesztelt teljesítménygrafikon, kockázati
  szint, maximum visszaesés és volatilitás.
- **Robotjaim** — a megvásárolt robotok élő, szimulált teljesítménye, "hány százalék térült meg a vételárból"
  mutatóval, eladási lehetőséggel.
- **Ranglista** — a robotok rangsorolva szimulált hozam szerint ("copy trading" élmény: a "követés" gomb
  egyszerűen megveszi az adott robotot).
- **Áttekintés** — teljes vagyon, egyenleg, piaci eszközök árfolyama, idő gyorsítása demó célból.
- **Játékpénz** — indulórakomány + naponta egyszer igényelhető extra egyenleg.

## Hogyan működik a szimuláció?

- A piac 4 fiktív eszközön (`DEMO-TECH`, `DEMO-GOLD`, `DEMO-CRYPTO`, `DEMO-ENERGY`) geometriai Brown-mozgással
  generál árfolyamokat (`src/lib/market.ts`), naponta egyszer (2,5 másodpercenként, amíg az app nyitva van),
  determinisztikus, elmentett álvéletlen generátorral (`src/lib/rng.ts`), hogy az árfolyam újratöltés után is
  ott folytatódjon, ahol abbamaradt.
- Minden stratégia (`src/lib/strategies.ts`) az árfolyam-történetből számol egy célzott kitettséget (0–100%),
  amit a portfóliókezelő (`src/lib/portfolio.ts`) 0,15%-os kereskedési díj mellett érvényesít.
- Egy megvásárolt robot élő értéke mindig a vásárláskori árindextől futtatott szimulációból adódik
  (`src/lib/ownedRobots.ts`) — nincs külön, driftelő állapot, minden az árfolyam-történetből vezethető le.
- Minden adat (piac, pénztárca, robotok) a böngésző `localStorage`-ában tárolódik — nincs backend, nincs
  valós felhasználói fiók.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
