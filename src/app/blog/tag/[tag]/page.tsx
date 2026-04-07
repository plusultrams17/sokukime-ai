import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { getAllTags, getBlogPostsByTag } from "@/lib/blog";

interface Props {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getBlogPostsByTag(tag);

  if (posts.length === 0) {
    return { title: "タグが見つかりません" };
  }

  return {
    title: `「${tag}」の記事一覧`,
    description: `「${tag}」に関する営業ノウハウ記事${posts.length}件。営業ロープレ・クロージング・反論処理など実践的なテクニックを解説。`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}` },
  };
}

export default async function BlogTagPage({ params }: Props) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getBlogPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";
  const allTags = getAllTags();

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
            {
              "@type": "ListItem",
              position: 2,
              name: "ブログ",
              item: `${siteUrl}/blog`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: tag,
              item: `${siteUrl}/blog/tag/${encodeURIComponent(tag)}`,
            },
          ],
        }}
      />
      <Header />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 text-sm text-muted">
            <Link href="/" className="transition hover:text-foreground">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="transition hover:text-foreground">
              ブログ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{tag}</span>
          </nav>

          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            「{tag}」の記事一覧
          </h1>
          <p className="mb-8 text-muted">
            {posts.length}件の記事が見つかりました
          </p>

          {/* Tag cloud */}
          <div className="mb-12 flex flex-wrap gap-2">
            {allTags.map((t) => (
              <Link
                key={t}
                href={`/blog/tag/${encodeURIComponent(t)}`}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  t === tag
                    ? "bg-accent text-white"
                    : "bg-accent/10 text-accent hover:bg-accent/20"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>

          {/* Posts */}
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-card-border bg-card p-6 transition hover:border-accent/50"
              >
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                        t === tag
                          ? "bg-accent text-white"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="mb-2 text-lg font-bold leading-snug transition group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-muted line-clamp-3">
                  {post.description}
                </p>
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

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            記事で学んだらAIで実践練習
          </h2>
          <p className="mb-8 text-muted">
            成約コーチAIなら、AIがリアルなお客さん役を演じてロープレ練習ができます。
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
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
