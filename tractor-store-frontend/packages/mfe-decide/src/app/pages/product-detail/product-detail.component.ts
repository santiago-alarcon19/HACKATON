import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CartStore,
  CART_PANEL_OPEN,
  CatalogApiService,
  dispatchMfeEvent,
  InventoryApiService,
  ProductDetail,
  ProductVariant,
} from '@tractor-store/shared-catalog';
import {
  TsButtonComponent,
  TsVariantOptionComponent,
} from '@tractor-store/ts-design-system';

@Component({
  selector: 'decide-product-detail',
  standalone: true,
  imports: [CurrencyPipe, TsButtonComponent, TsVariantOptionComponent],
  template: `
    @if (product(); as p) {
      <article class="detail">
        <div class="detail__gallery ts-surface">
          <img
            [src]="selectedImage()"
            [alt]="p.name + ' — ' + (selectedVariant()?.label ?? '')"
            class="detail__img"
            [class.detail__img--fade]="imageFade()"
          />
        </div>
        <div class="detail__panel ts-surface">
          <span class="detail__category">{{ p.category }}</span>
          <h1>{{ p.name }}</h1>
          <p class="detail__desc">{{ p.description }}</p>

          <div class="detail__price">
            @if (selectedVariant(); as v) {
              <span class="detail__price-label">{{ v.label }}</span>
              <strong>{{ v.price | currency }}</strong>
            } @else {
              From <strong>{{ p.priceFrom | currency }}</strong>
            }
          </div>

          @if (p.variants.length > 1) {
            <h2 class="detail__heading">Choose your variant</h2>
            <div class="detail__variants" role="group" aria-label="Color variants">
              @for (variant of p.variants; track variant.sku) {
                <ts-variant-option
                  class="variant"
                  [label]="variant.label"
                  [price]="variant.price"
                  [colorHex]="variant.attributes['color']"
                  [selected]="selectedSku() === variant.sku"
                  [disabled]="variant.inStock === false"
                  (selectedChange)="selectVariant(variant)"
                />
              }
            </div>
          }

          @if (stock() !== null) {
            <p class="stock" [class.stock--low]="stock()! < 5">
              <span class="stock__dot"></span>
              {{ stock() }} units in stock
            </p>
          }

          <div class="detail__actions">
            <ts-button
              [disabled]="!selectedSku() || adding() || stock() === 0"
              (clicked)="addToCart()"
            >
              {{ adding() ? 'Adding to cart…' : 'Add to cart' }}
            </ts-button>
          </div>

          @if (message()) {
            <p class="message" [class.message--error]="message()!.includes('Could')">
              {{ message() }}
            </p>
          }
        </div>
      </article>
    } @else {
      <div class="ts-loading">
        <div class="ts-loading__spinner"></div>
        <p>Loading product…</p>
      </div>
    }
  `,
  styles: [
    `
      .detail {
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: var(--ts-space-2xl);
        align-items: start;
      }
      .detail__gallery {
        overflow: hidden;
        padding: 0;
      }
      .detail__img {
        width: 100%;
        aspect-ratio: 4/3;
        object-fit: cover;
        display: block;
        transition: opacity 0.35s ease;
      }
      .detail__img--fade {
        opacity: 0.35;
      }
      .detail__panel {
        padding: var(--ts-space-2xl);
      }
      .detail__category {
        display: inline-block;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ts-amber-600);
        margin-bottom: var(--ts-space-sm);
      }
      .detail h1 {
        margin: 0 0 var(--ts-space-md);
      }
      .detail__desc {
        color: var(--ts-ink-muted);
        line-height: 1.7;
      }
      .detail__price {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        font-size: 1.1rem;
        color: var(--ts-ink-muted);
        margin-bottom: var(--ts-space-xl);
        padding: var(--ts-space-md);
        background: var(--ts-green-50);
        border-radius: var(--ts-radius-md);
      }
      .detail__price-label {
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--ts-green-700);
      }
      .detail__price strong {
        font-size: 1.5rem;
        color: var(--ts-green-800);
      }
      .detail__heading {
        font-size: 1rem;
        margin: 0 0 var(--ts-space-md);
      }
      .detail__variants {
        display: flex;
        flex-direction: column;
        gap: var(--ts-space-sm);
        margin-bottom: var(--ts-space-lg);
      }
      .variant {
        display: block;
      }
      .stock {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: var(--ts-green-700);
        margin: 0 0 var(--ts-space-lg);
      }
      .stock--low {
        color: var(--ts-amber-600);
      }
      .stock__dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
      }
      .detail__actions {
        margin-top: var(--ts-space-md);
      }
      .message {
        margin-top: var(--ts-space-md);
        padding: var(--ts-space-md);
        border-radius: var(--ts-radius-md);
        background: var(--ts-green-50);
        color: var(--ts-green-800);
        font-weight: 600;
      }
      .message--error {
        background: #fdecea;
        color: #c62828;
      }
      @media (max-width: 900px) {
        .detail {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogApiService);
  private readonly inventory = inject(InventoryApiService);
  private readonly cartStore = inject(CartStore);

  readonly product = signal<ProductDetail | null>(null);
  readonly selectedSku = signal<string | null>(null);
  readonly stock = signal<number | null>(null);
  readonly adding = signal(false);
  readonly message = signal<string | null>(null);
  readonly imageFade = signal(false);

  readonly selectedVariant = computed(() => {
    const p = this.product();
    const sku = this.selectedSku();
    if (!p || !sku) return null;
    return p.variants.find((v) => v.sku === sku) ?? null;
  });

  readonly selectedImage = computed(
    () => this.selectedVariant()?.imageUrl ?? this.product()?.images[0] ?? ''
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? 'classic-01';
    this.catalog.getProduct(id).subscribe((p) => {
      this.product.set(p);
      const first = p.variants.find((v) => v.inStock !== false) ?? p.variants[0];
      if (first) {
        this.selectVariant(first);
      }
      this.refreshVariantStock(p.variants);
    });
  }

  selectVariant(variant: ProductVariant): void {
    if (this.selectedSku() === variant.sku) {
      return;
    }

    this.imageFade.set(true);
    this.selectedSku.set(variant.sku);
    this.message.set(null);

    requestAnimationFrame(() => {
      this.imageFade.set(false);
    });

    this.inventory.getBySku(variant.sku).subscribe({
      next: (inv) => this.stock.set(inv.available),
      error: () => this.stock.set(null),
    });
  }

  private refreshVariantStock(variants: ProductVariant[]): void {
    for (const variant of variants) {
      this.inventory.getBySku(variant.sku).subscribe({
        next: (inv) => {
          variant.inStock = inv.available > 0;
          if (this.selectedSku() === variant.sku) {
            this.stock.set(inv.available);
          }
        },
        error: () => {
          variant.inStock = false;
        },
      });
    }
  }

  async addToCart(): Promise<void> {
    const sku = this.selectedSku();
    if (!sku || this.stock() === 0) return;
    this.adding.set(true);
    this.message.set(null);
    try {
      await this.cartStore.addItem(sku, 1);
      dispatchMfeEvent(CART_PANEL_OPEN, {});
      this.message.set('Added to cart! Review your cart above or go to checkout.');
    } catch {
      this.message.set('Could not add to cart. Please try again.');
    } finally {
      this.adding.set(false);
    }
  }
}
