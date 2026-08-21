import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { notifyBookingConfirmed } from "@/lib/notifications";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

async function captureBaselineStats(bookingId: string, buyerId: string) {
  try {
    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
      include: {
        accounts: {
          where: { provider: "google-youtube" },
        },
      },
    });

    if (!buyer?.accounts[0]?.access_token) {
      console.log("No YouTube account found for buyer, skipping baseline capture");
      return;
    }

    const account = buyer.accounts[0];
    
    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      }
    );

    if (!channelRes.ok) {
      console.log("Failed to fetch YouTube channel stats");
      return;
    }

    const channelData = await channelRes.json();
    const stats = channelData.items?.[0]?.statistics;

    if (!stats) {
      console.log("No channel stats found");
      return;
    }

    const now = new Date();

    await prisma.growthTracking.create({
      data: {
        bookingId,
        buyerChannelId: account.providerAccountId,
        baselineSubCount: parseInt(stats.subscriberCount) || 0,
        baselineViewCount: parseInt(stats.viewCount) || 0,
        baselineDate: now,
        trackingStartDate: now,
        trackingEndDate: now,
        status: "PENDING",
      },
    });

    console.log("Baseline stats captured for booking:", bookingId);
  } catch (error) {
    console.error("Error capturing baseline stats:", error);
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set!");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
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

      const platformFee = Math.round(parseInt(amount) * 0.15);

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
      
      captureBaselineStats(booking.id, buyerId).catch((err) =>
        console.error("Failed to capture baseline stats:", err)
      );
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
