"use client";

import { Product } from "@/types/product";
import { Badge } from "./ui/badge";

interface InventoryStatusProps {
  product: Product;
  showCount?: boolean;
  className?: string;
}

export default function InventoryStatus({
  product,
  showCount = false,
  className = "",
}: InventoryStatusProps) {
  if (product.inventory_count === undefined) {
    return null;
  }

  if (product.inventory_count === 0) {
    return (
      <Badge variant="destructive" className={className}>
        Out of Stock
      </Badge>
    );
  }

  if (product.inventory_count <= 5) {
    return (
      <Badge
        variant="outline"
        className={`bg-orange-50 text-orange-700 border-orange-200 ${className}`}
      >
        {showCount ? `Only ${product.inventory_count} left!` : "Low Stock"}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`bg-green-50 text-green-700 border-green-200 ${className}`}
    >
      {showCount ? `${product.inventory_count} in stock` : "In Stock"}
    </Badge>
  );
}
