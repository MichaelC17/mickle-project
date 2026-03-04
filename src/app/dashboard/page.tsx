"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Booking {
  id: string;
  hostId: string;
  hostName: string;
  hostHandle: string | null;
  hostAvatar: string | null;
  platform: string;
  package: string;
  price: number;
  status: string;
  date: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-blue-500/10 text-blue-500",
    pending: "bg-yellow-500/10 text-yellow-500",
    in_progress: "bg-purple-500/10 text-purple-500",
    completed: "bg-emerald-500/10 text-emerald-500",
    cancelled: "bg-red-500/10 text-red-500",
    refunded: "bg-gray-500/10 text-gray-500",
  };

  const displayStatus = status.replace(/_/g, " ");

  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[status] || styles.pending}`}>
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const config: Record<string, { bg: string; color: string }> = {
    youtube: { bg: "bg-red-500/10", color: "text-red-500" },
    tiktok: { bg: "bg-pink-500/10", color: "text-pink-500" },
    instagram: { bg: "bg-purple-500/10", color: "text-purple-500" },
    twitch: { bg: "bg-violet-500/10", color: "text-violet-500" },
  };

  const { bg, color } = config[platform] || { bg: "bg-gray-500/10", color: "text-gray-500" };

  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${bg} ${color}`}>
      {platform}
    </span>
  );
}

interface HostProfile {
  id: string;
  channelName: string;
  channelThumbnail: string | null;
  subscriberCount: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"bookings" | "messages" | "analytics" | "settings">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null);

  const stats = {
    totalSpent: bookings.reduce((sum, b) => sum + b.price, 0),
    totalBookings: bookings.length,
    completedCollabs: bookings.filter(b => b.status === "completed").length,
    activeBookings: bookings.filter(b => b.status === "confirmed" || b.status === "in_progress").length,
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setBookingsLoading(false);
      }
    };
    
    fetchBookings();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    const fetchHostProfile = async () => {
      try {
        const res = await fetch("/api/host/create");
        if (res.ok) {
          const data = await res.json();
          if (data.host) {
            setHostProfile(data.host);
          }
        }
      } catch (error) {
        console.error("Failed to fetch host profile:", error);
      }
    };
    
    fetchHostProfile();
  }, [session?.user?.id]);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-20 pb-20 bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-surface to-background border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-1">
                  Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="text-text-secondary">Manage your bookings and track your growth</p>
              </div>
              <Link
                href="/browse"
                className="hidden sm:inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Book New Spot
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary">${stats.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-text-muted">Total Invested</p>
              </div>
              
              <div className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary">{stats.totalBookings}</p>
                <p className="text-sm text-text-muted">Total Bookings</p>
              </div>
              
              <div className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary">{stats.activeBookings}</p>
                <p className="text-sm text-text-muted">Active</p>
              </div>
              
              <div className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary">{stats.completedCollabs}</p>
                <p className="text-sm text-text-muted">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Host Profile Section */}
          {session && (
            <div className="mb-8">
              {hostProfile ? (
                <div className="bg-gradient-to-r from-surface to-accent/5 border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {hostProfile.channelThumbnail ? (
                        <img 
                          src={hostProfile.channelThumbnail} 
                          alt={hostProfile.channelName}
                          className="w-14 h-14 rounded-xl object-cover ring-2 ring-border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-xl font-bold text-white">
                          {hostProfile.channelName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-text-primary text-lg">{hostProfile.channelName}</p>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">Host</span>
                        </div>
                        <p className="text-sm text-text-muted">Your creator profile is live</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/host/${hostProfile.id}`}
                        className="text-sm text-text-secondary hover:text-text-primary font-medium px-4 py-2.5 rounded-full border border-border hover:border-accent/50 transition-all"
                      >
                        View Profile
                      </Link>
                      <Link
                        href="/dashboard/host/bookings"
                        className="text-sm text-text-primary font-medium px-4 py-2.5 rounded-full bg-surface-raised hover:bg-border transition-all"
                      >
                        Incoming Bookings
                      </Link>
                      <Link
                        href="/dashboard/host"
                        className="text-sm text-white font-semibold px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover transition-all"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                        <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-lg">Become a Host</p>
                        <p className="text-sm text-text-secondary">Monetize your audience by featuring other creators</p>
                      </div>
                    </div>
                    <Link
                      href="/apply"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      Get Started
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: "bookings", label: "My Bookings", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { id: "messages", label: "Messages", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
              { id: "analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16 bg-surface border border-border rounded-2xl">
                  <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">No bookings yet</h3>
                  <p className="text-text-secondary mb-6 max-w-md mx-auto">
                    Start your growth journey by booking a guest spot with a creator
                  </p>
                  <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-full transition-all"
                  >
                    Browse Creators
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <>
                  {bookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/booking/${booking.id}`}
                      className="group bg-surface border border-border rounded-2xl p-5 flex items-center justify-between hover:border-accent/50 hover:shadow-lg transition-all block"
                    >
                      <div className="flex items-center gap-4">
                        {booking.hostAvatar ? (
                          <img 
                            src={booking.hostAvatar} 
                            alt={booking.hostName}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-text-primary">
                            {booking.hostName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-text-primary">{booking.hostName}</p>
                            <PlatformBadge platform={booking.platform} />
                            <StatusBadge status={booking.status} />
                          </div>
                          <p className="text-sm text-text-muted">
                            {booking.package} {booking.hostHandle && `· @${booking.hostHandle.replace("@", "")}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-text-primary text-lg">${booking.price.toLocaleString()}</p>
                          <p className="text-sm text-text-muted">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}

                  <div className="text-center pt-6">
                    <Link
                      href="/browse"
                      className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Book another guest spot
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-16 bg-surface border border-border rounded-2xl">
                  <div className="w-20 h-20 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">No conversations yet</h3>
                  <p className="text-text-secondary mb-6 max-w-md mx-auto">
                    Book a creator to start chatting and coordinate your collaboration
                  </p>
                  <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-full transition-all"
                  >
                    Find Creators
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-sm text-text-muted mb-4">Click on a booking to open the chat</p>
                  {bookings
                    .filter(b => b.status === "confirmed" || b.status === "in_progress")
                    .map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/booking/${booking.id}`}
                      className="group bg-surface border border-border rounded-2xl p-5 flex items-center justify-between hover:border-accent/50 hover:shadow-lg transition-all block"
                    >
                      <div className="flex items-center gap-4">
                        {booking.hostAvatar ? (
                          <img 
                            src={booking.hostAvatar} 
                            alt={booking.hostName}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-text-primary">
                            {booking.hostName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-text-primary">{booking.hostName}</p>
                            <StatusBadge status={booking.status} />
                          </div>
                          <p className="text-sm text-text-muted">{booking.package}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-accent group-hover:text-accent-hover">
                        <span className="text-sm font-medium">Open Chat</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                  {bookings.filter(b => b.status === "confirmed" || b.status === "in_progress").length === 0 && (
                    <div className="text-center py-12 bg-surface border border-border rounded-2xl">
                      <p className="text-text-muted font-medium">No active conversations</p>
                      <p className="text-sm text-text-secondary mt-1">Chat becomes available once you have a confirmed booking</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Analytics Coming Soon</h3>
              <p className="text-text-secondary max-w-md mx-auto">
                Track your subscriber growth, view performance, and measure ROI from all your guest spot bookings in one place.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-text-primary text-lg mb-6">Profile</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-muted mb-2 font-medium">Display Name</label>
                    <input
                      type="text"
                      defaultValue={session?.user?.name || ""}
                      placeholder="Your name"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-muted mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      defaultValue={session?.user?.email || ""}
                      placeholder="you@example.com"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-text-primary text-lg mb-6">Connected Channels</h3>
                <div className="space-y-3">
                  {[
                    { name: "YouTube", color: "text-red-500", bg: "bg-red-500/10" },
                    { name: "Twitch", color: "text-violet-500", bg: "bg-violet-500/10" },
                    { name: "TikTok", color: "text-pink-500", bg: "bg-pink-500/10" },
                  ].map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between p-4 bg-background rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${platform.bg} flex items-center justify-center ${platform.color}`}>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            {platform.name === "YouTube" && (
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            )}
                            {platform.name === "Twitch" && (
                              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                            )}
                            {platform.name === "TikTok" && (
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            )}
                          </svg>
                        </div>
                        <span className="font-medium text-text-primary">{platform.name}</span>
                      </div>
                      <button className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-text-primary text-lg mb-6">Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: "Email notifications for new bookings", checked: true },
                    { label: "Email when guest spot goes live", checked: true },
                    { label: "Weekly performance reports", checked: false },
                  ].map((item, i) => (
                    <label key={i} className="flex items-center justify-between cursor-pointer group">
                      <span className="text-text-secondary group-hover:text-text-primary transition-colors">{item.label}</span>
                      <div className="relative">
                        <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-raised rounded-full peer peer-checked:bg-accent transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-accent/20">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
