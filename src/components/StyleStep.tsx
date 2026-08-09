import { useMemo, useState } from 'react'
import { styles } from '../data/styles'
import { items } from '../data/items'
import type { Category, ClothingItem, Gender } from '../data/types'
import GarmentIcon from './GarmentIcon'
import ItemThumb from './ItemThumb'

interface Props {
  gender: Gender
  onStyleSelect: (id: string) => void
  onFavoriteItemSelect: (item: ClothingItem) => void
}

const CATEGORY_OPTIONS: { id: Category; label: string }[] = [
  { id: 'top', label: 'Top' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'dress', label: 'Dress' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'bag', label: 'Bag' },
  { id: 'accessory', label: 'Accessory' },
]

const COLOR_SWATCHES: { name: string; hex: string }[] = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Grey', hex: '#8a8a8a' },
  { name: 'Navy', hex: '#1e2a4a' },
  { name: 'Brown', hex: '#5a3a24' },
  { name: 'Beige', hex: '#c9a876' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Silver', hex: '#c7cdd6' },
  { name: 'Red', hex: '#a4222c' },
  { name: 'Green', hex: '#3f5c3f' },
]

export default function StyleStep({ gender, onStyleSelect, onFavoriteItemSelect }: Props) {
  const [tab, setTab] = useState<'style' | 'search'>('style')
  const [query, setQuery] = useState('')
  const [customCategory, setCustomCategory] = useState<Category | null>(null)
  const [customStyleIds, setCustomStyleIds] = useState<string[]>([])
  const [customBrand, setCustomBrand] = useState('')
  const [customColor, setCustomColor] = useState<{ name: string; hex: string } | null>(null)
  const [customImageUrl, setCustomImageUrl] = useState('')

  const prefix = gender === 'feminine' ? 'f-' : 'm-'
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    return items
      .filter((i) => i.id.startsWith(prefix))
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.brand.toLowerCase().includes(q) ||
          i.tags.some((t) => t.includes(q)),
      )
      .slice(0, 8)
  }, [query, prefix])

  function toggleCustomStyle(id: string) {
    setCustomStyleIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  function resetCustomFields() {
    setCustomCategory(null)
    setCustomStyleIds([])
    setCustomBrand('')
    setCustomColor(null)
    setCustomImageUrl('')
  }

  function buildCustomItem() {
    const name = query.trim()
    if (!name || !customCategory || customStyleIds.length === 0) return
    onFavoriteItemSelect({
      id: `custom-${Date.now()}`,
      name,
      category: customCategory,
      brand: customBrand.trim(),
      retailer: '',
      sku: '',
      price: 0,
      color: customColor?.hex ?? '#9a9a9a',
      colorName: customColor?.name ?? '',
      tags: customStyleIds,
      custom: true,
      imageUrl: customImageUrl.trim() || undefined,
    })
  }

  const canBuild = query.trim().length > 0 && !!customCategory && customStyleIds.length > 0
  const previewItem: ClothingItem | null = canBuild
    ? {
        id: 'preview',
        name: query.trim(),
        category: customCategory!,
        brand: customBrand.trim(),
        retailer: '',
        sku: '',
        price: 0,
        color: customColor?.hex ?? '#9a9a9a',
        colorName: customColor?.name ?? '',
        tags: customStyleIds,
        custom: true,
        imageUrl: customImageUrl.trim() || undefined,
      }
    : null

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-8 text-center">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Pick a style, or start from a piece you love
        </h2>
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">
          Browse by aesthetic, or search a favorite piece to build looks around it.
        </p>
      </div>

      <div className="flex gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          onClick={() => setTab('style')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            tab === 'style'
              ? 'bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-neutral-100'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          Browse by style
        </button>
        <button
          onClick={() => setTab('search')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            tab === 'search'
              ? 'bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-neutral-100'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          Search a favorite piece
        </button>
      </div>

      {tab === 'style' ? (
        <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => onStyleSelect(s.id)}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-neutral-400 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500"
            >
              <span className="text-3xl">{s.icon}</span>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{s.label}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{s.blurb}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-md">
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              resetCustomFields()
            }}
            placeholder="Try 'leather jacket', 'RB3927S', 'sequin'..."
            className="w-full rounded-full border-2 border-neutral-200 bg-white px-5 py-3 text-center text-sm outline-none transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />

          {results.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                In our catalog
              </p>
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onFavoriteItemSelect(item)}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 text-left transition hover:border-neutral-400 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
                    <GarmentIcon category={item.category} color={item.color} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {item.brand} · {item.colorName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.trim() && (
            <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 p-4 text-left dark:border-neutral-700">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {results.length > 0 ? "Not the exact piece?" : `We don't have "${query.trim()}" in our catalog.`}
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                We can't pull anything back automatically from an outside search — use the link below just to
                double-check you've got the right name, then describe it below and we'll build outfits around it.
              </p>
              <a
                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-sky-600 underline underline-offset-2 hover:text-sky-700 dark:text-sky-400"
              >
                Look it up on the web (reference only) →
              </a>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Category</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCustomCategory(c.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      customCategory === c.id
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Style it fits with
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleCustomStyle(s.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                      customStyleIds.includes(s.id)
                        ? 'border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Color <span className="normal-case text-neutral-400">(optional)</span>
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {COLOR_SWATCHES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCustomColor(customColor?.name === c.name ? null : c)}
                    title={c.name}
                    aria-label={c.name}
                    className={`h-6 w-6 rounded-full border-2 transition ${
                      customColor?.name === c.name
                        ? 'border-amber-500 ring-2 ring-amber-300'
                        : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Brand <span className="normal-case text-neutral-400">(optional)</span>
              </p>
              <input
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="e.g. Ray-Ban"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Photo link <span className="normal-case text-neutral-400">(optional)</span>
              </p>
              <input
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Paste a link to a photo of it"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />

              {previewItem && (
                <div className="mt-3">
                  <ItemThumb item={previewItem} pinned />
                </div>
              )}

              <button
                onClick={buildCustomItem}
                disabled={!canBuild}
                className="mt-3 w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-900"
              >
                Build outfits around this piece
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
