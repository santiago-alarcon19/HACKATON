export interface CartLineItem {
  sku: string;
  productId: string;
  name: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

export interface Cart {
  id?: string;
  items: CartLineItem[];
  subtotal: number;
  currency: string;
}

export interface MiniCartPreviewLine {
  sku: string;
  name: string;
  quantity: number;
  imageUrl?: string;
  unitPrice?: number;
}

export interface MiniCart {
  itemCount: number;
  subtotal: number;
  preview: MiniCartPreviewLine[];
}

export interface AddCartItemRequest {
  sku: string;
  quantity: number;
}
