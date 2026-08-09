import type { StyleProfile } from './types'

export const styles: StyleProfile[] = [
  { id: 'minimalist', label: 'Minimalist', icon: '◽', blurb: 'Clean lines, neutral palette' },
  { id: 'classic', label: 'Classic & Preppy', icon: '🎽', blurb: 'Timeless, tailored basics' },
  { id: 'streetwear', label: 'Streetwear', icon: '👟', blurb: 'Bold, casual, sneaker-led' },
  { id: 'romantic', label: 'Romantic', icon: '🌸', blurb: 'Soft fabrics, feminine details' },
  { id: 'edgy', label: 'Edgy', icon: '⚡', blurb: 'Leather, dark tones, sharp' },
  { id: 'boho', label: 'Boho', icon: '🌾', blurb: 'Free-spirited, textured, earthy' },
  { id: 'glam', label: 'Glam', icon: '✨', blurb: 'Statement pieces, shine' },
  { id: 'sporty', label: 'Sporty', icon: '🏃', blurb: 'Athletic-inspired, easy movement' },
]

export const styleById = (id: string) => styles.find((s) => s.id === id)
