import type { PortfolioResult, RiskLevel, StrategyId, Trade } from '../types';
import { STRATEGIES } from './strategies';

const FEE_RATE = 0.0015; // 0.15% per trade, same as a typical retail broker fee
const REBALANCE_BAND = 0.05; // ignore tiny signal changes to avoid fee-eating churn

// Replays a strategy over a price history starting from a cash-only position.
// Used both for the marketplace "backtest" preview and for tracking a
// currently-owned robot's live simulated value.
export function simulatePortfolio(priceHistory: number[], strategyId: StrategyId, risk: RiskLevel, startValue: number): PortfolioResult {
  const strategy = STRATEGIES[strategyId];
  let cash = startValue;
  let units = 0;
  const equity: number[] = [];
  const trades: Trade[] = [];

  for (let i = 0; i < priceHistory.length; i++) {
    const price = priceHistory[i];
    const currentValue = cash + units * price;
    const history = priceHistory.slice(0, i + 1);
    const targetFraction = strategy.targetFraction(history, risk);
    const currentFraction = currentValue > 0 ? (units * price) / currentValue : 0;

    if (currentValue > 0 && Math.abs(targetFraction - currentFraction) > REBALANCE_BAND) {
      const deltaValue = targetFraction * currentValue - units * price;
      if (deltaValue > 0) {
        const fee = deltaValue * FEE_RATE;
        const buyValue = Math.min(deltaValue, Math.max(cash - fee, 0));
        if (buyValue > 0) {
          units += buyValue / price;
          cash -= buyValue + buyValue * FEE_RATE;
          trades.push({ index: i, type: 'buy', fraction: targetFraction });
        }
      } else if (deltaValue < 0) {
        const sellUnits = Math.min(-deltaValue / price, units);
        if (sellUnits > 0) {
          const proceeds = sellUnits * price;
          cash += proceeds - proceeds * FEE_RATE;
          units -= sellUnits;
          trades.push({ index: i, type: 'sell', fraction: targetFraction });
        }
      }
    }

    equity.push(cash + units * price);
  }

  return { equity, trades };
}

export interface PortfolioStats {
  currentValue: number;
  roiPct: number;
  maxDrawdownPct: number;
  volatilityPct: number;
  tradeCount: number;
}

export function computeStats(equity: number[], startValue: number): PortfolioStats {
  if (equity.length === 0) {
    return { currentValue: startValue, roiPct: 0, maxDrawdownPct: 0, volatilityPct: 0, tradeCount: 0 };
  }
  const currentValue = equity[equity.length - 1];
  const roiPct = ((currentValue - startValue) / startValue) * 100;

  let peak = equity[0];
  let maxDrawdown = 0;
  for (const v of equity) {
    if (v > peak) peak = v;
    const drawdown = (peak - v) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  const returns: number[] = [];
  for (let i = 1; i < equity.length; i++) {
    if (equity[i - 1] > 0) returns.push((equity[i] - equity[i - 1]) / equity[i - 1]);
  }
  const meanReturn = returns.length ? returns.reduce((s, r) => s + r, 0) / returns.length : 0;
  const variance = returns.length
    ? returns.reduce((s, r) => s + (r - meanReturn) ** 2, 0) / returns.length
    : 0;
  const volatilityPct = Math.sqrt(variance) * Math.sqrt(252) * 100;

  return { currentValue, roiPct, maxDrawdownPct: maxDrawdown * 100, volatilityPct, tradeCount: 0 };
}
