"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedItem,
} from "@/components/shared/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Shield,
  CreditCard,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Zap,
  MessageSquare,
  Calendar,
} from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<"buyer" | "host">("buyer");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <>
      <Header />

      {/* ───── HERO ───── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div
          className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Shield className="w-3.5 h-3.5" />
              Early Access · Payments secured by Stripe
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text-primary leading-[1.05] tracking-tight mb-6">
              Grow faster with{" "}
              <span className="bg-gradient-to-r from-accent via-purple-500 to-pink-500 bg-clip-text text-transparent">
                collaborations
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Book a guest appearance on a bigger creator&apos;s channel&nbsp;— their
              audience discovers you, and you gain subscribers.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:shadow-lg hover:shadow-accent/25"
              >
                Browse Creators
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 glass text-text-primary font-semibold px-8 py-4 rounded-full text-lg transition-colors hover:bg-surface-raised"
              >
                How it works
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-text-primary mb-1">$0</p>
                <p className="text-sm text-text-muted">Buyer fees</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-3xl font-bold text-text-primary mb-1">100%</p>
                <p className="text-sm text-text-muted">Verified creators</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-text-primary mb-1">50K+</p>
                <p className="text-sm text-text-muted">Min host subscribers</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── WHAT IS A GUEST SPOT? ───── */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm text-accent font-medium uppercase tracking-wide mb-3">
                  What is a guest spot?
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight mb-6">
                  Get featured on channels your audience already watches
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  A guest spot is when you appear on another creator&apos;s channel&nbsp;—
                  whether that&apos;s a dedicated video featuring you, a segment in their
                  content, or a collaboration format. The host promotes you to their audience.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Think of it as buying distribution. Instead of waiting years for the
                  algorithm, you get in front of tens or hundreds of thousands of potential
                  subscribers&nbsp;— instantly.
                </p>
              </div>

              <AnimatedStagger className="grid grid-cols-2 gap-4">
                <AnimatedItem>
                  <div className="glass rounded-xl p-5">
                    <Zap className="w-5 h-5 text-accent mb-3" />
                    <p className="font-medium text-text-primary text-sm mb-1">Instant exposure</p>
                    <p className="text-xs text-text-muted">Get in front of 50K–2M+ viewers</p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="glass rounded-xl p-5">
                    <Users className="w-5 h-5 text-accent mb-3" />
                    <p className="font-medium text-text-primary text-sm mb-1">Targeted audiences</p>
                    <p className="text-xs text-text-muted">Match with creators in your niche</p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="glass rounded-xl p-5">
                    <TrendingUp className="w-5 h-5 text-accent mb-3" />
                    <p className="font-medium text-text-primary text-sm mb-1">Measurable growth</p>
                    <p className="text-xs text-text-muted">Track new subs and ROI</p>
                  </div>
                </AnimatedItem>
                <AnimatedItem>
                  <div className="glass rounded-xl p-5">
                    <CreditCard className="w-5 h-5 text-accent mb-3" />
                    <p className="font-medium text-text-primary text-sm mb-1">Simple pricing</p>
                    <p className="text-xs text-text-muted">Pay the listed price, nothing hidden</p>
                  </div>
                </AnimatedItem>
              </AnimatedStagger>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── PROBLEM (softened) ───── */}
      <div className="gradient-divider" />
      <section className="py-24 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-sm text-text-muted uppercase tracking-wide mb-4">The challenge</p>
              <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight mb-8">
                You&apos;re creating great content.{" "}
                <span className="text-text-muted">
                  But without distribution, growth is painfully slow.
                </span>
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-8 mt-4">
            <AnimatedItem>
              <div className="glass rounded-xl p-6 h-full">
                <p className="text-text-secondary leading-relaxed mb-4">
                  You post consistently, optimize thumbnails, study analytics&nbsp;— and
                  still grow at a crawl. Without an existing audience, even great videos
                  get buried by the algorithm.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Most creators spend years grinding before they hit critical mass. Many
                  burn out before they ever get there.
                </p>
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="glass rounded-xl p-6 h-full border-accent/20">
                <p className="text-text-primary font-medium mb-4">
                  But there&apos;s one exception.
                </p>
                <p className="text-text-secondary leading-relaxed mb-4">
                  The creators who skip the line? They get featured on a bigger channel.
                  One guest spot in front of the right audience can do more than a year of
                  grinding.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  The problem was, those opportunities didn&apos;t exist for most people.
                  DMs go unanswered. There was no way in&nbsp;—{" "}
                  <span className="text-accent font-medium">until now.</span>
                </p>
              </div>
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── SOLUTION ───── */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="grid md:grid-cols-5 gap-12 items-start">
              <div className="md:col-span-3">
                <p className="text-sm text-accent font-medium uppercase tracking-wide mb-3">
                  The solution
                </p>
                <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight mb-6">
                  A marketplace where exposure has a price tag
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  COLLAB. lets you browse creators who are actively selling guest spots on
                  their channels. See their audience size, niche, and rates. Book instantly.
                  Coordinate through our platform. Get in front of thousands&nbsp;— or
                  millions&nbsp;— of potential subscribers.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  For established creators, it&apos;s a way to monetize the collaboration
                  requests you&apos;re already getting. Set your price, accept bookings on
                  your schedule, and get paid to feature rising talent.
                </p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="glass rounded-xl p-5"
                >
                  <p className="text-xs text-accent font-medium uppercase tracking-wide mb-2">
                    For growing creators
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Browse hosts, compare audience data, and book guest spots that fit your
                    budget and niche.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="glass rounded-xl p-5"
                >
                  <p className="text-xs text-accent font-medium uppercase tracking-wide mb-2">
                    For established hosts
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Turn your audience into a monetization channel. Set your own rates and
                    accept bookings on your terms.
                  </p>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <div className="gradient-divider" />
      <section id="how-it-works" className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-sm text-accent font-medium uppercase tracking-wide mb-3">
                How it works
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight">
                Book a guest spot in three steps
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-3 gap-6">
            <AnimatedItem>
              <div className="glass rounded-xl p-8 h-full">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                  <span className="text-accent font-bold text-sm">01</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  Find a creator
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Browse by niche, audience size, and price. Filter for creators whose
                  audience matches the subscribers you want.
                </p>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="glass rounded-xl p-8 h-full">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                  <span className="text-accent font-bold text-sm">02</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  Book &amp; coordinate
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Pay the listed rate, then message through the platform to schedule and
                  align on the content format.
                </p>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="glass rounded-xl p-8 h-full">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-5">
                  <span className="text-accent font-bold text-sm">03</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">
                  Get featured, grow
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Your guest spot goes live. Track views, click-throughs, and new
                  subscribers directly in your dashboard.
                </p>
              </div>
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── GROWTH JOURNEY ───── */}
      <section id="for-creators" className="py-24 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-sm text-accent font-medium uppercase tracking-wide mb-3">
              Your growth journey
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight mb-4">
              A platform that scales with your channel
            </h2>
            <p className="text-text-secondary mb-16 max-w-2xl">
              Start by buying exposure. As you grow, unlock bigger opportunities.
              Eventually, become a host yourself.
            </p>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-6 top-12 bottom-0 w-px bg-border hidden md:block" />

            <AnimatedStagger className="space-y-16">
              <AnimatedItem>
                <div className="relative flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-sm font-semibold text-emerald-500">1</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-text-primary">
                        Start growing
                      </h3>
                      <span className="text-xs text-text-muted bg-surface-raised px-2.5 py-1 rounded-full">
                        1K – 50K subs
                      </span>
                    </div>
                    <p className="text-text-secondary mb-6 leading-relaxed max-w-xl">
                      You&apos;re making content but need more eyeballs. Buy affordable
                      guest spots on channels 5-10x your size to get in front of audiences
                      who&apos;ll actually subscribe.
                    </p>
                    <div className="glass rounded-xl p-5 max-w-md">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-text-primary">$50–300</p>
                          <p className="text-xs text-text-muted">per guest spot</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-text-primary">50K–200K</p>
                          <p className="text-xs text-text-muted">host audience</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-text-primary">100–1K</p>
                          <p className="text-xs text-text-muted">new subs avg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedItem>

              <AnimatedItem>
                <div className="relative flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-sm font-semibold text-accent">2</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-text-primary">Level up</h3>
                      <span className="text-xs text-text-muted bg-surface-raised px-2.5 py-1 rounded-full">
                        50K – 500K subs
                      </span>
                    </div>
                    <p className="text-text-secondary mb-6 leading-relaxed max-w-xl">
                      Your content is proven. Reach bigger audiences and start building
                      relationships with creators at your level and above.
                    </p>
                    <div className="glass rounded-xl p-5 max-w-md">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-text-primary">
                            $500–2.5K
                          </p>
                          <p className="text-xs text-text-muted">per guest spot</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-text-primary">
                            500K–2M+
                          </p>
                          <p className="text-xs text-text-muted">host audience</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-text-primary">2K–20K</p>
                          <p className="text-xs text-text-muted">new subs avg</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 glass rounded-xl p-4 max-w-md border-accent/20">
                      <p className="text-sm text-text-secondary">
                        <span className="text-accent font-medium">
                          At this stage, you can also start hosting.
                        </span>{" "}
                        Accept guest spot requests from smaller creators and earn while you
                        grow.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedItem>

              <AnimatedItem>
                <div className="relative flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-sm font-semibold text-violet-500">3</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-text-primary">
                        Become a destination
                      </h3>
                      <span className="text-xs text-text-muted bg-surface-raised px-2.5 py-1 rounded-full">
                        500K+ subs
                      </span>
                    </div>
                    <p className="text-text-secondary mb-6 leading-relaxed max-w-xl">
                      You&apos;ve built an audience others want access to. Turn
                      collaboration requests into a revenue stream. Set your rates and help
                      the next generation grow.
                    </p>
                    <div className="glass rounded-xl p-5 max-w-md">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-text-primary">
                            $200–10K+
                          </p>
                          <p className="text-xs text-text-muted">your rates</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-text-primary">80%</p>
                          <p className="text-xs text-text-muted">you keep</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-text-primary">
                            $2K–15K
                          </p>
                          <p className="text-xs text-text-muted">monthly avg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            </AnimatedStagger>
          </div>
        </div>
      </section>

      {/* ───── TRANSPARENCY / STATS PREVIEW ───── */}
      <div className="gradient-divider" />
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-sm text-accent font-medium uppercase tracking-wide mb-3">
              Full transparency
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight mb-4">
              See what other creators gained before you book
            </h2>
            <p className="text-text-secondary mb-16 max-w-2xl">
              Every host profile shows real growth data from past guest spots&nbsp;—
              measured over 90 days and compared against each creator&apos;s baseline
              before the collab.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="space-y-5">
                {[
                  {
                    icon: <TrendingUp className="w-5 h-5" />,
                    title: "Growth over baseline",
                    desc: "See how much faster creators grew in the 90 days after their guest spot vs. the 90 days before.",
                  },
                  {
                    icon: <Users className="w-5 h-5" />,
                    title: "Net new subscribers",
                    desc: "The additional subscribers gained over 90 days, above what the creator was already averaging.",
                  },
                  {
                    icon: <CreditCard className="w-5 h-5" />,
                    title: "Cost per incremental sub",
                    desc: "What you actually paid for each subscriber above baseline — the true ROI metric.",
                  },
                  {
                    icon: <CheckCircle className="w-5 h-5" />,
                    title: "Completion rate",
                    desc: "See how reliably this host delivers on bookings. No surprises.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-accent flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary mb-1">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-accent/5 border-b border-glass-border">
                  <p className="text-xs text-accent font-medium text-center">
                    Example host profile
                  </p>
                </div>
                <div className="p-5 border-b border-glass-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-lg font-medium text-white">
                      JM
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Jake Martinez</p>
                      <p className="text-sm text-text-muted">@jakemartinez · 842K subs</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Tech reviews &amp; tutorials
                  </p>
                </div>

                <div className="p-5">
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-3">
                    Avg. growth over 90 days
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-muted mb-1">
                        Sub growth vs baseline
                      </p>
                      <p className="text-lg font-semibold text-emerald-500">+312%</p>
                      <p className="text-xs text-text-muted">+2,847 incremental subs</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">
                        View growth vs baseline
                      </p>
                      <p className="text-lg font-semibold text-emerald-500">+187%</p>
                      <p className="text-xs text-text-muted">+94K incremental views</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">
                        Cost per incremental sub
                      </p>
                      <p className="text-lg font-semibold text-text-primary">$0.25</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Completion rate</p>
                      <p className="text-lg font-semibold text-text-primary">100%</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-glass-border flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted">Guest spot rate</p>
                    <p className="text-lg font-semibold text-text-primary">$700</p>
                  </div>
                  <p className="text-xs text-text-muted">Based on 23 guest spots</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-sm text-accent font-medium uppercase tracking-wide mb-3">
                Pricing
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight mb-4">
                Transparent, transaction-based
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                No subscriptions. No monthly fees. We only make money when guest spots are
                completed.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <AnimatedItem>
              <div className="glass rounded-xl p-8 h-full">
                <p className="text-xs text-accent font-medium uppercase tracking-wide mb-4">
                  For growing creators
                </p>
                <p className="text-3xl font-bold text-text-primary mb-2">$0</p>
                <p className="text-lg text-text-secondary mb-6">buyer fees</p>
                <div className="h-px bg-border mb-6" />
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Pay exactly the listed price
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    No hidden fees at checkout
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Guest spots start as low as $50
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Full refund if host doesn&apos;t deliver
                  </li>
                </ul>
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="glass rounded-xl p-8 h-full">
                <p className="text-xs text-accent font-medium uppercase tracking-wide mb-4">
                  For established hosts
                </p>
                <p className="text-3xl font-bold text-text-primary mb-2">20%</p>
                <p className="text-lg text-text-secondary mb-6">platform commission</p>
                <div className="h-px bg-border mb-6" />
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Deducted only on completed bookings
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Set your own prices
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Payouts within 3 business days
                  </li>
                  <li className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    No contracts or exclusivity
                  </li>
                </ul>
              </div>
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── FOR HOSTS: QUALITY CONTROL ───── */}
      <div className="gradient-divider" />
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-xs text-accent font-medium uppercase tracking-wide mb-3">
              For established hosts
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight mb-4">
              Only serious creators can book you
            </h2>
            <p className="text-text-secondary mb-12 max-w-2xl">
              We vet every creator before they can request a guest spot. You won&apos;t
              waste time on channels that aren&apos;t real or creators who aren&apos;t
              committed to growth.
            </p>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-3 gap-6">
            <AnimatedItem>
              <div className="glass rounded-xl p-6 h-full">
                <Shield className="w-5 h-5 text-accent mb-4" />
                <h3 className="font-medium text-text-primary mb-2">
                  Channel verification
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Every creator verifies ownership of their channel before they can book.
                  No fake accounts, no impersonators.
                </p>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="glass rounded-xl p-6 h-full">
                <Star className="w-5 h-5 text-accent mb-4" />
                <h3 className="font-medium text-text-primary mb-2">Content review</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  We check that bookers have active channels with real content&nbsp;— not
                  empty profiles or spam accounts.
                </p>
              </div>
            </AnimatedItem>
            <AnimatedItem>
              <div className="glass rounded-xl p-6 h-full">
                <CheckCircle className="w-5 h-5 text-accent mb-4" />
                <h3 className="font-medium text-text-primary mb-2">
                  You approve every booking
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  See who&apos;s requesting before you accept. Review their channel,
                  content style, and audience fit.
                </p>
              </div>
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── TRUST & SAFETY ───── */}
      <section id="trust" className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-sm text-accent font-medium uppercase tracking-wide mb-3">
                Trust &amp; safety
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight">
                How we protect both sides
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(
              [
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: "Verified hosts",
                  desc: "Every host verifies channel ownership. We check subscriber counts, engagement, and content quality.",
                },
                {
                  icon: <CreditCard className="w-5 h-5" />,
                  title: "Payment protection",
                  desc: "Funds are held until the guest spot goes live. Hosts see payment is secured before doing any work.",
                },
                {
                  icon: <MessageSquare className="w-5 h-5" />,
                  title: "Clear deliverables",
                  desc: "Each listing specifies format, duration, and timeline. You know exactly what you\u2019re paying for.",
                },
                {
                  icon: <Star className="w-5 h-5" />,
                  title: "Ratings",
                  desc: "Both parties leave feedback after each guest spot. Reputation is built through completed bookings.",
                },
                {
                  icon: <Calendar className="w-5 h-5" />,
                  title: "Dispute resolution",
                  desc: "If something goes wrong, our team reviews the situation and mediates a fair outcome.",
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  title: "Performance tracking",
                  desc: "See views, engagement, and subscriber impact after your guest spot goes live. Measure your ROI.",
                },
              ] as const
            ).map((item) => (
              <AnimatedItem key={item.title}>
                <div className="glass rounded-xl p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <div className="gradient-divider" />
      <section id="faq" className="py-24 px-6 bg-background">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <p className="text-sm text-accent font-medium uppercase tracking-wide mb-3">
              FAQ
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-text-primary leading-tight mb-12">
              Common questions
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible>
              <AccordionItem value="what" className="border-border">
                <AccordionTrigger className="text-text-primary hover:no-underline text-base font-medium py-5">
                  What&apos;s a guest spot?
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed">
                  A guest spot is when you appear on another creator&apos;s channel&nbsp;—
                  whether that&apos;s a dedicated video featuring you, a segment in their
                  content, a mention with a call-to-action, or a collaboration format. The
                  host promotes you to their audience.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="agency" className="border-border">
                <AccordionTrigger className="text-text-primary hover:no-underline text-base font-medium py-5">
                  How is this different from a talent agency?
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed">
                  Agencies take 15-20% of all your earnings and require exclusivity. We
                  only take a cut of guest spots booked through our platform. No contracts,
                  no exclusivity, and we never touch your other income.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payments" className="border-border">
                <AccordionTrigger className="text-text-primary hover:no-underline text-base font-medium py-5">
                  How do payments work?
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed">
                  When you book, payment is held by COLLAB. The host sees the funds are
                  secured and schedules your guest spot. Once it goes live and is confirmed,
                  funds are released within 3 business days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="both" className="border-border">
                <AccordionTrigger className="text-text-primary hover:no-underline text-base font-medium py-5">
                  Can I be both a buyer and a host?
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed">
                  Yes. Many mid-tier creators book guest spots on larger channels while also
                  hosting smaller creators on their own channel. It&apos;s common to do
                  both.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="host-req" className="border-border">
                <AccordionTrigger className="text-text-primary hover:no-underline text-base font-medium py-5">
                  What are the requirements to become a host?
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed">
                  Currently, we require at least 50K subscribers on YouTube or equivalent
                  followers on Twitch. We also review content quality and engagement
                  metrics.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund" className="border-border">
                <AccordionTrigger className="text-text-primary hover:no-underline text-base font-medium py-5">
                  What if a host doesn&apos;t deliver?
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed">
                  If a host fails to deliver the agreed guest spot, you get a full refund.
                  Hosts who cancel or underdeliver repeatedly are removed from the platform.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="launch" className="border-border">
                <AccordionTrigger className="text-text-primary hover:no-underline text-base font-medium py-5">
                  When is COLLAB. launching?
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed">
                  We&apos;re in early access. Join the waitlist to get priority
                  access&nbsp;— we&apos;re adding new users gradually.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── CTA / WAITLIST ───── */}
      <section id="waitlist" className="relative py-28 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.04) 50%, var(--background) 100%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-25 blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />

        <div className="relative max-w-xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary leading-tight mb-4">
                Ready to grow faster?
              </h2>
              <p className="text-text-secondary text-lg">
                Join the waitlist for early access. Whether you want to buy guest spots or
                sell them, we&apos;ll notify you when we&apos;re ready.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="glass rounded-xl p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    You&apos;re on the list!
                  </h3>
                  <p className="text-sm text-text-secondary">
                    We&apos;ll email you at{" "}
                    <span className="text-text-primary font-medium">{email}</span> when
                    it&apos;s your turn. No spam, ever.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-6">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>

                  <div className="flex justify-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted hover:text-text-secondary transition-colors">
                      <input
                        type="radio"
                        name="interest"
                        value="buyer"
                        checked={interest === "buyer"}
                        onChange={() => setInterest("buyer")}
                        className="accent-accent"
                      />
                      I want to buy guest spots
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted hover:text-text-secondary transition-colors">
                      <input
                        type="radio"
                        name="interest"
                        value="host"
                        checked={interest === "host"}
                        onChange={() => setInterest("host")}
                        className="accent-accent"
                      />
                      I want to host
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-full text-base transition-all hover:shadow-lg hover:shadow-accent/25"
                  >
                    {submitting ? "Joining..." : "Join the waitlist"}
                  </button>

                  <p className="text-xs text-text-muted text-center">
                    We&apos;ll email you when it&apos;s your turn. No spam.
                  </p>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  );
}
