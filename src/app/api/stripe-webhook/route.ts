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
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    if (!signature) {
      console.error("No Stripe signature found in headers");
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret!,
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
      );
    }

    console.log("Processing webhook event:", event.type);

    // Create Supabase client
    const supabaseClient = await createClient();

    // Log the webhook event
    await logAndStoreWebhookEvent(supabaseClient, event, event.data.object);

    // Handle the event based on type
    switch (event.type) {
      case "customer.subscription.created":
        return await handleSubscriptionCreated(supabaseClient, event);
      case "customer.subscription.updated":
        return await handleSubscriptionUpdated(supabaseClient, event);
      case "customer.subscription.deleted":
        return await handleSubscriptionDeleted(supabaseClient, event);
      case "checkout.session.completed":
        return await handleCheckoutSessionCompleted(supabaseClient, event);
      case "invoice.payment_succeeded":
        return await handleInvoicePaymentSucceeded(supabaseClient, event);
      case "invoice.payment_failed":
        return await handleInvoicePaymentFailed(supabaseClient, event);
      case "payment_intent.succeeded":
        return await handlePaymentIntentSucceeded(supabaseClient, event);
      case "payment_intent.payment_failed":
        return await handlePaymentIntentFailed(supabaseClient, event);
      default:
        console.log(`Unhandled event type: ${event.type}`);
        return NextResponse.json(
          { message: `Unhandled event type: ${event.type}` },
          { status: 200 },
        );
    }
  } catch (err: any) {
    console.error("Error processing webhook:", err);
    console.error("Error stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Types
type WebhookEvent = {
  event_type: string;
  type: string;
  stripe_event_id: string;
  created_at: string;
  modified_at: string;
  data: any;
};

type SubscriptionData = {
  stripe_id: string;
  user_id: string;
  price_id: string;
  stripe_price_id: string;
  currency: string;
  interval: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  amount: number;
  started_at: number;
  customer_id: string;
  metadata: Record<string, any>;
  canceled_at?: number;
  ended_at?: number;
};

// Utility functions
async function logAndStoreWebhookEvent(
  supabaseClient: any,
  event: any,
  data: any,
): Promise<void> {
  const { error } = await supabaseClient.from("webhook_events").insert({
    event_type: event.type,
    type: event.type.split(".")[0],
    stripe_event_id: event.id,
    created_at: new Date(event.created * 1000).toISOString(),
    modified_at: new Date(event.created * 1000).toISOString(),
    data,
  } as WebhookEvent);

  if (error) {
    console.error("Error logging webhook event:", error);
    throw error;
  }
}

async function updateSubscriptionStatus(
  supabaseClient: any,
  stripeId: string,
  status: string,
): Promise<void> {
  const { error } = await supabaseClient
    .from("subscriptions")
    .update({ status })
    .eq("stripe_id", stripeId);

  if (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
}

// Event handlers
async function handleSubscriptionCreated(supabaseClient: any, event: any) {
  const subscription = event.data.object;
  console.log("Handling subscription created:", subscription.id);

  // Try to get user information
  let userId = subscription.metadata?.user_id || subscription.metadata?.userId;
  if (!userId) {
    try {
      const customer = await stripe.customers.retrieve(subscription.customer);
      const { data: userData } = await supabaseClient
        .from("users")
        .select("id")
        .eq("email", customer.email)
        .single();

      userId = userData?.id;
      if (!userId) {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Unable to find associated user:", error);
      return NextResponse.json(
        { error: "Unable to find associated user" },
        { status: 400 },
      );
    }
  }

  const subscriptionData: SubscriptionData = {
    stripe_id: subscription.id,
    user_id: userId,
    price_id: subscription.items.data[0]?.price.id,
    stripe_price_id: subscription.items.data[0]?.price.id,
    currency: subscription.currency,
    interval: subscription.items.data[0]?.plan.interval,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    amount: subscription.items.data[0]?.plan.amount ?? 0,
    started_at: subscription.start_date ?? Math.floor(Date.now() / 1000),
    customer_id: subscription.customer,
    metadata: subscription.metadata || {},
    canceled_at: subscription.canceled_at,
    ended_at: subscription.ended_at,
  };

  // First, check if a subscription with this stripe_id already exists
  const { data: existingSubscription } = await supabaseClient
    .from("subscriptions")
    .select("id")
    .eq("stripe_id", subscription.id)
    .maybeSingle();

  // Update subscription in database
  const { error } = await supabaseClient.from("subscriptions").upsert(
    {
      // If we found an existing subscription, use its UUID, otherwise let Supabase generate one
      ...(existingSubscription?.id ? { id: existingSubscription.id } : {}),
      ...subscriptionData,
    },
    {
      // Use stripe_id as the match key for upsert
      onConflict: "stripe_id",
    },
  );

  if (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Subscription created successfully" },
    { status: 200 },
  );
}

async function handleSubscriptionUpdated(supabaseClient: any, event: any) {
  const subscription = event.data.object;
  console.log("Handling subscription updated:", subscription.id);

  const { error } = await supabaseClient
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      metadata: subscription.metadata,
      canceled_at: subscription.canceled_at,
      ended_at: subscription.ended_at,
    })
    .eq("stripe_id", subscription.id);

  if (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Subscription updated successfully" },
    { status: 200 },
  );
}

async function handleSubscriptionDeleted(supabaseClient: any, event: any) {
  const subscription = event.data.object;
  console.log("Handling subscription deleted:", subscription.id);

  try {
    await updateSubscriptionStatus(supabaseClient, subscription.id, "canceled");

    // If we have email in metadata, update user's subscription status
    if (subscription?.metadata?.email) {
      await supabaseClient
        .from("users")
        .update({ subscription: null })
        .eq("email", subscription.metadata.email);
    }

    return NextResponse.json(
      { message: "Subscription deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Failed to process subscription deletion" },
      { status: 500 },
    );
  }
}

async function handleCheckoutSessionCompleted(supabaseClient: any, event: any) {
  const session = event.data.object;
  console.log("Handling checkout session completed:", session.id);
  console.log("Full session data:", JSON.stringify(session, null, 2));

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  console.log("Extracted subscriptionId:", subscriptionId);
  console.log("Session metadata:", JSON.stringify(session.metadata, null, 2));

  if (!subscriptionId) {
    console.log("No subscription ID found in checkout session");
    return NextResponse.json(
      { message: "No subscription in checkout session" },
      { status: 200 },
    );
  }

  try {
    console.log(
      "Attempting to update subscription in Stripe with ID:",
      subscriptionId,
    );
    console.log("Metadata to be added:", {
      ...session.metadata,
      checkoutSessionId: session.id,
    });

    // Fetch the current subscription from Stripe to get the latest status
    const stripeSubscription =
      await stripe.subscriptions.retrieve(subscriptionId);
    console.log(
      "Retrieved Stripe subscription status:",
      stripeSubscription.status,
    );

    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        metadata: {
          ...session.metadata,
          checkoutSessionId: session.id,
        },
      },
    );

    console.log(
      "Successfully updated Stripe subscription:",
      updatedStripeSubscription.id,
    );
    console.log(
      "Updated Stripe metadata:",
      JSON.stringify(updatedStripeSubscription.metadata, null, 2),
    );

    console.log(
      "Attempting to update subscription in Supabase with stripe_id:",
      subscriptionId,
    );
    console.log(
      "User ID being set:",
      session.metadata?.userId || session.metadata?.user_id,
    );

    const supabaseUpdateResult = await supabaseClient
      .from("subscriptions")
      .update({
        metadata: {
          ...session.metadata,
          checkoutSessionId: session.id,
        },
        user_id: session.metadata?.userId || session.metadata?.user_id,
        status: stripeSubscription.status, // Update the status from Stripe
        current_period_start: stripeSubscription.current_period_start,
        current_period_end: stripeSubscription.current_period_end,
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      })
      .eq("stripe_id", subscriptionId);

    console.log(
      "Supabase update result:",
      JSON.stringify(supabaseUpdateResult, null, 2),
    );

    if (supabaseUpdateResult.error) {
      console.error(
        "Error updating Supabase subscription:",
        supabaseUpdateResult.error,
      );
      throw new Error(
        `Supabase update failed: ${supabaseUpdateResult.error.message}`,
      );
    }

    return NextResponse.json(
      {
        message: "Checkout session completed successfully",
        subscriptionId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error processing checkout completion:", error);
    console.error(
      "Error details:",
      JSON.stringify(error, Object.getOwnPropertyNames(error)),
    );
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to process checkout completion",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

async function handleInvoicePaymentSucceeded(supabaseClient: any, event: any) {
  const invoice = event.data.object;
  console.log("Handling invoice payment succeeded:", invoice.id);

  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  try {
    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("stripe_id", subscriptionId)
      .single();

    const webhookData = {
      event_type: event.type,
      type: "invoice",
      stripe_event_id: event.id,
      data: {
        invoiceId: invoice.id,
        subscriptionId,
        amountPaid: String(invoice.amount_paid / 100),
        currency: invoice.currency,
        status: "succeeded",
        email: subscription?.email || invoice.customer_email,
      },
    };

    await supabaseClient.from("webhook_events").insert(webhookData);

    return NextResponse.json(
      { message: "Invoice payment succeeded" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing successful payment:", error);
    return NextResponse.json(
      { error: "Failed to process successful payment" },
      { status: 500 },
    );
  }
}

async function handleInvoicePaymentFailed(supabaseClient: any, event: any) {
  const invoice = event.data.object;
  console.log("Handling invoice payment failed:", invoice.id);

  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  try {
    const { data: subscription } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("stripe_id", subscriptionId)
      .single();

    const webhookData = {
      event_type: event.type,
      type: "invoice",
      stripe_event_id: event.id,
      data: {
        invoiceId: invoice.id,
        subscriptionId,
        amountDue: String(invoice.amount_due / 100),
        currency: invoice.currency,
        status: "failed",
        email: subscription?.email || invoice.customer_email,
      },
    };

    await supabaseClient.from("webhook_events").insert(webhookData);

    if (subscriptionId) {
      await updateSubscriptionStatus(
        supabaseClient,
        subscriptionId,
        "past_due",
      );
    }

    return NextResponse.json(
      { message: "Invoice payment failed" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing failed payment:", error);
    return NextResponse.json(
      { error: "Failed to process failed payment" },
      { status: 500 },
    );
  }
}

async function handlePaymentIntentSucceeded(supabaseClient: any, event: any) {
  const paymentIntent = event.data.object;
  console.log("Handling payment intent succeeded:", paymentIntent.id);

  try {
    // Extract customer information
    const customerId = paymentIntent.customer;
    let userEmail = paymentIntent.receipt_email;
    let userId =
      paymentIntent.metadata?.user_id || paymentIntent.metadata?.userId;

    // If we don't have user email or ID in the payment intent, try to get it from the customer
    if (customerId && (!userEmail || !userId)) {
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (!userEmail && typeof customer !== "string" && customer.email) {
          userEmail = customer.email;
        }

        // If we have email but no userId, try to find the user in Supabase
        if (userEmail && !userId) {
          const { data: userData } = await supabaseClient
            .from("users")
            .select("id")
            .eq("email", userEmail)
            .single();

          userId = userData?.id;
        }
      } catch (error) {
        console.error("Error retrieving customer information:", error);
      }
    }

    // Store payment information in the database
    const paymentData = {
      payment_intent_id: paymentIntent.id,
      user_id: userId,
      email: userEmail,
      amount: paymentIntent.amount / 100, // Convert from cents to dollars/pounds/etc.
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      payment_method: paymentIntent.payment_method,
      metadata: paymentIntent.metadata || {},
      created_at: new Date(paymentIntent.created * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert payment record
    const { error: paymentInsertError } = await supabaseClient
      .from("payments")
      .insert(paymentData);

    if (paymentInsertError) {
      console.error("Error storing payment record:", paymentInsertError);
      throw paymentInsertError;
    }

    // If this is a donation payment, update the donations table
    if (paymentIntent.metadata?.payment_type === "donation") {
      const donationData = {
        payment_intent_id: paymentIntent.id,
        user_id: userId,
        email: userEmail,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        message: paymentIntent.metadata?.message || "",
        display_name: paymentIntent.metadata?.display_name || "",
        is_anonymous: paymentIntent.metadata?.is_anonymous === "true",
        created_at: new Date(paymentIntent.created * 1000).toISOString(),
      };

      const { error: donationInsertError } = await supabaseClient
        .from("donations")
        .insert(donationData);

      if (donationInsertError) {
        console.error("Error storing donation record:", donationInsertError);
        // Don't throw here, we still want to acknowledge the webhook
      }
    }

    // If this is a product purchase, update the orders table
    if (paymentIntent.metadata?.payment_type === "product_purchase") {
      try {
        const orderItems = JSON.parse(
          paymentIntent.metadata?.order_items || "[]",
        );

        // Create the order record
        const orderData = {
          payment_intent_id: paymentIntent.id,
          user_id: userId,
          email: userEmail,
          total_amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: "paid",
          shipping_address: paymentIntent.metadata?.shipping_address || "",
          created_at: new Date(paymentIntent.created * 1000).toISOString(),
        };

        const { data: orderInsertResult, error: orderInsertError } =
          await supabaseClient
            .from("orders")
            .insert(orderData)
            .select("id")
            .single();

        if (orderInsertError) {
          console.error("Error creating order record:", orderInsertError);
        } else if (orderInsertResult && orderItems.length > 0) {
          // Insert order items
          const orderItemsData = orderItems.map((item: any) => ({
            order_id: orderInsertResult.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          }));

          const { error: orderItemsInsertError } = await supabaseClient
            .from("order_items")
            .insert(orderItemsData);

          if (orderItemsInsertError) {
            console.error("Error creating order items:", orderItemsInsertError);
          }

          // Update product inventory
          for (const item of orderItems) {
            await supabaseClient.rpc("decrement_inventory", {
              p_product_id: item.product_id,
              p_quantity: item.quantity,
            });
          }
        }
      } catch (error) {
        console.error("Error processing order data:", error);
      }
    }

    return NextResponse.json(
      { message: "Payment intent processed successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error processing payment intent:", error);
    return NextResponse.json(
      { error: "Failed to process payment intent", details: error.message },
      { status: 500 },
    );
  }
}

async function handlePaymentIntentFailed(supabaseClient: any, event: any) {
  const paymentIntent = event.data.object;
  console.log("Handling payment intent failed:", paymentIntent.id);

  try {
    // Store failed payment information
    const paymentData = {
      payment_intent_id: paymentIntent.id,
      user_id:
        paymentIntent.metadata?.user_id || paymentIntent.metadata?.userId,
      email: paymentIntent.receipt_email,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      payment_method: paymentIntent.payment_method,
      metadata: paymentIntent.metadata || {},
      error_message:
        paymentIntent.last_payment_error?.message || "Payment failed",
      created_at: new Date(paymentIntent.created * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert or update payment record
    const { error: paymentInsertError } = await supabaseClient
      .from("payments")
      .upsert(paymentData, { onConflict: "payment_intent_id" });

    if (paymentInsertError) {
      console.error("Error storing failed payment record:", paymentInsertError);
    }

    return NextResponse.json(
      { message: "Failed payment intent recorded" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error processing failed payment intent:", error);
    return NextResponse.json(
      {
        error: "Failed to process payment intent failure",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
