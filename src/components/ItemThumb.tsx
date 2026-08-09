import type { ClothingItem } from '../data/types'
import { shopUrl } from '../data/items'
import GarmentIcon from './GarmentIcon'

export default function ItemThumb({ item }: { item: ClothingItem }) {
  return (
    <div className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 p-2 dark:border-neutral-700 dark:bg-neutral-800">
        <GarmentIcon category={item.category} color={item.color} className="h-full w-full drop-shadow-sm" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
        <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
          {item.brand} · {item.colorName}
        </p>
        <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
          ${item.price} · SKU {item.sku}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-neutral-400 dark:text-neutral-500">
            Get it at {item.retailer}
          </span>
          <a
            href={shopUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            Shop
          </a>
        </div>
      </div>
    </div>
  )
}
