import { Component, inject, OnInit, signal } from '@angular/core';
import {
  dispatchMfeEvent,
  EXPLORE_STORE_SELECTED,
  CatalogApiService,
  readPickupStore,
  savePickupStore,
  StoreLocation,
} from '@tractor-store/shared-catalog';

@Component({
  selector: 'explore-stores',
  standalone: true,
  template: `
    <header class="page-head">
      <span class="page-head__badge">Pickup</span>
      <h1>Our stores</h1>
      <p class="page-head__sub">
        Select your pickup location — we will hold your order at the store counter.
      </p>
    </header>

    <ul class="stores-grid">
      @for (store of stores(); track store.id) {
        <li>
          <button
            type="button"
            class="store-card"
            [class.store-card--selected]="selectedId() === store.id"
            (click)="selectStore(store)"
          >
            <div class="store-card__media">
              <img
                [src]="store.imageUrl"
                [alt]="store.name"
                class="store-card__img"
                loading="lazy"
              />
              @if (selectedId() === store.id) {
                <span class="store-card__badge">Selected</span>
              }
            </div>
            <div class="store-card__body">
              <h2 class="store-card__name">{{ store.name }}</h2>
              <p class="store-card__city">{{ store.city }}</p>
              <p class="store-card__address">{{ store.address }}</p>
              <span class="store-card__action">
                {{ selectedId() === store.id ? 'Selected for pickup' : 'Select this store' }}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </button>
        </li>
      }
    </ul>

    @if (selectedId()) {
      <p class="selected-banner">
        Pickup at <strong>{{ selectedName() }}</strong> — ready for checkout
      </p>
    }
  `,
  styles: [
    `
      .page-head {
        margin-bottom: var(--ts-space-2xl);
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
        max-width: 36rem;
        line-height: 1.6;
      }

      .stores-grid {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--ts-space-xl);
      }

      .store-card {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0;
        border: 2px solid var(--ts-border);
        border-radius: var(--ts-radius-lg);
        background: var(--ts-white);
        cursor: pointer;
        overflow: hidden;
        text-align: left;
        box-shadow: var(--ts-shadow-sm);
        transition:
          border-color var(--ts-transition),
          box-shadow var(--ts-transition),
          transform var(--ts-transition);
      }

      .store-card:hover {
        border-color: var(--ts-green-500);
        box-shadow: var(--ts-shadow-lg);
        transform: translateY(-4px);
      }

      .store-card--selected {
        border-color: var(--ts-green-600);
        box-shadow:
          0 0 0 3px rgba(31, 143, 84, 0.18),
          var(--ts-shadow-lg);
      }

      .store-card__media {
        position: relative;
        aspect-ratio: 16 / 10;
        overflow: hidden;
        background: var(--ts-cream-dark);
      }

      .store-card__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
      }

      .store-card:hover .store-card__img {
        transform: scale(1.05);
      }

      .store-card__badge {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        padding: 0.3rem 0.65rem;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #fff;
        background: var(--ts-green-700);
        border-radius: var(--ts-radius-pill);
        box-shadow: var(--ts-shadow-sm);
      }

      .store-card__body {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: var(--ts-space-lg);
        flex: 1;
      }

      .store-card__name {
        margin: 0;
        font-family: var(--ts-font-display);
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--ts-ink);
        line-height: 1.25;
      }

      .store-card__city {
        margin: 0;
        font-weight: 600;
        font-size: 0.92rem;
        color: var(--ts-green-700);
      }

      .store-card__address {
        margin: 0 0 var(--ts-space-md);
        font-size: 0.88rem;
        color: var(--ts-ink-muted);
        line-height: 1.4;
      }

      .store-card__action {
        margin-top: auto;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--ts-green-800);
      }

      .store-card--selected .store-card__action {
        color: var(--ts-green-600);
      }

      .selected-banner {
        margin-top: var(--ts-space-2xl);
        padding: var(--ts-space-md) var(--ts-space-lg);
        background: linear-gradient(135deg, var(--ts-green-50), var(--ts-amber-100));
        border: 1px solid var(--ts-green-100);
        border-radius: var(--ts-radius-md);
        color: var(--ts-green-800);
        text-align: center;
        font-size: 0.95rem;
      }
    `,
  ],
})
export class StoresComponent implements OnInit {
  private readonly catalog = inject(CatalogApiService);
  readonly stores = signal<StoreLocation[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly selectedName = signal<string | null>(null);

  ngOnInit(): void {
    const saved = readPickupStore();
    if (saved) {
      this.selectedId.set(saved.storeId);
      this.selectedName.set(saved.storeName);
    }

    this.catalog.getStores().subscribe((s) => this.stores.set(s));
  }

  selectStore(store: StoreLocation): void {
    this.selectedId.set(store.id);
    this.selectedName.set(store.name);
    const selection = { storeId: store.id, storeName: store.name };
    savePickupStore(selection);
    dispatchMfeEvent(EXPLORE_STORE_SELECTED, selection);
  }
}
