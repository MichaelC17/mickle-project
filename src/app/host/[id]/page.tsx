"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Skeleton } from "@/components/ui/skeleton"
import { PlatformBadgeSolid } from "@/components/shared/PlatformBadge"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { formatNumber } from "@/lib/utils"
import { useToast } from "@/context/ToastContext"
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Shield,
  CreditCard,
  CheckCircle,
  ChevronRight,
  Clock,
  Users,
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
  channelUrl: string | null
  subscriberCount: number
  platform: string
  niche: string | null
  bio: string | null
  packages: Package[]
  user: {
    name: string | null
    image: string | null
  }
}

function HostSkeleton() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Skeleton className="h-4 w-28 mb-8 rounded" />

          <div className="grid lg:grid-cols-[1fr_380px] gap-10">
            <div>
              <div className="flex flex-col sm:flex-row gap-8 mb-12">
                <Skeleton className="w-full sm:w-64 aspect-square rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-4 pt-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <div className="flex gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-1">
                        <Skeleton className="h-7 w-16" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-36 rounded-full" />
                </div>
              </div>

              <Skeleton className="h-7 w-44 mb-5" />
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-56 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-80 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function HostProfilePage() {
  const params = useParams()
  const { showToast } = useToast()
  const [host, setHost] = useState<Host | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<number>(0)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const res = await fetch(`/api/hosts/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setHost(data.host)
        }
      } catch (error) {
        console.error("Failed to fetch host:", error)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) fetchHost()
  }, [params.id])

  if (loading) return <HostSkeleton />

  if (!host) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-raised mb-6">
              <Users className="w-7 h-7 text-text-muted" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-3">
              Host not found
            </h1>
            <p className="text-text-muted mb-6">
              This host may have been removed or doesn&apos;t exist.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to browse
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const currentPackage = host.packages[selectedPackage]
  const initials = host.channelName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const lowestPrice = Math.min(...host.packages.map((p) => p.price))

  const handleCheckout = async () => {
    setIsCheckoutLoading(true)
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostId: host.id,
          hostName: host.channelName,
          packageId: currentPackage.id,
          packageName: currentPackage.name,
          price: currentPackage.price,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Payment failed")
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      showToast({
        type: "error",
        title: "Checkout failed",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  const packageCols =
    host.packages.length >= 3
      ? "md:grid-cols-3"
      : host.packages.length === 2
        ? "md:grid-cols-2 max-w-2xl"
        : "max-w-md"

  return (
    <>
      <Header />

      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <AnimatedSection>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to browse
            </Link>
          </AnimatedSection>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left column */}
            <div>
              <AnimatedSection>
                <div className="flex flex-col sm:flex-row gap-8 mb-12">
                  <div className="relative w-full sm:w-64 aspect-square flex-shrink-0 rounded-2xl overflow-hidden bg-surface-raised shadow-float ring-1 ring-glass-border">
                    {host.channelThumbnail ? (
                      <img
                        src={host.channelThumbnail}
                        alt={host.channelName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-purple-500/20">
                        <span className="text-6xl font-bold text-text-primary/20">
                          {initials}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold text-xs">
                          5.0
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <Users className="w-3.5 h-3.5 text-white/70" />
                        <span className="text-white font-semibold text-xs">
                          {formatNumber(host.subscriberCount)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <PlatformBadgeSolid platform={host.platform} />
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-display text-text-primary mb-1 leading-tight">
                      {host.channelName}
                    </h1>

                    {host.channelHandle && (
                      <p className="text-text-muted text-sm mb-3">
                        @{host.channelHandle.replace("@", "")}
                      </p>
                    )}

                    {host.niche && (
                      <p className="text-accent font-medium text-sm mb-3">
                        {host.niche}
                      </p>
                    )}

                    {host.bio && (
                      <p className="text-text-secondary text-sm leading-relaxed mb-5 line-clamp-3">
                        {host.bio}
                      </p>
                    )}

                    <div className="flex items-center gap-5">
                      <div>
                        <p className="text-xl font-bold text-text-primary">
                          {formatNumber(host.subscriberCount)}
                        </p>
                        <p className="text-text-muted text-xs">Subscribers</p>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div>
                        <p className="text-xl font-bold text-text-primary">
                          {host.packages.length}
                        </p>
                        <p className="text-text-muted text-xs">Packages</p>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div>
                        <p className="text-xl font-bold text-accent">
                          ${lowestPrice}+
                        </p>
                        <p className="text-text-muted text-xs">Starting at</p>
                      </div>
                    </div>

                    {host.channelUrl && (
                      <a
                        href={host.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full border border-border text-sm font-medium text-text-primary hover:border-accent/50 hover:text-accent transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Channel
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <h2 className="text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
                  Choose a Package
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </h2>

                <div className={`grid gap-4 ${packageCols}`}>
                  {host.packages.map((pkg, index) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(index)}
                      className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                        selectedPackage === index
                          ? "border-accent shadow-glow bg-accent/5 scale-[1.01]"
                          : "border-border bg-surface hover:border-accent/30 hover:bg-surface-raised"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-text-primary">
                          {pkg.name}
                        </h3>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selectedPackage === index
                              ? "border-accent bg-accent"
                              : "border-border"
                          }`}
                        >
                          {selectedPackage === index && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>

                      <p className="text-2xl font-bold text-accent mb-3">
                        ${pkg.price.toLocaleString()}
                      </p>

                      {pkg.description && (
                        <p className="text-text-secondary text-sm mb-3 leading-relaxed">
                          {pkg.description}
                        </p>
                      )}

                      {pkg.includes.length > 0 && (
                        <ul className="space-y-1.5">
                          {pkg.includes.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-text-secondary"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Right column: sticky checkout */}
            <div className="lg:sticky lg:top-24">
              <AnimatedSection delay={0.15}>
                <div className="glass rounded-xl shadow-float p-6">
                  <div className="mb-5">
                    <p className="text-text-muted text-xs uppercase tracking-wide font-medium mb-1">
                      Selected package
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-lg font-bold text-text-primary truncate">
                        {currentPackage.name}
                      </p>
                      <p className="text-2xl font-bold text-accent flex-shrink-0">
                        ${currentPackage.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {currentPackage.includes.length > 0 && (
                    <div className="border-t border-glass-border pt-4 mb-5">
                      <p className="text-xs text-text-muted uppercase tracking-wide font-medium mb-2.5">
                        Includes
                      </p>
                      <ul className="space-y-2">
                        {currentPackage.includes.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-full text-base transition-all hover:shadow-glow flex items-center justify-center gap-2"
                  >
                    {isCheckoutLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing&hellip;
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Continue to Payment
                      </>
                    )}
                  </button>

                  <p className="text-xs text-text-muted text-center mt-4 leading-relaxed px-2">
                    After payment, you&apos;ll be connected with{" "}
                    <span className="text-text-secondary font-medium">
                      {host.channelName}
                    </span>{" "}
                    to coordinate your guest spot via in-app messaging. Full
                    refund if undelivered.
                  </p>

                  <div className="border-t border-glass-border mt-4 pt-4 space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Secure checkout</span>
                      <span className="text-border mx-0.5">&middot;</span>
                      <span>Powered by Stripe</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>
                        Full refund if the guest spot isn&apos;t delivered
                        within 30 days
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
