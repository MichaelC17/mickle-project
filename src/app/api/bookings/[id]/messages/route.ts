import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notifyNewMessage } from "@/lib/notifications"

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
        host: { select: { userId: true } },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const isParticipant = booking.buyerId === session.user.id || booking.host.userId === session.user.id
    if (!isParticipant) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: { bookingId: params.id },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(
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
        host: { select: { userId: true } },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const isParticipant = booking.buyerId === session.user.id || booking.host.userId === session.user.id
    if (!isParticipant) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    if (booking.status !== "IN_PROGRESS" && booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Messaging is only available for active bookings" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        bookingId: params.id,
        senderId: session.user.id,
        content: content.trim(),
      },
    })

    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    })

    notifyNewMessage(params.id, session.user.id, sender?.name || "Someone")

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
