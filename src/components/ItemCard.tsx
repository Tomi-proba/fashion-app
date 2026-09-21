import type { Item } from '../data/types'
import { CATEGORY_LABEL } from '../data/categories'
import { COLOR_BY_KEY } from '../data/configAccess'
import ColorSwatch from './ColorSwatch'

export default function ItemCard({
  item,
  onEdit,
  onDelete,
  trailing,
}: {
  item: Item
  onEdit?: () => void
  onDelete?: () => void
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-lg font-bold text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600">
          {item.name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
          {item.status === 'wishlist' && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              Wishlist
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {CATEGORY_LABEL[item.category]}
          {item.subcategory ? ` · ${item.subcategory}` : ''} · formality {item.formality}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {item.colors.map((c) =>
            COLOR_BY_KEY[c] ? <ColorSwatch key={c} color={COLOR_BY_KEY[c]} selected={false} size="sm" /> : null,
          )}
          {item.styleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {trailing}
        {onEdit && (
          <button onClick={onEdit} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-xs font-medium text-red-500 hover:text-red-700">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
