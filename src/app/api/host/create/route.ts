import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { upgradeYouTubeThumbnail } from "@/lib/utils"

export const dynamic = "force-dynamic"

const MIN_SUBSCRIBERS = 10000

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { 
      channelId, 
      channelName, 
      channelHandle,
      channelUrl, 
      channelThumbnail,
      subscriberCount, 
      niche, 
      bio,
      packages 
    } = body

    if (!channelName) {
      return NextResponse.json(
        { error: "Channel name is required" },
        { status: 400 }
      )
    }

    if (!subscriberCount || subscriberCount < MIN_SUBSCRIBERS) {
      return NextResponse.json(
        { error: `You need at least ${MIN_SUBSCRIBERS.toLocaleString()} subscribers to become a host` },
        { status: 400 }
      )
    }

    if (!packages || packages.length === 0) {
      return NextResponse.json(
        { error: "At least one package is required" },
        { status: 400 }
      )
    }

    const existingHost = await prisma.host.findUnique({
      where: { userId: session.user.id },
    })

    if (existingHost) {
      return NextResponse.json(
        { error: "You already have a host profile" },
        { status: 400 }
      )
    }

    const host = await prisma.host.create({
      data: {
        userId: session.user.id,
        youtubeChannelId: channelId,
        channelName,
        channelHandle,
        channelUrl,
        channelThumbnail,
        subscriberCount: subscriberCount || 0,
        platform: "youtube",
        niche,
        bio,
        packages: {
          create: packages.map((pkg: { name: string; price: number; description?: string; includes: string[] }) => ({
            name: pkg.name,
            price: pkg.price,
            description: pkg.description || "",
            includes: pkg.includes || [],
          })),
        },
      },
      include: {
        packages: true,
      },
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "HOST" },
    })

    return NextResponse.json({
      success: true,
      host: {
        id: host.id,
        channelName: host.channelName,
        packages: host.packages,
      },
    })
  } catch (error) {
    console.error("Error creating host profile:", error)
    return NextResponse.json(
      { error: "Failed to create host profile" },
      { status: 500 }
    )
  }
}

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
      include: { packages: true },
    })

    return NextResponse.json({
      host: host
        ? { ...host, channelThumbnail: upgradeYouTubeThumbnail(host.channelThumbnail) }
        : null,
    })
  } catch (error) {
    console.error("Error fetching host profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch host profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in" },
      { status: 401 }
    )
  }

  try {
    const existingHost = await prisma.host.findUnique({
      where: { userId: session.user.id },
    })

    if (!existingHost) {
      return NextResponse.json(
        { error: "You don't have a host profile" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { niche, bio, packages } = body

    await prisma.package.deleteMany({
      where: { hostId: existingHost.id },
    })

    const host = await prisma.host.update({
      where: { userId: session.user.id },
      data: {
        niche,
        bio,
        packages: {
          create: packages.map((pkg: { name: string; price: number; description?: string; includes: string[] }) => ({
            name: pkg.name,
            price: pkg.price,
            description: pkg.description || "",
            includes: pkg.includes || [],
          })),
        },
      },
      include: { packages: true },
    })

    return NextResponse.json({
      success: true,
      host,
    })
  } catch (error) {
    console.error("Error updating host profile:", error)
    return NextResponse.json(
      { error: "Failed to update host profile" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in" },
      { status: 401 }
    )
  }

  try {
    const existingHost = await prisma.host.findUnique({
      where: { userId: session.user.id },
    })

    if (!existingHost) {
      return NextResponse.json(
        { error: "You don't have a host profile" },
        { status: 404 }
      )
    }

    await prisma.host.delete({
      where: { userId: session.user.id },
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "CREATOR" },
    })

    return NextResponse.json({
      success: true,
      message: "Host profile deleted",
    })
  } catch (error) {
    console.error("Error deleting host profile:", error)
    return NextResponse.json(
      { error: "Failed to delete host profile" },
      { status: 500 }
    )
  }
}
