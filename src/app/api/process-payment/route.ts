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
      cart,
      customerInfo,
      paymentMethodId,
      donation = 0,
    } = await req.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 },
      );
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { error: "Customer information is required" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabaseClient = await createClient();

    // Check inventory availability for all items
    for (const item of cart) {
      const { data, error } = await supabaseClient.rpc(
        "check_product_availability",
        {
          p_product_id: item.id,
          p_quantity: item.quantity,
        },
      );

      if (error || !data) {
        return NextResponse.json(
          {
            error: `Product ${item.name} is not available in the requested quantity`,
          },
          { status: 400 },
        );
      }
    }

    // Calculate total amount
    const subtotal = cart.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0,
    );
    const totalAmount = subtotal + donation;

    // Create or retrieve a customer
    let customer;
    const customers = await stripe.customers.list({
      email: customerInfo.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerInfo.email,
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        address: {
          line1: customerInfo.address,
          city: customerInfo.city,
          postal_code: customerInfo.postalCode,
          country: customerInfo.country,
        },
      });
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      customer: customer.id,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${req.headers.get("origin")}/success`,
      metadata: {
        order_items: JSON.stringify(
          cart.map((item: any) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        ),
        donation_amount: donation.toString(),
        payment_type: "product_purchase",
        shipping_address: JSON.stringify({
          address: customerInfo.address,
          city: customerInfo.city,
          postal_code: customerInfo.postalCode,
          country: customerInfo.country,
        }),
      },
    });

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        payment_intent_id: paymentIntent.id,
        email: customerInfo.email,
        total_amount: totalAmount,
        currency: "usd",
        status: paymentIntent.status,
        shipping_address: JSON.stringify({
          address: customerInfo.address,
          city: customerInfo.city,
          postal_code: customerInfo.postalCode,
          country: customerInfo.country,
        }),
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    // Create order items and update inventory
    const orderItems = cart.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));

    const { error: orderItemsError } = await supabaseClient
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
    }

    // Update inventory for each item
    for (const item of cart) {
      await supabaseClient.rpc("decrement_inventory", {
        p_product_id: item.id,
        p_quantity: item.quantity,
      });
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
    });
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: 500 },
    );
  }
}
