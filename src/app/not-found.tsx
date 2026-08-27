import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="text-xs font-bold text-accent tracking-widest uppercase font-mono">
            404
          </span>
          <h1 className="text-6xl md:text-8xl font-bold text-text-primary mt-4">
            Page not found
          </h1>
          <p className="mt-6 text-text-secondary max-w-md mx-auto">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-text-primary text-background px-6 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              Go home
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center justify-center gap-2 border border-border text-text-primary px-6 py-3 font-medium hover:bg-surface transition-colors"
            >
              Browse creators
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
