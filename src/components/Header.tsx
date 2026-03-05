"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  MessageSquare,
  Calendar,
  CheckCircle,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [seenNotificationIds, setSeenNotificationIds] = useState<Set<string>>(
    new Set()
  );
  const notificationRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();

        data.notifications.forEach((notif: Notification) => {
          if (!notif.read && !seenNotificationIds.has(notif.id)) {
            const toastType = notif.type.includes("MESSAGE")
              ? "message"
              : notif.type.includes("SCHEDULE")
                ? "schedule"
                : "success";

            showToast({
              type: toastType,
              title: notif.title,
              message: notif.message,
              link: notif.link || undefined,
            });

            setSeenNotificationIds(
              (prev) => new Set([...Array.from(prev), notif.id])
            );
          }
        });

        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }

  function handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setNotificationsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "NEW_MESSAGE":
        return <MessageSquare className="w-4 h-4" />;
      case "SCHEDULE_PROPOSAL":
      case "SCHEDULE_ACCEPTED":
      case "SCHEDULE_DECLINED":
        return <Calendar className="w-4 h-4" />;
      case "BOOKING_CONFIRMED":
      case "BOOKING_STARTED":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  }

  function getTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  const navLinks = [
    { href: "/browse", label: "Explore" },
    { href: "/#how-it-works", label: "How it Works" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-text-primary text-2xl font-bold tracking-tight">
            COLLAB<span className="text-accent">.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text-primary hover:bg-surface-raised px-4 py-2 rounded-full text-sm font-medium transition-all"
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/dashboard"
              className="text-text-secondary hover:text-text-primary hover:bg-surface-raised px-4 py-2 rounded-full text-sm font-medium transition-all"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/apply"
            className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover px-4 py-2 rounded-full transition-all border border-accent/20 hover:border-accent/40 hover:bg-accent/5"
          >
            Become a Host
          </Link>

          {session && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 sm:right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <h3 className="font-semibold text-text-primary">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-accent hover:text-accent-hover font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-text-muted">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className={`w-full px-4 py-3 flex gap-3 hover:bg-surface-raised transition-colors text-left ${
                              !notification.read ? "bg-accent/5" : ""
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                notification.type.includes("ACCEPTED") ||
                                notification.type.includes("CONFIRMED")
                                  ? "bg-green-500/10 text-green-500"
                                  : notification.type.includes("DECLINED")
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-accent/10 text-accent"
                              }`}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${!notification.read ? "font-semibold text-text-primary" : "text-text-secondary"}`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-text-muted truncate">
                                {notification.message}
                              </p>
                              <p className="text-xs text-text-muted mt-1">
                                {getTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {status === "loading" ? (
            <div className="w-24 h-10 bg-surface-raised rounded-full animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-surface-raised transition-all"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-8 h-8 rounded-full ring-2 ring-border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {session.user?.name?.[0] ||
                      session.user?.email?.[0] ||
                      "?"}
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium text-text-primary">
                  {session.user?.name?.split(" ")[0] ||
                    session.user?.email?.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={() => signOut()}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary px-3 py-2 rounded-full hover:bg-surface-raised transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-text-secondary hover:text-text-primary px-4 py-2 rounded-full hover:bg-surface-raised transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="text-sm font-semibold bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Join
              </Link>
            </div>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] bg-background border-border p-0"
            >
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
                <SheetTitle className="text-text-primary text-left text-xl font-bold tracking-tight">
                  COLLAB<span className="text-accent">.</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col py-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-3.5 text-text-primary font-medium hover:bg-surface-raised transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>
                ))}
                {session && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-3.5 text-text-primary font-medium hover:bg-surface-raised transition-colors"
                  >
                    Dashboard
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>
                )}

                <div className="my-2 mx-6 h-px bg-border" />

                <Link
                  href="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-6 py-3.5 text-accent font-semibold hover:bg-accent/5 transition-colors"
                >
                  Become a Host
                  <ChevronRight className="w-4 h-4" />
                </Link>

                {session && (
                  <>
                    <div className="my-2 mx-6 h-px bg-border" />
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-6 py-3.5 text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
