import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/stripe"

interface ReleasableBooking {
  id: string
  amount: number
  platformFee: number
  stripePaymentId: string | null
  stripeTransferId: string | null
  host: {
    stripeAccountId: string | null
    stripePayoutsEnabled: boolean
  }
}

export async function releaseHostPayout(booking: ReleasableBooking) {
  if (booking.stripeTransferId) return booking.stripeTransferId
  if (!booking.stripePaymentId) throw new Error("Booking has no Stripe payment")
  if (!booking.host.stripeAccountId || !booking.host.stripePayoutsEnabled) {
    throw new Error("Host payout account is not ready")
  }

  const paymentIntent = await getStripe().paymentIntents.retrieve(
    booking.stripePaymentId,
    { expand: ["latest_charge"] }
  )
  const charge = paymentIntent.latest_charge
  const chargeId = typeof charge === "string" ? charge : charge?.id
  if (!chargeId) throw new Error("Stripe charge is not available")

  const hostAmount = Math.max(booking.amount - booking.platformFee, 0) * 100
  if (hostAmount < 1) throw new Error("Host payout amount is invalid")

  const transfer = await getStripe().transfers.create(
    {
      amount: hostAmount,
      currency: "usd",
      destination: booking.host.stripeAccountId,
      source_transaction: chargeId,
      metadata: { bookingId: booking.id },
    },
    { idempotencyKey: `booking-${booking.id}-host-payout` }
  )

  await prisma.booking.updateMany({
    where: { id: booking.id, stripeTransferId: null },
    data: { stripeTransferId: transfer.id },
  })

  return transfer.id
}

export async function refundBookingPayment({
  bookingId,
  paymentIntentId,
  transferId,
  amount,
}: {
  bookingId: string
  paymentIntentId: string
  transferId: string | null
  amount: number
}) {
  const stripe = getStripe()
  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
    amount: amount * 100,
    metadata: { bookingId },
  }

  // Older test bookings used destination charges. New bookings use a separate
  // transfer recorded on the booking and reverse that transfer explicitly.
  if (!transferId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.transfer_data?.destination) {
      refundParams.reverse_transfer = true
      refundParams.refund_application_fee = true
    }
  }

  const refund = await stripe.refunds.create(refundParams, {
    idempotencyKey: `booking-${bookingId}-refund`,
  })

  if (transferId) {
    await stripe.transfers.createReversal(
      transferId,
      { metadata: { bookingId } },
      { idempotencyKey: `booking-${bookingId}-transfer-reversal` }
    )
  }

  return refund
}
