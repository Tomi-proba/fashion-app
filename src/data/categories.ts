import { ACCESSORY_CATEGORIES, type Category } from './types'

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'dress', label: 'Dress' },
  { value: 'bag', label: 'Bag' },
  { value: 'sunglasses', label: 'Sunglasses' },
  { value: 'watch', label: 'Watch' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'hat', label: 'Hat' },
  { value: 'belt', label: 'Belt' },
  { value: 'other-accessory', label: 'Other accessory' },
]

export const CATEGORY_LABEL: Record<Category, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((c) => [c.value, c.label]),
) as Record<Category, string>

export function isAccessoryCategory(category: Category): boolean {
  return (ACCESSORY_CATEGORIES as Category[]).includes(category)
}
