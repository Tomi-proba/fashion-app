import type { TransportMode } from '../types';

// Az OSRM valós útvonalat és menetidőt ad vissza; a költséget ebből becsüljük.
// Gyaloglás és kerékpár ingyenes, az autónál egy átlagos üzemanyag-fogyasztásból
// és forint/liter árból számolt Ft/km szorzót használunk — nem valós élő
// üzemanyagár, csak egy ésszerű becslés.
const HUF_PER_KM_CAR = 55;

export function estimateCostHuf(mode: TransportMode, distanceKm: number): number {
  if (mode === 'car') return distanceKm * HUF_PER_KM_CAR;
  return 0;
}

export const MODE_LABEL: Record<TransportMode, string> = {
  car: 'autó',
  bike: 'kerékpár',
  foot: 'gyaloglás',
};

export const MODE_ICON: Record<TransportMode, string> = {
  car: '🚗',
  bike: '🚲',
  foot: '🚶',
};

export const MODE_COLOR: Record<TransportMode, string> = {
  car: '#d97706',
  bike: '#059669',
  foot: '#2563eb',
};
