"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedItem,
} from "@/components/shared/AnimatedSection";
import {
  Search,
  MessageSquare,
  CalendarCheck,
  Video,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Users,
  Star,
  Clock,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Find a host",
    story: `You browse COMARI's host listings and filter by niche, audience size, and price. Each host has a profile showing their channel, what kind of guest spots they offer, and what's included in each package.`,
    detail: `Hosts offer different formats — a spot on their live stream, a collab video, a podcast episode, or a shoutout. You pick the one that fits your budget and content style.`,
    options: [
      "Live stream guest spot",
      "Video collab",
      "Podcast / interview episode",
      "Shoutout + channel review",
    ],
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Request a booking",
    story: `You pick a host and send a booking request. The host gets notified and can check out your channel before deciding whether to accept.`,
    detail: `If they accept, you pay through Stripe. COMARI sends the host payout only after both creators confirm the guest spot was completed.`,
    options: null,
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Coordinate the details",
    story: `Once the booking is confirmed, you and the host use COMARI's built-in chat to work out the specifics: date, content format, how the introduction will work, any prep needed.`,
    detail: `You can also propose specific times through the scheduling feature. Everything stays in one place so there's a clear record of what was agreed on.`,
    options: null,
  },
  {
    number: "04",
    icon: Video,
    title: "The guest spot happens",
    story: `The host features you in whatever format you booked — you join their stream, film a video together, or record a podcast episode. Their audience sees your content.`,
    detail: `The format depends on the package. Some hosts do a full collab, others do an introduction and shoutout. It's defined in the listing so you know what you're getting.`,
    options: null,
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Confirm and review",
    story: `After the guest spot, both you and the host confirm in COMARI that it happened as agreed. Once both sides confirm, the host gets paid (minus the 15% platform fee).`,
    detail: `You can leave a review about your experience, and the host can review you too. Future guests can read these reviews before booking.`,
    options: null,
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "Track the results",
    story: `If you've connected your YouTube channel, COMARI can track changes in your subscriber count and views after the guest spot so you can see what happened.`,
    detail: `Growth depends on a lot of factors — the host's audience size, how relevant their viewers are to your content, and the quality of the guest spot itself. There's no guaranteed outcome, but the data helps you decide if it's worth booking again.`,
    options: null,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />

      {/* ───── HERO ───── */}
      <section className="relative pt-36 pb-20 px-6">
        <div className="relative max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              How It Works
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-[1.08] tracking-tight mb-6">
              How a booking works{" "}
              <span className="text-accent">
                on COMARI
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              From finding a host to tracking your results — here&apos;s the full process, step by step.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── TIMELINE ───── */}
      <section className="relative pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-24">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={0.05}>
                <div className="relative">
                  {/* Step number badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 border border-border bg-background flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-accent tracking-widest">
                        Step {step.number}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                        {step.title}
                      </h2>
                    </div>
                  </div>

                  {/* Story card */}
                  <div className="border border-border p-6 sm:p-8 space-y-5">
                    <p className="text-text-primary leading-relaxed text-[1.05rem]">
                      {step.story}
                    </p>

                    <div className="w-12 h-px bg-border" />

                    <p className="text-text-secondary leading-relaxed">
                      {step.detail}
                    </p>

                    {step.options && (
                      <div className="pt-2">
                        <p className="text-sm font-medium text-text-muted uppercase tracking-wide mb-3">
                          Hosts can offer
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {step.options.map((opt) => (
                            <div
                              key={opt}
                              className="flex items-center gap-2.5 border border-border px-3.5 py-2.5 text-sm text-text-secondary"
                            >
                              <div className="w-1.5 h-1.5 bg-accent" />
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Connector arrow */}
                  {i < steps.length - 1 && (
                    <div className="flex justify-center pt-8">
                      <div className="flex flex-col items-center gap-1 text-text-muted">
                        <div className="w-px h-8 bg-border" />
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ───── RECAP ───── */}
      <section className="bg-surface border-y border-border py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="border border-border p-8 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
                That&apos;s the full process.
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                You find a host, book a guest spot, coordinate the content,
                and confirm when it&apos;s done. Payments are handled through
                Stripe, and both sides leave reviews afterward.
              </p>

              <AnimatedStagger className="grid sm:grid-cols-3 gap-4 mb-8">
                <AnimatedItem>
                  <div className="text-center p-4 border border-border">
                    <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      Relevant audiences
                    </p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="text-center p-4 border border-border">
                    <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      Two-way reviews
                    </p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="text-center p-4 border border-border">
                    <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      Protected payments
                    </p>
                  </div>
                </AnimatedItem>
              </AnimatedStagger>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center gap-2 bg-text-primary text-background font-medium px-7 py-3.5 transition-opacity hover:opacity-90"
                >
                  Browse Hosts
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border border-border text-text-primary font-medium px-7 py-3.5 transition-colors hover:bg-surface-raised"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  );
}
