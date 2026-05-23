import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  CartStore,
  CatalogApiService,
  InventoryApiService,
} from '@tractor-store/shared-catalog';
import { ProductDetailComponent } from './product-detail.component';

describe('ProductDetailComponent', () => {
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'AU-02' } } } },
        {
          provide: CatalogApiService,
          useValue: {
            getProduct: jest.fn().mockReturnValue(
              of({
                id: 'AU-02',
                name: 'Auto',
                slug: 'au-02',
                imageUrl: '/img.jpg',
                priceFrom: 1000,
                category: 'autonomous',
                description: 'Smart tractor',
                images: ['/img.jpg'],
                variants: [
                  {
                    sku: 'AU-02-OG',
                    label: 'Orange',
                    price: 1500,
                    imageUrl: '/v1.jpg',
                    attributes: { color: '#f80' },
                    inStock: true,
                  },
                ],
              })
            ),
          },
        },
        {
          provide: InventoryApiService,
          useValue: {
            getBySku: jest.fn().mockReturnValue(of({ sku: 'AU-02-OG', available: 3 })),
          },
        },
        {
          provide: CartStore,
          useValue: { addItem: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    fixture.detectChanges();
  });

  it('selects first variant and loads stock', () => {
    expect(fixture.componentInstance.selectedSku()).toBe('AU-02-OG');
    expect(fixture.componentInstance.stock()).toBe(3);
  });

  it('does not re-select the same variant', () => {
    const variant = fixture.componentInstance.selectedVariant();
    expect(variant?.sku).toBe('AU-02-OG');
    fixture.componentInstance.selectVariant(variant!);
    expect(fixture.componentInstance.selectedSku()).toBe('AU-02-OG');
  });

  it('skips addToCart when out of stock', async () => {
    fixture.componentInstance.stock.set(0);
    const cartStore = TestBed.inject(CartStore) as jest.Mocked<CartStore>;
    await fixture.componentInstance.addToCart();
    expect(cartStore.addItem).not.toHaveBeenCalled();
  });

  it('adds item to cart and shows success message', async () => {
    const cartStore = TestBed.inject(CartStore) as jest.Mocked<CartStore>;
    await fixture.componentInstance.addToCart();
    expect(cartStore.addItem).toHaveBeenCalledWith('AU-02-OG', 1);
    expect(fixture.componentInstance.message()).toContain('Added to cart');
  });

  it('shows error message when addToCart fails', async () => {
    const cartStore = TestBed.inject(CartStore) as jest.Mocked<CartStore>;
    cartStore.addItem.mockRejectedValueOnce(new Error('fail'));
    await fixture.componentInstance.addToCart();
    expect(fixture.componentInstance.message()).toContain('Could not add to cart');
  });

  it('loads stock when selecting a different variant', () => {
    const inventory = TestBed.inject(InventoryApiService) as jest.Mocked<InventoryApiService>;
    fixture.componentInstance.selectVariant({
      sku: 'AU-02-OG',
      label: 'Orange',
      price: 1500,
      imageUrl: '/v1.jpg',
      attributes: { color: '#f80' },
      inStock: true,
    });
    expect(inventory.getBySku).toHaveBeenCalledWith('AU-02-OG');
  });
});
