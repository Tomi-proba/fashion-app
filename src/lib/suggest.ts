import { outfits } from '../data/outfits'
import type { ClothingItem, Gender, Outfit, OccasionProfile } from '../data/types'
import { scoreOutfit } from './scoring'

export function outfitsForStyle(gender: Gender, styleId: string): Outfit[] {
  return outfits.filter((o) => o.gender === gender && o.styles.includes(styleId))
}

export function outfitsForFavoriteItem(gender: Gender, item: ClothingItem): Outfit[] {
  const candidates = outfits.filter((o) => o.gender === gender)
  const withItem = candidates.filter((o) => o.itemIds.includes(item.id))
  const related = candidates.filter(
    (o) => !o.itemIds.includes(item.id) && o.styles.some((s) => item.tags.includes(s)),
  )
  return [...withItem, ...related]
}

export function sortByScoreDesc(list: Outfit[], occasion: OccasionProfile): Outfit[] {
  return [...list].sort((a, b) => scoreOutfit(b, occasion).score - scoreOutfit(a, occasion).score)
}
