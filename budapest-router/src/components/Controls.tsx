import SearchBox from './SearchBox';
import { MODE_COLOR, MODE_LABEL } from '../lib/modeParams';
import type { Place, TransportMode } from '../types';

const MODE_ORDER: TransportMode[] = ['car', 'bike', 'foot'];

interface ControlsProps {
  start: Place | null;
  end: Place | null;
  onSelectStart: (place: Place) => void;
  onSelectEnd: (place: Place) => void;
  onReset: () => void;
}

export default function Controls({ start, end, onSelectStart, onSelectEnd, onReset }: ControlsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <SearchBox label="Honnan" placeholder="pl. Deák Ferenc tér" value={start} onSelect={onSelectStart} />
      <SearchBox label="Hova" placeholder="pl. Keleti pályaudvar" value={end} onSelect={onSelectEnd} />

      <button
        type="button"
        onClick={onReset}
        className="self-start rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Törlés
      </button>

      <div>
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Közlekedési mód a térképen
        </div>
        <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
          {MODE_ORDER.map((mode) => (
            <span key={mode}>
              <span
                className="inline-block h-1 w-4 align-middle"
                style={{ backgroundColor: MODE_COLOR[mode] }}
              />{' '}
              {MODE_LABEL[mode]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
