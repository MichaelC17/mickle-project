import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { rating, comment } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        host: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const isBuyer = booking.buyerId === session.user.id
    const isHost = booking.host.userId === session.user.id

    if (!isBuyer && !isHost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Can only review completed bookings" },
        { status: 400 }
      )
    }

    const reviewerType = isBuyer ? "BUYER" : "HOST"

    const existingReview = await prisma.review.findUnique({
      where: {
        bookingId_reviewerType: {
          bookingId: id,
          reviewerType,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this booking" },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        bookingId: id,
        hostId: booking.hostId,
        reviewerId: session.user.id,
        reviewerType,
        rating,
        comment: comment || null,
      },
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        host: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const isBuyer = booking.buyerId === session.user.id
    const isHost = booking.host.userId === session.user.id

    if (!isBuyer && !isHost) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const reviews = await prisma.review.findMany({
      where: { bookingId: id },
    })

    const myReviewType = isBuyer ? "BUYER" : "HOST"
    const myReview = reviews.find((r) => r.reviewerType === myReviewType)
    const otherReview = reviews.find((r) => r.reviewerType !== myReviewType)

    return NextResponse.json({
      myReview,
      otherReview,
      canReview: booking.status === "COMPLETED" && !myReview,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}
