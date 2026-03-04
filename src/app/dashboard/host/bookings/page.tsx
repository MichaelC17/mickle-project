"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    refunded: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  }

  const displayStatus = status.replace(/_/g, " ")

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${styles[status] || styles.pending}`}>
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
    </span>
  )
}

export default function HostBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

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
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: newStatus.toLowerCase() } : b
        ))
      }
    } catch (error) {
      console.error("Failed to update booking:", error)
    } finally {
      setUpdating(null)
    }
  }

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter)

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending" || b.status === "confirmed").length,
    inProgress: bookings.filter(b => b.status === "in_progress").length,
    completed: bookings.filter(b => b.status === "completed").length,
    totalEarnings: bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + b.earnings, 0),
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/dashboard/host" className="text-sm text-text-muted hover:text-text-secondary mb-2 inline-block">
                ← Back to Host Dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-text-primary">Incoming Bookings</h1>
              <p className="text-text-secondary mt-1">Manage guest spot requests from creators</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-muted text-sm mb-1">Total Bookings</p>
              <p className="text-2xl font-semibold text-text-primary">{stats.total}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-muted text-sm mb-1">Pending</p>
              <p className="text-2xl font-semibold text-yellow-500">{stats.pending}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-muted text-sm mb-1">In Progress</p>
              <p className="text-2xl font-semibold text-purple-500">{stats.inProgress}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-muted text-sm mb-1">Total Earnings</p>
              <p className="text-2xl font-semibold text-emerald-500">${stats.totalEarnings}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { value: "all", label: "All" },
              { value: "confirmed", label: "New" },
              { value: "in_progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f.value
                    ? "bg-accent text-white"
                    : "bg-surface border border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-text-muted mb-2">No bookings yet</p>
              <p className="text-text-secondary text-sm">When creators book your packages, they&apos;ll appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-surface border border-border rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {booking.buyerAvatar ? (
                        <img 
                          src={booking.buyerAvatar} 
                          alt={booking.buyerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-lg font-medium text-text-primary">
                          {booking.buyerName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-text-primary">{booking.buyerName}</h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-sm text-text-muted">{booking.buyerEmail}</p>
                        <p className="text-sm text-text-secondary mt-1">
                          <span className="font-medium">{booking.package}</span> · {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-text-primary">${booking.amount}</p>
                      <p className="text-xs text-text-muted">
                        You earn: <span className="text-emerald-500">${booking.earnings}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="text-sm text-text-muted">
                      Platform fee: ${booking.platformFee} (10%)
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {booking.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "IN_PROGRESS")}
                            disabled={updating === booking.id}
                            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                          >
                            {updating === booking.id ? "..." : "Start Work"}
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, "CANCELLED")}
                            disabled={updating === booking.id}
                            className="px-4 py-2 bg-surface-raised hover:bg-border text-text-secondary text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      
                      {booking.status === "in_progress" && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, "COMPLETED")}
                          disabled={updating === booking.id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                        >
                          {updating === booking.id ? "..." : "Mark Complete"}
                        </button>
                      )}
                      
                      {booking.status === "completed" && (
                        <span className="text-sm text-emerald-500 font-medium">✓ Completed</span>
                      )}
                      
                      {booking.status === "cancelled" && (
                        <span className="text-sm text-red-500 font-medium">Cancelled</span>
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
    </div>
  )
}
