import type { RuleFlag } from '../data/types'

export interface RuleResult {
  score: number
  flags: RuleFlag[]
}
