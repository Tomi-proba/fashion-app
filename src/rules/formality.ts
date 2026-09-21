import { MAX_FORMALITY_SPREAD, MAX_FORMALITY_SPREAD_WITH_REASON } from '../data/configAccess'
import type { Item } from '../data/types'
import type { RuleResult } from './types'

/**
 * OPINIONATED: pieces within maxSpreadWithinOutfit (formality.json) read as one outfit;
 * a wider spread is allowed but flagged as intentional contrast, up to maxSpreadWithReason.
 */
export function evaluateFormality(items: Item[]): RuleResult {
  const flags: RuleResult['flags'] = []
  let score = 0

  const formalities = items.map((i) => i.formality)
  const min = Math.min(...formalities)
  const max = Math.max(...formalities)
  const spread = max - min

  if (spread <= MAX_FORMALITY_SPREAD) {
    score += 2
  } else if (spread <= MAX_FORMALITY_SPREAD_WITH_REASON) {
    flags.push({
      rule: 'formality',
      severity: 'warning',
      message: 'A dressier piece is mixed with more casual ones — reads as intentional contrast, not a full match.',
    })
  } else {
    score -= 3
    flags.push({
      rule: 'formality',
      severity: 'warning',
      message: 'These pieces span too wide a formality range to read as one outfit.',
    })
  }

  return { score, flags }
}
