"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Clock, MessageSquare, TrendingUp } from "lucide-react"

interface BookingDetails {
  id: string
  hostName: string
  hostThumbnail: string | null
  packageName: string
  amount: number
  status: string
  createdAt: string
}

const nextSteps = [
  {
    icon: Clock,
    step: "1",
    text: "The host will reach out within 48 hours",
  },
  {
    icon: MessageSquare,
    step: "2",
    text: "Coordinate your guest spot via in-app messaging",
  },
  {
    icon: TrendingUp,
    step: "3",
    text: "Track results in your dashboard once it goes live",
  },
]

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/by-session?session_id=${sessionId}`)
        if (res.ok) {
          const data = await res.json()
          setBooking(data.booking)
        } else {
          setError("Could not find booking details")
        }
      } catch (err) {
        setError("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchBooking, 1500)
    return () => clearTimeout(timer)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-lg mx-auto">
            <div className="bg-surface border border-border rounded-lg p-8">
              <div className="flex flex-col items-center gap-4 mb-8">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-64" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
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
        <div className="max-w-lg mx-auto">
          <div className="bg-surface border border-border rounded-lg p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl font-semibold text-text-primary mb-2">Booking Confirmed!</h1>
              <p className="text-text-secondary">
                You&apos;ve taken a big step for your channel.
              </p>
            </motion.div>

            {booking ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="bg-background border border-border rounded-lg p-4 mt-6 text-left"
              >
                <div className="flex items-center gap-3 mb-4">
                  {booking.hostThumbnail ? (
                    <img
                      src={booking.hostThumbnail}
                      alt={booking.hostName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-lg font-medium text-text-primary">
                      {booking.hostName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-text-primary">{booking.hostName}</p>
                    <p className="text-sm text-text-muted">{booking.packageName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Amount paid</span>
                  <span className="font-semibold text-text-primary">${booking.amount}</span>
                </div>
              </motion.div>
            ) : error ? (
              <p className="text-text-muted text-sm mt-6">{error}</p>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-left"
            >
              <p className="text-sm font-medium text-text-secondary mb-4">Here&apos;s what happens next:</p>
              <div className="space-y-3">
                {nextSteps.map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-sm text-text-secondary pt-1.5">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="flex flex-col sm:flex-row gap-3 mt-8"
            >
              <Link
                href="/dashboard"
                className="flex-1 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center gap-2"
              >
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/browse"
                className="flex-1 bg-surface-raised hover:bg-border text-text-primary font-medium px-6 py-3 rounded-md transition-colors text-center"
              >
                Browse More Hosts
              </Link>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center text-sm text-text-muted mt-6"
          >
            You&apos;ll receive an email confirmation shortly.
          </motion.p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-lg mx-auto">
            <div className="bg-surface border border-border rounded-lg p-8">
              <div className="flex flex-col items-center gap-4 mb-8">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
