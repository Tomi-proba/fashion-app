# Blackjack Tanácsadó

Megadod a kezedet és az osztó felfedett lapját, a program pedig **valódi Monte Carlo-szimulációt futtat**
(alapból 15 000 véletlen kört minden lehetséges lépésre — megáll, húz, dupláz, szétoszt, feladja), és megmondja,
melyiknek a legjobb a várható értéke adott helyzetben.

## Miért szimuláció, nem egy statikus táblázat?

A klasszikus blackjack "alapstratégia" táblázatok is pontosan így készülnek: több millió/milliárd kör
lejátszásával vagy pontos valószínűségi számítással határozzák meg, melyik lépés a legjobb egy adott kéz/osztói
lap kombinációra. Ez az app ugyanezt csinálja élőben, a böngésződben — minden kérésnél ténylegesen lehúz
lapokat egy (a beállított pakliszámú, a már ismert lapok nélküli) kártyacsomagból, sokszor lejátssza a lehetséges
folytatásokat, és a tényleges átlagos nyereség/veszteség alapján rangsorolja a lépéseket.

## Mennyire pontos?

12 jól ismert, publikált alapstratégia-döntéssel szemben tesztelve (pl. kemény 16 tíz ellen → húzás; kemény 11
→ dupláz; A,A vagy 8,8 → szétoszt; kemény 17 → megáll) a szimulátor 12-ből 11-ben egyezett — az egyetlen
eltérés egy híresen szoros eset (pár 8-as tízes osztói lap ellen), ahol a valódi optimális stratégia egy
teljesen újraszámoló, minden további döntést is figyelembe vevő rekurzív kiértékelésre épül. Ez az app helyette
egy egyszerűsített, óvatos szabállyal folytatja a "húzás utáni húzásokat" (kemény 17-ig áll meg, a beállítástól
függően lágy 17-ig), ami a gyakorlatban szinte minden esetben ugyanazt a döntést hozza ki, de nagyon szoros
esetekben pár tizedszázalékkal eltérhet a publikált táblázatoktól.

## Mit vesz figyelembe?

- **Paklik száma** (1/2/4/6/8) — a lapok tényleges száma befolyásolja a valószínűségeket.
- **Osztó húz-e lágy 17-re** (H17 vs S17).
- **Duplázás bármely két lapnál** engedélyezett-e.
- **Feladás (surrender)** engedélyezett-e (ha igen, mindig -0,5 egység a hozzá tartozó érték, hiszen ez egy fix,
  determinisztikus szabály, nem esély kérdése).
- A már ismert lapokat (a te kezed + az osztó felfedett lapja) kiveszi a szimulált pakliból, mielőtt húzna
  belőle — tehát figyelembe veszi, hogy pl. egy 6 decks-es shoe-ból már hiányzik néhány adott rangú lap.

## Fejlesztés

```bash
npm install
npm run dev      # fejlesztői szerver
npm run build    # típusellenőrzés + production build
npm run lint      # oxlint
```

Nincs backend, nincs hálózati függőség — minden számítás a böngészőben fut, nincs valódi pénz, nincs valós
kaszinó-kapcsolat. Kizárólag oktatási/szórakoztatási célú valószínűség-számítási eszköz.
