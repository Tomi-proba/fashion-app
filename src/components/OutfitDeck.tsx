import { useMemo, useState } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import type { ClothingItem, Outfit, OccasionProfile } from '../data/types'
import { scoreOutfit } from '../lib/scoring'
import OutfitCard from './OutfitCard'

interface Props {
  outfits: Outfit[]
  occasion: OccasionProfile
  pinnedItem?: ClothingItem | null
  onLike: (outfit: Outfit) => void
  onSkip: (outfit: Outfit) => void
}

function SwipeCard({
  outfit,
  occasion,
  pinnedItem,
  onDecide,
  isTop,
  index,
}: {
  outfit: Outfit
  occasion: OccasionProfile
  pinnedItem?: ClothingItem | null
  onDecide: (dir: 'like' | 'skip') => void
  isTop: boolean
  index: number
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-12, 12])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const skipOpacity = useTransform(x, [-120, -20], [1, 0])
  const result = useMemo(() => scoreOutfit(outfit, occasion), [outfit, occasion])

  return (
    <motion.div
      className="absolute inset-0"
      style={
        isTop
          ? { x, rotate }
          : { scale: 1 - Math.min(index, 2) * 0.04, y: Math.min(index, 2) * 12, opacity: index > 2 ? 0 : 1 }
      }
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onDecide('like')
        else if (info.offset.x < -120) onDecide('skip')
      }}
      initial={isTop ? undefined : false}
      animate={isTop ? undefined : { scale: 1 - Math.min(index, 2) * 0.04, y: Math.min(index, 2) * 12 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {isTop && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="pointer-events-none absolute left-6 top-6 z-10 -rotate-12 rounded-lg border-4 border-emerald-500 px-3 py-1 text-xl font-black text-emerald-500"
          >
            LOVE IT
          </motion.div>
          <motion.div
            style={{ opacity: skipOpacity }}
            className="pointer-events-none absolute right-6 top-6 z-10 rotate-12 rounded-lg border-4 border-rose-500 px-3 py-1 text-xl font-black text-rose-500"
          >
            NOT THIS
          </motion.div>
        </>
      )}
      <OutfitCard
        outfit={outfit}
        result={result}
        pinnedItem={pinnedItem}
        className={isTop ? 'cursor-grab active:cursor-grabbing' : ''}
      />
    </motion.div>
  )
}

export default function OutfitDeck({ outfits, occasion, pinnedItem, onLike, onSkip }: Props) {
  const [cursor, setCursor] = useState(0)
  const visible = outfits.slice(cursor, cursor + 3)
  const current = outfits[cursor]

  function decide(dir: 'like' | 'skip') {
    if (!current) return
    if (dir === 'like') onLike(current)
    else onSkip(current)
    setCursor((c) => c + 1)
  }

  if (!current) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
        <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
          You've seen every fit we've got for this combo.
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Try a different style or occasion to see more suggestions.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="relative min-h-0 flex-1">
        <AnimatePresence>
          {visible
            .map((outfit, i) => (
              <SwipeCard
                key={outfit.id}
                outfit={outfit}
                occasion={occasion}
                pinnedItem={pinnedItem}
                isTop={i === 0}
                index={i}
                onDecide={decide}
              />
            ))
            .reverse()}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => decide('skip')}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-rose-300 bg-white text-2xl text-rose-500 shadow-md transition hover:scale-105 hover:bg-rose-50 dark:border-rose-800 dark:bg-neutral-900 dark:hover:bg-rose-950"
          aria-label="Not this"
        >
          ✕
        </button>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {cursor + 1} / {outfits.length}
        </span>
        <button
          onClick={() => decide('like')}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-300 bg-white text-2xl text-emerald-500 shadow-md transition hover:scale-105 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-neutral-900 dark:hover:bg-emerald-950"
          aria-label="Love it"
        >
          ♥
        </button>
      </div>
    </div>
  )
}
