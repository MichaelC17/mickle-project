import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

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
    });

    if (!host || !host.stripeAccountId) {
      return NextResponse.json(
        { error: "No connected Stripe account found" },
        { status: 404 }
      );
    }

    const loginLink = await getStripe().accounts.createLoginLink(host.stripeAccountId);

    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    console.error("Stripe dashboard link error:", error);
    return NextResponse.json(
      { error: "Failed to create dashboard link" },
      { status: 500 }
    );
  }
}
