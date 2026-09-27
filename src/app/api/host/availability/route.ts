import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isGoogleCalendarConnected } from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const host = await prisma.host.findUnique({
    where: { userId: session.user.id },
    include: { availability: { orderBy: [{ dayOfWeek: "asc" }, { startMinutes: "asc" }] } },
  })
  if (!host) return NextResponse.json({ error: "Host profile not found" }, { status: 404 })
  return NextResponse.json({
    timezone: host.timezone,
    availability: host.availability,
    calendarConnected: await isGoogleCalendarConnected(session.user.id),
  })
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const host = await prisma.host.findUnique({ where: { userId: session.user.id } })
  if (!host) return NextResponse.json({ error: "Host profile not found" }, { status: 404 })

  const body = await request.json()
  const availability = Array.isArray(body.availability) ? body.availability : []
  const valid = availability.every((slot: { dayOfWeek: number; startMinutes: number; endMinutes: number }) =>
    Number.isInteger(slot.dayOfWeek) && slot.dayOfWeek >= 0 && slot.dayOfWeek <= 6 &&
    Number.isInteger(slot.startMinutes) && Number.isInteger(slot.endMinutes) &&
    slot.startMinutes >= 0 && slot.endMinutes <= 1440 && slot.startMinutes < slot.endMinutes
  )
  if (!valid) return NextResponse.json({ error: "Invalid availability" }, { status: 400 })

  await prisma.$transaction([
    prisma.host.update({ where: { id: host.id }, data: { timezone: body.timezone || host.timezone } }),
    prisma.hostAvailability.deleteMany({ where: { hostId: host.id } }),
    prisma.hostAvailability.createMany({
      data: availability.map((slot: { dayOfWeek: number; startMinutes: number; endMinutes: number }) => ({
        hostId: host.id,
        dayOfWeek: slot.dayOfWeek,
        startMinutes: slot.startMinutes,
        endMinutes: slot.endMinutes,
      })),
    }),
  ])
  return NextResponse.json({ success: true })
}
