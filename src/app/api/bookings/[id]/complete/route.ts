import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        host: true,
        buyer: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const isHost = booking.host.userId === session.user.id
    const isBuyer = booking.buyerId === session.user.id

    if (!isHost && !isBuyer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (booking.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Booking must be in progress to confirm completion" },
        { status: 400 }
      )
    }

    const updateData: Record<string, boolean | Date | string> = {}

    if (isHost && !booking.hostConfirmedComplete) {
      updateData.hostConfirmedComplete = true
    } else if (isBuyer && !booking.buyerConfirmedComplete) {
      updateData.buyerConfirmedComplete = true
    } else {
      return NextResponse.json(
        { error: "Already confirmed completion" },
        { status: 400 }
      )
    }

    const newHostConfirmed = isHost ? true : booking.hostConfirmedComplete
    const newBuyerConfirmed = isBuyer ? true : booking.buyerConfirmedComplete

    if (newHostConfirmed && newBuyerConfirmed) {
      updateData.status = "COMPLETED"
      updateData.completedAt = new Date()
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        host: true,
        buyer: true,
      },
    })

    if (updatedBooking.status === "COMPLETED") {
      await initializeGrowthTracking(updatedBooking)
    }

    return NextResponse.json({
      booking: updatedBooking,
      bothConfirmed: updatedBooking.status === "COMPLETED",
    })
  } catch (error) {
    console.error("Error confirming completion:", error)
    return NextResponse.json(
      { error: "Failed to confirm completion" },
      { status: 500 }
    )
  }
}

async function initializeGrowthTracking(booking: {
  id: string
  buyerId: string
}) {
  try {
    const buyer = await prisma.user.findUnique({
      where: { id: booking.buyerId },
      include: {
        accounts: {
          where: { provider: "google-youtube" },
        },
      },
    })

    if (!buyer?.accounts[0]) {
      console.log("No YouTube account found for buyer, skipping growth tracking")
      return
    }

    const now = new Date()
    const trackingEndDate = new Date(now)
    trackingEndDate.setDate(trackingEndDate.getDate() + 90)

    await prisma.growthTracking.create({
      data: {
        bookingId: booking.id,
        buyerChannelId: buyer.accounts[0].providerAccountId,
        baselineSubCount: 0,
        baselineViewCount: 0,
        baselineDate: now,
        trackingStartDate: now,
        trackingEndDate,
        status: "TRACKING",
      },
    })
  } catch (error) {
    console.error("Error initializing growth tracking:", error)
  }
}
