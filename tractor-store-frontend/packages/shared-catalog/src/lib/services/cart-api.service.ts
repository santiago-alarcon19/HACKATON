import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { resolveApiBaseUrl } from '../config/api.config';
import { AddCartItemRequest, Cart, MiniCart } from '../models/cart.model';
import { mapCartResponse, mapMiniCartResponse } from './cart-api.mapper';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly http = inject(HttpClient);
  private readonly base = resolveApiBaseUrl();

  getCart(): Observable<Cart> {
    return this.http
      .get<Parameters<typeof mapCartResponse>[0]>(`${this.base}/cart`, {
        withCredentials: true,
      })
      .pipe(map(mapCartResponse));
  }

  getMiniCart(cart?: Cart): Observable<MiniCart> {
    const mini$ = this.http.get<Parameters<typeof mapMiniCartResponse>[0]>(
      `${this.base}/cart/mini`,
      { withCredentials: true }
    );
    if (cart) {
      return mini$.pipe(map((mini) => mapMiniCartResponse(mini, cart)));
    }
    return mini$.pipe(
      switchMap((mini) =>
        this.getCart().pipe(map((loaded) => mapMiniCartResponse(mini, loaded)))
      )
    );
  }

  addItem(body: AddCartItemRequest): Observable<Cart> {
    return this.http
      .post<Parameters<typeof mapCartResponse>[0]>(
        `${this.base}/cart/items`,
        { sku: body.sku },
        { withCredentials: true }
      )
      .pipe(map(mapCartResponse));
  }

  removeItem(sku: string): Observable<Cart> {
    return this.http
      .delete<Parameters<typeof mapCartResponse>[0]>(
        `${this.base}/cart/items/${encodeURIComponent(sku)}`,
        { withCredentials: true }
      )
      .pipe(map(mapCartResponse));
  }
}
