import { CLASHING_PAIRS, COLOR_BY_KEY, GOOD_ACCENT_PAIRS, METAL_PAIRINGS, PALETTE } from '../data/configAccess'
import ColorSwatch from '../components/ColorSwatch'

export default function ColorCombos() {
  const neutrals = PALETTE.filter((c) => c.neutral)
  const accents = PALETTE.filter((c) => !c.neutral)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">Color combos</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        The pairing rules the outfit generator uses. Opinionated — swatches, not gospel.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Neutral base</h2>
        <p className="mt-1 text-xs text-neutral-400">Build outfits on these — they pair with almost anything.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {neutrals.map((c) => (
            <div key={c.key} className="flex flex-col items-center gap-1">
              <ColorSwatch color={c} selected={false} />
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">One accent color at a time</h2>
        <p className="mt-1 text-xs text-neutral-400">Each accent below, paired with the neutrals it reads best against.</p>
        <div className="mt-3 space-y-3">
          {accents.map((accent) => {
            const good = GOOD_ACCENT_PAIRS[accent.key] ?? []
            return (
              <div key={accent.key} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800">
                <ColorSwatch color={accent} selected={false} />
                <span className="w-20 shrink-0 text-sm font-medium text-neutral-700 dark:text-neutral-300">{accent.label}</span>
                <span className="text-neutral-300 dark:text-neutral-700">→</span>
                <div className="flex flex-wrap gap-1.5">
                  {good.map((key) => (COLOR_BY_KEY[key] ? <ColorSwatch key={key} color={COLOR_BY_KEY[key]} selected={false} size="sm" /> : null))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Combos to avoid</h2>
        <p className="mt-1 text-xs text-neutral-400">Two accent colors flagged as a clash when worn together without a dominant neutral.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {CLASHING_PAIRS.map(([a, b], idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-xl border border-neutral-100 px-3 py-2 dark:border-neutral-800">
              {COLOR_BY_KEY[a] && <ColorSwatch color={COLOR_BY_KEY[a]} selected={false} size="sm" />}
              <span className="text-neutral-300 dark:text-neutral-700">×</span>
              {COLOR_BY_KEY[b] && <ColorSwatch color={COLOR_BY_KEY[b]} selected={false} size="sm" />}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Accessory metal tones</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-100 p-4 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Gold</p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Reads warmest with {METAL_PAIRINGS.gold.prefersTemperature} tones — leans {METAL_PAIRINGS.gold.styleLean.join(', ')}.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-100 p-4 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Silver</p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Reads best with {METAL_PAIRINGS.silver.prefersTemperature} tones — leans {METAL_PAIRINGS.silver.styleLean.join(', ')}.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
