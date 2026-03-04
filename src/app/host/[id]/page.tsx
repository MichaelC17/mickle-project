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
  if (num >= 1000) return (num / 1000).toFixed(0) + "K"
  return num.toString()
}

function PlatformBadge({ platform }: { platform: string }) {
  const config: Record<string, { bg: string; icon: JSX.Element }> = {
    youtube: {
      bg: "bg-red-500",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    twitch: {
      bg: "bg-violet-500",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      ),
    },
    tiktok: {
      bg: "bg-pink-500",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
    },
    instagram: {
      bg: "bg-gradient-to-r from-purple-500 to-pink-500",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      ),
    },
  }

  const { bg, icon } = config[platform] || { bg: "bg-gray-500", icon: null }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-medium ${bg}`}>
      {icon}
      <span className="capitalize">{platform}</span>
    </span>
  )
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
        <main className="min-h-screen pt-20 pb-20 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
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
        <main className="min-h-screen pt-20 pb-20 px-6">
          <div className="max-w-6xl mx-auto text-center py-20">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Host not found</h1>
            <Link href="/browse" className="text-accent hover:underline">
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
  const lowestPrice = Math.min(...host.packages.map(p => p.price))

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
          packageId: currentPackage.id,
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

      <main className="min-h-screen pt-20 pb-20">
        {/* Hero Section with Large Image */}
        <div className="bg-gradient-to-b from-surface to-background">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <Link href="/browse" className="text-sm text-text-muted hover:text-text-primary mb-6 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to browse
            </Link>

            <div className="grid lg:grid-cols-2 gap-10 items-start mt-4">
              {/* Large Profile Image */}
              <div className="relative aspect-square max-w-md mx-auto lg:mx-0 w-full rounded-3xl overflow-hidden bg-surface-raised shadow-2xl">
                {host.channelThumbnail ? (
                  <img 
                    src={host.channelThumbnail} 
                    alt={host.channelName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-purple-500/20">
                    <span className="text-8xl font-bold text-text-primary/20">{initials}</span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-semibold text-sm">5.0</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white font-semibold text-sm">{formatNumber(host.subscriberCount)} subs</span>
                  </div>
                </div>
              </div>

              {/* Host Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <PlatformBadge platform={host.platform} />
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium">
                    Verified
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">
                  {host.channelName}
                </h1>
                
                {host.channelHandle && (
                  <p className="text-text-muted text-lg mb-4">@{host.channelHandle.replace("@", "")}</p>
                )}

                {host.niche && (
                  <p className="text-xl text-text-secondary mb-6">{host.niche}</p>
                )}

                {host.bio && (
                  <p className="text-text-secondary leading-relaxed mb-6 text-lg">{host.bio}</p>
                )}

                <div className="flex items-center gap-6 mb-8">
                  <div>
                    <p className="text-3xl font-bold text-text-primary">{formatNumber(host.subscriberCount)}</p>
                    <p className="text-text-muted text-sm">Subscribers</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="text-3xl font-bold text-text-primary">{host.packages.length}</p>
                    <p className="text-text-muted text-sm">Packages</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="text-3xl font-bold text-accent">${lowestPrice}+</p>
                    <p className="text-text-muted text-sm">Starting at</p>
                  </div>
                </div>

                {host.channelUrl && (
                  <a 
                    href={host.channelUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-full text-text-primary font-medium hover:border-accent/50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    View Channel
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Packages Section */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Choose a Package</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {host.packages.map((pkg, index) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(index)}
                className={`text-left p-6 rounded-2xl border-2 transition-all ${
                  selectedPackage === index
                    ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                    : "border-border bg-surface hover:border-accent/50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-text-primary">{pkg.name}</h3>
                  {selectedPackage === index && (
                    <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
                
                <p className="text-3xl font-bold text-accent mb-4">${pkg.price.toLocaleString()}</p>
                
                {pkg.description && (
                  <p className="text-text-secondary mb-4">{pkg.description}</p>
                )}
                
                {pkg.includes.length > 0 && (
                  <ul className="space-y-2">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                        <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            ))}
          </div>

          {/* Checkout Card */}
          <div className="mt-10 bg-surface border border-border rounded-2xl p-8 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-text-muted text-sm">Selected package</p>
                <p className="text-xl font-bold text-text-primary">{currentPackage.name}</p>
              </div>
              <p className="text-3xl font-bold text-accent">${currentPackage.price.toLocaleString()}</p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full text-lg transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              {isCheckoutLoading ? "Processing..." : "Continue to Payment"}
            </button>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure checkout
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Money-back guarantee
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
