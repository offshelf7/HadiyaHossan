"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

export default function MembershipForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user?.email) {
        setFormData((prev) => ({
          ...prev,
          email: user.email,
          fullName: user.user_metadata?.full_name || "",
        }));
      }
    };

    checkUser();
  }, [supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentError("");

    try {
      // Get current user if logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // If not logged in, redirect to sign up
        router.push("/sign-up");
        return;
      }

      // Create a checkout session using the edge function
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            "X-Customer-Email": formData.email,
          },
          body: JSON.stringify({
            price_id: "price_membership_annual", // This would be your actual Stripe price ID
            user_id: user.id,
            return_url: `${window.location.origin}/success`,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();

      // Update user profile with membership data
      const { error: updateError } = await supabase
        .from("users")
        .update({
          name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating user profile:", updateError);
      }

      // In a real implementation, redirect to Stripe checkout
      // window.location.href = url;

      // For this demo, simulate successful payment
      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch (error: any) {
      setIsSubmitting(false);
      setPaymentError(
        error.message || "An error occurred while processing your membership",
      );
      console.error("Payment error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Become a Member</CardTitle>
        <CardDescription>
          Join our club membership program for exclusive benefits and support
          the team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitSuccess ? (
          <div className="text-center py-8">
            <div className="text-[#7f001b] text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">Membership Confirmed!</h3>
            <p className="text-gray-600">
              Thank you for becoming a member! Your payment has been processed
              successfully. You now have access to all member benefits.
            </p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              Return to Home Page
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {paymentError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {paymentError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                disabled={!!user} // Disable if user is logged in
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+251 91 234 5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Addis Ababa, Ethiopia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Why do you want to join?</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us why you want to become a member..."
                rows={3}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-[#7f001b] hover:bg-opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : "Submit Application & Pay $500"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col text-sm text-gray-500">
        <p>Membership fee: $500 per year</p>
        <p>
          Benefits include exclusive content, match tickets, and merchandise
          discounts
        </p>
      </CardFooter>
    </Card>
  );
}
