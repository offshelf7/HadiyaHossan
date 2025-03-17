"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "./ui/button";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "");

if (!process.env.STRIPE_PUBLISHABLE_KEY) {
  console.error(
    "Stripe publishable key is missing. Check your environment variables.",
  );
}

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

function CheckoutForm({
  clientSecret,
  onSuccess,
  amount,
  isSubmitting,
  setIsSubmitting,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url:
            typeof window !== "undefined"
              ? `${window.location.origin}/success`
              : "/success",
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        setErrorMessage(error.message || "An error occurred during payment.");
        setIsSubmitting(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        onSuccess(paymentIntent.id);
      } else if (paymentIntent) {
        console.log("Payment status:", paymentIntent.status);
        // Handle other payment statuses if needed
        if (paymentIntent.status === "processing") {
          setErrorMessage(
            "Your payment is processing. We'll update you when payment is received.",
          );
          setIsSubmitting(false);
        } else if (paymentIntent.status === "requires_payment_method") {
          setErrorMessage("Your payment was not successful, please try again.");
          setIsSubmitting(false);
        }
      }
    } catch (e) {
      console.error("Unexpected error during payment confirmation:", e);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      <PaymentElement />
      <Button
        type="submit"
        className="w-full bg-red-700 hover:bg-red-800"
        disabled={!stripe || isSubmitting}
      >
        {isSubmitting ? "Processing..." : `Pay ${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

interface StripeElementsProps {
  clientSecret: string | null;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function StripeElementsWrapper({
  clientSecret,
  amount,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: StripeElementsProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (clientSecret) {
      setIsReady(true);
    }
  }, [clientSecret]);

  if (!isReady || !clientSecret) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#7f001b",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        amount={amount}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </Elements>
  );
}
