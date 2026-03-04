import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

    const proposals = await prisma.scheduleProposal.findMany({
      where: { bookingId: params.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ 
      proposals,
      scheduledDate: booking.scheduledDate,
    })
  } catch (error) {
    console.error("Error fetching schedule:", error)
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
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
        { error: "Scheduling is only available for active bookings" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { proposedDate, purpose } = body

    if (!proposedDate) {
      return NextResponse.json({ error: "Proposed date required" }, { status: 400 })
    }

    const proposal = await prisma.scheduleProposal.create({
      data: {
        bookingId: params.id,
        proposedById: session.user.id,
        proposedDate: new Date(proposedDate),
        purpose: purpose || null,
      },
    })

    return NextResponse.json({ proposal })
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { proposalId, action } = body

    if (!proposalId || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const proposal = await prisma.scheduleProposal.findUnique({
      where: { id: proposalId },
      include: {
        booking: {
          include: {
            host: { select: { userId: true } },
          },
        },
      },
    })

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    const booking = proposal.booking
    const isParticipant = booking.buyerId === session.user.id || booking.host.userId === session.user.id
    if (!isParticipant) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    if (proposal.proposedById === session.user.id) {
      return NextResponse.json(
        { error: "You cannot respond to your own proposal" },
        { status: 400 }
      )
    }

    const newStatus = action === "accept" ? "ACCEPTED" : "DECLINED"

    const updatedProposal = await prisma.scheduleProposal.update({
      where: { id: proposalId },
      data: { status: newStatus },
    })

    if (action === "accept") {
      await prisma.booking.update({
        where: { id: params.id },
        data: { scheduledDate: proposal.proposedDate },
      })

      await prisma.scheduleProposal.updateMany({
        where: {
          bookingId: params.id,
          id: { not: proposalId },
          status: "PENDING",
        },
        data: { status: "DECLINED" },
      })
    }

    return NextResponse.json({ proposal: updatedProposal })
  } catch (error) {
    console.error("Error updating proposal:", error)
    return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 })
  }
}
