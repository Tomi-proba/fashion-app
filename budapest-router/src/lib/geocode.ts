import type { LatLng, Place } from '../types';

// Budapest nagyjábóli határdoboza — ezzel súlyozzuk (nem szűrjük ki élesen) a
// Nominatim találatokat, hogy a "Deák tér"-hez hasonló rövid keresések a
// budapesti helyre, ne egy azonos nevű vidéki utcára fussanak.
const BUDAPEST_VIEWBOX = '18.90,47.60,19.35,47.35';

export class GeocodeError extends Error {}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('q', `${trimmed}, Budapest`);
  url.searchParams.set('viewbox', BUDAPEST_VIEWBOX);
  url.searchParams.set('bounded', '1');
  url.searchParams.set('limit', '6');
  url.searchParams.set('addressdetails', '0');

  let response: Response;
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new GeocodeError('Nem sikerült elérni a helykereső szolgáltatást.');
  }
  if (!response.ok) throw new GeocodeError(`Helykeresés sikertelen (${response.status}).`);

  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new GeocodeError('Váratlan válasz a helykeresőtől.');

  return data
    .map((item): Place | null => {
      if (typeof item !== 'object' || item === null) return null;
      const record = item as Record<string, unknown>;
      const lat = Number(record.lat);
      const lon = Number(record.lon);
      const displayName = record.display_name;
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || typeof displayName !== 'string') return null;
      return { label: displayName, position: { lat, lng: lon } };
    })
    .filter((p): p is Place => p !== null);
}

export function formatLatLng(pos: LatLng): string {
  return `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`;
}
