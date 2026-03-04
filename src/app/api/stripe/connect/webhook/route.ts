import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        
        await prisma.host.updateMany({
          where: { stripeAccountId: account.id },
          data: {
            stripeChargesEnabled: account.charges_enabled || false,
            stripePayoutsEnabled: account.payouts_enabled || false,
            stripeOnboardingComplete: account.details_submitted || false,
          },
        });
        
        console.log(`Updated Stripe status for account ${account.id}`);
        break;
      }

      case "account.application.deauthorized": {
        const application = event.data.object as { id: string; object: string };
        const accountId = event.account;
        
        if (accountId) {
          await prisma.host.updateMany({
            where: { stripeAccountId: accountId },
            data: {
              stripeAccountId: null,
              stripeChargesEnabled: false,
              stripePayoutsEnabled: false,
              stripeOnboardingComplete: false,
            },
          });
          
          console.log(`Deauthorized Stripe account ${accountId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
