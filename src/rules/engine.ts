import type { Item, Occasion, Season, StyleTag } from '../data/types'
import { evaluateColorHarmony } from './colorHarmony'
import { evaluateFormality } from './formality'
import { evaluateProportions } from './proportions'
import { evaluateSeason } from './season'
import { explainOutfit } from './explain'
import type { RuleResult } from './types'

export interface EvaluateOutfitInput {
  items: Item[]
  look: StyleTag | null
  occasion: Occasion | null
  season: Season | null
}

export interface EvaluatedOutfit extends RuleResult {
  explanation: string
}

export function evaluateOutfit({ items, look, occasion, season }: EvaluateOutfitInput): EvaluatedOutfit {
  const color = evaluateColorHarmony(items)
  const formality = evaluateFormality(items)
  const proportions = evaluateProportions(items)
  const seasonResult = evaluateSeason(items, season)

  const flags = [...color.flags, ...formality.flags, ...proportions.flags, ...seasonResult.flags]
  const score = color.score + formality.score + proportions.score + seasonResult.score

  const explanation = explainOutfit({ items, look, occasion, season, flags })

  return { score, flags, explanation }
}
