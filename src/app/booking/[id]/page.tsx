"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CalendarPicker from "@/components/CalendarPicker"

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
  const [selectedPurpose, setSelectedPurpose] = useState("")
  const [proposing, setProposing] = useState(false)
  const [activeTab, setActiveTab] = useState<"messages" | "schedule">("messages")
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
        setSelectedPurpose("")
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

  const otherParty = booking?.isHost ? booking.buyer : booking?.host.user

  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-text-muted">Booking not found</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const canMessage = !["completed", "cancelled", "refunded", "pending"].includes(booking.status)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-secondary mb-4 inline-block">
            ← Back to Dashboard
          </Link>

          {/* Booking Header */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {booking.isHost ? (
                  booking.buyer.image ? (
                    <img src={booking.buyer.image} alt="" className="w-14 h-14 rounded-full" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-surface-raised flex items-center justify-center text-xl font-medium text-text-primary">
                      {(booking.buyer.name || booking.buyer.email)[0].toUpperCase()}
                    </div>
                  )
                ) : (
                  booking.host.channelThumbnail ? (
                    <img src={booking.host.channelThumbnail} alt="" className="w-14 h-14 rounded-full" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-surface-raised flex items-center justify-center text-xl font-medium text-text-primary">
                      {booking.host.channelName[0].toUpperCase()}
                    </div>
                  )
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-semibold text-text-primary">
                      {booking.isHost ? `Booking from ${booking.buyer.name || "Guest"}` : `Booking with ${booking.host.channelName}`}
                    </h1>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-text-secondary">{booking.package.name} · ${booking.amount}</p>
                  <p className="text-sm text-text-muted mt-1">
                    Booked {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {booking.scheduledDate && (
                <div className="text-right">
                  <p className="text-sm text-text-muted">Scheduled for</p>
                  <p className="text-lg font-semibold text-emerald-500">
                    {new Date(booking.scheduledDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {!canMessage ? (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <p className="text-text-muted">
                {booking.status === "completed" 
                  ? "This booking has been completed." 
                  : booking.status === "cancelled"
                  ? "This booking was cancelled."
                  : "Messaging will be available once the booking is confirmed."}
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-1 mb-4 bg-surface border border-border rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "messages"
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "schedule"
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Schedule
                </button>
              </div>

              {activeTab === "messages" ? (
                <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: "480px" }}>
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-border bg-surface-raised/50 flex items-center gap-3">
                    {booking.isHost ? (
                      booking.buyer.image ? (
                        <img src={booking.buyer.image} alt="" className="w-9 h-9 rounded-full" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {(booking.buyer.name || booking.buyer.email)[0].toUpperCase()}
                        </div>
                      )
                    ) : (
                      booking.host.channelThumbnail ? (
                        <img src={booking.host.channelThumbnail} alt="" className="w-9 h-9 rounded-full" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {booking.host.channelName[0].toUpperCase()}
                        </div>
                      )
                    )}
                    <div>
                      <p className="font-medium text-text-primary text-sm">
                        {booking.isHost ? (booking.buyer.name || "Guest") : booking.host.channelName}
                      </p>
                      <p className="text-xs text-text-muted">{booking.package.name}</p>
                    </div>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-surface to-surface-raised/30">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center mb-3">
                          <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-text-muted text-sm">No messages yet</p>
                        <p className="text-text-muted/60 text-xs mt-1">Say hello to start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isMe = msg.senderId === session?.user?.id
                        const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId
                        const isLast = index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId
                        
                        return (
                          <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                          >
                            {/* Avatar */}
                            <div className={`w-7 h-7 flex-shrink-0 ${showAvatar ? "visible" : "invisible"}`}>
                              {isMe ? (
                                session?.user?.image ? (
                                  <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium">
                                    {(session?.user?.name || session?.user?.email || "?")[0].toUpperCase()}
                                  </div>
                                )
                              ) : (
                                booking.isHost ? (
                                  booking.buyer.image ? (
                                    <img src={booking.buyer.image} alt="" className="w-7 h-7 rounded-full" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-surface-raised flex items-center justify-center text-text-primary text-xs font-medium">
                                      {(booking.buyer.name || "G")[0].toUpperCase()}
                                    </div>
                                  )
                                ) : (
                                  booking.host.channelThumbnail ? (
                                    <img src={booking.host.channelThumbnail} alt="" className="w-7 h-7 rounded-full" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-surface-raised flex items-center justify-center text-text-primary text-xs font-medium">
                                      {booking.host.channelName[0].toUpperCase()}
                                    </div>
                                  )
                                )
                              )}
                            </div>
                            
                            {/* Message Bubble */}
                            <div
                              className={`max-w-[70%] px-4 py-2.5 ${
                                isMe
                                  ? `bg-gradient-to-br from-accent to-accent-hover text-white shadow-md ${isLast ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
                                  : `bg-surface-raised text-text-primary shadow-sm border border-border/50 ${isLast ? "rounded-2xl rounded-bl-md" : "rounded-2xl"}`
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <p className={`text-[10px] mt-1.5 ${isMe ? "text-white/60" : "text-text-muted"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="p-3 border-t border-border bg-surface">
                    <div className="flex items-center gap-2 bg-surface-raised rounded-full px-4 py-1 border border-border focus-within:border-accent transition-colors">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${otherParty?.name || "..."}`}
                        className="flex-1 bg-transparent py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-9 h-9 flex items-center justify-center bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent text-white rounded-full transition-all hover:scale-105 disabled:hover:scale-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-xl p-6">
                  {/* Propose Date */}
                  <div className="mb-6">
                    <h3 className="font-medium text-text-primary mb-3">Propose a Date</h3>
                    <CalendarPicker
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      minDate={new Date()}
                    />
                    {selectedDate && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm text-text-muted mb-2">Purpose (optional)</label>
                          <div className="flex flex-wrap gap-2">
                            {["Filming", "Call", "Meeting", "Interview", "Planning", "Other"].map((purpose) => (
                              <button
                                key={purpose}
                                type="button"
                                onClick={() => setSelectedPurpose(selectedPurpose === purpose ? "" : purpose)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                  selectedPurpose === purpose
                                    ? "bg-accent text-white"
                                    : "bg-surface-raised text-text-secondary hover:text-text-primary"
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
                          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                          {proposing ? "Proposing..." : "Propose This Date"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Proposals List */}
                  <div>
                    <h3 className="font-medium text-text-primary mb-3">Proposed Dates</h3>
                    {proposals.length === 0 ? (
                      <p className="text-text-muted text-sm">No dates proposed yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {proposals.map((proposal) => {
                          const isMyProposal = proposal.proposedById === session?.user?.id
                          const isPending = proposal.status === "PENDING"
                          return (
                            <div
                              key={proposal.id}
                              className={`flex items-center justify-between p-4 rounded-lg border ${
                                proposal.status === "ACCEPTED"
                                  ? "bg-emerald-500/10 border-emerald-500/30"
                                  : proposal.status === "DECLINED"
                                  ? "bg-red-500/10 border-red-500/30"
                                  : "bg-surface-raised border-border"
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-text-primary">
                                    {new Date(proposal.proposedDate).toLocaleDateString(undefined, {
                                      weekday: "long",
                                      month: "long",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  {proposal.purpose && (
                                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-full">
                                      {proposal.purpose}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-text-muted">
                                  Proposed by {isMyProposal ? "you" : otherParty?.name || "them"}
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                {proposal.status === "ACCEPTED" && (
                                  <span className="text-sm font-medium text-emerald-500">Accepted</span>
                                )}
                                {proposal.status === "DECLINED" && (
                                  <span className="text-sm font-medium text-red-500">Declined</span>
                                )}
                                {isPending && !isMyProposal && (
                                  <>
                                    <button
                                      onClick={() => respondToProposal(proposal.id, "accept")}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => respondToProposal(proposal.id, "decline")}
                                      className="px-3 py-1.5 bg-surface border border-border hover:bg-border text-text-secondary text-sm font-medium rounded-md transition-colors"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}
                                {isPending && isMyProposal && (
                                  <span className="text-sm text-text-muted">Awaiting response</span>
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
