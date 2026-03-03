"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
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

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "youtube":
      return (
        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case "twitch":
      return (
        <svg className="w-5 h-5 text-violet-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      )
    case "tiktok":
      return (
        <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    case "instagram":
      return (
        <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      )
    default:
      return null
  }
}

export default function HostProfilePage() {
  const params = useParams()
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

    if (params.id) {
      fetchHost()
    }
  }, [params.id])

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-20 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!host) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-semibold text-text-primary">Host not found</h1>
            <Link href="/browse" className="text-accent mt-4 inline-block">
              ← Back to browse
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const currentPackage = host.packages[selectedPackage]
  const initials = host.channelName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  const handleCheckout = async () => {
    setIsCheckoutLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostId: host.id,
          hostName: host.channelName,
          packageName: currentPackage.name,
          price: currentPackage.price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Payment failed")
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/browse" className="text-sm text-text-muted hover:text-text-secondary mb-6 inline-flex items-center gap-1">
            ← Back to browse
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-2">
              <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  {host.channelThumbnail ? (
                    <img 
                      src={host.channelThumbnail} 
                      alt={host.channelName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-surface-raised flex items-center justify-center text-2xl font-medium text-text-primary">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-semibold text-text-primary">{host.channelName}</h1>
                      <PlatformIcon platform={host.platform} />
                    </div>
                    <p className="text-text-muted">
                      {host.channelHandle ? `@${host.channelHandle.replace("@", "")}` : ""} · {formatNumber(host.subscriberCount)} subscribers
                    </p>
                    {host.niche && (
                      <p className="text-sm text-text-secondary mt-1">{host.niche}</p>
                    )}
                  </div>
                </div>
                {host.bio && (
                  <p className="text-text-secondary mt-4 leading-relaxed">{host.bio}</p>
                )}
                
                {host.channelUrl && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <a 
                      href={host.channelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:text-accent-hover"
                    >
                      View YouTube Channel →
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-text-primary">Performance Analytics</h2>
                  <span className="text-xs text-text-muted bg-surface-raised px-2 py-1 rounded">Coming soon</span>
                </div>
                <p className="text-sm text-text-muted mb-4">Analytics will be available once this host completes their first booking.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1">Avg sub growth</p>
                    <p className="text-xl font-semibold text-text-muted">—</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1">Avg view growth</p>
                    <p className="text-xl font-semibold text-text-muted">—</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1">Cost per sub</p>
                    <p className="text-xl font-semibold text-text-muted">—</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-xs text-text-muted mb-1">Completed spots</p>
                    <p className="text-xl font-semibold text-text-muted">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="font-semibold text-text-primary mb-4">Select a Package</h2>
                
                <div className="space-y-3">
                  {host.packages.map((pkg, index) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedPackage === index
                          ? "border-accent bg-accent/5"
                          : "border-border bg-background hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-text-primary">{pkg.name}</h3>
                        <p className="font-semibold text-text-primary">${pkg.price.toLocaleString()}</p>
                      </div>
                      {pkg.description && (
                        <p className="text-sm text-text-secondary mb-3">{pkg.description}</p>
                      )}
                      
                      {pkg.includes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {pkg.includes.map((item, i) => (
                            <span
                              key={i}
                              className="text-xs bg-surface-raised px-2 py-1 rounded text-text-muted"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-semibold text-text-primary mb-4">Book This Host</h2>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary">Package</span>
                    <span className="text-text-primary font-medium">{currentPackage.name}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary">Price</span>
                    <span className="text-text-primary font-medium">${currentPackage.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Platform fee</span>
                    <span className="text-text-muted">$0</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-primary">Total</span>
                    <span className="text-xl font-semibold text-text-primary">
                      ${currentPackage.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
                >
                  {isCheckoutLoading ? "Processing..." : "Continue to Payment"}
                </button>

                <p className="text-xs text-text-muted text-center mt-4">
                  Payment is held until the guest spot is delivered and confirmed.
                </p>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Verified creator
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Secure payment
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Money-back guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
