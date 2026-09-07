import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import Controls from './components/Controls';
import RouteSummary from './components/RouteSummary';
import { findRoutes } from './lib/routing';
import type { ModeRouteResult, Place } from './types';

export default function App() {
  const [start, setStart] = useState<Place | null>(null);
  const [end, setEnd] = useState<Place | null>(null);
  const [routes, setRoutes] = useState<ModeRouteResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!start || !end) {
      setRoutes([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    findRoutes(start.position, end.position)
      .then((result) => {
        if (!cancelled) setRoutes(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [start, end]);

  const handleReset = () => {
    setStart(null);
    setEnd(null);
    setRoutes([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <span className="text-xl">🗺️</span> Budapest Útvonaltervező
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Valódi budapesti térkép és utcahálózat — írd be, honnan hova mész, és összehasonlítjuk az autós, a
            kerékpáros és a gyalogos útvonalat.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
          <MapView start={start} end={end} routes={routes} />
          <Controls start={start} end={end} onSelectStart={setStart} onSelectEnd={setEnd} onReset={handleReset} />
        </div>

        {loading && <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Útvonalak számítása…</p>}
        {start && end && !loading && <RouteSummary routes={routes} />}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        Térkép: © OpenStreetMap közreműködői. Helykeresés: Nominatim. Útvonalak: OSRM (nyilvános, kulcs nélküli
        szolgáltatások) — nem valós idejű forgalmi adat, a becsült idő/költség csak tájékoztató jellegű.
      </footer>
    </div>
  );
}
