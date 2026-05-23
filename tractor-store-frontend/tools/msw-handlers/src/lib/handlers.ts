import { http, HttpResponse } from 'msw';
import {
  getCart,
  getPlacedOrder,
  mockHome,
  mockProduct,
  mockStores,
  resetCart,
  savePlacedOrder,
  setCart,
} from './data';

const API = 'http://localhost:8080/api';

export function createTractorStoreHandlers(baseUrl = API) {
  return [
    http.get(`${baseUrl}/catalog/home`, () => HttpResponse.json(mockHome)),
    http.get(`${baseUrl}/catalog/categories/:filter`, ({ params }) =>
      HttpResponse.json({
        filter: params['filter'],
        title: String(params['filter']),
        products: mockHome.featured,
      })
    ),
    http.get(`${baseUrl}/catalog/products/:id`, () =>
      HttpResponse.json(mockProduct)
    ),
    http.get(`${baseUrl}/catalog/stores`, () =>
      HttpResponse.json(mockStores)
    ),
    http.get(`${baseUrl}/catalog/recommendations`, () =>
      HttpResponse.json(mockHome.featured)
    ),
    http.get(`${baseUrl}/inventory/:sku`, ({ params }) =>
      HttpResponse.json({
        sku: params['sku'],
        available: 10,
      })
    ),
    http.get(`${baseUrl}/cart`, () => HttpResponse.json(getCart())),
    http.get(`${baseUrl}/cart/mini`, () => {
      const c = getCart();
      return HttpResponse.json({
        itemCount: c.items.reduce((s, i) => s + i.quantity, 0),
        subtotal: c.subtotal,
        preview: c.items.map((i) => ({
          sku: i.sku,
          name: i.name,
          quantity: i.quantity,
        })),
      });
    }),
    http.post(`${baseUrl}/cart/items`, async ({ request }) => {
      const body = (await request.json()) as { sku: string; quantity: number };
      const c = getCart();
      const variant = mockProduct.variants.find((v) => v.sku === body.sku);
      const existing = c.items.find((i) => i.sku === body.sku);
      if (existing) {
        existing.quantity += body.quantity;
      } else if (variant) {
        c.items.push({
          sku: variant.sku,
          productId: mockProduct.id,
          name: mockProduct.name,
          variantLabel: variant.label,
          quantity: body.quantity,
          unitPrice: variant.price,
          imageUrl: mockProduct.imageUrl,
        });
      }
      c.subtotal = c.items.reduce(
        (s, i) => s + i.quantity * i.unitPrice,
        0
      );
      setCart(c);
      return HttpResponse.json(c);
    }),
    http.delete(`${baseUrl}/cart/items/:sku`, ({ params }) => {
      const c = getCart();
      c.items = c.items.filter((i) => i.sku !== params['sku']);
      c.subtotal = c.items.reduce(
        (s, i) => s + i.quantity * i.unitPrice,
        0
      );
      setCart(c);
      return HttpResponse.json(c);
    }),
    http.post(`${baseUrl}/orders`, async ({ request }) => {
      const body = (await request.json()) as {
        firstname: string;
        lastname: string;
        storeId: string;
      };
      const c = getCart();
      const id = `ord-${Date.now()}`;
      const order = {
        id,
        firstname: body.firstname,
        lastname: body.lastname,
        storeId: body.storeId,
        total: c.subtotal,
        items: c.items.map((i) => ({
          sku: i.sku,
          name: i.name,
          image: i.imageUrl ?? '',
          price: i.unitPrice,
          quantity: i.quantity,
        })),
      };
      savePlacedOrder(order);
      resetCart();
      return HttpResponse.json(order);
    }),
    http.get(`${baseUrl}/orders/:id`, ({ params }) => {
      const id = String(params['id']);
      const order = getPlacedOrder(id);
      if (!order) {
        return HttpResponse.json(
          { message: 'Order not found' },
          { status: 404 }
        );
      }
      return HttpResponse.json(order);
    }),
  ];
}
