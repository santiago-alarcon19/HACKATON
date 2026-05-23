import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { API_ENV, defaultApiEnvironment } from '../config/api.config';
import { CatalogApiService } from './catalog-api.service';

describe('CatalogApiService', () => {
  let service: CatalogApiService;
  let http: HttpTestingController;
  const base = defaultApiEnvironment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_ENV, useValue: defaultApiEnvironment },
        CatalogApiService,
      ],
    });
    service = TestBed.inject(CatalogApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getHome merges featured products from classic category', () => {
    service.getHome().subscribe((home) => {
      expect(home.featured).toHaveLength(1);
    });
    http.expectOne(`${base}/catalog/home`).flush({
      teaser: [{ title: 'Classics', image: '/img.jpg', url: '/classic' }],
    });
    http.expectOne(`${base}/catalog/categories/classic`).flush({
      key: 'classic',
      name: 'Classics',
      filters: ['classic'],
      products: [
        {
          id: 'CL-01',
          name: 'Classic',
          image: '/p.jpg',
          startPrice: 1000,
          url: '/p',
        },
      ],
    });
  });

  it('getCategories loads category', () => {
    service.getCategories('classic').subscribe((cat) => {
      expect(cat.filter).toBe('classic');
    });
    http
      .expectOne(`${base}/catalog/categories/classic`)
      .flush({ key: 'classic', name: 'Classics', filters: [], products: [] });
  });

  it('getProduct loads detail', () => {
    service.getProduct('AU-02').subscribe((p) => expect(p.id).toBe('AU-02'));
    http.expectOne(`${base}/catalog/products/AU-02`).flush({
      id: 'AU-02',
      name: 'Auto',
      category: 'autonomous',
      highlights: [],
      variants: [],
    });
  });

  it('getStores maps stores', () => {
    service.getStores().subscribe((stores) => expect(stores).toHaveLength(1));
    http
      .expectOne(`${base}/catalog/stores`)
      .flush([{ id: 'store-a', name: 'A', street: 'S', city: 'C' }]);
  });

  it('getRecommendations maps products', () => {
    service.getRecommendations('SKU-1').subscribe((items) => {
      expect(items).toHaveLength(1);
    });
    http.expectOne(`${base}/catalog/recommendations?skus=SKU-1`).flush({
      products: [
        { id: 'X', name: 'X', image: '/x', startPrice: 1, url: '/x' },
      ],
    });
  });
});
