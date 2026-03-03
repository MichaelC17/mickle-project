"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface Booking {
  id: string;
  hostId: string;
  hostName: string;
  hostHandle: string;
  hostAvatar: string;
  package: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  date: string;
  platform: "youtube" | "twitch" | "tiktok" | "instagram";
}

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "date" | "status">) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  stats: {
    totalSpent: number;
    totalBookings: number;
    completedCollabs: number;
  };
}

const BookingsContext = createContext<BookingsContextType>({
  bookings: [],
  addBooking: () => {},
  updateBookingStatus: () => {},
  stats: {
    totalSpent: 0,
    totalBookings: 0,
    completedCollabs: 0,
  },
});

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("collab-bookings");
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookings:", e);
      }
    }
  }, []);

  // Save to localStorage when bookings change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("collab-bookings", JSON.stringify(bookings));
    }
  }, [bookings, mounted]);

  const addBooking = (booking: Omit<Booking, "id" | "date" | "status">) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      date: new Date().toISOString(),
      status: "confirmed",
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const stats = {
    totalSpent: bookings.reduce((sum, b) => sum + b.price, 0),
    totalBookings: bookings.length,
    completedCollabs: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, updateBookingStatus, stats }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  return useContext(BookingsContext);
}
