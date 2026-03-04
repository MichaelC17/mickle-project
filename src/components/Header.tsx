"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : ""
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-text-primary text-xl font-bold tracking-tight">
          COLLAB.
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/browse" className="text-text-secondary hover:text-text-primary transition-colors">
            Browse Hosts
          </Link>
          <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors">
            How it works
          </Link>
          <Link href="#faq" className="text-text-secondary hover:text-text-primary transition-colors">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Become a Host - Prominent CTA */}
          <Link
            href="/apply"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-accent to-purple-500 hover:from-accent-hover hover:to-purple-600 text-white px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Become a Host
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
            aria-label="Toggle theme"
          >
            {/* Sun icon for dark mode (click to go light) */}
            <svg 
              className={`w-5 h-5 ${theme === "dark" ? "block" : "hidden"}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {/* Moon icon for light mode (click to go dark) */}
            <svg 
              className={`w-5 h-5 ${theme === "light" ? "block" : "hidden"}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          {status === "loading" ? (
            <div className="w-20 h-9 bg-surface-raised rounded-md animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="" 
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-medium">
                    {session.user?.name?.[0] || session.user?.email?.[0] || "?"}
                  </div>
                )}
                <span className="hidden sm:inline">{session.user?.name || session.user?.email?.split("@")[0]}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 py-2 rounded-md hover:bg-surface-raised transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
