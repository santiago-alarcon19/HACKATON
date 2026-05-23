import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { resolveApiBaseUrl } from '../config/api.config';
import {
  CategoryGroup,
  HomePayload,
  ProductDetail,
  ProductSummary,
  StoreLocation,
} from '../models/product.model';
import {
  mapCategoryResponse,
  mapHomeResponse,
  mapProductDetailResponse,
  mapProductSummary,
  mapRecommendations,
  mapStoreDto,
} from './catalog-api.mapper';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly base = resolveApiBaseUrl();

  getHome(): Observable<HomePayload> {
    return forkJoin({
      home: this.http.get<Parameters<typeof mapHomeResponse>[0]>(
        `${this.base}/catalog/home`
      ),
      classic: this.http
        .get<Parameters<typeof mapCategoryResponse>[0]>(
          `${this.base}/catalog/categories/classic`
        )
        .pipe(catchError(() => of(null))),
    }).pipe(
      map(({ home, classic }) => {
        const payload = mapHomeResponse(home);
        if (classic?.products?.length) {
          payload.featured = classic.products
            .slice(0, 4)
            .map((p) => mapProductSummary(p, classic.key));
        }
        return payload;
      })
    );
  }

  getCategories(filter: string): Observable<CategoryGroup> {
    return this.http
      .get<Parameters<typeof mapCategoryResponse>[0]>(
        `${this.base}/catalog/categories/${encodeURIComponent(filter)}`
      )
      .pipe(map(mapCategoryResponse));
  }

  getProduct(id: string): Observable<ProductDetail> {
    return this.http
      .get<Parameters<typeof mapProductDetailResponse>[0]>(
        `${this.base}/catalog/products/${encodeURIComponent(id)}`
      )
      .pipe(map(mapProductDetailResponse));
  }

  getStores(): Observable<StoreLocation[]> {
    return this.http
      .get<Parameters<typeof mapStoreDto>[0][]>(`${this.base}/catalog/stores`)
      .pipe(map((stores) => stores.map(mapStoreDto)));
  }

  getRecommendations(skus: string): Observable<ProductSummary[]> {
    return this.http
      .get<{ products: Parameters<typeof mapProductSummary>[0][] }>(
        `${this.base}/catalog/recommendations`,
        { params: { skus } }
      )
      .pipe(map((res) => mapRecommendations(res.products ?? [])));
  }
}
