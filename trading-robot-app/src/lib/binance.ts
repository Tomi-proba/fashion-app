import type { AssetSymbol } from '../types';

export interface TradeTick {
  symbol: string;
  price: number;
  atMs: number;
}

// Binance's public market-data WebSocket needs no API key or account — it's
// read-only trade/ticker data, the same feed their own web app uses.
export const WS_URL = 'wss://stream.binance.com:9443/ws';

export function subscribeMessage(symbols: AssetSymbol[]): string {
  return JSON.stringify({ method: 'SUBSCRIBE', params: symbols.map((s) => `${s.toLowerCase()}@trade`), id: 1 });
}

// Trade events look like {"e":"trade","s":"BTCUSDT","p":"67023.12","T":1699999999950,...}.
// Subscription acks ({"result":null,"id":1}) and anything else are ignored.
export function parseWsMessage(raw: string): TradeTick[] {
  let msg: unknown;
  try {
    msg = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!msg || typeof msg !== 'object') return [];
  const obj = msg as { e?: unknown; s?: unknown; p?: unknown; T?: unknown };
  if (obj.e !== 'trade') return [];
  if (typeof obj.s !== 'string' || typeof obj.p !== 'string' || typeof obj.T !== 'number') return [];
  const price = Number.parseFloat(obj.p);
  if (!Number.isFinite(price)) return [];
  return [{ symbol: obj.s, price, atMs: obj.T }];
}

export interface TickerResult {
  price: number;
  prevClose: number;
  open: number;
  timestampMs: number;
}

export class BinanceError extends Error {}

export async function fetchTicker(symbol: AssetSymbol): Promise<TickerResult> {
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol)}`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new BinanceError('Nem sikerült elérni a Binance API-t. Ellenőrizd a hálózati kapcsolatot.');
  }
  if (res.status === 429 || res.status === 418) {
    throw new BinanceError('Túl sok kérés a Binance API felé (rate limit). Próbáld később.');
  }
  if (!res.ok) {
    throw new BinanceError(`Binance hiba (${res.status}).`);
  }
  const data = (await res.json()) as { lastPrice?: string; prevClosePrice?: string; openPrice?: string; closeTime?: number };
  const price = Number.parseFloat(data.lastPrice ?? '');
  if (!Number.isFinite(price)) {
    throw new BinanceError(`Nincs elérhető árfolyam ehhez a szimbólumhoz: ${symbol}`);
  }
  const prevClose = Number.parseFloat(data.prevClosePrice ?? '');
  const open = Number.parseFloat(data.openPrice ?? '');
  return {
    price,
    prevClose: Number.isFinite(prevClose) ? prevClose : price,
    open: Number.isFinite(open) ? open : price,
    timestampMs: typeof data.closeTime === 'number' ? data.closeTime : Date.now(),
  };
}
