import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { resolveApiBaseUrl } from '../config/api.config';
import { InventoryStatus } from '../models/product.model';
import { mapStockDto } from './catalog-api.mapper';

@Injectable({ providedIn: 'root' })
export class InventoryApiService {
  private readonly http = inject(HttpClient);
  private readonly base = resolveApiBaseUrl();

  getBySku(sku: string): Observable<InventoryStatus> {
    return this.http
      .get<Parameters<typeof mapStockDto>[0]>(
        `${this.base}/inventory/${encodeURIComponent(sku)}`
      )
      .pipe(map(mapStockDto));
  }
}
