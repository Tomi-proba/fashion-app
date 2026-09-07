import { estimateCostHuf } from './modeParams';
import type { LatLng, ModeRouteResult, TransportMode } from '../types';

// Autóhoz az OSRM hivatalos publikus demószervere ad valós, utcahálózaton
// számolt útvonalat és időt. Metróhoz/buszhoz/villamoshoz nincs ingyenes,
// kulcs nélküli BKK menetrend-API, ezért ezekhez légvonaltávolságból
// (Haversine-képlet) és módonkénti átlagsebességből becsüljük az időt/utat —
// ez NEM valós vonal/megálló szerinti útvonal, csak közelítés.
const OSRM_CAR = { base: 'https://router.project-osrm.org', profile: 'driving' };

const TRANSIT_PARAMS: Record<Exclude<TransportMode, 'car'>, { detourFactor: number; speedKmh: number; bendSign: number }> = {
  metro: { detourFactor: 1.15, speedKmh: 32, bendSign: 1 },
  tram: { detourFactor: 1.25, speedKmh: 17, bendSign: 0 },
  bus: { detourFactor: 1.3, speedKmh: 15, bendSign: -1 },
};

interface OsrmRoute {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
}

interface OsrmResponse {
  code: string;
  routes?: OsrmRoute[];
  message?: string;
}

async function fetchCarRoute(from: LatLng, to: LatLng): Promise<ModeRouteResult> {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `${OSRM_CAR.base}/route/v1/${OSRM_CAR.profile}/${coords}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) return { mode: 'car', error: `Útvonalkeresés sikertelen (${response.status}).` };
    const data = (await response.json()) as OsrmResponse;
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return { mode: 'car', error: data.message ?? 'Nincs útvonal a két pont között.' };
    }
    const best = data.routes[0];
    const distanceKm = best.distance / 1000;
    const positions: LatLng[] = best.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
    return {
      mode: 'car',
      positions,
      distanceKm,
      timeMin: best.duration / 60,
      costHuf: estimateCostHuf('car', distanceKm),
    };
  } catch {
    return { mode: 'car', error: 'Nem sikerült elérni az útvonaltervező szolgáltatást.' };
  }
}

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function estimateTransitRoute(mode: Exclude<TransportMode, 'car'>, from: LatLng, to: LatLng): ModeRouteResult {
  const straightKm = haversineKm(from, to);
  const { detourFactor, speedKmh, bendSign } = TRANSIT_PARAMS[mode];
  const distanceKm = straightKm * detourFactor;
  const bend = 0.04 + bendSign * 0.03;
  const mid: LatLng = {
    lat: (from.lat + to.lat) / 2 + (to.lng - from.lng) * bend,
    lng: (from.lng + to.lng) / 2 - (to.lat - from.lat) * bend,
  };
  return {
    mode,
    positions: [from, mid, to],
    distanceKm,
    timeMin: (distanceKm / speedKmh) * 60,
    costHuf: estimateCostHuf(mode, distanceKm),
  };
}

export async function findRoutes(from: LatLng, to: LatLng): Promise<ModeRouteResult[]> {
  const car = await fetchCarRoute(from, to);
  const transit = (['metro', 'tram', 'bus'] as const).map((mode) => estimateTransitRoute(mode, from, to));
  return [car, ...transit];
}

export function isRouteError(result: ModeRouteResult): result is Extract<ModeRouteResult, { error: string }> {
  return 'error' in result;
}
