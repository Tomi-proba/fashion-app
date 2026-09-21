import type { StyleTag } from '../data/types'
import { COLOR_BY_KEY, STYLE_DEFS } from '../data/configAccess'
import ColorSwatch from './ColorSwatch'

/**
 * Wardrobe-free suggestion: a generic outfit formula + palette for a look, so picking
 * "smart casual" gives you something immediately instead of requiring a full closet first.
 */
export default function StyleSuggestionCard({ look }: { look: StyleTag }) {
  const def = STYLE_DEFS[look]
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Suggested for {def.label}</p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{def.archetype}</p>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Suggested colors</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {def.suggestedColors.map((key) =>
            COLOR_BY_KEY[key] ? (
              <div key={key} className="flex flex-col items-center gap-1">
                <ColorSwatch color={COLOR_BY_KEY[key]} selected={false} />
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{COLOR_BY_KEY[key].label}</span>
              </div>
            ) : null,
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        This is a generic formula for the look, not built from your wardrobe — add items and hit "Generate
        outfits" below to get outfits from pieces you actually own.
      </p>
    </div>
  )
}
