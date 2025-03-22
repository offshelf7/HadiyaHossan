"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { toast } from "./ui/use-toast";
import InventoryStatus from "./inventory-status";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

  const handleAddToCart = async () => {
    const success = await addToCart(product, selectedSize, selectedColor);
    if (success) {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Not available",
        description: `Sorry, ${product.name} is not available in the requested quantity.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-white">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {product.inventory_count === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold px-3 py-1 bg-red-700 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
          <InventoryStatus product={product} />
        </div>
        <p className="font-bold text-lg">${product.price.toFixed(2)}</p>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3">
            <label className="text-xs text-gray-500 mb-1 block">
              Select Size:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isAvailable =
                  product.inventory_count && product.inventory_count > 0;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 text-xs border rounded-md transition-colors ${
                      selectedSize === size
                        ? "bg-red-700 text-white border-red-700"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
                    } 
                      ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAvailable}
                  >
                    {size}
                    {!isAvailable && <span className="ml-1">(OOS)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="mt-3">
            <label className="text-xs text-gray-500 mb-1 block">
              Select Color:
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => {
                const isAvailable =
                  product.inventory_count && product.inventory_count > 0;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 text-xs border rounded-md transition-colors ${
                      selectedColor === color
                        ? "bg-red-700 text-white border-red-700"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
                    } 
                      ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isAvailable}
                  >
                    {color}
                    {!isAvailable && <span className="ml-1">(OOS)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-red-700 hover:bg-red-800"
          disabled={
            isLoading ||
            !product.inStock ||
            product.inventory_count === 0 ||
            (product.sizes && product.sizes.length > 0 && !selectedSize) ||
            (product.colors && product.colors.length > 0 && !selectedColor)
          }
        >
          {isLoading
            ? "Adding..."
            : product.inventory_count === 0
              ? "Out of Stock"
              : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
