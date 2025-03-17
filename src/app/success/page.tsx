"use client";

import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, you would fetch order details from your backend
    // For this demo, we'll simulate order details
    if (sessionId) {
      setOrderDetails({
        id: sessionId,
        date: new Date().toLocaleDateString(),
        total: "$" + (Math.random() * 100 + 50).toFixed(2),
      });
    }
  }, [sessionId]);

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Payment Successful!
            </CardTitle>
            <CardDescription>
              Thank you for your purchase. Your payment has been processed
              successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              You will receive a confirmation email shortly with your purchase
              details.
            </p>

            {orderDetails && (
              <div className="w-full bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-medium">
                    {orderDetails.id.substring(0, 12)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{orderDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{orderDetails.total}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button asChild className="w-full bg-red-700 hover:bg-red-800">
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
