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
    title: "The Search",
    story: `Imagine you've been putting in the work for months. Your content is solid, your editing is getting better, and the people who watch you genuinely enjoy what you make. But growing an audience from scratch is hard — really hard. You've got 2,000 subscribers, and breaking through to the next level on your own is a slow grind.`,
    detail: `Then you find COMARI. You browse through creators in your niche — gaming, tech, lifestyle, whatever you make — and find hosts offering exactly what you need. Some offer a spot on their next live stream. Others will feature you in an edited video or a podcast episode. You pick the format that fits your style and budget.`,
    options: [
      "Live stream guest appearance",
      "Collaborative video feature",
      "Podcast / interview episode",
      "Shoutout + channel review",
    ],
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "The Confirmation",
    story: `You send a booking request to a creator with 150K subscribers. They make the same type of content you do, and their audience would actually care about your stuff. This isn't random — this is a real fit.`,
    detail: `Within a day, they accept. Payment is held securely through Stripe — the host doesn't get paid until the collaboration actually happens. Both sides are protected.`,
    options: null,
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "The Planning",
    story: `Now you're in a direct chat with someone whose content you've been watching for years. Except now you're equals — collaborators working out the details together.`,
    detail: `You schedule a date. You talk about the content — what game you'll play together on stream, what topic you'll cover in the video, how they'll introduce you to their audience. It's a real creative conversation, not a cold DM that gets ignored.`,
    options: null,
  },
  {
    number: "04",
    icon: Video,
    title: "The Moment",
    story: `It's Tuesday night. You're sitting in a Discord call, and then the host hits "Go Live." Suddenly, 3,000 people are watching. The host introduces you — tells their audience why your channel is worth checking out — and then you're playing together, making content, being yourself.`,
    detail: `The chat is lighting up. People are clicking through to your channel. Some of them are subscribing right there during the stream. You're getting real, authentic exposure to an audience that's already primed to care about your kind of content.`,
    options: null,
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "The Wrap-Up",
    story: `The stream ends. The video goes up. Both of you hop back into the COMARI. platform and confirm that the collaboration happened as agreed.`,
    detail: `The host gets paid. You leave a review so future buyers know what to expect. The host can review you too — building trust on both sides. No awkward follow-ups, no "hey did you forget about our deal." Everything is tracked and transparent.`,
    options: null,
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "The Growth",
    story: `The collaboration is over, but the impact isn't. New subscribers keep finding your channel. Views on your older content start climbing. People who discovered you through the collab are sticking around — because they genuinely like what you make.`,
    detail: `But it's not just the numbers. Working alongside a larger creator gave you real insight — how they structure their streams, how they engage their chat, how they think about content. You walked away with experience and perspective you couldn't have gotten any other way. And when you're ready, you book your next one.`,
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
              The Full Process
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
              Imagine you&apos;re a smaller creator with great content and a growing
              audience. This is what your first COMARI. booking looks like —
              from search to growth.
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
                That&apos;s the whole process.
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                No cold DMs that go nowhere. No &ldquo;collab?&rdquo; comments
                that get buried. No handshake deals where someone ghosts. Just a
                clean, transparent marketplace where smaller creators pay for
                real exposure on bigger channels — and both sides benefit.
              </p>

              <AnimatedStagger className="grid sm:grid-cols-3 gap-4 mb-8">
                <AnimatedItem>
                  <div className="text-center p-4 border border-border">
                    <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      Real audience access
                    </p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="text-center p-4 border border-border">
                    <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      Reviews from both sides
                    </p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="text-center p-4 border border-border">
                    <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      Real experience &amp; insight
                    </p>
                  </div>
                </AnimatedItem>
              </AnimatedStagger>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center gap-2 bg-text-primary text-background font-medium px-7 py-3.5 transition-opacity hover:opacity-90"
                >
                  Explore the Platform
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
