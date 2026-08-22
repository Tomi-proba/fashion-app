import type { RobotDef } from '../types';

// Robot "types" — a strategy you configure and buy. Asset, risk level and
// invested capital are chosen once, together, at purchase time (see
// RobotConfigModal). `price` is the fixed, one-time, non-refundable robot fee
// (goes to platform revenue, not to the robot's trading capital).
export const ROBOTS: RobotDef[] = [
  {
    id: 'trend',
    name: 'Trend Vadász',
    tagline: 'Mozgóátlag-keresztezésre épülő trendkövető.',
    description:
      'Rövid és hosszú mozgóátlagot hasonlít össze a választott eszközön: emelkedő trendben növeli, forduláskor csökkenti a kitettséget. Erős trendekben teljesít jól, oldalazó piacon a gyakori jelváltás miatt veszíthet is.',
    strategyId: 'trend',
    price: 500,
  },
  {
    id: 'meanReversion',
    name: 'Nyugodt Elemző',
    tagline: 'Átlaghoz visszahúzó stratégia.',
    description:
      'A választott eszköz árfolyamán keresi az átlagostól erősen eltérő pillanatokat: visszaesésnél vásárol, kiugráskor csökkent.',
    strategyId: 'meanReversion',
    price: 350,
  },
  {
    id: 'momentum',
    name: 'Momentum Ragadozó',
    tagline: 'A friss lendületet lovagolja meg.',
    description:
      'A választott eszköz elmúlt napjainak mozgását próbálja tovább lovagolni — erősítő trendnél növeli, gyengülésnél csökkenti a pozíciót.',
    strategyId: 'momentum',
    price: 800,
  },
  {
    id: 'grid',
    name: 'Rács Mester',
    tagline: 'Apró, gyakori lépésekben kereskedő rácsstratégia.',
    description:
      'Egy csúszó középárhoz képest fokozatosan épít és bont pozíciót a választott eszközön. Sok kisebb kereskedést köt, így a díjak érzékenyebben csípnek bele a hozamba.',
    strategyId: 'grid',
    price: 450,
  },
];

export function getRobot(id: string): RobotDef | undefined {
  return ROBOTS.find((r) => r.id === id);
}
