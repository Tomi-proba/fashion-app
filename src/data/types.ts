export type Gender = 'feminine' | 'masculine'

export type Category =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outerwear'
  | 'shoes'
  | 'bag'
  | 'accessory'

export interface ClothingItem {
  id: string
  name: string
  category: Category
  brand: string
  retailer: string
  sku: string
  price: number
  color: string
  colorName: string
  tags: string[]
  /** True for a piece the user typed in themselves rather than one from the catalog. */
  custom?: boolean
  /** Optional photo URL the user pasted in for a custom piece. */
  imageUrl?: string
}

export interface OccasionProfile {
  id: string
  label: string
  icon: string
  blurb: string
  /** 1 (very casual) - 5 (black tie formal) */
  formality: [number, number]
  /** max acceptable flashiness, 1 (understated) - 5 (maximal/sequins/loud) */
  maxFlashiness: number
  /** min acceptable coverage/modesty, 1 (minimal) - 5 (fully covered) */
  minCoverage: number
}

export interface StyleProfile {
  id: string
  label: string
  icon: string
  blurb: string
}

export interface Outfit {
  id: string
  name: string
  gender: Gender
  styles: string[]
  itemIds: string[]
  /** 1 (very casual) - 5 (black tie formal) */
  formality: number
  /** 1 (understated) - 5 (maximal/loud) */
  flashiness: number
  /** 1 (minimal coverage) - 5 (fully covered) */
  coverage: number
  notes?: string
}

export interface ScoreResult {
  score: number
  verdict: 'great' | 'good' | 'risky' | 'poor'
  reasons: string[]
}
