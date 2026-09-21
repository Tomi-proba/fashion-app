import { useMemo } from 'react'
import type { Item, Outfit } from '../data/types'
import OutfitCard from '../components/OutfitCard'

export default function Saved({
  wardrobe,
  savedOutfits,
  onRemove,
}: {
  wardrobe: Item[]
  savedOutfits: Outfit[]
  onRemove: (id: string) => void
}) {
  const itemsById = useMemo(() => new Map(wardrobe.map((i) => [i.id, i])), [wardrobe])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">Saved outfits</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{savedOutfits.length} saved</p>

      {savedOutfits.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400 dark:border-neutral-800">
          Nothing saved yet — heart an outfit from the Generate tab to keep it here.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {savedOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              items={outfit.itemIds.map((id) => itemsById.get(id)).filter((i): i is Item => !!i)}
              saved
              onToggleSaved={() => onRemove(outfit.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
