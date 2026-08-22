export type AssetSymbol = 'BTCUSDT' | 'ETHUSDT' | 'SOLUSDT' | 'DOGEUSDT';

export type StrategyId = 'trend' | 'meanReversion' | 'momentum' | 'grid';

// Not a fixed label — a real multiplier on how aggressively the strategy
// swings its recommended exposure (see lib/strategies.ts RISK_MULTIPLIER).
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

// A strategy "type" you can watch. It has no fixed asset or risk level —
// those are chosen when you add a watch for it.
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
  lastTradeAt: Record<AssetSymbol, number | null>;
  connectionStatus: ConnectionStatus;
  connectionError: string | null;
}

// A personal watch: "keep an eye on this strategy, on this asset, at this
// risk level, and tell me what it currently recommends." No money involved —
// purely informational, for your own decision-making.
export interface Watch {
  id: string;
  robotId: string;
  assetSymbol: AssetSymbol;
  riskLevel: RiskLevel;
  createdAt: number;
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
