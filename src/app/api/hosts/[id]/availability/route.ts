import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getGoogleCalendarBusyTimes } from "@/lib/google-calendar"
import { getZonedDay, zonedDateTimeToUtc } from "@/lib/availability"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const packageId = new URL(request.url).searchParams.get("packageId")
  if (!packageId) return NextResponse.json({ error: "Package is required" }, { status: 400 })

  const host = await prisma.host.findUnique({
    where: { id, isActive: true },
    include: {
      availability: { where: { enabled: true } },
      packages: { where: { id: packageId } },
    },
  })
  const offer = host?.packages[0]
  if (!host || !offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 })

  const now = new Date()
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const [busy, bookings] = await Promise.all([
    getGoogleCalendarBusyTimes(host.userId, now, end),
    prisma.booking.findMany({
      where: {
        hostId: host.id,
        scheduledDate: { gte: now, lte: end },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      select: { scheduledDate: true, package: { select: { durationMinutes: true, bufferMinutes: true } } },
    }),
  ])

  const blocked = [
    ...busy.map((item) => ({ start: new Date(item.start).getTime(), end: new Date(item.end).getTime() })),
    ...bookings.flatMap((booking) => booking.scheduledDate ? [{
      start: booking.scheduledDate.getTime() - booking.package.bufferMinutes * 60_000,
      end: booking.scheduledDate.getTime() + (booking.package.durationMinutes + booking.package.bufferMinutes) * 60_000,
    }] : []),
  ]

  const slots: string[] = []
  for (let offset = 0; offset < 30; offset += 1) {
    const cursor = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000)
    const local = getZonedDay(cursor, host.timezone)
    const windows = host.availability.filter((item) => item.dayOfWeek === local.dayOfWeek)
    for (const window of windows) {
      for (let minutes = window.startMinutes; minutes + offer.durationMinutes <= window.endMinutes; minutes += 30) {
        const start = zonedDateTimeToUtc(local.year, local.month, local.day, Math.floor(minutes / 60), minutes % 60, host.timezone)
        const finish = start.getTime() + offer.durationMinutes * 60_000
        if (start.getTime() < now.getTime() + offer.leadTimeHours * 60_000) continue
        if (blocked.some((item) => start.getTime() < item.end && finish > item.start)) continue
        slots.push(start.toISOString())
      }
    }
  }

  return NextResponse.json({
    slots: slots.slice(0, 120),
    timezone: host.timezone,
    durationMinutes: offer.durationMinutes,
    bookingMode: offer.bookingMode.toLowerCase(),
  })
}
