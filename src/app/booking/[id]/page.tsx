"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CalendarPicker from "@/components/CalendarPicker"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Send,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  CircleDot,
  RotateCcw,
  AlertCircle,
  Globe,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────

interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
}

interface ScheduleProposal {
  id: string
  proposedById: string
  proposedDate: string
  purpose: string | null
  status: string
  createdAt: string
}

interface RefundRequest {
  id: string
  reason: string
  status: string
  refundAmount: number
  responseNote: string | null
  createdAt: string
}

interface Booking {
  id: string
  status: string
  amount: number
  platformFee: number
  scheduledDate: string | null
  createdAt: string
  package: {
    name: string
    description: string | null
    includes: string[]
  }
  buyer: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  host: {
    id: string
    channelName: string
    channelThumbnail: string | null
    user: {
      id: string
      name: string | null
      email: string
      image: string | null
    }
  }
  isHost: boolean
}

// ── Status Timeline ────────────────────────────────────

const STATUSES = [
  { key: "confirmed", label: "Confirmed", desc: "Payment received" },
  { key: "in_progress", label: "In Progress", desc: "Host is working on it" },
  { key: "completed", label: "Completed", desc: "Guest spot delivered" },
]

function StatusTimeline({ current }: { current: string }) {
  const idx = STATUSES.findIndex((s) => s.key === current)

  return (
    <div className="flex items-center w-full max-w-xl mx-auto">
      {STATUSES.map((step, i) => {
        const isPast = idx > i
        const isCurrent = idx === i
        const isFuture = idx < i

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none group">
            <div className="flex flex-col items-center relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isPast
                    ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30"
                    : isCurrent
                    ? "bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                    : "bg-white/5 text-white/25 ring-1 ring-white/10"
                }`}
              >
                {isPast ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isCurrent ? (
                  <CircleDot className="w-4 h-4" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              <span
                className={`text-xs font-medium mt-2 whitespace-nowrap ${
                  isPast
                    ? "text-emerald-400"
                    : isCurrent
                    ? "text-indigo-400"
                    : "text-white/30"
                }`}
              >
                {step.label}
              </span>
              <span
                className={`text-[10px] mt-0.5 whitespace-nowrap ${
                  isFuture ? "text-white/20" : "text-white/40"
                }`}
              >
                {step.desc}
              </span>
            </div>

            {i < STATUSES.length - 1 && (
              <div className="flex-1 mx-3 mt-[-1.5rem]">
                <div
                  className={`h-0.5 rounded-full transition-all ${
                    isPast ? "bg-emerald-500/50" : "bg-white/10"
                  }`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Avatar helper ──────────────────────────────────────

function Avatar({
  src,
  fallback,
  size = "md",
}: {
  src: string | null | undefined
  fallback: string
  size?: "sm" | "md" | "lg"
}) {
  const dim = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-14 h-14 text-xl" : "w-9 h-9 text-sm"

  if (src) {
    return <img src={src} alt="" className={`${dim} rounded-full object-cover`} />
  }
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium`}
    >
      {fallback[0].toUpperCase()}
    </div>
  )
}

// ── Detected timezone ──────────────────────────────────

function TimezoneIndicator() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return (
    <span className="inline-flex items-center gap-1 text-xs text-white/40">
      <Globe className="w-3 h-3" />
      {tz}
    </span>
  )
}

// ── Page ───────────────────────────────────────────────

export default function BookingDetailPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [proposals, setProposals] = useState<ScheduleProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedPurpose, setSelectedPurpose] = useState("Filming")
  const [proposing, setProposing] = useState(false)
  const [activeTab, setActiveTab] = useState<"messages" | "schedule">("messages")
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState("")
  const [refundRequest, setRefundRequest] = useState<RefundRequest | null>(null)
  const [requestingRefund, setRequestingRefund] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Data fetching ──

  useEffect(() => {
    if (authStatus === "loading") return
    if (!session) {
      router.push(`/login?callbackUrl=/booking/${bookingId}`)
      return
    }
    fetchBooking()
  }, [session, authStatus, bookingId])

  useEffect(() => {
    if (booking && (booking.status === "in_progress" || booking.status === "confirmed")) {
      fetchMessages()
      fetchSchedule()
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [booking?.id, booking?.status])

  useEffect(() => {
    if (booking && !booking.isHost) {
      fetchRefundRequest()
    }
  }, [booking?.id, booking?.isHost])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`)
      if (res.ok) {
        const data = await res.json()
        setBooking(data.booking)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Failed to fetch booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const fetchSchedule = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/schedule`)
      if (res.ok) {
        const data = await res.json()
        setProposals(data.proposals || [])
        if (data.scheduledDate && booking) {
          setBooking({ ...booking, scheduledDate: data.scheduledDate })
        }
      }
    } catch (error) {
      console.error("Failed to fetch schedule:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      })
      if (res.ok) {
        setNewMessage("")
        fetchMessages()
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  const proposeDate = async () => {
    if (!selectedDate || proposing) return

    setProposing(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposedDate: selectedDate.toISOString(),
          purpose: selectedPurpose || null,
        }),
      })
      if (res.ok) {
        setSelectedDate(null)
        setSelectedPurpose("Filming")
        fetchSchedule()
      }
    } catch (error) {
      console.error("Failed to propose date:", error)
    } finally {
      setProposing(false)
    }
  }

  const respondToProposal = async (proposalId: string, action: "accept" | "decline") => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/schedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, action }),
      })
      if (res.ok) {
        fetchSchedule()
        fetchBooking()
      }
    } catch (error) {
      console.error("Failed to respond to proposal:", error)
    }
  }

  const fetchRefundRequest = async () => {
    try {
      const res = await fetch("/api/refunds")
      if (res.ok) {
        const data = await res.json()
        const existingRequest = data.refundRequests?.find(
          (r: RefundRequest & { booking: { id: string } }) => r.booking?.id === bookingId
        )
        if (existingRequest) {
          setRefundRequest(existingRequest)
        }
      }
    } catch (error) {
      console.error("Failed to fetch refund request:", error)
    }
  }

  const requestRefund = async () => {
    if (!refundReason.trim() || requestingRefund) return

    setRequestingRefund(true)
    try {
      const res = await fetch("/api/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, reason: refundReason }),
      })
      if (res.ok) {
        const data = await res.json()
        setRefundRequest(data.refundRequest)
        setShowRefundModal(false)
        setRefundReason("")
      }
    } catch (error) {
      console.error("Failed to request refund:", error)
    } finally {
      setRequestingRefund(false)
    }
  }

  // ── Derived values ──

  const otherParty = booking?.isHost ? booking.buyer : booking?.host.user
  const canMessage = booking
    ? !["completed", "cancelled", "refunded", "pending"].includes(booking.status)
    : false
  const showTimeline =
    booking && ["confirmed", "in_progress", "completed"].includes(booking.status)

  // ── Loading skeleton ──

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Not found ──

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center py-20">
            <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">Booking not found</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
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
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* ── Glass header card ── */}
          <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 mb-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] to-transparent pointer-events-none" />

            <div className="relative flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <Avatar
                  src={
                    booking.isHost
                      ? booking.buyer.image
                      : booking.host.channelThumbnail
                  }
                  fallback={
                    booking.isHost
                      ? booking.buyer.name || booking.buyer.email
                      : booking.host.channelName
                  }
                  size="lg"
                />
                <div>
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <h1 className="text-xl font-semibold text-white">
                      {booking.isHost
                        ? `Booking from ${booking.buyer.name || "Guest"}`
                        : `Booking with ${booking.host.channelName}`}
                    </h1>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-white/60">
                    {booking.package.name} &middot;{" "}
                    <span className="text-white/80 font-medium">${booking.amount}</span>
                  </p>
                  <p className="text-sm text-white/35 mt-1">
                    Booked {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {booking.scheduledDate && (
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-sm text-white/40">Scheduled for</span>
                  </div>
                  <p className="text-lg font-semibold text-emerald-400">
                    {new Date(booking.scheduledDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <TimezoneIndicator />
                </div>
              )}
            </div>

            {/* Status timeline */}
            {showTimeline && (
              <div className="relative mt-6 pt-6 border-t border-white/[0.06]">
                <StatusTimeline current={booking.status} />
              </div>
            )}

            {/* Refund section — buyer only */}
            {!booking.isHost &&
              booking.status !== "refunded" &&
              booking.status !== "cancelled" &&
              booking.status !== "completed" && (
                <div className="relative mt-5 pt-5 border-t border-white/[0.06]">
                  {refundRequest ? (
                    <div
                      className={`flex items-center justify-between p-3.5 rounded-xl ${
                        refundRequest.status === "PENDING"
                          ? "bg-yellow-500/10 ring-1 ring-yellow-500/20"
                          : refundRequest.status === "APPROVED" ||
                            refundRequest.status === "PROCESSED"
                          ? "bg-emerald-500/10 ring-1 ring-emerald-500/20"
                          : "bg-red-500/10 ring-1 ring-red-500/20"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            refundRequest.status === "PENDING"
                              ? "text-yellow-400"
                              : refundRequest.status === "APPROVED" ||
                                refundRequest.status === "PROCESSED"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          Refund {refundRequest.status.toLowerCase()}
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {refundRequest.status === "PENDING"
                            ? "Waiting for host response"
                            : refundRequest.status === "DENIED" &&
                              refundRequest.responseNote
                            ? `Reason: ${refundRequest.responseNote}`
                            : refundRequest.status === "APPROVED" ||
                              refundRequest.status === "PROCESSED"
                            ? "Your refund is being processed"
                            : ""}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          refundRequest.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : refundRequest.status === "APPROVED" ||
                              refundRequest.status === "PROCESSED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        ${refundRequest.refundAmount}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowRefundModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-sm font-medium"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Request Refund
                    </button>
                  )}
                </div>
              )}
          </div>

          {/* ── Refund dialog (shadcn) ── */}
          <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
            <DialogContent className="bg-surface border-white/[0.06] rounded-xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-red-400" />
                  Request Refund
                </DialogTitle>
                <DialogDescription className="text-white/50">
                  Please explain why you&apos;re requesting a refund. The host
                  will review your request.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm text-white/50 mb-2">
                    Reason for refund
                  </label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Explain why you're requesting a refund..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/30 resize-none h-32 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Refund amount</span>
                  <span className="font-semibold text-white">
                    ${booking.amount}
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowRefundModal(false)
                      setRefundReason("")
                    }}
                    className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04] transition-all font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={requestRefund}
                    disabled={!refundReason.trim() || requestingRefund}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium text-sm transition-colors"
                  >
                    {requestingRefund ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* ── Main content ── */}
          {!canMessage ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-10 text-center">
              <AlertCircle className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/50">
                {booking.status === "completed"
                  ? "This booking has been completed."
                  : booking.status === "cancelled"
                  ? "This booking was cancelled."
                  : "Messaging will be available once the booking is confirmed."}
              </p>
            </div>
          ) : (
            <>
              {/* Tab bar */}
              <div className="flex gap-1 mb-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === "messages"
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === "schedule"
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>

              {activeTab === "messages" ? (
                /* ── Glass chat container ── */
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden flex flex-col h-[560px] max-h-[70vh]">
                  {/* Chat header */}
                  <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
                    <Avatar
                      src={
                        booking.isHost
                          ? booking.buyer.image
                          : booking.host.channelThumbnail
                      }
                      fallback={
                        booking.isHost
                          ? booking.buyer.name || booking.buyer.email
                          : booking.host.channelName
                      }
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white text-sm truncate">
                        {booking.isHost
                          ? booking.buyer.name || "Guest"
                          : booking.host.channelName}
                      </p>
                      <p className="text-xs text-white/35 truncate">
                        {booking.package.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-white/25">
                      <Clock className="w-3 h-3" />
                      Live
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                          <MessageSquare className="w-7 h-7 text-white/15" />
                        </div>
                        <p className="text-white/40 text-sm">No messages yet</p>
                        <p className="text-white/20 text-xs mt-1">
                          Say hello to start the conversation!
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isMe = msg.senderId === session?.user?.id
                        const showAvatar =
                          index === 0 ||
                          messages[index - 1].senderId !== msg.senderId
                        const isLast =
                          index === messages.length - 1 ||
                          messages[index + 1].senderId !== msg.senderId

                        return (
                          <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${
                              isMe ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            <div
                              className={`w-7 h-7 flex-shrink-0 ${
                                showAvatar ? "visible" : "invisible"
                              }`}
                            >
                              {isMe ? (
                                <Avatar
                                  src={session?.user?.image}
                                  fallback={
                                    session?.user?.name ||
                                    session?.user?.email ||
                                    "?"
                                  }
                                  size="sm"
                                />
                              ) : booking.isHost ? (
                                <Avatar
                                  src={booking.buyer.image}
                                  fallback={booking.buyer.name || "G"}
                                  size="sm"
                                />
                              ) : (
                                <Avatar
                                  src={booking.host.channelThumbnail}
                                  fallback={booking.host.channelName}
                                  size="sm"
                                />
                              )}
                            </div>

                            <div
                              className={`max-w-[70%] px-4 py-2.5 ${
                                isMe
                                  ? `bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/10 ${
                                      isLast
                                        ? "rounded-full rounded-br-lg"
                                        : "rounded-full"
                                    }`
                                  : `bg-white/[0.06] text-white border border-white/[0.06] ${
                                      isLast
                                        ? "rounded-full rounded-bl-lg"
                                        : "rounded-full"
                                    }`
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.content}
                              </p>
                              <p
                                className={`text-[10px] mt-1.5 ${
                                  isMe ? "text-white/50" : "text-white/30"
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message input */}
                  <form
                    onSubmit={sendMessage}
                    className="p-3 border-t border-white/[0.06] bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-2 bg-white/[0.04] rounded-full px-4 py-1 border border-white/[0.06] focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${otherParty?.name || "..."}`}
                        className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-white/25 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-9 h-9 flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 disabled:hover:bg-indigo-500 text-white rounded-full transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-indigo-500/20"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* ── Schedule tab ── */
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6">
                  {/* Propose date */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-medium text-white">Propose a Date</h3>
                      <div className="ml-auto">
                        <TimezoneIndicator />
                      </div>
                    </div>

                    <CalendarPicker
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      minDate={new Date()}
                    />

                    {selectedDate && (
                      <div className="mt-5 space-y-4">
                        <div>
                          <label className="block text-sm text-white/40 mb-2">
                            Purpose (optional)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Filming",
                              "Call",
                              "Meeting",
                              "Interview",
                              "Planning",
                              "Other",
                            ].map((purpose) => (
                              <button
                                key={purpose}
                                type="button"
                                onClick={() =>
                                  setSelectedPurpose(
                                    selectedPurpose === purpose ? "" : purpose
                                  )
                                }
                                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                                  selectedPurpose === purpose
                                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                    : "bg-white/[0.04] text-white/50 hover:text-white/80 border border-white/[0.06] hover:border-white/[0.12]"
                                }`}
                              >
                                {purpose}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={proposeDate}
                          disabled={proposing}
                          className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
                        >
                          {proposing ? "Proposing..." : "Propose This Date"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Proposals list */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <h3 className="font-medium text-white">
                        Proposed Dates
                      </h3>
                    </div>

                    {proposals.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-8 h-8 text-white/10 mx-auto mb-2" />
                        <p className="text-white/35 text-sm">
                          No dates proposed yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {proposals.map((proposal) => {
                          const isMyProposal =
                            proposal.proposedById === session?.user?.id
                          const isPending = proposal.status === "PENDING"
                          return (
                            <div
                              key={proposal.id}
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                proposal.status === "ACCEPTED"
                                  ? "bg-emerald-500/[0.08] border-emerald-500/20"
                                  : proposal.status === "DECLINED"
                                  ? "bg-red-500/[0.08] border-red-500/20"
                                  : "bg-white/[0.03] border-white/[0.06]"
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-white">
                                    {new Date(
                                      proposal.proposedDate
                                    ).toLocaleDateString(undefined, {
                                      weekday: "long",
                                      month: "long",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  {proposal.purpose && (
                                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-full">
                                      {proposal.purpose}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-white/40 mt-0.5">
                                  Proposed by{" "}
                                  {isMyProposal
                                    ? "you"
                                    : otherParty?.name || "them"}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 ml-4">
                                {proposal.status === "ACCEPTED" && (
                                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
                                    <CheckCircle className="w-4 h-4" />
                                    Accepted
                                  </span>
                                )}
                                {proposal.status === "DECLINED" && (
                                  <span className="text-sm font-medium text-red-400">
                                    Declined
                                  </span>
                                )}
                                {isPending && !isMyProposal && (
                                  <>
                                    <button
                                      onClick={() =>
                                        respondToProposal(
                                          proposal.id,
                                          "accept"
                                        )
                                      }
                                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        respondToProposal(
                                          proposal.id,
                                          "decline"
                                        )
                                      }
                                      className="px-3.5 py-1.5 border border-white/[0.08] hover:bg-white/[0.04] text-white/60 text-sm font-medium rounded-lg transition-colors"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}
                                {isPending && isMyProposal && (
                                  <span className="text-sm text-white/30">
                                    Awaiting response
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
