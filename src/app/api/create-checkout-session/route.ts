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
      priceId,
      userId,
      successUrl,
      cancelUrl,
      metadata = {},
    } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabaseClient = await createClient();

    // Get user information if userId is provided
    let customerEmail;
    if (userId) {
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

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        successUrl ||
        `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/pricing`,
      customer_email: customerEmail,
      metadata: {
        userId,
        ...metadata,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
