import type { Outfit, OccasionProfile, ScoreResult } from '../data/types'

const FORMALITY_LABELS = ['', 'very casual', 'casual', 'business casual', 'formal', 'black tie']

function flashinessReason(occasion: OccasionProfile, excess: number): string {
  const strong = excess >= 3
  switch (occasion.id) {
    case 'funeral':
      return `Too flashy for a funeral — sequins, shine, or bold color read as celebratory, not somber.`
    case 'interview':
      return `Too attention-grabbing for a job interview — the focus should stay on you, not the outfit.`
    case 'office':
      return `A bit loud for the office — save the statement pieces for after-hours.`
    case 'wedding-guest':
      return `Risks upstaging the couple — ${strong ? 'tone down the sparkle and bold color' : 'dial back the shine slightly'} for a wedding.`
    default:
      return `${strong ? 'Much f' : 'F'}lashier than ${occasion.label.toLowerCase()} typically calls for.`
  }
}

function formalityTooLowReason(occasion: OccasionProfile): string {
  switch (occasion.id) {
    case 'funeral':
      return `Too casual for a funeral — this occasion calls for understated, formal dressing.`
    case 'interview':
      return `Too casual for a job interview — aim for polished, tailored pieces to read as professional.`
    case 'gala':
      return `Not formal enough for a black-tie gala — this calls for full formalwear.`
    default:
      return `A bit too casual for ${occasion.label.toLowerCase()} — consider dressing it up.`
  }
}

function formalityTooHighReason(occasion: OccasionProfile): string {
  return `More formal than ${occasion.label.toLowerCase()} calls for — you may feel overdressed.`
}

function coverageReason(occasion: OccasionProfile): string {
  switch (occasion.id) {
    case 'funeral':
      return `Shows more skin than is respectful for a funeral or memorial service.`
    case 'interview':
    case 'office':
      return `Shows more skin than is typically appropriate for a professional setting.`
    default:
      return `A little too revealing for ${occasion.label.toLowerCase()}.`
  }
}

export function scoreOutfit(outfit: Outfit, occasion: OccasionProfile): ScoreResult {
  let score = 10
  const reasons: string[] = []

  const [minF, maxF] = occasion.formality
  if (outfit.formality < minF) {
    const gap = minF - outfit.formality
    score -= gap * 1.75
    reasons.push(formalityTooLowReason(occasion))
  } else if (outfit.formality > maxF) {
    const gap = outfit.formality - maxF
    score -= gap * 1.25
    reasons.push(formalityTooHighReason(occasion))
  }

  if (outfit.flashiness > occasion.maxFlashiness) {
    const excess = outfit.flashiness - occasion.maxFlashiness
    score -= excess * 1.75
    reasons.push(flashinessReason(occasion, excess))
  }

  if (outfit.coverage < occasion.minCoverage) {
    const deficit = occasion.minCoverage - outfit.coverage
    score -= deficit * 1.5
    reasons.push(coverageReason(occasion))
  }

  score = Math.max(0, Math.min(10, Math.round(score * 10) / 10))

  let verdict: ScoreResult['verdict']
  if (score >= 8.5) verdict = 'great'
  else if (score >= 7) verdict = 'good'
  else if (score >= 5) verdict = 'risky'
  else verdict = 'poor'

  if (reasons.length === 0) {
    reasons.push(
      `Formality reads as ${FORMALITY_LABELS[outfit.formality]}, right in line with what ${occasion.label.toLowerCase()} calls for.`,
    )
  }

  return { score, verdict, reasons }
}
