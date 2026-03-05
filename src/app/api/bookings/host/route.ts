import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notifyBookingStarted } from "@/lib/notifications"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in" },
      { status: 401 }
    )
  }

  try {
    const host = await prisma.host.findUnique({
      where: { userId: session.user.id },
    })

    if (!host) {
      return NextResponse.json(
        { error: "You are not a host" },
        { status: 403 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: { hostId: host.id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        package: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      bookings: bookings.map(booking => ({
        id: booking.id,
        buyerId: booking.buyer.id,
        buyerName: booking.buyer.name || "Anonymous",
        buyerEmail: booking.buyer.email,
        buyerAvatar: booking.buyer.image,
        package: booking.package.name,
        amount: booking.amount,
        platformFee: booking.platformFee,
        earnings: booking.amount - booking.platformFee,
        status: booking.status.toLowerCase(),
        notes: booking.notes,
        date: booking.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching host bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in" },
      { status: 401 }
    )
  }

  try {
    const host = await prisma.host.findUnique({
      where: { userId: session.user.id },
    })

    if (!host) {
      return NextResponse.json(
        { error: "You are not a host" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { bookingId, status } = body

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking || booking.hostId !== host.id) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    const validStatuses = ["CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    if (status === "IN_PROGRESS") {
      await notifyBookingStarted(bookingId)
    }

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}
