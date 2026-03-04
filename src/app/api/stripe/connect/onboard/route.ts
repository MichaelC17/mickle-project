import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

export async function POST() {
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
      include: { user: true },
    });

    if (!host) {
      return NextResponse.json(
        { error: "You must be a host to connect a Stripe account" },
        { status: 403 }
      );
    }

    let stripeAccountId = host.stripeAccountId;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: host.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          hostId: host.id,
          userId: session.user.id,
        },
      });

      stripeAccountId = account.id;

      await prisma.host.update({
        where: { id: host.id },
        data: { stripeAccountId: account.id },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/dashboard/host?stripe_refresh=true`,
      return_url: `${baseUrl}/dashboard/host?stripe_onboarding=complete`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to create onboarding link" },
      { status: 500 }
    );
  }
}
