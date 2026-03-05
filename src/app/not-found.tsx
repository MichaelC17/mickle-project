import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <span className="text-sm font-medium text-accent tracking-widest uppercase">
            Error 404
          </span>
          <h1 className="font-display text-6xl md:text-8xl font-semibold text-text-primary mt-4">
            Page not found
          </h1>
          <p className="mt-6 text-text-secondary max-w-md mx-auto">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-medium hover:bg-accent-hover transition-colors"
            >
              Go home
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 border-2 border-accent text-accent px-6 py-3 rounded-full font-medium hover:bg-accent hover:text-white transition-colors"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
