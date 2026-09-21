import { CLASHING_PAIRS, COLOR_BY_KEY, GOOD_ACCENT_PAIRS, MAX_ACCENT_COLORS, METAL_PAIRINGS } from '../data/configAccess'
import type { Item } from '../data/types'
import type { RuleResult } from './types'

/**
 * OPINIONATED: neutral base + at most one accent color reads as harmonious; more than
 * one accent, or a known clashing pair, is flagged. Gold/silver accessories are scored
 * against the outfit's warm/cool color lean (see colors.json metalPairings).
 */
export function evaluateColorHarmony(items: Item[]): RuleResult {
  const flags: RuleResult['flags'] = []
  let score = 0

  const allColors = items.flatMap((i) => i.colors)
  const uniqueColors = [...new Set(allColors)]
  const neutralColors = uniqueColors.filter((c) => COLOR_BY_KEY[c]?.neutral)
  const accentColors = uniqueColors.filter((c) => COLOR_BY_KEY[c] && !COLOR_BY_KEY[c].neutral)

  if (neutralColors.length > 0) {
    score += 2
  }

  if (accentColors.length === 0) {
    score += 1
    flags.push({
      rule: 'color-harmony',
      severity: 'positive',
      message: 'An all-neutral base that will pair with almost anything.',
    })
  } else if (accentColors.length <= MAX_ACCENT_COLORS) {
    score += 2
    const label = COLOR_BY_KEY[accentColors[0]]?.label ?? accentColors[0]
    flags.push({
      rule: 'color-harmony',
      severity: 'positive',
      message: `${label} works as a single accent against the neutral base.`,
    })
  } else {
    score -= 2
    flags.push({
      rule: 'color-harmony',
      severity: 'warning',
      message: `${accentColors.length} accent colors is a lot for one outfit — consider dropping to one.`,
    })
  }

  for (const [a, b] of CLASHING_PAIRS) {
    if (accentColors.includes(a) && accentColors.includes(b)) {
      score -= 3
      flags.push({
        rule: 'color-harmony',
        severity: 'warning',
        message: `${COLOR_BY_KEY[a]?.label ?? a} and ${COLOR_BY_KEY[b]?.label ?? b} tend to clash together.`,
      })
    }
  }

  if (accentColors.length === 1) {
    const good = GOOD_ACCENT_PAIRS[accentColors[0]] ?? []
    if (neutralColors.some((n) => good.includes(n))) {
      score += 1
    }
  }

  const metalItems = items.filter((i) => i.metalTone === 'gold' || i.metalTone === 'silver')
  if (metalItems.length > 0) {
    const warmCount = uniqueColors.filter((c) => COLOR_BY_KEY[c]?.temperature === 'warm').length
    const coolCount = uniqueColors.filter((c) => COLOR_BY_KEY[c]?.temperature === 'cool').length
    const outfitTemp = warmCount > coolCount ? 'warm' : coolCount > warmCount ? 'cool' : null

    for (const mi of metalItems) {
      const tone = mi.metalTone as 'gold' | 'silver'
      if (outfitTemp && outfitTemp === METAL_PAIRINGS[tone].prefersTemperature) {
        score += 1
        flags.push({
          rule: 'color-harmony',
          severity: 'positive',
          message: `${tone === 'gold' ? 'Gold' : 'Silver'} tones on ${mi.name.toLowerCase()} match the outfit's ${outfitTemp} palette.`,
        })
      }
    }
  }

  return { score, flags }
}
