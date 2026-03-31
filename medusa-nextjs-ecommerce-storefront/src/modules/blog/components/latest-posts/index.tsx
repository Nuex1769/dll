import { listBlogPosts } from "@lib/data/blog"
import BlogPostCard from "@modules/blog/components/blog-post-card"

type LatestPostsProps = {
  /** 展示数量，默认 3 */
  limit?: number
  /** 按语言筛选 */
  locale?: string
  /** 按标签筛选 */
  tag?: string
  /** 区域标题 */
  title?: string
  /** 区域副标题 */
  subtitle?: string
  /** "阅读更多" 按钮文案 */
  readMoreLabel?: string
  /** 查看全部链接文案 */
  viewAllLabel?: string
  /** 是否显示标题区域 */
  showHeader?: boolean
}

/**
 * 可复用的最新文章组件 — 可引入到任意页面
 *
 * @example
 * // 首页展示 3 篇最新文章
 * <LatestPosts limit={3} title="Latest from Our Blog" />
 *
 * // 产品页展示相关文章
 * <LatestPosts tag="safety" limit={2} title="Related Articles" />
 *
 * // 仅展示中文文章
 * <LatestPosts locale="zh" limit={4} />
 */
export default async function LatestPosts({
  limit = 3,
  locale,
  tag,
  title = "Latest from Our Blog",
  subtitle = "Stories",
  readMoreLabel = "Read More",
  viewAllLabel = "View All Posts",
  showHeader = true,
}: LatestPostsProps) {
  const { posts } = await listBlogPosts({ locale, tag, limit })

  // 没有文章时不渲染
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="content-container py-16 small:py-24">
      {showHeader && (
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            {subtitle}
          </span>
          <h2 className="text-2xl small:text-4xl font-bold text-dll-foreground mt-3">
            {title}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            readMoreLabel={readMoreLabel}
          />
        ))}
      </div>

      {showHeader && (
        <div className="text-center mt-10">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-dll-foreground hover:text-[#C17A2A] transition-colors"
          >
            {viewAllLabel} →
          </a>
        </div>
      )}
    </section>
  )
}
