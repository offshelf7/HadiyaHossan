"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export default function DonationForm() {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setAmount("");
      setCustomAmount("");
      setName("");
      setEmail("");
    }, 1500);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value !== "custom") {
      setCustomAmount("");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Support Our Club</CardTitle>
        <CardDescription>
          Your donation helps us invest in facilities, youth development, and
          community programs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitSuccess ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">
              Thank You for Your Support!
            </h3>
            <p className="text-gray-600">
              Your generous donation will help us continue to grow and develop
              as a club.
            </p>
            <Button className="mt-6" onClick={() => setSubmitSuccess(false)}>
              Make Another Donation
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label>Select Donation Amount</Label>
              <RadioGroup
                value={amount}
                onValueChange={handleAmountChange}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="10"
                    id="amount-10"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="amount-10"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    $10
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="25"
                    id="amount-25"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="amount-25"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    $25
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="50"
                    id="amount-50"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="amount-50"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    $50
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="100"
                    id="amount-100"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="amount-100"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    $100
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="250"
                    id="amount-250"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="amount-250"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    $250
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="custom"
                    id="amount-custom"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="amount-custom"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Custom
                  </Label>
                </div>
              </RadioGroup>

              {amount === "custom" && (
                <div className="mt-4">
                  <Label htmlFor="custom-amount">Enter Custom Amount ($)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    required={amount === "custom"}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800"
              disabled={isSubmitting || (amount === "custom" && !customAmount)}
            >
              {isSubmitting ? "Processing..." : "Donate Now"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-500">
        <p>Secure payment processing</p>
        <p>Tax deductible</p>
      </CardFooter>
    </Card>
  );
}
