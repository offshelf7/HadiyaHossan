export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inventory_count?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  sizeInventory?: Record<string, number>;
  colorInventory?: Record<string, number>;
}
