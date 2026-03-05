"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface Package {
  id: string
  name: string
  price: number
  description: string | null
  includes: string[]
}

interface Host {
  id: string
  channelName: string
  channelHandle: string | null
  channelThumbnail: string | null
  subscriberCount: number
  niche: string | null
  bio: string | null
  packages: Package[]
  stripeAccountId: string | null
  stripeOnboardingComplete: boolean
  stripeChargesEnabled: boolean
  stripePayoutsEnabled: boolean
}

interface StripeStatus {
  connected: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  onboardingComplete: boolean
}

interface RefundRequest {
  id: string
  reason: string
  status: string
  refundAmount: number
  responseNote: string | null
  createdAt: string
  booking: {
    id: string
    buyer: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
    package: {
      name: string
    }
  }
}

interface PackageInput {
  name: string
  price: string
  description: string
  includes: string[]
}

export default function HostDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [host, setHost] = useState<Host | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState("")
  
  const [niche, setNiche] = useState("")
  const [bio, setBio] = useState("")
  const [packages, setPackages] = useState<PackageInput[]>([])
  
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([])
  const [processingRefund, setProcessingRefund] = useState<string | null>(null)
  const [refundResponseNote, setRefundResponseNote] = useState("")
  const [showRefundModal, setShowRefundModal] = useState<RefundRequest | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login?callbackUrl=/dashboard/host")
      return
    }

    const fetchHost = async () => {
      try {
        const res = await fetch("/api/host/create")
        if (res.ok) {
          const data = await res.json()
          if (data.host) {
            setHost(data.host)
            setNiche(data.host.niche || "")
            setBio(data.host.bio || "")
            setPackages(data.host.packages.map((pkg: Package) => ({
              name: pkg.name,
              price: pkg.price.toString(),
              description: pkg.description || "",
              includes: pkg.includes.length > 0 ? pkg.includes : [""],
            })))
          }
        }
      } catch (error) {
        console.error("Failed to fetch host:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHost()
  }, [session, status, router])

  useEffect(() => {
    const fetchStripeStatus = async () => {
      try {
        const res = await fetch("/api/stripe/connect/status")
        if (res.ok) {
          const data = await res.json()
          setStripeStatus(data)
        }
      } catch (error) {
        console.error("Failed to fetch Stripe status:", error)
      }
    }

    const fetchRefundRequests = async () => {
      try {
        const res = await fetch("/api/refunds?role=host")
        if (res.ok) {
          const data = await res.json()
          setRefundRequests(data.refundRequests || [])
        }
      } catch (error) {
        console.error("Failed to fetch refund requests:", error)
      }
    }

    if (host) {
      fetchStripeStatus()
      fetchRefundRequests()
    }
  }, [host])

  const handleStripeConnect = async () => {
    setStripeLoading(true)
    try {
      const res = await fetch("/api/stripe/connect/onboard", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Failed to start Stripe onboarding")
      }
    } catch (error) {
      setError("Failed to connect to Stripe")
    } finally {
      setStripeLoading(false)
    }
  }

  const handleStripeDashboard = async () => {
    setStripeLoading(true)
    try {
      const res = await fetch("/api/stripe/connect/dashboard", { method: "POST" })
      const data = await res.json()
      if (data.url) {
        window.open(data.url, "_blank")
      } else {
        setError(data.error || "Failed to open Stripe dashboard")
      }
    } catch (error) {
      setError("Failed to open Stripe dashboard")
    } finally {
      setStripeLoading(false)
    }
  }

  const handleRefundResponse = async (refundId: string, action: "approve" | "deny") => {
    setProcessingRefund(refundId)
    try {
      const res = await fetch(`/api/refunds/${refundId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, responseNote: refundResponseNote }),
      })
      if (res.ok) {
        setRefundRequests(prev =>
          prev.map(r =>
            r.id === refundId
              ? { ...r, status: action === "approve" ? "PROCESSED" : "DENIED" }
              : r
          )
        )
        setShowRefundModal(null)
        setRefundResponseNote("")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to process refund")
      }
    } catch (error) {
      setError("Failed to process refund request")
    } finally {
      setProcessingRefund(null)
    }
  }

  const addPackage = () => {
    setPackages([...packages, { name: "", price: "", description: "", includes: [""] }])
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

  const handleSave = async () => {
    const validPackages = packages.filter(pkg => pkg.name && pkg.price)
    if (validPackages.length === 0) {
      setError("Please add at least one package with a name and price")
      return
    }

    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/host/create", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        setError(data.error || "Failed to save changes")
        return
      }

      setHost(data.host)
      setEditing(false)
    } catch (err) {
      setError("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const res = await fetch("/api/host/create", {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/browse")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to delete profile")
      }
    } catch (err) {
      setError("Failed to delete profile")
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!host) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-semibold text-text-primary mb-4">No Host Profile</h1>
            <p className="text-text-secondary mb-6">You haven&apos;t created a host profile yet.</p>
            <Link
              href="/apply"
              className="inline-block bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Become a Host
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-secondary mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-text-primary">Manage Host Profile</h1>
            </div>
            {!editing && (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/host/bookings"
                  className="bg-surface-raised hover:bg-border text-text-primary font-medium px-4 py-2 rounded-md transition-colors"
                >
                  View Bookings
                </Link>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-accent hover:bg-accent-hover text-white font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
              {host.channelThumbnail ? (
                <img 
                  src={host.channelThumbnail} 
                  alt={host.channelName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center text-2xl font-medium text-text-primary">
                  {host.channelName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{host.channelName}</h2>
                <p className="text-text-muted">
                  {host.channelHandle ? `@${host.channelHandle.replace("@", "")}` : ""} · {formatNumber(host.subscriberCount)} subscribers
                </p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Niche</label>
                  <select
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
                  <label className="block text-sm font-medium text-text-primary mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-text-muted">Niche:</span>
                  <span className="ml-2 text-text-primary">{host.niche || "Not set"}</span>
                </div>
                <div>
                  <span className="text-sm text-text-muted">Bio:</span>
                  <p className="mt-1 text-text-secondary">{host.bio || "No bio set"}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Packages</h3>
              {editing && (
                <button
                  onClick={addPackage}
                  className="text-sm text-accent hover:text-accent-hover font-medium"
                >
                  + Add Package
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                {packages.map((pkg, pkgIndex) => (
                  <div key={pkgIndex} className="p-4 bg-background border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-text-muted">Package {pkgIndex + 1}</span>
                      {packages.length > 1 && (
                        <button
                          onClick={() => removePackage(pkgIndex)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => updatePackage(pkgIndex, "name", e.target.value)}
                        placeholder="Package name"
                        className="px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                        placeholder="Price (USD)"
                        className="px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <input
                      type="text"
                      value={pkg.description}
                      onChange={(e) => updatePackage(pkgIndex, "description", e.target.value)}
                      placeholder="Description"
                      className="w-full px-3 py-2 bg-surface border border-border rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent mb-4"
                    />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-text-muted">What&apos;s included</span>
                        <button
                          onClick={() => addInclude(pkgIndex)}
                          className="text-xs text-accent hover:text-accent-hover"
                        >
                          + Add
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
                                onClick={() => removeInclude(pkgIndex, incIndex)}
                                className="p-2 text-text-muted hover:text-red-500"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {host.packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 bg-background border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-text-primary">{pkg.name}</h4>
                      <span className="font-semibold text-text-primary">${pkg.price}</span>
                    </div>
                    {pkg.description && (
                      <p className="text-sm text-text-secondary mb-2">{pkg.description}</p>
                    )}
                    {pkg.includes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {pkg.includes.map((inc, i) => (
                          <span key={i} className="text-xs bg-surface-raised px-2 py-1 rounded text-text-muted">
                            {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {editing && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setEditing(false)
                  setNiche(host.niche || "")
                  setBio(host.bio || "")
                  setPackages(host.packages.map((pkg) => ({
                    name: pkg.name,
                    price: pkg.price.toString(),
                    description: pkg.description || "",
                    includes: pkg.includes.length > 0 ? pkg.includes : [""],
                  })))
                }}
                className="text-text-secondary hover:text-text-primary font-medium px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* Stripe Connect Section */}
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#635BFF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Stripe Connect</h3>
                <p className="text-sm text-text-muted">Receive payments directly to your bank account</p>
              </div>
            </div>

            {stripeStatus === null ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
              </div>
            ) : stripeStatus.connected && stripeStatus.chargesEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-600 dark:text-emerald-400">Connected</p>
                    <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                      Your account is ready to receive payments
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${stripeStatus.chargesEnabled ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                      <span className="text-sm text-text-muted">Charges</span>
                    </div>
                    <p className="font-medium text-text-primary">{stripeStatus.chargesEnabled ? 'Enabled' : 'Pending'}</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${stripeStatus.payoutsEnabled ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                      <span className="text-sm text-text-muted">Payouts</span>
                    </div>
                    <p className="font-medium text-text-primary">{stripeStatus.payoutsEnabled ? 'Enabled' : 'Pending'}</p>
                  </div>
                </div>

                <button
                  onClick={handleStripeDashboard}
                  disabled={stripeLoading}
                  className="w-full bg-[#635BFF] hover:bg-[#5851e6] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {stripeLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open Stripe Dashboard
                    </>
                  )}
                </button>
              </div>
            ) : stripeStatus.connected && !stripeStatus.onboardingComplete ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-600 dark:text-yellow-400">Onboarding Incomplete</p>
                    <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80">
                      Please complete your Stripe account setup to receive payments
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStripeConnect}
                  disabled={stripeLoading}
                  className="w-full bg-[#635BFF] hover:bg-[#5851e6] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {stripeLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      Complete Setup
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-text-secondary">
                  Connect your Stripe account to receive direct payments from bookings. We charge a 10% platform fee on each transaction.
                </p>

                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-xs text-text-muted">Secure</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-text-muted">Fast Payouts</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-xs text-text-muted">Protected</p>
                  </div>
                </div>

                <button
                  onClick={handleStripeConnect}
                  disabled={stripeLoading}
                  className="w-full bg-[#635BFF] hover:bg-[#5851e6] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {stripeLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                      </svg>
                      Connect with Stripe
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Refund Requests Section */}
          {refundRequests.length > 0 && (
            <div className="bg-surface border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Refund Requests</h3>
                  <p className="text-sm text-text-muted">
                    {refundRequests.filter(r => r.status === "PENDING").length} pending request(s)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {refundRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-4 rounded-lg border ${
                      request.status === "PENDING"
                        ? "bg-yellow-500/5 border-yellow-500/20"
                        : request.status === "PROCESSED" || request.status === "APPROVED"
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-red-500/5 border-red-500/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {request.booking.buyer.image ? (
                          <img
                            src={request.booking.buyer.image}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center text-text-primary font-medium">
                            {(request.booking.buyer.name || request.booking.buyer.email)[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-text-primary">
                            {request.booking.buyer.name || request.booking.buyer.email}
                          </p>
                          <p className="text-sm text-text-muted">
                            {request.booking.package.name} · ${request.refundAmount}
                          </p>
                          <p className="text-sm text-text-secondary mt-2">
                            &quot;{request.reason}&quot;
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {request.status === "PENDING" ? (
                          <>
                            <button
                              onClick={() => setShowRefundModal(request)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors"
                            >
                              Review
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              request.status === "PROCESSED" || request.status === "APPROVED"
                                ? "bg-emerald-500/20 text-emerald-500"
                                : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {request.status === "PROCESSED" || request.status === "APPROVED"
                              ? "Refunded"
                              : "Denied"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refund Review Modal */}
          {showRefundModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Review Refund Request</h3>
                
                <div className="bg-background rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    {showRefundModal.booking.buyer.image ? (
                      <img
                        src={showRefundModal.booking.buyer.image}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center text-text-primary font-medium">
                        {(showRefundModal.booking.buyer.name || showRefundModal.booking.buyer.email)[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-text-primary">
                        {showRefundModal.booking.buyer.name || showRefundModal.booking.buyer.email}
                      </p>
                      <p className="text-sm text-text-muted">{showRefundModal.booking.package.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">&quot;{showRefundModal.reason}&quot;</p>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-text-muted">Refund amount:</span>
                  <span className="font-semibold text-text-primary">${showRefundModal.refundAmount}</span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-text-muted mb-2">Response note (optional)</label>
                  <textarea
                    value={refundResponseNote}
                    onChange={(e) => setRefundResponseNote(e.target.value)}
                    placeholder="Add a note to the buyer..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent resize-none h-20"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRefundModal(null)
                      setRefundResponseNote("")
                    }}
                    className="flex-1 py-3 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRefundResponse(showRefundModal.id, "deny")}
                    disabled={processingRefund === showRefundModal.id}
                    className="flex-1 py-3 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium disabled:opacity-50"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => handleRefundResponse(showRefundModal.id, "approve")}
                    disabled={processingRefund === showRefundModal.id}
                    className="flex-1 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors disabled:opacity-50"
                  >
                    {processingRefund === showRefundModal.id ? "..." : "Approve"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Danger Zone</h3>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400">Delete Host Profile</h4>
                  <p className="text-sm text-red-600 dark:text-red-500">
                    This will permanently delete your host profile and all packages.
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-text-primary mb-4">Delete Host Profile?</h3>
                <p className="text-text-secondary mb-6">
                  This action cannot be undone. Your host profile, all packages, and any associated data will be permanently deleted.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-text-secondary hover:text-text-primary font-medium px-4 py-2 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
