import { useState } from 'react'
import { FACE_SHAPES, FITS, STYLE_TAGS, type FaceShape, type Fit, type Profile, type StyleTag } from '../data/types'
import { PALETTE, STYLE_DEFS } from '../data/configAccess'
import Chip from '../components/Chip'
import ColorSwatch from '../components/ColorSwatch'

export default function Onboarding({ initial, onSave }: { initial: Profile; onSave: (profile: Profile) => void }) {
  const [likedStyles, setLikedStyles] = useState<StyleTag[]>(initial.likedStyles)
  const [likedColors, setLikedColors] = useState<string[]>(initial.likedColors)
  const [dislikedColors, setDislikedColors] = useState<string[]>(initial.dislikedColors)
  const [budgetMin, setBudgetMin] = useState(initial.budgetMin?.toString() ?? '')
  const [budgetMax, setBudgetMax] = useState(initial.budgetMax?.toString() ?? '')
  const [faceShape, setFaceShape] = useState<FaceShape | ''>(initial.faceShape ?? '')
  const [fitPreference, setFitPreference] = useState<Fit | ''>(initial.fitPreference ?? '')

  function toggleStyle(tag: StyleTag) {
    setLikedStyles((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function toggleLiked(key: string) {
    setLikedColors((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]))
    setDislikedColors((prev) => prev.filter((c) => c !== key))
  }

  function toggleDisliked(key: string) {
    setDislikedColors((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]))
    setLikedColors((prev) => prev.filter((c) => c !== key))
  }

  function handleSave() {
    onSave({
      likedStyles,
      likedColors,
      dislikedColors,
      budgetMin: budgetMin ? Number(budgetMin) : null,
      budgetMax: budgetMax ? Number(budgetMax) : null,
      faceShape: faceShape || null,
      fitPreference: fitPreference || null,
      onboarded: true,
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">Quick profile</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Tunes outfit suggestions. Nothing here is required — skip anything you're unsure of, and change it later from
        the Profile button.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Styles you gravitate to</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {STYLE_TAGS.map((tag) => (
            <Chip key={tag} label={STYLE_DEFS[tag].label} selected={likedStyles.includes(tag)} onClick={() => toggleStyle(tag)} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Colors you like</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <ColorSwatch key={c.key} color={c} selected={likedColors.includes(c.key)} onClick={() => toggleLiked(c.key)} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Colors to avoid</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <ColorSwatch key={c.key} color={c} selected={dislikedColors.includes(c.key)} onClick={() => toggleDisliked(c.key)} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Budget min</span>
          <input
            type="number"
            min={0}
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            placeholder="$"
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Budget max</span>
          <input
            type="number"
            min={0}
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            placeholder="$"
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
          />
        </label>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Face shape (optional)</span>
          <select
            value={faceShape}
            onChange={(e) => setFaceShape(e.target.value as FaceShape | '')}
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Skip</option>
            {FACE_SHAPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Fit preference (optional)</span>
          <select
            value={fitPreference}
            onChange={(e) => setFitPreference(e.target.value as Fit | '')}
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Skip</option>
            {FITS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
      </section>

      <button
        onClick={handleSave}
        className="mt-10 w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        Save profile
      </button>
    </div>
  )
}
