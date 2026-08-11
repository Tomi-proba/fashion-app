import { useCallback, useEffect, useRef, useState } from 'react';
import { getRobot } from '../data/robots';
import { fetchQuote, buildWsUrl, subscribeMessage, parseWsMessage, FinnhubError } from './finnhub';
import { getLiveEquityCurve } from './ownedRobots';
import { ASSETS, appendTick, absoluteLength, createInitialMarket } from './market';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';
import { canClaimGrant, createInitialWallet, GRANT_AMOUNT } from './wallet';
import { loadApiKey, saveApiKey, clearApiKey } from './apiKey';
import type { AssetSymbol, MarketState, OwnedRobot, WalletState } from '../types';

const FLUSH_INTERVAL_MS = 1000; // batch fast trade streams into at most 1 UI/storage update per second
const RECONNECT_BASE_MS = 2000;
const RECONNECT_MAX_MS = 30000;

function loadOrCreateMarket(): MarketState {
  const stored = loadJSON<MarketState>(STORAGE_KEYS.market);
  if (stored) return { ...stored, connectionStatus: 'no-key', connectionError: null };
  return createInitialMarket();
}

function loadOrCreateWallet(): WalletState {
  return loadJSON<WalletState>(STORAGE_KEYS.wallet) ?? createInitialWallet();
}

function loadOrCreateOwned(): OwnedRobot[] {
  return loadJSON<OwnedRobot[]>(STORAGE_KEYS.owned) ?? [];
}

export interface BuyResult {
  ok: boolean;
  message?: string;
}

export function useGame() {
  const [apiKey, setApiKeyState] = useState<string | null>(loadApiKey);
  const [market, setMarket] = useState<MarketState>(loadOrCreateMarket);
  const [wallet, setWallet] = useState<WalletState>(loadOrCreateWallet);
  const [owned, setOwned] = useState<OwnedRobot[]>(loadOrCreateOwned);

  const marketRef = useRef(market);
  marketRef.current = market;
  const walletRef = useRef(wallet);
  walletRef.current = wallet;
  const ownedRef = useRef(owned);
  ownedRef.current = owned;

  useEffect(() => saveJSON(STORAGE_KEYS.market, market), [market]);
  useEffect(() => saveJSON(STORAGE_KEYS.wallet, wallet), [wallet]);
  useEffect(() => saveJSON(STORAGE_KEYS.owned, owned), [owned]);

  // Live Finnhub connection: REST bootstrap + WebSocket trade stream, batched into
  // the market state at most once a second so a busy stock doesn't hammer React/localStorage.
  useEffect(() => {
    if (!apiKey) {
      setMarket((m) => ({ ...m, connectionStatus: 'no-key', connectionError: null }));
      return;
    }

    let active = true;
    let ws: WebSocket | null = null;
    let reconnectAttempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    const pending = new Map<AssetSymbol, { price: number; atMs: number }>();

    const flushTimer = setInterval(() => {
      if (pending.size === 0) return;
      const batch = Array.from(pending.entries());
      pending.clear();
      setMarket((m) => {
        let next = m;
        for (const [symbol, tick] of batch) {
          next = appendTick(next, symbol, tick.price, tick.atMs);
        }
        return next;
      });
    }, FLUSH_INTERVAL_MS);

    function connect() {
      if (!active) return;
      setMarket((m) => ({ ...m, connectionStatus: 'connecting', connectionError: null }));
      ws = new WebSocket(buildWsUrl(apiKey as string));

      ws.onopen = () => {
        if (!active) return;
        reconnectAttempt = 0;
        setMarket((m) => ({ ...m, connectionStatus: 'open', connectionError: null }));
        for (const asset of ASSETS) ws?.send(subscribeMessage(asset.symbol));
      };

      ws.onmessage = (event) => {
        if (!active || typeof event.data !== 'string') return;
        const ticks = parseWsMessage(event.data);
        for (const tick of ticks) {
          if (ASSETS.some((a) => a.symbol === tick.symbol)) {
            pending.set(tick.symbol as AssetSymbol, { price: tick.price, atMs: tick.atMs });
          }
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
      const results = await Promise.allSettled(ASSETS.map((asset) => fetchQuote(apiKey as string, asset.symbol)));
      if (!active) return;
      let firstError: string | null = null;
      setMarket((m) => {
        let next = m;
        results.forEach((result, i) => {
          const symbol = ASSETS[i].symbol;
          if (result.status === 'fulfilled') {
            const q = result.value;
            if (absoluteLength(next, symbol) === 0) {
              next = appendTick(next, symbol, q.prevClose, q.timestampMs - 1);
              next = appendTick(next, symbol, q.price, q.timestampMs);
            }
          } else if (!firstError) {
            firstError = result.reason instanceof FinnhubError ? result.reason.message : 'Nem sikerült lekérni a kezdő árfolyamot.';
          }
        });
        return next;
      });
      if (firstError) {
        setMarket((m) => ({ ...m, connectionStatus: 'error', connectionError: firstError }));
        return; // bad key etc. — don't open a websocket that will just fail too
      }
      connect();
    }

    bootstrap();

    return () => {
      active = false;
      clearInterval(flushTimer);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [apiKey]);

  const setApiKey = useCallback((key: string) => {
    saveApiKey(key);
    setApiKeyState(key.trim());
  }, []);

  const removeApiKey = useCallback(() => {
    clearApiKey();
    setApiKeyState(null);
  }, []);

  const refreshQuotes = useCallback(async () => {
    if (!apiKey) return;
    const results = await Promise.allSettled(ASSETS.map((asset) => fetchQuote(apiKey, asset.symbol)));
    setMarket((m) => {
      let next = m;
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          next = appendTick(next, ASSETS[i].symbol, result.value.price, result.value.timestampMs);
        }
      });
      return next;
    });
  }, [apiKey]);

  const grantPlayMoney = useCallback(() => {
    setWallet((w) => {
      if (!canClaimGrant(w, Date.now())) return w;
      return { ...w, balance: w.balance + GRANT_AMOUNT, totalGranted: w.totalGranted + GRANT_AMOUNT, lastGrantAt: Date.now() };
    });
  }, []);

  const buyRobot = useCallback((robotId: string): BuyResult => {
    const robot = getRobot(robotId);
    if (!robot) return { ok: false, message: 'Ismeretlen robot.' };
    if (walletRef.current.balance < robot.price) {
      return { ok: false, message: 'Nincs elég játékegyenleged ehhez a robothoz.' };
    }
    const m = marketRef.current;
    const totalTicks = absoluteLength(m, robot.assetSymbol);
    if (totalTicks === 0) {
      return { ok: false, message: 'Még nem érkezett árfolyamadat ehhez az eszközhöz — várj egy pillanatot.' };
    }
    const purchasedAtIndex = totalTicks - 1;
    const newOwned: OwnedRobot = {
      instanceId: crypto.randomUUID(),
      robotId: robot.id,
      purchasedAtIndex,
      purchasedAtRealTime: Date.now(),
      costBasis: robot.price,
      sold: false,
    };
    setWallet((w) => ({ ...w, balance: w.balance - robot.price }));
    setOwned((list) => [...list, newOwned]);
    return { ok: true };
  }, []);

  const sellRobot = useCallback((instanceId: string) => {
    const target = ownedRef.current.find((o) => o.instanceId === instanceId && !o.sold);
    if (!target) return;
    const equity = getLiveEquityCurve(target, marketRef.current);
    const value = equity[equity.length - 1] ?? target.costBasis;
    const robot = getRobot(target.robotId);
    const soldAtIndex = robot ? absoluteLength(marketRef.current, robot.assetSymbol) - 1 : target.purchasedAtIndex;
    setOwned((list) =>
      list.map((o) => (o.instanceId === instanceId ? { ...o, sold: true, soldAtIndex, soldValue: value, soldAtRealTime: Date.now() } : o)),
    );
    setWallet((w) => ({ ...w, balance: w.balance + value }));
  }, []);

  return { market, wallet, owned, apiKey, setApiKey, removeApiKey, refreshQuotes, grantPlayMoney, buyRobot, sellRobot };
}
