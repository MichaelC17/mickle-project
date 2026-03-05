import { prisma } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  bookingId?: string
}

export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, message, link, bookingId } = params

  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
      bookingId,
    },
  })

  await sendEmailNotification(userId, title, message, link)

  return notification
}

async function sendEmailNotification(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })

    if (!user?.email) return

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const fullLink = link ? `${baseUrl}${link}` : baseUrl

    const response = await fetch(`${baseUrl}/api/email/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: user.email,
        subject: title,
        html: generateEmailHtml(user.name || "there", title, message, fullLink),
      }),
    })

    if (response.ok) {
      await prisma.notification.updateMany({
        where: {
          userId,
          emailSent: false,
        },
        data: { emailSent: true },
      })
    }
  } catch (error) {
    console.error("Failed to send email notification:", error)
  }
}

function generateEmailHtml(
  userName: string,
  title: string,
  message: string,
  link: string
) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Collab</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px; color: #374151; font-size: 16px;">Hey ${userName},</p>
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px; font-weight: 600;">${title}</h2>
        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">${message}</p>
        <a href="${link}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">View Details</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Collab. All rights reserved.<br>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #7c3aed; text-decoration: none;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export async function notifyNewMessage(
  bookingId: string,
  senderId: string,
  senderName: string
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      host: { include: { user: true } },
      buyer: true,
    },
  })

  if (!booking) return

  const recipientId =
    senderId === booking.buyerId ? booking.host.userId : booking.buyerId

  await createNotification({
    userId: recipientId,
    type: "NEW_MESSAGE",
    title: "New Message",
    message: `${senderName} sent you a message`,
    link: `/dashboard?booking=${bookingId}`,
    bookingId,
  })
}

export async function notifyScheduleProposal(
  bookingId: string,
  proposerId: string,
  proposerName: string,
  proposedDate: Date,
  purpose?: string
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      host: { include: { user: true } },
      buyer: true,
    },
  })

  if (!booking) return

  const recipientId =
    proposerId === booking.buyerId ? booking.host.userId : booking.buyerId

  const dateStr = proposedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  await createNotification({
    userId: recipientId,
    type: "SCHEDULE_PROPOSAL",
    title: "New Time Request",
    message: `${proposerName} proposed ${dateStr}${purpose ? ` for ${purpose}` : ""}`,
    link: `/dashboard?booking=${bookingId}`,
    bookingId,
  })
}

export async function notifyScheduleResponse(
  bookingId: string,
  responderId: string,
  responderName: string,
  accepted: boolean,
  date: Date
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      host: { include: { user: true } },
      buyer: true,
    },
  })

  if (!booking) return

  const recipientId =
    responderId === booking.buyerId ? booking.host.userId : booking.buyerId

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  await createNotification({
    userId: recipientId,
    type: accepted ? "SCHEDULE_ACCEPTED" : "SCHEDULE_DECLINED",
    title: accepted ? "Time Confirmed!" : "Time Declined",
    message: accepted
      ? `${responderName} accepted your proposed time: ${dateStr}`
      : `${responderName} declined the proposed time. Please suggest another time.`,
    link: `/dashboard?booking=${bookingId}`,
    bookingId,
  })
}

export async function notifyBookingConfirmed(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      host: { include: { user: true } },
      buyer: true,
      package: true,
    },
  })

  if (!booking) return

  await createNotification({
    userId: booking.host.userId,
    type: "BOOKING_CONFIRMED",
    title: "New Booking!",
    message: `${booking.buyer.name || "Someone"} booked your ${booking.package.name} package`,
    link: `/dashboard/host?booking=${bookingId}`,
    bookingId,
  })

  await createNotification({
    userId: booking.buyerId,
    type: "BOOKING_CONFIRMED",
    title: "Booking Confirmed",
    message: `Your booking for ${booking.package.name} has been confirmed!`,
    link: `/dashboard?booking=${bookingId}`,
    bookingId,
  })
}

export async function notifyBookingStarted(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      host: { include: { user: true } },
      buyer: true,
    },
  })

  if (!booking) return

  await createNotification({
    userId: booking.buyerId,
    type: "BOOKING_STARTED",
    title: "Booking Started",
    message: `Your booking has been accepted! You can now message and schedule.`,
    link: `/dashboard?booking=${bookingId}`,
    bookingId,
  })
}
