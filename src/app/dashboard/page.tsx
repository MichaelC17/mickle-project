"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PlatformBadgeSubtle } from "@/components/shared/PlatformBadge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { formatNumber } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import {
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  Plus,
  MessageSquare,
  Settings,
  ChevronRight,
} from "lucide-react";

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

interface HostProfile {
  id: string;
  channelName: string;
  channelThumbnail: string | null;
  subscriberCount: number;
}

type Tab = "bookings" | "messages" | "settings";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "bookings", label: "My Bookings", icon: <Calendar className="w-4 h-4" /> },
  { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

const statCards = [
  { key: "totalSpent", label: "Total Spent", icon: DollarSign, color: "text-indigo-400", border: "border-l-indigo-400", bg: "bg-indigo-500/10" },
  { key: "totalBookings", label: "Total Bookings", icon: Calendar, color: "text-purple-400", border: "border-l-purple-400", bg: "bg-purple-500/10" },
  { key: "activeBookings", label: "Active", icon: Clock, color: "text-amber-400", border: "border-l-amber-400", bg: "bg-amber-500/10" },
  { key: "completedCollabs", label: "Completed", icon: CheckCircle, color: "text-emerald-400", border: "border-l-emerald-400", bg: "bg-emerald-500/10" },
] as const;

function StatCardSkeleton() {
  return (
    <div className="bg-surface/60 backdrop-blur-sm border border-border border-l-4 border-l-border rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-20 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

function BookingCardSkeleton() {
  return (
    <div className="bg-surface/60 backdrop-blur-sm border border-border rounded-xl p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div>
          <Skeleton className="h-5 w-36 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <Skeleton className="h-6 w-16 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null);
  const [notifications, setNotifications] = useState({
    newBookings: true,
    goLive: true,
    weeklyReports: false,
  });

  const stats = {
    totalSpent: bookings.reduce((sum, b) => sum + b.price, 0),
    totalBookings: bookings.length,
    completedCollabs: bookings.filter((b) => b.status === "completed").length,
    activeBookings: bookings.filter(
      (b) => b.status === "confirmed" || b.status === "in_progress"
    ).length,
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
          if (data.host) setHostProfile(data.host);
        }
      } catch (error) {
        console.error("Failed to fetch host profile:", error);
      }
    };

    fetchHostProfile();
  }, [session?.user?.id]);

  const formatStat = (key: string) => {
    const val = stats[key as keyof typeof stats];
    if (key === "totalSpent") return `$${formatNumber(val)}`;
    return val.toString();
  };

  const activeConversations = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "in_progress"
  );

  return (
    <>
      <Header />

      <main className="min-h-screen pt-20 pb-20 bg-background">
        {/* Hero header */}
        <div className="bg-gradient-to-b from-surface to-background border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <AnimatedSection>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-1">
                    Welcome back
                    {session?.user?.name
                      ? `, ${session.user.name.split(" ")[0]}`
                      : ""}
                  </h1>
                  <p className="text-text-secondary">
                    Manage your bookings and collaborations
                  </p>
                </div>
                <Link
                  href="/browse"
                  className="hidden sm:inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-accent/20"
                >
                  <Plus className="w-4 h-4" />
                  Book New Spot
                </Link>
              </div>
            </AnimatedSection>

            {/* Stat cards */}
            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bookingsLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <StatCardSkeleton key={i} />
                    ))
                  : statCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.key}
                          className={`bg-surface/60 backdrop-blur-sm border border-border ${card.border} border-l-4 rounded-xl p-5 transition-all hover:bg-surface/80`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}
                            >
                              <Icon className={`w-5 h-5 ${card.color}`} />
                            </div>
                          </div>
                          <p className="text-2xl font-bold text-text-primary tracking-tight">
                            {formatStat(card.key)}
                          </p>
                          <p className="text-sm text-text-muted mt-0.5">
                            {card.label}
                          </p>
                        </div>
                      );
                    })}
              </div>
            </AnimatedSection>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Host profile CTA */}
          {session && (
            <AnimatedSection delay={0.15}>
              <div className="mb-8">
                {hostProfile ? (
                  <div className="bg-gradient-to-r from-surface to-accent/5 border border-border rounded-xl p-6">
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
                            <p className="font-semibold text-text-primary text-lg">
                              {hostProfile.channelName}
                            </p>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                              Host
                            </span>
                          </div>
                          <p className="text-sm text-text-muted">
                            Your creator profile is live
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/host/${hostProfile.id}`}
                          className="text-sm text-text-secondary hover:text-text-primary font-medium px-4 py-2.5 rounded-xl border border-border hover:border-accent/50 transition-all"
                        >
                          View Profile
                        </Link>
                        <Link
                          href="/dashboard/host/bookings"
                          className="text-sm text-text-primary font-medium px-4 py-2.5 rounded-xl bg-surface-raised hover:bg-border transition-all"
                        >
                          Incoming Bookings
                        </Link>
                        <Link
                          href="/dashboard/host"
                          className="text-sm text-white font-semibold px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover transition-all"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 rounded-xl p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                          <Plus className="w-7 h-7 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-lg">
                            Become a Host
                          </p>
                          <p className="text-sm text-text-secondary">
                            Monetize your audience by featuring other creators
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/apply"
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-accent/20"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}

          {/* Underline tabs */}
          <div className="flex items-center gap-6 mb-8 border-b border-border overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings tab */}
          {activeTab === "bookings" && (
            <AnimatedSection>
              <div className="space-y-3">
                {bookingsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <BookingCardSkeleton key={i} />
                  ))
                ) : bookings.length === 0 ? (
                  <div className="text-center py-20 bg-surface/60 backdrop-blur-sm border border-border rounded-xl">
                    <div className="w-20 h-20 bg-surface-raised rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-9 h-9 text-text-muted" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-text-secondary mb-8 max-w-sm mx-auto">
                      Start your growth journey by booking a guest spot with a
                      creator
                    </p>
                    <Link
                      href="/browse"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      Browse Creators
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <>
                    {bookings.map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/booking/${booking.id}`}
                        className="group bg-surface/60 backdrop-blur-sm border border-border rounded-xl p-5 flex items-center justify-between hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all block"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {booking.hostAvatar ? (
                            <img
                              src={booking.hostAvatar}
                              alt={booking.hostName}
                              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-text-primary flex-shrink-0">
                              {booking.hostName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="font-semibold text-text-primary truncate">
                                {booking.hostName}
                              </p>
                              <PlatformBadgeSubtle platform={booking.platform} />
                              <StatusBadge status={booking.status} />
                            </div>
                            <p className="text-sm text-text-muted truncate">
                              {booking.package}
                              {booking.hostHandle &&
                                ` · @${booking.hostHandle.replace("@", "")}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                          <div className="text-right hidden sm:block">
                            <p className="font-bold text-text-primary text-lg tabular-nums">
                              ${booking.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-text-muted">
                              {new Date(booking.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-surface-raised flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all text-text-muted">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </Link>
                    ))}

                    <div className="text-center pt-6">
                      <Link
                        href="/browse"
                        className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
                      >
                        <Plus className="w-4 h-4" />
                        Book another guest spot
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </AnimatedSection>
          )}

          {/* Messages tab */}
          {activeTab === "messages" && (
            <AnimatedSection>
              <div className="space-y-3">
                {bookingsLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <BookingCardSkeleton key={i} />
                  ))
                ) : bookings.length === 0 ? (
                  <div className="text-center py-20 bg-surface/60 backdrop-blur-sm border border-border rounded-xl">
                    <div className="w-20 h-20 bg-surface-raised rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-9 h-9 text-text-muted" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      No conversations yet
                    </h3>
                    <p className="text-text-secondary mb-8 max-w-sm mx-auto">
                      Book a creator to start chatting and coordinate your
                      collaboration
                    </p>
                    <Link
                      href="/browse"
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      Find Creators
                    </Link>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-text-muted mb-1">
                      Click on a booking to open the chat
                    </p>
                    {activeConversations.length === 0 ? (
                      <div className="text-center py-14 bg-surface/60 backdrop-blur-sm border border-border rounded-xl">
                        <MessageSquare className="w-8 h-8 text-text-muted mx-auto mb-3" />
                        <p className="text-text-muted font-medium">
                          No active conversations
                        </p>
                        <p className="text-sm text-text-secondary mt-1">
                          Chat becomes available once you have a confirmed
                          booking
                        </p>
                      </div>
                    ) : (
                      activeConversations.map((booking) => (
                        <Link
                          key={booking.id}
                          href={`/booking/${booking.id}`}
                          className="group bg-surface/60 backdrop-blur-sm border border-border rounded-xl p-5 flex items-center justify-between hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all block"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {booking.hostAvatar ? (
                              <img
                                src={booking.hostAvatar}
                                alt={booking.hostName}
                                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-text-primary flex-shrink-0">
                                {booking.hostName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-text-primary truncate">
                                  {booking.hostName}
                                </p>
                                <StatusBadge status={booking.status} />
                              </div>
                              <p className="text-sm text-text-muted truncate">
                                {booking.package}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-accent group-hover:text-accent-hover flex-shrink-0 ml-4">
                            <span className="text-sm font-medium hidden sm:inline">
                              Open Chat
                            </span>
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </Link>
                      ))
                    )}
                  </>
                )}
              </div>
            </AnimatedSection>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <AnimatedSection>
              <div className="space-y-6 max-w-2xl">
                {/* Profile — read-only */}
                <div className="bg-surface/60 backdrop-blur-sm border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-text-primary text-lg mb-1">
                    Profile
                  </h3>
                  <p className="text-sm text-text-muted mb-6">
                    Contact support to update your profile
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-muted mb-2 font-medium">
                        Display Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        tabIndex={-1}
                        value={session?.user?.name || ""}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-text-secondary cursor-default select-none focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-muted mb-2 font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        readOnly
                        tabIndex={-1}
                        value={session?.user?.email || ""}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-text-secondary cursor-default select-none focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-surface/60 backdrop-blur-sm border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-text-primary text-lg mb-6">
                    Notifications
                  </h3>
                  <div className="space-y-5">
                    {(
                      [
                        {
                          key: "newBookings" as const,
                          label: "Email notifications for new bookings",
                        },
                        {
                          key: "goLive" as const,
                          label: "Email when guest spot goes live",
                        },
                        {
                          key: "weeklyReports" as const,
                          label: "Weekly performance reports",
                        },
                      ] as const
                    ).map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-4"
                      >
                        <span className="text-text-secondary text-sm">
                          {item.label}
                        </span>
                        <Switch
                          checked={notifications[item.key]}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              [item.key]: checked,
                            }))
                          }
                          className="data-[state=checked]:bg-accent flex-shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      showToast({
                        type: "success",
                        title: "Settings saved",
                        message:
                          "Your notification preferences have been updated.",
                      })
                    }
                    className="text-sm font-semibold text-accent hover:text-accent-hover border border-accent/30 hover:border-accent px-6 py-2.5 rounded-xl transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
