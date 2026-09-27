"use client"

import { FormEvent, useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useToast } from "@/context/ToastContext"
import { Check, Youtube } from "lucide-react"

const NICHES = ["Gaming", "Tech", "Lifestyle", "Education", "Entertainment", "Music", "Fitness & Health", "Food & Cooking", "Travel", "Business & Finance", "Other"]

type FormState = {
  youtubeChannelId: string
  channelName: string
  channelHandle: string
  channelUrl: string
  channelThumbnail: string
  subscriberCount: number
  niche: string
  about: string
  audience: string
  contentStyle: string
  exampleVideoUrl: string
  timezone: string
}

const EMPTY: FormState = {
  youtubeChannelId: "", channelName: "", channelHandle: "", channelUrl: "", channelThumbnail: "",
  subscriberCount: 0, niche: "", about: "", audience: "", contentStyle: "", exampleVideoUrl: "",
  timezone: "America/Chicago",
}

export default function CreatorProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/profile")
  }, [status, router])

  useEffect(() => {
    if (!session) return
    Promise.all([fetch("/api/creator-profile"), fetch("/api/youtube/channel")])
      .then(async ([profileRes, channelRes]) => {
        const profileData = profileRes.ok ? await profileRes.json() : { profile: null }
        if (profileData.profile) {
          setForm({ ...EMPTY, ...profileData.profile })
        } else if (channelRes.ok) {
          const channel = await channelRes.json()
          setForm((current) => ({
            ...current,
            youtubeChannelId: channel.id || "",
            channelName: channel.name || "",
            channelHandle: channel.customUrl || "",
            channelUrl: channel.id ? `https://youtube.com/channel/${channel.id}` : "",
            channelThumbnail: channel.thumbnail || "",
            subscriberCount: channel.subscriberCount || 0,
            about: channel.description || "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
          }))
        }
      })
      .finally(() => setLoading(false))
  }, [session])

  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const save = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    const response = await fetch("/api/creator-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await response.json()
    setSaving(false)
    if (!response.ok) {
      showToast({ type: "error", title: "Profile not saved", message: data.error })
      return
    }
    showToast({ type: "success", title: "Creator profile saved", message: "Hosts can now review your channel when you book." })
    router.push("/dashboard")
  }

  if (loading || status === "loading") return <><Header /><main className="min-h-screen pt-32 text-center text-text-muted">Loading your profile…</main></>

  if (!session?.youtubeAccessToken && !form.youtubeChannelId) {
    return <><Header /><main className="min-h-screen pt-32 px-6"><div className="max-w-xl mx-auto border border-border bg-surface p-8"><Youtube className="w-8 h-8 text-red-500 mb-5" /><h1 className="text-2xl font-semibold text-text-primary mb-3">Connect your YouTube channel</h1><p className="text-text-secondary mb-6">COMARI uses your connected channel so hosts can see who they’re featuring. You only do this once.</p><button onClick={() => signIn("google-youtube", { callbackUrl: "/dashboard/profile" })} className="bg-accent text-background font-semibold px-5 py-3">Connect YouTube</button></div></main><Footer /></>
  }

  return <><Header /><main className="min-h-screen pt-28 pb-20 px-6"><form onSubmit={save} className="max-w-3xl mx-auto"><div className="mb-8"><p className="text-xs uppercase tracking-widest text-accent mb-2">Creator profile</p><h1 className="text-3xl font-semibold text-text-primary mb-3">About your channel</h1><p className="text-text-secondary max-w-2xl">Fill this out once. COMARI attaches it to future bookings so you don’t have to introduce your channel from scratch each time.</p></div>
  <div className="border border-border bg-surface p-6 mb-5 flex items-center gap-4">{form.channelThumbnail && <img src={form.channelThumbnail} alt="" className="w-16 h-16 object-cover" />}<div><p className="font-semibold text-text-primary">{form.channelName}</p><p className="text-sm text-text-muted">{form.subscriberCount.toLocaleString()} subscribers · YouTube verified</p></div><Check className="w-5 h-5 text-emerald-500 ml-auto" /></div>
  <div className="border border-border bg-surface p-6 space-y-5">
    <label className="block"><span className="block text-sm font-medium text-text-primary mb-2">Main niche *</span><select required value={form.niche} onChange={(e) => update("niche", e.target.value)} className="w-full bg-background border border-border px-4 py-3 text-text-primary"><option value="">Choose one</option>{NICHES.map((niche) => <option key={niche}>{niche}</option>)}</select></label>
    <label className="block"><span className="block text-sm font-medium text-text-primary mb-2">About your channel *</span><textarea required rows={4} value={form.about} onChange={(e) => update("about", e.target.value)} className="w-full bg-background border border-border px-4 py-3 text-text-primary" placeholder="What do you make, and what should a host know about you?" /></label>
    <label className="block"><span className="block text-sm font-medium text-text-primary mb-2">Your audience *</span><textarea required rows={3} value={form.audience} onChange={(e) => update("audience", e.target.value)} className="w-full bg-background border border-border px-4 py-3 text-text-primary" placeholder="Who watches your channel? Include interests, typical age range, and location if relevant." /></label>
    <label className="block"><span className="block text-sm font-medium text-text-primary mb-2">Content style and personality *</span><textarea required rows={3} value={form.contentStyle} onChange={(e) => update("contentStyle", e.target.value)} className="w-full bg-background border border-border px-4 py-3 text-text-primary" placeholder="For example: relaxed gaming commentary, competitive play, fast-paced edits…" /></label>
    <label className="block"><span className="block text-sm font-medium text-text-primary mb-2">Best example video *</span><input required type="url" value={form.exampleVideoUrl} onChange={(e) => update("exampleVideoUrl", e.target.value)} className="w-full bg-background border border-border px-4 py-3 text-text-primary" placeholder="https://youtube.com/watch?v=…" /></label>
  </div>
  <div className="flex justify-end mt-6"><button disabled={saving} className="bg-accent hover:bg-accent-hover text-background font-semibold px-6 py-3 disabled:opacity-50">{saving ? "Saving…" : "Save creator profile"}</button></div></form></main><Footer /></>
}
