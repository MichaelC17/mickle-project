import { NextResponse } from "next/server"
import { Resend } from "resend"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      console.log("Email notification skipped - RESEND_API_KEY not configured")
      return NextResponse.json({ success: true, skipped: true })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Collab <notifications@collab.com>",
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
