export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export interface Rules {
  numDecks: number;
  dealerHitsSoft17: boolean;
  doubleAnyTwo: boolean;
  surrenderAllowed: boolean;
}

export type Action = 'stand' | 'hit' | 'double' | 'split' | 'surrender';

export interface ActionResult {
  action: Action;
  evPerUnit: number;
  winPct: number;
  pushPct: number;
  lossPct: number;
  trials: number;
}
