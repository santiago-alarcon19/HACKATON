import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ts-product-card',
  standalone: true,
  template: `
    <article class="card">
      <div class="card__media">
        <img [src]="imageUrl" [alt]="name" class="card__image" loading="lazy" />
        <span class="card__shine"></span>
      </div>
      <div class="card__body">
        <h3 class="card__title">{{ name }}</h3>
        <p class="card__price">
          <span class="card__price-label">From</span>
          {{ priceFrom | currency }}
        </p>
        <button class="card__cta" type="button" (click)="select.emit()">
          View details
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  `,
  imports: [CurrencyPipe],
  styles: [
    `
      @import '../tokens.scss';
      .card {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--ts-radius-md);
        overflow: hidden;
        background: linear-gradient(180deg, #2a3532 0%, #1e2825 100%);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
        color: #e8e4dc;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
      }
      .card__media {
        position: relative;
        overflow: hidden;
        display: block;
      }
      .card__image {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        display: block;
        transition: transform 0.45s ease;
      }
      .card:hover .card__image {
        transform: scale(1.06);
      }
      .card__shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 55%,
          rgba(10, 46, 31, 0.35) 100%
        );
        pointer-events: none;
      }
      .card__body {
        padding: var(--ts-space-lg);
        display: block;
      }
      .card__title {
        margin: 0 0 var(--ts-space-sm);
        font-family: var(--ts-font-display);
        font-size: 1.15rem;
        font-weight: 700;
        line-height: 1.25;
        color: #f0ede6;
      }
      .card__price {
        margin: 0 0 var(--ts-space-lg);
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--ts-rust-400);
      }
      .card__price-label {
        display: block;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #8a9a92;
        margin-bottom: 0.15rem;
      }
      .card__cta {
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: var(--ts-rust-400);
        color: #141a18;
        border: none;
        border-radius: 4px;
        padding: 0.7rem 1rem;
        cursor: pointer;
        font: inherit;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-size: 0.8rem;
        transition: background 0.2s ease;
      }
      .card__cta:hover {
        background: #f59e0b;
        color: #141a18;
      }
    `,
  ],
})
export class TsProductCardComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) imageUrl!: string;
  @Input({ required: true }) priceFrom!: number;
  @Output() select = new EventEmitter<void>();
}
