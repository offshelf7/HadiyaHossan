"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { createClient } from "../../supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import StripeElementsWrapper from "./stripe-elements";
import ChapaPayment from "./chapa-payment";
import { useRouter } from "next/navigation";

export default function DonationForm() {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const supabase = createClient();
  const router = useRouter();

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value !== "custom") {
      setCustomAmount("");
    }
  };

  useEffect(() => {
    // Create a PaymentIntent when amount, name, and email are all valid
    if (amount && name.trim() && email.trim()) {
      const donationAmount = getDonationAmount();
      if (donationAmount > 0) {
        createPaymentIntent();
      }
    }
  }, [amount, customAmount, name, email]);

  const createPaymentIntent = async () => {
    try {
      // Get the actual donation amount
      const donationAmount =
        amount === "custom" ? parseFloat(customAmount) : parseFloat(amount);

      if (isNaN(donationAmount) || donationAmount <= 0) {
        return;
      }

      // Only proceed if we have valid form data
      if (!name.trim() || !email.trim() || donationAmount <= 0) {
        return;
      }
      //console.log("Env value: " + process.env.STRIPE_SECRET_KEY);

      // Create a payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationAmount,
          metadata: {
            donor_name: name,
            donor_email: email,
            anonymous: anonymous,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process payment");
      }

      const data = await response.json();
      const { clientSecret: secret } = data;
      setClientSecret(secret);
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Get current user if logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Get the actual donation amount
      const donationAmount =
        amount === "custom" ? parseFloat(customAmount) : parseFloat(amount);

      // Store donation in database
      const { error: donationError } = await supabase.from("donations").insert({
        user_id: user?.id || null,
        amount: donationAmount,
        currency: "usd",
        payment_intent_id: paymentIntentId,
        payment_status: "succeeded",
        donor_name: name,
        donor_email: email,
        anonymous: anonymous,
        message: message,
      });

      if (donationError) {
        console.error("Error saving donation:", donationError);
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Redirect to success page
      setTimeout(() => {
        router.push(`/success?session_id=${paymentIntentId}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error handling payment success:", error);
      setIsSubmitting(false);
    }
  };

  const getDonationAmount = () => {
    return amount === "custom"
      ? parseFloat(customAmount) || 0
      : parseFloat(amount) || 0;
  };

  const isFormValid = () => {
    const donationAmount = getDonationAmount();
    return donationAmount > 0 && name.trim() !== "" && email.trim() !== "";
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
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to confirmation page...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {paymentError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {paymentError}
              </div>
            )}

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

            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Leave a message with your donation"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={anonymous}
                onCheckedChange={(checked) => setAnonymous(checked as boolean)}
              />
              <Label
                htmlFor="anonymous"
                className="text-sm font-normal cursor-pointer"
              >
                Make my donation anonymous
              </Label>
            </div>

            {isFormValid() && (
              <Tabs
                defaultValue="card"
                onValueChange={setPaymentMethod}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="chapa">Chapa</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-4">
                  <StripeElementsWrapper
                    clientSecret={clientSecret}
                    amount={getDonationAmount()}
                    onSuccess={handlePaymentSuccess}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                  />
                </TabsContent>
                <TabsContent value="chapa" className="mt-4">
                  <ChapaPayment
                    amount={getDonationAmount()}
                    email={email}
                    firstName={name.split(" ")[0]}
                    lastName={name.split(" ").slice(1).join(" ") || ""}
                    onSuccess={handlePaymentSuccess}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
