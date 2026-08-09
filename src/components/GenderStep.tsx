import type { Gender } from '../data/types'

export default function GenderStep({ onSelect }: { onSelect: (g: Gender) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Welcome to Fitcheck</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Whose styles would you like to explore today?
        </p>
      </div>
      <div className="grid w-full max-w-md grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('feminine')}
          className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-rose-700"
        >
          <span className="text-4xl">👗</span>
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Feminine</span>
        </button>
        <button
          onClick={() => onSelect('masculine')}
          className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-neutral-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-sky-700"
        >
          <span className="text-4xl">🧥</span>
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Masculine</span>
        </button>
      </div>
    </div>
  )
}
