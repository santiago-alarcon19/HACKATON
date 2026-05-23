import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  CatalogApiService,
  CategoryGroup,
  ProductSummary,
} from '@tractor-store/shared-catalog';
import { TsProductCardComponent } from '@tractor-store/ts-design-system';
import { distinctUntilChanged, filter, map, merge, of, switchMap } from 'rxjs';

@Component({
  selector: 'explore-categories',
  standalone: true,
  imports: [TsProductCardComponent],
  template: `
    @if (group(); as g) {
      <header class="page-head">
        <span class="page-head__badge">{{ g.filter }}</span>
        <h1>{{ g.title }}</h1>
        <p class="page-head__sub">{{ g.products.length }} tractors ready for the field</p>
      </header>
      <div class="ts-grid">
        @for (product of g.products; track product.id) {
          <ts-product-card
            [name]="product.name"
            [imageUrl]="product.imageUrl"
            [priceFrom]="product.priceFrom"
            (select)="openProduct(product)"
          />
        }
      </div>
    } @else {
      <div class="ts-loading">
        <div class="ts-loading__spinner"></div>
        <p>Loading catalog…</p>
      </div>
    }
  `,
  styles: [
    `
      .page-head {
        margin-bottom: var(--ts-space-2xl);
        padding-bottom: var(--ts-space-xl);
        border-bottom: 1px solid var(--ts-border);
      }
      .page-head__badge {
        display: inline-block;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ts-green-700);
        background: var(--ts-green-50);
        padding: 0.3rem 0.75rem;
        border-radius: var(--ts-radius-pill);
        margin-bottom: var(--ts-space-md);
      }
      .page-head h1 {
        margin: 0 0 var(--ts-space-sm);
      }
      .page-head__sub {
        margin: 0;
        color: var(--ts-ink-muted);
        font-size: 1.05rem;
      }
    `,
  ],
})
export class CategoriesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(CatalogApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly group = signal<CategoryGroup | null>(null);

  ngOnInit(): void {
    merge(
      of(null),
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
    )
      .pipe(
        map(() => this.resolveFilter()),
        distinctUntilChanged(),
        switchMap((filter) => {
          this.group.set(null);
          return this.catalog.getCategories(filter);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((g) => this.group.set(g));
  }

  /** Read `:filter` from the deepest activated route or from the URL. */
  private resolveFilter(): string {
    let current: ActivatedRoute | null = this.route;
    while (current?.firstChild) {
      current = current.firstChild;
    }
    const fromRoute = current?.snapshot.paramMap.get('filter');
    if (fromRoute) {
      return fromRoute;
    }

    const match = this.router.url.match(/\/categories\/([^/?#]+)/);
    return match?.[1] ?? 'classic';
  }

  openProduct(product: ProductSummary): void {
    window.location.href = `/product/${product.id}`;
  }
}
