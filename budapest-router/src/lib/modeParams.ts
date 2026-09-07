import type { EdgeMode, GraphEdge } from '../types';

// Sematikus, de nem önkényes paraméterek: a gyaloglás ingyenes és lassú, a
// tömegközlekedés fix viteldíjas és közepesen gyors, az autó/híd üzemanyagköltség-
// arányos és városi forgalomra jellemző sebességű. Nem valós, élő BKK-menetrend
// vagy forgalmi adat — csak arra elég, hogy a három útvonaltípus valóban
// eltérő döntéseket hozzon.
const MODE_PARAMS: Record<EdgeMode, { speedKmh: number; hufPerKm: number; flatFareHuf: number }> = {
  walk: { speedKmh: 4.5, hufPerKm: 0, flatFareHuf: 0 },
  transit: { speedKmh: 22, hufPerKm: 0, flatFareHuf: 450 },
  car: { speedKmh: 20, hufPerKm: 55, flatFareHuf: 0 },
};

export function edgeTimeMin(edge: GraphEdge): number {
  return (edge.distanceKm / MODE_PARAMS[edge.mode].speedKmh) * 60;
}

export function edgeCostHuf(edge: GraphEdge): number {
  const params = MODE_PARAMS[edge.mode];
  return params.flatFareHuf + edge.distanceKm * params.hufPerKm;
}

export const MODE_LABEL: Record<EdgeMode, string> = {
  walk: 'gyaloglás',
  transit: 'tömegközlekedés',
  car: 'autó',
};
