import { useCallback, useEffect, useState } from 'react';
import MapView from './components/MapView';
import Controls from './components/Controls';
import RouteSummary from './components/RouteSummary';
import { findRoutes } from './lib/routing';
import type { Criterion, Place, RoutesResult } from './types';

const ALL_CRITERIA: Criterion[] = ['distance', 'time', 'cost'];

export default function App() {
  const [start, setStart] = useState<Place | null>(null);
  const [end, setEnd] = useState<Place | null>(null);
  const [stops, setStops] = useState<(Place | null)[]>([]);
  const [result, setResult] = useState<RoutesResult | null>(null);
  const [visibleCriteria, setVisibleCriteria] = useState<Set<Criterion>>(new Set(ALL_CRITERIA));
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback((from: Place, via: (Place | null)[], to: Place) => {
    if (via.some((s) => s === null)) return;
    setLoading(true);
    const waypoints = [from.position, ...via.map((s) => s!.position), to.position];
    findRoutes(waypoints)
      .then(setResult)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!start || !end) {
      setResult(null);
      return;
    }
    runSearch(start, stops, end);
  }, [start, end, runSearch, stops]);

  const handleSearch = () => {
    if (start && end) runSearch(start, stops, end);
  };

  const handleAddStop = () => setStops((prev) => [...prev, null]);
  const handleSelectStop = (index: number, place: Place) =>
    setStops((prev) => prev.map((s, i) => (i === index ? place : s)));
  const handleRemoveStop = (index: number) => setStops((prev) => prev.filter((_, i) => i !== index));

  const handleToggleCriterion = (c: Criterion) => {
    setVisibleCriteria((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const handleReset = () => {
    setStart(null);
    setEnd(null);
    setStops([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <span className="text-xl">🗺️</span> Budapest Útvonaltervező
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Valódi budapesti térkép és utcahálózat — írd be, honnan hova mész (akár közbeeső megállókkal), és
            válaszd ki, melyik autós útvonalat szeretnéd látni: legrövidebb, leggyorsabb vagy
            legenergiatakarékosabb.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
          <MapView start={start} end={end} stops={stops} result={result} visibleCriteria={visibleCriteria} />
          <Controls
            start={start}
            end={end}
            stops={stops}
            visibleCriteria={visibleCriteria}
            onSelectStart={setStart}
            onSelectEnd={setEnd}
            onSelectStop={handleSelectStop}
            onAddStop={handleAddStop}
            onRemoveStop={handleRemoveStop}
            onToggleCriterion={handleToggleCriterion}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        {loading && <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Útvonal számítása…</p>}
        {start && end && !loading && result && <RouteSummary result={result} />}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        Térkép: © OpenStreetMap közreműködői. Helykeresés: Nominatim. Útvonal: OSRM (nyilvános, kulcs nélküli
        szolgáltatás) valós utcahálózaton, több útvonal-jelölt közül választva — nem valós idejű forgalmi adat,
        a becsült idő/energiaköltség csak tájékoztató jellegű.
      </footer>
    </div>
  );
}
