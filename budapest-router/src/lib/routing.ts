import { estimateCostHuf } from './modeParams';
import type { Criterion, CriterionRoute, LatLng, RoutesResult } from '../types';

// Az OSRM hivatalos publikus demószervere (kulcs nélküli, ingyenes) autós
// profilra valós utcahálózaton számol útvonalat. Az `alternatives=true`
// paraméterrel több útvonal-jelöltet is visszaad (pl. egy gyorsabb, de
// hosszabb főúti és egy rövidebb, de lassabb belvárosi változatot) — ezek
// közül választjuk ki külön-külön a legrövidebbet, leggyorsabbat és a
// (becsült) legenergiatakarékosabbat.
const OSRM_BASE = 'https://router.project-osrm.org';

interface OsrmRouteRaw {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
}

interface OsrmResponse {
  code: string;
  routes?: OsrmRouteRaw[];
  message?: string;
}

interface Candidate {
  positions: LatLng[];
  distanceKm: number;
  timeMin: number;
  costHuf: number;
}

export async function findRoutes(from: LatLng, to: LatLng): Promise<RoutesResult> {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `${OSRM_BASE}/route/v1/driving/${coords}?overview=full&geometries=geojson&alternatives=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) return { error: `Útvonalkeresés sikertelen (${response.status}).` };
    const data = (await response.json()) as OsrmResponse;
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return { error: data.message ?? 'Nincs útvonal a két pont között.' };
    }

    const candidates: Candidate[] = data.routes.map((r) => {
      const distanceKm = r.distance / 1000;
      const timeMin = r.duration / 60;
      const avgSpeedKmh = timeMin > 0 ? distanceKm / (timeMin / 60) : 0;
      return {
        positions: r.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })),
        distanceKm,
        timeMin,
        costHuf: estimateCostHuf(distanceKm, avgSpeedKmh),
      };
    });

    const pickBest = (key: keyof Candidate): Candidate =>
      candidates.reduce((best, c) => ((c[key] as number) < (best[key] as number) ? c : best));

    const toRoute = (criterion: Criterion, c: Candidate): CriterionRoute => ({ criterion, ...c });

    return {
      distance: toRoute('distance', pickBest('distanceKm')),
      time: toRoute('time', pickBest('timeMin')),
      cost: toRoute('cost', pickBest('costHuf')),
    };
  } catch {
    return { error: 'Nem sikerült elérni az útvonaltervező szolgáltatást.' };
  }
}

export function isRoutesError(result: RoutesResult): result is { error: string } {
  return 'error' in result;
}
