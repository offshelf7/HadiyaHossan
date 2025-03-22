"use client";

import { ReactNode, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

interface StripeElementsProviderProps {
  children: ReactNode;
}

// Initialize Stripe outside of the component to avoid recreating it on each render
let stripePromise: Promise<any> | null = null;

export default function StripeElementsProvider({
  children,
}: StripeElementsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!stripePromise) {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (key) {
        stripePromise = loadStripe(key);
      } else {
        console.error("Stripe publishable key is not defined");
      }
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded || !stripePromise) {
    return <div>Loading payment system...</div>;
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
}
