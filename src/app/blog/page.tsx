import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "営業ノウハウブログ",
  description:
    "成約メソッド、AIロープレ活用法、クロージングテクニックなど、営業力を鍛えるための実践的なノウハウを発信。",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Title Section */}
      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            営業ノウハウブログ
          </h1>
          <p className="text-lg text-muted">
            成約メソッドやAI活用法など、営業力を鍛えるための実践的なノウハウを発信しています。
          </p>
        </div>
      </section>

      {/* Blog Post Cards */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-card-border bg-card p-6 transition hover:border-accent/50"
              >
                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="mb-2 text-lg font-bold leading-snug transition group-hover:text-accent">
                  {post.title}
                </h2>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-muted line-clamp-3">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>{post.readingTime}分で読める</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-card-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            成約コーチ AIで営業力を鍛えよう
          </h2>
          <p className="mb-8 text-muted">
            記事で学んだテクニックを、AIロープレで実践練習。
            <br />
            無料アカウントで今すぐ始められます。
          </p>
          <Link
            href="/roleplay"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-10 text-lg font-bold text-white transition hover:bg-accent-hover"
          >
            無料でロープレを始める
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
