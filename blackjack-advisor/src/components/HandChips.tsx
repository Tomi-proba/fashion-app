import type { Rank } from '../types';

export default function HandChips({
  cards,
  onRemove,
  emptyLabel,
}: {
  cards: Rank[];
  onRemove: (index: number) => void;
  emptyLabel: string;
}) {
  if (cards.length === 0) {
    return <p className="text-sm text-slate-400">{emptyLabel}</p>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {cards.map((c, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onRemove(i)}
          title="Kattints a törléshez"
          className="flex h-10 w-9 items-center justify-center rounded-lg border-2 border-slate-800 bg-white text-sm font-bold text-slate-900 shadow-sm hover:bg-red-50 hover:border-red-400 hover:text-red-500 dark:bg-slate-100"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
