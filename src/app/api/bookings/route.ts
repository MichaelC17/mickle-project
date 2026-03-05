import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { upgradeYouTubeThumbnail } from "@/lib/utils"

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
    const bookings = await prisma.booking.findMany({
      where: { buyerId: session.user.id },
      include: {
        host: {
          select: {
            id: true,
            channelName: true,
            channelHandle: true,
            channelThumbnail: true,
            platform: true,
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
        hostId: booking.host.id,
        hostName: booking.host.channelName,
        hostHandle: booking.host.channelHandle,
        hostAvatar: upgradeYouTubeThumbnail(booking.host.channelThumbnail),
        platform: booking.host.platform,
        package: booking.package.name,
        price: booking.amount,
        status: booking.status.toLowerCase(),
        date: booking.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
