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

// The strategy's recommended exposure (0..1) right now, on the eszköz's full
// available live history — this is the actual "what would it do" signal, not
// a backtest. Nem befektetési tanács: csak a szabály mechanikus kimenete.
export function computeSignal(strategyId: StrategyId, assetSymbol: AssetSymbol, riskLevel: RiskLevel, market: MarketState): Signal {
  const history = market.histories[assetSymbol];
  const fraction = STRATEGIES[strategyId].targetFraction(history, riskLevel);
  const tone = toneFromFraction(fraction);
  return { fraction, tone, label: TONE_LABEL[tone] };
}
