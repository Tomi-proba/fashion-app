import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CRITERION_COLOR } from '../lib/modeParams';
import { isRoutesError } from '../lib/routing';
import type { Criterion, LatLng, Place, RoutesResult } from '../types';

// A Leaflet alapértelmezett marker-ikonjai a build után relatív útként törnek el
// (webpack/vite bundlerekkel ismert probléma) — helyette saját, egyszerű
// SVG pin-eket rajzolunk kiindulási (zöld) és cél (piros) jelölőnek.
function pinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${color}" stroke="white" stroke-width="1.5"/><circle cx="14" cy="14" r="5.5" fill="white"/></svg>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
  });
}

const START_ICON = pinIcon('#16a34a');
const END_ICON = pinIcon('#dc2626');

const BUDAPEST_CENTER: L.LatLngExpression = [47.4979, 19.0402];

interface MapViewProps {
  start: Place | null;
  end: Place | null;
  result: RoutesResult | null;
  visibleCriteria: Set<Criterion>;
}

export default function MapView({ start, end, result, visibleCriteria }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center: BUDAPEST_CENTER, zoom: 12 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködői',
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

    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current);
      endMarkerRef.current = null;
    }
    for (const layer of routeLayersRef.current) map.removeLayer(layer);
    routeLayersRef.current = [];

    const bounds: LatLng[] = [];

    if (start) {
      startMarkerRef.current = L.marker([start.position.lat, start.position.lng], { icon: START_ICON }).addTo(map);
      bounds.push(start.position);
    }
    if (end) {
      endMarkerRef.current = L.marker([end.position.lat, end.position.lng], { icon: END_ICON }).addTo(map);
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
  }, [start, end, result, visibleCriteria]);

  return <div ref={containerRef} className="h-[26rem] w-full rounded-2xl border border-slate-200 lg:h-[34rem] dark:border-slate-800" />;
}
