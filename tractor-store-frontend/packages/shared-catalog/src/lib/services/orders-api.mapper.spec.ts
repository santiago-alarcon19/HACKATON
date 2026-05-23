import { mapOrderResponse, mapPlaceOrderBody } from './orders-api.mapper';

describe('orders-api.mapper', () => {
  it('mapPlaceOrderBody trims fields', () => {
    expect(
      mapPlaceOrderBody({
        firstname: ' Ada ',
        lastname: ' Lovelace ',
        storeId: ' store-a ',
      })
    ).toEqual({
      firstname: 'Ada',
      lastname: 'Lovelace',
      storeId: 'store-a',
    });
  });

  it('mapOrderResponse maps order payload', () => {
    const order = mapOrderResponse({
      id: 'ord-1',
      firstname: 'Ada',
      lastname: 'Lovelace',
      storeId: 'store-a',
      total: 5000,
      items: [
        {
          sku: 'SKU-1',
          name: 'Tractor',
          image: '/img.jpg',
          price: 2500,
          quantity: 2,
        },
      ],
    });

    expect(order.id).toBe('ord-1');
    expect(order.status).toBe('CONFIRMED');
    expect(order.items[0].unitPrice).toBe(2500);
  });
});
