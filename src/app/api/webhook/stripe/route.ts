import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { notifyBookingConfirmed } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  console.log("Webhook received!");
  console.log("Webhook secret exists:", !!webhookSecret, "length:", webhookSecret.length);
  
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  
  console.log("Signature exists:", !!signature);

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set!");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("Event verified successfully:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log("Processing checkout.session.completed for:", session.id);
    console.log("Session metadata:", JSON.stringify(session.metadata));
    
    const { buyerId, hostId, packageId, amount } = session.metadata || {};
    
    if (!buyerId || !hostId || !packageId || !amount) {
      console.error("Missing metadata in checkout session:", session.id);
      console.error("Got: buyerId=", buyerId, "hostId=", hostId, "packageId=", packageId, "amount=", amount);
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

      console.log("Creating booking with:", { buyerId, hostId, packageId, amount: parseInt(amount), platformFee });

      const booking = await prisma.booking.create({
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

      console.log("Booking created successfully:", booking.id);

      await notifyBookingConfirmed(booking.id);
    } catch (error) {
      console.error("Error creating booking:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }
  } else {
    console.log("Received event type:", event.type, "- ignoring");
  }

  return NextResponse.json({ received: true });
}
