"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Skeleton } from "@/components/ui/skeleton"
import { PlatformBadgeSmall } from "@/components/shared/PlatformBadge"
import { AnimatedSection } from "@/components/shared/AnimatedSection"
import { formatNumber } from "@/lib/utils"
import { Search, SlidersHorizontal, Users, ArrowRight, ChevronDown } from "lucide-react"

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

type SortOption = "relevance" | "price-asc" | "price-desc" | "subscribers"

const sortLabels: Record<SortOption, string> = {
  relevance: "Relevance",
  "price-asc": "Price (low → high)",
  "price-desc": "Price (high → low)",
  subscribers: "Subscribers",
}

function sortHosts(hosts: Host[], sort: SortOption): Host[] {
  const copy = [...hosts]
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => {
        const aMin = a.packages.length ? Math.min(...a.packages.map(p => p.price)) : Infinity
        const bMin = b.packages.length ? Math.min(...b.packages.map(p => p.price)) : Infinity
        return aMin - bMin
      })
    case "price-desc":
      return copy.sort((a, b) => {
        const aMin = a.packages.length ? Math.min(...a.packages.map(p => p.price)) : 0
        const bMin = b.packages.length ? Math.min(...b.packages.map(p => p.price)) : 0
        return bMin - aMin
      })
    case "subscribers":
      return copy.sort((a, b) => b.subscriberCount - a.subscriberCount)
    default:
      return copy
  }
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden glass">
        <Skeleton className="absolute inset-0 rounded-xl" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <div className="absolute top-3 right-3">
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="pt-3 px-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
      </div>
    </div>
  )
}

function HostCard({ host }: { host: Host }) {
  const lowestPrice = host.packages.length
    ? Math.min(...host.packages.map(p => p.price))
    : null

  const initials = host.channelName
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link href={`/host/${host.id}`} className="group block">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden glass hover:shadow-float hover:-translate-y-1 transition-all duration-300">
        {host.channelThumbnail ? (
          <img
            src={host.channelThumbnail}
            alt={host.channelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 via-purple-500/10 to-pink-500/10">
            <span className="text-5xl font-bold text-text-primary/20 select-none">
              {initials}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        <div className="absolute top-3 left-3">
          <PlatformBadgeSmall platform={host.platform} />
        </div>

        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <Users className="w-3 h-3 text-white/80" />
          <span className="text-[11px] font-semibold text-white">
            {formatNumber(host.subscriberCount)}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-semibold text-lg leading-tight mb-1 drop-shadow-md">
            {host.channelName}
          </p>
          {host.niche && (
            <p className="text-white/60 text-sm line-clamp-1">{host.niche}</p>
          )}
        </div>
      </div>

      <div className="pt-3 px-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-text-muted text-sm truncate">
            {host.channelHandle
              ? `@${host.channelHandle.replace("@", "")}`
              : `${host.packages.length} package${host.packages.length !== 1 ? "s" : ""}`}
          </p>
          <span className="text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
            New
          </span>
        </div>
        {lowestPrice !== null ? (
          <p className="text-text-primary font-semibold">
            From <span className="text-accent">${lowestPrice}</span>
          </p>
        ) : (
          <p className="text-text-muted text-sm">Packages coming soon</p>
        )}
      </div>
    </Link>
  )
}

function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption
  onChange: (v: SortOption) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">{sortLabels[value]}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl glass border border-glass-border shadow-float z-50 py-1 overflow-hidden">
          {(Object.keys(sortLabels) as SortOption[]).map(key => (
            <button
              key={key}
              onClick={() => {
                onChange(key)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                value === key
                  ? "text-accent bg-accent/10 font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-raised/50"
              }`}
            >
              {sortLabels[key]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BrowsePage() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeNiche, setActiveNiche] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>("relevance")

  useEffect(() => {
    async function fetchHosts() {
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

  const filteredHosts = sortHosts(
    hosts.filter(host => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        !q ||
        host.channelName.toLowerCase().includes(q) ||
        host.niche?.toLowerCase().includes(q) ||
        host.platform.toLowerCase().includes(q)
      const matchesNiche =
        !activeNiche || host.niche?.toLowerCase() === activeNiche.toLowerCase()
      return matchesSearch && matchesNiche
    }),
    sort,
  )

  const niches = Array.from(
    new Set(hosts.map(h => h.niche).filter((n): n is string => n !== null)),
  )

  function clearFilters() {
    setSearchQuery("")
    setActiveNiche(null)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen pt-20 pb-20">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 px-6 border-b border-border">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/8 rounded-full blur-[140px]" />
            <div className="absolute top-24 right-1/4 w-[350px] h-[300px] bg-purple-500/6 rounded-full blur-[120px]" />
            <div className="absolute -top-10 left-1/4 w-[250px] h-[250px] bg-pink-500/4 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-6xl mx-auto">
            <AnimatedSection>
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary text-center mb-4 tracking-tight">
                Find Your Perfect Collab
              </h1>
              <p className="text-text-secondary text-center text-lg mb-10 max-w-2xl mx-auto">
                Browse top creators ready to feature you on their channels
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="max-w-xl mx-auto">
                <div className="relative glass rounded-xl focus-within:shadow-glow focus-within:border-accent/30 transition-all duration-300">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search by name, niche, or platform..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-text-primary placeholder-text-muted focus:outline-none rounded-xl"
                  />
                </div>
              </div>
            </AnimatedSection>

            {niches.length > 0 && (
              <AnimatedSection delay={0.2}>
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  <button
                    onClick={() => setActiveNiche(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeNiche === null
                        ? "bg-accent text-white shadow-glow"
                        : "glass text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    All
                  </button>
                  {niches.map(niche => (
                    <button
                      key={niche}
                      onClick={() =>
                        setActiveNiche(activeNiche === niche ? null : niche)
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        activeNiche === niche
                          ? "bg-accent text-white shadow-glow"
                          : "glass text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="max-w-6xl mx-auto px-6 py-10">
          {loading ? (
            <div>
              <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} index={i} />
                ))}
              </div>
            </div>
          ) : filteredHosts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-9 h-9 text-text-muted" />
              </div>

              {hosts.length === 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-text-primary mb-3">
                    Creators are coming soon
                  </h2>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    We&apos;re onboarding creators now. Join the waitlist to get
                    notified when new hosts are available.
                  </p>
                  <Link
                    href="/#waitlist"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-full transition-colors"
                  >
                    Join the Waitlist
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-text-primary mb-3">
                    No results found
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Try adjusting your search or browse all hosts
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-accent font-medium hover:underline"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <AnimatedSection>
              <div className="flex items-center justify-between mb-8">
                <p className="text-text-secondary text-sm">
                  <span className="font-semibold text-text-primary">
                    {filteredHosts.length}
                  </span>{" "}
                  creator{filteredHosts.length !== 1 ? "s" : ""} available
                </p>
                <SortDropdown value={sort} onChange={setSort} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredHosts.map(host => (
                  <HostCard key={host.id} host={host} />
                ))}
              </div>
            </AnimatedSection>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
