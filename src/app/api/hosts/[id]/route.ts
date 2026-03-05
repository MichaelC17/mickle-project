import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { upgradeYouTubeThumbnail } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const host = await prisma.host.findUnique({
      where: { id: params.id },
      include: {
        packages: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!host) {
      return NextResponse.json(
        { error: "Host not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      host: {
        ...host,
        channelThumbnail: upgradeYouTubeThumbnail(host.channelThumbnail),
      },
    })
  } catch (error) {
    console.error("Error fetching host:", error)
    return NextResponse.json(
      { error: "Failed to fetch host" },
      { status: 500 }
    )
  }
}
