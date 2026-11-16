const FAVORITES_STORAGE_KEY = 'product_catalog_favorites';

/**
 * Safely loads favorite product IDs from browser localStorage.
 * Handles SSR/missing storage, corrupt JSON, and invalid data shapes.
 */
export function loadFavoritesFromStorage(): number[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (id): id is number => typeof id === 'number' && Number.isFinite(id) && id > 0
      );
    }
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
  }

  return [];
}

/**
 * Safely writes favorite product IDs to browser localStorage.
 */
export function saveFavoritesToStorage(ids: number[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
}
