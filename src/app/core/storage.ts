/**
 * `localStorage` can be missing or throw (private mode, blocked site data,
 * SSR, tests). Preferences are conveniences, so failures are silently ignored.
 */
export function readStorage(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    /* ignore */
  }
}
