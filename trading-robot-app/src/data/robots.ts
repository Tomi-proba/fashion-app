import type { RobotDef } from '../types';

export const ROBOTS: RobotDef[] = [
  {
    id: 'trend-tech',
    name: 'Trend Vadász',
    tagline: 'Mozgóátlag-keresztezésre épülő trendkövető a Tech kosáron.',
    description:
      'Rövid és hosszú mozgóátlagot figyel a Demo Tech Kosáron: emelkedő trendben növeli, forduláskor csökkenti a kitettséget. Erős trendekben teljesít jól, oldalazó piacon a gyakori jelváltás miatt veszíthet is.',
    strategyId: 'trend',
    assetSymbol: 'DEMO-TECH',
    riskLevel: 'közepes',
    price: 500,
  },
  {
    id: 'meanrev-gold',
    name: 'Nyugodt Öböl',
    tagline: 'Átlaghoz visszahúzó, alacsonyabb volatilitású arany indexen.',
    description:
      'A Demo Arany Indexen keresi az átlagostól erősen eltérő árazásokat: visszaesésnél vásárol, kiugráskor csökkent. Az alacsony volatilitású eszköz miatt nyugodtabb, kisebb kilengésű a teljesítménye.',
    strategyId: 'meanReversion',
    assetSymbol: 'DEMO-GOLD',
    riskLevel: 'alacsony',
    price: 300,
  },
  {
    id: 'momentum-crypto',
    name: 'Momentum Ragadozó',
    tagline: 'Agresszív momentum-stratégia a legvolatilisebb demo eszközön.',
    description:
      'A Demo Kripto Kosár erős mozgásait próbálja tovább lovagolni. A legnagyobb kilengésű eszközön fut, ezért a legnagyobb nyereség- és veszteség-potenciállal is rendelkezik.',
    strategyId: 'momentum',
    assetSymbol: 'DEMO-CRYPTO',
    riskLevel: 'magas',
    price: 800,
  },
  {
    id: 'grid-energy',
    name: 'Rács Mester',
    tagline: 'Apró, gyakori lépésekben kereskedő rácsstratégia energián.',
    description:
      'A Demo Energia Indexen egy csúszó középárhoz képest fokozatosan épít és bont pozíciót. Sok kisebb kereskedést köt, így a díjak érzékenyebben csípnek bele a hozamba.',
    strategyId: 'grid',
    assetSymbol: 'DEMO-ENERGY',
    riskLevel: 'közepes',
    price: 450,
  },
  {
    id: 'trend-crypto',
    name: 'Kripto Trend',
    tagline: 'Trendkövető stratégia a legvolatilisebb eszközön — nagy tét, nagy kilengés.',
    description:
      'Ugyanaz a mozgóátlag-logika, mint a Trend Vadásznál, de a sokkal ingatagabb Demo Kripto Kosáron. Erős trendekben nagyot szólhat, hirtelen fordulóknál viszont fájdalmasan is tud tévedni.',
    strategyId: 'trend',
    assetSymbol: 'DEMO-CRYPTO',
    riskLevel: 'magas',
    price: 700,
  },
  {
    id: 'momentum-gold',
    name: 'Arany Momentum',
    tagline: 'Momentum-stratégia egy nyugodtabb eszközön.',
    description:
      'A Demo Arany Index rövid távú lendületét követi. Az alacsony volatilitás miatt ritkábban ad erős jelzést, cserébe visszafogottabb kilengéssel dolgozik.',
    strategyId: 'momentum',
    assetSymbol: 'DEMO-GOLD',
    riskLevel: 'alacsony',
    price: 350,
  },
];

export function getRobot(id: string): RobotDef | undefined {
  return ROBOTS.find((r) => r.id === id);
}
