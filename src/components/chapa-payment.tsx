"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ChapaPaymentProps {
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  onSuccess: (transactionId: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export default function ChapaPayment({
  amount,
  email,
  firstName,
  lastName,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: ChapaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // This would be replaced with an actual API call to your backend
      // which would then initialize a Chapa transaction
      const response = await fetch("/api/create-chapa-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          tx_ref: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          callback_url:
            typeof window !== "undefined"
              ? `${window.location.origin}/success`
              : "/success",
          return_url:
            typeof window !== "undefined"
              ? `${window.location.origin}/success`
              : "/success",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize Chapa payment");
      }

      const data = await response.json();

      // In a real implementation, you would redirect to Chapa's checkout page
      // window.location.href = data.checkout_url;

      // For this demo, we'll simulate a successful payment
      setTimeout(() => {
        onSuccess(data.transaction_id || "chapa-tx-123456");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred");
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

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+251 91 234 5678"
          required
        />
        <p className="text-xs text-gray-500">Required for Chapa payment</p>
      </div>

      <Button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Processing..."
          : `Pay with Chapa ($${amount.toFixed(2)})`}
      </Button>
    </form>
  );
}
