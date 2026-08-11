import type { AssetDef, AssetSymbol, MarketState } from '../types';
import { nextGaussian } from './rng';

export const ASSETS: AssetDef[] = [
  { symbol: 'DEMO-TECH', name: 'Demo Tech Kosár', startPrice: 100, driftAnnual: 0.12, volAnnual: 0.35 },
  { symbol: 'DEMO-GOLD', name: 'Demo Arany Index', startPrice: 100, driftAnnual: 0.04, volAnnual: 0.12 },
  { symbol: 'DEMO-CRYPTO', name: 'Demo Kripto Kosár', startPrice: 100, driftAnnual: 0.2, volAnnual: 0.7 },
  { symbol: 'DEMO-ENERGY', name: 'Demo Energia Index', startPrice: 100, driftAnnual: 0.06, volAnnual: 0.25 },
];

const DT = 1 / 252;

export function createInitialMarket(seed: number): MarketState {
  const histories = {} as Record<AssetSymbol, number[]>;
  for (const asset of ASSETS) {
    histories[asset.symbol] = [asset.startPrice];
  }
  return { rngState: seed >>> 0, t: 0, histories };
}

export function advanceMarket(market: MarketState, steps: number): MarketState {
  let rngState = market.rngState;
  const histories = { ...market.histories };
  for (const asset of ASSETS) {
    histories[asset.symbol] = [...histories[asset.symbol]];
  }

  for (let step = 0; step < steps; step++) {
    for (const asset of ASSETS) {
      const g = nextGaussian(rngState);
      rngState = g.nextState;
      const series = histories[asset.symbol];
      const last = series[series.length - 1];
      const price = last * Math.exp(
        (asset.driftAnnual - 0.5 * asset.volAnnual ** 2) * DT + asset.volAnnual * Math.sqrt(DT) * g.value,
      );
      series.push(Math.max(price, 0.01));
    }
  }

  return { rngState, t: market.t + steps, histories };
}
