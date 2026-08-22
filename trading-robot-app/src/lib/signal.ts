import { STRATEGIES } from './strategies';
import type { AssetSymbol, MarketState, RiskLevel, StrategyId } from '../types';

export type SignalTone = 'strong-buy' | 'buy' | 'hold' | 'sell' | 'strong-sell';

export interface Signal {
  fraction: number;
  tone: SignalTone;
  label: string;
}

const TONE_LABEL: Record<SignalTone, string> = {
  'strong-buy': 'Erős vétel',
  buy: 'Vétel',
  hold: 'Tartás',
  sell: 'Eladás',
  'strong-sell': 'Erős eladás',
};

function toneFromFraction(fraction: number): SignalTone {
  if (fraction >= 0.75) return 'strong-buy';
  if (fraction >= 0.6) return 'buy';
  if (fraction >= 0.4) return 'hold';
  if (fraction >= 0.25) return 'sell';
  return 'strong-sell';
}

// How many trailing points to smooth over, and how much weight the newest one
// gets (EMA). A z-score-style strategy (like mean-reversion) is scale-invariant
// to noise in the underlying price — averaging the price itself barely helps,
// because both the deviation and the window's own stdev shrink together. What
// actually stops the recommendation flapping bucket-to-bucket is smoothing the
// *signal* over a short run of recent evaluations, so one noisy tick can't flip
// the label on its own.
const SMOOTH_WINDOW = 15;
const EMA_ALPHA = 0.22;

// The strategy's recommended exposure (0..1) right now, smoothed over the last
// few points of the eszköz's live history — this is the actual "what would it
// do" signal, not a backtest. Nem befektetési tanács: csak a szabály mechanikus
// (időben simított) kimenete.
export function computeSignal(strategyId: StrategyId, assetSymbol: AssetSymbol, riskLevel: RiskLevel, market: MarketState): Signal {
  const history = market.histories[assetSymbol];
  const strategy = STRATEGIES[strategyId];

  const start = Math.max(0, history.length - SMOOTH_WINDOW);
  let smoothed = 0.5;
  let first = true;
  for (let i = start; i < history.length; i++) {
    const raw = strategy.targetFraction(history.slice(0, i + 1), riskLevel);
    smoothed = first ? raw : EMA_ALPHA * raw + (1 - EMA_ALPHA) * smoothed;
    first = false;
  }

  const tone = toneFromFraction(smoothed);
  return { fraction: smoothed, tone, label: TONE_LABEL[tone] };
}
