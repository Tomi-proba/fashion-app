import SearchBox from './SearchBox';
import { CRITERION_COLOR, CRITERION_LABEL } from '../lib/modeParams';
import type { Criterion, Place } from '../types';

const CRITERIA: Criterion[] = ['distance', 'time', 'cost'];

interface ControlsProps {
  start: Place | null;
  end: Place | null;
  visibleCriteria: Set<Criterion>;
  onSelectStart: (place: Place) => void;
  onSelectEnd: (place: Place) => void;
  onToggleCriterion: (c: Criterion) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function Controls({
  start,
  end,
  visibleCriteria,
  onSelectStart,
  onSelectEnd,
  onToggleCriterion,
  onSearch,
  onReset,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <SearchBox label="Honnan" placeholder="pl. Deák Ferenc tér" value={start} onSelect={onSelectStart} />
      <SearchBox label="Hova" placeholder="pl. Keleti pályaudvar" value={end} onSelect={onSelectEnd} />

      <button
        type="button"
        disabled={!start || !end}
        onClick={onSearch}
        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
      >
        Útvonalak keresése
      </button>

      <button
        type="button"
        onClick={onReset}
        className="self-start rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Törlés
      </button>

      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Megjelenített útvonalak
        </div>
        <div className="flex flex-col gap-1.5">
          {CRITERIA.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={visibleCriteria.has(c)} onChange={() => onToggleCriterion(c)} />
              <span className="inline-block h-2.5 w-4 rounded-full" style={{ backgroundColor: CRITERION_COLOR[c] }} />
              {CRITERION_LABEL[c]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
