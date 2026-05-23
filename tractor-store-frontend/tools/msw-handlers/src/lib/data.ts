import {
  Cart,
  HomePayload,
  ProductDetail,
  StoreLocation,
} from '@tractor-store/shared-catalog';

export const mockHome: HomePayload = {
  hero: {
    title: 'Built for the field',
    subtitle: 'Premium tractors and attachments',
    imageUrl: 'https://placehold.co/1200x400/1a5f2a/fff?text=Tractor+Store',
  },
  featured: [
    {
      id: 'classic-01',
      name: 'Classic Fieldmaster',
      slug: 'classic-fieldmaster',
      imageUrl: 'https://placehold.co/400x300/2d6a4f/fff?text=Classic',
      priceFrom: 24999,
      category: 'classic',
    },
    {
      id: 'pro-01',
      name: 'Pro Series X',
      slug: 'pro-series-x',
      imageUrl: 'https://placehold.co/400x300/40916c/fff?text=Pro',
      priceFrom: 45999,
      category: 'pro',
    },
  ],
  categories: [
    {
      filter: 'classic',
      title: 'Classic Tractors',
      imageUrl: 'https://blueprint.the-tractor.store/cdn/img/scene/500/classics.webp',
    },
    {
      filter: 'autonomous',
      title: 'Autonomous Tractors',
      imageUrl: 'https://blueprint.the-tractor.store/cdn/img/scene/500/autonomous.webp',
    },
  ],
};

export const mockProduct: ProductDetail = {
  id: 'classic-01',
  name: 'Classic Fieldmaster',
  slug: 'classic-fieldmaster',
  imageUrl: 'https://placehold.co/600x400/2d6a4f/fff?text=Classic',
  priceFrom: 24999,
  category: 'classic',
  description: 'Reliable workhorse for medium farms.',
  images: [
    'https://placehold.co/600x400/c62828/fff?text=Red',
    'https://placehold.co/600x400/2d6a4f/fff?text=Green',
  ],
  variants: [
    {
      sku: 'CL-RED-01',
      label: 'Red paint',
      price: 24999,
      imageUrl: 'https://placehold.co/600x400/c62828/fff?text=Red',
      attributes: { color: '#c62828' },
      inStock: true,
    },
    {
      sku: 'CL-GRN-01',
      label: 'Green paint',
      price: 25499,
      imageUrl: 'https://placehold.co/600x400/2d6a4f/fff?text=Green',
      attributes: { color: '#2d6a4f' },
      inStock: true,
    },
  ],
};

export const mockStores: StoreLocation[] = [
  {
    id: 'store-1',
    name: 'Midwest Depot',
    city: 'Des Moines',
    address: '100 Farm Rd',
    imageUrl: 'https://placehold.co/640x400/145c3a/fff?text=Store+1',
  },
  {
    id: 'store-2',
    name: 'Pacific Yard',
    city: 'Sacramento',
    address: '42 Valley Ave',
    imageUrl: 'https://placehold.co/640x400/1a7349/fff?text=Store+2',
  },
];

let cart: Cart = {
  items: [],
  subtotal: 0,
  currency: 'USD',
};

export function getCart(): Cart {
  return structuredClone(cart);
}

export function setCart(next: Cart): void {
  cart = next;
}

export function resetCart(): void {
  cart = { items: [], subtotal: 0, currency: 'USD' };
}

export interface MockPlacedOrder {
  id: string;
  firstname: string;
  lastname: string;
  storeId: string;
  total: number;
  items: { sku: string; name: string; image: string; price: number; quantity: number }[];
}

const placedOrders = new Map<string, MockPlacedOrder>();

export function savePlacedOrder(order: MockPlacedOrder): void {
  placedOrders.set(order.id, order);
}

export function getPlacedOrder(id: string): MockPlacedOrder | undefined {
  return placedOrders.get(id);
}
