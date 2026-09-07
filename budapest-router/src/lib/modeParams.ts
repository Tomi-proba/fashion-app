import type { Criterion } from '../types';

// Az OSRM valós útvonalat és menetidőt ad vissza; a költséget/energiaigényt
// ebből becsüljük. Az alap Ft/km egy átlagos üzemanyag-fogyasztásból és
// Ft/liter árból számolt szorzó — nem valós élő üzemanyagár, csak becslés.
const HUF_PER_KM = 55;

// Lassú, sokat álló-induló forgalomban (alacsony átlagsebesség) egy autó
// jóval többet fogyaszt kilométerenként, mint folyamatos, gyorsabb haladásnál
// — ez a szorzó ezt közelíti, hogy a "legrövidebb" és a
// "legenergiatakarékosabb" útvonal ténylegesen eltérhessen egymástól.
function trafficPenalty(avgSpeedKmh: number): number {
  if (avgSpeedKmh >= 50) return 0.9;
  if (avgSpeedKmh >= 30) return 1.0;
  return 1.25;
}

export function estimateCostHuf(distanceKm: number, avgSpeedKmh: number): number {
  return distanceKm * HUF_PER_KM * trafficPenalty(avgSpeedKmh);
}

export const CRITERION_LABEL: Record<Criterion, string> = {
  distance: 'Legrövidebb',
  time: 'Leggyorsabb',
  cost: 'Legenergiatakarékosabb',
};

export const CRITERION_COLOR: Record<Criterion, string> = {
  distance: '#2563eb',
  time: '#059669',
  cost: '#d97706',
};
