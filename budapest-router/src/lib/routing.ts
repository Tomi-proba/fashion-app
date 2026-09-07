import { estimateCostHuf } from './modeParams';
import type { LatLng, ModeRouteResult, TransportMode } from '../types';

// Az OSRM hivatalos publikus demószervere csak autós ("driving") profilt szolgál
// ki; gyalogos és kerékpáros profilhoz a FOSSGIS/OpenStreetMap.de közösségi
// tükrét használjuk — mindkettő ingyenes, kulcs nélküli, nyilvános OSRM API.
const OSRM_ENDPOINT: Record<TransportMode, { base: string; profile: string }> = {
  car: { base: 'https://router.project-osrm.org', profile: 'driving' },
  bike: { base: 'https://routing.openstreetmap.de/routed-bike', profile: 'bike' },
  foot: { base: 'https://routing.openstreetmap.de/routed-foot', profile: 'foot' },
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

async function fetchOneRoute(mode: TransportMode, from: LatLng, to: LatLng): Promise<ModeRouteResult> {
  const { base, profile } = OSRM_ENDPOINT[mode];
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `${base}/route/v1/${profile}/${coords}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) return { mode, error: `Útvonalkeresés sikertelen (${response.status}).` };
    const data = (await response.json()) as OsrmResponse;
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return { mode, error: data.message ?? 'Nincs útvonal a két pont között.' };
    }
    const best = data.routes[0];
    const distanceKm = best.distance / 1000;
    const positions: LatLng[] = best.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
    return {
      mode,
      positions,
      distanceKm,
      timeMin: best.duration / 60,
      costHuf: estimateCostHuf(mode, distanceKm),
    };
  } catch {
    return { mode, error: 'Nem sikerült elérni az útvonaltervező szolgáltatást.' };
  }
}

export async function findRoutes(from: LatLng, to: LatLng): Promise<ModeRouteResult[]> {
  return Promise.all((['car', 'bike', 'foot'] as TransportMode[]).map((mode) => fetchOneRoute(mode, from, to)));
}

export function isRouteError(result: ModeRouteResult): result is Extract<ModeRouteResult, { error: string }> {
  return 'error' in result;
}
