import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"

/**
 * GET /store/blog
 * 公开接口 — 获取已发布的博客文章列表
 *
 * Query params:
 *   locale  — 按语言筛选 (默认不筛选)
 *   tag     — 按标签筛选
 *   limit   — 每页数量 (默认 10)
 *   offset  — 偏移量 (默认 0)
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const { locale, tag, limit: rawLimit, offset: rawOffset } = req.query

  const limit = Math.min(Number(rawLimit) || 10, 50)
  const offset = Number(rawOffset) || 0

  const filters: Record<string, unknown> = {
    status: "published",
  }

  if (locale && typeof locale === "string") {
    filters.locale = locale
  }

  const [posts, count] = await blogService.listAndCountBlogPosts(
    filters,
    {
      order: { published_at: "DESC" },
      take: limit,
      skip: offset,
    }
  )

  // 按标签过滤（数组字段在 MedusaService 中不支持直接 filter）
  let filtered = posts
  if (tag && typeof tag === "string") {
    filtered = posts.filter(
      (p: any) => Array.isArray(p.tags) && p.tags.includes(tag)
    )
  }

  res.json({
    posts: filtered,
    count: tag ? filtered.length : count,
    limit,
    offset,
  })
}
