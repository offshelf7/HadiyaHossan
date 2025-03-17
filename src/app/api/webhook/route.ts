import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../../supabase/server";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  // Handle the event
  const supabase = await createClient();

  try {
    // Log the event to the webhook_events table
    await supabase.from("webhook_events").insert({
      stripe_event_id: event.id,
      type: event.type,
      event_type: "stripe",
      data: event.data.object,
    });

    // Handle specific event types
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );

        // Check if this is a donation or an order
        if (paymentIntent.metadata.cart_items) {
          // This is an order payment
          const cartItems = JSON.parse(
            paymentIntent.metadata.cart_items || "[]",
          );
          const userEmail = paymentIntent.metadata.customer_email;

          // Find the user by email
          const { data: userData } = await supabase
            .from("users")
            .select("id")
            .eq("email", userEmail)
            .single();

          // Create the order
          const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
              user_id: userData?.id,
              status: "completed",
              total_amount: paymentIntent.amount / 100, // Convert from cents
              payment_intent_id: paymentIntent.id,
            })
            .select()
            .single();

          if (orderError) {
            console.error("Error creating order:", orderError);
            break;
          }

          // Add order items
          for (const item of cartItems) {
            // Get product details
            const { data: product } = await supabase
              .from("products")
              .select("*")
              .eq("id", item.id)
              .single();

            if (product) {
              await supabase.from("order_items").insert({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: product.price,
                size: item.size,
                color: item.color,
              });
            }
          }
        } else {
          // This is a donation payment
          // Update donation status if needed
          if (paymentIntent.metadata.donation_id) {
            await supabase
              .from("donations")
              .update({ payment_status: "succeeded" })
              .eq("id", paymentIntent.metadata.donation_id);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          `Payment failed: ${paymentIntent.last_payment_error?.message}`,
        );

        // Update donation or order status if needed
        if (paymentIntent.metadata.donation_id) {
          await supabase
            .from("donations")
            .update({ payment_status: "failed" })
            .eq("id", paymentIntent.metadata.donation_id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 },
    );
  }
}
