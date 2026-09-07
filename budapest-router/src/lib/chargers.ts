import type { LatLng } from '../types';

// Az OpenStreetMap adatait az Overpass API-n keresztül kérdezzük le — ez is
// ingyenes és kulcs nélküli, mint a térkép/keresés/útvonal. Az "amenity=
// charging_station" a ténylegesen feltérképezett elektromos töltőállomások
// tagje; Magyarország egészére kérjük le (nem csak Budapestre).
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const QUERY = `
[out:json][timeout:60];
area["ISO3166-1"="HU"][admin_level=2]->.hu;
(
  node["amenity"="charging_station"](area.hu);
);
out body;
`;

export interface ChargerPoint {
  position: LatLng;
  name: string;
  operator?: string;
}

interface OverpassElement {
  type: string;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export class ChargerError extends Error {}

export async function fetchHungaryChargers(signal?: AbortSignal): Promise<ChargerPoint[]> {
  let response: Response;
  try {
    response = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(QUERY)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new ChargerError('Nem sikerült elérni a töltőállomás-adatbázist.');
  }
  if (!response.ok) throw new ChargerError(`Töltőállomás-lekérés sikertelen (${response.status}).`);

  const data = (await response.json()) as OverpassResponse;
  return data.elements
    .filter((el) => el.type === 'node' && typeof el.lat === 'number' && typeof el.lon === 'number')
    .map((el) => ({
      position: { lat: el.lat!, lng: el.lon! },
      name: el.tags?.name ?? 'Elektromos töltő',
      operator: el.tags?.operator,
    }));
}
