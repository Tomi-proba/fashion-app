import type { AssetDef, AssetSymbol, MarketState } from '../types';

export const ASSETS: AssetDef[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
];

// Keep at most this many recent trade points per symbol so localStorage and
// moving-average windows stay bounded during a long-running session. Nothing
// anchors to an absolute index anymore (no purchases to track), so trimming
// from the front is safe on its own.
const MAX_HISTORY_LENGTH = 3000;

export function createInitialMarket(): MarketState {
  const histories = {} as Record<AssetSymbol, number[]>;
  const lastTradeAt = {} as Record<AssetSymbol, number | null>;
  for (const asset of ASSETS) {
    histories[asset.symbol] = [];
    lastTradeAt[asset.symbol] = null;
  }
  return { histories, lastTradeAt, connectionStatus: 'connecting', connectionError: null };
}

export function appendTick(market: MarketState, symbol: AssetSymbol, price: number, atMs: number): MarketState {
  const histories = { ...market.histories };
  const lastTradeAt = { ...market.lastTradeAt, [symbol]: atMs };

  const series = [...histories[symbol], price];
  if (series.length > MAX_HISTORY_LENGTH) {
    series.splice(0, series.length - MAX_HISTORY_LENGTH);
  }
  histories[symbol] = series;

  return { ...market, histories, lastTradeAt };
}
