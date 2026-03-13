import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "記事が見つかりません" };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://sokukime.ai";

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      locale: "ja_JP",
      siteName: "即キメAI",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://sokukime.ai";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: "即キメAI",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "即キメAI",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={articleJsonLd} />
      <Header />

      {/* Article */}
      <article className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-muted">
            <Link href="/" className="transition hover:text-foreground">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="transition hover:text-foreground">
              ブログ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{post.title}</span>
          </nav>

          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-2">
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
          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-card-border pb-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <span className="font-medium text-foreground">即キメAI</span>
            </div>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" 公開"}
            </time>
            {post.updatedAt && (
              <time dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {" 更新"}
              </time>
            )}
            <span>{post.readingTime}分で読める</span>
          </div>

          {/* Article Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center sm:p-12">
            <h2 className="mb-3 text-2xl font-bold">
              この営業テクニックをAIで練習する
            </h2>
            <p className="mb-6 text-muted">
              即キメAIなら、即決営業メソッドに基づいたAIロープレが無料で体験できます。
              <br className="hidden sm:block" />
              記事で学んだテクニックを実践して、本番で即キメできる営業力を身につけましょう。
            </p>
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
            >
              無料でロープレを始める
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-card-border px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-2xl font-bold">関連記事</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-2xl border border-card-border bg-card p-6 transition hover:border-accent/50"
                >
                  <div className="mb-2 flex flex-wrap gap-2">
                    {related.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mb-2 text-base font-bold leading-snug transition group-hover:text-accent">
                    {related.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
