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
  market: 'rtapp_market_v2',
  watches: 'rtapp_watches_v1',
} as const;
