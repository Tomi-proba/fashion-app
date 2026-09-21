import { useMemo, useState } from 'react'
import { SEASONS, STYLE_TAGS, type Item, type Outfit, type Profile, type Season, type StyleTag } from '../data/types'
import { OCCASIONS, OCCASION_BY_ID, PALETTE, STYLE_DEFS } from '../data/configAccess'
import { generateOutfits } from '../lib/generateOutfits'
import Chip from '../components/Chip'
import ColorSwatch from '../components/ColorSwatch'
import OutfitCard from '../components/OutfitCard'

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

export default function Generator({
  wardrobe,
  profile,
  savedOutfits,
  onToggleSaved,
}: {
  wardrobe: Item[]
  profile: Profile
  savedOutfits: Outfit[]
  onToggleSaved: (outfit: Outfit) => void
}) {
  const owned = useMemo(() => wardrobe.filter((i) => i.status === 'owned'), [wardrobe])

  const [look, setLook] = useState<StyleTag | null>(null)
  const [anchorItemId, setAnchorItemId] = useState<string | null>(null)
  const [mustIncludeItemIds, setMustIncludeItemIds] = useState<string[]>([])
  const [mustExcludeItemIds, setMustExcludeItemIds] = useState<string[]>([])
  const [excludeColors, setExcludeColors] = useState<string[]>(profile.dislikedColors)
  const [occasionId, setOccasionId] = useState<string>('')
  const [season, setSeason] = useState<Season | null>(null)
  const [results, setResults] = useState<Outfit[] | null>(null)

  const itemsById = useMemo(() => new Map(wardrobe.map((i) => [i.id, i])), [wardrobe])
  const savedIds = useMemo(() => new Set(savedOutfits.map((o) => o.id)), [savedOutfits])

  function handleGenerate() {
    const occasion = occasionId ? OCCASION_BY_ID[occasionId] : null
    const outfits = generateOutfits({
      wardrobe: owned,
      look,
      anchorItemId,
      mustIncludeItemIds,
      mustExcludeItemIds,
      excludeColors,
      occasion,
      season,
    })
    setResults(outfits)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">Generate outfits</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Combine a look, an anchor piece, and what to include or avoid — everything below is optional.
      </p>

      {owned.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400 dark:border-neutral-800">
          Add some owned items to your wardrobe first (or load the example wardrobe from the Wardrobe tab).
        </p>
      ) : (
        <>
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">1. Pick a look (optional)</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip label="Any" selected={look === null} onClick={() => setLook(null)} />
              {STYLE_TAGS.map((tag) => (
                <Chip key={tag} label={STYLE_DEFS[tag].label} selected={look === tag} onClick={() => setLook(look === tag ? null : tag)} />
              ))}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">2. Anchor piece (optional)</h2>
            <p className="mt-1 text-xs text-neutral-400">Every outfit will be built around this item.</p>
            <select
              value={anchorItemId ?? ''}
              onChange={(e) => setAnchorItemId(e.target.value || null)}
              className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">None</option>
              {owned.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">3. Must include (optional)</h2>
            <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border border-neutral-100 p-2 dark:border-neutral-800">
              {owned.map((item) => (
                <Chip
                  key={item.id}
                  label={item.name}
                  selected={mustIncludeItemIds.includes(item.id)}
                  onClick={() => setMustIncludeItemIds((prev) => toggle(prev, item.id))}
                />
              ))}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">4. Must avoid (optional)</h2>
            <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border border-neutral-100 p-2 dark:border-neutral-800">
              {owned.map((item) => (
                <Chip
                  key={item.id}
                  label={item.name}
                  selected={mustExcludeItemIds.includes(item.id)}
                  onClick={() => setMustExcludeItemIds((prev) => toggle(prev, item.id))}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-400">Colors to avoid:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PALETTE.map((c) => (
                <ColorSwatch key={c.key} color={c} selected={excludeColors.includes(c.key)} onClick={() => setExcludeColors((prev) => toggle(prev, c.key))} />
              ))}
            </div>
          </section>

          <section className="mt-6 grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Occasion (optional)</span>
              <select
                value={occasionId}
                onChange={(e) => setOccasionId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              >
                <option value="">Any</option>
                {OCCASIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Season (optional)</span>
              <div className="mt-2 flex flex-wrap gap-2">
                <Chip label="Any" selected={season === null} onClick={() => setSeason(null)} />
                {SEASONS.map((s) => (
                  <Chip key={s} label={s} selected={season === s} onClick={() => setSeason(season === s ? null : s)} />
                ))}
              </div>
            </div>
          </section>

          <button
            onClick={handleGenerate}
            className="mt-8 w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Generate outfits
          </button>

          {results !== null && (
            <section className="mt-8 space-y-4">
              {results.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400 dark:border-neutral-800">
                  No outfits match those constraints — try loosening the must-include/exclude list or the occasion.
                </p>
              ) : (
                results.map((outfit) => (
                  <OutfitCard
                    key={outfit.id}
                    outfit={outfit}
                    items={outfit.itemIds.map((id) => itemsById.get(id)).filter((i): i is Item => !!i)}
                    saved={savedIds.has(outfit.id)}
                    onToggleSaved={() => onToggleSaved(outfit)}
                  />
                ))
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}
