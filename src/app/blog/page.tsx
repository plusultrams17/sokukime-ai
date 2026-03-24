import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "営業ロープレ・クロージング練習のノウハウ",
  description:
    "営業ロープレの効果的な練習方法、クロージングテクニック、成約率を上げるメソッドを解説。AI活用法から営業研修のコツまで実践的なノウハウを発信。",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${siteUrl}/blog#webpage`,
              name: "営業ノウハウブログ | 成約コーチ AI",
              description:
                "営業ロープレの効果的な練習方法、クロージングテクニック、成約率を上げるメソッドを解説。AI活用法から営業研修のコツまで実践的なノウハウを発信。",
              url: `${siteUrl}/blog`,
              isPartOf: { "@id": `${siteUrl}/#website` },
              inLanguage: "ja",
              mainEntity: {
                "@type": "ItemList",
                itemListElement: posts.map((post, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${siteUrl}/blog/${post.slug}`,
                  name: post.title,
                })),
              },
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${siteUrl}/blog#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "ブログ", item: `${siteUrl}/blog` },
              ],
            },
          ],
        }}
      />
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
          <p className="mx-auto mt-6 max-w-3xl text-sm text-muted leading-relaxed text-left">
            営業ロープレの練習方法、クロージングテクニック、反論処理の切り返しトーク、成約率を上げるメソッドなど、現場で使える営業ノウハウを体系的に解説。AI活用の最新トレンドから、営業心理学に基づく実践的なテクニックまで、あなたの営業力を鍛える記事をお届けします。
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/learn"
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-8 text-base font-bold text-accent transition hover:bg-accent/10 hover:border-accent/50 sm:min-w-[220px]"
            >
              まず営業の型を学ぶ
            </Link>
            <Link
              href="/roleplay"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover sm:min-w-[220px]"
            >
              AIロープレで実践する
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
