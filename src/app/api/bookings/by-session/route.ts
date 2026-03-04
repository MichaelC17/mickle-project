import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    )
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        host: {
          select: {
            channelName: true,
            channelThumbnail: true,
          },
        },
        package: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        hostName: booking.host.channelName,
        hostThumbnail: booking.host.channelThumbnail,
        packageName: booking.package.name,
        amount: booking.amount,
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    )
  }
}
