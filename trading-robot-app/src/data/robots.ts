import type { RobotDef } from '../types';

export const ROBOTS: RobotDef[] = [
  {
    id: 'trend-aapl',
    name: 'Trend Vadász',
    tagline: 'Mozgóátlag-keresztezésre épülő trendkövető az Apple (AAPL) valós árfolyamán.',
    description:
      'Rövid és hosszú mozgóátlagot figyel az Apple valós, élő árfolyamán: emelkedő trendben növeli, forduláskor csökkenti a kitettséget. Erős trendekben teljesít jól, oldalazó piacon a gyakori jelváltás miatt veszíthet is.',
    strategyId: 'trend',
    assetSymbol: 'AAPL',
    riskLevel: 'közepes',
    price: 500,
  },
  {
    id: 'meanrev-ko',
    name: 'Nyugodt Öböl',
    tagline: 'Átlaghoz visszahúzó stratégia a Coca-Cola (KO) valós árfolyamán.',
    description:
      'A Coca-Cola valós árfolyamán keresi az átlagostól erősen eltérő pillanatokat: visszaesésnél vásárol, kiugráskor csökkent. A jellemzően alacsonyabb volatilitású részvény miatt nyugodtabb, kisebb kilengésű a teljesítménye.',
    strategyId: 'meanReversion',
    assetSymbol: 'KO',
    riskLevel: 'alacsony',
    price: 300,
  },
  {
    id: 'momentum-tsla',
    name: 'Momentum Ragadozó',
    tagline: 'Agresszív momentum-stratégia a Tesla (TSLA) valós, volatilis árfolyamán.',
    description:
      'A Tesla erős mozgásait próbálja tovább lovagolni. A négy figyelt részvény közül jellemzően ez a legvolatilisebb, ezért a legnagyobb nyereség- és veszteség-potenciállal is rendelkezik.',
    strategyId: 'momentum',
    assetSymbol: 'TSLA',
    riskLevel: 'magas',
    price: 800,
  },
  {
    id: 'grid-xom',
    name: 'Rács Mester',
    tagline: 'Apró, gyakori lépésekben kereskedő rácsstratégia az ExxonMobil (XOM) árfolyamán.',
    description:
      'Az ExxonMobil valós árfolyamán egy csúszó középárhoz képest fokozatosan épít és bont pozíciót. Sok kisebb kereskedést köt, így a díjak érzékenyebben csípnek bele a hozamba.',
    strategyId: 'grid',
    assetSymbol: 'XOM',
    riskLevel: 'közepes',
    price: 450,
  },
  {
    id: 'trend-tsla',
    name: 'Tesla Trend',
    tagline: 'Trendkövető stratégia a legvolatilisebb figyelt részvényen — nagy tét, nagy kilengés.',
    description:
      'Ugyanaz a mozgóátlag-logika, mint a Trend Vadásznál, de a sokkal ingatagabb Tesla-részvényen. Erős trendekben nagyot szólhat, hirtelen fordulóknál viszont fájdalmasan is tud tévedni.',
    strategyId: 'trend',
    assetSymbol: 'TSLA',
    riskLevel: 'magas',
    price: 700,
  },
  {
    id: 'momentum-ko',
    name: 'Coca-Cola Momentum',
    tagline: 'Momentum-stratégia egy jellemzően nyugodtabb részvényen.',
    description:
      'A Coca-Cola rövid távú lendületét követi. Az alacsonyabb volatilitás miatt ritkábban ad erős jelzést, cserébe visszafogottabb kilengéssel dolgozik.',
    strategyId: 'momentum',
    assetSymbol: 'KO',
    riskLevel: 'alacsony',
    price: 350,
  },
];

export function getRobot(id: string): RobotDef | undefined {
  return ROBOTS.find((r) => r.id === id);
}
