import { occasions } from '../data/occasions'

export default function OccasionStep({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-8 text-center">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">What's the occasion?</h2>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          We'll rate every fit on how well it suits this moment.
        </p>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
        {occasions.map((occ) => (
          <button
            key={occ.id}
            onClick={() => onSelect(occ.id)}
            className="flex flex-col items-center gap-2 rounded-2xl border-2 border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-neutral-400 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500"
          >
            <span className="text-3xl">{occ.icon}</span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{occ.label}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{occ.blurb}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
