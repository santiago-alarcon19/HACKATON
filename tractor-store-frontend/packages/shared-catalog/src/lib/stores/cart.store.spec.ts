import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { API_ENV, defaultApiEnvironment } from '../config/api.config';
import { CHECKOUT_CART_UPDATED } from '../events/mfe-events';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let store: CartStore;
  let http: HttpTestingController;
  const apiBase = defaultApiEnvironment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_ENV, useValue: defaultApiEnvironment },
        CartStore,
      ],
    });
    store = TestBed.inject(CartStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads cart and mini cart', async () => {
    const refresh = store.refresh();
    const cartReq = http.expectOne(`${apiBase}/cart`);
    cartReq.flush({
      items: [],
      subtotal: 0,
      currency: 'USD',
    });
    await Promise.resolve();
    const miniReq = http.expectOne(`${apiBase}/cart/mini`);
    miniReq.flush({ itemCount: 0, subtotal: 0, preview: [] });
    await refresh;
    expect(store.itemCount()).toBe(0);
  });

  it('dispatches checkout:cart-updated after addItem', async () => {
    const handler = jest.fn();
    window.addEventListener(CHECKOUT_CART_UPDATED, handler);

    const addPromise = store.addItem('SKU-1', 2);
    const postReq = http.expectOne(
      (r) =>
        r.method === 'POST' &&
        r.url === `${apiBase}/cart/items`
    );
    postReq.flush({
      items: [
        {
          sku: 'SKU-1',
          productId: 'p1',
          name: 'Tractor',
          variantLabel: 'Red',
          quantity: 2,
          unitPrice: 1000,
        },
      ],
      subtotal: 2000,
      currency: 'USD',
    });
    await addPromise;

    expect(handler).toHaveBeenCalled();
    expect(store.itemCount()).toBe(2);
    window.removeEventListener(CHECKOUT_CART_UPDATED, handler);
  });
});
