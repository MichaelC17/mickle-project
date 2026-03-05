import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { upgradeYouTubeThumbnail } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const hosts = await prisma.host.findMany({
      where: { isActive: true },
      include: {
        packages: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const upgraded = hosts.map((host) => ({
      ...host,
      channelThumbnail: upgradeYouTubeThumbnail(host.channelThumbnail),
    }))

    return NextResponse.json({ hosts: upgraded })
  } catch (error) {
    console.error("Error fetching hosts:", error)
    return NextResponse.json(
      { error: "Failed to fetch hosts" },
      { status: 500 }
    )
  }
}
