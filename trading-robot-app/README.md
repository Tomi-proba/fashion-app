# RoboTrade — személyes kereskedési jelzőeszköz (kizárólag saját használatra)

Egy webalkalmazás, ami **nem kezel pénzt és nem kereskedik** — csak megmutatja, mit javasolna most egy adott
stratégia egy valós, élő kriptoárfolyamon. Egy tisztán személyes, tájékoztató eszköz: te döntesz, mit csinálsz
az információval.

## Mit csinál, és mit nem

- **Mit csinál:** figyeled a stratégia + eszköz + kockázati szint kombinációkat ("figyelők"), és élőben látod,
  mit javasolna a stratégia adott pillanatban (Erős vétel / Vétel / Tartás / Eladás / Erős eladás), plusz hogy a
  mai adatgyűjtés alapján hogyan teljesített volna.
- **Mit nem csinál:** nem fogad be pénzt, nem tart nyilván egyenleget, nem vásárol és nem ad el semmit, nincs
  felhasználói fiók, nincs több felhasználó — ez kizárólag a te böngésződben fut, a te saját döntéshozatalodhoz.
- **Nem minősül befektetési tanácsadásnak.** A jelzések egyszerű, mechanikus szabályok (mozgóátlag, momentum
  stb.) kimenetei — nem garantálnak semmit, és a kriptopiac erősen ingadozhat.

## Élő adatforrás — nincs API-kulcs

Az árfolyam a [Binance](https://www.binance.com) nyilvános piaci adatfolyamából jön, amihez **nem kell sem
regisztráció, sem API-kulcs** — ugyanazt az olvasás-only market data feedet használjuk, amit a saját weboldaluk
is. Az app kizárólag árfolyamot olvas, semmilyen fiókot, kereskedési engedélyt vagy hitelesítést nem igényel.

- **REST bootstrap**: induláskor egy `/api/v3/ticker/24hr` hívás szimbólumonként (4 db), kulcs nélkül.
- **Élő stream**: onnantól egy `wss://stream.binance.com:9443/ws` nyilvános WebSocket-kapcsolat szállítja a
  valós kereskedéseket, szintén hitelesítés nélkül.
- A négy figyelt eszköz: **Bitcoin** (BTCUSDT), **Ethereum** (ETHUSDT), **Solana** (SOLUSDT), **Dogecoin**
  (DOGEUSDT) — a kriptopiac 0–24 órában, a hét minden napján kereskedik.
- Nincs hosszú távú historikus árfolyamadat becsatolva, ezért a "mai hozam" és a diagramok mindig **az adott
  böngésző-munkamenet során, élőben gyűjtött** adatokra épülnek.

**Fontos korlát:** ha ezt az appot Claude Artifact-előnézetként kapod, ott a szigorú tartalombiztonsági
szabályzat (CSP) blokkol minden külső hálózati hívást, így az élő Binance-kapcsolat ott **nem** fog működni —
csak akkor, ha ténylegesen futtatod az appot (`npm run dev`, vagy saját hosting).

## Funkciók

- **Figyelőlista** — 4 stratégia (trendkövető, átlaghoz visszahúzó, momentum, rácsstratégia) közül választasz,
  hozzáadod egy eszközzel (BTC/ETH/SOL/DOGE) és kockázati szinttel (alacsony/közepes/magas — ez tényleg
  befolyásolja, mekkora kilengéssel jelez). Minden figyelő saját, élő jelzést és mai hozamot mutat.
- **Ranglista** — az összes stratégia × eszköz kombináció mai hozama és jelenlegi jelzése, közepes kockázati
  szinten, rangsorolva — segít eldönteni, mit érdemes figyelni.
- **Áttekintés** — a figyelőid jelenlegi jelzései egy pillantásra, plusz a figyelt kriptovaluták élő árfolyama.
- **Adatforrás** — az adatforrás magyarázata, kapcsolat állapota, kézi frissítés.

## Hogyan működik?

- A WebSocket-kapcsolat (`src/lib/binance.ts`, `src/lib/useGame.ts`) valós kereskedéseket kap a 4 figyelt
  eszközre; ezeket legfeljebb másodpercenként egyszer csoportosítva írjuk a state-be, hogy egy pörgős pár
  (pl. BTC/ETH) adatfolyama ne terhelje túl a UI-t vagy a `localStorage`-ot. Kapcsolatvesztés esetén
  exponenciális backoff-fal újracsatlakozik.
- Minden stratégia (`src/lib/strategies.ts`) az árfolyam-történetből számol egy célzott kitettséget (0–100%),
  amit a kockázati szint egy szorzóval erősít vagy tompít (`RISK_MULTIPLIER`: alacsony 0,5×, közepes 1×, magas
  1,8×). Ez a kitettség maga a jelzés — az utolsó adatponton kiszámolt érték (`src/lib/signal.ts`) öt sávba
  sorolva (erős vétel / vétel / tartás / eladás / erős eladás).
- A "mai hozam" egy visszateszt: ugyanaz a stratégia lefuttatva a mai, élőben gyűjtött árfolyam-történeten,
  0,15%-os kereskedési díjjal (`src/lib/portfolio.ts`) — pusztán tájékoztató kontextus, nem valós eredmény.
- Egy `Watch` (`src/types.ts`) csak egy stratégia + eszköz + kockázati szint kombinációt jelöl — nincs hozzá
  sem pénz, sem pozíció, csak egy azonosító és egy létrehozási időpont.
- Minden adat (piac, figyelők) a böngésző `localStorage`-ában tárolódik — nincs backend, nincs felhasználói
  fiók, nincs más felhasználó.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```
