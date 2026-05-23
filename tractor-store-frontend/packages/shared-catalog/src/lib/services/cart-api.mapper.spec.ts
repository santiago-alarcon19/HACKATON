import { mapCartResponse, mapMiniCartResponse } from './cart-api.mapper';

describe('cart-api.mapper', () => {
  it('mapCartResponse maps line items and total', () => {
    const cart = mapCartResponse({
      items: [
        {
          sku: 'SKU-1',
          name: 'Tractor',
          image: '/img.jpg',
          price: 1000,
          quantity: 2,
        },
      ],
      total: 2000,
    });

    expect(cart.subtotal).toBe(2000);
    expect(cart.items[0].sku).toBe('SKU-1');
    expect(cart.items[0].imageUrl).toContain('blueprint.the-tractor.store');
  });

  it('mapMiniCartResponse builds preview from cart', () => {
    const cart = mapCartResponse({
      items: [
        {
          sku: 'A',
          name: 'A',
          image: '/a.jpg',
          price: 10,
          quantity: 1,
        },
        {
          sku: 'B',
          name: 'B',
          image: '/b.jpg',
          price: 20,
          quantity: 1,
        },
      ],
      total: 30,
    });

    const mini = mapMiniCartResponse({ quantity: 2 }, cart);
    expect(mini.itemCount).toBe(2);
    expect(mini.subtotal).toBe(30);
    expect(mini.preview).toHaveLength(2);
  });

  it('mapMiniCartResponse handles empty cart', () => {
    const mini = mapMiniCartResponse({ quantity: 0 });
    expect(mini.preview).toEqual([]);
  });
});
