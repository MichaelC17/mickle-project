"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHostById } from "@/lib/hosts";
import { useBookings } from "@/context/BookingsContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const hostId = searchParams.get("host");
  const packageName = searchParams.get("package");
  const { addBooking } = useBookings();
  const hasAddedBooking = useRef(false);
  
  const host = hostId ? getHostById(hostId) : null;

  // Add booking to context when page loads (only once)
  useEffect(() => {
    if (host && packageName && !hasAddedBooking.current) {
      hasAddedBooking.current = true;
      
      // Find the package to get the price
      const pkg = host.packages.find(p => p.name === packageName);
      
      addBooking({
        hostId: host.id,
        hostName: host.name,
        hostHandle: host.handle,
        hostAvatar: host.avatar,
        package: packageName,
        price: pkg?.price || host.price,
        platform: host.platform,
      });
    }
  }, [host, packageName, addBooking]);

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold text-text-primary mb-4">
          Booking Confirmed!
        </h1>
        
        <p className="text-text-secondary mb-8">
          Your payment has been processed and your guest spot has been booked.
          {host && ` ${host.name} will be notified and will reach out to coordinate details.`}
        </p>

        {/* Booking Details */}
        {host && (
          <div className="bg-surface border border-border rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-text-primary mb-4">Booking Details</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Host</span>
                <span className="text-text-primary font-medium">{host.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Package</span>
                <span className="text-text-primary font-medium">{packageName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Platform</span>
                <span className="text-text-primary font-medium capitalize">{host.platform}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Status</span>
                <span className="text-emerald-500 font-medium">Confirmed</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-8 text-left">
          <h2 className="font-semibold text-text-primary mb-4">What Happens Next</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-accent">1</span>
              </div>
              <div>
                <p className="text-text-primary font-medium">Host confirmation</p>
                <p className="text-sm text-text-muted">The host will confirm and reach out within 24-48 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-accent">2</span>
              </div>
              <div>
                <p className="text-text-primary font-medium">Coordinate details</p>
                <p className="text-sm text-text-muted">Work out timing, content format, and any creative direction.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-accent">3</span>
              </div>
              <div>
                <p className="text-text-primary font-medium">Guest spot goes live</p>
                <p className="text-sm text-text-muted">Once published, you&apos;ll track performance in your dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/browse"
            className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Browse More Hosts
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-surface-raised hover:bg-surface border border-border text-text-primary font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Support note */}
        <p className="text-sm text-text-muted mt-8">
          Questions? Contact us at{" "}
          <a href="mailto:support@collab.io" className="text-accent hover:underline">
            support@collab.io
          </a>
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="min-h-screen pt-24 pb-20 px-6">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-text-secondary">Loading...</p>
          </div>
        </main>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
