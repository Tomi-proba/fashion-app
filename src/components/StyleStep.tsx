import { useMemo, useState } from 'react'
import { styles } from '../data/styles'
import { items } from '../data/items'
import type { ClothingItem, Gender } from '../data/types'
import GarmentIcon from './GarmentIcon'

interface Props {
  gender: Gender
  onStyleSelect: (id: string) => void
  onFavoriteItemSelect: (item: ClothingItem) => void
}

export default function StyleStep({ gender, onStyleSelect, onFavoriteItemSelect }: Props) {
  const [tab, setTab] = useState<'style' | 'search'>('style')
  const [query, setQuery] = useState('')

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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'leather jacket', 'sequin', 'linen'..."
            className="w-full rounded-full border-2 border-neutral-200 bg-white px-5 py-3 text-center text-sm outline-none transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
          <div className="mt-4 flex flex-col gap-2">
            {query.trim() && results.length === 0 && (
              <p className="text-sm text-neutral-400">No matching pieces yet — try another word.</p>
            )}
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
        </div>
      )}
    </div>
  )
}
