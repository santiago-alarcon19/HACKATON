import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import {
  API_ENV,
  CartStore,
  CatalogApiService,
  defaultApiEnvironment,
  OrdersApiService,
  readPickupStore,
  savePickupStore,
} from '@tractor-store/shared-catalog';
import { CartPageComponent } from './cart-page.component';

describe('CartPageComponent', () => {
  let fixture: ComponentFixture<CartPageComponent>;
  let cartStore: jest.Mocked<Pick<CartStore, 'refresh' | 'removeItem' | 'items'>>;
  let orders: jest.Mocked<Pick<OrdersApiService, 'createOrder'>>;
  let catalog: jest.Mocked<Pick<CatalogApiService, 'getStores'>>;
  let router: jest.Mocked<Pick<Router, 'navigate'>>;

  beforeEach(async () => {
    cartStore = {
      refresh: jest.fn().mockResolvedValue(undefined),
      removeItem: jest.fn().mockResolvedValue(undefined),
      items: jest.fn().mockReturnValue([]),
    } as unknown as jest.Mocked<Pick<CartStore, 'refresh' | 'removeItem' | 'items'>>;

    orders = {
      createOrder: jest.fn(),
    } as jest.Mocked<Pick<OrdersApiService, 'createOrder'>>;

    catalog = {
      getStores: jest.fn().mockReturnValue(
        of([
          {
            id: 'store-a',
            name: 'North',
            city: 'Agri',
            address: '1 Field Rd',
            imageUrl: '/store.jpg',
          },
        ])
      ),
    } as jest.Mocked<Pick<CatalogApiService, 'getStores'>>;

    router = {
      navigate: jest.fn().mockResolvedValue(true),
    } as jest.Mocked<Pick<Router, 'navigate'>>;

    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_ENV, useValue: defaultApiEnvironment },
        { provide: CartStore, useValue: cartStore },
        { provide: OrdersApiService, useValue: orders },
        { provide: CatalogApiService, useValue: catalog },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    sessionStorage.clear();
    fixture = TestBed.createComponent(CartPageComponent);
    fixture.detectChanges();
  });

  it('builds placeholder image when line item has no image', () => {
    const url = fixture.componentInstance.lineImage({
      sku: 'A',
      productId: 'A',
      name: 'Tractor',
      variantLabel: 'Red',
      quantity: 1,
      unitPrice: 10,
    });
    expect(url).toContain('placehold.co');
  });

  it('selects pickup store and persists choice', () => {
    fixture.componentInstance.stores.set([
      {
        id: 'store-a',
        name: 'North',
        city: 'Agri',
        address: '1 Field Rd',
        imageUrl: '/store.jpg',
      },
    ]);
    fixture.componentInstance.selectPickupStore({
      id: 'store-a',
      name: 'North',
      city: 'Agri',
      address: '1 Field Rd',
      imageUrl: '/store.jpg',
    });
    expect(fixture.componentInstance.selectedStore?.id).toBe('store-a');
    expect(readPickupStore()?.storeId).toBe('store-a');
  });

  it('marks form touched when submit is invalid', () => {
    fixture.componentInstance.submit();
    expect(fixture.componentInstance.form.touched).toBe(true);
    expect(orders.createOrder).not.toHaveBeenCalled();
  });

  it('navigates to thanks page after successful submit', () => {
    fixture.componentInstance.stores.set([
      {
        id: 'store-a',
        name: 'North',
        city: 'Agri',
        address: '1 Field Rd',
        imageUrl: '/store.jpg',
      },
    ]);
    fixture.componentInstance.form.setValue({
      firstname: 'Ada',
      lastname: 'Lovelace',
      storeId: 'store-a',
    });
    orders.createOrder.mockReturnValue(
      of({
        id: 'ord-1',
        firstname: 'Ada',
        lastname: 'Lovelace',
        storeId: 'store-a',
        status: 'CONFIRMED',
        total: 100,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        items: [],
      })
    );

    fixture.componentInstance.submit();

    expect(router.navigate).toHaveBeenCalledWith(
      ['/checkout/thanks', 'ord-1'],
      expect.objectContaining({
        state: { firstname: 'Ada', lastname: 'Lovelace' },
      })
    );
  });

  it('shows submit error when order fails', () => {
    fixture.componentInstance.form.setValue({
      firstname: 'Ada',
      lastname: 'Lovelace',
      storeId: 'store-a',
    });
    orders.createOrder.mockReturnValue(throwError(() => new Error('fail')));

    fixture.componentInstance.submit();

    expect(fixture.componentInstance.submitError()).toContain('Could not place the order');
  });

  it('removes line item from cart', () => {
    fixture.componentInstance.remove('SKU-1');
    expect(cartStore.removeItem).toHaveBeenCalledWith('SKU-1');
  });

  it('restores saved pickup store on init', async () => {
    savePickupStore({ storeId: 'store-a', storeName: 'North' });
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CartPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_ENV, useValue: defaultApiEnvironment },
        { provide: CartStore, useValue: cartStore },
        { provide: OrdersApiService, useValue: orders },
        { provide: CatalogApiService, useValue: catalog },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    const localFixture = TestBed.createComponent(CartPageComponent);
    localFixture.detectChanges();
    expect(localFixture.componentInstance.form.controls.storeId.value).toBe('store-a');
    expect(readPickupStore()?.storeId).toBe('store-a');
  });
});
