"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
