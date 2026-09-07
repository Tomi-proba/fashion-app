import type { TransportMode } from '../types';

// Az autós útvonalat és idejét az OSRM adja vissza valós utcahálózaton; a
// költséget ebből becsüljük egy átlagos üzemanyag-fogyasztásból és Ft/liter
// árból számolt Ft/km szorzóval — nem valós élő üzemanyagár, csak becslés.
const HUF_PER_KM_CAR = 55;

// Ingyenes, kulcs nélküli BKK menetrend-/útvonaltervező API nem létezik (a BKK
// saját OpenData API-ja regisztrációt igényel), ezért a metró/busz/villamos
// itt légvonaltávolságból és módonkénti átlagsebességből becsült, NEM valós
// menetrend/útvonal szerinti idő — a költség viszont a tényleges egyvonalas
// BKK-jegy ára (450 Ft), mert az egységes tarifarendszerben ez fix.
const BKK_SINGLE_TICKET_HUF = 450;

export function estimateCostHuf(mode: TransportMode, distanceKm: number): number {
  if (mode === 'car') return distanceKm * HUF_PER_KM_CAR;
  return BKK_SINGLE_TICKET_HUF;
}

export const MODE_LABEL: Record<TransportMode, string> = {
  car: 'autó',
  metro: 'metró',
  bus: 'busz',
  tram: 'villamos',
};

export const MODE_ICON: Record<TransportMode, string> = {
  car: '🚗',
  metro: '🚇',
  bus: '🚌',
  tram: '🚊',
};

export const MODE_COLOR: Record<TransportMode, string> = {
  car: '#d97706',
  metro: '#7c3aed',
  bus: '#059669',
  tram: '#db2777',
};
