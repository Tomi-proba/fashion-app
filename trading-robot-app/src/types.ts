export type AssetSymbol = 'AAPL' | 'KO' | 'TSLA' | 'XOM';

export type StrategyId = 'trend' | 'meanReversion' | 'momentum' | 'grid';

export type RiskLevel = 'alacsony' | 'közepes' | 'magas';

export interface AssetDef {
  symbol: AssetSymbol;
  name: string;
}

export interface StrategyDef {
  id: StrategyId;
  name: string;
  description: string;
  targetFraction: (history: number[]) => number;
}

export interface RobotDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  strategyId: StrategyId;
  assetSymbol: AssetSymbol;
  riskLevel: RiskLevel;
  price: number;
}

export type ConnectionStatus = 'no-key' | 'connecting' | 'open' | 'closed' | 'error';

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
