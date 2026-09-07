import SearchBox from './SearchBox';
import { CRITERION_COLOR, CRITERION_LABEL } from '../lib/modeParams';
import type { Criterion, Place } from '../types';

const CRITERIA: Criterion[] = ['distance', 'time', 'cost'];
const MAX_STOPS = 5;

interface ChargersStatus {
  loading: boolean;
  error: string | null;
  count: number | null;
}

interface ControlsProps {
  start: Place | null;
  end: Place | null;
  stops: (Place | null)[];
  visibleCriteria: Set<Criterion>;
  showChargers: boolean;
  chargersStatus: ChargersStatus;
  onSelectStart: (place: Place) => void;
  onSelectEnd: (place: Place) => void;
  onSelectStop: (index: number, place: Place) => void;
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
  onToggleCriterion: (c: Criterion) => void;
  onToggleChargers: () => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function Controls({
  start,
  end,
  stops,
  visibleCriteria,
  showChargers,
  chargersStatus,
  onSelectStart,
  onSelectEnd,
  onSelectStop,
  onAddStop,
  onRemoveStop,
  onToggleCriterion,
  onToggleChargers,
  onSearch,
  onReset,
}: ControlsProps) {
  const canSearch = !!start && !!end && stops.every((s) => s !== null);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <SearchBox label="Honnan" placeholder="pl. Deák Ferenc tér" value={start} onSelect={onSelectStart} />

      {stops.map((stop, i) => (
        <div key={i} className="flex items-end gap-1.5">
          <div className="flex-1">
            <SearchBox
              label={`${i + 1}. megálló`}
              placeholder="pl. Nyugati pályaudvar"
              value={stop}
              onSelect={(place) => onSelectStop(i, place)}
            />
          </div>
          <button
            type="button"
            aria-label="Megálló törlése"
            onClick={() => onRemoveStop(i)}
            className="mb-[1px] shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
      ))}

      <SearchBox label="Hova" placeholder="pl. Keleti pályaudvar" value={end} onSelect={onSelectEnd} />

      {stops.length < MAX_STOPS && (
        <button
          type="button"
          onClick={onAddStop}
          className="self-start rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          + Megálló hozzáadása
        </button>
      )}

      <button
        type="button"
        disabled={!canSearch}
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

      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Elektromos töltők
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={showChargers} onChange={onToggleChargers} />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-600" />
          Töltőállomások (egész Magyarország)
        </label>
        {chargersStatus.loading && <p className="mt-1 text-xs text-slate-400">töltők betöltése…</p>}
        {chargersStatus.error && <p className="mt-1 text-xs text-red-500">{chargersStatus.error}</p>}
        {!chargersStatus.loading && !chargersStatus.error && chargersStatus.count !== null && (
          <p className="mt-1 text-xs text-slate-400">{chargersStatus.count} töltőállomás betöltve</p>
        )}
      </div>
    </div>
  );
}
