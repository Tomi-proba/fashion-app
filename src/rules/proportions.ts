import type { Item } from '../data/types'
import type { RuleResult } from './types'

/**
 * OPINIONATED: regular-to-straight bottoms pair well with regular or boxy tops and
 * chunkier shoes; an oversized top with an oversized/wide bottom is flagged as
 * potentially shapeless. A slim/regular bottom with a chunky shoe is called out
 * as a grounded, balanced silhouette.
 */
export function evaluateProportions(items: Item[]): RuleResult {
  const flags: RuleResult['flags'] = []
  let score = 0

  const top = items.find((i) => i.category === 'top')
  const bottom = items.find((i) => i.category === 'bottom')
  const footwear = items.find((i) => i.category === 'footwear')

  if (top && bottom) {
    const bothLoose = (top.fit === 'oversized' || top.fit === 'relaxed') && (bottom.fit === 'oversized' || bottom.fit === 'relaxed')
    const bothSlim = top.fit === 'slim' && bottom.fit === 'slim'

    if (bothLoose && top.fit === 'oversized' && bottom.fit === 'oversized') {
      score -= 2
      flags.push({
        rule: 'proportions',
        severity: 'warning',
        message: 'Oversized top + oversized bottom can read shapeless — try balancing with a slimmer piece on one half.',
      })
    } else if (bothSlim) {
      score += 1
    } else {
      score += 2
      flags.push({
        rule: 'proportions',
        severity: 'positive',
        message: 'Proportions are balanced — one relaxed piece against one closer-fitting piece.',
      })
    }
  }

  if (bottom && footwear) {
    const streamlinedBottom = bottom.fit === 'slim' || bottom.fit === 'regular'
    const chunkyShoe = (footwear.subcategory ?? '').toLowerCase().match(/chunky|boot|platform|dad/)
    if (streamlinedBottom && chunkyShoe) {
      score += 1
      flags.push({
        rule: 'proportions',
        severity: 'positive',
        message: 'A slimmer leg with a chunkier shoe keeps the silhouette grounded.',
      })
    }
  }

  return { score, flags }
}
