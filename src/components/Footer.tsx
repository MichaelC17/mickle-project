import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link href="/" className="text-text-primary text-2xl font-bold tracking-tight">
              COLLAB.
            </Link>
            <p className="mt-2 text-sm text-text-muted max-w-xs">
              The marketplace for paid creator collaborations.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-sm font-medium text-text-primary mb-3">Product</p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link href="#how-it-works" className="hover:text-text-secondary transition-colors">How it works</Link></li>
                <li><Link href="#pricing" className="hover:text-text-secondary transition-colors">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-text-secondary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link href="#" className="hover:text-text-secondary transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-text-secondary transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-4 text-sm text-text-muted">
          <p>© {new Date().getFullYear()} COLLAB.</p>
          <p>hello@collab.io</p>
        </div>
      </div>
    </footer>
  );
}
