import { prisma } from "@/lib/prisma"

async function getCalendarAccessToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google-calendar" },
  })

  if (!account) return null
  const now = Math.floor(Date.now() / 1000)
  if (account.access_token && (!account.expires_at || account.expires_at > now + 60)) {
    return account.access_token
  }
  if (!account.refresh_token || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return null
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: account.refresh_token,
      grant_type: "refresh_token",
    }),
  })
  if (!response.ok) return null
  const tokens = await response.json()

  await prisma.account.update({
    where: {
      provider_providerAccountId: {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      },
    },
    data: {
      access_token: tokens.access_token,
      expires_at: Math.floor(Date.now() / 1000) + (tokens.expires_in || 3600),
    },
  })
  return tokens.access_token as string
}

export async function getGoogleCalendarBusyTimes(userId: string, timeMin: Date, timeMax: Date) {
  const accessToken = await getCalendarAccessToken(userId)
  if (!accessToken) return []

  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: "primary" }],
    }),
    cache: "no-store",
  })
  if (!response.ok) return []
  const data = await response.json()
  return (data.calendars?.primary?.busy || []) as Array<{ start: string; end: string }>
}

export async function isGoogleCalendarConnected(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google-calendar" },
    select: { providerAccountId: true },
  })
  return Boolean(account)
}
