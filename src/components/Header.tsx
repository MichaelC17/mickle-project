"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const [seenNotificationIds, setSeenNotificationIds] = useState<Set<string>>(new Set());
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
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
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
            
            setSeenNotificationIds(prev => new Set([...Array.from(prev), notif.id]));
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
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
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
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case "SCHEDULE_PROPOSAL":
      case "SCHEDULE_ACCEPTED":
      case "SCHEDULE_DECLINED":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "BOOKING_CONFIRMED":
      case "BOOKING_STARTED":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-text-primary text-2xl font-bold tracking-tight">
            COLLAB<span className="text-accent">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link 
            href="/browse" 
            className="text-text-secondary hover:text-text-primary hover:bg-surface-raised px-4 py-2 rounded-full text-sm font-medium transition-all"
          >
            Explore
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-text-secondary hover:text-text-primary hover:bg-surface-raised px-4 py-2 rounded-full text-sm font-medium transition-all"
          >
            How it Works
          </Link>
          {session && (
            <Link 
              href="/dashboard" 
              className="text-text-secondary hover:text-text-primary hover:bg-surface-raised px-4 py-2 rounded-full text-sm font-medium transition-all"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Become a Host - Desktop */}
          <Link
            href="/apply"
            className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover px-4 py-2 rounded-full transition-all border border-accent/20 hover:border-accent/40 hover:bg-accent/5"
          >
            Become a Host
          </Link>

          {/* Notification Bell */}
          {session && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary">Notifications</h3>
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
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full px-4 py-3 flex gap-3 hover:bg-surface-raised transition-colors text-left ${
                            !notification.read ? "bg-accent/5" : ""
                          }`}
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.type.includes("ACCEPTED") || notification.type.includes("CONFIRMED") 
                              ? "bg-green-500/10 text-green-500"
                              : notification.type.includes("DECLINED")
                              ? "bg-red-500/10 text-red-500"
                              : "bg-accent/10 text-accent"
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.read ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-text-muted truncate">{notification.message}</p>
                            <p className="text-xs text-text-muted mt-1">{getTimeAgo(notification.createdAt)}</p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all"
            aria-label="Toggle theme"
          >
            <svg 
              className={`w-5 h-5 ${theme === "dark" ? "block" : "hidden"}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg 
              className={`w-5 h-5 ${theme === "light" ? "block" : "hidden"}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          {/* User Section */}
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
                    {session.user?.name?.[0] || session.user?.email?.[0] || "?"}
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium text-text-primary">
                  {session.user?.name?.split(" ")[0] || session.user?.email?.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-text-muted hover:text-text-primary px-3 py-2 rounded-full hover:bg-surface-raised transition-all"
              >
                Sign out
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-all"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-6 py-4 space-y-2">
            <Link 
              href="/browse" 
              className="block text-text-primary font-medium py-3 border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Creators
            </Link>
            <Link 
              href="#how-it-works" 
              className="block text-text-secondary py-3 border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            {session && (
              <Link 
                href="/dashboard" 
                className="block text-text-secondary py-3 border-b border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Link 
              href="/apply" 
              className="block text-accent font-medium py-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              Become a Host
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
