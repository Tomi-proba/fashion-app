import { DEFAULT_PROFILE, type Item, type Outfit, type Profile } from '../data/types'

const KEYS = {
  wardrobe: 'outfitter:wardrobe',
  profile: 'outfitter:profile',
  savedOutfits: 'outfitter:savedOutfits',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently, app still works in-memory for the session
  }
}

export function getWardrobe(): Item[] {
  return read<Item[]>(KEYS.wardrobe, [])
}

export function setWardrobe(items: Item[]): void {
  write(KEYS.wardrobe, items)
}

export function getProfile(): Profile {
  return read<Profile>(KEYS.profile, DEFAULT_PROFILE)
}

export function setProfile(profile: Profile): void {
  write(KEYS.profile, profile)
}

export function getSavedOutfits(): Outfit[] {
  return read<Outfit[]>(KEYS.savedOutfits, [])
}

export function setSavedOutfits(outfits: Outfit[]): void {
  write(KEYS.savedOutfits, outfits)
}
