import { COLOR_BY_KEY, GOOD_ACCENT_PAIRS, STYLE_DEFS, type BodySlot } from '../data/configAccess'
import type { Category, MetalTone, Season, StyleTag } from '../data/types'

export interface AnchorGuess {
  category: Category
  colors: string[]
  styleTags: StyleTag[]
  formality: number
  seasons: Season[]
  metalTone: MetalTone
}

export interface SuggestedPiece {
  slot: BodySlot
  description: string
  color: string | null
  searchUrl: string
}

export interface SuggestedOutfit {
  primaryStyle: StyleTag
  pieces: SuggestedPiece[]
  paletteColors: string[]
  explanation: string
}

function slotsForCategory(category: Category): BodySlot[] {
  switch (category) {
    case 'top':
      return ['bottom', 'footwear', 'outerwear', 'accessory']
    case 'bottom':
      return ['top', 'footwear', 'outerwear', 'accessory']
    case 'dress':
      return ['footwear', 'outerwear', 'accessory']
    case 'footwear':
      return ['top', 'bottom', 'accessory']
    case 'outerwear':
      return ['top', 'bottom', 'footwear', 'accessory']
    default:
      return ['top', 'bottom', 'footwear', 'accessory']
  }
}

export function buildSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

/**
 * Builds a suggested outfit around an anchor piece from generic style formulas
 * (data/config/styles.json suggestedPieces), not the user's own wardrobe — each
 * complementary piece links to a generic web search rather than a real product.
 */
export function suggestOutfitFromAnchor(anchor: AnchorGuess, dislikedColors: string[]): SuggestedOutfit | null {
  const primaryStyle = anchor.styleTags[0]
  if (!primaryStyle) return null

  const styleDef = STYLE_DEFS[primaryStyle]
  const slots = slotsForCategory(anchor.category)

  const anchorAccent = anchor.colors.find((c) => COLOR_BY_KEY[c] && !COLOR_BY_KEY[c].neutral)
  const anchorNeutral = anchor.colors.find((c) => COLOR_BY_KEY[c]?.neutral)

  let paletteColors: string[]
  if (anchorAccent) {
    const good = (GOOD_ACCENT_PAIRS[anchorAccent] ?? []).filter((c) => !dislikedColors.includes(c))
    paletteColors = [anchorAccent, ...good]
  } else {
    paletteColors = [
      ...(anchorNeutral ? [anchorNeutral] : []),
      ...styleDef.suggestedColors.filter((c) => !dislikedColors.includes(c)),
    ]
  }
  paletteColors = [...new Set(paletteColors)].slice(0, 4)
  if (paletteColors.length === 0) paletteColors = styleDef.suggestedColors

  const pieces: SuggestedPiece[] = slots.map((slot, idx) => {
    const description = styleDef.suggestedPieces[slot]
    const color = paletteColors[(idx + 1) % paletteColors.length] ?? null
    const colorLabel = color ? COLOR_BY_KEY[color]?.label : ''
    const query = `${colorLabel} ${description}`.trim()
    return { slot, description, color, searchUrl: buildSearchUrl(query) }
  })

  const paletteLabel = paletteColors.map((c) => COLOR_BY_KEY[c]?.label.toLowerCase()).join(', ')
  const explanation = `${styleDef.description} Built around your piece, paired with a ${paletteLabel} palette.`

  return { primaryStyle, pieces, paletteColors, explanation }
}
