import {
  Component,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CHECKOUT_CART_UPDATED, onMfeEvent } from '@tractor-store/shared-catalog';

@Component({
  selector: 'ts-cart-counter',
  standalone: true,
  template: `
    <button
      class="counter"
      [class.counter--active]="count > 0"
      type="button"
      [attr.aria-label]="'Cart with ' + count + ' items'"
      (click)="clicked.emit()"
    >
      <span class="counter__ring" aria-hidden="true"></span>
      <span class="counter__glow" aria-hidden="true"></span>
      <svg class="counter__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 6h15l-1.5 9h-12L6 6zM6 6L5 3H2"
          stroke="currentColor"
          stroke-width="1.85"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="9" cy="20" r="1.5" fill="currentColor" />
        <circle cx="17" cy="20" r="1.5" fill="currentColor" />
      </svg>
      @if (count > 0) {
        <span class="counter__badge">{{ count > 99 ? '99+' : count }}</span>
      }
    </button>
  `,
  styles: [
    `
      .counter {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 3.1rem;
        height: 3.1rem;
        padding: 0;
        color: #e8e4dc;
        background: linear-gradient(180deg, #3a4a42 0%, #1e2825 100%);
        border: 2px solid var(--ts-rust-500);
        border-radius: 6px;
        cursor: pointer;
        box-shadow:
          0 3px 0 rgba(0, 0, 0, 0.35),
          0 8px 20px rgba(0, 0, 0, 0.4);
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          border-color 0.2s ease;
        isolation: isolate;
      }

      .counter__ring {
        display: none;
      }

      .counter__glow {
        display: none;
      }

      .counter:hover {
        transform: translateY(-2px);
        border-color: var(--ts-rust-400);
        box-shadow:
          0 3px 0 rgba(0, 0, 0, 0.35),
          0 12px 24px rgba(0, 0, 0, 0.5);
      }

      .counter:active {
        transform: translateY(1px);
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
      }

      .counter__icon {
        width: 1.45rem;
        height: 1.45rem;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
      }

      .counter__badge {
        position: absolute;
        top: -7px;
        right: -7px;
        min-width: 1.3rem;
        height: 1.3rem;
        padding: 0 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ts-rust-500);
        color: #141a18;
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.02em;
        border-radius: 3px;
        border: 2px solid #1a2220;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      }
    `,
  ],
})
export class TsCartCounterComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);

  @Input() count = 0;
  @Output() clicked = new EventEmitter<void>();

  private unsubscribe?: () => void;

  ngOnInit(): void {
    this.unsubscribe = onMfeEvent(CHECKOUT_CART_UPDATED, (detail) => {
      this.zone.run(() => {
        this.count = detail.itemCount;
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }
}
