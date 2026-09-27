import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { upgradeYouTubeThumbnail } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.creatorProfile.findUnique({ where: { userId: session.user.id } })
  return NextResponse.json({
    profile: profile
      ? { ...profile, channelThumbnail: upgradeYouTubeThumbnail(profile.channelThumbnail) }
      : null,
  })
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const required = ["channelName", "niche", "about", "audience", "contentStyle", "exampleVideoUrl"]
  const missing = required.find((field) => !String(body[field] || "").trim())
  if (missing) return NextResponse.json({ error: "Please complete every required field" }, { status: 400 })

  try {
    const parsedExampleUrl = new URL(body.exampleVideoUrl)
    if (!["youtube.com", "www.youtube.com", "youtu.be"].includes(parsedExampleUrl.hostname)) {
      return NextResponse.json({ error: "Example video must be a YouTube URL" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "Enter a valid example video URL" }, { status: 400 })
  }

  const profile = await prisma.creatorProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      youtubeChannelId: body.youtubeChannelId || null,
      channelName: body.channelName.trim(),
      channelHandle: body.channelHandle || null,
      channelUrl: body.channelUrl || null,
      channelThumbnail: body.channelThumbnail || null,
      subscriberCount: Number(body.subscriberCount) || 0,
      niche: body.niche.trim(),
      about: body.about.trim(),
      audience: body.audience.trim(),
      contentStyle: body.contentStyle.trim(),
      exampleVideoUrl: body.exampleVideoUrl.trim(),
      timezone: body.timezone || "America/Chicago",
      isComplete: true,
    },
    update: {
      youtubeChannelId: body.youtubeChannelId || null,
      channelName: body.channelName.trim(),
      channelHandle: body.channelHandle || null,
      channelUrl: body.channelUrl || null,
      channelThumbnail: body.channelThumbnail || null,
      subscriberCount: Number(body.subscriberCount) || 0,
      niche: body.niche.trim(),
      about: body.about.trim(),
      audience: body.audience.trim(),
      contentStyle: body.contentStyle.trim(),
      exampleVideoUrl: body.exampleVideoUrl.trim(),
      timezone: body.timezone || "America/Chicago",
      isComplete: true,
    },
  })
  return NextResponse.json({ profile })
}
