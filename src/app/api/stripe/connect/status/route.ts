import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in" },
      { status: 401 }
    );
  }

  try {
    const host = await prisma.host.findFirst({
      where: { userId: session.user.id },
    });

    if (!host) {
      return NextResponse.json(
        { error: "Host profile not found" },
        { status: 404 }
      );
    }

    if (!host.stripeAccountId) {
      return NextResponse.json({
        connected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        onboardingComplete: false,
      });
    }

    const account = await stripe.accounts.retrieve(host.stripeAccountId);

    const chargesEnabled = account.charges_enabled || false;
    const payoutsEnabled = account.payouts_enabled || false;
    const detailsSubmitted = account.details_submitted || false;

    if (
      host.stripeChargesEnabled !== chargesEnabled ||
      host.stripePayoutsEnabled !== payoutsEnabled ||
      host.stripeOnboardingComplete !== detailsSubmitted
    ) {
      await prisma.host.update({
        where: { id: host.id },
        data: {
          stripeChargesEnabled: chargesEnabled,
          stripePayoutsEnabled: payoutsEnabled,
          stripeOnboardingComplete: detailsSubmitted,
        },
      });
    }

    return NextResponse.json({
      connected: true,
      chargesEnabled,
      payoutsEnabled,
      onboardingComplete: detailsSubmitted,
      accountId: host.stripeAccountId,
    });
  } catch (error) {
    console.error("Stripe Connect status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch account status" },
      { status: 500 }
    );
  }
}
