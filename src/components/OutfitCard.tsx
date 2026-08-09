import type { ClothingItem, Outfit, ScoreResult } from '../data/types'
import { itemById } from '../data/items'
import ItemThumb from './ItemThumb'
import ScoreBadge from './ScoreBadge'

interface Props {
  outfit: Outfit
  result: ScoreResult
  pinnedItem?: ClothingItem | null
  style?: React.CSSProperties
  className?: string
}

export default function OutfitCard({ outfit, result, pinnedItem, style, className }: Props) {
  const items = outfit.itemIds.map(itemById).filter((i): i is NonNullable<typeof i> => Boolean(i))
  const total = items.reduce((sum, i) => sum + i.price, 0)
  const showPinned = pinnedItem && !outfit.itemIds.includes(pinnedItem.id)

  return (
    <div
      style={style}
      className={`flex h-full w-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900 ${className ?? ''}`}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
        <div className="text-left">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{outfit.name}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {outfit.styles.join(' · ')} · ~${total} total
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <ScoreBadge result={result} />
        {showPinned && <ItemThumb item={pinnedItem} pinned />}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <ItemThumb key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
