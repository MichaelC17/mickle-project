"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface BookingDetails {
  id: string
  hostName: string
  hostThumbnail: string | null
  packageName: string
  amount: number
  status: string
  createdAt: string
}

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
          <div className="max-w-lg mx-auto text-center">
            <div className="animate-spin w-12 h-12 border-3 border-accent border-t-transparent rounded-full mx-auto mb-6" />
            <h1 className="text-2xl font-semibold text-text-primary mb-2">Processing Payment...</h1>
            <p className="text-text-secondary">Please wait while we confirm your booking.</p>
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
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-semibold text-text-primary mb-2">Booking Confirmed!</h1>
            <p className="text-text-secondary mb-6">
              Your guest spot has been booked successfully.
            </p>

            {booking ? (
              <div className="bg-background border border-border rounded-lg p-4 mb-6 text-left">
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
              </div>
            ) : error ? (
              <p className="text-text-muted text-sm mb-6">{error}</p>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard"
                className="flex-1 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-md transition-colors text-center"
              >
                View Dashboard
              </Link>
              <Link
                href="/browse"
                className="flex-1 bg-surface-raised hover:bg-border text-text-primary font-medium px-6 py-3 rounded-md transition-colors text-center"
              >
                Browse More Hosts
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-text-muted mt-6">
            You&apos;ll receive an email confirmation shortly. The host will reach out to coordinate your collaboration.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
