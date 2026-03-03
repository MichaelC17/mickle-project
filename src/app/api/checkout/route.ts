import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hostId, hostName, packageName, price } = body;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${packageName} with ${hostName}`,
              description: `Guest spot package on COLLAB.`,
            },
            unit_amount: price * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}&host=${hostId}&package=${encodeURIComponent(packageName)}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/host/${hostId}`,
      metadata: {
        hostId,
        hostName,
        packageName,
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error("Stripe error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json(
      { error: message.includes("Invalid API Key") ? "Invalid Stripe API key - check your .env.local file" : message },
      { status: 500 }
    );
  }
}
