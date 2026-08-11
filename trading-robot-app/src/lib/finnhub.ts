import type { AssetSymbol } from '../types';

export interface TradeTick {
  symbol: string;
  price: number;
  atMs: number;
}

export function buildWsUrl(apiKey: string): string {
  return `wss://ws.finnhub.io?token=${encodeURIComponent(apiKey)}`;
}

export function subscribeMessage(symbol: AssetSymbol): string {
  return JSON.stringify({ type: 'subscribe', symbol });
}

export function unsubscribeMessage(symbol: AssetSymbol): string {
  return JSON.stringify({ type: 'unsubscribe', symbol });
}

// Finnhub sends {"type":"trade","data":[{s,p,t,v},...]} on real trades and
// {"type":"ping"} as a keepalive — everything else we just ignore.
export function parseWsMessage(raw: string): TradeTick[] {
  let msg: unknown;
  try {
    msg = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!msg || typeof msg !== 'object') return [];
  const obj = msg as { type?: unknown; data?: unknown };
  if (obj.type !== 'trade' || !Array.isArray(obj.data)) return [];

  const ticks: TradeTick[] = [];
  for (const entry of obj.data) {
    if (!entry || typeof entry !== 'object') continue;
    const { s, p, t } = entry as { s?: unknown; p?: unknown; t?: unknown };
    if (typeof s === 'string' && typeof p === 'number' && typeof t === 'number') {
      ticks.push({ symbol: s, price: p, atMs: t });
    }
  }
  return ticks;
}

export interface QuoteResult {
  price: number;
  prevClose: number;
  open: number;
  timestampMs: number;
}

export class FinnhubError extends Error {}

export async function fetchQuote(apiKey: string, symbol: AssetSymbol): Promise<QuoteResult> {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(apiKey)}`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new FinnhubError('Nem sikerült elérni a Finnhub API-t. Ellenőrizd a hálózati kapcsolatot.');
  }
  if (res.status === 401 || res.status === 403) {
    throw new FinnhubError('Érvénytelen Finnhub API-kulcs.');
  }
  if (res.status === 429) {
    throw new FinnhubError('Túl sok kérés a Finnhub API felé (rate limit). Próbáld később.');
  }
  if (!res.ok) {
    throw new FinnhubError(`Finnhub hiba (${res.status}).`);
  }
  const data = (await res.json()) as { c?: number; pc?: number; o?: number; t?: number };
  if (typeof data.c !== 'number' || data.c === 0) {
    throw new FinnhubError(`Nincs elérhető árfolyam ehhez a szimbólumhoz: ${symbol}`);
  }
  return {
    price: data.c,
    prevClose: typeof data.pc === 'number' ? data.pc : data.c,
    open: typeof data.o === 'number' ? data.o : data.c,
    timestampMs: typeof data.t === 'number' ? data.t * 1000 : Date.now(),
  };
}
