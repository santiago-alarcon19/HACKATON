import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TsScrollSceneDirective } from '@tractor-store/ts-design-system';

@Component({
  selector: 'checkout-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TsScrollSceneDirective],
  template: `
    <div class="subshell ts-scene" tsScrollScene>
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
        <span class="ts-scene__orb ts-scene__orb--1 checkout__orb--gold"></span>
        <span class="ts-scene__orb ts-scene__orb--2"></span>
        <div class="ts-scene__vignette"></div>
        <span class="ts-scene__mesh"></span>
      </div>
      <div class="ts-scene__content">
      <header class="subshell__header">
        <a routerLink="/" class="subshell__back">
          <span class="subshell__back-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          Continue shopping
        </a>
        <div class="subshell__title-wrap">
          <span class="subshell__step">Secure checkout</span>
          <span class="subshell__label">Checkout</span>
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
      .checkout__orb--gold {
        display: none;
      }

      .subshell__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ts-space-lg);
        padding: var(--ts-space-md) var(--ts-space-lg);
        background: linear-gradient(180deg, #141a18 0%, #1e2825 100%);
        color: #e8e4dc;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
        border-bottom: 3px solid var(--ts-rust-500);
      }

      .subshell__back {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.55rem 1rem 0.55rem 0.55rem;
        font-size: 0.85rem;
        font-weight: 800;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        color: #e8e4dc;
        text-decoration: none;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        transition: background 0.2s ease, border-color 0.2s ease;
      }

      .subshell__back:hover {
        color: #f0ede6;
        border-color: var(--ts-rust-400);
        background: rgba(255, 255, 255, 0.1);
      }

      .subshell__back-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        color: #141a18;
        background: var(--ts-rust-400);
      }

      .subshell__title-wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.15rem;
        text-align: right;
      }

      .subshell__step {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.75);
      }

      .subshell__label {
        font-family: var(--ts-font-display);
        font-size: 1.2rem;
        font-weight: 800;
        letter-spacing: -0.02em;
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
export class CheckoutRootComponent {}
