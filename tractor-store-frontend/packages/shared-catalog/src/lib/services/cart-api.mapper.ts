import { Cart, CartLineItem, MiniCart } from '../models/cart.model';
import { resolveImageUrl } from './catalog-api.mapper';

interface ApiLineItem {
  sku: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface ApiCart {
  items: ApiLineItem[];
  total: number;
}

interface ApiMiniCart {
  quantity: number;
}

export function mapCartResponse(api: ApiCart): Cart {
  return {
    items: (api.items ?? []).map(mapLineItem),
    subtotal: api.total ?? 0,
    currency: 'USD',
  };
}

function mapLineItem(item: ApiLineItem): CartLineItem {
  return {
    sku: item.sku,
    productId: item.sku,
    name: item.name,
    variantLabel: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    imageUrl: resolveImageUrl(item.image),
  };
}

export function mapMiniCartResponse(api: ApiMiniCart, cart?: Cart): MiniCart {
  const items = cart?.items ?? [];
  return {
    itemCount: api.quantity ?? 0,
    subtotal: cart?.subtotal ?? 0,
    preview: items.slice(0, 3).map((i) => ({
      sku: i.sku,
      name: i.name,
      quantity: i.quantity,
      imageUrl: i.imageUrl,
      unitPrice: i.unitPrice,
    })),
  };
}
