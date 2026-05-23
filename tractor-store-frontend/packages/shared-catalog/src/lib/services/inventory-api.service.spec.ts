import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { API_ENV, defaultApiEnvironment } from '../config/api.config';
import { InventoryApiService } from './inventory-api.service';

describe('InventoryApiService', () => {
  let service: InventoryApiService;
  let http: HttpTestingController;
  const base = defaultApiEnvironment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_ENV, useValue: defaultApiEnvironment },
        InventoryApiService,
      ],
    });
    service = TestBed.inject(InventoryApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getBySku loads stock', () => {
    service.getBySku('SKU-1').subscribe((stock) => {
      expect(stock.available).toBe(5);
    });
    http.expectOne(`${base}/inventory/SKU-1`).flush({ sku: 'SKU-1', quantity: 5 });
  });
});
