import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { BlogPost } from "@lib/data/blog"

type BlogPostCardProps = {
  post: BlogPost
  readMoreLabel?: string
}

/**
 * 博客文章卡片 — 可在任意页面引入
 */
export default function BlogPostCard({
  post,
  readMoreLabel = "Read More",
}: BlogPostCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-dll-foreground/5 hover:border-dll-foreground/15 transition-all duration-300">
      {/* 封面图 */}
      {post.cover_image && (
        <LocalizedClientLink href={`/blog/${post.slug}`}>
          <div className="aspect-[16/9] overflow-hidden bg-dll-bg-secondary">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </LocalizedClientLink>
      )}

      {/* 内容区 */}
      <div className="flex flex-col flex-1 p-5 small:p-6">
        {/* 标签 + 日期 */}
        <div className="flex items-center gap-3 text-xs text-dll-foreground-secondary mb-3">
          {post.tags && post.tags.length > 0 && (
            <span className="uppercase tracking-wider font-medium text-[#C17A2A]">
              {post.tags[0]}
            </span>
          )}
          {formattedDate && <span>{formattedDate}</span>}
        </div>

        {/* 标题 */}
        <LocalizedClientLink href={`/blog/${post.slug}`}>
          <h3 className="text-base small:text-lg font-semibold text-dll-foreground leading-snug group-hover:text-[#C17A2A] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </LocalizedClientLink>

        {/* 摘要 */}
        {post.excerpt && (
          <p className="mt-2 text-sm text-dll-foreground-secondary leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* 底部 */}
        <div className="mt-4 flex items-center justify-between">
          {post.author && (
            <span className="text-xs text-dll-foreground-secondary">
              {post.author}
            </span>
          )}
          <LocalizedClientLink
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-dll-foreground hover:text-[#C17A2A] transition-colors ml-auto"
          >
            {readMoreLabel} →
          </LocalizedClientLink>
        </div>
      </div>
    </article>
  )
}
