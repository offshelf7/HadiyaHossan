import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../../supabase/server";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    const { price_id, user_id, return_url } = await request.json();
    const customerEmail = request.headers.get("X-Customer-Email");

    if (!price_id || !user_id || !return_url) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Annual Membership",
              description: "Annual membership to the football club",
            },
            unit_amount: 50000, // $500.00
            recurring: {
              interval: "year",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${return_url}?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        user_id,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
