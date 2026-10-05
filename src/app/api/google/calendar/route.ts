import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isGoogleCalendarConnected } from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ connected: await isGoogleCalendarConnected(session.user.id) })
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // Google token revocation can revoke the client's other grants too. Remove only
    // the saved Calendar credentials so YouTube and sign-in remain connected.
    await prisma.account.deleteMany({
      where: { userId: session.user.id, provider: "google-calendar" },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Could not disconnect Calendar. Please try again." }, { status: 500 })
  }
}
