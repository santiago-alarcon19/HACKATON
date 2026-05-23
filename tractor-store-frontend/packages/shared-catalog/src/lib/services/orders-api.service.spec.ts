import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { API_ENV, defaultApiEnvironment } from '../config/api.config';
import { OrdersApiService } from './orders-api.service';

describe('OrdersApiService', () => {
  let service: OrdersApiService;
  let http: HttpTestingController;
  const base = defaultApiEnvironment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_ENV, useValue: defaultApiEnvironment },
        OrdersApiService,
      ],
    });
    service = TestBed.inject(OrdersApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('createOrder posts trimmed body', () => {
    service
      .createOrder({ firstname: ' Ada ', lastname: ' L ', storeId: ' store-a ' })
      .subscribe((order) => expect(order.firstname).toBe('Ada'));

    const req = http.expectOne(`${base}/orders`);
    expect(req.request.body).toEqual({
      firstname: 'Ada',
      lastname: 'L',
      storeId: 'store-a',
    });
    req.flush({
      id: '1',
      firstname: 'Ada',
      lastname: 'L',
      storeId: 'store-a',
      total: 100,
      items: [],
    });
  });

  it('getOrder loads order by id', () => {
    service.getOrder('abc').subscribe((order) => expect(order.id).toBe('abc'));
    http.expectOne(`${base}/orders/abc`).flush({
      id: 'abc',
      firstname: 'A',
      lastname: 'B',
      storeId: 'store-a',
      total: 1,
      items: [],
    });
  });
});
