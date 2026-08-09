import { useMemo, useState } from 'react'
import { styles } from '../data/styles'
import { items } from '../data/items'
import type { Category, ClothingItem, Gender } from '../data/types'
import GarmentIcon from './GarmentIcon'

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

export default function StyleStep({ gender, onStyleSelect, onFavoriteItemSelect }: Props) {
  const [tab, setTab] = useState<'style' | 'search'>('style')
  const [query, setQuery] = useState('')
  const [customCategory, setCustomCategory] = useState<Category | null>(null)
  const [customStyleIds, setCustomStyleIds] = useState<string[]>([])

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

  function buildCustomItem() {
    const name = query.trim()
    if (!name || !customCategory || customStyleIds.length === 0) return
    onFavoriteItemSelect({
      id: `custom-${Date.now()}`,
      name,
      category: customCategory,
      brand: '',
      retailer: '',
      sku: '',
      price: 0,
      color: '#9a9a9a',
      colorName: '',
      tags: customStyleIds,
      custom: true,
    })
  }

  const canBuild = query.trim().length > 0 && !!customCategory && customStyleIds.length > 0

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
              setCustomCategory(null)
              setCustomStyleIds([])
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
              <a
                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-sky-600 underline underline-offset-2 hover:text-sky-700 dark:text-sky-400"
              >
                Search the web for "{query.trim()}" →
              </a>

              <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                Tell us a bit about it and we'll still build outfits around it:
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
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

              <div className="mt-2 flex flex-wrap gap-1.5">
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
