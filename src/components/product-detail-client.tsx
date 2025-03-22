"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCart } from "@/context/cart-context";
import { toast } from "./ui/use-toast";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const { addToCart, isLoading } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    let success = true;
    for (let i = 0; i < quantity; i++) {
      const result = await addToCart(product, selectedSize, selectedColor);
      if (!result) {
        success = false;
        break;
      }
    }

    if (success) {
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Not available",
        description: `Sorry, ${product.name} is not available in the requested quantity.`,
        variant: "destructive",
      });
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      {product.inventory_count !== undefined && (
        <div className="text-sm">
          <span
            className={
              product.inventory_count > 10
                ? "text-green-600"
                : product.inventory_count > 0
                  ? "text-orange-500"
                  : "text-red-600"
            }
          >
            {product.inventory_count > 10
              ? "In Stock"
              : product.inventory_count > 0
                ? `Only ${product.inventory_count} left in stock!`
                : "Out of Stock"}
          </span>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isAvailable =
                product.inventory_count && product.inventory_count > 0;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    selectedSize === size
                      ? "bg-red-700 text-white border-red-700"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
                  } 
                    ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isAvailable}
                >
                  {size}
                  {!isAvailable && <span className="ml-1">(Out of Stock)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const isAvailable =
                product.inventory_count && product.inventory_count > 0;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-md transition-colors ${
                    selectedColor === color
                      ? "bg-red-700 text-white border-red-700"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
                  } 
                    ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isAvailable}
                >
                  {color}
                  {!isAvailable && <span className="ml-1">(Out of Stock)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-9 w-9 p-0"
          >
            -
          </Button>
          <span className="mx-4 font-medium">{quantity}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={incrementQuantity}
            className="h-9 w-9 p-0"
          >
            +
          </Button>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-red-700 hover:bg-red-800 py-6"
          size="lg"
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
            : !product.inStock || product.inventory_count === 0
              ? "Out of Stock"
              : "Add to Cart"}
        </Button>

        {product.sizes && product.sizes.length > 0 && !selectedSize && (
          <p className="text-red-600 text-sm mt-2">Please select a size</p>
        )}

        {product.colors && product.colors.length > 0 && !selectedColor && (
          <p className="text-red-600 text-sm mt-2">Please select a color</p>
        )}
      </div>
    </div>
  );
}
