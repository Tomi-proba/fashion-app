import { RANKS, type Rank } from '../types';

const LABEL: Record<Rank, string> = {
  A: 'A',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10/J/Q/K',
};

export default function CardPicker({ onPick }: { onPick: (rank: Rank) => void }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {RANKS.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onPick(r)}
          className="rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {LABEL[r]}
        </button>
      ))}
    </div>
  );
}
