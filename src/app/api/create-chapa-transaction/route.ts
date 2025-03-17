import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      amount,
      email,
      first_name,
      last_name,
      phone_number,
      tx_ref,
      callback_url,
      return_url,
    } = await req.json();

    // In a real implementation, you would make a request to Chapa's API
    // const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     amount,
    //     currency: "ETB",
    //     email,
    //     first_name,
    //     last_name,
    //     phone_number,
    //     tx_ref,
    //     callback_url,
    //     return_url,
    //   }),
    // });
    //
    // const data = await response.json();
    //
    // if (!data.status || data.status !== "success") {
    //   throw new Error(data.message || "Failed to initialize Chapa payment");
    // }

    // For this demo, we'll simulate a successful response
    return NextResponse.json({
      status: "success",
      message: "Checkout URL created",
      data: {
        checkout_url: "https://checkout.chapa.co/checkout/payment/sample",
        transaction_id: `chapa-tx-${Date.now()}`,
      },
      transaction_id: `chapa-tx-${Date.now()}`,
    });
  } catch (error) {
    console.error("Error creating Chapa transaction:", error);
    return NextResponse.json(
      { error: "Failed to create Chapa transaction" },
      { status: 500 },
    );
  }
}
