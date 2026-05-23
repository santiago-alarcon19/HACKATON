import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  CatalogApiService,
  EXPLORE_STORE_SELECTED,
  readPickupStore,
  savePickupStore,
} from '@tractor-store/shared-catalog';
import { StoresComponent } from './stores.component';

describe('StoresComponent', () => {
  let fixture: ComponentFixture<StoresComponent>;
  let catalog: jest.Mocked<Pick<CatalogApiService, 'getStores'>>;

  const store = {
    id: 's1',
    name: 'North',
    city: 'Agri',
    address: '1 Field Rd',
    imageUrl: '/store.jpg',
  };

  beforeEach(async () => {
    sessionStorage.clear();
    catalog = {
      getStores: jest.fn().mockReturnValue(of([store])),
    };

    await TestBed.configureTestingModule({
      imports: [StoresComponent],
      providers: [{ provide: CatalogApiService, useValue: catalog }],
    }).compileComponents();

    fixture = TestBed.createComponent(StoresComponent);
    fixture.detectChanges();
  });

  it('loads stores on init', () => {
    expect(fixture.componentInstance.stores()).toEqual([store]);
    expect(catalog.getStores).toHaveBeenCalled();
  });

  it('restores saved pickup store from session', async () => {
    savePickupStore({ storeId: 's1', storeName: 'North' });
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [StoresComponent],
      providers: [{ provide: CatalogApiService, useValue: catalog }],
    }).compileComponents();

    const localFixture = TestBed.createComponent(StoresComponent);
    localFixture.detectChanges();
    expect(localFixture.componentInstance.selectedId()).toBe('s1');
    expect(localFixture.componentInstance.selectedName()).toBe('North');
  });

  it('selects store, persists choice and dispatches event', () => {
    const handler = jest.fn();
    window.addEventListener(EXPLORE_STORE_SELECTED, handler);

    fixture.componentInstance.selectStore(store);

    expect(readPickupStore()?.storeId).toBe('s1');
    expect(fixture.componentInstance.selectedName()).toBe('North');
    expect(handler).toHaveBeenCalled();
    window.removeEventListener(EXPLORE_STORE_SELECTED, handler);
  });
});
