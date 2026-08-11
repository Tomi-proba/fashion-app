import type { WalletState } from '../types';

export const STARTING_BALANCE = 10000;
export const GRANT_AMOUNT = 5000;
export const GRANT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function createInitialWallet(): WalletState {
  return { balance: STARTING_BALANCE, totalGranted: STARTING_BALANCE, lastGrantAt: null };
}

export function canClaimGrant(wallet: WalletState, now: number): boolean {
  if (wallet.lastGrantAt === null) return true;
  return now - wallet.lastGrantAt >= GRANT_COOLDOWN_MS;
}

export function msUntilNextGrant(wallet: WalletState, now: number): number {
  if (wallet.lastGrantAt === null) return 0;
  return Math.max(0, GRANT_COOLDOWN_MS - (now - wallet.lastGrantAt));
}
