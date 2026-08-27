import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Updates on COMARI, creator collaborations, and what we're building.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-sm font-medium text-accent tracking-widest uppercase">
              The Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mt-4 leading-tight">
              Blog
            </h1>
            <p className="mt-6 max-w-2xl text-text-secondary text-lg leading-relaxed">
              Updates on COMARI, creator collaborations, and what we&apos;re learning
              as we build the platform.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted">
                No posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {featuredPost && (
                <BlogCard post={featuredPost} featured={true} />
              )}

              {remainingPosts.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mt-12">
                  {remainingPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
