import type { AssetDef, AssetSymbol, MarketState } from '../types';

export const ASSETS: AssetDef[] = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'KO', name: 'Coca-Cola Co.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.' },
];

// Keep at most this many recent trade points per symbol so localStorage and
// moving-average windows stay bounded during a long-running session.
const MAX_HISTORY_LENGTH = 3000;

export function createInitialMarket(): MarketState {
  const histories = {} as Record<AssetSymbol, number[]>;
  const historyOffsets = {} as Record<AssetSymbol, number>;
  const lastTradeAt = {} as Record<AssetSymbol, number | null>;
  for (const asset of ASSETS) {
    histories[asset.symbol] = [];
    historyOffsets[asset.symbol] = 0;
    lastTradeAt[asset.symbol] = null;
  }
  return { histories, historyOffsets, lastTradeAt, connectionStatus: 'no-key', connectionError: null };
}

// Appends a real trade price for a symbol, trimming from the front (and
// bumping the offset) once the cap is hit so absolute indices stay valid.
export function appendTick(market: MarketState, symbol: AssetSymbol, price: number, atMs: number): MarketState {
  const histories = { ...market.histories };
  const historyOffsets = { ...market.historyOffsets };
  const lastTradeAt = { ...market.lastTradeAt, [symbol]: atMs };

  const series = [...histories[symbol], price];
  if (series.length > MAX_HISTORY_LENGTH) {
    const overflow = series.length - MAX_HISTORY_LENGTH;
    series.splice(0, overflow);
    historyOffsets[symbol] = historyOffsets[symbol] + overflow;
  }
  histories[symbol] = series;

  return { ...market, histories, historyOffsets, lastTradeAt };
}

export function absoluteLength(market: MarketState, symbol: AssetSymbol): number {
  return market.historyOffsets[symbol] + market.histories[symbol].length;
}
