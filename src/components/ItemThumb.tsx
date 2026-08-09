import { useState } from 'react'
import type { ClothingItem } from '../data/types'
import { shopUrl } from '../data/items'
import GarmentIcon from './GarmentIcon'

export default function ItemThumb({ item, pinned }: { item: ClothingItem; pinned?: boolean }) {
  const [imgError, setImgError] = useState(false)
  const showPhoto = item.imageUrl && !imgError
  const hasCustomDetails = item.brand.trim() || item.colorName.trim()

  return (
    <div
      className={`flex gap-3 rounded-xl border bg-white p-3 dark:bg-neutral-900 ${
        pinned
          ? 'border-amber-300 ring-2 ring-amber-200 dark:border-amber-700 dark:ring-amber-900'
          : 'border-neutral-200 dark:border-neutral-700'
      }`}
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
        {showPhoto ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <GarmentIcon category={item.category} color={item.color} className="h-full w-full p-2 drop-shadow-sm" />
        )}
      </div>
      <div className="min-w-0 flex-1 text-left">
        {pinned && (
          <span className="mb-0.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Your piece
          </span>
        )}
        <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
        {item.custom ? (
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
            {hasCustomDetails ? [item.brand, item.colorName].filter(Boolean).join(' · ') : 'Not in our catalog'}
          </p>
        ) : (
          <>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
              {item.brand} · {item.colorName}
            </p>
            <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
              ${item.price} · SKU {item.sku}
            </p>
          </>
        )}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-neutral-400 dark:text-neutral-500">
            {item.custom ? 'Search the web' : `Get it at ${item.retailer}`}
          </span>
          <a
            href={shopUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            {item.custom ? 'Search' : 'Shop'}
          </a>
        </div>
      </div>
    </div>
  )
}
