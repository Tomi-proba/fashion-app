import { getNode } from '../data/graph';
import { formatHuf, formatKm, formatMin } from '../lib/format';
import { MODE_LABEL } from '../lib/modeParams';
import type { Criterion, Route } from '../types';

const CRITERION_LABEL: Record<Criterion, string> = {
  distance: 'Legrövidebb',
  time: 'Leggyorsabb',
  cost: 'Legtakarékosabb',
};

const CRITERION_COLOR: Record<Criterion, string> = {
  distance: 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
  time: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
  cost: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
};

export default function RouteSummary({ criterion, route }: { criterion: Criterion; route: Route | null }) {
  return (
    <div className={`rounded-2xl border p-4 ${CRITERION_COLOR[criterion]}`}>
      <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">{CRITERION_LABEL[criterion]} útvonal</h3>
      {!route ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Nincs elérhető útvonal a hálózaton.</p>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-4 text-sm">
            <span><strong>{formatKm(route.totalDistanceKm)}</strong> táv</span>
            <span><strong>{formatMin(route.totalTimeMin)}</strong> idő</span>
            <span><strong>{formatHuf(route.totalCostHuf)}</strong> költség</span>
          </div>
          <ol className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {route.nodeIds.map((nodeId, i) => {
              const node = getNode(nodeId)!;
              const step = route.steps[i - 1];
              return (
                <li key={i}>
                  {step && (
                    <div className="pl-2 text-xs text-slate-400">
                      ↓ {MODE_LABEL[step.edge.mode]} · {formatKm(step.edge.distanceKm)} · {formatMin(step.timeMin)}
                      {step.costHuf > 0 && ` · ${formatHuf(step.costHuf)}`}
                    </div>
                  )}
                  <div className="font-medium text-slate-800 dark:text-slate-200">{node.name}</div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
