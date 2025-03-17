"use client";

import { useCart } from "@/context/cart-context";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function CartIcon() {
  const { cart, totalItems, subtotal } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTotalItems = useRef(totalItems);
  const router = useRouter();

  useEffect(() => {
    // Animate the cart icon when items are added
    if (totalItems > prevTotalItems.current) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    setIsOpen(false);
    router.push("/cart");
  };

  return (
    <Popover open={isOpen && totalItems > 0} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative focus:outline-none">
          <ShoppingBag
            className={`h-6 w-6 ${isAnimating ? "animate-bounce" : ""}`}
          />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-medium">Your Cart ({totalItems})</h3>
        </div>

        <div className="max-h-60 overflow-auto p-4">
          {cart.length > 0 ? (
            <div className="space-y-3">
              {cart.slice(0, 3).map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-md relative overflow-hidden flex-shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {cart.length > 3 && (
                <p className="text-xs text-center text-gray-500 pt-2">
                  +{cart.length - 3} more items
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Your cart is empty</p>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Subtotal:</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleViewCart}
            >
              View Cart
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-red-700 hover:bg-red-800"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
