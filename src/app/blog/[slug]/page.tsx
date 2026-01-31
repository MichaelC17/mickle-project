import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />

      <article className="min-h-screen pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-charcoal/60 hover:text-rust transition-colors mb-12"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to all posts
          </Link>

          {/* Post Header */}
          <header className="mb-12">
            <span className="text-sm font-medium text-sepia uppercase tracking-widest">
              {post.category}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ink mt-4 leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-charcoal/70 leading-relaxed">
              {post.description}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-charcoal/50">
              <span>{formattedDate}</span>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-charcoal/5 rounded-full text-charcoal/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Divider */}
          <div className="w-16 h-px bg-sepia/30 mb-12" />

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={post.content} />
          </div>

          {/* Post Footer */}
          <footer className="mt-16 pt-8 border-t border-charcoal/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-charcoal/50">Written by</p>
                <p className="font-serif font-semibold text-ink">Michael Cai</p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-rust transition-colors"
              >
                More posts
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </footer>
        </div>
      </article>

      <Footer />
    </>
  );
}
