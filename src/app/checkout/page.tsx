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
import { ArrowLeft, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const StripeElementsWrapper = dynamic(
  () => import("@/components/stripe-elements"),
  { ssr: false },
);
const ChapaPayment = dynamic(() => import("@/components/chapa-payment"), {
  ssr: false,
});
const Navbar = dynamic(() => import("@/components/navbar"), { ssr: false });

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donation, setDonation] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
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
    // Create a PaymentIntent as soon as the page loads
    if (cart.length > 0 && typeof window !== "undefined") {
      createPaymentIntent();
    }
  }, [cart, donation]);

  const createPaymentIntent = async () => {
    try {
      const totalAmount = subtotal + donation;

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          metadata: {
            cart_items: JSON.stringify(
              cart.map((item) => ({ id: item.id, quantity: item.quantity })),
            ),
            donation_amount: donation,
            customer_email: formData.email,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    // Save order to database
    saveOrder(paymentId);

    // Clear cart and redirect to success page
    clearCart();
    if (typeof window !== "undefined") {
      router.push(`/success?session_id=${paymentId}`);
    }
  };

  const saveOrder = async (paymentId: string) => {
    try {
      // In a real implementation, you would save the order to your database
      // This is just a placeholder
      console.log("Order saved with payment ID:", paymentId);
    } catch (error) {
      console.error("Error saving order:", error);
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
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
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
                        amount={subtotal + donation}
                        onSuccess={handlePaymentSuccess}
                        isSubmitting={isSubmitting}
                        setIsSubmitting={setIsSubmitting}
                      />
                    </TabsContent>
                    <TabsContent value="chapa" className="mt-4">
                      <ChapaPayment
                        amount={subtotal + donation}
                        email={formData.email}
                        firstName={formData.firstName}
                        lastName={formData.lastName}
                        onSuccess={handlePaymentSuccess}
                        isSubmitting={isSubmitting}
                        setIsSubmitting={setIsSubmitting}
                      />
                    </TabsContent>
                  </Tabs>
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
