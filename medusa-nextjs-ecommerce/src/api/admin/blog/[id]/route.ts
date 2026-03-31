import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../../modules/blog/service"
import { BLOG_MODULE } from "../../../../modules/blog"

/**
 * GET /admin/blog/:id
 * 管理接口 — 获取单篇文章详情
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  const { id } = req.params

  try {
    const post = await blogService.retrieveBlogPost(id)
    res.json({ post })
  } catch {
    res.status(404).json({ message: "Post not found" })
  }
}

/**
 * PUT /admin/blog/:id
 * 管理接口 — 更新文章
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  const { id } = req.params
  const body = req.body as Record<string, unknown>

  // 发布时自动设置 published_at
  if (body.status === "published" && !body.published_at) {
    body.published_at = new Date()
  }

  try {
    const post = await blogService.updateBlogPosts({ id, ...body })
    res.json({ post })
  } catch {
    res.status(404).json({ message: "Post not found" })
  }
}

/**
 * DELETE /admin/blog/:id
 * 管理接口 — 删除文章
 */
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  const { id } = req.params

  try {
    await blogService.deleteBlogPosts(id)
    res.status(200).json({ id, deleted: true })
  } catch {
    res.status(404).json({ message: "Post not found" })
  }
}
