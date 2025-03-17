"use client";

import { Product } from "@/types/product";
import Image from "next/image";

interface Order {
  id: string;
  order_items: {
    product_id: string;
    quantity: number;
  }[];
  [key: string]: any;
}

interface TopSellingProductsProps {
  orders: Order[];
  products: Product[];
}

export default function TopSellingProducts({
  orders,
  products,
}: TopSellingProductsProps) {
  // Calculate product sales
  const productSales = orders.reduce(
    (acc, order) => {
      if (!order.order_items) return acc;

      order.order_items.forEach((item) => {
        if (!acc[item.product_id]) {
          acc[item.product_id] = 0;
        }
        acc[item.product_id] += item.quantity;
      });

      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort products by sales
  const topProducts = Object.entries(productSales)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return { product, quantity };
    })
    .filter((item) => item.product) // Filter out any undefined products
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5); // Get top 5

  if (topProducts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No sales data available yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topProducts.map(({ product, quantity }) => (
        <div
          key={product?.id}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <Image
              src={product?.image || ""}
              alt={product?.name || ""}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{product?.name}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {product?.category}
            </p>
          </div>
          <div className="text-right">
            <div className="font-medium">${product?.price.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{quantity} sold</div>
          </div>
        </div>
      ))}
    </div>
  );
}
