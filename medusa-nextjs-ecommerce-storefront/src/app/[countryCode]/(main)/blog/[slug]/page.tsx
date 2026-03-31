import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPost } from "@lib/data/blog"
import { getT, getLocaleFromCountry } from "@lib/util/i18n"
import LatestPosts from "@modules/blog/components/latest-posts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import JsonLd from "@modules/common/components/json-ld"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return { title: "Post Not Found | DLL" }
  }

  return {
    title: `${post.title} | DLL Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { countryCode, slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const t = await getT(countryCode)
  const locale = getLocaleFromCountry(countryCode)

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(
        locale === "zh" ? "zh-CN" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : null

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.cover_image || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || undefined,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "DLL",
    },
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />

      <article className="content-container py-16 small:py-24">
        <div className="max-w-3xl mx-auto">
          {/* 返回链接 */}
          <LocalizedClientLink
            href="/blog"
            className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
          >
            ← {t("blog.back_to_blog")}
          </LocalizedClientLink>

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs uppercase tracking-wider font-medium text-[#C17A2A] bg-[#C17A2A]/10 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 标题 */}
          <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-4 leading-tight">
            {post.title}
          </h1>

          {/* 元信息 */}
          <div className="flex items-center gap-4 mt-4 text-sm text-dll-foreground-secondary">
            {post.author && <span>{post.author}</span>}
            {post.author && formattedDate && <span>·</span>}
            {formattedDate && <span>{formattedDate}</span>}
          </div>

          {/* 封面图 */}
          {post.cover_image && (
            <div className="mt-8 rounded-2xl overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* 文章内容 */}
          <div
            className="mt-10 prose prose-lg max-w-none text-dll-foreground-secondary
              prose-headings:text-dll-foreground prose-headings:font-semibold
              prose-a:text-[#C17A2A] prose-a:underline prose-a:underline-offset-4
              prose-strong:text-dll-foreground
              prose-img:rounded-xl
              prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* 相关文章 */}
      <LatestPosts
        limit={3}
        locale={locale}
        title={t("blog.related_posts")}
        subtitle={t("blog.subtitle")}
        readMoreLabel={t("blog.read_more")}
        viewAllLabel={t("blog.view_all")}
      />
    </>
  )
}
