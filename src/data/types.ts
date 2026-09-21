export type Category =
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'footwear'
  | 'dress'
  | 'bag'
  | 'sunglasses'
  | 'watch'
  | 'jewelry'
  | 'hat'
  | 'belt'
  | 'other-accessory'

export const ACCESSORY_CATEGORIES: Category[] = [
  'bag',
  'sunglasses',
  'watch',
  'jewelry',
  'hat',
  'belt',
  'other-accessory',
]

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']

export type StyleTag =
  | 'streetwear'
  | 'smart-casual'
  | 'clean-minimal'
  | 'vintage-retro'
  | 'preppy'
  | 'sporty'
  | 'dressy'

export const STYLE_TAGS: StyleTag[] = [
  'streetwear',
  'smart-casual',
  'clean-minimal',
  'vintage-retro',
  'preppy',
  'sporty',
  'dressy',
]

export type Fit = 'slim' | 'regular' | 'relaxed' | 'oversized'

export const FITS: Fit[] = ['slim', 'regular', 'relaxed', 'oversized']

export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong'

export const FACE_SHAPES: FaceShape[] = ['oval', 'round', 'square', 'heart', 'diamond', 'oblong']

export type MetalTone = 'gold' | 'silver' | 'mixed' | 'none'

export type ItemStatus = 'owned' | 'wishlist'

export interface Item {
  id: string
  name: string
  category: Category
  subcategory?: string
  /** color keys, e.g. 'indigo', 'white' — see data/config/colors.json */
  colors: string[]
  material?: string
  fit?: Fit
  /** 1 = very casual ... 5 = formal */
  formality: number
  seasons: Season[]
  styleTags: StyleTag[]
  status: ItemStatus
  imageUrl?: string
  /** relevant to accessories like sunglasses, jewelry, watches */
  metalTone?: MetalTone
  notes?: string
  createdAt: number
}

export interface RuleFlag {
  rule: string
  severity: 'positive' | 'warning'
  message: string
}

export interface Outfit {
  id: string
  itemIds: string[]
  look?: StyleTag
  occasion?: string
  season?: Season
  explanation: string
  score: number
  flags: RuleFlag[]
}

export interface Profile {
  likedStyles: StyleTag[]
  likedColors: string[]
  dislikedColors: string[]
  budgetMin: number | null
  budgetMax: number | null
  faceShape: FaceShape | null
  fitPreference: Fit | null
  onboarded: boolean
}

export const DEFAULT_PROFILE: Profile = {
  likedStyles: [],
  likedColors: [],
  dislikedColors: [],
  budgetMin: null,
  budgetMax: null,
  faceShape: null,
  fitPreference: null,
  onboarded: false,
}

export interface Occasion {
  id: string
  label: string
  /** formality band this occasion expects, inclusive */
  formalityRange: [number, number]
  seasons?: Season[]
  description: string
}
