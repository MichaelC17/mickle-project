import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-text-muted mb-4 fade-in">
            Currently in private beta
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-text-primary leading-tight tracking-tight fade-in delay-1">
            Buy guest spots on
            <br />
            bigger creator channels
          </h1>
          <p className="mt-6 text-lg text-text-secondary max-w-xl mx-auto fade-in delay-2">
            The fastest way to grow your channel. Book appearances on verified creators 
            across platforms, get in front of their audience, and convert their viewers into your subscribers.
          </p>
          
          {/* Platform logos */}
          <div className="mt-8 flex items-center justify-center gap-6 fade-in delay-3">
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-sm">YouTube</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <defs>
                  <linearGradient id="tiktok-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#69C9D0"/>
                    <stop offset="50%" stopColor="#EE1D52"/>
                    <stop offset="100%" stopColor="#EE1D52"/>
                  </linearGradient>
                </defs>
                <path fill="url(#tiktok-gradient)" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              <span className="text-sm">TikTok</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <defs>
                  <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFDC80"/>
                    <stop offset="25%" stopColor="#F77737"/>
                    <stop offset="50%" stopColor="#E1306C"/>
                    <stop offset="75%" stopColor="#C13584"/>
                    <stop offset="100%" stopColor="#833AB4"/>
                  </linearGradient>
                </defs>
                <path fill="url(#ig-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              <span className="text-sm">Instagram</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
              <span className="text-sm">Twitch</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 fade-in delay-4">
            <Link
              href="#waitlist"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
            >
              Request early access
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center bg-surface-raised hover:bg-surface border border-border text-text-primary text-sm font-medium px-5 py-2.5 rounded-md transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">The problem</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Growing a channel from scratch is brutal
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            You&apos;re making good content, but the algorithm doesn&apos;t care. Without an existing audience, 
            your videos get buried. You post consistently, optimize thumbnails, study analytics—and still 
            grow at a crawl. The math is simple: without distribution, quality doesn&apos;t matter.
          </p>
          <p className="text-text-secondary leading-relaxed mb-6">
            The honest truth? There are only two ways out: grind for years and hope the algorithm 
            eventually favors you, or get lucky with a viral moment. That&apos;s it. Most creators 
            burn out before either happens.
          </p>
          <p className="text-text-secondary leading-relaxed">
            <span className="text-text-primary font-medium">But there&apos;s one exception.</span> The creators 
            who skip the line? They get featured on a bigger channel. One guest spot in front of the 
            right audience can do more than a year of grinding. The problem is, those opportunities 
            don&apos;t exist for most people. DMs go unanswered. There&apos;s no way in—until now.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">The solution</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            A marketplace where exposure has a price tag
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            CollabBook lets you browse creators who are actively selling guest spots on their channels. 
            See their audience size, niche, and rates. Book instantly. Coordinate through our platform. 
            Get in front of thousands—or millions—of potential subscribers.
          </p>
          <p className="text-text-secondary leading-relaxed">
            For larger creators, it&apos;s a way to monetize the DMs you&apos;re already ignoring. 
            Set your price, accept bookings on your schedule, and get paid to feature rising talent.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">How it works</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-12">
            Book a guest spot in three steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-medium text-accent mb-3">01</div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Find a creator</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Browse by niche, audience size, and price. Filter for creators 
                whose audience matches the subscribers you want.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-accent mb-3">02</div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Book and coordinate</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Pay the listed rate, then message through the platform to 
                schedule and align on the content format.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-accent mb-3">03</div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Get featured, grow</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Your guest spot goes live. Track views, click-throughs, and 
                new subscribers directly in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Journey */}
      <section id="for-creators" className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">Your growth journey</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            A platform that scales with your channel
          </h2>
          <p className="text-text-secondary mb-16 max-w-2xl">
            Start by buying exposure. As you grow, unlock bigger opportunities. 
            Eventually, become a host yourself.
          </p>

          {/* Stage 1: Getting Started */}
          <div className="relative">
            {/* Vertical line connector */}
            <div className="absolute left-6 top-12 bottom-0 w-px bg-border hidden md:block" />

            {/* Stage 1 */}
            <div className="relative mb-16">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                  <span className="text-sm font-semibold text-emerald-500">1</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-text-primary">Start growing</h3>
                    <span className="text-xs text-text-muted bg-surface-raised px-2 py-1 rounded">1K – 50K subs</span>
                  </div>
                  <p className="text-text-secondary mb-6 leading-relaxed max-w-xl">
                    You&apos;re making content but need more eyeballs. Buy affordable guest spots on 
                    channels 5-10x your size to get in front of audiences who&apos;ll actually subscribe.
                  </p>
                  
                  <div className="bg-background border border-border rounded-lg p-5 max-w-md">
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
            </div>

            {/* Stage 2 */}
            <div className="relative mb-16">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 relative z-10">
                  <span className="text-sm font-semibold text-accent">2</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-text-primary">Level up</h3>
                    <span className="text-xs text-text-muted bg-surface-raised px-2 py-1 rounded">50K – 500K subs</span>
                  </div>
                  <p className="text-text-secondary mb-6 leading-relaxed max-w-xl">
                    Your content is proven. Now it&apos;s about reaching bigger audiences and building 
                    relationships with creators at your level or above. Network with mid-tier and 
                    top-tier creators who can accelerate your path to the next milestone.
                  </p>
                  
                  <div className="bg-background border border-border rounded-lg p-5 max-w-md">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-text-primary">$500–2.5K</p>
                        <p className="text-xs text-text-muted">per guest spot</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-text-primary">500K–2M+</p>
                        <p className="text-xs text-text-muted">host audience</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-text-primary">2K–20K</p>
                        <p className="text-xs text-text-muted">new subs avg</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-accent/5 border border-accent/10 rounded-lg max-w-md">
                    <p className="text-sm text-text-secondary">
                      <span className="text-accent font-medium">At this stage, you can also start hosting.</span> 
                      {" "}Accept guest spot requests from smaller creators and earn while you grow.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="relative">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                  <span className="text-sm font-semibold text-violet-500">3</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-text-primary">Become a destination</h3>
                    <span className="text-xs text-text-muted bg-surface-raised px-2 py-1 rounded">500K+ subs</span>
                  </div>
                  <p className="text-text-secondary mb-6 leading-relaxed max-w-xl">
                    You&apos;ve built an audience others want access to. Turn the collaboration requests 
                    you&apos;re already getting into a revenue stream. Set your rates, accept bookings 
                    on your schedule, and help the next generation grow.
                  </p>
                  
                  <div className="bg-background border border-border rounded-lg p-5 max-w-md">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold text-text-primary">$200–10K+</p>
                        <p className="text-xs text-text-muted">your rates</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-text-primary">20%</p>
                        <p className="text-xs text-text-muted">platform fee</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-text-primary">$2K–15K</p>
                        <p className="text-xs text-text-muted">monthly avg</p>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2 text-sm text-text-secondary max-w-md">
                    <li className="flex items-start gap-2">
                      <span className="text-violet-500 mt-0.5">→</span>
                      No exclusivity or long-term contracts
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-500 mt-0.5">→</span>
                      Accept or decline any booking—you&apos;re in control
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-violet-500 mt-0.5">→</span>
                      We only take a cut when you get paid
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency / Pre-booking Stats */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">Full transparency</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            See what other creators gained before you book
          </h2>
          <p className="text-text-secondary mb-12 max-w-2xl">
            Every host profile shows real growth data from past guest spots—measured over 90 days 
            and compared against each creator&apos;s baseline before the collab.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* What you see */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-text-muted flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">Growth over baseline</h3>
                  <p className="text-sm text-text-secondary">See how much faster creators grew in the 90 days after their guest spot vs. the 90 days before.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-text-muted flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">Net new subscribers</h3>
                  <p className="text-sm text-text-secondary">The additional subscribers gained over 90 days, above what the creator was already averaging.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-text-muted flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">Cost per incremental sub</h3>
                  <p className="text-sm text-text-secondary">What you actually paid for each subscriber above baseline—the true ROI metric.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-text-muted flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">Completion rate</h3>
                  <p className="text-sm text-text-secondary">See how reliably this host delivers on bookings. No surprises.</p>
                </div>
              </div>
            </div>

            {/* Mock host profile card */}
            <div className="bg-surface-raised border border-border rounded-lg overflow-hidden">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-lg font-medium text-text-primary">
                    JM
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Jake Martinez</p>
                    <p className="text-sm text-text-muted">@jakemartinez · 842K subs</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">Tech reviews & tutorials</p>
              </div>
              
              <div className="p-5 bg-background/50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-text-muted uppercase tracking-wide">Avg. growth over 90 days</p>
                  <p className="text-xs text-text-muted">vs. pre-collab baseline</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Sub growth vs baseline</p>
                    <p className="text-lg font-semibold text-emerald-500">+312%</p>
                    <p className="text-xs text-text-muted">+2,847 incremental subs</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">View growth vs baseline</p>
                    <p className="text-lg font-semibold text-emerald-500">+187%</p>
                    <p className="text-xs text-text-muted">+94K incremental views</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Cost per incremental sub</p>
                    <p className="text-lg font-semibold text-text-primary">$0.25</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Completion rate</p>
                    <p className="text-lg font-semibold text-text-primary">100%</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Guest spot rate</p>
                  <p className="text-lg font-semibold text-text-primary">$700</p>
                </div>
                <div className="text-xs text-text-muted">
                  Based on 23 guest spots
                </div>
              </div>
            </div>
          </div>

          <p className="mt-10 text-sm text-text-muted">
            All growth is measured over 90 days post-collab, compared against each creator&apos;s 90-day baseline before booking.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">Pricing</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Transparent, transaction-based
          </h2>
          <p className="text-text-secondary mb-12 max-w-xl">
            No subscriptions. No monthly fees. We only make money when guest spots are booked.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            <div className="bg-surface border border-border rounded-lg p-6">
              <p className="text-sm text-text-muted mb-1">Booking a guest spot</p>
              <p className="text-2xl font-semibold text-text-primary mb-3">No platform fees</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Pay exactly the price listed by the host. Nothing extra at checkout. 
                Guest spots start as low as $50.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
              <p className="text-sm text-text-muted mb-1">Hosting guest spots</p>
              <p className="text-2xl font-semibold text-text-primary mb-3">20% platform fee</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Deducted from your payout after the guest spot is delivered and confirmed. 
                Set your own prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Hosts: Quality Control */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">For hosts</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Only serious creators can book you
          </h2>
          <p className="text-text-secondary mb-10 max-w-2xl">
            We vet every creator before they can request a guest spot. You won&apos;t waste time 
            on channels that aren&apos;t real or creators who aren&apos;t committed to growth.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm text-text-muted">YouTube</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary">1K+</p>
              <p className="text-xs text-text-muted">minimum subscribers</p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <defs>
                    <linearGradient id="tiktok-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#69C9D0"/>
                      <stop offset="100%" stopColor="#EE1D52"/>
                    </linearGradient>
                  </defs>
                  <path fill="url(#tiktok-gradient-2)" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="text-sm text-text-muted">TikTok</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary">5K+</p>
              <p className="text-xs text-text-muted">minimum followers</p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <defs>
                    <linearGradient id="ig-gradient-2" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFDC80"/>
                      <stop offset="50%" stopColor="#E1306C"/>
                      <stop offset="100%" stopColor="#833AB4"/>
                    </linearGradient>
                  </defs>
                  <path fill="url(#ig-gradient-2)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                <span className="text-sm text-text-muted">Instagram</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary">1K+</p>
              <p className="text-xs text-text-muted">minimum followers</p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
                <span className="text-sm text-text-muted">Twitch</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary">250+</p>
              <p className="text-xs text-text-muted">minimum followers</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-text-primary mb-2">Channel verification</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every creator verifies ownership of their channel before they can book. No fake accounts, no impersonators.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">Content review</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We check that bookers have active channels with real content—not empty profiles or spam accounts.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">You approve every booking</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                See who&apos;s requesting before you accept. Review their channel, content style, and audience fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="py-20 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">Trust & safety</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-12">
            How we protect both sides
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-text-primary mb-2">Verified hosts</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every host creator verifies channel ownership. We check subscriber counts, 
                engagement, and content quality before approval.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">Payment protection</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Funds are held until the guest spot goes live. Hosts see payment is secured 
                before doing any work.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">Clear deliverables</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Each listing specifies format, duration, and timeline. You know exactly 
                what you&apos;re paying for.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">Ratings</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Both parties leave feedback after each guest spot. Reputation is built 
                through completed bookings.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">Dispute resolution</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                If something goes wrong, our team reviews the situation and mediates 
                a fair outcome.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">Performance tracking</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                See views, engagement, and subscriber impact after your guest spot 
                goes live. Measure your ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-text-muted uppercase tracking-wide mb-3">FAQ</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-12">
            Common questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="font-medium text-text-primary mb-2">
                What&apos;s a guest spot?
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                A guest spot is when you appear on another creator&apos;s channel—whether that&apos;s 
                a dedicated video featuring you, a segment in their content, a mention with a 
                call-to-action, or a collaboration format. The host promotes you to their audience.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">
                How is this different from a talent agency?
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Agencies take 15-20% of all your earnings and require exclusivity. 
                We only take a cut of guest spots booked through our platform. 
                No contracts, no exclusivity, and we never touch your other income.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">
                How do payments work?
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                When you book, payment is held by CollabBook. The host sees the funds are 
                secured and schedules your guest spot. Once it goes live and is confirmed, 
                funds are released within 3 business days.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">
                Can I be both a buyer and a host?
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Yes. Many mid-tier creators book guest spots on larger channels while also 
                hosting smaller creators on their own channel. It&apos;s common to do both.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">
                What are the requirements to become a host?
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Currently, we require at least 50K subscribers on YouTube, 50K followers on TikTok or Instagram, 
                or equivalent on Twitch. We also review content quality and engagement metrics.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">
                What if a host doesn&apos;t deliver?
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                If a host fails to deliver the agreed guest spot, you get a full refund. 
                Hosts who cancel or underdeliver repeatedly are removed from the platform.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-text-primary mb-2">
                When is CollabBook launching?
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We&apos;re in private beta. Join the waitlist to get early access—we&apos;re 
                adding new users gradually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="waitlist" className="py-20 px-6 bg-surface">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Ready to grow faster?
          </h2>
          <p className="text-text-secondary mb-8">
            Join the waitlist to get early access. Whether you want to buy guest spots 
            or sell them, we&apos;ll notify you when we&apos;re ready.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 bg-surface-raised border border-border rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors whitespace-nowrap"
            >
              Join waitlist
            </button>
          </form>

          <div className="mt-6 flex justify-center gap-6 text-sm text-text-muted">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="interest" className="accent-accent" defaultChecked />
              I want to buy guest spots
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="interest" className="accent-accent" />
              I want to host
            </label>
          </div>

          <p className="mt-6 text-xs text-text-muted">
            We&apos;ll email you when it&apos;s your turn. No spam.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
