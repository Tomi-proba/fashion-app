import { useState } from 'react'
import type { Item, Outfit } from '../data/types'
import ItemForm from '../components/ItemForm'
import ItemCard from '../components/ItemCard'
import OutfitCard from '../components/OutfitCard'
import { generateOutfits } from '../lib/generateOutfits'

interface Analysis {
  candidate: Item
  matchCount: number
  sampleOutfits: Outfit[]
  duplicates: Item[]
  itemsById: Map<string, Item>
}

function findDuplicates(candidate: Item, owned: Item[]): Item[] {
  return owned.filter((i) => {
    if (i.category !== candidate.category) return false
    const colorOverlap = i.colors.some((c) => candidate.colors.includes(c))
    if (!colorOverlap) return false
    if (candidate.subcategory && i.subcategory) {
      return i.subcategory.toLowerCase().trim() === candidate.subcategory.toLowerCase().trim()
    }
    return true
  })
}

export default function BuyCheck({
  wardrobe,
  onAddToWardrobe,
}: {
  wardrobe: Item[]
  onAddToWardrobe: (item: Item) => void
}) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const owned = wardrobe.filter((i) => i.status === 'owned')

  function handleCheck(candidate: Item) {
    const pool = [...owned, candidate]
    const commonArgs = {
      wardrobe: pool,
      look: null,
      anchorItemId: candidate.id,
      mustIncludeItemIds: [] as string[],
      mustExcludeItemIds: [] as string[],
      excludeColors: [] as string[],
      occasion: null,
      season: null,
    }

    const sampleOutfits = generateOutfits({ ...commonArgs, maxResults: 5 })
    // Infinity so the count reflects every valid combo, not just the ones we display
    const allMatches = generateOutfits({ ...commonArgs, maxResults: Infinity })

    setAnalysis({
      candidate,
      matchCount: allMatches.length,
      sampleOutfits,
      duplicates: findDuplicates(candidate, owned),
      itemsById: new Map(pool.map((i) => [i.id, i])),
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">Should I buy this?</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Describe a piece you're considering — see how many outfits it slots into and whether you already own
        something similar.
      </p>

      <div className="mt-6">
        <ItemForm
          key={analysis?.candidate.id ?? 'candidate'}
          onSubmit={handleCheck}
          onCancel={() => setAnalysis(null)}
        />
      </div>

      {analysis && (
        <section className="mt-8 space-y-5">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Result for</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{analysis.candidate.name}</p>
            <p className="mt-2 text-3xl font-black text-neutral-900 dark:text-neutral-100">
              {analysis.matchCount} <span className="text-base font-medium text-neutral-500">outfit combos</span>
            </p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {analysis.matchCount === 0
                ? "This doesn't combine cleanly with anything in your current wardrobe yet."
                : 'built from your current wardrobe with this piece included.'}
            </p>
            <button
              onClick={() => onAddToWardrobe(analysis.candidate)}
              className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
            >
              Add to wardrobe as {analysis.candidate.status}
            </button>
          </div>

          {analysis.duplicates.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                ⚠ You may already own something similar
              </h2>
              <div className="mt-3 space-y-2">
                {analysis.duplicates.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {analysis.sampleOutfits.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Example outfits</h2>
              <div className="mt-3 space-y-4">
                {analysis.sampleOutfits.map((outfit) => (
                  <OutfitCard
                    key={outfit.id}
                    outfit={outfit}
                    items={outfit.itemIds.map((id) => analysis.itemsById.get(id)).filter((i): i is Item => !!i)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
