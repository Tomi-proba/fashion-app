import type { ColorDef } from '../data/configAccess'

export default function ColorSwatch({
  color,
  selected,
  onClick,
  size = 'md',
}: {
  color: ColorDef
  selected: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'h-5 w-5' : 'h-8 w-8'
  return (
    <button
      type="button"
      onClick={onClick}
      title={color.label}
      aria-label={color.label}
      disabled={!onClick}
      className={`${dim} shrink-0 rounded-full border-2 transition-transform ${
        selected
          ? 'scale-110 border-neutral-900 ring-2 ring-offset-2 ring-neutral-900 dark:border-neutral-100 dark:ring-neutral-100 dark:ring-offset-neutral-950'
          : 'border-white/60 dark:border-black/40'
      } ${onClick ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
      style={{ backgroundColor: color.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}
    />
  )
}
