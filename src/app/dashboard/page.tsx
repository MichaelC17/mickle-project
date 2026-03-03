"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBookings, Booking } from "@/context/BookingsContext";

interface Message {
  id: string;
  bookingId: string;
  sender: "user" | "host";
  text: string;
  timestamp: string;
}

// Mock initial messages for demo
const generateMockMessages = (booking: Booking): Message[] => {
  const now = new Date();
  return [
    {
      id: `msg-${booking.id}-1`,
      bookingId: booking.id,
      sender: "host",
      text: `Hey! Thanks for booking the ${booking.package}. I'm excited to collaborate with you!`,
      timestamp: new Date(now.getTime() - 3600000).toISOString(),
    },
    {
      id: `msg-${booking.id}-2`,
      bookingId: booking.id,
      sender: "host",
      text: "What kind of content do you create? I'd love to make sure we align on the format.",
      timestamp: new Date(now.getTime() - 3500000).toISOString(),
    },
  ];
};

function StatusBadge({ status }: { status: string }) {
  const styles = {
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${styles[status as keyof typeof styles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "youtube":
      return (
        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      );
    case "twitch":
      return (
        <svg className="w-4 h-4 text-violet-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "messages" | "analytics" | "settings">("bookings");
  const { bookings, stats } = useBookings();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("collab-messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse messages:", e);
      }
    }
  }, []);

  // Initialize mock messages for new bookings
  useEffect(() => {
    if (!mounted || bookings.length === 0) return;
    
    const existingBookingIds = new Set(messages.map(m => m.bookingId));
    const newMessages: Message[] = [];
    
    bookings.forEach(booking => {
      if (!existingBookingIds.has(booking.id)) {
        newMessages.push(...generateMockMessages(booking));
      }
    });
    
    if (newMessages.length > 0) {
      setMessages(prev => [...prev, ...newMessages]);
    }
  }, [bookings, mounted, messages]);

  // Save messages to localStorage
  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem("collab-messages", JSON.stringify(messages));
    }
  }, [messages, mounted]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChat]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      bookingId: selectedChat,
      sender: "user",
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate host response after a delay
    setTimeout(() => {
      const responses = [
        "Sounds great! Let me know when works best for you.",
        "Perfect, I'll send over some details soon.",
        "Got it! Looking forward to working together.",
        "Awesome! Let's make this collab happen.",
        "Thanks for the info! I'll follow up shortly.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const hostReply: Message = {
        id: `msg-${Date.now()}-reply`,
        bookingId: selectedChat,
        sender: "host",
        text: randomResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, hostReply]);
    }, 1500 + Math.random() * 2000);
  };

  const getBookingMessages = (bookingId: string) => {
    return messages.filter(m => m.bookingId === bookingId).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  const getLastMessage = (bookingId: string) => {
    const bookingMessages = getBookingMessages(bookingId);
    return bookingMessages[bookingMessages.length - 1];
  };

  const getUnreadCount = (bookingId: string) => {
    // For demo, show unread if last message is from host
    const last = getLastMessage(bookingId);
    return last?.sender === "host" ? 1 : 0;
  };

  const selectedBooking = bookings.find(b => b.id === selectedChat);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-text-primary">Dashboard</h1>
            <p className="text-text-secondary mt-1">Manage your bookings and track performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-muted text-sm mb-1">Total Spent</p>
              <p className="text-2xl font-semibold text-text-primary">${stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-muted text-sm mb-1">Total Bookings</p>
              <p className="text-2xl font-semibold text-text-primary">{stats.totalBookings}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-muted text-sm mb-1">Pending</p>
              <p className="text-2xl font-semibold text-yellow-500">{bookings.filter(b => b.status === "pending" || b.status === "confirmed").length}</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-5">
              <p className="text-text-muted text-sm mb-1">Completed</p>
              <p className="text-2xl font-semibold text-emerald-500">{stats.completedCollabs}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => { setActiveTab("messages"); setSelectedChat(null); }}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === "messages"
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                Messages
                {bookings.some(b => getUnreadCount(b.id) > 0) && (
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "analytics"
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "settings"
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-surface border border-border rounded-xl">
                  <p className="text-text-muted mb-4">No bookings yet</p>
                  <Link
                    href="/browse"
                    className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                  >
                    Browse Hosts
                  </Link>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-lg font-medium text-text-primary">
                        {booking.hostAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-text-primary">{booking.hostName}</p>
                          <PlatformIcon platform={booking.platform} />
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-sm text-text-muted">
                          {booking.package} · {booking.hostHandle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">${booking.price.toLocaleString()}</p>
                      <p className="text-sm text-text-muted">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}

              <div className="text-center pt-4">
                <Link
                  href="/browse"
                  className="text-sm text-accent hover:underline"
                >
                  + Book another guest spot
                </Link>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="bg-surface border border-border rounded-xl overflow-hidden" style={{ height: "500px" }}>
              {bookings.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-text-muted mb-4">No conversations yet</p>
                    <Link
                      href="/browse"
                      className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                    >
                      Book a Host to Start Chatting
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex h-full">
                  {/* Conversation List */}
                  <div className={`w-full md:w-80 border-r border-border overflow-y-auto ${selectedChat ? 'hidden md:block' : ''}`}>
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium text-text-primary">Conversations</h3>
                    </div>
                    {bookings.map((booking) => {
                      const lastMsg = getLastMessage(booking.id);
                      const unread = getUnreadCount(booking.id);
                      return (
                        <button
                          key={booking.id}
                          onClick={() => setSelectedChat(booking.id)}
                          className={`w-full p-4 text-left hover:bg-surface-raised transition-colors border-b border-border-subtle ${
                            selectedChat === booking.id ? "bg-surface-raised" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-sm font-medium text-text-primary flex-shrink-0">
                              {booking.hostAvatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-text-primary text-sm">{booking.hostName}</p>
                                  <PlatformIcon platform={booking.platform} />
                                </div>
                                {unread > 0 && (
                                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                                )}
                              </div>
                              <p className="text-xs text-text-muted truncate mt-0.5">
                                {lastMsg ? lastMsg.text : "Start the conversation..."}
                              </p>
                              <p className="text-xs text-text-muted mt-1">{booking.package}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Chat Window */}
                  <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    {!selectedChat ? (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <p className="text-text-muted">Select a conversation to start chatting</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-border flex items-center gap-3">
                          <button
                            onClick={() => setSelectedChat(null)}
                            className="md:hidden p-1 -ml-1 text-text-muted hover:text-text-primary"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-sm font-medium text-text-primary">
                            {selectedBooking?.hostAvatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-text-primary">{selectedBooking?.hostName}</p>
                              <PlatformIcon platform={selectedBooking?.platform || "youtube"} />
                            </div>
                            <p className="text-xs text-text-muted">{selectedBooking?.package}</p>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {getBookingMessages(selectedChat).map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  msg.sender === "user"
                                    ? "bg-accent text-white"
                                    : "bg-surface-raised text-text-primary"
                                }`}
                              >
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${
                                  msg.sender === "user" ? "text-white/70" : "text-text-muted"
                                }`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-border">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                              placeholder="Type a message..."
                              className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                            />
                            <button
                              onClick={sendMessage}
                              disabled={!newMessage.trim()}
                              className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Analytics Coming Soon</h3>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Track your subscriber growth, view performance, and measure ROI from all your guest spot bookings in one place.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-medium text-text-primary mb-4">Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-muted mb-1">Display Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-background border border-border rounded-md px-4 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-muted mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-background border border-border rounded-md px-4 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Connected Channels */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-medium text-text-primary mb-4">Connected Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span className="text-text-primary">YouTube</span>
                    </div>
                    <button className="text-sm text-accent hover:underline">Connect</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-violet-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                      </svg>
                      <span className="text-text-primary">Twitch</span>
                    </div>
                    <button className="text-sm text-accent hover:underline">Connect</button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-medium text-text-primary mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-text-secondary">Email notifications for new bookings</span>
                    <input type="checkbox" defaultChecked className="accent-accent w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-text-secondary">Email when guest spot goes live</span>
                    <input type="checkbox" defaultChecked className="accent-accent w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-text-secondary">Weekly performance reports</span>
                    <input type="checkbox" className="accent-accent w-4 h-4" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors">
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
