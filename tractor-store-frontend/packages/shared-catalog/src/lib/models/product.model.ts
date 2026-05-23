export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  priceFrom: number;
  category?: string;
}

export interface ProductVariant {
  sku: string;
  label: string;
  price: number;
  imageUrl: string;
  attributes: Record<string, string>;
  inStock?: boolean;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  variants: ProductVariant[];
  images: string[];
  recommendations?: ProductSummary[];
}

export interface CategoryGroup {
  filter: string;
  title: string;
  products: ProductSummary[];
}

export interface HomePayload {
  hero: { title: string; subtitle: string; imageUrl: string };
  featured: ProductSummary[];
  categories: { filter: string; title: string; imageUrl: string }[];
}

export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  imageUrl: string;
  phone?: string;
}

export interface InventoryStatus {
  sku: string;
  available: number;
  reserved?: number;
}
