export type AssetSymbol = 'DEMO-TECH' | 'DEMO-GOLD' | 'DEMO-CRYPTO' | 'DEMO-ENERGY';

export type StrategyId = 'trend' | 'meanReversion' | 'momentum' | 'grid';

export type RiskLevel = 'alacsony' | 'közepes' | 'magas';

export interface AssetDef {
  symbol: AssetSymbol;
  name: string;
  startPrice: number;
  driftAnnual: number;
  volAnnual: number;
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

export interface MarketState {
  rngState: number;
  t: number;
  histories: Record<AssetSymbol, number[]>;
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
