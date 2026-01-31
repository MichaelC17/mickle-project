import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPostMeta;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-charcoal rounded-2xl p-10 hover:bg-charcoal/90 transition-all duration-300"
      >
        <span className="text-xs font-medium text-sepia uppercase tracking-widest">
          {post.category}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream mt-4 group-hover:text-rust transition-colors">
          {post.title}
        </h2>
        <p className="mt-4 text-cream/60 leading-relaxed text-lg">
          {post.description}
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm text-cream/40">
          <span>{formattedDate}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-charcoal/5"
    >
      <span className="text-xs font-medium text-sepia uppercase tracking-widest">
        {post.category}
      </span>
      <h3 className="font-serif text-xl font-semibold text-ink mt-2 group-hover:text-rust transition-colors">
        {post.title}
      </h3>
      <p className="mt-2 text-charcoal/60 text-sm leading-relaxed line-clamp-2">
        {post.description}
      </p>
      <div className="mt-4 flex items-center gap-3 text-xs text-charcoal/40">
        <span>{formattedDate}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
    </Link>
  );
}
