import { useState, type FormEvent } from 'react'
import {
  FITS,
  SEASONS,
  STYLE_TAGS,
  type Category,
  type Fit,
  type Item,
  type ItemStatus,
  type MetalTone,
  type Season,
  type StyleTag,
} from '../data/types'
import { CATEGORY_OPTIONS, isAccessoryCategory } from '../data/categories'
import { PALETTE, STYLE_DEFS } from '../data/configAccess'
import { makeId } from '../lib/id'
import Chip from './Chip'
import ColorSwatch from './ColorSwatch'

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

export default function ItemForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Item
  onSubmit: (item: Item) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<Category>(initial?.category ?? 'top')
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? '')
  const [colors, setColors] = useState<string[]>(initial?.colors ?? [])
  const [material, setMaterial] = useState(initial?.material ?? '')
  const [fit, setFit] = useState<Fit | ''>(initial?.fit ?? '')
  const [formality, setFormality] = useState(initial?.formality ?? 2)
  const [seasons, setSeasons] = useState<Season[]>(initial?.seasons ?? [])
  const [styleTags, setStyleTags] = useState<StyleTag[]>(initial?.styleTags ?? [])
  const [status, setStatus] = useState<ItemStatus>(initial?.status ?? 'owned')
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [metalTone, setMetalTone] = useState<MetalTone>(initial?.metalTone ?? 'none')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Give the item a name.')
      return
    }
    if (colors.length === 0) {
      setError('Pick at least one color.')
      return
    }
    setError('')
    onSubmit({
      id: initial?.id ?? makeId('item'),
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || undefined,
      colors,
      material: material.trim() || undefined,
      fit: fit || undefined,
      formality,
      seasons,
      styleTags,
      status,
      imageUrl: imageUrl.trim() || undefined,
      metalTone: isAccessoryCategory(category) ? metalTone : undefined,
      notes: notes.trim() || undefined,
      createdAt: initial?.createdAt ?? Date.now(),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dark indigo Levi's 501"
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Subcategory (optional)</span>
          <input
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            placeholder="e.g. straight jeans, chunky sneaker"
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Material (optional)</span>
          <input
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="e.g. cotton, denim, wool"
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
          />
        </label>
      </div>

      <div>
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Color(s)</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <ColorSwatch key={c.key} color={c} selected={colors.includes(c.key)} onClick={() => setColors((prev) => toggle(prev, c.key))} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Fit (optional)</span>
          <select
            value={fit}
            onChange={(e) => setFit(e.target.value as Fit | '')}
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Not set</option>
            {FITS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <div>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Formality (1 casual – 5 formal)</span>
          <div className="mt-2 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setFormality(n)}
                className={`h-9 flex-1 rounded-lg border text-sm font-semibold transition-colors ${
                  formality === n
                    ? 'border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Seasons</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {SEASONS.map((s) => (
            <Chip key={s} label={s} selected={seasons.includes(s)} onClick={() => setSeasons((prev) => toggle(prev, s))} />
          ))}
        </div>
      </div>

      <div>
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Style tags</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {STYLE_TAGS.map((tag) => (
            <Chip
              key={tag}
              label={STYLE_DEFS[tag].label}
              selected={styleTags.includes(tag)}
              onClick={() => setStyleTags((prev) => toggle(prev, tag))}
            />
          ))}
        </div>
      </div>

      {isAccessoryCategory(category) && (
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Metal tone (optional)</span>
          <select
            value={metalTone}
            onChange={(e) => setMetalTone(e.target.value as MetalTone)}
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="none">Not metal / n/a</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>
      )}

      <div>
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Owned or wishlist?</span>
        <div className="mt-2 flex gap-2">
          <Chip label="Owned" selected={status === 'owned'} onClick={() => setStatus('owned')} />
          <Chip label="Wishlist" selected={status === 'wishlist'} onClick={() => setStatus('wishlist')} />
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Image URL (optional)</span>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
          className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
        <span className="mt-1 block text-xs text-neutral-400">Helps tell similar items apart later — not required.</span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
        />
      </label>

      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          {initial ? 'Save changes' : 'Add item'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
