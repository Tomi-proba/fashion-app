import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { CRITERION_COLOR } from '../lib/modeParams';
import { isRoutesError } from '../lib/routing';
import { ChargerError, fetchHungaryChargers, type ChargerPoint } from '../lib/chargers';
import type { Criterion, LatLng, Place, RoutesResult } from '../types';

// A Leaflet alapértelmezett marker-ikonjai a build után relatív útként törnek el
// (webpack/vite bundlerekkel ismert probléma) — helyette saját, egyszerű
// SVG pin-eket rajzolunk: zöld a kiindulásnak, piros a célnak, lila (sorszámmal)
// a köztes megállóknak.
function pinIcon(color: string, label?: string): L.DivIcon {
  const text = label
    ? `<text x="14" y="17" text-anchor="middle" font-size="12" font-weight="700" fill="${color}">${label}</text>`
    : `<circle cx="14" cy="14" r="5.5" fill="white"/>`;
  return L.divIcon({
    className: '',
    html: `<svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${color}" stroke="white" stroke-width="1.5"/>${label ? '<circle cx="14" cy="14" r="9" fill="white"/>' : ''}${text}</svg>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
  });
}

const START_ICON = pinIcon('#16a34a');
const END_ICON = pinIcon('#dc2626');
const STOP_COLOR = '#7c3aed';

const CHARGER_ICON = L.divIcon({
  className: '',
  html: `<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="8" fill="#0891b2" stroke="white" stroke-width="1.5"/><path d="M9.6 3.5 5.2 10h2.9l-1 4.5 4.7-6.8H8.9l0.7-4.2z" fill="white"/></svg>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const BUDAPEST_CENTER: L.LatLngExpression = [47.4979, 19.0402];

interface MapViewProps {
  start: Place | null;
  end: Place | null;
  stops: (Place | null)[];
  result: RoutesResult | null;
  visibleCriteria: Set<Criterion>;
  showChargers: boolean;
  onChargersStatus: (status: { loading: boolean; error: string | null; count: number | null }) => void;
}

export default function MapView({
  start,
  end,
  stops,
  result,
  visibleCriteria,
  showChargers,
  onChargersStatus,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const chargerLayerRef = useRef<L.MarkerClusterGroup | null>(null);
  const chargerCacheRef = useRef<ChargerPoint[] | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center: BUDAPEST_CENTER, zoom: 12 });
    // CARTO Positron: letisztult, visszafogott színvilágú, ingyenes és kulcs
    // nélküli csempekészlet — a szokásos, sok színes POI-t mutató OSM
    // alapstílusnál nyugodtabb hátteret ad az útvonalaknak.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködői &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!showChargers) {
      if (chargerLayerRef.current) {
        map.removeLayer(chargerLayerRef.current);
        chargerLayerRef.current = null;
      }
      return;
    }

    let cancelled = false;

    function renderChargers(points: ChargerPoint[]) {
      if (cancelled || !map) return;
      const group = L.markerClusterGroup({ maxClusterRadius: 60 });
      for (const point of points) {
        const marker = L.marker([point.position.lat, point.position.lng], { icon: CHARGER_ICON });
        marker.bindPopup(`<strong>${point.name}</strong>${point.operator ? `<br/>${point.operator}` : ''}`);
        group.addLayer(marker);
      }
      group.addTo(map);
      chargerLayerRef.current = group;
    }

    if (chargerCacheRef.current) {
      renderChargers(chargerCacheRef.current);
      onChargersStatus({ loading: false, error: null, count: chargerCacheRef.current.length });
      return;
    }

    onChargersStatus({ loading: true, error: null, count: null });
    fetchHungaryChargers()
      .then((points) => {
        chargerCacheRef.current = points;
        renderChargers(points);
        if (!cancelled) onChargersStatus({ loading: false, error: null, count: points.length });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof ChargerError ? err.message : 'Ismeretlen hiba a töltők betöltésekor.';
        onChargersStatus({ loading: false, error: message, count: null });
      });

    return () => {
      cancelled = true;
    };
  }, [showChargers, onChargersStatus]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of markersRef.current) map.removeLayer(marker);
    markersRef.current = [];
    for (const layer of routeLayersRef.current) map.removeLayer(layer);
    routeLayersRef.current = [];

    const bounds: LatLng[] = [];

    if (start) {
      markersRef.current.push(L.marker([start.position.lat, start.position.lng], { icon: START_ICON }).addTo(map));
      bounds.push(start.position);
    }
    stops.forEach((stop, i) => {
      if (!stop) return;
      markersRef.current.push(
        L.marker([stop.position.lat, stop.position.lng], { icon: pinIcon(STOP_COLOR, String(i + 1)) }).addTo(map),
      );
      bounds.push(stop.position);
    });
    if (end) {
      markersRef.current.push(L.marker([end.position.lat, end.position.lng], { icon: END_ICON }).addTo(map));
      bounds.push(end.position);
    }

    if (result && !isRoutesError(result)) {
      for (const criterion of ['distance', 'time', 'cost'] as Criterion[]) {
        if (!visibleCriteria.has(criterion)) continue;
        const route = result[criterion];
        if (!route) continue;
        const line = L.polyline(
          route.positions.map((p) => [p.lat, p.lng]),
          { color: CRITERION_COLOR[criterion], weight: 5, opacity: 0.8 },
        ).addTo(map);
        routeLayersRef.current.push(line);
        bounds.push(...route.positions);
      }
    }

    if (bounds.length === 1) {
      map.setView([bounds[0].lat, bounds[0].lng], 15);
    } else if (bounds.length > 1) {
      map.fitBounds(
        bounds.map((p) => [p.lat, p.lng]),
        { padding: [32, 32] },
      );
    }
  }, [start, end, stops, result, visibleCriteria]);

  return <div ref={containerRef} className="h-[26rem] w-full rounded-2xl border border-slate-200 lg:h-[34rem] dark:border-slate-800" />;
}
