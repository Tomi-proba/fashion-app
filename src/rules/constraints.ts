import type { Item, Occasion } from '../data/types'

export interface ConstraintInput {
  items: Item[]
  mustIncludeItemIds: string[]
  mustExcludeItemIds: string[]
  excludeColors: string[]
  occasion: Occasion | null
}

/** Hard constraints: required items must always appear, excluded items/colors must never appear. */
export function passesHardConstraints({
  items,
  mustIncludeItemIds,
  mustExcludeItemIds,
  excludeColors,
  occasion,
}: ConstraintInput): boolean {
  const presentIds = new Set(items.map((i) => i.id))

  for (const requiredId of mustIncludeItemIds) {
    if (!presentIds.has(requiredId)) return false
  }

  for (const item of items) {
    if (mustExcludeItemIds.includes(item.id)) return false
    if (item.colors.some((c) => excludeColors.includes(c))) return false
  }

  if (occasion) {
    const [lo, hi] = occasion.formalityRange
    const avg = items.reduce((sum, i) => sum + i.formality, 0) / items.length
    // one point of slack on either side keeps the filter from being overly strict
    if (avg < lo - 1 || avg > hi + 1) return false
  }

  return true
}
