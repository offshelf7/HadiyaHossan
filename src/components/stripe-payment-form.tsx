"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StripePaymentFormProps {
  amount?: number;
  currency?: string;
  userId?: string;
  email?: string;
  paymentType: "donation" | "product_purchase";
  orderItems?: any[];
  shippingAddress?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  showAmountField?: boolean;
  showMessageField?: boolean;
  showAnonymousOption?: boolean;
  showNameField?: boolean;
  title?: string;
  description?: string;
}

export default function StripePaymentForm({
  amount = 0,
  currency = "usd",
  userId,
  email,
  paymentType,
  orderItems = [],
  shippingAddress = "",
  onSuccess,
  onError,
  buttonText = "Pay Now",
  showAmountField = true,
  showMessageField = false,
  showAnonymousOption = false,
  showNameField = false,
  title = "Payment",
  description = "Complete your payment securely with Stripe",
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [paymentAmount, setPaymentAmount] = useState<number>(amount);
  const [message, setMessage] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError("Card element not found");
      return;
    }

    if (paymentAmount <= 0 && showAmountField) {
      setPaymentError("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentAmount,
          currency,
          userId,
          email,
          metadata: {
            payment_type: paymentType,
            message: showMessageField ? message : undefined,
            display_name: showNameField ? displayName : undefined,
            is_anonymous: showAnonymousOption ? String(isAnonymous) : undefined,
            order_items:
              paymentType === "product_purchase"
                ? JSON.stringify(orderItems)
                : undefined,
            shipping_address:
              paymentType === "product_purchase" ? shippingAddress : undefined,
          },
        }),
      });

      const { clientSecret, paymentIntentId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Confirm the payment with the card element
      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: displayName || undefined,
              email: email || undefined,
            },
          },
        },
      );

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed");
      }

      // Payment succeeded
      setPaymentSuccess(true);
      if (onSuccess) {
        onSuccess(paymentIntentId);
      }

      // Redirect based on payment type
      if (paymentType === "donation") {
        router.push("/success?type=donation");
      } else if (paymentType === "product_purchase") {
        router.push("/success?type=purchase");
      }
    } catch (error: any) {
      setPaymentError(error.message || "Payment failed");
      if (onError) {
        onError(error.message || "Payment failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showAmountField && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center">
                <span className="mr-2">{currency.toUpperCase()}</span>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) =>
                    setPaymentAmount(parseFloat(e.target.value) || 0)
                  }
                  required
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {showNameField && (
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                disabled={isAnonymous}
              />
            </div>
          )}

          {showMessageField && (
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message"
                rows={3}
              />
            </div>
          )}

          {showAnonymousOption && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => {
                  setIsAnonymous(checked === true);
                  if (checked) {
                    setDisplayName("");
                  }
                }}
              />
              <Label htmlFor="anonymous" className="cursor-pointer">
                Make my donation anonymous
              </Label>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="card-element">Card Details</Label>
            <div className="p-3 border rounded-md">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>

          {paymentError && (
            <div className="text-sm font-medium text-red-500">
              {paymentError}
            </div>
          )}

          {paymentSuccess && (
            <div className="text-sm font-medium text-green-500">
              Payment successful! Redirecting...
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!stripe || isProcessing || paymentSuccess}
          className="w-full"
        >
          {isProcessing ? "Processing..." : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
