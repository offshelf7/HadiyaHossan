import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET() {
  try {
    const plans = await stripe.plans.list({
      active: true,
    });

    return NextResponse.json(plans.data);
  } catch (error: any) {
    console.error("Error getting plans:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
