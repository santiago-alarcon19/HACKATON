import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  CartStore,
  CART_PANEL_OPEN,
  onMfeEvent,
} from '@tractor-store/shared-catalog';
import {
  TsCartCounterComponent,
  TsMiniCartComponent,
  TsScrollSceneDirective,
} from '@tractor-store/ts-design-system';

@Component({
  selector: 'decide-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    TsCartCounterComponent,
    TsMiniCartComponent,
    TsScrollSceneDirective,
  ],
  template: `
    <div class="subshell ts-scene ts-scene--autonomous" tsScrollScene>
      <div class="ts-scene__bg subshell__bg" aria-hidden="true">
        <div class="ts-scene__sky"></div>
        <div class="ts-scene__clouds">
          <span class="ts-scene__cloud ts-scene__cloud--1"></span>
          <span class="ts-scene__cloud ts-scene__cloud--2"></span>
          <span class="ts-scene__cloud ts-scene__cloud--3"></span>
        </div>
        <span class="ts-scene__sun"></span>
        <div class="ts-scene__horizon"></div>
        <div class="ts-scene__furrows"></div>
        <div class="ts-scene__fence"></div>
        <span class="ts-scene__silhouette"></span>
        <span class="ts-scene__orb ts-scene__orb--1 subshell__orb--teal"></span>
        <span class="ts-scene__orb ts-scene__orb--2"></span>
        <div class="ts-scene__vignette"></div>
        <span class="ts-scene__mesh"></span>
      </div>
      <div class="ts-scene__content">
      <header class="subshell__header">
        <a routerLink="/" class="subshell__brand">← Tractor Store</a>
        <span class="subshell__label">Product details</span>
        <div
          class="subshell__cart"
          [class.subshell__cart--open]="cartStore.itemCount() > 0"
          [class.subshell__cart--pinned]="cartPinned()"
        >
          <ts-cart-counter
            [count]="cartStore.itemCount()"
            (clicked)="goCheckout()"
          ></ts-cart-counter>
          @if (cartStore.itemCount() > 0) {
            <div class="subshell__dropdown">
              <ts-mini-cart
                [itemCount]="cartStore.itemCount()"
                [subtotal]="cartStore.subtotal()"
                [lines]="miniLines()"
                (checkout)="goCheckout()"
              ></ts-mini-cart>
            </div>
          }
        </div>
      </header>
      <main class="subshell__main">
        <router-outlet />
      </main>
      </div>
    </div>
  `,
  styles: [
    `
      .subshell__orb--teal {
        display: none;
      }

      .subshell__header {
        display: grid;
        grid-template-columns: 1fr auto auto;
        align-items: center;
        gap: var(--ts-space-md);
        padding: 0.65rem var(--ts-space-lg);
        background: linear-gradient(180deg, #141a18 0%, #1e2825 100%);
        border-bottom: 3px solid var(--ts-rust-500);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .subshell__brand {
        font-weight: 800;
        color: #f0ede6;
        text-decoration: none;
        justify-self: start;
        letter-spacing: 0.02em;
      }
      .subshell__brand:hover {
        color: var(--ts-rust-400);
      }
      .subshell__label {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #8a9a92;
      }
      .subshell__cart {
        position: relative;
        display: flex;
        align-items: center;
      }
      .subshell__dropdown {
        position: absolute;
        top: calc(100% + 0.65rem);
        right: 0;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-12px) scale(0.94);
        pointer-events: none;
        transition:
          opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.4s cubic-bezier(0.34, 1.25, 0.64, 1),
          visibility 0.4s;
        z-index: 200;
        filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
      }

      .subshell__dropdown::before {
        content: '';
        position: absolute;
        top: -6px;
        right: 1.25rem;
        width: 12px;
        height: 12px;
        background: #2a3532;
        border-left: 1px solid rgba(255, 255, 255, 0.12);
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        transform: rotate(45deg);
        border-radius: 2px 0 0 0;
      }
      .subshell__cart--open:hover .subshell__dropdown,
      .subshell__cart--open:focus-within .subshell__dropdown,
      .subshell__cart--pinned .subshell__dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto;
      }
      .subshell__main {
        flex: 1;
        max-width: var(--ts-max-width);
        width: 100%;
        margin: 0 auto;
        padding: var(--ts-space-xl) var(--ts-space-lg) var(--ts-space-3xl);
      }
    `,
  ],
})
export class DecideRootComponent implements OnInit, OnDestroy {
  readonly cartStore = inject(CartStore);
  readonly cartPinned = signal(false);
  readonly miniLines = computed(
    () =>
      this.cartStore.mini()?.preview.map((p) => ({
        sku: p.sku,
        name: p.name,
        quantity: p.quantity,
        imageUrl: p.imageUrl,
        unitPrice: p.unitPrice,
      })) ?? []
  );

  private unsubscribeCartOpen?: () => void;

  ngOnInit(): void {
    void this.cartStore.refresh();
    this.unsubscribeCartOpen = onMfeEvent(CART_PANEL_OPEN, () => {
      this.cartPinned.set(true);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeCartOpen?.();
  }

  goCheckout(): void {
    window.location.href = '/checkout';
  }
}
