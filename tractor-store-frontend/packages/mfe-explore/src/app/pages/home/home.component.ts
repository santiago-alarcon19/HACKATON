import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CatalogApiService,
  HomePayload,
  ProductSummary,
} from '@tractor-store/shared-catalog';
import { TsProductCardComponent, TsRevealDirective } from '@tractor-store/ts-design-system';

@Component({
  selector: 'explore-home',
  standalone: true,
  imports: [RouterLink, TsProductCardComponent, TsRevealDirective],
  template: `
    @if (home(); as data) {
      <section class="hero" tsReveal>
        <div class="hero__content">
          <span class="hero__eyebrow">Built for the field</span>
          <h1>{{ data.hero.title }}</h1>
          <p class="hero__subtitle">{{ data.hero.subtitle }}</p>
          <div class="hero__actions">
            <a routerLink="/categories/classic" class="hero__cta hero__cta--primary">Shop classics</a>
            <a routerLink="/categories/autonomous" class="hero__cta hero__cta--ghost">Explore autonomous</a>
          </div>
        </div>
        <div class="hero__visual">
          <img
            [src]="heroImageUrl() ?? data.hero.imageUrl"
            alt=""
            class="hero__img"
            (error)="onHeroImageError(data)"
          />
        </div>
      </section>

      @if (data.featured.length) {
        <section class="ts-section" tsReveal>
          <div class="ts-section__head">
            <div>
              <span class="ts-section__label">Curated for you</span>
              <h2>Featured tractors</h2>
            </div>
          </div>
          <div class="ts-grid">
            @for (product of data.featured; track product.id) {
              <ts-product-card
                [name]="product.name"
                [imageUrl]="product.imageUrl"
                [priceFrom]="product.priceFrom"
                (select)="openProduct(product)"
              />
            }
          </div>
        </section>
      }

      <section class="ts-section ts-reveal--delay-1" tsReveal>
        <div class="ts-section__head">
          <div>
            <span class="ts-section__label">Browse by type</span>
            <h2>Categories</h2>
          </div>
        </div>
        <div class="categories">
          @for (cat of data.categories; track cat.filter) {
            <a
              [routerLink]="['/categories', cat.filter]"
              class="category-card"
              [class.category-card--classic]="cat.filter === 'classic'"
              [class.category-card--autonomous]="cat.filter === 'autonomous'"
            >
              <div class="category-card__media">
                <img
                  [src]="cat.imageUrl"
                  [alt]="cat.title"
                  class="category-card__img"
                  loading="lazy"
                />
                <div class="category-card__overlay" aria-hidden="true"></div>
                <span class="category-card__badge">{{ categoryBadge(cat.filter) }}</span>
              </div>
              <div class="category-card__panel">
                <h3 class="category-card__title">{{ cat.title }}</h3>
                <p class="category-card__desc">{{ categoryDesc(cat.filter) }}</p>
                <span class="category-card__cta">
                  Explore collection
                  <span class="category-card__arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          }
        </div>
      </section>
    } @else if (loading()) {
      <div class="ts-loading">
        <div class="ts-loading__spinner"></div>
        <p>Loading the finest tractors…</p>
      </div>
    }
  `,
  styles: [
    `
      .hero {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--ts-space-2xl);
        align-items: center;
        margin-bottom: var(--ts-space-3xl);
        padding: var(--ts-space-2xl);
        background: linear-gradient(180deg, rgba(30, 40, 36, 0.95) 0%, rgba(20, 28, 25, 0.98) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-left: 4px solid var(--ts-rust-500);
        border-radius: var(--ts-radius-md);
        box-shadow: 0 24px 56px rgba(0, 0, 0, 0.4);
        overflow: hidden;
        position: relative;
      }
      .hero::before {
        display: none;
      }
      .hero__eyebrow {
        display: inline-block;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--ts-rust-400);
        margin-bottom: var(--ts-space-sm);
      }
      .hero h1 {
        margin: 0 0 var(--ts-space-md);
        color: #f0ede6;
      }
      .hero__subtitle {
        font-size: 1.1rem;
        color: #b8c4bc;
        max-width: 28rem;
        margin-bottom: var(--ts-space-xl);
      }
      .hero__actions {
        display: flex;
        gap: var(--ts-space-md);
        flex-wrap: wrap;
      }
      .hero__cta {
        display: inline-flex;
        align-items: center;
        padding: 0.85rem 1.5rem;
        border-radius: 4px;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-size: 0.85rem;
        text-decoration: none;
        transition: transform 0.2s ease, background 0.2s ease;
      }
      .hero__cta--primary {
        background: var(--ts-rust-400);
        color: #141a18;
        box-shadow: 0 3px 0 #8b4512;
      }
      .hero__cta--primary:hover {
        transform: translateY(-1px);
        background: #f59e0b;
        color: #141a18;
      }
      .hero__cta--ghost {
        background: transparent;
        color: #e8e4dc;
        border: 2px solid rgba(255, 255, 255, 0.25);
      }
      .hero__cta--ghost:hover {
        background: rgba(255, 255, 255, 0.06);
        color: #f0ede6;
      }
      .hero__visual {
        position: relative;
        border-radius: var(--ts-radius-lg);
        overflow: hidden;
        box-shadow: var(--ts-shadow-lg);
      }
      .hero__img {
        width: 100%;
        aspect-ratio: 16/10;
        object-fit: cover;
        display: block;
      }
      .categories {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--ts-space-xl);
      }

      .category-card {
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: var(--ts-radius-md);
        text-decoration: none;
        color: inherit;
        overflow: hidden;
        background: #2a3532;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }

      .category-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 28px 56px rgba(0, 0, 0, 0.45);
      }

      .category-card__media {
        position: relative;
        aspect-ratio: 16 / 10;
        overflow: hidden;
      }

      .category-card__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .category-card:hover .category-card__img {
        transform: scale(1.08);
      }

      .category-card__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 55%,
          rgba(10, 46, 31, 0.35) 100%
        );
        pointer-events: none;
      }

      .category-card--classic .category-card__overlay,
      .category-card--autonomous .category-card__overlay {
        background: linear-gradient(
          180deg,
          transparent 50%,
          rgba(0, 0, 0, 0.65) 100%
        );
      }

      .category-card__badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        padding: 0.35rem 0.75rem;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #141a18;
        border-radius: 3px;
        background: var(--ts-rust-400);
      }

      .category-card__panel {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.2rem 1.35rem 1.35rem;
        background: rgba(20, 28, 25, 0.95);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .category-card__title {
        margin: 0;
        font-family: var(--ts-font-display);
        font-size: clamp(1.25rem, 2.5vw, 1.6rem);
        font-weight: 800;
        color: #f0ede6;
        line-height: 1.2;
      }

      .category-card__desc {
        margin: 0;
        font-size: 0.88rem;
        line-height: 1.55;
        color: #9aa8a0;
      }

      .category-card__cta {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        align-self: flex-start;
        margin-top: 0.35rem;
        padding: 0.55rem 1.05rem;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #141a18;
        background: var(--ts-rust-400);
        border-radius: 4px;
        transition: transform 0.2s ease, background 0.2s ease;
      }

      .category-card:hover .category-card__cta {
        color: #141a18;
        transform: translateX(3px);
        background: #f59e0b;
      }

      .category-card__arrow {
        display: inline-block;
        transition: transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
      }

      .category-card:hover .category-card__arrow {
        transform: translateX(4px);
      }

      @media (max-width: 720px) {
        .categories {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 860px) {
        .hero {
          grid-template-columns: 1fr;
        }
        .hero__visual {
          order: -1;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly catalog = inject(CatalogApiService);
  readonly home = signal<HomePayload | null>(null);
  readonly loading = signal(true);
  readonly heroImageUrl = signal<string | null>(null);

  onHeroImageError(data: HomePayload): void {
    const fallback =
      data.featured[0]?.imageUrl ??
      'https://blueprint.the-tractor.store/cdn/img/scene/500/classics.webp';
    this.heroImageUrl.set(fallback);
  }

  ngOnInit(): void {
    this.catalog.getHome().subscribe({
      next: (data) => {
        this.home.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openProduct(product: ProductSummary): void {
    window.location.href = `/product/${product.id}`;
  }

  categoryBadge(filter: string): string {
    return filter === 'autonomous' ? 'Autonomous' : 'Classic';
  }

  categoryDesc(filter: string): string {
    if (filter === 'autonomous') {
      return 'GPS-guided, solar-ready machines built for precision and smart farming.';
    }
    return 'Time-tested workhorses with rugged builds and legendary field reliability.';
  }
}
