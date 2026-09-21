import { useMemo, useState } from 'react'
import type { Item } from '../data/types'
import ItemForm from '../components/ItemForm'
import ItemCard from '../components/ItemCard'

type Filter = 'all' | 'owned' | 'wishlist'

export default function Wardrobe({
  wardrobe,
  onAdd,
  onUpdate,
  onDelete,
  onLoadExample,
}: {
  wardrobe: Item[]
  onAdd: (item: Item) => void
  onUpdate: (item: Item) => void
  onDelete: (id: string) => void
  onLoadExample: () => void
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingItem = editingId ? wardrobe.find((i) => i.id === editingId) : undefined

  const filtered = useMemo(() => {
    if (filter === 'all') return wardrobe
    return wardrobe.filter((i) => i.status === filter)
  }, [wardrobe, filter])

  const ownedCount = wardrobe.filter((i) => i.status === 'owned').length
  const wishlistCount = wardrobe.filter((i) => i.status === 'wishlist').length

  function startAdd() {
    setEditingId(null)
    setShowForm(true)
  }

  function startEdit(id: string) {
    setEditingId(id)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">Wardrobe</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {ownedCount} owned · {wishlistCount} on wishlist
          </p>
        </div>
        <div className="flex gap-2">
          {wardrobe.length === 0 && (
            <button
              onClick={onLoadExample}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Load example wardrobe
            </button>
          )}
          <button
            onClick={startAdd}
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            + Add item
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-6">
          <ItemForm
            key={editingId ?? 'new'}
            initial={editingItem}
            onSubmit={(item) => {
              if (editingItem) onUpdate(item)
              else onAdd(item)
              closeForm()
            }}
            onCancel={closeForm}
          />
        </div>
      )}

      <div className="mt-6 flex gap-2">
        {(['all', 'owned', 'wishlist'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-400 dark:border-neutral-800">
            No items yet. Add your first piece, or load the example wardrobe to try the app.
          </p>
        )}
        {filtered
          .slice()
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((item) => (
            <ItemCard key={item.id} item={item} onEdit={() => startEdit(item.id)} onDelete={() => onDelete(item.id)} />
          ))}
      </div>
    </div>
  )
}
