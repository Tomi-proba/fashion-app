import type { Category } from '../data/types'

interface Props {
  category: Category
  color: string
  className?: string
}

function shapeFor(category: Category) {
  switch (category) {
    case 'top':
      return (
        <path d="M35 8 L20 2 L2 14 L8 26 L18 20 V60 H62 V20 L72 26 L78 14 L60 2 Z" />
      )
    case 'bottom':
      return <path d="M14 4 H66 V16 L58 78 H44 L40 30 L36 78 H22 L14 16 Z" />
    case 'dress':
      return (
        <path d="M30 4 L20 2 L14 16 L22 22 L16 78 H64 L58 22 L66 16 L60 2 L50 4 L45 10 Z" />
      )
    case 'outerwear':
      return (
        <path d="M32 8 L18 2 L0 16 L8 30 L18 22 V72 H62 V22 L72 30 L80 16 L62 2 L48 8 L40 14 Z" />
      )
    case 'shoes':
      return (
        <path d="M6 46 C6 34 14 26 26 26 H46 L64 40 C72 44 76 46 76 54 C76 60 70 62 62 62 H10 C6 62 4 58 6 46 Z" />
      )
    case 'bag':
      return (
        <>
          <path d="M8 26 H62 L58 74 H12 Z" />
          <path
            d="M20 26 V16 C20 8 26 2 35 2 C44 2 50 8 50 16 V26"
            fill="none"
            strokeWidth="5"
          />
        </>
      )
    case 'accessory':
      return (
        <>
          <circle cx="35" cy="35" r="24" fill="none" strokeWidth="7" />
          <circle cx="35" cy="35" r="7" />
        </>
      )
  }
}

export default function GarmentIcon({ category, color, className }: Props) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill={color}
      stroke={color}
      aria-hidden="true"
    >
      {shapeFor(category)}
    </svg>
  )
}
