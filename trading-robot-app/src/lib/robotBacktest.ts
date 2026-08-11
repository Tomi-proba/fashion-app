import type { AssetSymbol, MarketState, RiskLevel, StrategyId } from '../types';
import { computeStats, simulatePortfolio } from './portfolio';

const BACKTEST_BASE_VALUE = 1000;

// A (strategy, eszköz, kockázat) kombináció "track record"-ja: lefuttatja a
// stratégiát a piac eddig összegyűjtött, valós adatfolyamán. Ez egy visszateszt
// egy valós, de rövid (munkamenet-hosszúságú) idősoron — nem valós, hosszú távú
// kereskedési eredmény, a UI-nak ezt mindig jeleznie kell.
export function backtestCombo(strategyId: StrategyId, assetSymbol: AssetSymbol, riskLevel: RiskLevel, market: MarketState) {
  const history = market.histories[assetSymbol];
  const { equity } = simulatePortfolio(history, strategyId, riskLevel, BACKTEST_BASE_VALUE);
  const stats = computeStats(equity, BACKTEST_BASE_VALUE);
  return { equity, stats };
}
