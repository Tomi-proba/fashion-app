export function loadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — the session just won't persist, not fatal
  }
}

export const STORAGE_KEYS = {
  market: 'rtapp_market_v1',
  wallet: 'rtapp_wallet_v1',
  owned: 'rtapp_owned_v1',
} as const;
