"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
        <Link href="/" className="text-text-primary font-semibold">
          CollabBook
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#how-it-works" className="text-text-secondary hover:text-text-primary transition-colors">
            How it works
          </Link>
          <Link href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-text-secondary hover:text-text-primary transition-colors">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="#waitlist"
            className="text-sm font-medium bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md transition-colors"
          >
            Get early access
          </Link>
        </div>
      </nav>
    </header>
  );
}
