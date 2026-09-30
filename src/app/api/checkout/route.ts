import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

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
    const { hostId, packageId, scheduledDate } = body;

    if (!hostId || !packageId || !scheduledDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [host, creatorProfile] = await Promise.all([prisma.host.findUnique({
      where: { id: hostId },
      include: { packages: { where: { id: packageId } } },
    }), prisma.creatorProfile.findUnique({ where: { userId: session.user.id } })]);

    if (!host) {
      return NextResponse.json(
        { error: "Host not found" },
        { status: 404 }
      );
    }

    if (!creatorProfile?.isComplete) {
      return NextResponse.json({ error: "Complete your creator profile before booking" }, { status: 400 });
    }

    const selectedPackage = host.packages[0];
    if (!selectedPackage) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    const requestedDate = new Date(scheduledDate);
    if (Number.isNaN(requestedDate.getTime()) || requestedDate <= new Date()) {
      return NextResponse.json({ error: "Choose a valid future booking time" }, { status: 400 });
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        hostId,
        scheduledDate: {
          gte: new Date(requestedDate.getTime() - (selectedPackage.durationMinutes + selectedPackage.bufferMinutes) * 60_000),
          lte: new Date(requestedDate.getTime() + (selectedPackage.durationMinutes + selectedPackage.bufferMinutes) * 60_000),
        },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
    });
    if (overlappingBooking) return NextResponse.json({ error: "That time was just booked. Please choose another." }, { status: 409 });

    const price = selectedPackage.price;
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
              name: `${selectedPackage.name} with ${host.channelName}`,
              description: `Guest spot package on COMARI.`,
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
        packageName: selectedPackage.name,
        amount: price.toString(),
        platformFee: (platformFee / 100).toString(),
        scheduledDate: requestedDate.toISOString(),
        bookingMode: selectedPackage.bookingMode,
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

    const checkoutSession = await getStripe().checkout.sessions.create(sessionParams);

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
