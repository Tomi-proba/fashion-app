import { formatHuf, formatKm, formatMin } from '../lib/format';
import { MODE_ICON, MODE_LABEL } from '../lib/modeParams';
import { isRouteError } from '../lib/routing';
import type { ModeRouteResult, TransportMode } from '../types';

const MODE_ORDER: TransportMode[] = ['car', 'metro', 'bus', 'tram'];

function bestMode(routes: ModeRouteResult[], key: 'distanceKm' | 'timeMin' | 'costHuf'): TransportMode | null {
  const ok = routes.filter((r): r is Extract<ModeRouteResult, { distanceKm: number }> => !isRouteError(r));
  if (ok.length === 0) return null;
  return ok.reduce((best, r) => (r[key] < best[key] ? r : best)).mode;
}

export default function RouteSummary({ routes }: { routes: ModeRouteResult[] }) {
  const shortest = bestMode(routes, 'distanceKm');
  const fastest = bestMode(routes, 'timeMin');
  const cheapest = bestMode(routes, 'costHuf');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {MODE_ORDER.map((mode) => {
        const result = routes.find((r) => r.mode === mode);
        const badges: string[] = [];
        if (shortest === mode) badges.push('Legrövidebb');
        if (fastest === mode) badges.push('Leggyorsabb');
        if (cheapest === mode) badges.push('Legtakarékosabb');

        return (
          <div
            key={mode}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <span>{MODE_ICON[mode]}</span> {MODE_LABEL[mode]}
            </h3>
            {!result ? (
              <p className="text-sm text-slate-400">várakozás…</p>
            ) : isRouteError(result) ? (
              <p className="text-sm text-red-500">{result.error}</p>
            ) : (
              <>
                <div className="mb-2 flex flex-wrap gap-1">
                  {badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                  <span><strong>{formatKm(result.distanceKm)}</strong> táv</span>
                  <span><strong>{formatMin(result.timeMin)}</strong> idő</span>
                  <span><strong>{formatHuf(result.costHuf)}</strong> becsült költség</span>
                </div>
                {mode !== 'car' && (
                  <p className="mt-2 text-xs text-slate-400">Becslés — nem valós BKK menetrend/útvonal.</p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
