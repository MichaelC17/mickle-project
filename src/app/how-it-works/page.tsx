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
    story: `You've got 2,000 subscribers and solid content, but growing from scratch is slow. You know a collab with the right bigger creator would help, but you don't have the connections yet.`,
    detail: `On COMARI, you browse hosts in your niche who are offering guest spots. Some offer a spot on their next stream, others will feature you in a video or podcast. You pick the format and price that works for you.`,
    options: [
      "Live stream guest spot",
      "Video guest spot",
      "Podcast / interview episode",
      "Shoutout + channel review",
    ],
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Book the spot",
    story: `You send a booking request to a host with 150K subscribers who makes similar content. Their audience would actually be interested in your stuff.`,
    detail: `They accept within a day. Payment is held through Stripe until the collab happens — so both sides are protected.`,
    options: null,
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Plan the content",
    story: `You're now in a direct chat with the host. You schedule a date and talk through the content — what game you'll play on stream, what topic you'll cover, how they'll introduce you.`,
    detail: `It's a real creative conversation. You're planning something together, not hoping a cold DM gets noticed.`,
    options: null,
  },
  {
    number: "04",
    icon: Video,
    title: "Go live",
    story: `Tuesday night. You're in a Discord call, the host hits "Go Live," and 3,000 people are watching. They introduce you, tell their audience about your channel, and then you're just making content together.`,
    detail: `People click through to your channel during the stream. Some subscribe on the spot. You're in front of an audience that already watches content like yours.`,
    options: null,
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Confirm & review",
    story: `After the stream or video goes up, both of you confirm in COMARI that the collab happened as agreed.`,
    detail: `The host gets paid. You leave a review so future guests know what to expect, and the host can review you too. Everything's tracked — no awkward follow-ups needed.`,
    options: null,
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "After the collab",
    story: `New subscribers keep coming in over the next few days. Views on your older videos tick up. People who found you through the collab stick around because they like what you make.`,
    detail: `You also pick up things from working alongside a bigger creator — how they run their stream, how they engage chat, how they think about content. When you're ready, you book another one.`,
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
              What a collaboration{" "}
              <span className="text-accent">
                actually looks like
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Here&apos;s what your first booking on COMARI looks like, start to finish.
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
                That&apos;s it.
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                You find a host, book a guest spot, show up, and grow. Payment
                is handled, expectations are clear, and nobody has to chase
                anyone down. It&apos;s a marketplace for collabs that actually happen.
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
