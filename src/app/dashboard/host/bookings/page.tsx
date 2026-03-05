"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useToast } from "@/context/ToastContext"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Play,
  XCircle,
  DollarSign,
  ExternalLink,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"

interface Booking {
  id: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  buyerAvatar: string | null
  package: string
  amount: number
  platformFee: number
  earnings: number
  status: string
  notes: string | null
  date: string
}

export default function HostBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { showToast } = useToast()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [declineTarget, setDeclineTarget] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login?callbackUrl=/dashboard/host/bookings")
      return
    }

    fetchBookings()
  }, [session, status, router])

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings/host")
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings || [])
      } else if (res.status === 403) {
        router.push("/apply")
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId)
    try {
      const res = await fetch("/api/bookings/host", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      })

      if (res.ok) {
        const label =
          newStatus === "IN_PROGRESS"
            ? "started"
            : newStatus === "COMPLETED"
              ? "completed"
              : "declined"
        setBookings(
          bookings.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus.toLowerCase() } : b
          )
        )
        showToast({
          type: "success",
          title: "Booking updated",
          message: `Booking has been ${label}.`,
        })
      } else {
        showToast({
          type: "error",
          title: "Update failed",
          message: "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      console.error("Failed to update booking:", error)
      showToast({
        type: "error",
        title: "Update failed",
        message: "Something went wrong. Please try again.",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleDecline = (bookingId: string) => {
    setDeclineTarget(bookingId)
  }

  const confirmDecline = async () => {
    if (!declineTarget) return
    await updateBookingStatus(declineTarget, "CANCELLED")
    setDeclineTarget(null)
  }

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter)

  const stats = {
    total: bookings.length,
    pending: bookings.filter(
      (b) => b.status === "pending" || b.status === "confirmed"
    ).length,
    inProgress: bookings.filter((b) => b.status === "in_progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    totalEarnings: bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.earnings, 0),
  }

  const filters = [
    { value: "all", label: "All", count: stats.total },
    { value: "confirmed", label: "New Bookings", count: stats.pending },
    { value: "in_progress", label: "In Progress", count: stats.inProgress },
    { value: "completed", label: "Completed", count: stats.completed },
    {
      value: "cancelled",
      label: "Cancelled",
      count: bookings.filter((b) => b.status === "cancelled").length,
    },
  ]

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80 mb-8" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-5 relative overflow-hidden"
                >
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full" />
              ))}
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-56 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
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
        <div className="max-w-5xl mx-auto">
          {/* Back + Title */}
          <div className="mb-8">
            <Link
              href="/dashboard/host"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Host Dashboard
            </Link>
            <h1 className="text-2xl font-semibold text-text-primary">
              Incoming Bookings
            </h1>
            <p className="text-text-secondary mt-1">
              Manage guest spot requests from creators
            </p>
          </div>

          {/* Glass Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                Total
              </p>
              <p className="text-2xl font-semibold text-text-primary">
                {stats.total}
              </p>
            </div>

            <div className="glass rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                Awaiting Action
              </p>
              <p className="text-2xl font-semibold text-yellow-500">
                {stats.pending}
              </p>
            </div>

            <div className="glass rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Play className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                In Progress
              </p>
              <p className="text-2xl font-semibold text-purple-500">
                {stats.inProgress}
              </p>
            </div>

            <div className="glass rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">
                Total Earnings
              </p>
              <p className="text-2xl font-semibold text-emerald-500">
                ${stats.totalEarnings.toLocaleString()}
              </p>
              <a
                href="https://dashboard.stripe.com/payouts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-indigo-400 transition-colors mt-1.5"
              >
                View payout history
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.value
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "glass text-text-secondary hover:text-text-primary"
                }`}
              >
                {f.label}
                {f.count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      filter === f.value
                        ? "bg-white/20 text-white"
                        : "bg-surface-raised text-text-muted"
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="glass rounded-xl p-16 text-center">
              <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-text-muted" />
              </div>
              <p className="text-text-primary font-medium mb-1">
                No bookings yet
              </p>
              <p className="text-text-muted text-sm max-w-sm mx-auto">
                When creators book your packages, they&apos;ll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="glass rounded-xl p-6 transition-all hover:border-[var(--glass-border)] hover:shadow-lg hover:shadow-black/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {booking.buyerAvatar ? (
                        <img
                          src={booking.buyerAvatar}
                          alt={booking.buyerName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-sm font-semibold text-indigo-400 ring-2 ring-border">
                          {booking.buyerName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <h3 className="font-medium text-text-primary">
                            {booking.buyerName}
                          </h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        {booking.status === "confirmed" && (
                          <p className="text-xs text-yellow-500/80 mb-1">
                            New Booking — awaiting your action
                          </p>
                        )}
                        <p className="text-sm text-text-muted">
                          {booking.buyerEmail}
                        </p>
                        <p className="text-sm text-text-secondary mt-1">
                          <span className="font-medium">{booking.package}</span>
                          <span className="text-text-muted mx-1.5">·</span>
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        {booking.notes && (
                          <p className="text-xs text-text-muted mt-2 italic max-w-md line-clamp-2">
                            &ldquo;{booking.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-semibold text-text-primary">
                        ${booking.amount}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        You earn{" "}
                        <span className="text-emerald-500 font-medium">
                          ${booking.earnings}
                        </span>
                      </p>
                      <p className="text-[11px] text-text-muted/60 mt-0.5">
                        Fee: ${booking.platformFee}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {(booking.status === "confirmed" ||
                        booking.status === "in_progress") && (
                        <Link
                          href={`/booking/${booking.id}`}
                          className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Open Chat
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === "confirmed" && (
                        <>
                          <div className="relative group/start">
                            <button
                              onClick={() =>
                                updateBookingStatus(booking.id, "IN_PROGRESS")
                              }
                              disabled={updating === booking.id}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                            >
                              <Play className="w-3.5 h-3.5" />
                              {updating === booking.id
                                ? "Updating..."
                                : "Start Work"}
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 w-56 p-2.5 rounded-lg bg-surface border border-border text-xs text-text-secondary shadow-xl opacity-0 pointer-events-none group-hover/start:opacity-100 transition-opacity z-10">
                              Signals to the buyer that you&apos;ve begun
                              working on their guest spot
                            </div>
                          </div>
                          <button
                            onClick={() => handleDecline(booking.id)}
                            disabled={updating === booking.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 glass text-text-secondary hover:text-red-400 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Decline
                          </button>
                        </>
                      )}

                      {booking.status === "in_progress" && (
                        <button
                          onClick={() =>
                            updateBookingStatus(booking.id, "COMPLETED")
                          }
                          disabled={updating === booking.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {updating === booking.id
                            ? "Updating..."
                            : "Mark Complete"}
                        </button>
                      )}

                      {booking.status === "completed" && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-500 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}

                      {booking.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-red-400 font-medium">
                          <XCircle className="w-4 h-4" />
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Decline Confirmation Dialog */}
      <AlertDialog
        open={!!declineTarget}
        onOpenChange={(open) => !open && setDeclineTarget(null)}
      >
        <AlertDialogContent className="glass border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-text-primary">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Decline this booking?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-text-muted">
              Declining will cancel this booking and refund the buyer. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass border-border text-text-secondary hover:text-text-primary">
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDecline}
              className="bg-red-500 hover:bg-red-600 text-white border-0"
            >
              Decline &amp; Refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
