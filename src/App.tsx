import { useMemo, useState } from 'react'
import type { ClothingItem, Gender, Outfit } from './data/types'
import { occasionById, occasions } from './data/occasions'
import { styleById } from './data/styles'
import GenderStep from './components/GenderStep'
import OccasionStep from './components/OccasionStep'
import StyleStep from './components/StyleStep'
import OutfitDeck from './components/OutfitDeck'
import Breadcrumb from './components/Breadcrumb'
import SavedPanel from './components/SavedPanel'
import { outfitsForFavoriteItem, outfitsForStyle, sortByScoreDesc } from './lib/suggest'

type Step = 'gender' | 'occasion' | 'style' | 'deck'

export default function App() {
  const [step, setStep] = useState<Step>('gender')
  const [gender, setGender] = useState<Gender | null>(null)
  const [occasionId, setOccasionId] = useState<string | null>(null)
  const [styleId, setStyleId] = useState<string | null>(null)
  const [favoriteItem, setFavoriteItem] = useState<ClothingItem | null>(null)
  const [saved, setSaved] = useState<Outfit[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [deckKey, setDeckKey] = useState(0)

  const occasion = occasionId ? occasionById(occasionId) : undefined

  const deckOutfits = useMemo(() => {
    if (!gender || !occasion) return []
    const base = favoriteItem
      ? outfitsForFavoriteItem(gender, favoriteItem)
      : styleId
        ? outfitsForStyle(gender, styleId)
        : []
    return sortByScoreDesc(base, occasion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, occasion, styleId, favoriteItem, deckKey])

  function reset() {
    setStep('gender')
    setGender(null)
    setOccasionId(null)
    setStyleId(null)
    setFavoriteItem(null)
  }

  function goToStyleStep() {
    setStyleId(null)
    setFavoriteItem(null)
    setStep('style')
  }

  const crumbs: { label: string; onClick?: () => void }[] = []
  if (gender) {
    crumbs.push({
      label: gender === 'feminine' ? 'Feminine' : 'Masculine',
      onClick: () => setStep('gender'),
    })
  }
  if (occasion) {
    crumbs.push({ label: occasion.label, onClick: () => setStep('occasion') })
  }
  if (styleId) {
    crumbs.push({ label: styleById(styleId)?.label ?? styleId, onClick: () => setStep('style') })
  } else if (favoriteItem) {
    crumbs.push({ label: `"${favoriteItem.name}"`, onClick: () => setStep('style') })
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-4xl flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 dark:border-neutral-800">
        <button onClick={reset} className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100">
          Fitcheck
        </button>
        {gender && (
          <button
            onClick={() => setShowSaved(true)}
            className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <span>♥</span> {saved.length}
          </button>
        )}
      </header>

      {step !== 'gender' && crumbs.length > 0 && <Breadcrumb crumbs={crumbs} />}

      {step === 'gender' && (
        <GenderStep
          onSelect={(g) => {
            setGender(g)
            setStep('occasion')
          }}
        />
      )}

      {step === 'occasion' && (
        <OccasionStep
          onSelect={(id) => {
            setOccasionId(id)
            setStep('style')
          }}
        />
      )}

      {step === 'style' && gender && (
        <StyleStep
          gender={gender}
          onStyleSelect={(id) => {
            setStyleId(id)
            setFavoriteItem(null)
            setDeckKey((k) => k + 1)
            setStep('deck')
          }}
          onFavoriteItemSelect={(item) => {
            setFavoriteItem(item)
            setStyleId(null)
            setDeckKey((k) => k + 1)
            setStep('deck')
          }}
        />
      )}

      {step === 'deck' && gender && occasion && (
        <div className="flex flex-1 flex-col gap-4 px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Showing fits for <strong className="text-neutral-800 dark:text-neutral-200">{occasion.label}</strong>
              {favoriteItem ? (
                <>
                  {' '}
                  built around <strong className="text-neutral-800 dark:text-neutral-200">{favoriteItem.name}</strong>
                </>
              ) : (
                <>
                  {' '}
                  in{' '}
                  <strong className="text-neutral-800 dark:text-neutral-200">
                    {styleById(styleId ?? '')?.label}
                  </strong>
                </>
              )}
            </p>
            <button
              onClick={goToStyleStep}
              className="shrink-0 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Change style
            </button>
          </div>
          <div className="flex min-h-[520px] flex-1 flex-col">
            <OutfitDeck
              key={deckKey}
              outfits={deckOutfits}
              occasion={occasion}
              pinnedItem={favoriteItem}
              onLike={(o) => setSaved((prev) => (prev.some((p) => p.id === o.id) ? prev : [...prev, o]))}
              onSkip={() => {}}
            />
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setDeckKey((k) => k + 1)}
              className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Start deck over
            </button>
            <button
              onClick={() => setStep('occasion')}
              className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Change occasion
            </button>
          </div>
        </div>
      )}

      {showSaved && occasion && (
        <SavedPanel
          saved={saved}
          occasion={occasion}
          onClose={() => setShowSaved(false)}
          onRemove={(o) => setSaved((prev) => prev.filter((p) => p.id !== o.id))}
        />
      )}

      <footer className="border-t border-neutral-100 px-5 py-3 text-center text-xs text-neutral-400 dark:border-neutral-800">
        Sample catalog for demo purposes — prices, SKUs and stock are illustrative. &ldquo;Shop&rdquo; opens a
        web search for the item at the listed retailer. {occasions.length} occasions supported.
      </footer>
    </div>
  )
}
