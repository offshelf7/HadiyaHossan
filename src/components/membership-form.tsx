"use client";

import { useState } from "react";
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

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        message: "",
      });
    }, 1500);
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
            <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
            <p className="text-gray-600">
              Thank you for your interest in becoming a member. We'll review
              your application and contact you soon.
            </p>
            <Button className="mt-6" onClick={() => setSubmitSuccess(false)}>
              Submit Another Application
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
