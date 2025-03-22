"use client";

import { CartItem as CartItemType } from "@/context/cart-context";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { toast } from "./ui/use-toast";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart, isLoading } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
      return;
    }

    setIsUpdating(true);
    const success = await updateQuantity(item.id, newQuantity);
    setIsUpdating(false);

    if (!success && newQuantity > item.quantity) {
      toast({
        title: "Not available",
        description: `Sorry, ${item.name} is not available in the requested quantity.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <div className="ml-4 flex-grow">
        <h3 className="text-sm font-medium">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          ${item.price.toFixed(2)} each
        </p>
        {item.size && (
          <p className="text-xs text-gray-500">Size: {item.size}</p>
        )}
        {item.color && (
          <p className="text-xs text-gray-500">Color: {item.color}</p>
        )}
      </div>

      <div className="flex items-center">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={isLoading || isUpdating}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">
            {isUpdating ? "..." : item.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={isLoading || isUpdating}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-2 text-red-500 hover:text-red-700 hover:bg-transparent"
          onClick={() => removeFromCart(item.id)}
          disabled={isLoading || isUpdating}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="ml-4 text-right w-20">
        <p className="text-sm font-medium">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
