"use client";

import { Product } from "@/types/product";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "../../supabase/client";

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    size?: string,
    color?: string,
  ) => Promise<boolean>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
  checkAvailability: (productId: string, quantity: number) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Check product availability
  const checkAvailability = async (
    productId: string,
    quantity: number,
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("inventory_count")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error checking product availability:", error);
        return false;
      }

      return data.inventory_count >= quantity;
    } catch (error) {
      console.error("Error checking product availability:", error);
      return false;
    }
  };

  const addToCart = async (
    product: Product,
    size?: string,
    color?: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(
        (item) =>
          item.id === product.id && item.size === size && item.color === color,
      );

      let newQuantity = 1;
      if (existingItemIndex > -1) {
        newQuantity = cart[existingItemIndex].quantity + 1;
      }

      // Check availability before adding to cart
      const isAvailable = await checkAvailability(product.id, newQuantity);
      if (!isAvailable) {
        console.error("Product not available in requested quantity");
        setIsLoading(false);
        return false;
      }

      setCart((prevCart) => {
        if (existingItemIndex > -1) {
          // Update quantity of existing item
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += 1;
          return updatedCart;
        } else {
          // Add new item to cart
          return [...prevCart, { ...product, quantity: 1, size, color }];
        }
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsLoading(false);
      return false;
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (quantity <= 0) {
        removeFromCart(productId);
        setIsLoading(false);
        return true;
      }

      // Check availability before updating quantity
      const isAvailable = await checkAvailability(productId, quantity);
      if (!isAvailable) {
        console.error("Product not available in requested quantity");
        setIsLoading(false);
        return false;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error updating quantity:", error);
      setIsLoading(false);
      return false;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isLoading,
        checkAvailability,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
