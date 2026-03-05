"use client"

import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber } from "@/lib/utils"
import { useToast } from "@/context/ToastContext"
import {
  Youtube,
  ChevronRight,
  Plus,
  X,
  Check,
  AlertTriangle,
  Clock,
  Users,
  Sparkles,
  Mail,
} from "lucide-react"

interface YouTubeChannel {
  id: string
  name: string
  description: string
  customUrl: string
  thumbnail: string
  subscriberCount: number
  videoCount: number
  viewCount: number
}

interface PackageInput {
  name: string
  price: string
  description: string
  includes: string[]
}

interface ExistingHost {
  id: string
  channelName: string
}

const DEFAULT_PACKAGE: PackageInput = {
  name: "",
  price: "",
  description: "",
  includes: [""],
}

const PACKAGE_TEMPLATES: PackageInput[] = [
  {
    name: "Basic Guest Spot",
    price: "200",
    description: "A brief appearance on the channel with cross-promotion",
    includes: [
      "5-minute feature segment",
      "Channel mention in description",
      "Social media shoutout",
    ],
  },
  {
    name: "Featured Collab",
    price: "500",
    description: "A dedicated collaboration with full promotion",
    includes: [
      "Full collaboration video",
      "Channel promotion in video & description",
      "Pinned comment feature",
      "Social media cross-promotion",
    ],
  },
  {
    name: "Premium Package",
    price: "1000",
    description: "The ultimate collaboration experience with multi-platform reach",
    includes: [
      "Dedicated collaboration video",
      "Multi-platform promotion",
      "Custom thumbnail feature",
      "Priority scheduling",
      "Post-video analytics report",
    ],
  },
]

const MIN_SUBSCRIBERS = 10000

const STEPS = [
  { label: "Connect YouTube", icon: Youtube },
  { label: "Profile Setup", icon: Users },
  { label: "Create Packages", icon: Sparkles },
]

const NICHES = [
  "Gaming",
  "Tech",
  "Lifestyle",
  "Education",
  "Entertainment",
  "Music",
  "Fitness & Health",
  "Food & Cooking",
  "Travel",
  "Business & Finance",
  "Other",
]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-12">
      {STEPS.map((s, i) => {
        const stepNum = i + 1
        const isComplete = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        const Icon = s.icon

        return (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div className="w-12 sm:w-20 h-0.5 mx-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isComplete || isCurrent ? "bg-indigo-500" : "bg-border"
                  }`}
                />
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isComplete
                    ? "bg-indigo-500 text-white shadow-glow"
                    : isCurrent
                      ? "bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500 shadow-glow"
                      : "bg-surface-raised text-text-muted border border-border"
                }`}
              >
                {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                  isCurrent
                    ? "text-indigo-400"
                    : isComplete
                      ? "text-text-secondary"
                      : "text-text-muted"
                }`}
              >
                {s.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-center gap-4 mb-12">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-20 h-1 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-20 h-1 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-12 w-48 mx-auto rounded-full" />
    </div>
  )
}

export default function ApplyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [step, setStep] = useState(1)
  const [channel, setChannel] = useState<YouTubeChannel | null>(null)
  const [existingHost, setExistingHost] = useState<ExistingHost | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [belowMinSubs, setBelowMinSubs] = useState(false)

  const [niche, setNiche] = useState("")
  const [bio, setBio] = useState("")
  const [packages, setPackages] = useState<PackageInput[]>([{ ...DEFAULT_PACKAGE }])

  const [waitlistEmail, setWaitlistEmail] = useState("")
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    const fetchData = async () => {
      setLoading(true)

      if (session?.user?.id) {
        const hostRes = await fetch("/api/host/create")
        if (hostRes.ok) {
          const data = await hostRes.json()
          if (data.host) {
            setExistingHost(data.host)
          }
        }
      }

      if (session?.youtubeAccessToken) {
        const channelRes = await fetch("/api/youtube/channel")
        if (channelRes.ok) {
          const data = await channelRes.json()
          setChannel(data)
          if (data.subscriberCount < MIN_SUBSCRIBERS) {
            setBelowMinSubs(true)
          } else {
            setStep(2)
          }
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [session, status])

  const handleYouTubeSignIn = () => {
    signIn("google-youtube", { callbackUrl: "/apply" })
  }

  const loadTemplates = () => {
    setPackages(PACKAGE_TEMPLATES.map((t) => ({ ...t, includes: [...t.includes] })))
  }

  const addPackage = () => {
    setPackages([...packages, { ...DEFAULT_PACKAGE, includes: [""] }])
  }

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      setPackages(packages.filter((_, i) => i !== index))
    }
  }

  const updatePackage = (
    index: number,
    field: keyof PackageInput,
    value: string | string[]
  ) => {
    const updated = [...packages]
    updated[index] = { ...updated[index], [field]: value }
    setPackages(updated)
  }

  const addInclude = (pkgIndex: number) => {
    const updated = [...packages]
    updated[pkgIndex].includes = [...updated[pkgIndex].includes, ""]
    setPackages(updated)
  }

  const updateInclude = (pkgIndex: number, includeIndex: number, value: string) => {
    const updated = [...packages]
    updated[pkgIndex].includes[includeIndex] = value
    setPackages(updated)
  }

  const removeInclude = (pkgIndex: number, includeIndex: number) => {
    const updated = [...packages]
    if (updated[pkgIndex].includes.length > 1) {
      updated[pkgIndex].includes = updated[pkgIndex].includes.filter(
        (_, i) => i !== includeIndex
      )
      setPackages(updated)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!channel) return

    const validPackages = packages.filter((pkg) => pkg.name && pkg.price)
    if (validPackages.length === 0) {
      setError("Please add at least one package with a name and price")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/host/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: channel.id,
          channelName: channel.name,
          channelHandle: channel.customUrl,
          channelUrl: channel.customUrl
            ? `https://youtube.com/${channel.customUrl}`
            : `https://youtube.com/channel/${channel.id}`,
          channelThumbnail: channel.thumbnail,
          subscriberCount: channel.subscriberCount,
          niche,
          bio,
          packages: validPackages.map((pkg) => ({
            name: pkg.name,
            price: parseInt(pkg.price, 10),
            description: pkg.description,
            includes: pkg.includes.filter((inc) => inc.trim() !== ""),
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create host profile")
        return
      }

      showToast({
        type: "success",
        title: "Profile Published!",
        message: "Your host profile is now live on the browse page.",
      })
      router.push("/browse")
    } catch {
      setError("Failed to create host profile")
    } finally {
      setSubmitting(false)
    }
  }

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (waitlistEmail) {
      setWaitlistSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Host Application
            </div>
            <h1 className="text-3xl sm:text-4xl font-display text-text-primary mb-3">
              Become a Host
            </h1>
            <p className="text-text-secondary max-w-md mx-auto">
              Set up your profile and start accepting guest spot bookings from creators
            </p>
          </div>

          {status === "loading" || loading ? (
            <LoadingSkeleton />
          ) : existingHost ? (
            <div className="fade-in">
              <div className="glass rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">
                  You&apos;re Already a Host!
                </h2>
                <p className="text-text-secondary mb-6">
                  Your profile for{" "}
                  <span className="font-medium text-text-primary">
                    {existingHost.channelName}
                  </span>{" "}
                  is live.
                </p>
                <button
                  onClick={() => router.push("/browse")}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-8 py-3 rounded-full transition-colors"
                >
                  View Browse Page
                </button>
              </div>
            </div>
          ) : belowMinSubs && channel ? (
            <div className="fade-in space-y-6">
              <div className="glass rounded-xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  </div>

                  <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-raised mb-6">
                    {channel.thumbnail && (
                      <img
                        src={channel.thumbnail}
                        alt={channel.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="text-left">
                      <p className="font-semibold text-text-primary text-sm">{channel.name}</p>
                      <p className="text-xs text-text-muted">
                        {formatNumber(channel.subscriberCount)} subscribers
                      </p>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-text-primary mb-2">
                    Not Eligible Yet
                  </h2>
                  <p className="text-text-secondary mb-2">
                    Your channel needs at least{" "}
                    <span className="font-semibold text-text-primary">10,000 subscribers</span>{" "}
                    to become a host.
                  </p>
                  <p className="text-text-muted text-sm mb-8">
                    You currently have {formatNumber(channel.subscriberCount)} subscribers.
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  {waitlistSubmitted ? (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-text-primary font-medium">You&apos;re on the list!</p>
                      <p className="text-text-muted text-sm mt-1">
                        We&apos;ll email you when you qualify or when we lower the threshold.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Mail className="w-4 h-4" />
                        <span>Join the waitlist</span>
                      </div>
                      <p className="text-text-muted text-xs">
                        We&apos;ll notify you when you qualify or when we lower the threshold.
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="you@email.com"
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          required
                          className="flex-1 bg-background border-border rounded-full px-4 h-10"
                        />
                        <button
                          type="submit"
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-full transition-colors text-sm whitespace-nowrap"
                        >
                          Notify Me
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <button
                onClick={() => router.push("/browse")}
                className="w-full text-text-secondary hover:text-text-primary font-medium py-3 rounded-full transition-colors text-sm border border-border hover:border-text-muted"
              >
                Browse Hosts Instead
              </button>
            </div>
          ) : (
            <>
              <StepIndicator currentStep={step} />

              {step === 1 && (
                <div className="space-y-6 fade-in">
                  <div className="relative overflow-hidden rounded-xl bg-indigo-500/5 border border-indigo-500/20 p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary mb-1">
                          Subscriber Requirement
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          To become a host, you need at least{" "}
                          <span className="font-bold text-indigo-400">
                            10,000 YouTube subscribers
                          </span>{" "}
                          on your channel.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Youtube className="w-8 h-8 text-red-500" />
                      </div>
                      <h2 className="text-xl font-semibold text-text-primary mb-2">
                        Connect Your YouTube Channel
                      </h2>
                      <p className="text-text-secondary text-sm max-w-sm mx-auto">
                        Sign in with YouTube to verify your channel ownership and import your
                        info.
                      </p>
                    </div>

                    <button
                      onClick={handleYouTubeSignIn}
                      className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-3 rounded-full transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                      Connect YouTube Channel
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-text-muted text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Twitch and TikTok host onboarding coming Q2 2026.</span>
                  </div>
                </div>
              )}

              {step === 2 && channel && (
                <div className="space-y-6 fade-in">
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {channel.thumbnail && (
                          <img
                            src={channel.thumbnail}
                            alt={channel.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {channel.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {formatNumber(channel.subscriberCount)} subscribers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6 space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-text-primary mb-1">
                        Profile Setup
                      </h2>
                      <p className="text-text-muted text-sm">
                        Tell potential guests about your channel and content.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="niche"
                        className="block text-sm font-medium text-text-primary mb-1.5"
                      >
                        Content Niche
                      </label>
                      <select
                        id="niche"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      >
                        <option value="">Select your niche</option>
                        {NICHES.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-text-primary mb-1.5"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        placeholder="Describe your channel and what makes it great for collaborations..."
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 justify-center text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (!niche) {
                        setError("Please select your content niche")
                        return
                      }
                      setError("")
                      setStep(3)
                    }}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-3 rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Packages
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 3 && channel && (
                <form onSubmit={handleSubmit} className="space-y-6 fade-in">
                  <div className="glass rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {channel.thumbnail && (
                          <img
                            src={channel.thumbnail}
                            alt={channel.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <p className="text-sm font-medium text-text-primary truncate">
                          {channel.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm text-text-secondary truncate">
                        {niche}
                        {bio ? ` · ${bio.slice(0, 50)}${bio.length > 50 ? "…" : ""}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-lg font-semibold text-text-primary">
                        Create Packages
                      </h2>
                    </div>
                    <p className="text-text-muted text-sm mb-4">
                      Define what you offer to guests. Set your own prices and perks.
                    </p>

                    {packages.length === 1 && !packages[0].name && (
                      <button
                        type="button"
                        onClick={loadTemplates}
                        className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/5 transition-colors text-sm font-medium"
                      >
                        <Sparkles className="w-4 h-4" />
                        Load example packages to customize
                      </button>
                    )}

                    <div className="space-y-4">
                      {packages.map((pkg, pkgIndex) => (
                        <div
                          key={pkgIndex}
                          className="p-4 bg-background/50 border border-border rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                              Package {pkgIndex + 1}
                            </span>
                            {packages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePackage(pkgIndex)}
                                className="p-1 text-text-muted hover:text-red-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-text-secondary mb-1">
                                Name *
                              </label>
                              <Input
                                value={pkg.name}
                                onChange={(e) =>
                                  updatePackage(pkgIndex, "name", e.target.value)
                                }
                                placeholder="e.g., Guest Spot"
                                className="bg-background border-border rounded-lg h-10"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-text-secondary mb-1">
                                Price (USD) *
                              </label>
                              <Input
                                type="number"
                                value={pkg.price}
                                onChange={(e) =>
                                  updatePackage(pkgIndex, "price", e.target.value)
                                }
                                placeholder="e.g., 500"
                                min="1"
                                className="bg-background border-border rounded-lg h-10"
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="block text-xs font-medium text-text-secondary mb-1">
                              Description
                            </label>
                            <Input
                              value={pkg.description}
                              onChange={(e) =>
                                updatePackage(pkgIndex, "description", e.target.value)
                              }
                              placeholder="Brief description of what's included"
                              className="bg-background border-border rounded-lg h-10"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-medium text-text-secondary">
                                What&apos;s Included
                              </label>
                              <button
                                type="button"
                                onClick={() => addInclude(pkgIndex)}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Add
                              </button>
                            </div>
                            <div className="space-y-2">
                              {pkg.includes.map((inc, incIndex) => (
                                <div key={incIndex} className="flex items-center gap-2">
                                  <Input
                                    value={inc}
                                    onChange={(e) =>
                                      updateInclude(pkgIndex, incIndex, e.target.value)
                                    }
                                    placeholder="e.g., 5 min feature"
                                    className="flex-1 bg-background border-border rounded-lg h-9 text-sm"
                                  />
                                  {pkg.includes.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeInclude(pkgIndex, incIndex)}
                                      className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addPackage}
                      className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border text-text-muted hover:text-text-secondary hover:border-text-muted transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Package
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-full border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Publishing…
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Preview &amp; Publish
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-text-muted text-center">
                    Your profile will be visible on the browse page immediately after publishing.
                  </p>
                </form>
              )}

              {step === 1 && !channel && !loading && (
                <div className="hidden" />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
