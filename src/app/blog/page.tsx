import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on technology, development, design, and the creative process.",
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
          {/* Page Header */}
          <div className="mb-16">
            <span className="text-sm font-medium text-sepia tracking-widest uppercase">
              The Blog
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ink mt-4 leading-tight">
              Thoughts, stories, and ideas.
            </h1>
            <p className="mt-6 max-w-2xl text-charcoal/70 text-lg leading-relaxed">
              Exploring the intersection of technology and design. Writing about
              development, creativity, and the things I learn along the way.
            </p>
          </div>

          {/* Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-charcoal/60">
                No posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured Post */}
              {featuredPost && (
                <BlogCard post={featuredPost} featured={true} />
              )}

              {/* Remaining Posts */}
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
