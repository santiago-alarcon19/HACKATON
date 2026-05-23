/** Cross-MFE custom events (typed detail payloads). */

export const CHECKOUT_CART_UPDATED = 'checkout:cart-updated' as const;
export const EXPLORE_STORE_SELECTED = 'explore:store-selected' as const;
export const CART_PANEL_OPEN = 'cart:panel-open' as const;

export interface CheckoutCartUpdatedDetail {
  itemCount: number;
  subtotal: number;
}

export interface ExploreStoreSelectedDetail {
  storeId: string;
  storeName: string;
}

export type TractorStoreEventMap = {
  [CHECKOUT_CART_UPDATED]: CheckoutCartUpdatedDetail;
  [EXPLORE_STORE_SELECTED]: ExploreStoreSelectedDetail;
  [CART_PANEL_OPEN]: Record<string, never>;
};

export function dispatchMfeEvent<K extends keyof TractorStoreEventMap>(
  name: K,
  detail: TractorStoreEventMap[K]
): void {
  window.dispatchEvent(
    new CustomEvent(name, { detail, bubbles: true, composed: true })
  );
}

export function onMfeEvent<K extends keyof TractorStoreEventMap>(
  name: K,
  handler: (detail: TractorStoreEventMap[K]) => void
): () => void {
  const listener = (event: Event) => {
    const custom = event as CustomEvent<TractorStoreEventMap[K]>;
    handler(custom.detail);
  };
  window.addEventListener(name, listener);
  return () => window.removeEventListener(name, listener);
}
