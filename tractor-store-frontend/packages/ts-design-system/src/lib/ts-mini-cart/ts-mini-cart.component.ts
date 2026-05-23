import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface MiniCartLine {
  sku: string;
  name: string;
  quantity: number;
  imageUrl?: string;
  unitPrice?: number;
}

@Component({
  selector: 'ts-mini-cart',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <aside class="mini" role="dialog" aria-label="Cart preview">
      <div class="mini__shine" aria-hidden="true"></div>
      <div class="mini__accent" aria-hidden="true"></div>

      <header class="mini__header">
        <div class="mini__header-left">
          <span class="mini__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 6h15l-1.5 9h-12L6 6z"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linejoin="round"
              />
              <path
                d="M6 6L5 3H2"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </span>
          <div>
            <h2 class="mini__title">Your cart</h2>
            <p class="mini__hint">Review &amp; checkout</p>
          </div>
        </div>
        <span class="mini__count">{{ itemCount }} {{ itemLabel }}</span>
      </header>

      <ul class="mini__list">
        @for (line of lines; track line.sku; let i = $index) {
          <li class="mini__line" [style.animation-delay.ms]="i * 55">
            <div class="mini__thumb">
              @if (line.imageUrl) {
                <img [src]="line.imageUrl" [alt]="line.name" loading="lazy" />
              } @else {
                <span class="mini__thumb-fallback" aria-hidden="true">TS</span>
              }
              <span class="mini__qty-badge">{{ line.quantity }}</span>
            </div>
            <div class="mini__line-body">
              <span class="mini__name">{{ line.name }}</span>
              @if (line.unitPrice != null) {
                <span class="mini__line-price">{{ line.unitPrice * line.quantity | currency }}</span>
              }
            </div>
          </li>
        } @empty {
          <li class="mini__empty">
            <span class="mini__empty-icon" aria-hidden="true">—</span>
            <p>Your cart is empty</p>
          </li>
        }
      </ul>

      @if (extraCount > 0) {
        <p class="mini__more">+{{ extraCount }} more in cart</p>
      }

      <footer class="mini__footer">
        <div class="mini__subtotal">
          <span class="mini__subtotal-label">Subtotal</span>
          <strong class="mini__subtotal-value">{{ subtotal | currency }}</strong>
        </div>
        <button class="mini__checkout" type="button" (click)="checkout.emit()">
          <span>Checkout</span>
          <span class="mini__checkout-arrow" aria-hidden="true">→</span>
        </button>
      </footer>
    </aside>
  `,
  styles: [
    `
      .mini {
        position: relative;
        overflow: hidden;
        min-width: 280px;
        max-width: 320px;
        padding: 0;
        border-radius: var(--ts-radius-md);
        background: linear-gradient(180deg, #2a3532 0%, #1e2825 100%);
        border: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55);
        animation: mini-pop 0.3s ease both;
        color: #e8e4dc;
      }

      @keyframes mini-pop {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .mini__shine {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--ts-rust-500);
      }

      .mini__accent {
        display: none;
      }

      .mini__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--ts-space-sm);
        padding: var(--ts-space-md) var(--ts-space-md) var(--ts-space-sm);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .mini__header-left {
        display: flex;
        align-items: center;
        gap: 0.55rem;
      }

      .mini__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 4px;
        color: #e8e4dc;
        background: #141a18;
        border: 1px solid var(--ts-rust-500);
      }

      .mini__icon svg {
        width: 1.15rem;
        height: 1.15rem;
      }

      .mini__title {
        margin: 0;
        font-family: var(--ts-font-display);
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: #f0ede6;
        line-height: 1.15;
      }

      .mini__hint {
        margin: 0.1rem 0 0;
        font-size: 0.68rem;
        font-weight: 600;
        color: #8a9a92;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .mini__count {
        flex-shrink: 0;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #141a18;
        background: var(--ts-rust-400);
        padding: 0.35rem 0.65rem;
        border-radius: 3px;
        border: none;
      }

      .mini__list {
        list-style: none;
        padding: var(--ts-space-sm) var(--ts-space-md);
        margin: 0;
        max-height: 200px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--ts-green-200) transparent;
      }

      .mini__line {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.5rem 0;
        animation: mini-line-in 0.4s cubic-bezier(0.34, 1.2, 0.64, 1) both;
      }

      @keyframes mini-line-in {
        from {
          opacity: 0;
          transform: translateX(-8px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .mini__line + .mini__line {
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }

      .mini__thumb {
        position: relative;
        flex-shrink: 0;
        width: 3rem;
        height: 3rem;
        border-radius: 4px;
        overflow: hidden;
        background: #141a18;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .mini__thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .mini__thumb-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: #8a9a92;
      }

      .mini__qty-badge {
        position: absolute;
        right: -4px;
        bottom: -4px;
        min-width: 1.15rem;
        height: 1.15rem;
        padding: 0 0.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.62rem;
        font-weight: 800;
        color: #141a18;
        background: var(--ts-rust-400);
        border-radius: 2px;
        border: 1px solid #1a2220;
      }

      .mini__line-body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      .mini__name {
        font-size: 0.86rem;
        font-weight: 600;
        color: #e8e4dc;
        line-height: 1.25;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .mini__line-price {
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--ts-rust-400);
      }

      .mini__empty {
        text-align: center;
        padding: var(--ts-space-lg) var(--ts-space-sm);
        color: #8a9a92;
      }

      .mini__empty-icon {
        display: block;
        font-size: 1.5rem;
        margin-bottom: 0.35rem;
        font-weight: 300;
        opacity: 0.5;
      }

      .mini__empty p {
        margin: 0;
        font-size: 0.88rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .mini__more {
        margin: 0;
        padding: 0 var(--ts-space-md) var(--ts-space-xs);
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--ts-ink-muted);
        text-align: center;
      }

      .mini__footer {
        padding: var(--ts-space-sm) var(--ts-space-md) var(--ts-space-md);
        display: flex;
        flex-direction: column;
        gap: var(--ts-space-sm);
        background: rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .mini__subtotal {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.55rem 0.75rem;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .mini__subtotal-label {
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #8a9a92;
      }

      .mini__subtotal-value {
        font-family: var(--ts-font-display);
        font-size: 1.28rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--ts-rust-400);
      }

      .mini__checkout {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        width: 100%;
        border: none;
        border-radius: 4px;
        padding: 0.82rem 1.1rem;
        cursor: pointer;
        font: inherit;
        font-weight: 800;
        font-size: 0.88rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #141a18;
        background: var(--ts-rust-400);
        box-shadow: 0 3px 0 #8b4512;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .mini__checkout:hover {
        transform: translateY(-1px);
        background: #f59e0b;
      }

      .mini__checkout:active {
        transform: translateY(2px);
        box-shadow: none;
      }

      .mini__checkout-arrow {
        display: inline-flex;
        transition: transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
      }

      .mini__checkout:hover .mini__checkout-arrow {
        transform: translateX(4px);
      }

      @media (prefers-reduced-motion: reduce) {
        .mini,
        .mini__line {
          animation: none;
        }
      }
    `,
  ],
})
export class TsMiniCartComponent {
  @Input() itemCount = 0;
  @Input() subtotal = 0;
  @Input() lines: MiniCartLine[] = [];

  @Output() checkout = new EventEmitter<void>();

  get itemLabel(): string {
    return this.itemCount === 1 ? 'item' : 'items';
  }

  get extraCount(): number {
    const shown = this.lines.reduce((sum, l) => sum + l.quantity, 0);
    return Math.max(0, this.itemCount - shown);
  }
}
