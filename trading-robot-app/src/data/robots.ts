import type { RobotDef } from '../types';

// Strategy "types" you can watch — pick one, then choose the eszköz and
// kockázati szint for the watch (see AddWatchModal). No money involved.
export const ROBOTS: RobotDef[] = [
  {
    id: 'trend',
    name: 'Trend Vadász',
    tagline: 'Mozgóátlag-keresztezésre épülő trendkövető.',
    description:
      'Rövid és hosszú mozgóátlagot hasonlít össze a választott eszközön: emelkedő trendben növeli, forduláskor csökkenti az ajánlott kitettséget. Erős trendekben ad jó jelzést, oldalazó piacon gyakran vált jelzést.',
    strategyId: 'trend',
  },
  {
    id: 'meanReversion',
    name: 'Nyugodt Elemző',
    tagline: 'Átlaghoz visszahúzó stratégia.',
    description:
      'A választott eszköz árfolyamán keresi az átlagostól erősen eltérő pillanatokat: visszaesésnél vételt, kiugrásnál eladást javasol.',
    strategyId: 'meanReversion',
  },
  {
    id: 'momentum',
    name: 'Momentum Ragadozó',
    tagline: 'A friss lendületet lovagolja meg.',
    description:
      'A választott eszköz elmúlt napjainak mozgását próbálja tovább követni — erősítő trendnél erősebb vételi, gyengülésnél erősebb eladási jelzést ad.',
    strategyId: 'momentum',
  },
  {
    id: 'grid',
    name: 'Rács Mester',
    tagline: 'Apró, gyakori jelváltásokkal dolgozó rácsstratégia.',
    description:
      'Egy csúszó középárhoz képest fokozatosan javasol vételt lefelé és eladást felfelé a választott eszközön. Sűrűbben vált jelzést, mint a többi stratégia.',
    strategyId: 'grid',
  },
];

export function getRobot(id: string): RobotDef | undefined {
  return ROBOTS.find((r) => r.id === id);
}
