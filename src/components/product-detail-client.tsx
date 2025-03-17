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

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
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
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {product.colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            !product.inStock ||
            (product.sizes && product.sizes.length > 0 && !selectedSize) ||
            (product.colors && product.colors.length > 0 && !selectedColor)
          }
        >
          {!product.inStock ? "Out of Stock" : "Add to Cart"}
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
