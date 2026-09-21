import { ACCESSORY_CATEGORIES, type Item, type Occasion, type Outfit, type Season, type StyleTag } from '../data/types'
import { evaluateOutfit } from '../rules/engine'
import { passesHardConstraints } from '../rules/constraints'
import { makeId } from './id'

export interface GenerateOutfitsInput {
  wardrobe: Item[]
  look: StyleTag | null
  anchorItemId: string | null
  mustIncludeItemIds: string[]
  mustExcludeItemIds: string[]
  excludeColors: string[]
  occasion: Occasion | null
  season: Season | null
  maxResults?: number
  maxCandidates?: number
}

function cartesian<T>(arrays: (T | null)[][]): (T | null)[][] {
  return arrays.reduce<(T | null)[][]>((acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])), [[]])
}

/**
 * Builds candidate outfits (base + optional outerwear + footwear + optional accessories)
 * from the wardrobe, filters by hard constraints, scores the rest with the rules engine,
 * and returns the top N. Purely combinatorial + rules-based — no LLM call.
 */
export function generateOutfits({
  wardrobe,
  look,
  anchorItemId,
  mustIncludeItemIds,
  mustExcludeItemIds,
  excludeColors,
  occasion,
  season,
  maxResults = 5,
  maxCandidates = 4000,
}: GenerateOutfitsInput): Outfit[] {
  const allRequiredIds = anchorItemId ? [...new Set([...mustIncludeItemIds, anchorItemId])] : mustIncludeItemIds

  const pool = wardrobe.filter(
    (i) => !mustExcludeItemIds.includes(i.id) && !i.colors.some((c) => excludeColors.includes(c)),
  )

  const tops = pool.filter((i) => i.category === 'top')
  const bottoms = pool.filter((i) => i.category === 'bottom')
  const dresses = pool.filter((i) => i.category === 'dress')
  const outerwear = pool.filter((i) => i.category === 'outerwear')
  const footwear = pool.filter((i) => i.category === 'footwear')
  const accessoriesByCategory = ACCESSORY_CATEGORIES.map((cat) => pool.filter((i) => i.category === cat)).filter(
    (arr) => arr.length > 0,
  )

  if (footwear.length === 0) return []

  const bases: Item[][] = []
  for (const top of tops) {
    for (const bottom of bottoms) {
      bases.push([top, bottom])
    }
  }
  for (const dress of dresses) {
    bases.push([dress])
  }
  if (bases.length === 0) return []

  const outerwearOptions: (Item | null)[] = [null, ...outerwear]
  const accessoryOptionSets: (Item | null)[][] = accessoriesByCategory.map((arr) => [null, ...arr])
  const accessoryCombos: (Item | null)[][] = accessoryOptionSets.length > 0 ? cartesian(accessoryOptionSets) : [[]]

  const anyItemHasLook = look ? pool.some((i) => i.styleTags.includes(look)) : false

  const candidates: Item[][] = []
  outer: for (const base of bases) {
    for (const shoe of footwear) {
      for (const jacket of outerwearOptions) {
        for (const accCombo of accessoryCombos) {
          const items = [...base, shoe, jacket, ...accCombo].filter((i): i is Item => i !== null)
          candidates.push(items)
          if (candidates.length >= maxCandidates) break outer
        }
      }
    }
  }

  const results: Outfit[] = []

  for (const items of candidates) {
    if (look && anyItemHasLook && !items.some((i) => i.styleTags.includes(look))) continue

    if (
      !passesHardConstraints({
        items,
        mustIncludeItemIds: allRequiredIds,
        mustExcludeItemIds,
        excludeColors,
        occasion,
      })
    ) {
      continue
    }

    const evaluated = evaluateOutfit({ items, look, occasion, season })
    const lookMatchBonus = look ? items.filter((i) => i.styleTags.includes(look)).length * 2 : 0

    results.push({
      id: makeId('outfit'),
      itemIds: items.map((i) => i.id),
      look: look ?? undefined,
      occasion: occasion?.id,
      season: season ?? undefined,
      explanation: evaluated.explanation,
      score: evaluated.score + lookMatchBonus,
      flags: evaluated.flags,
    })
  }

  results.sort((a, b) => b.score - a.score)

  const seen = new Set<string>()
  const deduped: Outfit[] = []
  for (const outfit of results) {
    const signature = [...outfit.itemIds].sort().join('|')
    if (seen.has(signature)) continue
    seen.add(signature)
    deduped.push(outfit)
  }

  return deduped.slice(0, maxResults)
}
