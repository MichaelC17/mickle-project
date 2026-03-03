"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
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
        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case "twitch":
      return (
        <svg className="w-4 h-4 text-violet-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      )
    case "tiktok":
      return (
        <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    case "instagram":
      return (
        <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      )
    default:
      return null
  }
}

function HostCard({ host }: { host: Host }) {
  const lowestPrice = Math.min(...host.packages.map(p => p.price))
  const highestPrice = Math.max(...host.packages.map(p => p.price))
  const initials = host.channelName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  
  return (
    <Link
      href={`/host/${host.id}`}
      className="block bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {host.channelThumbnail ? (
            <img 
              src={host.channelThumbnail} 
              alt={host.channelName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-lg font-medium text-text-primary">
              {initials}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-text-primary">{host.channelName}</h2>
              <PlatformIcon platform={host.platform} />
            </div>
            <p className="text-sm text-text-muted">
              {host.channelHandle ? `@${host.channelHandle.replace("@", "")}` : ""} · {formatNumber(host.subscriberCount)} subscribers
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-text-primary">
            ${lowestPrice.toLocaleString()}
            {lowestPrice !== highestPrice && <span className="text-sm text-text-muted">–${highestPrice.toLocaleString()}</span>}
          </p>
          <p className="text-xs text-text-muted">per booking</p>
        </div>
      </div>

      {host.niche && (
        <p className="text-sm text-text-secondary mb-4">{host.niche}</p>
      )}

      <div className="grid grid-cols-3 gap-4 p-4 bg-background rounded-lg">
        <div>
          <p className="text-xs text-text-muted mb-1">Followers</p>
          <p className="text-sm font-semibold text-text-primary">{formatNumber(host.subscriberCount)}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-1">Packages</p>
          <p className="text-sm font-semibold text-text-primary">{host.packages.length}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-1">Platform</p>
          <p className="text-sm font-semibold text-text-primary capitalize">{host.platform}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {host.packages.length} package{host.packages.length !== 1 ? "s" : ""} available
        </span>
        <span className="text-sm text-accent font-medium">
          View profile →
        </span>
      </div>
    </Link>
  )
}

export default function BrowsePage() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await fetch("/api/hosts")
        if (res.ok) {
          const data = await res.json()
          setHosts(data.hosts || [])
        }
      } catch (error) {
        console.error("Failed to fetch hosts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHosts()
  }, [])

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Link href="/" className="text-sm text-text-muted hover:text-text-secondary mb-4 inline-flex items-center gap-1">
              ← Back to home
            </Link>
            <h1 className="text-3xl font-semibold text-text-primary mt-4">
              Browse Host Creators
            </h1>
            <p className="text-text-secondary mt-2">
              Find creators to book guest spots with.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          ) : hosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">No hosts yet</h2>
              <p className="text-text-secondary mb-6">Be the first to become a host and start accepting bookings.</p>
              <Link
                href="/apply"
                className="inline-block bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Become a Host
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {hosts.map((host) => (
                <HostCard key={host.id} host={host} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
