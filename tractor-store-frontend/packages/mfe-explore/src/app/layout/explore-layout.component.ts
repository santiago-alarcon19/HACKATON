import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CartStore, CART_PANEL_OPEN, onMfeEvent } from '@tractor-store/shared-catalog';
import {
  TsCartCounterComponent,
  TsMiniCartComponent,
  TsScrollSceneDirective,
} from '@tractor-store/ts-design-system';

@Component({
  selector: 'explore-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TsCartCounterComponent,
    TsMiniCartComponent,
    TsScrollSceneDirective,
  ],
  template: `
    <div class="app ts-scene" tsScrollScene>
      <div class="ts-scene__bg" aria-hidden="true">
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
        <div class="ts-scene__barn" aria-hidden="true"></div>
        <span class="ts-scene__silhouette"></span>
        <span class="ts-scene__orb ts-scene__orb--1"></span>
        <span class="ts-scene__orb ts-scene__orb--2"></span>
        <span class="ts-scene__orb ts-scene__orb--3"></span>
        <div class="ts-scene__vignette"></div>
        <span class="ts-scene__mesh"></span>
      </div>

      <div class="ts-scene__content app__content">
      <header class="header">
        <div class="header__inner">
          <a routerLink="/" class="header__brand" aria-label="Tractor Store home">
            <span class="header__mark-wrap" aria-hidden="true">
              <span class="header__mark-glow"></span>
              <span class="header__mark-ring"></span>
              <span class="header__mark">T</span>
            </span>
            <span class="header__text">
              <span class="header__eyebrow">Micro Frontends · 2.0</span>
              <span class="header__title">
                <span class="header__title-word">Tractor</span>
                <span class="header__title-word header__title-word--accent">Store</span>
              </span>
              <span class="header__swoosh" aria-hidden="true"></span>
            </span>
          </a>

          <nav class="header__nav" aria-label="Main">
            <div class="header__nav-pills">
              <a
                routerLink="/"
                routerLinkActive="is-active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="nav-link nav-link--home"
                >Home</a
              >
              <a
                routerLink="/categories/classic"
                routerLinkActive="is-active"
                class="nav-link nav-link--classic"
                >Classic</a
              >
              <a
                routerLink="/categories/autonomous"
                routerLinkActive="is-active"
                class="nav-link nav-link--autonomous"
                >Autonomous</a
              >
              <a routerLink="/stores" routerLinkActive="is-active" class="nav-link nav-link--stores">Stores</a>
            </div>
          </nav>

          <div
            class="header__cart"
            [class.header__cart--open]="cartStore.itemCount() > 0"
            [class.header__cart--pinned]="cartPinned()"
          >
            <ts-cart-counter
              [count]="cartStore.itemCount()"
              (clicked)="goCheckout()"
            ></ts-cart-counter>
            @if (cartStore.itemCount() > 0) {
              <div class="header__dropdown">
                <ts-mini-cart
                  [itemCount]="cartStore.itemCount()"
                  [subtotal]="cartStore.subtotal()"
                  [lines]="miniLines()"
                  (checkout)="goCheckout()"
                ></ts-mini-cart>
              </div>
            }
          </div>
        </div>
      </header>

      <main class="main">
        <div class="main__stage" [class.main__stage--animate]="pageAnim()">
          <router-outlet />
        </div>
      </main>

      <footer class="footer">
        <div class="footer__inner">
          <p class="footer__copy">© {{ year }} Tractor Store · Team Explore</p>
        </div>
      </footer>
      </div>
    </div>
  `,
  styles: [
    `
      .app__content {
        width: 100%;
      }

      .header {
        position: sticky;
        top: 0;
        z-index: 100;
        min-height: 4.25rem;
        background: linear-gradient(
          180deg,
          rgba(14, 22, 19, 0.97) 0%,
          rgba(20, 32, 28, 0.94) 100%
        );
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 3px solid var(--ts-rust-500);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
      }

      .header__inner {
        max-width: var(--ts-max-width);
        height: 100%;
        margin: 0 auto;
        padding: 0 var(--ts-space-lg);
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: var(--ts-space-md);
      }

      .header a {
        text-decoration: none;
      }

      .header__brand {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.35rem 0.5rem 0.35rem 0.35rem;
        border-radius: var(--ts-radius-lg);
        flex-shrink: 0;
        transition:
          transform 0.45s cubic-bezier(0.34, 1.35, 0.64, 1),
          box-shadow 0.45s ease,
          background 0.45s ease;
      }

      .header__brand:hover {
        transform: translateY(-1px);
        background: rgba(255, 255, 255, 0.04);
      }

      .header__mark-wrap {
        position: relative;
        width: 2.65rem;
        height: 2.65rem;
        flex-shrink: 0;
      }

      .header__mark-glow {
        display: none;
      }

      .header__mark-ring {
        position: absolute;
        inset: -2px;
        border-radius: 8px;
        border: 2px solid var(--ts-rust-500);
        opacity: 0.9;
      }

      .header__mark {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: var(--ts-font-display);
        font-weight: 800;
        font-size: 1.2rem;
        color: #e8e4dc;
        background: linear-gradient(180deg, #2d3b34 0%, #1a2220 100%);
        border-radius: 6px;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          0 4px 12px rgba(0, 0, 0, 0.4);
        transition: transform 0.25s ease;
      }

      .header__text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.05rem;
        line-height: 1.05;
      }

      .header__eyebrow {
        font-size: 0.58rem;
        font-weight: 800;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #8a9a92;
      }

      .header__title {
        display: inline-flex;
        align-items: baseline;
        gap: 0.28rem;
        font-family: var(--ts-font-display);
        font-weight: 800;
        font-size: 1.22rem;
        letter-spacing: -0.03em;
        white-space: nowrap;
      }

      .header__title-word {
        color: #f0ede6;
      }

      .header__title-word--accent {
        color: var(--ts-rust-400);
      }

      .header__swoosh {
        display: block;
        width: 100%;
        max-width: 7.5rem;
        height: 3px;
        margin-top: 0.15rem;
        background: var(--ts-rust-500);
        opacity: 0.85;
      }

      /* ——— Animated pill nav ——— */
      .header__nav {
        justify-self: center;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }

      .header__nav-pills {
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
        padding: 0.25rem;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }

      .nav-link {
        position: relative;
        padding: 0.45rem 0.9rem;
        border-radius: 4px;
        font-size: 0.8125rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: #9aa8a0;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        isolation: isolate;
        transition:
          color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1),
          box-shadow 0.4s ease,
          filter 0.4s ease;
      }

      .nav-link::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        opacity: 0;
        transform: scale(0.85);
        transition:
          opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.45s cubic-bezier(0.34, 1.25, 0.64, 1);
        z-index: -1;
      }

      .nav-link:hover {
        color: #e0ddd6;
      }

      .nav-link:hover::before {
        opacity: 1;
        background: rgba(255, 255, 255, 0.08);
        transform: scale(1);
      }

      .nav-link.is-active {
        color: #141a18;
        transform: none;
        box-shadow: none;
      }

      .nav-link.is-active::before {
        opacity: 1;
        transform: scale(1);
        background: var(--ts-rust-400);
      }

      .nav-link--classic.is-active::before,
      .nav-link--autonomous.is-active::before,
      .nav-link--home.is-active::before,
      .nav-link--stores.is-active::before {
        background: var(--ts-rust-400);
      }

      .nav-link.is-active::after {
        display: none;
      }

      .header__cart {
        position: relative;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        padding: 0.15rem;
      }

      .header__dropdown {
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

      .header__dropdown::before {
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

      .header__cart--open:hover .header__dropdown,
      .header__cart--open:focus-within .header__dropdown,
      .header__cart--pinned .header__dropdown {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .main {
        flex: 1;
        max-width: var(--ts-max-width);
        width: 100%;
        margin: 0 auto;
        padding: var(--ts-space-xl) var(--ts-space-lg) var(--ts-space-3xl);
        position: relative;
      }

      .main::before {
        content: '';
        position: absolute;
        inset: var(--ts-space-lg) var(--ts-space-md);
        border-radius: var(--ts-radius-md);
        background: rgba(20, 28, 25, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.08);
        pointer-events: none;
        z-index: -1;
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
      }

      .main__stage--animate {
        animation: page-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @keyframes page-enter {
        from {
          opacity: 0;
          transform: translateY(18px);
          filter: blur(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      }

      .footer {
        margin-top: auto;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(14, 22, 19, 0.9);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      .footer__inner {
        max-width: var(--ts-max-width);
        margin: 0 auto;
        padding: var(--ts-space-md) var(--ts-space-lg);
        text-align: center;
      }

      .footer__copy {
        margin: 0;
        font-size: 0.78rem;
        color: #8a9a92;
      }

      @media (max-width: 720px) {
        .header__inner {
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
          height: auto;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          row-gap: 0.45rem;
        }

        .header {
          height: auto;
        }

        .header__nav {
          grid-column: 1 / -1;
          justify-self: stretch;
          justify-content: center;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .header__nav::-webkit-scrollbar {
          display: none;
        }

        .header__eyebrow {
          display: none;
        }

        .header__title {
          font-size: 1rem;
        }

        .header__mark-wrap {
          width: 2.25rem;
          height: 2.25rem;
        }

        .header__mark {
          font-size: 1rem;
        }

        .header__swoosh {
          max-width: 5.5rem;
          height: 0.28rem;
        }

        .header__dropdown {
          display: none;
        }

        .nav-link.is-active {
          transform: translateY(-1px) scale(1);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .main__stage,
        .nav-link,
        .nav-link::before,
        .nav-link.is-active::after,
        .header__mark-glow {
          animation: none;
          transition: none;
        }

        .header__brand:hover .header__mark {
          transform: none;
        }
      }
    `,
  ],
})
export class ExploreLayoutComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  readonly cartStore = inject(CartStore);
  readonly cartPinned = signal(false);
  readonly pageAnim = signal(true);
  readonly year = new Date().getFullYear();
  private unsubscribeCartOpen?: () => void;
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

  ngOnInit(): void {
    void this.cartStore.refresh();
    this.unsubscribeCartOpen = onMfeEvent(CART_PANEL_OPEN, () => {
      this.cartPinned.set(true);
    });
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.pageAnim.set(false);
        requestAnimationFrame(() => this.pageAnim.set(true));
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeCartOpen?.();
  }

  goCheckout(): void {
    window.location.href = '/checkout';
  }
}
