import { Metadata } from "next"
import { getT, getLocaleFromCountry } from "@lib/util/i18n"
import { listBlogPosts } from "@lib/data/blog"
import BlogPostCard from "@modules/blog/components/blog-post-card"

export const metadata: Metadata = {
  title: "Blog | DLL",
  description:
    "Cycling safety tips, product updates, and riding stories from the DLL team.",
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const t = await getT(countryCode)
  const locale = getLocaleFromCountry(countryCode)

  const { posts } = await listBlogPosts({
    locale,
    limit: 12,
  })

  return (
    <div className="content-container py-16 small:py-24">
      {/* Hero */}
      <div className="text-center mb-16">
        <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
          {t("blog.subtitle")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("blog.title")}
        </h1>
        <p className="mt-4 text-sm small:text-base text-dll-foreground-secondary max-w-xl mx-auto">
          {t("blog.description")}
        </p>
      </div>

      {/* 文章网格 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard
              key={post.id}
              post={post}
              readMoreLabel={t("blog.read_more")}
            />
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="text-center">
          <div className="rounded-2xl bg-dll-bg-secondary p-12 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-dll-foreground/10 flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8 text-dll-foreground/40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-2">
              {t("blog.no_posts")}
            </h2>
            <p className="text-sm text-dll-foreground-secondary">
              {t("blog.no_posts_description")}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
