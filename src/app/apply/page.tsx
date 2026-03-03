"use client"

import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

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

export default function ApplyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [channel, setChannel] = useState<YouTubeChannel | null>(null)
  const [existingHost, setExistingHost] = useState<ExistingHost | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [niche, setNiche] = useState("")
  const [bio, setBio] = useState("")
  const [packages, setPackages] = useState<PackageInput[]>([{ ...DEFAULT_PACKAGE }])

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
          setStep(2)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [session, status])

  const handleYouTubeSignIn = () => {
    signIn("google-youtube", { callbackUrl: "/apply" })
  }

  const addPackage = () => {
    setPackages([...packages, { ...DEFAULT_PACKAGE }])
  }

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      setPackages(packages.filter((_, i) => i !== index))
    }
  }

  const updatePackage = (index: number, field: keyof PackageInput, value: string | string[]) => {
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
      updated[pkgIndex].includes = updated[pkgIndex].includes.filter((_, i) => i !== includeIndex)
      setPackages(updated)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!channel) return

    const validPackages = packages.filter(pkg => pkg.name && pkg.price)
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
          packages: validPackages.map(pkg => ({
            name: pkg.name,
            price: parseInt(pkg.price, 10),
            description: pkg.description,
            includes: pkg.includes.filter(inc => inc.trim() !== ""),
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create host profile")
        return
      }

      router.push("/browse")
    } catch (err) {
      setError("Failed to create host profile")
    } finally {
      setSubmitting(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-text-primary mb-3">
              Become a Host
            </h1>
            <p className="text-text-secondary">
              Set up your profile and start accepting guest spot bookings
            </p>
          </div>

          {status === "loading" || loading ? (
            <div className="bg-surface border border-border rounded-lg p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-text-muted">Loading...</p>
            </div>
          ) : existingHost ? (
            <div className="bg-surface border border-border rounded-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">You&apos;re Already a Host!</h2>
                <p className="text-text-secondary mb-6">
                  Your profile for <span className="font-medium">{existingHost.channelName}</span> is live.
                </p>
                <button
                  onClick={() => router.push("/browse")}
                  className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-md transition-colors"
                >
                  View Browse Page
                </button>
              </div>
            </div>
          ) : step === 1 ? (
            <div className="bg-surface border border-border rounded-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">Step 1: Connect Your YouTube Channel</h2>
                <p className="text-text-secondary mb-6">
                  Sign in with YouTube to verify your channel ownership and import your channel info.
                </p>
              </div>

              <button
                onClick={handleYouTubeSignIn}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-3 rounded-md transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Connect YouTube Channel
              </button>
            </div>
          ) : channel && step === 2 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="font-medium text-text-primary mb-4">Connected Channel</h2>
                  <div className="flex items-start gap-4">
                    {channel.thumbnail && (
                      <img
                        src={channel.thumbnail}
                        alt={channel.name}
                        className="w-14 h-14 rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-text-primary">{channel.name}</h3>
                      <p className="text-sm text-text-muted">
                        {channel.customUrl ? `youtube.com/${channel.customUrl}` : `Channel ID: ${channel.id}`}
                      </p>
                      <p className="text-sm text-text-secondary mt-1">
                        <span className="font-medium">{formatNumber(channel.subscriberCount)}</span> subscribers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <h2 className="font-medium text-text-primary">Step 2: Set Up Your Profile</h2>

                  {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="niche" className="block text-sm font-medium text-text-primary mb-1">
                      Content Niche
                    </label>
                    <select
                      id="niche"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select your niche</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Tech">Tech</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Music">Music</option>
                      <option value="Fitness & Health">Fitness & Health</option>
                      <option value="Food & Cooking">Food & Cooking</option>
                      <option value="Travel">Travel</option>
                      <option value="Business & Finance">Business & Finance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Describe your channel and what makes it great for collaborations..."
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium text-text-primary">Step 3: Create Your Packages</h2>
                  <button
                    type="button"
                    onClick={addPackage}
                    className="text-sm text-accent hover:text-accent-hover font-medium"
                  >
                    + Add Package
                  </button>
                </div>

                <div className="space-y-6">
                  {packages.map((pkg, pkgIndex) => (
                    <div key={pkgIndex} className="p-4 bg-background border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-text-muted">Package {pkgIndex + 1}</span>
                        {packages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePackage(pkgIndex)}
                            className="text-sm text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-1">
                            Package Name *
                          </label>
                          <input
                            type="text"
                            value={pkg.name}
                            onChange={(e) => updatePackage(pkgIndex, "name", e.target.value)}
                            placeholder="e.g., Guest Spot"
                            className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-1">
                            Price (USD) *
                          </label>
                          <input
                            type="number"
                            value={pkg.price}
                            onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                            placeholder="e.g., 500"
                            min="1"
                            className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={pkg.description}
                          onChange={(e) => updatePackage(pkgIndex, "description", e.target.value)}
                          placeholder="Brief description of what's included"
                          className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-text-primary">
                            What&apos;s Included
                          </label>
                          <button
                            type="button"
                            onClick={() => addInclude(pkgIndex)}
                            className="text-xs text-accent hover:text-accent-hover"
                          >
                            + Add Item
                          </button>
                        </div>
                        <div className="space-y-2">
                          {pkg.includes.map((inc, incIndex) => (
                            <div key={incIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={inc}
                                onChange={(e) => updateInclude(pkgIndex, incIndex, e.target.value)}
                                placeholder="e.g., 5 min feature"
                                className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                              />
                              {pkg.includes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeInclude(pkgIndex, incIndex)}
                                  className="p-2 text-text-muted hover:text-red-500"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent hover:bg-accent-hover text-white font-medium px-4 py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating Profile..." : "Create Host Profile & Go Live"}
              </button>

              <p className="text-xs text-text-muted text-center">
                Your profile will be visible on the browse page immediately after creation.
              </p>
            </form>
          ) : (
            <div className="bg-surface border border-border rounded-lg p-8 text-center">
              <p className="text-text-secondary">Unable to load. Please try again.</p>
              <button
                onClick={handleYouTubeSignIn}
                className="mt-4 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-2 rounded-md transition-colors"
              >
                Connect YouTube
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
