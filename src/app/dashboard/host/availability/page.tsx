"use client"

import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useToast } from "@/context/ToastContext"
import { ArrowLeft, Calendar, Check, ExternalLink } from "lucide-react"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
type DayAvailability = { enabled: boolean; start: string; end: string }

function toTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
}
function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export default function HostAvailabilityPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const [days, setDays] = useState<DayAvailability[]>(DAYS.map((_, day) => ({ enabled: day > 0 && day < 6, start: "18:00", end: "21:00" })))
  const [timezone, setTimezone] = useState("America/Chicago")
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [calendarLoading, setCalendarLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/host/availability")
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch("/api/google/calendar").then(async (response) => {
      if (!response.ok) throw new Error("Could not load Calendar connection")
      const data = await response.json()
      setCalendarConnected(data.connected)
    }).catch(() => {
      showToast({ type: "error", title: "Calendar connection unavailable", message: "Refresh the page to try again." })
    }).finally(() => setCalendarLoading(false))
  }, [session, showToast])

  useEffect(() => {
    if (!session) return
    fetch("/api/host/availability").then(async (response) => {
      if (!response.ok) return
      const data = await response.json()
      setTimezone(data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
      if (data.availability.length) {
        setDays(DAYS.map((_, day) => {
          const slot = data.availability.find((item: { dayOfWeek: number }) => item.dayOfWeek === day)
          return slot ? { enabled: true, start: toTime(slot.startMinutes), end: toTime(slot.endMinutes) } : { enabled: false, start: "18:00", end: "21:00" }
        }))
      }
    }).finally(() => setLoading(false))
  }, [session])

  const save = async () => {
    setSaving(true)
    const availability = days.flatMap((day, dayOfWeek) => day.enabled ? [{ dayOfWeek, startMinutes: toMinutes(day.start), endMinutes: toMinutes(day.end) }] : [])
    const response = await fetch("/api/host/availability", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ timezone, availability }) })
    const data = await response.json()
    setSaving(false)
    if (!response.ok) return showToast({ type: "error", title: "Availability not saved", message: data.error })
    showToast({ type: "success", title: "Availability saved", message: "Buyers will only see open times inside these windows." })
  }

  const disconnectCalendar = async () => {
    setDisconnecting(true)
    try {
      const response = await fetch("/api/google/calendar", { method: "DELETE" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Please try again.")
      setCalendarConnected(false)
      showToast({ type: "success", title: "Calendar disconnected", message: "COMARI will no longer check Calendar conflicts. Your YouTube connection is unchanged." })
    } catch (error) {
      showToast({ type: "error", title: "Calendar not disconnected", message: error instanceof Error ? error.message : "Please try again." })
    } finally {
      setDisconnecting(false)
    }
  }

  return <><Header /><main className="min-h-screen pt-28 pb-20 px-6"><div className="max-w-3xl mx-auto"><Link href="/dashboard/host" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-6"><ArrowLeft className="w-4 h-4" />Back to host settings</Link><h1 className="text-3xl font-semibold text-text-primary mb-3">Booking availability</h1><p className="text-text-secondary mb-8">Set the times you’re open to creator features. Google Calendar can hide conflicts automatically without showing buyers your private events.</p>
  <section className="border border-border bg-surface p-6 mb-6"><div className="flex flex-col sm:flex-row items-start justify-between gap-5"><div><div className="flex items-center gap-2 mb-2"><Calendar className="w-5 h-5 text-accent" /><h2 className="font-semibold text-text-primary">Google Calendar</h2></div><p className="text-sm text-text-secondary max-w-lg">COMARI checks whether a time is busy. Event names and details are never shown to buyers.</p></div>{calendarLoading ? <span className="text-sm text-text-muted">Checking connection…</span> : calendarConnected ? <div className="shrink-0 flex flex-col items-end gap-3"><span className="inline-flex items-center gap-2 text-sm text-emerald-500"><Check className="w-4 h-4" />Connected</span><button onClick={disconnectCalendar} disabled={disconnecting} className="border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed">{disconnecting ? "Disconnecting…" : "Disconnect Calendar"}</button></div> : <button onClick={() => signIn("google-calendar", { callbackUrl: "/dashboard/host/availability" })} className="shrink-0 inline-flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium text-text-primary hover:border-accent">Connect <ExternalLink className="w-3.5 h-3.5" /></button>}</div></section>
  <section className="border border-border bg-surface p-6"><label className="block mb-6"><span className="block text-sm font-medium text-text-primary mb-2">Time zone</span><input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-background border border-border px-4 py-3 text-text-primary" /></label><div className="divide-y divide-border">{days.map((day, index) => <div key={DAYS[index]} className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] items-center gap-4 py-4"><label className="flex items-center gap-3 text-sm font-medium text-text-primary"><input type="checkbox" checked={day.enabled} onChange={(e) => setDays((current) => current.map((item, i) => i === index ? { ...item, enabled: e.target.checked } : item))} className="accent-accent" />{DAYS[index]}</label>{day.enabled ? <div className="flex items-center gap-3"><input type="time" value={day.start} onChange={(e) => setDays((current) => current.map((item, i) => i === index ? { ...item, start: e.target.value } : item))} className="bg-background border border-border px-3 py-2 text-text-primary" /><span className="text-text-muted">to</span><input type="time" value={day.end} onChange={(e) => setDays((current) => current.map((item, i) => i === index ? { ...item, end: e.target.value } : item))} className="bg-background border border-border px-3 py-2 text-text-primary" /></div> : <span className="text-sm text-text-muted">Unavailable</span>}</div>)}</div></section>
  <div className="flex justify-end mt-6"><button onClick={save} disabled={saving || loading} className="bg-accent hover:bg-accent-hover text-background font-semibold px-6 py-3 disabled:opacity-50">{saving ? "Saving…" : "Save availability"}</button></div></div></main><Footer /></>
}
