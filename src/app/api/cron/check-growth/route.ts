import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()

    const trackingRecords = await prisma.growthTracking.findMany({
      where: {
        status: "TRACKING",
        trackingEndDate: { lte: now },
      },
      include: {
        booking: {
          include: {
            buyer: {
              include: {
                accounts: {
                  where: { provider: "google-youtube" },
                },
              },
            },
          },
        },
      },
    })

    let processed = 0
    let failed = 0

    for (const record of trackingRecords) {
      try {
        const account = record.booking.buyer.accounts[0]
        if (!account?.access_token) {
          await prisma.growthTracking.update({
            where: { id: record.id },
            data: { status: "FAILED" },
          })
          failed++
          continue
        }

        const channelRes = await fetch(
          "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
          {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          }
        )

        if (!channelRes.ok) {
          await prisma.growthTracking.update({
            where: { id: record.id },
            data: { status: "FAILED" },
          })
          failed++
          continue
        }

        const channelData = await channelRes.json()
        const stats = channelData.items?.[0]?.statistics

        if (!stats) {
          await prisma.growthTracking.update({
            where: { id: record.id },
            data: { status: "FAILED" },
          })
          failed++
          continue
        }

        const finalSubCount = parseInt(stats.subscriberCount) || 0
        const finalViewCount = parseInt(stats.viewCount) || 0

        const subGrowth = finalSubCount - record.baselineSubCount
        const viewGrowth = finalViewCount - record.baselineViewCount

        const subGrowthPercent =
          record.baselineSubCount > 0
            ? ((subGrowth / record.baselineSubCount) * 100)
            : 0

        const viewGrowthPercent =
          record.baselineViewCount > 0
            ? ((viewGrowth / record.baselineViewCount) * 100)
            : 0

        await prisma.growthTracking.update({
          where: { id: record.id },
          data: {
            status: "COMPLETED",
            finalSubCount,
            finalViewCount,
            subGrowth,
            viewGrowth,
            subGrowthPercent,
            viewGrowthPercent,
          },
        })

        processed++
      } catch (error) {
        console.error(`Failed to process growth tracking ${record.id}:`, error)
        failed++
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      failed,
      total: trackingRecords.length,
    })
  } catch (error) {
    console.error("Error in growth tracking cron:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
