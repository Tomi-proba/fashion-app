const KEY = 'rtapp_finnhub_key_v1';

export function loadApiKey(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(KEY, key.trim());
  } catch {
    // ignore — key just won't persist across reloads
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
