import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const { buyerId, hostId, packageId, amount } = session.metadata || {};
    
    if (!buyerId || !hostId || !packageId || !amount) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      const existingBooking = await prisma.booking.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (existingBooking) {
        console.log("Booking already exists for session:", session.id);
        return NextResponse.json({ received: true });
      }

      const platformFee = Math.round(parseInt(amount) * 0.10);

      await prisma.booking.create({
        data: {
          buyerId,
          hostId,
          packageId,
          amount: parseInt(amount),
          platformFee,
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          status: "CONFIRMED",
        },
      });

      console.log("Booking created for session:", session.id);
    } catch (error) {
      console.error("Error creating booking:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
