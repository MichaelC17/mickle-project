import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { notifyRefundResponse } from "@/lib/notifications"

export const dynamic = "force-dynamic"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
})

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
    const { action, responseNote } = body

    if (!["approve", "deny"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const refundRequest = await prisma.refundRequest.findUnique({
      where: { id: params.id },
      include: {
        booking: {
          include: {
            host: true,
          },
        },
      },
    })

    if (!refundRequest) {
      return NextResponse.json(
        { error: "Refund request not found" },
        { status: 404 }
      )
    }

    if (refundRequest.booking.host.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the host can respond to this refund request" },
        { status: 403 }
      )
    }

    if (refundRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "This refund request has already been processed" },
        { status: 400 }
      )
    }

    if (action === "approve") {
      let stripeRefundId: string | null = null

      if (refundRequest.booking.stripePaymentId) {
        try {
          const refund = await stripe.refunds.create({
            payment_intent: refundRequest.booking.stripePaymentId,
            amount: refundRequest.refundAmount,
          })
          stripeRefundId = refund.id
        } catch (stripeError) {
          console.error("Stripe refund error:", stripeError)
          return NextResponse.json(
            { error: "Failed to process refund with Stripe" },
            { status: 500 }
          )
        }
      }

      await prisma.$transaction([
        prisma.refundRequest.update({
          where: { id: params.id },
          data: {
            status: "PROCESSED",
            respondedById: session.user.id,
            responseNote,
            stripeRefundId,
          },
        }),
        prisma.booking.update({
          where: { id: refundRequest.bookingId },
          data: { status: "REFUNDED" },
        }),
      ])

      notifyRefundResponse(refundRequest.bookingId, true)

      return NextResponse.json({
        success: true,
        message: "Refund approved and processed",
        stripeRefundId,
      })
    } else {
      await prisma.refundRequest.update({
        where: { id: params.id },
        data: {
          status: "DENIED",
          respondedById: session.user.id,
          responseNote,
        },
      })

      notifyRefundResponse(refundRequest.bookingId, false, responseNote)

      return NextResponse.json({
        success: true,
        message: "Refund request denied",
      })
    }
  } catch (error) {
    console.error("Error processing refund:", error)
    return NextResponse.json(
      { error: "Failed to process refund request" },
      { status: 500 }
    )
  }
}
