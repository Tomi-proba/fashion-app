import {
  CLASSIFIER_CATEGORY_KEYWORDS,
  CLASSIFIER_COLOR_SYNONYMS,
  CLASSIFIER_FORMALITY_KEYWORDS,
  CLASSIFIER_METAL_KEYWORDS,
  CLASSIFIER_SEASON_KEYWORDS,
  CLASSIFIER_STYLE_KEYWORDS,
} from '../data/configAccess'
import { ACCESSORY_CATEGORIES, SEASONS, type Category, type MetalTone, type Season, type StyleTag } from '../data/types'

export interface ClassifiedGuess {
  category: Category
  colors: string[]
  styleTags: StyleTag[]
  formality: number
  seasons: Season[]
  metalTone: MetalTone
}

function matchAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw))
}

/**
 * Free, offline heuristic: guesses category/colors/style/formality/season/metal-tone from
 * a pasted link + description by keyword matching (data-driven, see
 * data/config/classifierKeywords.json). No page fetch, no AI call — intentionally rough,
 * always shown as editable in the UI so it can be corrected.
 */
export function classifyFromText(text: string): ClassifiedGuess {
  const lower = text.toLowerCase()

  let category: Category = 'top'
  let bestCount = 0
  for (const [cat, keywords] of Object.entries(CLASSIFIER_CATEGORY_KEYWORDS)) {
    const count = keywords.filter((kw) => lower.includes(kw)).length
    if (count > bestCount) {
      bestCount = count
      category = cat as Category
    }
  }

  const colors: string[] = []
  for (const [colorKey, synonyms] of Object.entries(CLASSIFIER_COLOR_SYNONYMS)) {
    if (matchAny(lower, synonyms)) colors.push(colorKey)
  }

  const styleTags: StyleTag[] = []
  for (const [style, keywords] of Object.entries(CLASSIFIER_STYLE_KEYWORDS)) {
    if (matchAny(lower, keywords)) styleTags.push(style as StyleTag)
  }
  // Never leave this empty — an undetected style would leave "Suggest outfit" permanently
  // disabled with no obvious cause. Fall back to the most neutral, broadly-applicable look.
  if (styleTags.length === 0) styleTags.push('clean-minimal')

  let seasons: Season[] = []
  for (const [season, keywords] of Object.entries(CLASSIFIER_SEASON_KEYWORDS)) {
    if (matchAny(lower, keywords)) seasons.push(season as Season)
  }
  if (seasons.length === 0) seasons = [...SEASONS]

  let metalTone: MetalTone = 'none'
  if ((ACCESSORY_CATEGORIES as Category[]).includes(category)) {
    if (matchAny(lower, CLASSIFIER_METAL_KEYWORDS.gold)) metalTone = 'gold'
    else if (matchAny(lower, CLASSIFIER_METAL_KEYWORDS.silver)) metalTone = 'silver'
  }

  let formality = 2
  for (const level of ['5', '4', '3', '1']) {
    if (matchAny(lower, CLASSIFIER_FORMALITY_KEYWORDS[level])) {
      formality = Number(level)
      break
    }
  }

  return { category, colors, styleTags, formality, seasons, metalTone }
}
