"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const StripeElementsWrapper = dynamic(
  () => import("@/components/stripe-elements"),
  { ssr: false },
);
const ChapaPayment = dynamic(() => import("@/components/chapa-payment"), {
  ssr: false,
});
const Navbar = dynamic(() => import("@/components/navbar"), { ssr: false });

export default function CheckoutPage() {
  const { cart, subtotal, clearCart, checkAvailability } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donation, setDonation] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    saveInfo: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDonation(value);
  };

  useEffect(() => {
    // Verify inventory availability when the page loads
    if (cart.length > 0) {
      verifyInventoryAvailability();
    }
  }, [cart]);

  const verifyInventoryAvailability = async () => {
    setInventoryError(null);

    // Check each item in the cart for availability
    for (const item of cart) {
      const isAvailable = await checkAvailability(item.id, item.quantity);
      if (!isAvailable) {
        setInventoryError(
          `${item.name} is not available in the requested quantity. Please update your cart.`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmitPayment = async () => {
    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.country
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Verify inventory one more time before processing payment
    const inventoryAvailable = await verifyInventoryAvailability();
    if (!inventoryAvailable) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          customerInfo: formData,
          donation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment processing failed");
      }

      // Handle successful payment
      clearCart();
      router.push(`/success?session_id=${data.paymentIntentId}`);
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description:
          error.message || "An error occurred during payment processing.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <Link
            href="/cart"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {inventoryError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Inventory Issue</AlertTitle>
            <AlertDescription>{inventoryError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="saveInfo"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          saveInfo: checked as boolean,
                        })
                      }
                    />
                    <Label
                      htmlFor="saveInfo"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Save this information for next time
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support the Club</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Would you like to add a donation to support our youth
                    development programs?
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="donation">Donation Amount ($)</Label>
                    <Input
                      id="donation"
                      name="donation"
                      type="number"
                      min="0"
                      step="0.01"
                      value={donation || ""}
                      onChange={handleDonationChange}
                      placeholder="0.00"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span>Secure payment processing</span>
                    </div>

                    <Button
                      onClick={handleSubmitPayment}
                      className="w-full bg-red-700 hover:bg-red-800"
                      disabled={isSubmitting || !!inventoryError}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : `Pay ${(subtotal + donation).toFixed(2)}`}
                    </Button>

                    <p className="text-xs text-gray-500">
                      By clicking the button above, you agree to our terms of
                      service and privacy policy. Your payment information is
                      processed securely. We do not store credit card details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex justify-between py-2"
                    >
                      <div className="flex items-start">
                        <span className="text-sm font-medium">
                          {item.quantity} × {item.name}
                          {item.size && (
                            <span className="text-xs text-gray-500 block">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs text-gray-500 block">
                              Color: {item.color}
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  {donation > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Donation</span>
                      <span>${donation.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(subtotal + donation).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Secure payment processing</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your payment information is processed securely. We do not
                  store credit card details nor have access to your payment
                  information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
