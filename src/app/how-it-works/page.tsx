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
  Gamepad2,
  Users,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "The Search",
    accent: "from-indigo-500 to-blue-500",
    accentBg: "bg-indigo-500/10",
    accentText: "text-indigo-400",
    story: `You've been grinding for months. The videos are good — you know they are — but the algorithm isn't picking them up. You've got 2,000 subscribers who genuinely love your content, but reaching the next audience feels impossible.`,
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
    accent: "from-purple-500 to-pink-500",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-400",
    story: `You send a booking request to a creator with 150K subscribers. They make the same type of content you do, and their audience would actually care about your stuff. This isn't random — this is a real fit.`,
    detail: `Within a day, they accept. Payment is held securely through Stripe — the host doesn't get paid until the collaboration actually happens. Both sides are protected.`,
    options: null,
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "The Planning",
    accent: "from-pink-500 to-rose-500",
    accentBg: "bg-pink-500/10",
    accentText: "text-pink-400",
    story: `Now you're in a direct chat with someone whose content you've been watching for years. Except now you're equals — collaborators working out the details together.`,
    detail: `You schedule a date. You talk about the content — what game you'll play together on stream, what topic you'll cover in the video, how they'll introduce you to their audience. It's a real creative conversation, not a cold DM that gets ignored.`,
    options: null,
  },
  {
    number: "04",
    icon: Video,
    title: "The Moment",
    accent: "from-amber-500 to-orange-500",
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-400",
    story: `It's Tuesday night. You're sitting in a Discord call, and then the host hits "Go Live." Suddenly, 3,000 people are watching. The host introduces you — tells their audience why your channel is worth checking out — and then you're playing together, making content, being yourself.`,
    detail: `The chat is lighting up. People are clicking through to your channel. Some of them are subscribing right there during the stream. This is what months of cold emails and networking never got you — real, authentic exposure to an audience that's already primed to care about your kind of content.`,
    options: null,
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "The Confirmation",
    accent: "from-emerald-500 to-green-500",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-400",
    story: `The stream ends. The video goes up. Both of you hop back into the COMARI. platform and confirm that the collaboration happened as agreed.`,
    detail: `The host gets paid. You leave a review so future buyers know what to expect. The host can review you too — building trust on both sides. No awkward follow-ups, no "hey did you forget about our deal." Everything is tracked and transparent.`,
    options: null,
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "The Growth",
    accent: "from-cyan-500 to-blue-500",
    accentBg: "bg-cyan-500/10",
    accentText: "text-cyan-400",
    story: `Over the next 90 days, you watch your numbers move. Not vanity metrics — real subscribers who stick around, real views on your own content from people who discovered you through the collab.`,
    detail: `COMARI. tracks it for you. You can see exactly how many new subscribers and views came after the collaboration. For the first time, you can put a real number on what that exposure was worth. And when you're ready, you book your next one.`,
    options: null,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Header />

      {/* ───── HERO ───── */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div
          className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-15 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              The Full Process
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-text-primary leading-[1.08] tracking-tight mb-6">
              What a collaboration{" "}
              <span className="bg-gradient-to-r from-accent via-purple-500 to-pink-500 bg-clip-text text-transparent">
                actually looks like
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Meet Alex. 2,000 subscribers, great content, zero luck with the
              algorithm. This is the story of their first COMARI. booking —
              from search to growth.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── TIMELINE ───── */}
      <section className="relative pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

          <div className="space-y-24">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} delay={0.05}>
                <div className="relative">
                  {/* Step number badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl ${step.accentBg} flex items-center justify-center`}
                    >
                      <step.icon className={`w-6 h-6 ${step.accentText}`} />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-mono font-bold uppercase tracking-widest ${step.accentText}`}
                      >
                        Step {step.number}
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-display text-text-primary leading-tight">
                        {step.title}
                      </h2>
                    </div>
                  </div>

                  {/* Story card */}
                  <div className="glass rounded-2xl p-6 sm:p-8 space-y-5">
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
                              className="flex items-center gap-2.5 bg-surface-raised/50 rounded-lg px-3.5 py-2.5 text-sm text-text-secondary"
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.accent}`}
                              />
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
      <section className="relative py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.03) 50%, var(--background) 100%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="glass rounded-2xl p-8 sm:p-10">
              <h2 className="font-display text-2xl sm:text-3xl text-text-primary mb-4">
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
                  <div className="text-center p-4 rounded-xl bg-surface-raised/50">
                    <Users className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      Real audience access
                    </p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="text-center p-4 rounded-xl bg-surface-raised/50">
                    <Star className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      Reviews from both sides
                    </p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="text-center p-4 rounded-xl bg-surface-raised/50">
                    <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">
                      90-day growth tracking
                    </p>
                  </div>
                </AnimatedItem>
              </AnimatedStagger>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-accent/25"
                >
                  Explore the Platform
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex items-center justify-center gap-2 glass text-text-primary font-semibold px-6 py-3 rounded-full transition-colors hover:bg-surface-raised"
                >
                  Apply as a Creator
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
