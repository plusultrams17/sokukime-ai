import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { BlogEmailCapture } from "@/components/blog-email-capture";
import { ShareButtons } from "@/components/share-buttons";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";
import { BlogExitPopup } from "@/components/exit-popups/blog-exit-popup";

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
    process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.com";

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
      siteName: "成約コーチ AI",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

/** Tag overlap score for related post ranking */
function getTagOverlap(tagsA: string[], tagsB: string[]): number {
  return tagsA.filter((t) => tagsB.includes(t)).length;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();

  // Related posts: rank by tag overlap, then recency
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ ...p, overlap: getTagOverlap(post.tags, p.tags) }))
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 3);

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.com";
  const articleUrl = `${siteUrl}/blog/${post.slug}`;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${siteUrl}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: { "@id": `${siteUrl}/#organization` },
        publisher: { "@id": `${siteUrl}/#organization` },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteUrl}/blog/${post.slug}`,
        },
        isPartOf: { "@id": `${siteUrl}/#website` },
        keywords: post.tags.join(", "),
        inLanguage: "ja",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/blog/${post.slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "ブログ",
            item: `${siteUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${siteUrl}/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={blogJsonLd} />
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
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent transition hover:bg-accent/20"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>

          {/* Meta + Share */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-card-border pb-6 text-sm text-muted">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <span className="font-medium text-foreground">成約コーチ AI</span>
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
            <ShareButtons url={articleUrl} title={post.title} />
          </div>

          {/* Article Content */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share (bottom) */}
          <div className="mt-10 flex items-center justify-between border-t border-card-border pt-6">
            <span className="text-sm text-muted">この記事が役に立ったら共有してください</span>
            <ShareButtons url={articleUrl} title={post.title} />
          </div>
        </div>
      </article>

      {/* Email Capture */}
      <section className="px-6">
        <div className="mx-auto max-w-3xl">
          <BlogEmailCapture />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center sm:p-12">
            <h2 className="mb-3 text-2xl font-bold">
              この営業テクニックをAIで練習する
            </h2>
            <p className="mb-6 text-muted">
              成約コーチ AIなら、成約メソッドに基づいたAIロープレが無料で体験できます。
              <br className="hidden sm:block" />
              記事で学んだテクニックを実践して、本番で成約できる営業力を身につけましょう。
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/learn"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-8 text-base font-bold text-accent transition hover:bg-accent/10 hover:border-accent/50"
              >
                まず営業の型を学ぶ
              </Link>
              <Link
                href="/roleplay"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
              >
                無料でロープレを始める
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-card-border px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-2xl font-bold">関連記事</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      <BlogExitPopup />
    </div>
  );
}
