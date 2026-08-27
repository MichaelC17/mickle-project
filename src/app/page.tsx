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
              Early Access
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text-primary leading-[1.02] font-bold mb-6">
              Book guest spots on bigger channels
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed">
              COMARI is a marketplace where creators pay to appear on larger channels. You pick a host, book a spot, and their audience sees your content.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 mb-20">
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-text-primary text-background font-medium px-7 py-3.5 text-base transition-opacity hover:opacity-90"
              >
                How it works
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 border border-border text-text-primary font-medium px-7 py-3.5 text-base transition-colors hover:bg-surface"
              >
                Browse creators
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
                <p className="text-2xl font-bold text-text-primary mb-1">15%</p>
                <p className="text-xs text-text-muted uppercase tracking-wide">Host cut</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary mb-1">Stripe</p>
                <p className="text-xs text-text-muted uppercase tracking-wide">Payments</p>
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
                  You appear on someone else&apos;s channel
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  A guest spot is any time you show up on another creator&apos;s content. That could be joining their live stream, co-hosting a video, doing a podcast episode together, or getting a dedicated shoutout.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Their audience sees you, some of them check out your channel, and a percentage subscribe. It&apos;s the same thing that happens organically when creators collab, except you can book it directly instead of hoping someone replies to your DM.
                </p>
              </div>

              <AnimatedStagger className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Users className="w-4 h-4" />, label: "Niche matching", sub: "Find creators in your category" },
                  { icon: <CreditCard className="w-4 h-4" />, label: "Listed prices", sub: "See rates before you book" },
                  { icon: <MessageSquare className="w-4 h-4" />, label: "Built-in chat", sub: "Coordinate on the platform" },
                  { icon: <CheckCircle className="w-4 h-4" />, label: "Payment protection", sub: "Funds held until delivery" },
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

      {/* ───── WHY THIS EXISTS ───── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Why this exists</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-8">
                Getting on a bigger channel works.{" "}
                <span className="text-text-muted">
                  Getting the opportunity is the hard part.
                </span>
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-4 mt-4">
            <AnimatedItem>
              <div className="border border-border p-6 h-full">
                <p className="text-text-secondary leading-relaxed mb-4">
                  Most small creators know that collabs work. If you appear in front of 50K people who are into your niche, some of them are going to subscribe. The problem isn&apos;t the strategy.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  The problem is that there&apos;s no reliable way to get those opportunities. You DM creators, leave comments, post in Discord servers. Most of the time, nothing happens.
                </p>
              </div>
            </AnimatedItem>

            <AnimatedItem>
              <div className="border border-border border-accent/30 p-6 h-full">
                <p className="text-text-secondary leading-relaxed mb-4">
                  COMARI makes it straightforward. Hosts list what they offer and what they charge. You browse, pick someone whose audience fits, and book directly. No pitching, no waiting to hear back.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  For hosts, it&apos;s a way to get paid for something they&apos;re already being asked to do. Set a price, accept the bookings you want, and skip the back-and-forth DMs.
                </p>
              </div>
            </AnimatedItem>
          </AnimatedStagger>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
                Three steps
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-3 gap-px bg-border">
            {[
              { num: "01", title: "Browse hosts", desc: "Search by niche, audience size, and price. Each host lists their packages and what's included." },
              { num: "02", title: "Book and coordinate", desc: "Pay through the platform, then use the built-in chat to work out the details: format, date, content." },
              { num: "03", title: "Go live", desc: "The host features you. Once both sides confirm it happened, the host gets paid." },
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
                See the full walkthrough
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ───── EXAMPLE HOST PROFILE ───── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              What you&apos;ll see
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-4">
              Host profiles show you what to expect
            </h2>
            <p className="text-text-secondary mb-16 max-w-2xl">
              Before you book, you can see the host&apos;s audience size, ratings from past guests, what&apos;s included, and the price. No guessing.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                {[
                  { icon: <Users className="w-4 h-4" />, title: "Audience data", desc: "Subscriber count, niche, and content type so you can tell if their audience is a fit." },
                  { icon: <CheckCircle className="w-4 h-4" />, title: "Completion rate", desc: "How often this host actually delivers on bookings." },
                  { icon: <Star className="w-4 h-4" />, title: "Guest reviews", desc: "What other creators thought of the experience." },
                  { icon: <TrendingUp className="w-4 h-4" />, title: "Growth data", desc: "Subscriber and view changes after past guest spots, when available." },
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
                    Example profile
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
                    Example data
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-muted mb-1">Completion</p>
                      <p className="text-lg font-bold text-text-primary">100%</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Avg. rating</p>
                      <p className="text-lg font-bold text-text-primary">4.9</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-muted">Guest spot rate</p>
                    <p className="text-lg font-bold text-text-primary">$700</p>
                  </div>
                  <p className="text-xs text-text-muted">3 packages available</p>
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
                No subscriptions
              </h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                We take a percentage when a guest spot is completed. That&apos;s it.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 gap-px bg-border max-w-3xl mx-auto">
            {[
              {
                label: "Buyers",
                price: "$0",
                sub: "platform fees",
                items: ["You pay the listed price, nothing extra", "Guest spots start around $50", "Full refund if the host doesn't deliver"],
              },
              {
                label: "Hosts",
                price: "15%",
                sub: "per completed booking",
                items: ["Only charged when a booking is finished", "You set your own prices", "Payouts through Stripe", "No contracts, no exclusivity"],
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

      {/* ───── FOR HOSTS ───── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">
              For hosts
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-4">
              You decide who gets on your channel
            </h2>
            <p className="text-text-secondary mb-12 max-w-2xl">
              Every booking request goes through you first. You see the creator&apos;s channel before you accept anything.
            </p>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-3 gap-px bg-border">
            {[
              { title: "Channel verification", desc: "Creators verify ownership of their channel before they can book. No fake accounts." },
              { title: "Content check", desc: "We make sure bookers have active channels with real content, not empty or spam accounts." },
              { title: "You approve every booking", desc: "See who's requesting, check out their channel, and decide if it's a good fit before you accept." },
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
                How payments and delivery work
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {[
              { icon: <CheckCircle className="w-4 h-4" />, title: "Verified hosts", desc: "Hosts connect their YouTube channel to verify ownership. We check that the channel is real and active." },
              { icon: <CreditCard className="w-4 h-4" />, title: "Held payments", desc: "When you book, your payment is held. The host can see it's there but doesn't get paid until the guest spot happens." },
              { icon: <MessageSquare className="w-4 h-4" />, title: "Clear expectations", desc: "Each listing says what's included: format, length, and timeline. You know what you're paying for before checkout." },
              { icon: <Star className="w-4 h-4" />, title: "Reviews", desc: "Both the guest and host leave reviews after a booking. You can read past reviews before you book anyone." },
              { icon: <TrendingUp className="w-4 h-4" />, title: "Growth data", desc: "When available, you can see how past guests' subscriber counts changed after their guest spot." },
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
              Questions
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <Accordion type="single" collapsible>
              {[
                { value: "what", q: "What exactly is a guest spot?", a: "It's when you appear on another creator's channel. Could be a collab video, a live stream appearance, a podcast episode, or a shoutout. The host features you in front of their audience." },
                { value: "agency", q: "How is this different from an agency?", a: "Agencies take a cut of everything you earn and usually want exclusivity. We only take 15% of bookings made through COMARI, and there are no contracts. We don't touch your other income." },
                { value: "payments", q: "How do payments work?", a: "When you book, your payment is held by COMARI. The host can see the payment is secured. Once you both confirm the guest spot happened, the host gets paid through Stripe." },
                { value: "both", q: "Can I buy guest spots and host them?", a: "Yes. A lot of mid-size creators do both. You might buy spots on channels bigger than yours while also hosting smaller creators on your own channel." },
                { value: "host-req", q: "What do I need to become a host?", a: "A YouTube channel. You connect it during signup so we can verify it's real. We look at whether the channel is active and has genuine content." },
                { value: "refund", q: "What if the host doesn't follow through?", a: "You get a full refund. If a host repeatedly cancels or doesn't deliver, we remove them from the platform." },
                { value: "launch", q: "Is COMARI live yet?", a: "We're still building. The platform is functional but we're in early access, talking to creators and getting feedback before a wider launch." },
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
              Want to try it?
            </h2>
            <p className="text-text-secondary mb-10">
              COMARI is in early access. You can look around, or reach out if you&apos;re
              interested in being one of the first hosts or guests.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/browse"
                className="inline-flex items-center justify-center gap-2 bg-text-primary text-background font-medium px-7 py-3.5 transition-opacity hover:opacity-90"
              >
                Browse creators
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-border text-text-primary font-medium px-7 py-3.5 transition-colors hover:bg-surface-raised"
              >
                How it works
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  );
}
