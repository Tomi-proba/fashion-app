import colorsConfig from './config/colors.json'
import formalityConfig from './config/formality.json'
import stylesConfig from './config/styles.json'
import seasonsConfig from './config/seasons.json'
import occasionsConfig from './config/occasions.json'
import type { Occasion, Season, StyleTag } from './types'

export interface ColorDef {
  key: string
  label: string
  hex: string
  neutral: boolean
  temperature: 'warm' | 'cool'
}

export const PALETTE: ColorDef[] = colorsConfig.palette as unknown as ColorDef[]
export const COLOR_BY_KEY: Record<string, ColorDef> = Object.fromEntries(PALETTE.map((c) => [c.key, c]))
export const GOOD_ACCENT_PAIRS: Record<string, string[]> = colorsConfig.goodAccentPairs as unknown as Record<
  string,
  string[]
>
export const CLASHING_PAIRS: [string, string][] = colorsConfig.clashingPairs.pairs as [string, string][]
export const METAL_PAIRINGS: Record<'gold' | 'silver', { prefersTemperature: 'warm' | 'cool'; styleLean: string[] }> =
  colorsConfig.metalPairings as unknown as Record<
    'gold' | 'silver',
    { prefersTemperature: 'warm' | 'cool'; styleLean: string[] }
  >
export const MAX_ACCENT_COLORS: number = colorsConfig.maxAccentColors

export const FORMALITY_SCALE: Record<string, string> = formalityConfig.scale
export const MAX_FORMALITY_SPREAD: number = formalityConfig.maxSpreadWithinOutfit
export const MAX_FORMALITY_SPREAD_WITH_REASON: number = formalityConfig.maxSpreadWithReason
export const STYLE_FORMALITY_RANGE: Record<string, [number, number]> = formalityConfig.styleFormalityRange as unknown as Record<
  string,
  [number, number]
>

export interface StyleDef {
  label: string
  description: string
  fitLean: string[]
  accessoryLean: string[]
  archetype: string
  suggestedColors: string[]
}

export const STYLE_DEFS: Record<StyleTag, StyleDef> = stylesConfig as unknown as Record<StyleTag, StyleDef>

export interface SeasonDef {
  label: string
  preferredMaterials: string[]
  weight: string
  metalLean: 'gold' | 'silver'
  note: string
}

export const SEASON_DEFS: Record<Season, SeasonDef> = seasonsConfig as unknown as Record<Season, SeasonDef>

export const OCCASIONS: Occasion[] = occasionsConfig.occasions as Occasion[]
export const OCCASION_BY_ID: Record<string, Occasion> = Object.fromEntries(OCCASIONS.map((o) => [o.id, o]))
