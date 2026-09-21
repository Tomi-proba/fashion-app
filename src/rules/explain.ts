import { STYLE_DEFS } from '../data/configAccess'
import type { Item, Occasion, RuleFlag, Season, StyleTag } from '../data/types'

export interface ExplainInput {
  items: Item[]
  look: StyleTag | null
  occasion: Occasion | null
  season: Season | null
  flags: RuleFlag[]
}

/** Deterministic, rules-driven explanation text — no LLM call, so it's free and instant. */
export function explainOutfit({ items, look, occasion, season, flags }: ExplainInput): string {
  const positives = flags.filter((f) => f.severity === 'positive').map((f) => f.message)
  const warnings = flags.filter((f) => f.severity === 'warning').map((f) => f.message)

  const parts: string[] = []

  const itemNames = items.map((i: Item) => i.name).join(', ')
  parts.push(`Built from ${itemNames}.`)

  if (look && STYLE_DEFS[look]) {
    parts.push(STYLE_DEFS[look].description)
  }

  if (positives.length > 0) {
    parts.push(positives.join(' '))
  }

  if (occasion) {
    parts.push(`Fits the formality expected for ${occasion.label.toLowerCase()}.`)
  }

  if (season) {
    parts.push(`Seasonally appropriate for ${season}.`)
  }

  if (warnings.length > 0) {
    parts.push(`Worth noting: ${warnings.join(' ')}`)
  }

  return parts.join(' ')
}
