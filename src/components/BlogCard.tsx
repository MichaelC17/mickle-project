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
        className="group block bg-surface border border-border p-10 hover:bg-surface-raised transition-colors"
      >
        <span className="text-xs font-bold text-accent uppercase tracking-widest">
          {post.category}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mt-4 group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        <p className="mt-4 text-text-secondary leading-relaxed text-lg">
          {post.description}
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm text-text-muted">
          <span>{formattedDate}</span>
          <span>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-surface border border-border p-6 hover:bg-surface-raised transition-colors"
    >
      <span className="text-xs font-bold text-accent uppercase tracking-widest">
        {post.category}
      </span>
      <h3 className="text-xl font-semibold text-text-primary mt-2 group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      <p className="mt-2 text-text-secondary text-sm leading-relaxed line-clamp-2">
        {post.description}
      </p>
      <div className="mt-4 flex items-center gap-3 text-xs text-text-muted">
        <span>{formattedDate}</span>
        <span>&middot;</span>
        <span>{post.readingTime}</span>
      </div>
    </Link>
  );
}
