import Link from "next/link";
import { Mail } from "lucide-react";

const productLinks = [
  { href: "/browse", label: "Browse Creators" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const creatorLinks = [
  { href: "/apply", label: "Become a Host" },
  { href: "/dashboard", label: "Creator Dashboard" },
];

const legalLinks = [
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-text-primary text-xl font-bold tracking-tight uppercase">
                Comari<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-muted leading-relaxed max-w-xs">
              The marketplace for paid creator collaborations.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-text-primary uppercase tracking-wider mb-5">
              Product
            </p>
            <ul className="space-y-3 text-sm">
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

          <div>
            <p className="text-xs font-bold text-text-primary uppercase tracking-wider mb-5">
              For Creators
            </p>
            <ul className="space-y-3 text-sm">
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

          <div>
            <p className="text-xs font-bold text-text-primary uppercase tracking-wider mb-5">
              Legal
            </p>
            <ul className="space-y-3 text-sm">
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

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} COMARI.
          </p>
          <a
            href="mailto:hello@comari.app"
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            hello@comari.app
          </a>
        </div>
      </div>
    </footer>
  );
}
