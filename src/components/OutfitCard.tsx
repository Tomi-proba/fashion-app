import type { Item, Outfit } from '../data/types'
import { OCCASION_BY_ID } from '../data/configAccess'

export default function OutfitCard({
  outfit,
  items,
  saved,
  onToggleSaved,
}: {
  outfit: Outfit
  items: Item[]
  saved?: boolean
  onToggleSaved?: () => void
}) {
  const occasion = outfit.occasion ? OCCASION_BY_ID[outfit.occasion] : undefined
  const warnings = outfit.flags.filter((f) => f.severity === 'warning')

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item.id}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {item.name}
            </span>
          ))}
        </div>
        {onToggleSaved && (
          <button
            onClick={onToggleSaved}
            aria-label={saved ? 'Unsave outfit' : 'Save outfit'}
            className={`shrink-0 text-xl leading-none ${saved ? 'text-red-500' : 'text-neutral-300 hover:text-neutral-500 dark:text-neutral-700 dark:hover:text-neutral-400'}`}
          >
            {saved ? '♥' : '♡'}
          </button>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{outfit.explanation}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {occasion && (
          <span className="rounded-full bg-neutral-50 px-2 py-0.5 text-xs text-neutral-400 dark:bg-neutral-800/60 dark:text-neutral-500">
            {occasion.label}
          </span>
        )}
        {outfit.season && (
          <span className="rounded-full bg-neutral-50 px-2 py-0.5 text-xs text-neutral-400 dark:bg-neutral-800/60 dark:text-neutral-500">
            {outfit.season}
          </span>
        )}
      </div>

      {warnings.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-neutral-100 pt-2 dark:border-neutral-800">
          {warnings.map((f, idx) => (
            <li key={idx} className="text-xs text-amber-600 dark:text-amber-400">
              ⚠ {f.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
