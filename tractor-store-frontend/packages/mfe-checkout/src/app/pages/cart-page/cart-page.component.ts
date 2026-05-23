import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CartLineItem,
  CartStore,
  CatalogApiService,
  EXPLORE_STORE_SELECTED,
  onMfeEvent,
  OrdersApiService,
  readPickupStore,
  savePickupStore,
  StoreLocation,
} from '@tractor-store/shared-catalog';
import { TsButtonComponent } from '@tractor-store/ts-design-system';

@Component({
  selector: 'checkout-cart-page',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, TsButtonComponent],
  template: `
    <header class="page-head">
      <span class="page-head__badge">Your order</span>
      <h1>Your cart</h1>
      <p class="page-head__sub">Review your tractors and complete pickup details</p>
    </header>

    @if (cartStore.items().length === 0) {
      <div class="empty">
        <div class="empty__card ts-surface">
          <div class="empty__hero" aria-hidden="true">
            <img
              class="empty__hero-img"
              src="https://blueprint.the-tractor.store/cdn/img/scene/500/classics.webp"
              alt=""
            />
            <div class="empty__hero-overlay"></div>
          </div>
          <div class="empty__content">
            <div class="empty__icon-wrap" aria-hidden="true">
              <span class="empty__ring empty__ring--2"></span>
              <span class="empty__ring empty__ring--1"></span>
              <span class="empty__icon">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.75">
                  <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
                  <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
                  <path d="M3 4h2l2.5 12h11l2-9H7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
            <span class="empty__badge">Cart empty</span>
            <h2 class="empty__title">Your cart is waiting</h2>
            <p class="empty__lead">
              Pick a classic or autonomous tractor, choose your color, and come back to checkout in one click.
            </p>
            <div class="empty__actions">
              <a href="/" class="empty__cta">
                <span class="empty__cta-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 22V12h6v10" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                Continue shopping
                <span class="empty__cta-arrow" aria-hidden="true">→</span>
              </a>
              <a href="/categories/autonomous" class="empty__link">Explore autonomous →</a>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="checkout-layout">
        <section class="cart ts-surface">
          <div class="cart__head">
            <h2 class="cart__title">Items in your cart</h2>
            <span class="cart__count">{{ cartStore.items().length }} product(s)</span>
          </div>
          <ul class="lines">
            @for (item of cartStore.items(); track item.sku) {
              <li class="lines__item">
                <div class="lines__thumb">
                  <img
                    [src]="lineImage(item)"
                    [alt]="item.name"
                    class="lines__img"
                    loading="lazy"
                  />
                  <span class="lines__qty-badge">{{ item.quantity }}×</span>
                </div>
                <div class="lines__details">
                  <span class="lines__name">{{ item.name }}</span>
                  <span class="lines__variant">{{ item.variantLabel }}</span>
                  <span class="lines__sku">SKU {{ item.sku }}</span>
                </div>
                <div class="lines__actions">
                  <span class="lines__price">{{ item.unitPrice * item.quantity | currency }}</span>
                  <button type="button" class="lines__remove" (click)="remove(item.sku)">
                    Remove
                  </button>
                </div>
              </li>
            }
          </ul>
          <div class="cart__subtotal">
            <span class="cart__subtotal-label">Subtotal</span>
            <strong class="cart__subtotal-value">{{ cartStore.subtotal() | currency }}</strong>
          </div>
        </section>

        <section class="form-panel ts-surface">
          <div class="form-panel__head">
            <span class="form-panel__badge">Almost done</span>
            <h2>Checkout details</h2>
          </div>
          <form class="ts-form" [formGroup]="form" (ngSubmit)="submit()">
            <div class="ts-field">
              <label for="firstname">First name</label>
              <input id="firstname" formControlName="firstname" autocomplete="given-name" />
            </div>
            <div class="ts-field">
              <label for="lastname">Last name</label>
              <input id="lastname" formControlName="lastname" autocomplete="family-name" />
            </div>
            <fieldset
              class="store-picker"
              [class.store-picker--invalid]="form.controls.storeId.touched && form.controls.storeId.invalid"
            >
              <legend class="store-picker__legend">
                <span class="store-picker__badge">Pickup</span>
                Choose your store
              </legend>
              <p class="store-picker__hint">
                Tap a location below or browse all stores on the
                <a href="/stores">stores page</a>.
              </p>

              @if (stores().length === 0) {
                <div class="store-picker__loading" aria-busy="true">
                  @for (i of [1, 2, 3]; track i) {
                    <div class="store-skeleton"></div>
                  }
                </div>
              } @else {
                <ul class="store-picker__grid" role="listbox" aria-label="Pickup stores">
                  @for (store of stores(); track store.id) {
                    <li role="presentation">
                      <button
                        type="button"
                        role="option"
                        class="pick-card"
                        [class.pick-card--selected]="form.controls.storeId.value === store.id"
                        [attr.aria-selected]="form.controls.storeId.value === store.id"
                        (click)="selectPickupStore(store)"
                      >
                        <div class="pick-card__visual">
                          <img [src]="store.imageUrl" [alt]="" class="pick-card__img" loading="lazy" />
                          <div class="pick-card__overlay" aria-hidden="true"></div>
                          @if (form.controls.storeId.value === store.id) {
                            <span class="pick-card__check" aria-hidden="true">
                              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 12l5 5L19 7" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </span>
                          }
                        </div>
                        <div class="pick-card__info">
                          <span class="pick-card__name">{{ store.name }}</span>
                          <span class="pick-card__city">{{ store.city }}</span>
                          <span class="pick-card__address">{{ store.address }}</span>
                        </div>
                      </button>
                    </li>
                  }
                </ul>
              }

              @if (selectedStore; as store) {
                <p class="store-picker__confirmed">
                  <span class="store-picker__confirmed-icon" aria-hidden="true">▸</span>
                  Pickup at <strong>{{ store.name }}</strong>, {{ store.city }}
                </p>
              }
            </fieldset>

            <input type="hidden" formControlName="storeId" />
            @if (form.controls.storeId.touched && form.controls.storeId.invalid) {
              <p class="ts-error">Please select a pickup store.</p>
            }
            @if (submitError()) {
              <p class="ts-error">{{ submitError() }}</p>
            }
            <ts-button
              [disabled]="form.invalid || submitting()"
              (clicked)="submit()"
            >
              {{ submitting() ? 'Placing order…' : 'Place order' }}
            </ts-button>
          </form>
        </section>
      </div>
    }
  `,
  styles: [
    `
      .page-head {
        margin-bottom: var(--ts-space-2xl);
        padding: var(--ts-space-xl);
        border-radius: var(--ts-radius-md);
        background: linear-gradient(180deg, rgba(30, 40, 36, 0.98) 0%, rgba(20, 28, 25, 0.98) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 4px solid var(--ts-rust-500);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
      }

      .page-head__badge {
        display: inline-block;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #141a18;
        background: var(--ts-rust-400);
        padding: 0.3rem 0.7rem;
        border-radius: 3px;
        margin-bottom: var(--ts-space-sm);
      }

      .page-head h1 {
        margin: 0 0 var(--ts-space-xs);
        color: #f0ede6;
      }

      .page-head__sub {
        margin: 0;
        color: #b8c4bc;
        max-width: 32rem;
      }
      .empty {
        max-width: 36rem;
        margin: 0 auto;
      }

      .empty__card {
        overflow: hidden;
        padding: 0;
        border: 1px solid rgba(255, 255, 255, 0.75);
        box-shadow:
          0 1px 0 rgba(255, 255, 255, 0.95) inset,
          0 28px 64px rgba(10, 46, 31, 0.12);
      }

      .empty__hero {
        position: relative;
        height: 10rem;
        overflow: hidden;
      }

      .empty__hero-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        filter: saturate(1.05);
      }

      .empty__hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(6, 26, 18, 0.15) 0%,
          rgba(6, 26, 18, 0.55) 100%
        );
      }

      .empty__content {
        text-align: center;
        padding: var(--ts-space-2xl) var(--ts-space-xl) var(--ts-space-3xl);
      }

      .empty__icon-wrap {
        position: relative;
        width: 5.5rem;
        height: 5.5rem;
        margin: -4.5rem auto var(--ts-space-lg);
      }

      .empty__ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid var(--ts-green-200, var(--ts-green-100));
        animation: empty-pulse 2.5s ease-in-out infinite;
      }

      .empty__ring--2 {
        inset: -0.45rem;
        opacity: 0.45;
        animation-delay: 0.4s;
      }

      @keyframes empty-pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.06);
          opacity: 1;
        }
      }

      .empty__icon {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--ts-green-700);
        background: linear-gradient(145deg, #fff, var(--ts-green-50));
        border-radius: 50%;
        box-shadow:
          0 8px 28px rgba(10, 46, 31, 0.15),
          0 0 0 4px rgba(255, 255, 255, 0.9);
      }

      .empty__badge {
        display: inline-block;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--ts-amber-600);
        background: var(--ts-amber-100);
        padding: 0.3rem 0.7rem;
        border-radius: var(--ts-radius-pill);
        margin-bottom: var(--ts-space-sm);
      }

      .empty__title {
        margin: 0 0 var(--ts-space-sm);
        font-family: var(--ts-font-display);
        font-size: clamp(1.5rem, 3vw, 1.85rem);
        font-weight: 800;
        color: var(--ts-ink);
      }

      .empty__lead {
        margin: 0 auto var(--ts-space-xl);
        max-width: 22rem;
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--ts-ink-muted);
      }

      .empty__actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ts-space-md);
      }

      .empty__cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        min-width: 16rem;
        padding: 0.95rem 1.75rem;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        color: #fff;
        text-decoration: none;
        background: linear-gradient(135deg, var(--ts-green-500) 0%, var(--ts-green-800) 55%, var(--ts-green-900) 100%);
        border-radius: var(--ts-radius-pill);
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow:
          0 1px 0 rgba(255, 255, 255, 0.25) inset,
          0 10px 28px rgba(10, 46, 31, 0.28),
          0 0 0 0 rgba(46, 230, 143, 0);
        transition:
          transform 0.35s cubic-bezier(0.34, 1.35, 0.64, 1),
          box-shadow 0.35s ease,
          filter 0.35s ease;
      }

      .empty__cta:hover {
        color: #fff;
        transform: translateY(-3px) scale(1.02);
        filter: brightness(1.06);
        box-shadow:
          0 1px 0 rgba(255, 255, 255, 0.3) inset,
          0 16px 40px rgba(10, 46, 31, 0.32),
          0 0 24px rgba(46, 230, 143, 0.35);
      }

      .empty__cta-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
      }

      .empty__cta-arrow {
        transition: transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
      }

      .empty__cta:hover .empty__cta-arrow {
        transform: translateX(4px);
      }

      .empty__link {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--ts-green-700);
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .empty__link:hover {
        color: var(--ts-green-500);
      }

      @media (prefers-reduced-motion: reduce) {
        .empty__ring {
          animation: none;
        }
        .empty__cta:hover {
          transform: none;
        }
      }
      .checkout-layout {
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        gap: var(--ts-space-xl);
        align-items: start;
      }

      @media (min-width: 1100px) {
        .checkout-layout {
          grid-template-columns: 1fr 1.05fr;
        }
      }
      .cart,
      .form-panel {
        padding: var(--ts-space-xl);
      }

      .cart.ts-surface,
      .form-panel.ts-surface {
        background: rgba(24, 32, 28, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.12);
      }

      .cart__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ts-space-md);
        margin-bottom: var(--ts-space-lg);
        flex-wrap: wrap;
      }

      .cart__title {
        margin: 0;
        font-family: var(--ts-font-display);
        font-size: 1.2rem;
        color: #f0ede6;
      }

      .cart__count {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #141a18;
        background: var(--ts-rust-400);
        padding: 0.3rem 0.65rem;
        border-radius: 3px;
      }

      .form-panel__head {
        margin-bottom: var(--ts-space-lg);
      }

      .form-panel__badge {
        display: inline-block;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #141a18;
        background: var(--ts-rust-400);
        padding: 0.25rem 0.55rem;
        border-radius: 3px;
        margin-bottom: 0.35rem;
      }

      .form-panel__head h2 {
        margin: 0;
        font-family: var(--ts-font-display);
        font-size: 1.2rem;
        color: #f0ede6;
      }

      .lines {
        list-style: none;
        padding: 0;
        margin: 0 0 var(--ts-space-lg);
        display: flex;
        flex-direction: column;
        gap: var(--ts-space-md);
      }

      .lines__item {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: var(--ts-space-md);
        align-items: center;
        padding: var(--ts-space-md);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.28);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: border-color 0.2s ease, background 0.2s ease;
      }

      .lines__item:hover {
        border-color: rgba(217, 119, 6, 0.45);
        background: rgba(0, 0, 0, 0.38);
      }

      .lines__thumb {
        position: relative;
        flex-shrink: 0;
        width: 5.5rem;
        height: 4.25rem;
        border-radius: var(--ts-radius-md);
        overflow: hidden;
        background: var(--ts-cream-dark);
        box-shadow: 0 4px 12px rgba(10, 46, 31, 0.12);
      }

      .lines__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .lines__qty-badge {
        position: absolute;
        bottom: 0.35rem;
        left: 0.35rem;
        padding: 0.15rem 0.45rem;
        font-size: 0.72rem;
        font-weight: 800;
        color: #fff;
        background: rgba(10, 46, 31, 0.75);
        border-radius: var(--ts-radius-pill);
        backdrop-filter: blur(4px);
      }

      .lines__details {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        min-width: 0;
      }

      .lines__name {
        font-family: var(--ts-font-display);
        font-size: 1.05rem;
        font-weight: 700;
        color: #f0ede6;
        line-height: 1.2;
      }

      .lines__variant {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--ts-rust-400);
      }

      .lines__sku {
        font-size: 0.72rem;
        color: #8a9a92;
        letter-spacing: 0.04em;
      }

      .lines__actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
        text-align: right;
      }

      .lines__price {
        font-size: 1.15rem;
        font-weight: 800;
        color: #fbbf24;
        white-space: nowrap;
      }

      .lines__remove {
        padding: 0.35rem 0.75rem;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #b8c4bc;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        cursor: pointer;
        transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
      }

      .lines__remove:hover {
        color: #ff8a80;
        border-color: rgba(255, 138, 128, 0.5);
        background: rgba(198, 40, 40, 0.15);
      }

      .cart__subtotal {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--ts-space-md) var(--ts-space-lg);
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 4px solid var(--ts-rust-500);
      }

      .cart__subtotal-label {
        font-size: 0.8rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #e0ddd6;
      }

      .cart__subtotal-value {
        font-size: 1.5rem;
        font-weight: 800;
        color: #fbbf24;
      }
      /* ——— Store picker ——— */
      .store-picker {
        margin: 0;
        padding: 0;
        border: none;
        min-inline-size: 0;
      }

      .store-picker--invalid .store-picker__grid {
        outline: 2px solid #e57373;
        outline-offset: 4px;
        border-radius: var(--ts-radius-md);
      }

      .store-picker__legend {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.35rem;
        padding: 0;
        font-family: var(--ts-font-display);
        font-size: 1rem;
        font-weight: 700;
        color: #f0ede6;
      }

      .store-picker__badge {
        font-family: var(--ts-font-body);
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #141a18;
        background: var(--ts-rust-400);
        padding: 0.28rem 0.55rem;
        border-radius: 3px;
      }

      .store-picker__hint {
        margin: 0 0 var(--ts-space-md);
        font-size: 0.82rem;
        color: #b8c4bc;
        line-height: 1.45;
      }

      .store-picker__hint a {
        color: var(--ts-rust-400);
        font-weight: 700;
      }

      .store-picker__hint a:hover {
        color: #fbbf24;
      }

      .store-picker__loading {
        display: flex;
        gap: 0.65rem;
        overflow: hidden;
      }

      .store-skeleton {
        flex: 0 0 11rem;
        height: 9.5rem;
        border-radius: 4px;
        background: linear-gradient(90deg, #2a3532 25%, #3d4a44 50%, #2a3532 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 1.2s ease-in-out infinite;
      }

      @keyframes skeleton-shimmer {
        0% {
          background-position: 100% 0;
        }
        100% {
          background-position: -100% 0;
        }
      }

      .store-picker__grid {
        list-style: none;
        padding: 0.25rem 0.15rem 0.5rem;
        margin: 0 -0.15rem;
        display: flex;
        gap: 0.65rem;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scrollbar-width: thin;
        scrollbar-color: var(--ts-rust-500) transparent;
      }

      .store-picker__grid::-webkit-scrollbar {
        height: 6px;
      }

      .store-picker__grid::-webkit-scrollbar-thumb {
        background: var(--ts-rust-500);
        border-radius: 99px;
      }

      .store-picker__grid > li {
        flex: 0 0 11.5rem;
        scroll-snap-align: start;
      }

      .pick-card {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0;
        border: 2px solid rgba(255, 255, 255, 0.12);
        border-radius: 4px;
        background: rgba(10, 14, 12, 0.6);
        cursor: pointer;
        overflow: hidden;
        text-align: left;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
      }

      .pick-card:hover {
        border-color: rgba(217, 119, 6, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      }

      .pick-card--selected {
        border-color: var(--ts-rust-400);
        background: rgba(20, 28, 25, 0.95);
        box-shadow:
          0 0 0 1px var(--ts-rust-500),
          0 12px 28px rgba(0, 0, 0, 0.45);
        transform: translateY(-2px);
      }

      .pick-card__visual {
        position: relative;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: var(--ts-cream-dark);
      }

      .pick-card__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.45s ease;
      }

      .pick-card:hover .pick-card__img,
      .pick-card--selected .pick-card__img {
        transform: scale(1.06);
      }

      .pick-card__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 35%, rgba(10, 46, 31, 0.55) 100%);
        pointer-events: none;
      }

      .pick-card__check {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #141a18;
        background: var(--ts-rust-400);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        animation: check-pop 0.3s ease;
      }

      @keyframes check-pop {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .pick-card__info {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        padding: 0.55rem 0.65rem 0.7rem;
      }

      .pick-card__name {
        font-family: var(--ts-font-display);
        font-size: 0.78rem;
        font-weight: 700;
        color: #f0ede6;
        line-height: 1.25;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .pick-card__city {
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--ts-rust-400);
      }

      .pick-card__address {
        font-size: 0.68rem;
        color: #9aa8a0;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .store-picker__confirmed {
        margin: var(--ts-space-md) 0 0;
        padding: 0.55rem 0.75rem;
        font-size: 0.82rem;
        color: #e8e4dc;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 3px solid var(--ts-rust-500);
        border-radius: 4px;
        animation: confirm-in 0.3s ease both;
      }

      .store-picker__confirmed strong {
        color: #fbbf24;
      }

      @keyframes confirm-in {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .store-picker__confirmed-icon {
        margin-right: 0.25rem;
      }

      @media (max-width: 860px) {
        .checkout-layout {
          grid-template-columns: 1fr;
        }

        .lines__item {
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
        }

        .lines__actions {
          grid-column: 1 / -1;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .store-picker__grid > li {
          flex: 0 0 72vw;
          max-width: 16rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pick-card,
        .pick-card__img,
        .store-picker__confirmed,
        .store-skeleton {
          animation: none;
          transition: none;
        }
      }
    `,
  ],
})
export class CartPageComponent implements OnInit {
  readonly cartStore = inject(CartStore);
  private readonly orders = inject(OrdersApiService);
  private readonly catalog = inject(CatalogApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly stores = signal<StoreLocation[]>([]);

  readonly form = this.fb.nonNullable.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    storeId: ['', Validators.required],
  });

  private unsubscribeStore?: () => void;

  ngOnInit(): void {
    void this.cartStore.refresh();
    this.catalog.getStores().subscribe((stores) => this.stores.set(stores));

    const saved = readPickupStore();
    if (saved) {
      this.form.patchValue({ storeId: saved.storeId });
    }

    this.unsubscribeStore = onMfeEvent(EXPLORE_STORE_SELECTED, (detail) => {
      this.form.patchValue({ storeId: detail.storeId });
      savePickupStore(detail);
    });
  }

  lineImage(item: CartLineItem): string {
    return (
      item.imageUrl ??
      `https://placehold.co/400x300/145c3a/fff?text=${encodeURIComponent(item.name)}`
    );
  }

  remove(sku: string): void {
    void this.cartStore.removeItem(sku);
  }

  get selectedStore(): StoreLocation | null {
    const id = this.form.controls.storeId.value;
    return id ? this.stores().find((s) => s.id === id) ?? null : null;
  }

  selectPickupStore(store: StoreLocation): void {
    this.form.patchValue({ storeId: store.id });
    this.form.controls.storeId.markAsTouched();
    savePickupStore({ storeId: store.id, storeName: store.name });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.submitError.set(null);
    const value = this.form.getRawValue();
    const store = this.stores().find((s) => s.id === value.storeId);
    if (store) {
      savePickupStore({ storeId: store.id, storeName: store.name });
    }

    this.orders.createOrder(value).subscribe({
      next: (order) => {
        void this.cartStore.refresh();
        void this.router.navigate(['/checkout/thanks', order.id], {
          state: {
            firstname: value.firstname,
            lastname: value.lastname,
          },
        });
      },
      error: () => {
        this.submitError.set(
          'Could not place the order. Check your name, pickup store, and that items are still in the cart.'
        );
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }
}
