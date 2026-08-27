"use client";

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
  CreditCard,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Zap,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />

      {/* ───── HERO ───── */}
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-6">
              Early Access &middot; Creator Collaborations
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text-primary leading-[1.02] font-bold mb-6">
              Grow faster with collaborations
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed">
              Book a guest appearance on a bigger creator&apos;s channel&nbsp;&mdash; their
              audience discovers you, and you gain subscribers.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 mb-20">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 bg-text-primary text-background font-medium px-7 py-3.5 text-base transition-opacity hover:opacity-90"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-border text-text-primary font-medium px-7 py-3.5 text-base transition-colors hover:bg-surface"
              >
                How it works
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="grid grid-cols-3 gap-8 max-w-md border-t border-border pt-8">
              <div>
                <p className="text-2xl font-bold text-text-primary mb-1">$0</p>
                <p className="text-xs text-text-muted uppercase tracking-wide">Buyer fees</p>
              </div>
              <div className="border-x border-border px-6">
                <p className="text-2xl font-bold text-text-primary mb-1">100%</p>
                <p className="text-xs text-text-muted uppercase tracking-wide">Verified</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary mb-1">Secure</p>
                <p className="text-xs text-text-muted uppercase tracking-wide">Stripe</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── WHAT IS A GUEST SPOT? ───── */}
      <section className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                  What is a guest spot?
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-6">
                  Get featured on channels your audience already watches
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  A guest spot is when you appear on another creator&apos;s channel&nbsp;&mdash;
                  whether that&apos;s a dedicated video featuring you, a segment in their
                  content, or a collaboration format. The host promotes you to their audience.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Think of it as buying distribution. Instead of waiting years for the
                  algorithm, you get in front of tens or hundreds of thousands of potential
                  subscribers&nbsp;&mdash; instantly.
                </p>
              </div>

              <AnimatedStagger className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, label: "Instant exposure", sub: "10K–2M+ viewers" },
                  { icon: <Users className="w-4 h-4" />, label: "Targeted audiences", sub: "Match your niche" },
                  { icon: <TrendingUp className="w-4 h-4" />, label: "Measurable growth", sub: "Track new subs" },
                  { icon: <CreditCard className="w-4 h-4" />, label: "Simple pricing", sub: "No hidden fees" },
                ].map((item) => (
                  <AnimatedItem key={item.label}>
                    <div className="border border-border p-5">
                      <div className="text-accent mb-3">{item.icon}</div>
                      <p className="font-medium text-text-primary text-sm mb-1">{item.label}</p>
                      <p className="text-xs text-text-muted">{item.sub}</p>
                    </div>
                  </AnimatedItem>
                ))}
              </AnimatedStagger>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── PROBLEM ───── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">The challenge</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-8">
                You&apos;re creating great content.{" "}
                <span className="text-text-muted">
                  But without distribution, growth is painfully slow.
                </span>
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-4 mt-4">
            <AnimatedItem>
              <div className="border border-border p-6 h-full">
                <p className="text-text-secondary leading-relaxed mb-4">
                  You post consistently, optimize thumbnails, study analytics&nbsp;&mdash; and
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
              <div className="border border-border border-accent/30 p-6 h-full">
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
                  DMs go unanswered. There was no way in&nbsp;&mdash;{" "}
                  <span className="text-accent font-medium">until now.</span>
                </p>
              </div>
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── SOLUTION ───── */}
      <section className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="grid md:grid-cols-5 gap-12 items-start">
              <div className="md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                  The solution
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-6">
                  A marketplace where exposure has a price tag
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  COMARI. is building a marketplace where you can browse creators offering guest spots on
                  their channels. See their audience size, niche, and rates. Book directly.
                  Coordinate through our platform. Get in front of thousands&nbsp;&mdash; or
                  millions&nbsp;&mdash; of potential subscribers.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  For established creators, it&apos;s a way to monetize the collaboration
                  requests you&apos;re already getting. Set your price, accept bookings on
                  your schedule, and get paid to feature rising talent.
                </p>
              </div>

              <div className="md:col-span-2 space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="border border-border p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
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
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="border border-border p-5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
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
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
                Book a guest spot in three steps
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-3 gap-px bg-border">
            {[
              { num: "01", title: "Find a creator", desc: "Browse by niche, audience size, and price. Filter for creators whose audience matches the subscribers you want." },
              { num: "02", title: "Book & coordinate", desc: "Pay the listed rate, then message through the platform to schedule and align on the content format." },
              { num: "03", title: "Get featured, grow", desc: "Your guest spot goes live. Watch your channel grow as new viewers discover your content." },
            ].map((step) => (
              <AnimatedItem key={step.num}>
                <div className="bg-background p-8 h-full">
                  <span className="text-xs font-mono font-bold text-accent tracking-widest">{step.num}</span>
                  <h3 className="text-lg font-semibold text-text-primary mt-3 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>

          <AnimatedSection delay={0.3}>
            <div className="text-center mt-10">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium text-sm transition-colors"
              >
                Read the full story of a COMARI. collaboration
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── GROWTH JOURNEY ───── */}
      <section id="for-creators" className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              Your growth journey
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-4">
              A platform that scales with your channel
            </h2>
            <p className="text-text-secondary mb-16 max-w-2xl">
              Start by buying exposure. As you grow, unlock bigger opportunities.
              Eventually, become a host yourself.
            </p>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-5 top-12 bottom-0 w-px bg-border hidden md:block" />

            <AnimatedStagger className="space-y-16">
              {[
                {
                  num: "1",
                  title: "Start growing",
                  tier: "1K – 10K subs",
                  desc: "You're making content but need more eyeballs. Buy affordable guest spots on channels 5-10x your size.",
                  stats: [
                    { val: "$50–300", label: "per spot" },
                    { val: "10K–200K", label: "host audience" },
                    { val: "100–1K", label: "new subs avg" },
                  ],
                  extra: null,
                },
                {
                  num: "2",
                  title: "Level up",
                  tier: "10K – 500K subs",
                  desc: "Your content is proven. Reach bigger audiences and start building relationships with creators above.",
                  stats: [
                    { val: "$500–2.5K", label: "per spot" },
                    { val: "500K–2M+", label: "host audience" },
                    { val: "2K–20K", label: "new subs avg" },
                  ],
                  extra: "At this stage, you can also start hosting. Accept guest spot requests from smaller creators and earn while you grow.",
                },
                {
                  num: "3",
                  title: "Become a destination",
                  tier: "500K+ subs",
                  desc: "You've built an audience others want access to. Turn collaboration requests into a revenue stream.",
                  stats: [
                    { val: "$200–10K+", label: "your rates" },
                    { val: "80%", label: "you keep" },
                    { val: "$2K–15K", label: "monthly avg" },
                  ],
                  extra: null,
                },
              ].map((stage) => (
                <AnimatedItem key={stage.num}>
                  <div className="relative flex items-start gap-6">
                    <div className="w-10 h-10 border border-border bg-background flex items-center justify-center flex-shrink-0 relative z-10">
                      <span className="text-sm font-bold text-accent font-mono">{stage.num}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-text-primary">
                          {stage.title}
                        </h3>
                        <span className="text-xs text-text-muted bg-surface-raised px-2 py-1 font-mono">
                          {stage.tier}
                        </span>
                      </div>
                      <p className="text-text-secondary mb-6 leading-relaxed max-w-xl">
                        {stage.desc}
                      </p>
                      <div className="border border-border p-5 max-w-md">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {stage.stats.map((s) => (
                            <div key={s.label}>
                              <p className="text-lg font-semibold text-text-primary">{s.val}</p>
                              <p className="text-xs text-text-muted">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {stage.extra && (
                        <div className="mt-4 border-l-2 border-accent pl-4 max-w-md">
                          <p className="text-sm text-text-secondary">
                            <span className="text-accent font-medium">{stage.extra.split(".")[0]}.</span>
                            {stage.extra.substring(stage.extra.indexOf(".") + 1)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedItem>
              ))}
            </AnimatedStagger>
          </div>
        </div>
      </section>

      {/* ───── TRANSPARENCY ───── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              Full transparency
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-4">
              See what other creators gained before you book
            </h2>
            <p className="text-text-secondary mb-16 max-w-2xl">
              Every host profile shows real growth data from past guest spots&nbsp;&mdash;
              measured and compared against each creator&apos;s baseline before the collab.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                {[
                  { icon: <TrendingUp className="w-4 h-4" />, title: "Growth over baseline", desc: "See how much faster creators grew after their guest spot vs. before." },
                  { icon: <Users className="w-4 h-4" />, title: "Net new subscribers", desc: "The additional subscribers gained, above what the creator was already averaging." },
                  { icon: <CheckCircle className="w-4 h-4" />, title: "Completion rate", desc: "See how reliably this host delivers on bookings. No surprises." },
                  { icon: <Star className="w-4 h-4" />, title: "Reviews & ratings", desc: "Read what other creators experienced working with this host before you book." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-border flex items-center justify-center text-accent flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary mb-1 text-sm">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-border">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-xs text-accent font-bold uppercase tracking-widest">
                    Example host profile
                  </p>
                </div>
                <div className="p-5 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent flex items-center justify-center text-sm font-bold text-background">
                      JM
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm">Jake Martinez</p>
                      <p className="text-xs text-text-muted">@jakemartinez &middot; 842K subs</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Tech reviews &amp; tutorials
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-3 font-bold">
                    Avg. growth data
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-muted mb-1">Sub growth</p>
                      <p className="text-lg font-bold text-emerald-500">+312%</p>
                      <p className="text-xs text-text-muted">+2,847 incremental</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">View growth</p>
                      <p className="text-lg font-bold text-emerald-500">+187%</p>
                      <p className="text-xs text-text-muted">+94K incremental</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Completion</p>
                      <p className="text-lg font-bold text-text-primary">100%</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Rating</p>
                      <p className="text-lg font-bold text-text-primary">4.9</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-muted">Guest spot rate</p>
                    <p className="text-lg font-bold text-text-primary">$700</p>
                  </div>
                  <p className="text-xs text-text-muted">23 guest spots</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                Pricing
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-4">
                Transparent, transaction-based
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                No subscriptions. No monthly fees. We only make money when guest spots are
                completed.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-px bg-border max-w-3xl mx-auto">
            {[
              {
                label: "For growing creators",
                price: "$0",
                sub: "buyer fees",
                items: ["Pay exactly the listed price", "No hidden fees at checkout", "Guest spots start as low as $50", "Full refund if host doesn't deliver"],
              },
              {
                label: "For established hosts",
                price: "15%",
                sub: "platform commission",
                items: ["Deducted only on completed bookings", "Set your own prices", "Fast payouts via Stripe", "No contracts or exclusivity"],
              },
            ].map((plan) => (
              <AnimatedItem key={plan.label}>
                <div className="bg-background p-8 h-full">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                    {plan.label}
                  </p>
                  <p className="text-3xl font-bold text-text-primary mb-1">{plan.price}</p>
                  <p className="text-text-secondary mb-6">{plan.sub}</p>
                  <div className="h-px bg-border mb-6" />
                  <ul className="space-y-3">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── QUALITY CONTROL ───── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              For established hosts
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-4">
              Only serious creators can book you
            </h2>
            <p className="text-text-secondary mb-12 max-w-2xl">
              We vet every creator before they can request a guest spot.
            </p>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-3 gap-px bg-border">
            {[
              { title: "Channel verification", desc: "Every creator verifies ownership of their channel before they can book. No fake accounts." },
              { title: "Content review", desc: "We check that bookers have active channels with real content — not empty profiles or spam." },
              { title: "You approve every booking", desc: "See who's requesting before you accept. Review their channel, content style, and audience fit." },
            ].map((item) => (
              <AnimatedItem key={item.title}>
                <div className="bg-background p-6 h-full">
                  <h3 className="font-medium text-text-primary mb-2 text-sm">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── TRUST ───── */}
      <section id="trust" className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                Trust &amp; safety
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
                How we protect both sides
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {[
              { icon: <CheckCircle className="w-4 h-4" />, title: "Verified hosts", desc: "Every host verifies channel ownership. We check subscriber counts, engagement, and content quality." },
              { icon: <CreditCard className="w-4 h-4" />, title: "Payment protection", desc: "Funds are held until the guest spot goes live. Hosts see payment is secured before doing any work." },
              { icon: <MessageSquare className="w-4 h-4" />, title: "Clear deliverables", desc: "Each listing specifies format, duration, and timeline. You know exactly what you\u2019re paying for." },
              { icon: <Star className="w-4 h-4" />, title: "Reviews & ratings", desc: "Both parties leave feedback after each guest spot. Reputation is built through completed bookings." },
              { icon: <TrendingUp className="w-4 h-4" />, title: "Growth tracking", desc: "Track subscriber and view growth after your guest spot to measure real impact." },
            ].map((item) => (
              <AnimatedItem key={item.title}>
                <div className="bg-background p-6 h-full">
                  <div className="w-8 h-8 border border-border flex items-center justify-center text-accent mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-medium text-text-primary mb-2 text-sm">{item.title}</h3>
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
      <section id="faq" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-12">
              Common questions
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible>
              {[
                { value: "what", q: "What's a guest spot?", a: "A guest spot is when you appear on another creator's channel — whether that's a dedicated video featuring you, a segment in their content, a mention with a call-to-action, or a collaboration format. The host promotes you to their audience." },
                { value: "agency", q: "How is this different from a talent agency?", a: "Agencies take 15-20% of all your earnings and require exclusivity. We only take a cut of guest spots booked through our platform. No contracts, no exclusivity, and we never touch your other income." },
                { value: "payments", q: "How do payments work?", a: "When you book, payment is held by COMARI. The host sees the funds are secured and schedules your guest spot. Once both parties confirm completion, funds are released to the host via Stripe." },
                { value: "both", q: "Can I be both a buyer and a host?", a: "Yes. Many mid-tier creators book guest spots on larger channels while also hosting smaller creators on their own channel. It's common to do both." },
                { value: "host-req", q: "What are the requirements to become a host?", a: "Any creator with a YouTube channel can apply to become a host. We review content quality and engagement metrics to ensure a great experience for both hosts and buyers." },
                { value: "refund", q: "What if a host doesn't deliver?", a: "If a host fails to deliver the agreed guest spot, you get a full refund. Hosts who cancel or underdeliver repeatedly are removed from the platform." },
                { value: "launch", q: "When will COMARI. be available?", a: "COMARI. is currently in development. We're working closely with creators to build the best possible experience. Sign up to get notified when we launch." },
              ].map((faq) => (
                <AccordionItem key={faq.value} value={faq.value} className="border-border">
                  <AccordionTrigger className="text-text-primary hover:no-underline text-sm font-medium py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-text-secondary leading-relaxed text-sm">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-24 px-6 bg-surface border-t border-border">
        <div className="max-w-xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-tight mb-4">
              Interested in collaborating?
            </h2>
            <p className="text-text-secondary mb-10">
              We&apos;re currently building COMARI. with input from creators.
              Check out what we&apos;re working on, or reach out if you&apos;d like to be involved.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 bg-text-primary text-background font-medium px-7 py-3.5 transition-opacity hover:opacity-90"
              >
                See the Vision
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-border text-text-primary font-medium px-7 py-3.5 transition-colors hover:bg-surface-raised"
              >
                How It Works
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  );
}
