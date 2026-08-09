import type { Outfit, OccasionProfile } from '../data/types'
import { itemById } from '../data/items'
import { scoreOutfit } from '../lib/scoring'
import ItemThumb from './ItemThumb'
import ScoreBadge from './ScoreBadge'

interface Props {
  saved: Outfit[]
  occasion: OccasionProfile
  onClose: () => void
  onRemove: (outfit: Outfit) => void
}

export default function SavedPanel({ saved, occasion, onClose, onRemove }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Loved fits ({saved.length})
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {saved.length === 0 && (
            <p className="text-center text-sm text-neutral-400">
              Swipe right or hit ♥ on outfits you love to save them here.
            </p>
          )}
          {saved.map((outfit) => {
            const result = scoreOutfit(outfit, occasion)
            const outfitItems = outfit.itemIds.map(itemById).filter((i): i is NonNullable<typeof i> => Boolean(i))
            return (
              <div key={outfit.id} className="rounded-2xl border border-neutral-200 p-3 dark:border-neutral-700">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{outfit.name}</h4>
                  <button
                    onClick={() => onRemove(outfit)}
                    className="text-xs text-neutral-400 hover:text-rose-500"
                  >
                    Remove
                  </button>
                </div>
                <ScoreBadge result={result} />
                <div className="mt-2 space-y-2">
                  {outfitItems.map((item) => (
                    <ItemThumb key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
