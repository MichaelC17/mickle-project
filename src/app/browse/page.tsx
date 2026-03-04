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
  if (num >= 1000) return (num / 1000).toFixed(0) + "K"
  return num.toString()
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    youtube: "bg-red-500",
    twitch: "bg-violet-500",
    tiktok: "bg-pink-500",
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  }
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide ${colors[platform] || "bg-gray-500"}`}>
      {platform}
    </span>
  )
}

function HostCard({ host }: { host: Host }) {
  const lowestPrice = Math.min(...host.packages.map(p => p.price))
  const initials = host.channelName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  
  return (
    <Link
      href={`/host/${host.id}`}
      className="group block"
    >
      {/* Image Container - Portrait ratio like Cameo */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-raised mb-3">
        {host.channelThumbnail ? (
          <img 
            src={host.channelThumbnail} 
            alt={host.channelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-purple-500/20">
            <span className="text-5xl font-bold text-text-primary/30">{initials}</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Platform Badge */}
        <div className="absolute top-3 left-3">
          <PlatformBadge platform={host.platform} />
        </div>
        
        {/* Subscriber Count Badge */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-semibold text-white">{formatNumber(host.subscriberCount)} subs</span>
        </div>
        
        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-semibold text-lg leading-tight mb-1">{host.channelName}</p>
          {host.niche && (
            <p className="text-white/80 text-sm line-clamp-1">{host.niche}</p>
          )}
        </div>
      </div>
      
      {/* Info Below Image */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-text-muted text-sm">
            {host.channelHandle ? `@${host.channelHandle.replace("@", "")}` : `${host.packages.length} packages`}
          </p>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-text-primary">5.0</span>
          </div>
        </div>
        <p className="text-text-primary font-semibold">
          From <span className="text-accent">${lowestPrice}</span>
        </p>
      </div>
    </Link>
  )
}

export default function BrowsePage() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredHosts = hosts.filter(host => 
    host.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    host.niche?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    host.platform.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const niches = [...new Set(hosts.map(h => h.niche).filter(Boolean))]

  return (
    <>
      <Header />

      <main className="min-h-screen pt-20 pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-surface to-background py-12 px-6 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary text-center mb-4">
              Find Your Perfect Collab
            </h1>
            <p className="text-text-secondary text-center text-lg mb-8 max-w-2xl mx-auto">
              Browse top creators ready to feature you on their channels
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, niche, or platform..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-full text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            {/* Niche Tags */}
            {niches.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <button
                  onClick={() => setSearchQuery("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    searchQuery === "" 
                      ? "bg-accent text-white" 
                      : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/50"
                  }`}
                >
                  All
                </button>
                {niches.slice(0, 5).map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setSearchQuery(niche || "")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      searchQuery === niche 
                        ? "bg-accent text-white" 
                        : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/50"
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            </div>
          ) : filteredHosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              {hosts.length === 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-text-primary mb-3">No hosts yet</h2>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">Be the first to become a host and start accepting bookings from creators.</p>
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-full transition-colors"
                  >
                    Become a Host
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-text-primary mb-3">No results found</h2>
                  <p className="text-text-secondary mb-6">Try adjusting your search or browse all hosts</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-accent font-medium hover:underline"
                  >
                    Clear search
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-text-secondary">
                  <span className="font-semibold text-text-primary">{filteredHosts.length}</span> creator{filteredHosts.length !== 1 ? "s" : ""} available
                </p>
              </div>
              
              {/* Grid - 4 columns on large screens like Cameo */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredHosts.map((host) => (
                  <HostCard key={host.id} host={host} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
