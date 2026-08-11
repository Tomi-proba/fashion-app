import type { RobotDef } from '../types';

export const ROBOTS: RobotDef[] = [
  {
    id: 'trend-btc',
    name: 'Trend Vadász',
    tagline: 'Mozgóátlag-keresztezésre épülő trendkövető a Bitcoin valós, élő árfolyamán.',
    description:
      'Rövid és hosszú mozgóátlagot figyel a Bitcoin élő árfolyamán: emelkedő trendben növeli, forduláskor csökkenti a kitettséget. Erős trendekben teljesít jól, oldalazó piacon a gyakori jelváltás miatt veszíthet is.',
    strategyId: 'trend',
    assetSymbol: 'BTCUSDT',
    riskLevel: 'közepes',
    price: 500,
  },
  {
    id: 'meanrev-eth',
    name: 'Digitális Öböl',
    tagline: 'Átlaghoz visszahúzó stratégia az Ethereum valós árfolyamán.',
    description:
      'Az Ethereum élő árfolyamán keresi az átlagostól erősen eltérő pillanatokat: visszaesésnél vásárol, kiugráskor csökkent. A négy figyelt kriptovaluta közül ez jellemzően a nyugodtabb sávban mozog, de kripto lévén így is jelentősen ingadozhat.',
    strategyId: 'meanReversion',
    assetSymbol: 'ETHUSDT',
    riskLevel: 'közepes',
    price: 350,
  },
  {
    id: 'momentum-sol',
    name: 'Momentum Ragadozó',
    tagline: 'Agresszív momentum-stratégia a Solana valós, erősen volatilis árfolyamán.',
    description:
      'A Solana erős mozgásait próbálja tovább lovagolni. A négy figyelt eszköz közül ez jellemzően a legvolatilisebb a nagyobbak közül, ezért a legnagyobb nyereség- és veszteség-potenciállal is rendelkezik.',
    strategyId: 'momentum',
    assetSymbol: 'SOLUSDT',
    riskLevel: 'magas',
    price: 800,
  },
  {
    id: 'grid-doge',
    name: 'Rács Mester',
    tagline: 'Apró, gyakori lépésekben kereskedő rácsstratégia a Dogecoin szélsőségesen ingatag árfolyamán.',
    description:
      'A Dogecoin valós árfolyamán egy csúszó középárhoz képest fokozatosan épít és bont pozíciót. Rendkívül volatilis, meme-eredetű eszköz — sok kisebb kereskedést köt, így a díjak is érzékenyebben csípnek bele a hozamba.',
    strategyId: 'grid',
    assetSymbol: 'DOGEUSDT',
    riskLevel: 'magas',
    price: 450,
  },
  {
    id: 'trend-sol',
    name: 'Solana Trend',
    tagline: 'Trendkövető stratégia a legvolatilisebb figyelt eszközön — nagy tét, nagy kilengés.',
    description:
      'Ugyanaz a mozgóátlag-logika, mint a Trend Vadásznál, de a sokkal ingatagabb Solanán. Erős trendekben nagyot szólhat, hirtelen fordulóknál viszont fájdalmasan is tud tévedni.',
    strategyId: 'trend',
    assetSymbol: 'SOLUSDT',
    riskLevel: 'magas',
    price: 700,
  },
  {
    id: 'momentum-btc',
    name: 'Bitcoin Momentum',
    tagline: 'Momentum-stratégia a Bitcoin árfolyamán.',
    description:
      'A Bitcoin rövid távú lendületét követi. A négy figyelt eszköz közül a Bitcoin jellemzően a legkevésbé kiszámíthatatlan, cserébe ritkábban ad erős jelzést.',
    strategyId: 'momentum',
    assetSymbol: 'BTCUSDT',
    riskLevel: 'közepes',
    price: 400,
  },
];

export function getRobot(id: string): RobotDef | undefined {
  return ROBOTS.find((r) => r.id === id);
}
