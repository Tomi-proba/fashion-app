import { useCallback, useEffect, useState } from 'react';
import { fetchTicker, WS_URL, subscribeMessage, parseWsMessage, BinanceError } from './binance';
import { ASSETS, appendTick, createInitialMarket } from './market';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';
import type { AssetSymbol, MarketState, RiskLevel, Watch } from '../types';

// Batch fast trade streams into one stored point every few seconds, averaging
// every trade seen in that window rather than keeping only the last one. Raw
// tick-by-tick prices bounce between bid/ask on every single trade — feeding
// that directly into a short-window strategy (like mean-reversion's 20-point
// z-score) makes its signal flap between every bucket on pure noise. Averaging
// smooths that out into something closer to a real price bar.
const FLUSH_INTERVAL_MS = 3000;
const RECONNECT_BASE_MS = 2000;
const RECONNECT_MAX_MS = 30000;

function loadOrCreateMarket(): MarketState {
  const stored = loadJSON<MarketState>(STORAGE_KEYS.market);
  if (stored) return { ...stored, connectionStatus: 'connecting', connectionError: null };
  return createInitialMarket();
}

function loadWatches(): Watch[] {
  return loadJSON<Watch[]>(STORAGE_KEYS.watches) ?? [];
}

export function useGame() {
  const [market, setMarket] = useState<MarketState>(loadOrCreateMarket);
  const [watches, setWatches] = useState<Watch[]>(loadWatches);

  useEffect(() => saveJSON(STORAGE_KEYS.market, market), [market]);
  useEffect(() => saveJSON(STORAGE_KEYS.watches, watches), [watches]);

  // Live Binance connection: public REST bootstrap + public WebSocket trade stream, no API
  // key or account involved. Batched into market state at most once a second so a busy pair
  // (BTC/ETH trade very frequently) doesn't hammer React/localStorage.
  useEffect(() => {
    let active = true;
    let ws: WebSocket | null = null;
    let reconnectAttempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    const pending = new Map<AssetSymbol, { sum: number; count: number; atMs: number }>();

    const flushTimer = setInterval(() => {
      if (pending.size === 0) return;
      const batch = Array.from(pending.entries());
      pending.clear();
      setMarket((m) => {
        let next = m;
        for (const [symbol, agg] of batch) {
          next = appendTick(next, symbol, agg.sum / agg.count, agg.atMs);
        }
        return next;
      });
    }, FLUSH_INTERVAL_MS);

    function connect() {
      if (!active) return;
      setMarket((m) => ({ ...m, connectionStatus: 'connecting', connectionError: null }));
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        if (!active) return;
        reconnectAttempt = 0;
        setMarket((m) => ({ ...m, connectionStatus: 'open', connectionError: null }));
        ws?.send(subscribeMessage(ASSETS.map((a) => a.symbol)));
      };

      ws.onmessage = (event) => {
        if (!active || typeof event.data !== 'string') return;
        const ticks = parseWsMessage(event.data);
        for (const tick of ticks) {
          if (!ASSETS.some((a) => a.symbol === tick.symbol)) continue;
          const symbol = tick.symbol as AssetSymbol;
          const existing = pending.get(symbol);
          pending.set(symbol, existing ? { sum: existing.sum + tick.price, count: existing.count + 1, atMs: tick.atMs } : { sum: tick.price, count: 1, atMs: tick.atMs });
        }
      };

      ws.onerror = () => {
        if (!active) return;
        setMarket((m) => ({ ...m, connectionStatus: 'error', connectionError: 'WebSocket hiba történt.' }));
      };

      ws.onclose = () => {
        if (!active) return;
        setMarket((m) => ({ ...m, connectionStatus: 'closed' }));
        const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS);
        reconnectAttempt += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    }

    async function bootstrap() {
      const results = await Promise.allSettled(ASSETS.map((asset) => fetchTicker(asset.symbol)));
      if (!active) return;
      let firstError: string | null = null;
      setMarket((m) => {
        let next = m;
        results.forEach((result, i) => {
          const symbol = ASSETS[i].symbol;
          if (result.status === 'fulfilled') {
            const q = result.value;
            if (next.histories[symbol].length === 0) {
              next = appendTick(next, symbol, q.prevClose, q.timestampMs - 1);
              next = appendTick(next, symbol, q.price, q.timestampMs);
            }
          } else if (!firstError) {
            firstError = result.reason instanceof BinanceError ? result.reason.message : 'Nem sikerült lekérni a kezdő árfolyamot.';
          }
        });
        return next;
      });
      connect(); // the WebSocket stream keeps working even if the one-off REST bootstrap failed
      if (firstError) {
        setMarket((m) => (m.connectionStatus === 'connecting' ? { ...m, connectionError: firstError } : m));
      }
    }

    bootstrap();

    return () => {
      active = false;
      clearInterval(flushTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  const refreshQuotes = useCallback(async () => {
    const results = await Promise.allSettled(ASSETS.map((asset) => fetchTicker(asset.symbol)));
    setMarket((m) => {
      let next = m;
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          next = appendTick(next, ASSETS[i].symbol, result.value.price, result.value.timestampMs);
        }
      });
      return next;
    });
  }, []);

  const addWatch = useCallback((robotId: string, assetSymbol: AssetSymbol, riskLevel: RiskLevel) => {
    const watch: Watch = { id: crypto.randomUUID(), robotId, assetSymbol, riskLevel, createdAt: Date.now() };
    setWatches((list) => [...list, watch]);
  }, []);

  const removeWatch = useCallback((id: string) => {
    setWatches((list) => list.filter((w) => w.id !== id));
  }, []);

  return { market, watches, refreshQuotes, addWatch, removeWatch };
}
