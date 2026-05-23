import { Order } from '../models/order.model';

interface ApiOrderLineItem {
  sku: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface ApiOrderResponse {
  id: string;
  firstname: string;
  lastname: string;
  storeId: string;
  total: number;
  items: ApiOrderLineItem[];
}

export interface PlaceOrderBody {
  firstname: string;
  lastname: string;
  storeId: string;
}

export function mapPlaceOrderBody(input: {
  firstname: string;
  lastname: string;
  storeId: string;
}): PlaceOrderBody {
  return {
    firstname: input.firstname.trim(),
    lastname: input.lastname.trim(),
    storeId: input.storeId.trim(),
  };
}

export function mapOrderResponse(api: ApiOrderResponse): Order {
  return {
    id: String(api.id),
    firstname: api.firstname ?? '',
    lastname: api.lastname ?? '',
    storeId: api.storeId ?? '',
    status: 'CONFIRMED',
    total: api.total,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    items: (api.items ?? []).map((item) => ({
      sku: item.sku,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
    })),
  };
}
