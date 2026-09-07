import { useMemo, useState } from 'react';
import MapView from './components/MapView';
import Controls from './components/Controls';
import RouteSummary from './components/RouteSummary';
import { findAllRoutes } from './lib/routing';
import type { Criterion } from './types';

const ALL_CRITERIA: Criterion[] = ['distance', 'time', 'cost'];

export default function App() {
  const [startId, setStartId] = useState<string | null>(null);
  const [endId, setEndId] = useState<string | null>(null);
  const [visibleCriteria, setVisibleCriteria] = useState<Set<Criterion>>(new Set(ALL_CRITERIA));

  const routes = useMemo((): Partial<Record<Criterion, ReturnType<typeof findAllRoutes>[Criterion]>> => {
    if (!startId || !endId) return {};
    return findAllRoutes(startId, endId);
  }, [startId, endId]);

  const handleSelectNode = (id: string) => {
    if (!startId || (startId && endId)) {
      setStartId(id);
      setEndId(null);
      return;
    }
    if (id === startId) return;
    setEndId(id);
  };

  const handleToggleCriterion = (c: Criterion) => {
    setVisibleCriteria((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const handleReset = () => {
    setStartId(null);
    setEndId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <span className="text-xl">🗺️</span> Budapest Útvonaltervező
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Sematikus, kézzel épített hálózat valós budapesti helyszínekkel — nem élő GPS/forgalmi adat.
            Kattints egy pontra a kiinduláshoz, majd egy másikra a célhoz.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
          <MapView startId={startId} endId={endId} routes={routes} visibleCriteria={visibleCriteria} onSelectNode={handleSelectNode} />
          <Controls
            startId={startId}
            endId={endId}
            visibleCriteria={visibleCriteria}
            onToggleCriterion={handleToggleCriterion}
            onReset={handleReset}
          />
        </div>

        {startId && endId && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {ALL_CRITERIA.map((c) => (
              <RouteSummary key={c} criterion={c} route={routes[c] ?? null} />
            ))}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        Budapest Útvonaltervező — illusztrációs célú demó, sematikus hálózaton számolt útvonalakkal, nem valós
        idejű navigációs eszköz.
      </footer>
    </div>
  );
}
