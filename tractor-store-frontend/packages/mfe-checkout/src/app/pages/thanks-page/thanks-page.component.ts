import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order, OrdersApiService } from '@tractor-store/shared-catalog';
import { runOrderCelebration } from '../../utils/order-celebration';

@Component({
  selector: 'checkout-thanks',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="thanks-scene">
      <div class="thanks-scene__bg" aria-hidden="true">
        <div class="ts-scene__sky"></div>
        <div class="ts-scene__horizon"></div>
        <div class="ts-scene__furrows"></div>
      </div>

      <div class="thanks ts-surface thanks--celebrate">
        <div class="thanks__rings" aria-hidden="true">
          <span></span>
          <span></span>
        </div>

        <div class="thanks__icon-wrap">
          <span class="thanks__icon" aria-hidden="true">✓</span>
        </div>

        @if (buyerName(); as name) {
          <h1 class="thanks__title">Thank you, {{ name }}!</h1>
        } @else {
          <h1 class="thanks__title">Thank you for your purchase!</h1>
        }
        <p class="thanks__lead">
          Your order is confirmed. It will be ready soon at the store you selected.
        </p>

        @if (order(); as o) {
          <div class="thanks__details">
            @if (buyerName(); as name) {
              <p class="thanks__buyer">
                <span class="thanks__buyer-label">Purchased by</span>
                <strong class="thanks__buyer-name">{{ name }}</strong>
              </p>
            }
            <p class="thanks__order-line">
              Order <strong class="thanks__id">{{ o.id }}</strong>
              <span class="thanks__status">{{ o.status }}</span>
            </p>
            <p class="thanks__total">
              Total paid: <strong>{{ o.total | currency: o.currency }}</strong>
            </p>
          </div>
        } @else {
          <p class="thanks__loading">Confirming your order details…</p>
        }

        <a routerLink="/" class="thanks__cta">Back to the store</a>
      </div>
    </div>
  `,
  styles: [
    `
      .thanks-scene {
        position: relative;
        min-height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--ts-space-xl) var(--ts-space-md);
        overflow: hidden;
        border-radius: var(--ts-radius-md);
        background: rgba(14, 22, 19, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
      }

      .thanks-scene__bg {
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        border-radius: inherit;
        pointer-events: none;
      }

      .thanks-scene__bg .ts-scene__horizon {
        height: 55%;
        opacity: 0.55;
      }

      .thanks {
        position: relative;
        z-index: 3;
        max-width: 540px;
        width: 100%;
        padding: var(--ts-space-3xl) var(--ts-space-2xl);
        text-align: center;
        border: 1px solid var(--ts-border);
      }

      .thanks--celebrate {
        animation: thanks-pop 0.4s ease both;
      }

      @keyframes thanks-pop {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .thanks__rings {
        position: absolute;
        inset: -1.5rem;
        pointer-events: none;
        z-index: -1;
      }

      .thanks__rings span {
        position: absolute;
        inset: 0;
        border: 2px solid rgba(217, 119, 6, 0.35);
        border-radius: 50%;
        animation: thanks-ring 2.4s ease-out infinite;
      }

      .thanks__rings span:nth-child(2) {
        animation-delay: 0.75s;
        border-color: rgba(21, 128, 61, 0.28);
      }

      @keyframes thanks-ring {
        0% {
          transform: scale(0.88);
          opacity: 0.55;
        }
        100% {
          transform: scale(1.12);
          opacity: 0;
        }
      }

      .thanks__icon-wrap {
        position: relative;
        display: inline-flex;
        margin-bottom: var(--ts-space-lg);
      }

      .thanks__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 72px;
        height: 72px;
        background: var(--ts-rust-500);
        color: #141a18;
        font-size: 2rem;
        font-weight: 800;
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      }

      .thanks__title {
        margin: 0 0 var(--ts-space-sm);
        font-family: var(--ts-font-display);
        font-size: clamp(1.75rem, 4vw, 2.25rem);
        animation: fade-up 0.6s ease 0.35s both;
      }

      .thanks__lead {
        color: var(--ts-ink-muted);
        font-size: 1.05rem;
        line-height: 1.6;
        margin: 0 0 var(--ts-space-xl);
        animation: fade-up 0.6s ease 0.45s both;
      }

      .thanks__details {
        padding: var(--ts-space-lg);
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 4px solid var(--ts-rust-500);
        border-radius: var(--ts-radius-md);
        margin-bottom: var(--ts-space-xl);
        animation: fade-up 0.6s ease 0.55s both;
      }

      .thanks__buyer {
        margin: 0 0 var(--ts-space-md);
        padding-bottom: var(--ts-space-md);
        border-bottom: 1px dashed rgba(18, 24, 22, 0.1);
      }

      .thanks__buyer-label {
        display: block;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ts-ink-faint);
        margin-bottom: 0.25rem;
      }

      .thanks__buyer-name {
        font-family: var(--ts-font-display);
        font-size: 1.35rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        background: linear-gradient(
          105deg,
          var(--ts-green-900),
          var(--ts-green-600)
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .thanks__order-line {
        margin: 0;
      }

      .thanks__id {
        font-family: monospace;
        font-size: 0.85rem;
        word-break: break-all;
      }

      .thanks__status {
        display: inline-block;
        margin-left: 0.5rem;
        padding: 0.2rem 0.55rem;
        background: var(--ts-green-700);
        color: #fff;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        border-radius: var(--ts-radius-pill);
      }

      .thanks__total {
        margin: var(--ts-space-md) 0 0;
        font-size: 1.1rem;
      }

      .thanks__total strong {
        color: var(--ts-green-800);
        font-size: 1.4rem;
      }

      .thanks__loading {
        animation: fade-up 0.6s ease 0.5s both;
      }

      .thanks__cta {
        display: inline-flex;
        padding: 0.9rem 2rem;
        background: var(--ts-rust-400);
        color: #141a18;
        border-radius: 4px;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        text-decoration: none;
        box-shadow: 0 3px 0 #8b4512;
        animation: fade-up 0.6s ease 0.65s both;
        transition: transform 0.2s ease, background 0.2s ease;
      }

      .thanks__cta:hover {
        transform: translateY(-1px);
        background: #f59e0b;
        color: #141a18;
      }

      @keyframes fade-up {
        from {
          opacity: 0;
          transform: translateY(14px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .thanks--celebrate,
        .thanks__title,
        .thanks__lead,
        .thanks__details,
        .thanks__cta,
        .thanks__rings span {
          animation: none;
        }

        .thanks__rings {
          display: none;
        }
      }
    `,
  ],
})
export class ThanksPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orders = inject(OrdersApiService);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        runOrderCelebration();
      }
    });
  }
  readonly order = signal<Order | null>(null);
  private readonly checkoutName = signal<{ first: string; last: string } | null>(
    null
  );

  readonly buyerName = computed(() => {
    const o = this.order();
    if (o?.firstname?.trim()) {
      return `${o.firstname} ${o.lastname}`.trim();
    }
    const pending = this.checkoutName();
    if (pending?.first?.trim()) {
      return `${pending.first} ${pending.last}`.trim();
    }
    return null;
  });

  ngOnInit(): void {
    const navState = this.router.getCurrentNavigation()?.extras.state as
      | { firstname?: string; lastname?: string }
      | undefined;
    const historyState = history.state as {
      firstname?: string;
      lastname?: string;
    };
    const first = navState?.firstname ?? historyState?.firstname;
    const last = navState?.lastname ?? historyState?.lastname;
    if (first?.trim()) {
      this.checkoutName.set({ first: first.trim(), last: (last ?? '').trim() });
    }

    const id = this.route.snapshot.paramMap.get('orderId');
    if (id) {
      this.orders.getOrder(id).subscribe({
        next: (o) => this.order.set(o),
        error: () => this.order.set(null),
      });
    }
  }
}
