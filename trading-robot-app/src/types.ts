export type AssetSymbol = 'BTCUSDT' | 'ETHUSDT' | 'SOLUSDT' | 'DOGEUSDT';

export type StrategyId = 'trend' | 'meanReversion' | 'momentum' | 'grid';

// Not a fixed label anymore — a real multiplier on how aggressively the
// strategy swings its position size (see lib/strategies.ts RISK_MULTIPLIER).
export type RiskLevel = 'alacsony' | 'közepes' | 'magas';

export interface AssetDef {
  symbol: AssetSymbol;
  name: string;
}

export interface StrategyDef {
  id: StrategyId;
  name: string;
  description: string;
  targetFraction: (history: number[], risk: RiskLevel) => number;
}

// A robot "type" — a strategy you can configure and buy. It has no fixed
// asset, risk level, or price: those are chosen once, together, at purchase.
export interface RobotDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  strategyId: StrategyId;
}

export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface MarketState {
  histories: Record<AssetSymbol, number[]>;
  // Absolute index of histories[symbol][0] — grows as old points are trimmed off the front,
  // so an OwnedRobot's purchasedAtIndex (also absolute) can still be located after trimming.
  historyOffsets: Record<AssetSymbol, number>;
  lastTradeAt: Record<AssetSymbol, number | null>;
  connectionStatus: ConnectionStatus;
  connectionError: string | null;
}

export interface WalletState {
  balance: number;
  totalGranted: number;
  lastGrantAt: number | null;
}

export interface OwnedRobot {
  instanceId: string;
  robotId: string;
  assetSymbol: AssetSymbol;
  riskLevel: RiskLevel;
  purchasedAtIndex: number;
  purchasedAtRealTime: number;
  costBasis: number;
  sold: boolean;
  soldAtIndex?: number;
  soldValue?: number;
  soldAtRealTime?: number;
}

export interface Trade {
  index: number;
  type: 'buy' | 'sell';
  fraction: number;
}

export interface PortfolioResult {
  equity: number[];
  trades: Trade[];
}
