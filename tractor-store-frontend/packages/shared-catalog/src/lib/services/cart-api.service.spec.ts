import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { API_ENV, defaultApiEnvironment } from '../config/api.config';
import { CartApiService } from './cart-api.service';

describe('CartApiService', () => {
  let service: CartApiService;
  let http: HttpTestingController;
  const base = defaultApiEnvironment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_ENV, useValue: defaultApiEnvironment },
        CartApiService,
      ],
    });
    service = TestBed.inject(CartApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getCart loads cart', () => {
    service.getCart().subscribe((cart) => {
      expect(cart.subtotal).toBe(100);
    });
    const req = http.expectOne(`${base}/cart`);
    req.flush({ items: [], total: 100 });
  });

  it('addItem posts sku', () => {
    service.addItem({ sku: 'SKU-1', quantity: 1 }).subscribe();
    const req = http.expectOne(`${base}/cart/items`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ sku: 'SKU-1' });
    req.flush({ items: [], total: 0 });
  });

  it('removeItem deletes sku', () => {
    service.removeItem('SKU-1').subscribe();
    const req = http.expectOne(`${base}/cart/items/SKU-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ items: [], total: 0 });
  });

  it('getMiniCart loads cart when not provided', () => {
    service.getMiniCart().subscribe((mini) => {
      expect(mini.itemCount).toBe(1);
    });
    const miniReq = http.expectOne(`${base}/cart/mini`);
    miniReq.flush({ quantity: 1 });
    const cartReq = http.expectOne(`${base}/cart`);
    cartReq.flush({
      items: [
        { sku: 'A', name: 'A', image: '/a', price: 10, quantity: 1 },
      ],
      total: 10,
    });
  });
});
