import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notifyRefundRequested } from "@/lib/notifications"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const role = searchParams.get("role")

  try {
    if (role === "host") {
      const host = await prisma.host.findUnique({
        where: { userId: session.user.id },
      })

      if (!host) {
        return NextResponse.json({ error: "Not a host" }, { status: 403 })
      }

      const refundRequests = await prisma.refundRequest.findMany({
        where: {
          booking: {
            hostId: host.id,
          },
        },
        include: {
          booking: {
            include: {
              buyer: {
                select: { id: true, name: true, email: true, image: true },
              },
              package: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json({ refundRequests })
    } else {
      const refundRequests = await prisma.refundRequest.findMany({
        where: { requestedById: session.user.id },
        include: {
          booking: {
            include: {
              host: {
                select: { channelName: true, channelThumbnail: true },
              },
              package: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json({ refundRequests })
    }
  } catch (error) {
    console.error("Error fetching refund requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch refund requests" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { bookingId, reason } = body

    if (!bookingId || !reason) {
      return NextResponse.json(
        { error: "Booking ID and reason are required" },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        refundRequest: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.buyerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only request refunds for your own bookings" },
        { status: 403 }
      )
    }

    if (booking.refundRequest) {
      return NextResponse.json(
        { error: "A refund request already exists for this booking" },
        { status: 400 }
      )
    }

    if (booking.status === "REFUNDED" || booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "This booking has already been refunded or cancelled" },
        { status: 400 }
      )
    }

    const refundRequest = await prisma.refundRequest.create({
      data: {
        bookingId,
        requestedById: session.user.id,
        reason,
        refundAmount: booking.amount,
      },
    })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    })

    notifyRefundRequested(bookingId, user?.name || "A buyer", reason)

    return NextResponse.json({ refundRequest })
  } catch (error) {
    console.error("Error creating refund request:", error)
    return NextResponse.json(
      { error: "Failed to create refund request" },
      { status: 500 }
    )
  }
}
