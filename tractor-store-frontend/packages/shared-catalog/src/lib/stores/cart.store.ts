import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  CHECKOUT_CART_UPDATED,
  dispatchMfeEvent,
} from '../events/mfe-events';
import { Cart, CartLineItem, MiniCart } from '../models/cart.model';
import { CartApiService } from '../services/cart-api.service';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly cartApi = inject(CartApiService);

  private readonly _cart = signal<Cart | null>(null);
  private readonly _mini = signal<MiniCart | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly cart = this._cart.asReadonly();
  readonly mini = this._mini.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly itemCount = computed(
    () =>
      this._mini()?.itemCount ??
      this._cart()?.items.reduce((sum, i) => sum + i.quantity, 0) ??
      0
  );

  readonly subtotal = computed(
    () => this._mini()?.subtotal ?? this._cart()?.subtotal ?? 0
  );

  readonly items = computed(() => this._cart()?.items ?? ([] as CartLineItem[]));

  async refresh(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const cart = await firstValueFrom(this.cartApi.getCart());
      const mini = await firstValueFrom(this.cartApi.getMiniCart(cart));
      this._cart.set(cart);
      this._mini.set(mini);
      this.broadcastCartUpdated(mini);
    } catch (e) {
      this._error.set(e instanceof Error ? e.message : 'Failed to load cart');
    } finally {
      this._loading.set(false);
    }
  }

  async addItem(sku: string, quantity = 1): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const cart = await firstValueFrom(
        this.cartApi.addItem({ sku, quantity })
      );
      this._cart.set(cart);
      const mini: MiniCart = {
        itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: cart.subtotal,
        preview: cart.items.slice(0, 3).map((i) => ({
          sku: i.sku,
          name: i.name,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
          unitPrice: i.unitPrice,
        })),
      };
      this._mini.set(mini);
      this.broadcastCartUpdated(mini);
    } catch (e) {
      this._error.set(e instanceof Error ? e.message : 'Failed to add item');
      throw e;
    } finally {
      this._loading.set(false);
    }
  }

  async removeItem(sku: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const cart = await firstValueFrom(this.cartApi.removeItem(sku));
      this._cart.set(cart);
      const mini: MiniCart = {
        itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: cart.subtotal,
        preview: cart.items.slice(0, 3).map((i) => ({
          sku: i.sku,
          name: i.name,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
          unitPrice: i.unitPrice,
        })),
      };
      this._mini.set(mini);
      this.broadcastCartUpdated(mini);
    } catch (e) {
      this._error.set(e instanceof Error ? e.message : 'Failed to remove item');
      throw e;
    } finally {
      this._loading.set(false);
    }
  }

  private broadcastCartUpdated(mini: MiniCart): void {
    dispatchMfeEvent(CHECKOUT_CART_UPDATED, {
      itemCount: mini.itemCount,
      subtotal: mini.subtotal,
    });
  }
}
