import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-01-28.clover",
});

const PLATFORM_FEE_PERCENT = 15;

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

    const host = await prisma.host.findUnique({
      where: { id: hostId },
    });

    if (!host) {
      return NextResponse.json(
        { error: "Host not found" },
        { status: 404 }
      );
    }

    const amountInCents = price * 100;
    const platformFee = Math.round(amountInCents * (PLATFORM_FEE_PERCENT / 100));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${packageName} with ${hostName}`,
              description: `Guest spot package on COLLAB.`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/host/${hostId}`,
      metadata: {
        buyerId: session.user.id,
        hostId,
        packageId,
        packageName,
        amount: price.toString(),
        platformFee: (platformFee / 100).toString(),
      },
    };

    if (host.stripeAccountId && host.stripeChargesEnabled) {
      sessionParams.payment_intent_data = {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: host.stripeAccountId,
        },
      };
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

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
