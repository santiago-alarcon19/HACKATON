import { readPickupStore, savePickupStore } from './pickup-store';

describe('pickup-store', () => {
  beforeEach(() => sessionStorage.clear());

  it('savePickupStore and readPickupStore round-trip', () => {
    savePickupStore({ storeId: 'store-a', storeName: 'North Field' });
    expect(readPickupStore()).toEqual({
      storeId: 'store-a',
      storeName: 'North Field',
    });
  });

  it('readPickupStore returns null when missing', () => {
    expect(readPickupStore()).toBeNull();
  });

  it('readPickupStore returns null for invalid json', () => {
    sessionStorage.setItem('tractor:picked-store', '{bad json');
    expect(readPickupStore()).toBeNull();
  });

  it('readPickupStore returns null when fields missing', () => {
    sessionStorage.setItem('tractor:picked-store', JSON.stringify({ storeId: 'x' }));
    expect(readPickupStore()).toBeNull();
  });
});
