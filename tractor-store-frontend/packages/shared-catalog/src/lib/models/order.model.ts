export interface PlaceOrderRequest {
  firstname: string;
  lastname: string;
  storeId: string;
}

export interface Order {
  id: string;
  firstname: string;
  lastname: string;
  storeId: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  items: { sku: string; name: string; quantity: number; unitPrice: number }[];
}
