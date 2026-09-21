import { useState } from 'react'
import { SEASONS, STYLE_TAGS, type Category, type MetalTone, type Profile } from '../data/types'
import { CATEGORY_OPTIONS, isAccessoryCategory } from '../data/categories'
import { COLOR_BY_KEY, PALETTE, STYLE_DEFS } from '../data/configAccess'
import { classifyFromText, type ClassifiedGuess } from '../lib/classifyFromText'
import { suggestOutfitFromAnchor, type SuggestedOutfit } from '../lib/suggestFromAnchor'
import Chip from '../components/Chip'
import ColorSwatch from '../components/ColorSwatch'

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function LinkBuilder({ profile }: { profile: Profile }) {
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [guess, setGuess] = useState<ClassifiedGuess | null>(null)
  const [suggestion, setSuggestion] = useState<SuggestedOutfit | null>(null)

  function handleAnalyze() {
    const combined = `${link} ${description}`.trim()
    if (!combined) return
    setGuess(classifyFromText(combined))
    setSuggestion(null)
  }

  function handleSuggest() {
    if (!guess) return
    setSuggestion(suggestOutfitFromAnchor(guess, profile.dislikedColors))
  }

  function updateGuess<K extends keyof ClassifiedGuess>(key: K, value: ClassifiedGuess[K]) {
    setGuess((prev) => (prev ? { ...prev, [key]: value } : prev))
    setSuggestion(null)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">Build around a link</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Paste a link to a statement piece you like, tell us what it is, and get a suggested outfit built around it —
        not from your wardrobe. Category/colour/style are guessed for free from keywords (no AI, no fetching the
        page), so double-check the guess below before generating.
      </p>

      <section className="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Link (optional)</span>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://…"
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">What is it?</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. chunky black leather boots, streetwear"
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
          />
        </label>
        <button
          onClick={handleAnalyze}
          disabled={!link.trim() && !description.trim()}
          className="w-full rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-neutral-50 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          Analyze
        </button>
      </section>

      {guess && (
        <section className="mt-6 space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            This reads as — correct anything that's off
          </p>

          <div>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Category</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => (
                <Chip
                  key={c.value}
                  label={c.label}
                  selected={guess.category === c.value}
                  onClick={() => updateGuess('category', c.value as Category)}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Color(s)</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {PALETTE.map((c) => (
                <ColorSwatch
                  key={c.key}
                  color={c}
                  selected={guess.colors.includes(c.key)}
                  onClick={() => updateGuess('colors', toggle(guess.colors, c.key))}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Style</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {STYLE_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={STYLE_DEFS[tag].label}
                  selected={guess.styleTags.includes(tag)}
                  onClick={() => updateGuess('styleTags', toggle(guess.styleTags, tag))}
                />
              ))}
            </div>
            {guess.styleTags.length === 0 && (
              <p className="mt-2 text-xs text-neutral-400">Pick at least one style to generate a suggestion.</p>
            )}
          </div>

          <div>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Formality</span>
            <div className="mt-2 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => updateGuess('formality', n)}
                  className={`h-9 flex-1 rounded-lg border text-sm font-semibold transition-colors ${
                    guess.formality === n
                      ? 'border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Seasons</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  selected={guess.seasons.includes(s)}
                  onClick={() => updateGuess('seasons', toggle(guess.seasons, s))}
                />
              ))}
            </div>
          </div>

          {isAccessoryCategory(guess.category) && (
            <div>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Metal tone</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['none', 'gold', 'silver', 'mixed'] as MetalTone[]).map((m) => (
                  <Chip key={m} label={m} selected={guess.metalTone === m} onClick={() => updateGuess('metalTone', m)} />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSuggest}
            disabled={guess.styleTags.length === 0}
            className="w-full rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-neutral-50 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Suggest outfit
          </button>
        </section>
      )}

      {suggestion && (
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Suggested {STYLE_DEFS[suggestion.primaryStyle].label} outfit
          </p>

          {isSafeHttpUrl(link) && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block truncate text-sm font-medium text-neutral-900 underline dark:text-neutral-100"
            >
              Your piece: {link}
            </a>
          )}

          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{suggestion.explanation}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {suggestion.paletteColors.map((key) =>
              COLOR_BY_KEY[key] ? <ColorSwatch key={key} color={COLOR_BY_KEY[key]} selected={false} size="sm" /> : null,
            )}
          </div>

          <div className="mt-5 space-y-2">
            {suggestion.pieces.map((piece) => (
              <a
                key={piece.slot}
                href={piece.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 px-4 py-3 text-sm hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
              >
                <span className="text-neutral-700 dark:text-neutral-200">
                  {piece.color && COLOR_BY_KEY[piece.color] ? `${COLOR_BY_KEY[piece.color].label} ` : ''}
                  {piece.description}
                </span>
                <span className="shrink-0 text-xs font-semibold text-neutral-400">Search →</span>
              </a>
            ))}
          </div>

          <p className="mt-4 text-xs text-neutral-400">
            Search links open a web search for each description — not real product listings or prices.
          </p>
        </section>
      )}
    </div>
  )
}
