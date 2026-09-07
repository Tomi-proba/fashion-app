import { formatHuf, formatKm, formatMin } from '../lib/format';
import { CRITERION_LABEL } from '../lib/modeParams';
import { isRoutesError } from '../lib/routing';
import type { Criterion, RoutesResult } from '../types';

const CRITERIA: Criterion[] = ['distance', 'time', 'cost'];

export default function RouteSummary({ result }: { result: RoutesResult }) {
  if (isRoutesError(result)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
        {result.error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CRITERIA.map((criterion) => {
        const route = result[criterion];
        return (
          <div
            key={criterion}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">{CRITERION_LABEL[criterion]}</h3>
            {!route ? (
              <p className="text-sm text-slate-400">nincs adat</p>
            ) : (
              <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                <span><strong>{formatKm(route.distanceKm)}</strong> táv</span>
                <span><strong>{formatMin(route.timeMin)}</strong> idő</span>
                <span><strong>{formatHuf(route.costHuf)}</strong> becsült költség</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
