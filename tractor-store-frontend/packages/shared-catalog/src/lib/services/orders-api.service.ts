import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { resolveApiBaseUrl } from '../config/api.config';
import { Order, PlaceOrderRequest } from '../models/order.model';
import {
  mapOrderResponse,
  mapPlaceOrderBody,
  PlaceOrderBody,
} from './orders-api.mapper';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly http = inject(HttpClient);
  private readonly base = resolveApiBaseUrl();

  createOrder(body: PlaceOrderRequest): Observable<Order> {
    const payload: PlaceOrderBody = mapPlaceOrderBody(body);
    return this.http
      .post<Parameters<typeof mapOrderResponse>[0]>(`${this.base}/orders`, payload, {
        withCredentials: true,
      })
      .pipe(map(mapOrderResponse));
  }

  getOrder(id: string): Observable<Order> {
    return this.http
      .get<Parameters<typeof mapOrderResponse>[0]>(
        `${this.base}/orders/${encodeURIComponent(id)}`,
        { withCredentials: true }
      )
      .pipe(map(mapOrderResponse));
  }
}
