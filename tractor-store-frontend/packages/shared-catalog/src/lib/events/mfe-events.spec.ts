import {
  CHECKOUT_CART_UPDATED,
  dispatchMfeEvent,
  EXPLORE_STORE_SELECTED,
  onMfeEvent,
} from './mfe-events';

describe('mfe-events', () => {
  it('dispatchMfeEvent emits custom event with detail', () => {
    const handler = jest.fn();
    window.addEventListener(CHECKOUT_CART_UPDATED, handler);

    dispatchMfeEvent(CHECKOUT_CART_UPDATED, { itemCount: 2, subtotal: 100 });

    expect(handler).toHaveBeenCalled();
    window.removeEventListener(CHECKOUT_CART_UPDATED, handler);
  });

  it('onMfeEvent subscribes and unsubscribes', () => {
    const handler = jest.fn();
    const off = onMfeEvent(EXPLORE_STORE_SELECTED, handler);

    dispatchMfeEvent(EXPLORE_STORE_SELECTED, {
      storeId: 'store-a',
      storeName: 'North',
    });
    expect(handler).toHaveBeenCalledWith({
      storeId: 'store-a',
      storeName: 'North',
    });

    off();
    handler.mockClear();
    dispatchMfeEvent(EXPLORE_STORE_SELECTED, {
      storeId: 'store-b',
      storeName: 'South',
    });
    expect(handler).not.toHaveBeenCalled();
  });
});
