import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to make a purchase" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { hostId, hostName, packageId, packageName, price } = body;

    if (!hostId || !packageId || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${packageName} with ${hostName}`,
              description: `Guest spot package on COLLAB.`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/host/${hostId}`,
      metadata: {
        buyerId: session.user.id,
        hostId,
        packageId,
        packageName,
        amount: price.toString(),
      },
    });

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
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
