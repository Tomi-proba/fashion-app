# RoboTrade — kereskedő robot demó (valós kriptoárfolyam, játékpénz)

Egy webalkalmazás, ahol a felhasználó **játékpénzzel** vásárolhat "kereskedő robotokat", amelyek automatikusan
kereskednek **valós, élő kriptoárfolyamokon** (Binance nyilvános adatfolyam, kulcs és regisztráció nélkül). A
cél egy tisztességes, kockázatokat is bemutató demó a "vegyél egy robotot, ami kereskedik helyetted" ötletről —
valós pénz és valós pénzügyi kockázat nélkül.

## Miért csak játékpénz?

Egy olyan alkalmazás, ami valós pénzt fogad be és *garantált* hozamot ígér, a legtöbb országban (Magyarországon
is) engedélyköteles pénzügyi szolgáltatásnak minősül, és a "mindig visszahozza az árát" típusú ígéret a
befektetési csalások (Ponzi-séma) klasszikus jellemzője — kereskedési robot ugyanis sosem tud garantáltan
nyereséges lenni, mert a piaci kockázat mindig valós, akkor is, ha az árfolyam valódi. Kriptovaluták emellett
jellemzően lényegesen volatilisebbek, mint a hagyományos részvények. Ezért ez a verzió:

- **nem fogad el valós befizetést** — a "Valós befizetés" gomb szándékosan le van tiltva,
- **sosem ígér garantált hozamot** — a robotok valós, élő árfolyamon kereskednek, és veszíthetnek is,
- mindenhol jelzi, hogy a pénz játékpénz, csak az árfolyamadat valós.

## Élő adatforrás — nincs API-kulcs

Az árfolyam a [Binance](https://www.binance.com) nyilvános piaci adatfolyamából jön, amihez **nem kell sem
regisztráció, sem API-kulcs** — ugyanazt az olvasás-only market data feedet használjuk, amit a saját weboldaluk
is. Az app kizárólag árfolyamot olvas, semmilyen fiókot, kereskedési engedélyt vagy hitelesítést nem igényel.

- **REST bootstrap**: induláskor egy `/api/v3/ticker/24hr` hívás szimbólumonként (4 db), kulcs nélkül.
- **Élő stream**: onnantól egy `wss://stream.binance.com:9443/ws` nyilvános WebSocket-kapcsolat szállítja a
  valós kereskedéseket, szintén hitelesítés nélkül.
- A négy figyelt eszköz: **Bitcoin** (BTCUSDT), **Ethereum** (ETHUSDT), **Solana** (SOLUSDT), **Dogecoin**
  (DOGEUSDT) — a kriptopiac 0–24 órában, a hét minden napján kereskedik, tehát itt nincs "piac zárva" holtidő,
  mint tőzsdei részvényeknél lenne.
- Nincs hosszú távú historikus árfolyamadat becsatolva, ezért a "hozam" és a visszatesztelt grafikonok mindig
  **az adott böngésző-munkamenet során, élőben gyűjtött** adatokra épülnek.

**Fontos korlát:** ha ezt az appot Claude Artifact-előnézetként kapod, ott a szigorú tartalombiztonsági
szabályzat (CSP) blokkol minden külső hálózati hívást, így az élő Binance-kapcsolat ott **nem** fog működni —
csak akkor, ha ténylegesen futtatod az appot (`npm run dev`, vagy saját hosting).

## Két külön "pénzmozgás" — robot ára vs. befektetett tőke

Vásárláskor két, egymástól elkülönített összeg mozog:

- **Robot ára** (fix, stratégiánként — pl. 500 kredit) — egyszeri, nem visszatéríthető díj. Egy valós termékben
  ez lenne az üzemeltető bevétele; a demóban egy külön "platform revenue" számlálóba kerül (`src/lib/platform.ts`),
  amit az Áttekintés fülön, az "Üzemeltetői nézet" panelen látsz.
- **Befektetett tőke** (a te választásod, minimum 50 kredit) — ez a robot tényleges kereskedési tőkéje, ez adja
  a `OwnedRobot.costBasis`-t, és eladáskor (a robot árától függetlenül) ennek az aktuális értékét kapod vissza.

Mindkét összeg egy közös helyen, `src/lib/payments.ts`-ben megy át (`purchaseRobotFee`, `depositCapital`) —
ez a kijelölt csereszabatos pont, ha valaha valós fizetésre állnátok át: a két függvény törzsét kellene lecserélni
egy valós fizetési szolgáltató (pl. Stripe) hívására, ugyanazzal a `PaymentResult` visszatérési formával, és
minden hívó (`src/lib/useGame.ts`) változatlanul működne tovább. Fontos: egy **valós** verzió már nem lehetne
tisztán kliensoldali — a fizetés jóváhagyásához és az egyenlegek (üzemeltetői bevétel, felhasználói tőke)
biztonságos tárolásához backend kellene, localStorage helyett. És — ahogy korábban is jeleztem — a valós pénzes
verzió elindítása pénzügyi szolgáltatói engedélyt (Magyarországon MNB) és KYC/AML-folyamatot igényelne, amit ez
a kód nem old meg és nem vált ki.

## Funkciók

- **Piactér** — 4 robot-stratégia (trendkövető, átlaghoz visszahúzó, momentum, rácsstratégia). Mindegyiknek fix
  ára van (`RobotDef.price`), és egy lépésben állítod be hozzá: eszköz (BTC/ETH/SOL/DOGE), kockázati szint
  (alacsony/közepes/magas — ez ténylegesen befolyásolja, mekkora kilengéssel kereskedik) és befektetett tőke. A
  vásárlás egyszeri — utána a beállítást már nem kell (és nem is lehet) újra megvenni, csak eladással lehet
  lezárni a pozíciót.
- **Robotjaim** — a megvásárolt (konfigurált) robot-példányok élő, valós árfolyamon futó teljesítménye, "hány
  százalék térült meg a vételárból" mutatóval (ez a befektetett tőkéhez, nem a robot árához viszonyít), eladási
  lehetőséggel.
- **Ranglista** — az összes stratégia × eszköz kombináció mai hozama közepes kockázaton, rangsorolva — ez segít
  eldönteni, mi teljesített ma a legjobban, majd egy gombbal meg is nyitja a beállító/vásárló ablakot.
- **Áttekintés** — teljes vagyon, egyenleg, a figyelt kriptovaluták élő árfolyama és utolsó kereskedésük ideje.
- **Adatforrás** — az adatforrás magyarázata, kapcsolat állapota, kézi frissítés.
- **Játékpénz** — indulórakomány + naponta egyszer igényelhető extra egyenleg.

## Hogyan működik?

- A WebSocket-kapcsolat (`src/lib/binance.ts`, `src/lib/useGame.ts`) valós kereskedéseket kap a 4 figyelt
  eszközre; ezeket legfeljebb másodpercenként egyszer csoportosítva írjuk a state-be (`FLUSH_INTERVAL_MS`),
  hogy egy pörgős pár (pl. BTC/ETH) adatfolyama ne terhelje túl a UI-t vagy a `localStorage`-ot.
  Kapcsolatvesztés esetén exponenciális backoff-fal újracsatlakozik.
- Minden stratégia (`src/lib/strategies.ts`) az árfolyam-történetből számol egy célzott kitettséget (0–100%),
  amit a kockázati szint egy szorzóval erősít vagy tompít (`RISK_MULTIPLIER`: alacsony 0,5×, közepes 1×, magas
  1,8×), majd a portfóliókezelő (`src/lib/portfolio.ts`) 0,15%-os kereskedési díj mellett érvényesít.
- Egy `RobotDef` (`src/data/robots.ts`) csak a stratégiát jelöli — az eszközt, a kockázati szintet és a tőkét a
  `RobotConfigModal` komponensben választod ki vásárláskor; ezek az `OwnedRobot` példányon tárolódnak, nem a
  robot-katalógusban.
- A megőrzött árfolyam-történet szimbólumonként korlátozott (`src/lib/market.ts`, `MAX_HISTORY_LENGTH`) — amikor
  betelik, a legrégebbi pontok lekerülnek, de egy abszolút index-eltolás (`historyOffsets`) miatt egy régebben
  vásárolt robot költségalapja akkor is helyesen követhető marad, ha időközben a pontjai már lekerültek
  (`src/lib/ownedRobots.ts`).
- Minden adat (piac, pénztárca, robotok) a böngésző `localStorage`-ában tárolódik — nincs backend, nincs valós
  felhasználói fiók.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
