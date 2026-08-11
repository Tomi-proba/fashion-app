import { useCallback, useEffect, useRef, useState } from 'react';
import { getRobot } from '../data/robots';
import { advanceMarket, createInitialMarket } from './market';
import { getLiveEquityCurve } from './ownedRobots';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';
import { canClaimGrant, createInitialWallet, GRANT_AMOUNT } from './wallet';
import type { MarketState, OwnedRobot, WalletState } from '../types';

export const TICK_INTERVAL_MS = 2500; // 1 simulated trading day per 2.5 real seconds

function loadOrCreateMarket(): MarketState {
  const stored = loadJSON<MarketState>(STORAGE_KEYS.market);
  if (stored) return stored;
  return createInitialMarket(Math.floor(Date.now() % 2147483647));
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
  const [market, setMarket] = useState<MarketState>(loadOrCreateMarket);
  const [wallet, setWallet] = useState<WalletState>(loadOrCreateWallet);
  const [owned, setOwned] = useState<OwnedRobot[]>(loadOrCreateOwned);

  const marketRef = useRef(market);
  marketRef.current = market;
  const walletRef = useRef(wallet);
  walletRef.current = wallet;
  const ownedRef = useRef(owned);
  ownedRef.current = owned;

  useEffect(() => {
    const id = setInterval(() => setMarket((m) => advanceMarket(m, 1)), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => saveJSON(STORAGE_KEYS.market, market), [market]);
  useEffect(() => saveJSON(STORAGE_KEYS.wallet, wallet), [wallet]);
  useEffect(() => saveJSON(STORAGE_KEYS.owned, owned), [owned]);

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
    const purchasedAtIndex = marketRef.current.histories[robot.assetSymbol].length - 1;
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
    const soldAtIndex = robot ? marketRef.current.histories[robot.assetSymbol].length - 1 : target.purchasedAtIndex;
    setOwned((list) =>
      list.map((o) => (o.instanceId === instanceId ? { ...o, sold: true, soldAtIndex, soldValue: value, soldAtRealTime: Date.now() } : o)),
    );
    setWallet((w) => ({ ...w, balance: w.balance + value }));
  }, []);

  const fastForward = useCallback((days: number) => {
    setMarket((m) => advanceMarket(m, days));
  }, []);

  return { market, wallet, owned, grantPlayMoney, buyRobot, sellRobot, fastForward };
}
