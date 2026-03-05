"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { formatNumber } from "@/lib/utils"
import { useToast } from "@/context/ToastContext"
import {
  ArrowLeft,
  Edit,
  Eye,
  Save,
  X,
  Trash2,
  Plus,
  ExternalLink,
  Shield,
  Check,
  Clock,
  AlertTriangle,
  CreditCard,
} from "lucide-react"

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

export default function HostDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

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
            setPackages(
              data.host.packages.map((pkg: Package) => ({
                name: pkg.name,
                price: pkg.price.toString(),
                description: pkg.description || "",
                includes: pkg.includes.length > 0 ? pkg.includes : [""],
              }))
            )
          }
        }
      } catch (err) {
        console.error("Failed to fetch host:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHost()
  }, [session, status, router])

  useEffect(() => {
    if (!host) return

    const fetchStripeStatus = async () => {
      try {
        const res = await fetch("/api/stripe/connect/status")
        if (res.ok) {
          const data = await res.json()
          setStripeStatus(data)
        }
      } catch (err) {
        console.error("Failed to fetch Stripe status:", err)
      }
    }

    const fetchRefundRequests = async () => {
      try {
        const res = await fetch("/api/refunds?role=host")
        if (res.ok) {
          const data = await res.json()
          setRefundRequests(data.refundRequests || [])
        }
      } catch (err) {
        console.error("Failed to fetch refund requests:", err)
      }
    }

    fetchStripeStatus()
    fetchRefundRequests()
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
    } catch {
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
    } catch {
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
        setRefundRequests((prev) =>
          prev.map((r) =>
            r.id === refundId
              ? { ...r, status: action === "approve" ? "PROCESSED" : "DENIED" }
              : r
          )
        )
        setShowRefundModal(null)
        setRefundResponseNote("")
        showToast({
          type: "success",
          title: action === "approve" ? "Refund approved" : "Refund denied",
          message:
            action === "approve"
              ? "The refund has been processed"
              : "The refund request has been denied",
        })
      } else {
        const data = await res.json()
        setError(data.error || "Failed to process refund")
      }
    } catch {
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
      updated[pkgIndex].includes = updated[pkgIndex].includes.filter(
        (_, i) => i !== includeIndex
      )
      setPackages(updated)
    }
  }

  const handleSave = async () => {
    const validPackages = packages.filter((pkg) => pkg.name && pkg.price)
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
        setError(data.error || "Failed to save changes")
        return
      }

      setHost(data.host)
      setEditing(false)
      showToast({ type: "success", title: "Saved", message: "Your profile has been updated" })
    } catch {
      setError("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch("/api/host/create", { method: "DELETE" })
      if (res.ok) {
        router.push("/browse")
      } else {
        const data = await res.json()
        setError(data.error || "Failed to delete profile")
      }
    } catch {
      setError("Failed to delete profile")
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const cancelEditing = () => {
    setEditing(false)
    if (host) {
      setNiche(host.niche || "")
      setBio(host.bio || "")
      setPackages(
        host.packages.map((pkg) => ({
          name: pkg.name,
          price: pkg.price.toString(),
          description: pkg.description || "",
          includes: pkg.includes.length > 0 ? pkg.includes : [""],
        }))
      )
    }
  }

  const getStripeStep = (): number => {
    if (!stripeStatus || !stripeStatus.connected) return 1
    if (!stripeStatus.onboardingComplete || !stripeStatus.chargesEnabled) return 2
    return 3
  }

  // ── Loading ──────────────────────────────────────────────
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-4 w-36 mb-4 rounded-full" />
            <Skeleton className="h-8 w-64 mb-8 rounded-full" />

            <div className="glass rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48 rounded-full" />
                  <Skeleton className="h-4 w-64 rounded-full" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
            </div>

            <div className="glass rounded-xl p-6 mb-6">
              <Skeleton className="h-5 w-24 mb-4 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <Skeleton className="h-5 w-36 mb-4 rounded-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl mt-4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── No Host ──────────────────────────────────────────────
  if (!host) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <Eye className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-semibold text-text-primary mb-2">No Host Profile</h1>
            <p className="text-text-muted mb-8">
              You haven&apos;t created a host profile yet. Apply to start receiving bookings.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Become a Host
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const stripeStep = getStripeStep()
  const pendingRefunds = refundRequests.filter((r) => r.status === "PENDING").length

  // ── Main Dashboard ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-text-primary">Manage Host Profile</h1>
            </div>
            {!editing && (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/host/bookings"
                  className="glass text-text-primary font-medium px-4 py-2.5 rounded-xl transition-colors hover:bg-surface-raised inline-flex items-center gap-2 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Bookings
                </Link>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-400">{error}</p>
              </div>
              <button onClick={() => setError("")} className="text-red-400/60 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Profile Card */}
          <section className="glass rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
              {host.channelThumbnail ? (
                <img
                  src={host.channelThumbnail}
                  alt={host.channelName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-xl font-semibold text-indigo-400 ring-2 ring-indigo-500/20">
                  {host.channelName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-text-primary truncate">
                  {host.channelName}
                </h2>
                <p className="text-sm text-text-muted mt-0.5">
                  {host.channelHandle
                    ? `@${host.channelHandle.replace("@", "")}`
                    : ""}
                  {host.channelHandle ? " · " : ""}
                  {formatNumber(host.subscriberCount)} subscribers
                </p>
              </div>
            </div>

            {editing ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Niche</label>
                  <select
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
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
                  <label className="block text-sm font-medium text-text-primary mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
                    placeholder="Tell buyers about your channel and what they can expect..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-muted">Niche</span>
                  {host.niche ? (
                    <span className="bg-indigo-500/10 text-indigo-400 rounded-full px-3 py-1 text-xs font-medium">
                      {host.niche}
                    </span>
                  ) : (
                    <span className="text-sm text-text-muted italic">Not set</span>
                  )}
                </div>
                <div>
                  <span className="text-sm text-text-muted">Bio</span>
                  <p className="mt-1 text-text-secondary text-sm leading-relaxed">
                    {host.bio || "No bio set"}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Packages Card */}
          <section className="glass rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-text-primary">Packages</h3>
              {editing && (
                <button
                  onClick={addPackage}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Package
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                {packages.map((pkg, pkgIndex) => (
                  <div
                    key={pkgIndex}
                    className="bg-background border border-border rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                        Package {pkgIndex + 1}
                      </span>
                      {packages.length > 1 && (
                        <button
                          onClick={() => removePackage(pkgIndex)}
                          className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => updatePackage(pkgIndex, "name", e.target.value)}
                        placeholder="Package name"
                        className="px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm"
                      />
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                        placeholder="Price (USD)"
                        className="px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm"
                      />
                    </div>

                    <input
                      type="text"
                      value={pkg.description}
                      onChange={(e) => updatePackage(pkgIndex, "description", e.target.value)}
                      placeholder="Description"
                      className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm mb-4"
                    />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-muted">What&apos;s included</span>
                        <button
                          onClick={() => addInclude(pkgIndex)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          + Add item
                        </button>
                      </div>
                      <div className="space-y-2">
                        {pkg.includes.map((inc, incIndex) => (
                          <div key={incIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={inc}
                              onChange={(e) =>
                                updateInclude(pkgIndex, incIndex, e.target.value)
                              }
                              placeholder="e.g., 5 min feature"
                              className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm"
                            />
                            {pkg.includes.length > 1 && (
                              <button
                                onClick={() => removeInclude(pkgIndex, incIndex)}
                                className="p-1.5 text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
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
            ) : (
              <div className="space-y-3">
                {host.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-background border border-border rounded-xl p-5 flex items-start justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary">{pkg.name}</h4>
                      {pkg.description && (
                        <p className="text-sm text-text-secondary mt-1">{pkg.description}</p>
                      )}
                      {pkg.includes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {pkg.includes.map((inc, i) => (
                            <span
                              key={i}
                              className="bg-surface-raised text-text-muted rounded-full px-2.5 py-0.5 text-xs"
                            >
                              {inc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-lg font-semibold text-text-primary ml-4 shrink-0">
                      ${pkg.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Edit Actions */}
          {editing && (
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={cancelEditing}
                className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

          {/* Stripe Connect */}
          <section className="relative glass rounded-xl p-6 mb-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.07] via-purple-500/[0.04] to-transparent pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#635BFF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Stripe Connect</h3>
                  <p className="text-xs text-text-muted">
                    Receive payments directly to your bank account
                  </p>
                </div>
              </div>

              {/* Onboarding Progress */}
              <div className="flex items-center mb-6 px-2">
                {/* Step 1: Connect */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      stripeStep > 1
                        ? "bg-emerald-500/20 text-emerald-500"
                        : stripeStep === 1
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-surface-raised text-text-muted"
                    }`}
                  >
                    {stripeStep > 1 ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <span
                    className={`text-xs font-medium ${stripeStep >= 1 ? "text-text-primary" : "text-text-muted"}`}
                  >
                    Connect
                  </span>
                </div>

                <div
                  className={`flex-1 h-px mx-3 transition-colors ${stripeStep > 1 ? "bg-emerald-500/30" : "bg-border"}`}
                />

                {/* Step 2: Verify */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      stripeStep > 2
                        ? "bg-emerald-500/20 text-emerald-500"
                        : stripeStep === 2
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-surface-raised text-text-muted"
                    }`}
                  >
                    {stripeStep > 2 ? <Check className="w-4 h-4" /> : "2"}
                  </div>
                  <span
                    className={`text-xs font-medium ${stripeStep >= 2 ? "text-text-primary" : "text-text-muted"}`}
                  >
                    Verify
                  </span>
                </div>

                <div
                  className={`flex-1 h-px mx-3 transition-colors ${stripeStep > 2 ? "bg-emerald-500/30" : "bg-border"}`}
                />

                {/* Step 3: Ready */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      stripeStep >= 3
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-surface-raised text-text-muted"
                    }`}
                  >
                    {stripeStep >= 3 ? <Check className="w-4 h-4" /> : "3"}
                  </div>
                  <span
                    className={`text-xs font-medium ${stripeStep >= 3 ? "text-text-primary" : "text-text-muted"}`}
                  >
                    Ready
                  </span>
                </div>
              </div>

              {/* Stripe Status Content */}
              {stripeStatus === null ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ) : stripeStatus.connected && stripeStatus.chargesEnabled ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-500 text-sm">Account connected</p>
                      <p className="text-xs text-emerald-500/70">
                        Your account is ready to receive payments
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-2 h-2 rounded-full ${stripeStatus.chargesEnabled ? "bg-emerald-500" : "bg-yellow-500"}`}
                        />
                        <span className="text-xs text-text-muted">Charges</span>
                      </div>
                      <p className="font-medium text-text-primary text-sm">
                        {stripeStatus.chargesEnabled ? "Enabled" : "Pending"}
                      </p>
                    </div>
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-2 h-2 rounded-full ${stripeStatus.payoutsEnabled ? "bg-emerald-500" : "bg-yellow-500"}`}
                        />
                        <span className="text-xs text-text-muted">Payouts</span>
                      </div>
                      <p className="font-medium text-text-primary text-sm">
                        {stripeStatus.payoutsEnabled ? "Enabled" : "Pending"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStripeDashboard}
                    disabled={stripeLoading}
                    className="w-full bg-[#635BFF] hover:bg-[#5851e6] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {stripeLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Open Stripe Dashboard
                      </>
                    )}
                  </button>
                </div>
              ) : stripeStatus.connected && !stripeStatus.onboardingComplete ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-medium text-yellow-500 text-sm">Onboarding incomplete</p>
                      <p className="text-xs text-yellow-500/70">
                        Complete your Stripe account setup to receive payments
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStripeConnect}
                    disabled={stripeLoading}
                    className="w-full bg-[#635BFF] hover:bg-[#5851e6] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {stripeLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Complete Setup"
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">
                    Connect your Stripe account to receive direct payments from bookings. We charge a
                    20% platform fee on each transaction.
                  </p>

                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-5 h-5 text-indigo-400" />
                      </div>
                      <p className="text-xs text-text-muted">Secure</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-2">
                        <CreditCard className="w-5 h-5 text-indigo-400" />
                      </div>
                      <p className="text-xs text-text-muted">Fast Payouts</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-2">
                        <Check className="w-5 h-5 text-indigo-400" />
                      </div>
                      <p className="text-xs text-text-muted">Protected</p>
                    </div>
                  </div>

                  <button
                    onClick={handleStripeConnect}
                    disabled={stripeLoading}
                    className="w-full bg-[#635BFF] hover:bg-[#5851e6] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {stripeLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Connect with Stripe
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Refund Requests */}
          {refundRequests.length > 0 && (
            <section className="glass rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">Refund Requests</h3>
                  <p className="text-xs text-text-muted">
                    {pendingRefunds} pending request{pendingRefunds !== 1 ? "s" : ""}
                  </p>
                </div>
                {pendingRefunds > 0 && (
                  <span className="bg-red-500/10 text-red-400 rounded-full px-2.5 py-1 text-xs font-medium">
                    {pendingRefunds} pending
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {refundRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      request.status === "PENDING"
                        ? "bg-yellow-500/5 border-yellow-500/15"
                        : request.status === "PROCESSED" || request.status === "APPROVED"
                          ? "bg-emerald-500/5 border-emerald-500/15"
                          : "bg-red-500/5 border-red-500/15"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {request.booking.buyer.image ? (
                          <img
                            src={request.booking.buyer.image}
                            alt=""
                            className="w-10 h-10 rounded-full shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center text-text-primary font-medium shrink-0">
                            {(
                              request.booking.buyer.name || request.booking.buyer.email
                            )[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-text-primary text-sm truncate">
                            {request.booking.buyer.name || request.booking.buyer.email}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {request.booking.package.name} · ${request.refundAmount}
                          </p>
                          <p className="text-sm text-text-secondary mt-2 italic">
                            &quot;{request.reason}&quot;
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {request.status === "PENDING" ? (
                          <button
                            onClick={() => setShowRefundModal(request)}
                            className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-medium px-3.5 py-1.5 rounded-full text-xs transition-colors"
                          >
                            Review
                          </button>
                        ) : (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              request.status === "PROCESSED" || request.status === "APPROVED"
                                ? "bg-emerald-500/15 text-emerald-500"
                                : "bg-red-500/15 text-red-400"
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
            </section>
          )}

          {/* Account Section */}
          <section className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-1">Account</h3>
            <p className="text-sm text-text-muted mb-5">Manage your host account settings</p>

            <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary text-sm">Delete host profile</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Permanently removes your profile, packages, and all associated data.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium px-4 py-2 rounded-xl text-sm transition-colors shrink-0 inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />

      {/* Refund Review Dialog */}
      <Dialog
        open={!!showRefundModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowRefundModal(null)
            setRefundResponseNote("")
          }
        }}
      >
        <DialogContent className="glass rounded-2xl border-0 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Refund Request</DialogTitle>
            <DialogDescription>
              Decide whether to approve or deny this refund request.
            </DialogDescription>
          </DialogHeader>

          {showRefundModal && (
            <div className="space-y-4">
              <div className="bg-background rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  {showRefundModal.booking.buyer.image ? (
                    <img
                      src={showRefundModal.booking.buyer.image}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center text-text-primary font-medium">
                      {(
                        showRefundModal.booking.buyer.name ||
                        showRefundModal.booking.buyer.email
                      )[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-text-primary text-sm">
                      {showRefundModal.booking.buyer.name ||
                        showRefundModal.booking.buyer.email}
                    </p>
                    <p className="text-xs text-text-muted">
                      {showRefundModal.booking.package.name}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary italic">
                  &quot;{showRefundModal.reason}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between text-sm px-1">
                <span className="text-text-muted">Refund amount</span>
                <span className="font-semibold text-text-primary">
                  ${showRefundModal.refundAmount}
                </span>
              </div>

              <div>
                <label className="block text-xs text-text-muted mb-2">
                  Response note (optional)
                </label>
                <textarea
                  value={refundResponseNote}
                  onChange={(e) => setRefundResponseNote(e.target.value)}
                  placeholder="Add a note to the buyer..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none h-20 text-sm transition-all"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => handleRefundResponse(showRefundModal.id, "deny")}
                  disabled={processingRefund === showRefundModal.id}
                  className="flex-1 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  Deny
                </button>
                <button
                  onClick={() => handleRefundResponse(showRefundModal.id, "approve")}
                  disabled={processingRefund === showRefundModal.id}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors text-sm disabled:opacity-50"
                >
                  {processingRefund === showRefundModal.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    "Approve Refund"
                  )}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="glass rounded-2xl border-0 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete host profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your host profile, all packages, and any associated data
              will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl border-0"
            >
              {deleting ? "Deleting..." : "Yes, delete profile"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
