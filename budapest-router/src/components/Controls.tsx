import { getNode } from '../data/graph';
import type { Criterion } from '../types';

const CRITERION_LABEL: Record<Criterion, string> = {
  distance: 'Legrövidebb',
  time: 'Leggyorsabb',
  cost: 'Legtakarékosabb',
};

const CRITERION_SWATCH: Record<Criterion, string> = {
  distance: 'bg-blue-600',
  time: 'bg-emerald-600',
  cost: 'bg-amber-600',
};

interface ControlsProps {
  startId: string | null;
  endId: string | null;
  visibleCriteria: Set<Criterion>;
  onToggleCriterion: (c: Criterion) => void;
  onReset: () => void;
}

export default function Controls({ startId, endId, visibleCriteria, onToggleCriterion, onReset }: ControlsProps) {
  const startName = startId ? getNode(startId)?.name : null;
  const endName = endId ? getNode(endId)?.name : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600 align-middle" />{' '}
        Kiindulás: <strong>{startName ?? 'kattints egy pontra a térképen'}</strong>
      </p>
      <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-600 align-middle" />{' '}
        Cél: <strong>{endName ?? '—'}</strong>
      </p>
      <button
        onClick={onReset}
        className="mb-4 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Kiválasztás törlése
      </button>

      <div className="mb-4">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Megjelenített útvonalak</div>
        <div className="flex flex-col gap-1.5">
          {(['distance', 'time', 'cost'] as Criterion[]).map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={visibleCriteria.has(c)} onChange={() => onToggleCriterion(c)} />
              <span className={`inline-block h-2.5 w-4 rounded-full ${CRITERION_SWATCH[c]}`} />
              {CRITERION_LABEL[c]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Közlekedési mód</div>
        <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          <span><span className="inline-block h-0.5 w-4 bg-slate-400 align-middle" /> gyaloglás (ingyenes)</span>
          <span><span className="inline-block h-0.5 w-4 bg-indigo-400 align-middle" /> tömegközlekedés (fix 450 Ft)</span>
          <span><span className="inline-block h-0.5 w-4 bg-amber-500 align-middle" /> autó (~55 Ft/km)</span>
        </div>
      </div>
    </div>
  );
}
