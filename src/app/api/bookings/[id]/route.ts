import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { upgradeYouTubeThumbnail } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        host: {
          select: {
            id: true,
            userId: true,
            channelName: true,
            channelThumbnail: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        package: {
          select: {
            name: true,
            description: true,
            includes: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const isParticipant = booking.buyerId === session.user.id || booking.host.userId === session.user.id
    if (!isParticipant) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const isHost = booking.host.userId === session.user.id

    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status.toLowerCase(),
        amount: booking.amount,
        platformFee: booking.platformFee,
        scheduledDate: booking.scheduledDate,
        createdAt: booking.createdAt,
        package: booking.package,
        buyer: booking.buyer,
        host: {
          id: booking.host.id,
          channelName: booking.host.channelName,
          channelThumbnail: upgradeYouTubeThumbnail(booking.host.channelThumbnail),
          user: booking.host.user,
        },
        isHost,
      },
    })
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}
