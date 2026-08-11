# RoboTrade — kereskedő robot demó (valós árfolyam, játékpénz)

Egy webalkalmazás, ahol a felhasználó **játékpénzzel** vásárolhat "kereskedő robotokat", amelyek automatikusan
kereskednek **valós, élő tőzsdei árfolyamokon** (Finnhub API). A cél egy tisztességes, kockázatokat is bemutató
demó a "vegyél egy robotot, ami kereskedik helyetted" ötletről — valós pénz és valós pénzügyi kockázat nélkül.

## Miért csak játékpénz?

Egy olyan alkalmazás, ami valós pénzt fogad be és *garantált* hozamot ígér, a legtöbb országban (Magyarországon
is) engedélyköteles pénzügyi szolgáltatásnak minősül, és a "mindig visszahozza az árát" típusú ígéret a
befektetési csalások (Ponzi-séma) klasszikus jellemzője — kereskedési robot ugyanis sosem tud garantáltan
nyereséges lenni, mert a piaci kockázat mindig valós, akkor is, ha az árfolyam valódi. Ezért ez a verzió:

- **nem fogad el valós befizetést** — a "Valós befizetés" gomb szándékosan le van tiltva,
- **sosem ígér garantált hozamot** — a robotok valós, élő árfolyamon kereskednek, és veszíthetnek is,
- mindenhol jelzi, hogy a pénz játékpénz, csak az árfolyamadat valós.

## Élő adatforrás beállítása

Az árfolyamokhoz egy ingyenes [Finnhub](https://finnhub.io/register) API-kulcs kell — az app első indításkor
elkéri, és csak a böngésződ `localStorage`-ában tárolja (nincs backend, nincs kulcs a kódban vagy a repóban).

- **REST bootstrap**: induláskor egy `/quote` hívás szimbólumonként (4 db) — az ingyenes csomag 60 hívás/percet
  enged, ebből egy törtrészt használunk fel.
- **Élő stream**: onnantól egy `wss://ws.finnhub.io` WebSocket-kapcsolat szállítja a valós kereskedéseket —
  ez nem esik a REST percenkénti limit alá, és max. 50 szimbólumig ingyenes (ebből 4-et figyelünk).
- A négy figyelt részvény: **AAPL** (Apple), **KO** (Coca-Cola), **TSLA** (Tesla), **XOM** (ExxonMobil) —
  ezek csak a New York-i tőzsde nyitvatartása alatt (hétköznap kb. 15:30–22:00 CET) mutatnak friss
  kereskedést, azon kívül a robotok egyszerűen várnak.
- Az ingyenes Finnhub-csomagon a historikus gyertyaadat (candle) végpont nem elérhető, ezért a "hozam" és a
  visszatesztelt grafikonok mindig **az adott böngésző-munkamenet során, élőben gyűjtött** adatokra épülnek,
  nem többéves historikus adatra.

**Fontos korlát:** ha ezt az appot Claude Artifact-előnézetként kapod, ott a szigorú tartalombiztonsági
szabályzat (CSP) blokkol minden külső hálózati hívást, így az élő Finnhub-kapcsolat ott **nem** fog működni —
csak akkor, ha ténylegesen futtatod az appot (`npm run dev`, vagy saját hosting).

## Funkciók

- **Piactér** — 6 robot, 4 különböző stratégiával (trendkövető, átlaghoz visszahúzó, momentum, rácsstratégia)
  4 valós részvényen. Minden robotnál látható egy, a mai adatgyűjtésen alapuló teljesítménygrafikon, kockázati
  szint, maximum visszaesés és volatilitás.
- **Robotjaim** — a megvásárolt robotok élő, valós árfolyamon futó teljesítménye, "hány százalék térült meg a
  vételárból" mutatóval, eladási lehetőséggel.
- **Ranglista** — a robotok rangsorolva a mai hozam szerint ("copy trading" élmény: a "követés" gomb egyszerűen
  megveszi az adott robotot).
- **Áttekintés** — teljes vagyon, egyenleg, a figyelt részvények élő árfolyama és utolsó kereskedésük ideje.
- **Beállítások** — Finnhub API-kulcs megadása/cseréje/törlése, kapcsolat állapota.
- **Játékpénz** — indulórakomány + naponta egyszer igényelhető extra egyenleg.

## Hogyan működik?

- A WebSocket-kapcsolat (`src/lib/finnhub.ts`, `src/lib/useGame.ts`) valós kereskedéseket kap a 4 figyelt
  részvényre; ezeket legfeljebb másodpercenként egyszer csoportosítva írjuk a state-be (`FLUSH_INTERVAL_MS`),
  hogy egy likvid részvény pörgős adatfolyama ne terhelje túl a UI-t vagy a `localStorage`-ot. Kapcsolatvesztés
  esetén exponenciális backoff-fal újracsatlakozik.
- Minden stratégia (`src/lib/strategies.ts`) az árfolyam-történetből számol egy célzott kitettséget (0–100%),
  amit a portfóliókezelő (`src/lib/portfolio.ts`) 0,15%-os kereskedési díj mellett érvényesít.
- A megőrzött árfolyam-történet szimbólumonként korlátozott (`src/lib/market.ts`, `MAX_HISTORY_LENGTH`) — amikor
  betelik, a legrégebbi pontok lekerülnek, de egy abszolút index-eltolás (`historyOffsets`) miatt egy régebben
  vásárolt robot költségalapja akkor is helyesen követhető marad, ha időközben a pontjai már lekerültek
  (`src/lib/ownedRobots.ts`).
- Minden adat (API-kulcs, piac, pénztárca, robotok) a böngésző `localStorage`-ában tárolódik — nincs backend,
  nincs valós felhasználói fiók.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
