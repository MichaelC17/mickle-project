import Link from "next/link";
import { Twitter, Instagram, Mail } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks = [
  { href: "#", label: "X (Twitter)", icon: Twitter },
  { href: "#", label: "Instagram", icon: Instagram },
  { href: "#", label: "TikTok", icon: TikTokIcon },
] as const;

const productLinks = [
  { href: "/browse", label: "Browse Creators" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const creatorLinks = [
  { href: "/apply", label: "Become a Host" },
  { href: "/dashboard", label: "Creator Dashboard" },
  { href: "#", label: "Success Stories" },
];

const legalLinks = [
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Cookie Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-surface">
      <div className="gradient-divider" />

      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-14 mb-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-text-primary text-2xl font-bold tracking-tight">
                COLLAB<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-text-muted leading-relaxed">
              The marketplace for paid creator collaborations. Grow your channel
              faster.
            </p>
            <p className="mt-3 text-xs text-text-muted/70 leading-relaxed">
              Founded by creators, for creators. We&apos;re building the
              infrastructure for creator-to-creator growth.
            </p>

            <div className="flex items-center gap-3 mt-8">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center text-text-muted hover:text-accent hover:shadow-glow transition-all duration-200"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-sm font-semibold text-text-primary mb-6">
              Product
            </p>
            <ul className="space-y-4 text-sm">
              {productLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Creators */}
          <div>
            <p className="text-sm font-semibold text-text-primary mb-6">
              For Creators
            </p>
            <ul className="space-y-4 text-sm">
              {creatorLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-sm font-semibold text-text-primary mb-6">
              Legal
            </p>
            <ul className="space-y-4 text-sm">
              {legalLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-text-muted hover:text-text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="gradient-divider" />
        <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} COLLAB. All rights reserved.
          </p>
          <a
            href="mailto:hello@collab.io"
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            hello@collab.io
          </a>
        </div>
      </div>
    </footer>
  );
}
