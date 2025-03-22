import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../../supabase/server";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency = "usd",
      userId,
      email,
      metadata = {},
    } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabaseClient = await createClient();

    // Get user information if userId is provided but email is not
    let customerEmail = email;
    if (userId && !customerEmail) {
      const { data: userData, error: userError } = await supabaseClient
        .from("users")
        .select("email")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
      } else if (userData) {
        customerEmail = userData.email;
      }
    }

    // Create or retrieve a customer
    let customerId;
    if (customerEmail) {
      // Check if customer already exists
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        // Create a new customer
        const customer = await stripe.customers.create({
          email: customerEmail,
          metadata: { userId },
        });
        customerId = customer.id;
      }
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      receipt_email: customerEmail,
      metadata: {
        userId,
        ...metadata,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
