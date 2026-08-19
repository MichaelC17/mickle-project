import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const hosts = await prisma.host.findMany({
      where: {
        isActive: true,
        youtubeChannelId: { not: null },
      },
      include: {
        user: {
          include: {
            accounts: {
              where: { provider: "google-youtube" },
            },
          },
        },
      },
    })

    let checked = 0
    let deactivated = 0
    let errors = 0
    const now = new Date()
    const sixMonthsAgo = new Date(now.getTime() - SIX_MONTHS_MS)

    for (const host of hosts) {
      try {
        const account = host.user.accounts[0]
        if (!account?.access_token) {
          continue
        }

        const videosRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${host.youtubeChannelId}&order=date&maxResults=1&type=video`,
          {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          }
        )

        if (!videosRes.ok) {
          errors++
          continue
        }

        const videosData = await videosRes.json()
        const latestVideo = videosData.items?.[0]

        let lastVideoDate: Date | null = null
        if (latestVideo?.snippet?.publishedAt) {
          lastVideoDate = new Date(latestVideo.snippet.publishedAt)
        }

        await prisma.host.update({
          where: { id: host.id },
          data: {
            lastVideoCheck: now,
            lastVideoDate,
          },
        })

        if (!lastVideoDate || lastVideoDate < sixMonthsAgo) {
          await prisma.host.update({
            where: { id: host.id },
            data: { isActive: false },
          })
          deactivated++
          console.log(`Deactivated host ${host.channelName} - no videos in 6 months`)
        }

        checked++
      } catch (error) {
        console.error(`Error checking host ${host.id}:`, error)
        errors++
      }
    }

    return NextResponse.json({
      success: true,
      totalHosts: hosts.length,
      checked,
      deactivated,
      errors,
    })
  } catch (error) {
    console.error("Error in inactive hosts cron:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
