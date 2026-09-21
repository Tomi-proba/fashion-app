import { SEASON_DEFS } from '../data/configAccess'
import type { Item, Season } from '../data/types'
import type { RuleResult } from './types'

/**
 * OPINIONATED: outfits made entirely of season-tagged pieces score highest; an accessory's
 * metal tone gets a small bonus when it matches the season's metalLean (seasons.json).
 */
export function evaluateSeason(items: Item[], season: Season | null): RuleResult {
  const flags: RuleResult['flags'] = []
  let score = 0
  if (!season || items.length === 0) return { score, flags }

  const def = SEASON_DEFS[season]
  const inSeasonCount = items.filter((i) => i.seasons.includes(season)).length
  const ratio = inSeasonCount / items.length

  if (ratio === 1) {
    score += 2
    flags.push({ rule: 'season', severity: 'positive', message: `Every piece works for ${def.label.toLowerCase()}.` })
  } else if (ratio < 0.5) {
    score -= 2
    flags.push({
      rule: 'season',
      severity: 'warning',
      message: `Most of these pieces aren't tagged for ${def.label.toLowerCase()} — double check fabric weight.`,
    })
  }

  const metalItems = items.filter((i) => i.metalTone === 'gold' || i.metalTone === 'silver')
  for (const mi of metalItems) {
    if (mi.metalTone === def.metalLean) {
      score += 1
    }
  }

  return { score, flags }
}
