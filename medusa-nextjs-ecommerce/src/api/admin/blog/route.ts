import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"

/**
 * GET /admin/blog
 * 管理接口 — 获取所有博客文章（含草稿）
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const { status, locale, limit: rawLimit, offset: rawOffset } = req.query

  const limit = Math.min(Number(rawLimit) || 20, 100)
  const offset = Number(rawOffset) || 0

  const filters: Record<string, unknown> = {}
  if (status && typeof status === "string") {
    filters.status = status
  }
  if (locale && typeof locale === "string") {
    filters.locale = locale
  }

  const [posts, count] = await blogService.listAndCountBlogPosts(
    filters,
    {
      order: { created_at: "DESC" },
      take: limit,
      skip: offset,
    }
  )

  res.json({ posts, count, limit, offset })
}

/**
 * POST /admin/blog
 * 管理接口 — 创建新博客文章
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

  const body = req.body as Record<string, unknown>

  // 自动生成 slug（如果未提供）
  if (!body.slug && typeof body.title === "string") {
    body.slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 100)
      + "-" + Date.now().toString(36)
  }

  // 发布时自动设置 published_at
  if (body.status === "published" && !body.published_at) {
    body.published_at = new Date()
  }

  const post = await blogService.createBlogPosts(body)

  res.status(201).json({ post })
}
