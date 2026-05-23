const PICKUP_STORE_KEY = 'tractor:picked-store';

export interface PickupStoreSelection {
  storeId: string;
  storeName: string;
}

export function savePickupStore(store: PickupStoreSelection): void {
  sessionStorage.setItem(PICKUP_STORE_KEY, JSON.stringify(store));
}

export function readPickupStore(): PickupStoreSelection | null {
  const raw = sessionStorage.getItem(PICKUP_STORE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as PickupStoreSelection;
    if (parsed?.storeId && parsed?.storeName) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}
