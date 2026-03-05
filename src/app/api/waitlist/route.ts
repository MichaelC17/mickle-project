import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, interest } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      )
    }

    const existing = await prisma.waitlistEntry.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({ success: true, message: "Already on the list" })
    }

    await prisma.waitlistEntry.create({
      data: {
        email: email.toLowerCase(),
        interest: interest || "buyer",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Waitlist error:", error)
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    )
  }
}
